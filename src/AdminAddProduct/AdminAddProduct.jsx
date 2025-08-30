
import React, { useState, useContext, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';
import { CustomContext } from '../store/store.jsx';
import  './AdminAddProduct.css'

const categories = {
    'Одежда': ['Куртки', 'Футболки', 'Штаны', 'Ветровки', 'Толстовки', 'Шорты'],
    'Обувь': ['Кроссовки', 'Тапочки'],
    'Аксессуары': ['Рюкзаки', 'Кепки', 'Барсетки'],
};

export default function AdminPanel() {
    const { user } = useContext(CustomContext);
    const allowedEmails = ['abdulazizrahmanaliev5@gmail.com'];
    const isAdmin = user && allowedEmails.includes(user.email);

    const [tab, setTab] = useState('add');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        name: '',
        category: '',
        subcategory: '',
        price: '',
        sizes: [],
        brand: '',
        image: '',
        rating: '',
        description: '',
    });

    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    if (!isAdmin) {
        return <h2 className="access-denied">⛔ Доступ запрещён</h2>;
    }

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('id', { ascending: false });
        if (!error && data) setProducts(data);
        setLoading(false);
    };

    useEffect(() => {
        if (tab === 'manage') fetchProducts();
    }, [tab]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSizes = (size) => {
        setForm((prev) => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter((s) => s !== size)
                : [...prev.sizes, size],
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);

        const fileName = `products/${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
            .from('product-images')
            .upload(fileName, file);

        if (error) {
            alert('Ошибка загрузки фото');
            console.error(error);
        } else {
            const imageUrl = supabase.storage
                .from('product-images')
                .getPublicUrl(data.path).data.publicUrl;

            setForm((prev) => ({ ...prev, image: imageUrl }));
            setPreview(URL.createObjectURL(file));
        }
        setUploading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Валидация
        if (!form.image) {
            alert('Загрузите фото товара');
            return;
        }

        const payload = {
            ...form,
            price: Number(form.price) || 0,
            rating: form.rating ? Number(form.rating) : null,
        };

        const { error } = await supabase.from('products').insert([payload]);
        if (error) {
            alert('Ошибка при добавлении товара');
            console.error(error);
        } else {
            alert('✅ Товар успешно добавлен!');
            setForm({
                name: '',
                category: '',
                subcategory: '',
                price: '',
                sizes: [],
                brand: '',
                image: '',
                rating: '',
                description: '',
            });
            setPreview(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Удалить этот товар?')) return;
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (!error) setProducts((prev) => prev.filter((p) => p.id !== id));
    };

    return (
        <div className="admin-wrapper">
            <div className="admin-header">
                <h1>Админ-панель</h1>
                <div className="admin-tabs">
                    <button className={tab === 'add' ? 'active' : ''} onClick={() => setTab('add')}>
                        ➕ Добавить товар
                    </button>
                    <button className={tab === 'manage' ? 'active' : ''} onClick={() => setTab('manage')}>
                        📦 Управление товарами
                    </button>
                </div>
            </div>

            {tab === 'add' && (
                <form className="admin-form" onSubmit={handleSubmit}>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Название" required />

                    <select name="category" value={form.category} onChange={handleChange} required>
                        <option value="">Выберите категорию</option>
                        {Object.keys(categories).map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>

                    <select name="subcategory" value={form.subcategory} onChange={handleChange} required>
                        <option value="">Выберите подкатегорию</option>
                        {form.category &&
                            categories[form.category].map((sub) => (
                                <option key={sub} value={sub}>
                                    {sub}
                                </option>
                            ))}
                    </select>

                    <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Цена" required />

                    <div className="sizes">
                        {['S', 'M', 'L', 'XL', 'XXL', 'one size'].map((size) => (
                            <label key={size}>
                                <input type="checkbox" checked={form.sizes.includes(size)} onChange={() => handleSizes(size)} />
                                {size}
                            </label>
                        ))}
                    </div>

                    <input name="brand" value={form.brand} onChange={handleChange} placeholder="Бренд" required />

                    <div className="image-upload">
                        <label>Фото товара:</label>
                        <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} />
                        {uploading && <p>Загрузка фото...</p>}
                        {preview && <img src={preview} alt="preview" className="image-preview" />}
                    </div>

                    <input name="rating" type="number" step="0.1" value={form.rating} onChange={handleChange} placeholder="Оценка" />
                    <textarea name="description" value={form.description} onChange={handleChange} placeholder="Описание" rows={4} />

                    <div className="actions">
                        <button type="button" className="secondary" onClick={() => { setForm({ name: '', category: '', subcategory: '', price: '', sizes: [], brand: '', image: '', rating: '', description: '' }); setPreview(null); }}>
                            Очистить
                        </button>
                        <button type="submit" disabled={uploading}>Добавить товар</button>
                    </div>
                </form>
            )}

            {tab === 'manage' && (
                <div className="product-list">
                    {loading ? (
                        <p>Загрузка...</p>
                    ) : products.length > 0 ? (
                        <table>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Фото</th>
                                <th>Название</th>
                                <th>Категория</th>
                                <th>Цена</th>
                                <th>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {products.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.image ? <img src={p.image} alt={p.name} className="thumb" /> : '—'}</td>
                                    <td>{p.name}</td>
                                    <td>{p.category} / {p.subcategory}</td>
                                    <td>{Number(p.price).toLocaleString()} ₽</td>
                                    <td>
                                        <button onClick={() => handleDelete(p.id)} className="delete-btn">🗑 Удалить</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Товаров нет</p>
                    )}
                </div>
            )}
        </div>
    );
}
