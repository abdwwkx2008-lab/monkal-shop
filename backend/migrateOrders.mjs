import { readFile } from 'node:fs/promises';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://iznleemibqghrngxdqho.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6bmxlZW1pYnFnaHJuZ3hkcWhvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjM2NzExMSwiZXhwIjoyMDcxOTQzMTExfQ.MVdhR_HUr-0xlyD87N_b0_SJf0m_xs54sbhF-W8fGxI';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const JSON_PATH = './db.json';

function chunk(arr, size = 200) {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
}

function computeTotal(items) {
    if (!Array.isArray(items)) return null;
    try {
        return items.reduce((sum, it) => {
            const price = Number(it.price ?? it.product?.price ?? 0);
            const qty = Number(it.quantity ?? it.qty ?? 1);
            return sum + price * qty;
        }, 0);
    } catch {
        return null;
    }
}

const normalizeOrder = (o) => {
    const items = o.items ?? o.cart ?? o.products ?? [];
    const total = o.total_price ?? computeTotal(items);
    const user_email = o.user_email ?? o.email ?? o.user?.email ?? null;

    return {
        id: o.id,
        user_email,
        items,
        total_price: total != null ? Number(total) : 0,
        created_at: o.created_at ? new Date(o.created_at).toISOString()
            : o.createdAt ? new Date(o.createdAt).toISOString()
                : new Date().toISOString()
    };
};

(async () => {
    const raw = await readFile(JSON_PATH, 'utf8');
    const data = JSON.parse(raw);
    if (!data?.orders || !Array.isArray(data.orders)) {
        console.error('❌ В файле нет массива orders');
        process.exit(1);
    }

    console.log(`🛒 Грузим ${data.orders.length} заказов...`);
    const rows = data.orders.map(normalizeOrder);

    for (const batch of chunk(rows)) {
        const { error } = await supabase.from('orders').insert(batch);
        if (error) {
            console.error('❌ Ошибка вставки batch:', error.message);
            process.exit(1);
        }
        console.log(`✅ Вставлено ${batch.length}`);
    }

    console.log('🎉 Готово: orders мигрированы');
})();
