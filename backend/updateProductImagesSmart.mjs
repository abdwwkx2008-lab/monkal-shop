import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iznleemibqghrngxdqho.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6bmxlZW1pYnFnaHJuZ3hkcWhvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjM2NzExMSwiZXhwIjoyMDcxOTQzMTExfQ.MVdhR_HUr-0xlyD87N_b0_SJf0m_xs54sbhF-W8fGxI'
);

// Получаем все товары
const { data: products, error: productError } = await supabase
  .from('products')
  .select('*');

if (productError) throw productError;

// Получаем все файлы из Supabase Storage
const { data: files, error: fileError } = await supabase
  .storage
  .from('product-images')
  .list('products');

if (fileError) throw fileError;

const uploadedFiles = files.map(f => f.name);

// Функция нормализации строки
const normalize = (str) =>
  str?.toLowerCase().replace(/[^a-zа-я0-9]/gi, '').replace(/ё/g, 'е') || '';

// Обновляем товары
for (const product of products) {
  let match = null;

  // 🔍 Попытка 1: найти по имени файла из image
  if (product.image && product.image.includes('.jpg')) {
    const oldFileName = product.image.split('/').pop();
    match = uploadedFiles.find(f => f.endsWith(oldFileName));
  }

  // 🔍 Попытка 2: если не найдено — ищем по названию товара
  if (!match) {
    const productKey = normalize(product.name);
    match = uploadedFiles.find(file => normalize(file).includes(productKey));
  }

  // ⛔ Если всё равно не найдено — логируем
  if (!match) {
    console.log(`❌ Нет совпадения для: ${product.name}`);
    continue;
  }

  // ✅ Получаем publicUrl и обновляем товар
  const publicUrl = supabase.storage
    .from('product-images')
    .getPublicUrl(`products/${match}`).data.publicUrl;

  await supabase
    .from('products')
    .update({ image: publicUrl })
    .eq('id', product.id);

  console.log(`✅ Обновлено: ${product.name}`);
}
