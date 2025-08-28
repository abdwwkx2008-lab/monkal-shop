import React, { useState, useContext } from 'react';
import { supabase } from '../supabaseClient.js';
import { CustomContext } from '../store/store.jsx';
import './AdminAddProduct.css'; // обычный CSS

const categories = {
    "Одежда": ["Куртки", "Футболки", "Штаны"],
    "Обувь": ["Кроссовки", "Ботинки"],
    "Аксессуары": ["Сумки", "Шапки"]
};

export default function AdminAddProduct() {
    const { user } = useContext(CustomContext);
    const allowedEmails = ['abdulazizrahmanaliev5@gmail.com'];
    if (!user || !allowedEmails.includes(user.email)) {
        return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>⛔ Доступ запрещён</h2>;
    }

    const [form, setForm] = useState({
        name: '',
        category: '',
        subcategory: '',
        price: '',
        sizes: [],
        brand: '',
        image: '',
        rating: '',
        description: ''
    });

    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSizes = (size) => {
        setForm(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size]
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);

        const fileName = `products/${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
            .from('product-images')
            .upload(fileName, file);

        if (error) {
            alert('Ошибка загрузки фото');
            console.error(error);
            setUploading(false);
        } else {
            const imageUrl = supabase.storage
                .from('product-images')
                .getPublicUrl(data.path).data.publicUrl;

            setForm(prev => ({ ...prev, image: imageUrl }));
            setPreview(URL.createObjectURL(file));
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('products').insert([form]);
        if (error) {
            alert('Ошибка при добавлении товара');
            console.error(error);
        } else {
            alert('Товар успешно добавлен!');
            setForm({
                name: '',
                category: '',
                subcategory: '',
                price: '',
                sizes: [],
                brand: '',
                image: '',
                rating: '',
                description: ''
            });
            setPreview(null);
        }
    };

    return (
        <div className="admin-wrapper">
            <h2>Добавить товар</h2>
            <form className="admin-form" onSubmit={handleSubmit}>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Название" required />
                <select name="category" value={form.category} onChange={handleChange} required>
                    <option value="">Выберите категорию</option>
                    {Object.keys(categories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <select name="subcategory" value={form.subcategory} onChange={handleChange} required>
                    <option value="">Выберите подкатегорию</option>
                    {form.category && categories[form.category].map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
                <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Цена" required />
                <div className="sizes">
                    {["S", "M", "L", "XL", "XXL", "one size"].map(size => (
                        <label key={size}>
                            <input type="checkbox" checked={form.sizes.includes(size)} onChange={() => handleSizes(size)} />
                            {size}
                        </label>
                    ))}
                </div>
                <input name="brand" value={form.brand} onChange={handleChange} placeholder="Бренд" required />
                <div className="image-upload">
                    <label>Фото товара:</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                    {uploading && <p>Загрузка фото...</p>}
                    {preview && <img src={preview} alt="preview" className="image-preview" />}
                </div>
                <input name="rating" type="number" step="0.1" value={form.rating} onChange={handleChange} placeholder="Оценка" />
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Описание" />
                <button type="submit">Добавить товар</button>
            </form>
        </div>
    );
}
