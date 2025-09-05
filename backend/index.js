import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'MonkalShopSecretKeyForTokens_2025!@#$';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://monkal-shop-3vo2.vercel.app';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://iznleemibqghrngxdqho.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6bmxlZW1pYnFnaHJuZ3hkcWhvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjM2NzExMSwiZXhwIjoyMDcxOTQzMTExfQ.MVdhR_HUr-0xlyD87N_b0_SJf0m_xs54sbhF-W8fGxI';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER || 'abdwwkx2008@gmail.com',
        pass: process.env.GMAIL_PASS || 'nynfgwuajamhjyik'
    }
});

const sendTelegramNotification = async (order) => {
    const botToken = "7815642060:AAGny8UWvjM3FcuN6NZ6agQ28ZoUJRgxucQ";
    const chatId = "1722434856";

    const messageText =
        `🎉 *Новый заказ!* №${order.order_code || order.id || '—'}

*Клиент:*
Имя: ${order.user_fullname || 'Не указано'}
Телефон: ${order.user_phone || 'Не указан'}
Email: ${order.user_email || 'Не указан'}

*Состав заказа:*
${order.items.map(item =>
            `ID: ${item.id} | ${item.name} (Размер: ${item.size || 'Не указан'}) - ${item.count} шт. × ${item.price} С`
        ).join('\n')}

*Итого: ${order.total_price?.toLocaleString() || 0} С*`;

    const media = order.items.map(item => ({
        type: 'photo',
        media: item.image
    }));

    try {
        if (media.length > 0) {
            if (media.length === 1) {
                await axios.post(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
                    chat_id: chatId,
                    photo: media[0].media
                });
            } else {
                await axios.post(`https://api.telegram.org/bot${botToken}/sendMediaGroup`, {
                    chat_id: chatId,
                    media: media.slice(0, 10)
                });
            }
        }

        await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            chat_id: chatId,
            text: messageText,
            parse_mode: 'Markdown'
        });
    } catch (error) {
        console.error('Error sending Telegram notification:', error.response ? error.response.data : error.message);
        try {
            await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                chat_id: chatId,
                text: "Не удалось загрузить фото заказа.\n\n" + messageText,
                parse_mode: 'Markdown'
            });
        } catch (retryError) {
            console.error('Failed to send text-only Telegram notification:', retryError.response ? retryError.response.data : retryError.message);
        }
    }
};

app.get('/products', async (req, res) => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

    if (error) return res.status(500).json({ message: error.message });
    res.json(data);
});

app.get('/products/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return res.status(404).json({ message: 'Товар не найден' });
    res.json(data);
});

function generateOrderCode() {
    return Math.floor(10000000000 + Math.random() * 90000000000).toString();
}

app.post('/orders', async (req, res) => {
    try {
        const {
            user_id,
            user_email,
            user_fullname,
            user_phone,
            items,
            total_price,
            created_at
        } = req.body;

        const order_code = generateOrderCode();

        const { data, error } = await supabase
            .from('orders')
            .insert([{
                order_code,
                user_id,
                user_email,
                user_fullname,
                user_phone,
                items,
                total_price,
                created_at
            }])
            .select()
            .single();

        if (error) {
            console.error('Ошибка вставки заказа:', error.message);
            return res.status(500).json({ message: error.message });
        }

        sendTelegramNotification(data);

        res.status(201).json(data);

    } catch (err) {
        console.error('Ошибка сервера при создании заказа:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

app.post('/register', async (req, res) => {
    const { email, fullname, password, phone } = req.body;
    if (!email || !fullname || !password || !phone) {
        return res.status(400).json({ message: 'Пожалуйста, заполните все поля' });
    }

    const { data: existing, error: findErr } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

    if (findErr) return res.status(500).json({ message: findErr.message });

    const verificationCode = String(crypto.randomInt(100000, 999999));
    const hashedPassword = bcrypt.hashSync(password, 10);

    if (existing && existing.is_verified) {
        return res.status(400).json({ message: 'Этот e-mail уже занят' });
    }

    if (existing && !existing.is_verified) {
        const { error } = await supabase
            .from('users')
            .update({ fullname, password: hashedPassword, phone, verification_code: verificationCode })
            .eq('email', email);
        if (error) return res.status(500).json({ message: error.message });
    } else {
        const { error } = await supabase.from('users').insert([{
            email, fullname, password: hashedPassword, phone,
            is_verified: false,
            verification_code: verificationCode,
            created_at: new Date().toISOString()
        }]);
        if (error) return res.status(500).json({ message: error.message });
    }

    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USER || 'abdwwkx2008@gmail.com',
            to: email,
            subject: 'Код подтверждения для Monkal',
            html: `<p>Ваш код для подтверждения регистрации:</p><h2>${verificationCode}</h2>`
        });
        res.status(201).json({ message: 'Код подтверждения отправлен на вашу почту.' });
    } catch {
        res.status(500).json({ message: 'Не удалось отправить письмо с кодом.' });
    }
});

app.post('/verify-email', async (req, res) => {
    const { email, code } = req.body;

    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

    if (error) return res.status(500).json({ message: error.message });
    if (!user) return res.status(404).json({ message: 'Пользователь не найден.' });
    if (user.is_verified) return res.status(400).json({ message: 'Аккаунт уже подтвержден.' });
    if (user.verification_code !== code) return res.status(400).json({ message: 'Неверный код подтверждения.' });

    const { error: upErr } = await supabase
        .from('users')
        .update({ is_verified: true, verification_code: null })
        .eq('email', email);

    if (upErr) return res.status(500).json({ message: upErr.message });
    res.status(200).json({ message: 'Email успешно подтвержден!' });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

    if (error) return res.status(500).json({ message: error.message });
    if (!user || !user.is_verified) return res.status(400).json({ message: 'Пользователь не найден или не подтвержден' });
    if (!bcrypt.compareSync(password, user.password)) return res.status(400).json({ message: 'Неверный логин или пароль' });

    const { password: _, ...safeUser } = user;
    const accessToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ accessToken, user: safeUser });
});

app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

    if (error) return res.status(500).json({ message: error.message });
    if (!user) return res.status(200).json({ message: 'Если такой пользователь существует, мы отправили инструкцию на почту.' });

    const token = crypto.randomBytes(32).toString('hex');

    const { error: upErr } = await supabase
        .from('users')
        .update({
            reset_token: token,
            reset_expires: new Date(Date.now() + 3600000).toISOString()
        })
        .eq('email', email);

    if (upErr) return res.status(500).json({ message: upErr.message });

    const resetLink = `${FRONTEND_URL}/reset-password/${token}`;

    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USER || 'abdwwkx2008@gmail.com',
            to: email,
            subject: 'Сброс пароля для Monkal',
            html: `<p>Вы запросили сброс пароля:</p><a href="${resetLink}">${resetLink}</a>`
        });
    } catch {
        // не падём, ответим нейтрально
    }

    res.status(200).json({ message: 'Если такой пользователь существует, мы отправили инструкцию на почту.' });
});

app.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('reset_token', token)
        .gt('reset_expires', new Date().toISOString())
        .maybeSingle();

    if (error) return res.status(500).json({ message: error.message });
    if (!user) return res.status(400).json({ message: 'Токен недействителен или срок его действия истек' });

    const { error: upErr } = await supabase
        .from('users')
        .update({
            password: bcrypt.hashSync(password, 10),
            reset_token: null,
            reset_expires: null
        })
        .eq('id', user.id);

    if (upErr) return res.status(500).json({ message: upErr.message });
    res.status(200).json({ message: 'Пароль успешно изменен!' });
});

app.patch('/users/:id', async (req, res) => {
    const id = Number(req.params.id);
    const updates = {};
    if (req.body.fullname) updates.fullname = req.body.fullname;
    if (req.body.phone) updates.phone = req.body.phone;

    const { data: user, error: findErr } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .maybeSingle();

    if (findErr) return res.status(500).json({ message: findErr.message });
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    const { error: upErr } = await supabase.from('users').update(updates).eq('id', id);
    if (upErr) return res.status(500).json({ message: upErr.message });

    const { password, ...safe } = { ...user, ...updates };
    res.json(safe);
});

app.patch('/users/:id/password', async (req, res) => {
    const id = Number(req.params.id);
    const { oldPassword, newPassword } = req.body;

    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .maybeSingle();

    if (error) return res.status(500).json({ message: error.message });
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
    if (!bcrypt.compareSync(oldPassword, user.password)) {
        return res.status(400).json({ message: 'Старый пароль введен неверно' });
    }

    const { error: upErr } = await supabase
        .from('users')
        .update({ password: bcrypt.hashSync(newPassword, 10) })
        .eq('id', id);

    if (upErr) return res.status(500).json({ message: upErr.message });
    res.status(200).json({ message: 'Пароль успешно изменен!' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Сервер запущен на порту ${PORT}`));