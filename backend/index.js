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

const JWT_SECRET = process.env.JWT_SECRET || 'MonkalShopSecretKeyForTokens_2025!@#$';
const FRONTEND_URL = "https://monkal-shop-3vo2.vercel.app";

const adapter = new JSONFile('db.json');
const defaultData = { products: [], users: [], orders: [] };
const db = new Low(adapter, defaultData);

(async () => {
    await db.read();
    await db.write();
})();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER || 'abdwwkx2008@gmail.com',
        pass: process.env.GMAIL_PASS || 'nynfgwuajamhjyik'
    }
});

app.get('/products', (req, res) => res.json(db.data.products));
app.get('/products/:id', (req, res) => {
    const product = db.data.products.find(p => p.id === parseInt(req.params.id));
    if (product) res.json(product);
    else res.status(404).json({ message: "Товар не найден" });
});



app.get('/orders', (req, res) => res.json(db.data.orders));
app.post('/orders', async (req, res) => {
    const newOrder = {
        id: (db.data.orders.length > 0 ? Math.max(...db.data.orders.map(o => o.id)) : 0) + 1,
        ...req.body,
        createdAt: new Date().toISOString()
    };
    db.data.orders.push(newOrder);
    await db.write();
    res.status(201).json(newOrder);
});


app.post('/register', async (req, res) => {
    const { email, fullname, password, phone } = req.body;
    if (!email || !fullname || !password || !phone) return res.status(400).json({ message: "Пожалуйста, заполните все поля" });
    const existingUser = db.data.users.find(u => u.email === email);
    if (existingUser && existingUser.isVerified) return res.status(400).json({ message: "Этот e-mail уже занят" });
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const hashedPassword = bcrypt.hashSync(password, 10);
    if (existingUser && !existingUser.isVerified) {
        existingUser.fullname = fullname;
        existingUser.password = hashedPassword;
        existingUser.phone = phone;
        existingUser.verificationCode = verificationCode;
    } else if (!existingUser) {
        const newUser = {
            id: (db.data.users.length > 0 ? Math.max(...db.data.users.map(u => u.id)) : 0) + 1,
            email, fullname, password: hashedPassword, phone,
            isVerified: false, verificationCode
        };
        db.data.users.push(newUser);
    }
    await db.write();
    const mailOptions = { from: process.env.GMAIL_USER || 'abdwwkx2008@gmail.com', to: email, subject: 'Код подтверждения для Monkal', html: `<p>Ваш код для подтверждения регистрации на сайте Monkal:</p><h2>${verificationCode}</h2>` };
    try {
        await transporter.sendMail(mailOptions);
        res.status(201).json({ message: "Код подтверждения отправлен на вашу почту." });
    } catch (error) {
        res.status(500).json({ message: "Не удалось отправить письмо с кодом." });
    }
});

app.post('/verify-email', async (req, res) => {
    const { email, code } = req.body;
    const user = db.data.users.find(u => u.email === email);
    if (!user) return res.status(404).json({ message: "Пользователь не найден." });
    if (user.isVerified) return res.status(400).json({ message: "Аккаунт уже подтвержден." });
    if (user.verificationCode !== code) return res.status(400).json({ message: "Неверный код подтверждения." });
    user.isVerified = true;
    user.verificationCode = undefined;
    await db.write();
    res.status(200).json({ message: "Email успешно подтвержден!" });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.data.users.find(u => u.email === email);
    if (!user || !user.isVerified) return res.status(400).json({ message: "Пользователь не найден или не подтвержден" });
    if (!bcrypt.compareSync(password, user.password)) return res.status(400).json({ message: "Неверный логин или пароль" });
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
    const mailOptions = { from: process.env.GMAIL_USER || 'abdwwkx2008@gmail.com', to: email, subject: 'Сброс пароля для Monkal', html: `<p>Вы запросили сброс пароля. Перейдите по этой ссылке, чтобы установить новый пароль:</p><a href="${resetLink}">${resetLink}</a>` };
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

app.patch('/users/:id/password', async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = parseInt(req.params.id);
    const user = db.data.users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ message: "Пользователь не найден" });
    if (!bcrypt.compareSync(oldPassword, user.password)) return res.status(400).json({ message: "Старый пароль введен неверно" });
    user.password = bcrypt.hashSync(newPassword, 10);
    await db.write();
    res.status(200).json({ message: "Пароль успешно изменен!" });
});

app.patch('/users/:id', async (req, res) => {
    const user = db.data.users.find(u => u.id === parseInt(req.params.id));
    if (user) {
        if (req.body.fullname) user.fullname = req.body.fullname;
        if (req.body.phone) user.phone = req.body.phone;
        await db.write();
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } else {
        res.status(404).json({ message: "Пользователь не найден" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Сервер запущен на порту ${PORT}`));