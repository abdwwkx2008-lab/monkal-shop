import { readFile } from 'node:fs/promises';
import { createClient } from '@supabase/supabase-js';

// 1) Подставь свои данные
const SUPABASE_URL = 'https://iznleemibqghrngxdqho.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6bmxlZW1pYnFnaHJuZ3hkcWhvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjM2NzExMSwiZXhwIjoyMDcxOTQzMTExfQ.MVdhR_HUr-0xlyD87N_b0_SJf0m_xs54sbhF-W8fGxI'; // service_role для вставки без RLS
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// 2) Откуда читаем товары
const JSON_PATH = './db.json'; // или './db-seed.json'

function chunk(arr, size = 100) {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
}

const normalizeProduct = (p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    subcategory: p.subcategory,
    price: Number(p.price ?? 0),
    sizes: Array.isArray(p.sizes) ? p.sizes : [],
    brand: p.brand ?? '',
    image: p.image ?? '',
    rating: p.rating != null ? Number(p.rating) : null,
    description: p.description ?? '',
    created_at: new Date().toISOString()
});

(async () => {
    const raw = await readFile(JSON_PATH, 'utf8');
    const data = JSON.parse(raw);
    if (!data?.products || !Array.isArray(data.products)) {
        console.error('❌ В файле нет массива products');
        process.exit(1);
    }

    console.log(`📦 Грузим ${data.products.length} товаров...`);
    const rows = data.products.map(normalizeProduct);

    for (const batch of chunk(rows, 200)) {
        const { error } = await supabase.from('products').insert(batch);
        if (error) {
            console.error('❌ Ошибка вставки batch:', error.message);
            process.exit(1);
        }
        console.log(`✅ Вставлено ${batch.length}`);
    }

    console.log('🎉 Готово: products мигрированы');
})();
