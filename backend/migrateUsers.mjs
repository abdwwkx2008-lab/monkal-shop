import { readFile } from 'node:fs/promises';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// 🔹 Данные подключения
const SUPABASE_URL = 'https://iznleemibqghrngxdqho.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6bmxlZW1pYnFnaHJuZ3hkcWhvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjM2NzExMSwiZXhwIjoyMDcxOTQzMTExfQ.MVdhR_HUr-0xlyD87N_b0_SJf0m_xs54sbhF-W8fGxI';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// 🔹 Путь к JSON с пользователями
const JSON_PATH = './db.json';

// Разбиваем на батчи
function chunk(arr, size = 200) {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
}

// Проверка, что пароль уже захеширован
function isBcryptHash(val = '') {
    return typeof val === 'string' && /^\$2[aby]\$/.test(val);
}

// Нормализация пользователя под структуру таблицы
const normalizeUser = async (u) => {
    const password = isBcryptHash(u.password)
        ? u.password
        : bcrypt.hashSync(String(u.password ?? ''), 10);

    return {
        id: u.id,
        email: u.email,
        fullname:
            u.fullname ??
            ((u.first_name && u.last_name)
                ? `${u.first_name} ${u.last_name}`
                : (u.first_name ?? u.fullname ?? '')),
        password,
        phone: u.phone ?? null,
        is_verified: Boolean(u.is_verified ?? u.isVerified ?? false),
        verification_code: u.verification_code ?? null,
        reset_token: u.resetPasswordToken ?? null,
        reset_expires: u.resetPasswordExpires
            ? new Date(u.resetPasswordExpires).toISOString()
            : null,
        created_at: new Date().toISOString()
    };
};

// Запуск миграции
(async () => {
    const raw = await readFile(JSON_PATH, 'utf8');
    const data = JSON.parse(raw);

    if (!data?.users || !Array.isArray(data.users)) {
        console.error('❌ В файле нет массива users');
        process.exit(1);
    }

    console.log(`👤 Грузим ${data.users.length} пользователей...`);

    const rows = [];
    for (const u of data.users) {
        rows.push(await normalizeUser(u));
    }

    for (const batch of chunk(rows)) {
        const { error } = await supabase.from('users').insert(batch);
        if (error) {
            console.error('❌ Ошибка вставки batch:', error.message);
            process.exit(1);
        }
        console.log(`✅ Вставлено ${batch.length}`);
    }

    console.log('🎉 Готово: users мигрированы');
})();
