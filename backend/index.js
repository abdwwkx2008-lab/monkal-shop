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

const JWT_SECRET = 'your-very-secret-key-for-jwt-change-it';
// ПРОВЕРЬТЕ, ЧТО ВЫ ДОБАВИЛИ ЭТУ ПЕРЕМЕННУЮ В НАСТРОЙКАХ RENDER
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// --- НАЧАЛО ИСПРАВЛЕННОГО БЛОКА ---
const adapter = new JSONFile('db.json');

// Данные по умолчанию для новой, пустой базы данных
const defaultData = { products: [], users: [], orders: [], addresses: [] };

// Передаем defaultData вторым аргументом.
// Lowdb автоматически создаст db.json с этой структурой, если файл не существует.
const db = new Low(adapter, defaultData);

// Этот асинхронный блок теперь просто читает и записывает данные.
(async () => {
    await db.read();
    await db.write();
})();
// --- КОНЕЦ ИСПРАВЛЕННОГО БЛОКА ---


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        // РЕКОМЕНДУЮ ВЫНЕСТИ ЭТИ ДАННЫЕ В ПЕРЕМЕННЫЕ СРЕДЫ НА RENDER
        user: 'abdwwkx2008@gmail.com',
        pass: 'nynfgwuajamhjyik'
    }
});

const tempUsers = {};

app.get('/products', (req, res) => res.json(db.data.products));

app.post('/register/start', (req, res) => {
    const { email, fullname, password } = req.body;
    if (db.data.users.find(u => u.email === email)) {
        return res.status(400).json({ message: "Этот e-mail уже занят" });
    }
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = bcrypt.hashSync(password, 10);
    tempUsers[email] = { fullname, password: hashedPassword, code: verificationCode, timestamp: Date.now() };
    const mailOptions = {
        from: 'abdwwkx2008@gmail.com',
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
    const expires = Date.now() + 3600000;

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await db.write();

    const resetLink = `${FRONTEND_URL}/reset-password/${token}`;
    const mailOptions = {
        from: 'abdwwkx2008@gmail.com',
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

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Сервер запущен на порту ${PORT}`));