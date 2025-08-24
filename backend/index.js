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
    await db.write();
})();

// ... ваш код для transporter, register, login, password reset ...

// --- НОВЫЕ РОУТЫ ДЛЯ ПРОФИЛЯ ---

// Получить все адреса пользователя
app.get('/addresses', (req, res) => {
    const { userId } = req.query;
    const userAddresses = db.data.addresses.filter(a => a.userId === parseInt(userId));
    res.json(userAddresses);
});

// Добавить новый адрес
app.post('/addresses', async (req, res) => {
    const newAddress = {
        id: (db.data.addresses.length > 0 ? Math.max(...db.data.addresses.map(a => a.id)) : 0) + 1,
        ...req.body
    };
    db.data.addresses.push(newAddress);
    await db.write();
    res.status(201).json(newAddress);
});

// Обновить адрес
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

// Удалить адрес
app.delete('/addresses/:id', async (req, res) => {
    db.data.addresses = db.data.addresses.filter(a => a.id !== parseInt(req.params.id));
    await db.write();
    res.status(204).send();
});

// Получить все заказы пользователя
app.get('/orders', (req, res) => {
    const { userId } = req.query;
    const userOrders = db.data.orders.filter(o => o.userId === parseInt(userId));
    res.json(userOrders);
});

// Обновить данные пользователя (имя, телефон)
app.patch('/users/:id', async (req, res) => {
    const user = db.data.users.find(u => u.id === parseInt(req.params.id));
    if (user) {
        // Обновляем только разрешенные поля
        if (req.body.fullname) user.fullname = req.body.fullname;
        if (req.body.phone) user.phone = req.body.phone;

        await db.write();
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } else {
        res.status(404).json({ message: "Пользователь не найден" });
    }
});

// --- КОНЕЦ НОВЫХ РОУТОВ ---

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Сервер запущен на порту ${PORT}`));