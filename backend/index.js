const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secret-key-for-jwt-change-it';
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const adapter = new JSONFile('db.json');
const defaultData = { products: [], users: [], orders: [], addresses: [] };
const db = new Low(adapter, defaultData);

(async () => {
    await db.read();

    if (!db.data.products || db.data.products.length === 0) {
        try {
            console.log('База продуктов пуста, засеиваем начальные данные...');
            const seedProducts = require('./db-seed.json');
            db.data.products = seedProducts;
            console.log(`Загружено ${db.data.products.length} товаров.`);
        } catch (error) {
            console.error('Ошибка при загрузке db-seed.json:', error);
        }
    }

    await db.write();
})();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER || 'abdwwkx2008@gmail.com',
        pass: process.env.GMAIL_PASS || 'nynfgwuajamhjyik'
    }
});

const tempUsers = {};

app.get('/products', (req, res) => {
    res.json(db.data.products);
});

app.get('/products/:id', (req, res) => {
    const product = db.data.products.find(p => p.id === parseInt(req.params.id));
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: "Товар не найден" });
    }
});

app.post('/register/start', (req, res) => {
    const { email, fullname, password } = req.body;
    if (db.data.users.find(u => u.email === email)) {
        return res.status(400).json({ message: "Этот e-mail уже занят" });
    }
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = bcrypt.hashSync(password, 10);
    tempUsers[email] = { fullname, password: hashedPassword, code: verificationCode, timestamp: Date.now() };
    const mailOptions = {
        from: process.env.GMAIL_USER || 'abdwwkx2008@gmail.com',
        to: email,
        subject: 'Код подтверждения для Monkal',
        html: `<h1>Добро пожаловать в Monkal!</h1><p>Ваш код для подтверждения регистрации:</p><h2>${verificationCode}</h2>`
    };
    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.error("Ошибка отправки письма:", error);
            return res.status(500).json({ message: "Не удалось отправить письмо" });
        }
        res.status(200).json({ message: "Код подтверждения отправлен на вашу почту" });
    });
});

app.post('/register/verify', async (req, res) => {
    const { email, code } = req.body;
    const tempUser = tempUsers[email];
    if (!tempUser || tempUser.code !== code) return res.status(400).json({ message: "Неверный код подтверждения" });
    if (Date.now() - tempUser.timestamp > 600000) {
        delete tempUsers[email];
        return res.status(400).json({ message: "Время действия кода истекло" });
    }
    const newUser = {
        id: (db.data.users.length > 0 ? Math.max(...db.data.users.map(u => u.id)) : 0) + 1,
        email, fullname: tempUser.fullname, password: tempUser.password
    };
    db.data.users.push(newUser);
    await db.write();
    delete tempUsers[email];
    res.status(201).json({ message: "Регистрация успешно завершена!" });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.data.users.find(u => u.email === email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({ message: "Неверный логин или пароль" });
    }
    const { password: _, ...userWithoutPassword } = user;
    const accessToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ accessToken, user: userWithoutPassword });
});

app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const user = db.data.users.find(u => u.email === email);
    if (!user) return res.status(200).json({ message: "Если такой пользователь существует, мы отправили инструкцию на почту." });
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await db.write();
    const resetLink = `${FRONTEND_URL}/reset-password/${token}`;
    const mailOptions = {
        from: process.env.GMAIL_USER || 'abdwwkx2008@gmail.com',
        to: email,
        subject: 'Сброс пароля для Monkal',
        html: `<p>Вы запросили сброс пароля. Перейдите по этой ссылке, чтобы установить новый пароль:</p><a href="${resetLink}">${resetLink}</a>`
    };
    transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Если такой пользователь существует, мы отправили инструкцию на почту." });
});

app.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const user = db.data.users.find(u => u.resetPasswordToken === token && u.resetPasswordExpires > Date.now());
    if (!user) return res.status(400).json({ message: "Токен недействителен или срок его действия истек" });
    user.password = bcrypt.hashSync(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await db.write();
    res.status(200).json({ message: "Пароль успешно изменен!" });
});

app.get('/addresses', (req, res) => {
    const userId = parseInt(req.query.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "Неверный userId" });
    const userAddresses = db.data.addresses.filter(a => a.userId === userId);
    res.json(userAddresses);
});

app.post('/addresses', async (req, res) => {
    const newAddress = {
        id: (db.data.addresses.length > 0 ? Math.max(...db.data.addresses.map(a => a.id)) : 0) + 1,
        ...req.body
    };
    db.data.addresses.push(newAddress);
    await db.write();
    res.status(201).json(newAddress);
});

app.patch('/addresses/:id', async (req, res) => {
    const address = db.data.addresses.find(a => a.id === parseInt(req.params.id));
    if (address) {
        Object.assign(address, req.body);
        await db.write();
        res.json(address);
    } else {
        res.status(404).json({ message: "Адрес не найден" });
    }
});

app.delete('/addresses/:id', async (req, res) => {
    db.data.addresses = db.data.addresses.filter(a => a.id !== parseInt(req.params.id));
    await db.write();
    res.status(204).send();
});

app.get('/orders', (req, res) => {
    const userId = parseInt(req.query.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "Неверный userId" });
    const userOrders = db.data.orders.filter(o => o.userId === userId);
    res.json(userOrders);
});

app.patch('/users/:id', async (req, res) => {
    const user = db.data.users.find(u => u.id === parseInt(req.params.id));
    if (user) {
        if (req.body.fullname) user.fullname = req.body.fullname;
        if (req.body.phone) user.phone = req.body.phone;
        if (req.body.password) user.password = bcrypt.hashSync(req.body.password, 10);
        await db.write();
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } else {
        res.status(404).json({ message: "Пользователь не найден" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Сервер запущен на порту ${PORT}`));