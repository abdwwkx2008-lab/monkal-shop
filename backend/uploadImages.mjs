import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iznleemibqghrngxdqho.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6bmxlZW1pYnFnaHJuZ3hkcWhvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjM2NzExMSwiZXhwIjoyMDcxOTQzMTExfQ.MVdhR_HUr-0xlyD87N_b0_SJf0m_xs54sbhF-W8fGxI' // твой service_role_key
);

const localFolder = path.join(process.cwd(), 'public/assets');
const files = fs.readdirSync(localFolder);

for (const fileName of files) {
  const filePath = path.join(localFolder, fileName);
  const fileBuffer = fs.readFileSync(filePath);

  const storagePath = `products/${Date.now()}_${fileName}`;
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(storagePath, fileBuffer);

  if (error) {
    console.error(`❌ Ошибка при загрузке ${fileName}:`, error.message);
    continue;
  }

  const publicUrl = supabase.storage
    .from('product-images')
    .getPublicUrl(storagePath).data.publicUrl;

  console.log(`✅ Загружено: ${fileName} → ${publicUrl}`);
}
