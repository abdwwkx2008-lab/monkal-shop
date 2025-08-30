import React, { useState, useContext, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';
import { CustomContext } from '../store/store.jsx';
import './AdminAddProduct.css'; // Убедись, что этот файл существует и содержит стили

const categoriesConfig = {
    'Одежда': {
        subcategories: ['Куртки', 'Футболки', 'Штаны', 'Ветровки', 'Толстовки', 'Шорты'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    },
    'Обувь': {
        subcategories: ['Кроссовки', 'Тапочки'],
        sizes: Array.from({ length: 8 }, (_, i) => 38 + i), // От 38 до 45
    },
    'Аксессуары': {
        subcategories: ['Рюкзаки', 'Кепки', 'Барсетки'],
        sizes: ['one size'],
    },
};

export default function AdminPanel() {
    const { user } = useContext(CustomContext);
    const allowedEmails = ['abdulazizrahmanaliev5@gmail.com'];
    const isAdmin = user && allowedEmails.includes(user.email);

    const [tab, setTab] = useState('add');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const initialFormState = {
        name: '',
        category: '',
        subcategory: '',
        price: '',
        sizes: [],
        brand: '',
        image: '',
        rating: '',
        description: '',
    };

    const [form, setForm] = useState(initialFormState);

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

    // Сброс подкатегории и размеров при смене основной категории
    useEffect(() => {
        if (form.category) {
            setForm(prev => ({
                ...prev,
                subcategory: '', // Сбрасываем подкатегорию
                sizes: [], // Сбрасываем выбранные размеры
            }));
        }
    }, [form.category]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSizes = (size) => {
        setForm((prev) => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter((s) => s !== size)
                : [...prev.sizes, size].sort((a, b) => { // Сортируем размеры для удобства
                    // Простая сортировка для S, M, L, XL, XXL
                    const order = { 'S': 1, 'M': 2, 'L': 3, 'XL': 4, 'XXL': 5, 'one size': 6 };
                    if (typeof a === 'string' && typeof b === 'string') {
                        return (order[a] || 99) - (order[b] || 99);
                    }
                    return a - b; // Для чисел (размеров обуви)
                }),
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
            alert('Ошибка загрузки фото: ' + error.message);
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
        if (form.sizes.length === 0) {
            alert('Выберите хотя бы один размер');
            return;
        }

        const payload = {
            ...form,
            price: Number(form.price) || 0,
            rating: form.rating ? Number(form.rating) : null,
        };

        const { error } = await supabase.from('products').insert([payload]);
        if (error) {
            alert('Ошибка при добавлении товара: ' + error.message);
            console.error(error);
        } else {
            alert('✅ Товар успешно добавлен!');
            setForm(initialFormState); // Сбрасываем форму полностью
            setPreview(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Удалить этот товар?')) return;
        setLoading(true); // Показываем загрузку при удалении
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (!error) {
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } else {
            alert('Ошибка при удалении товара: ' + error.message);
            console.error(error);
        }
        setLoading(false);
    };

    // Получаем доступные размеры для выбранной категории
    const availableSizes = form.category ? categoriesConfig[form.category].sizes : [];
    const availableSubcategories = form.category ? categoriesConfig[form.category].subcategories : [];

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
                        {Object.keys(categoriesConfig).map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>

                    {form.category && (
                        <select name="subcategory" value={form.subcategory} onChange={handleChange} required>
                            <option value="">Выберите подкатегорию</option>
                            {availableSubcategories.map((sub) => (
                                <option key={sub} value={sub}>
                                    {sub}
                                </option>
                            ))}
                        </select>
                    )}

                    <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Цена" required />

                    {form.category && availableSizes.length > 0 && (
                        <div className="sizes-selection">
                            <label>Доступные размеры:</label>
                            <div className="sizes-grid">
                                {availableSizes.map((size) => (
                                    <label key={size} className="size-label">
                                        <input
                                            type="checkbox"
                                            checked={form.sizes.includes(size)}
                                            onChange={() => handleSizes(size)}
                                        />
                                        {size}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}


                    <input name="brand" value={form.brand} onChange={handleChange} placeholder="Бренд" required />

                    <div className="image-upload">
                        <label>Фото товара:</label>
                        <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} />
                        {uploading && <p className="uploading-text">Загрузка фото...</p>}
                        {preview && <img src={preview} alt="Предпросмотр" className="image-preview" />}
                        {!preview && form.image && ( // Показываем уже загруженное изображение при редактировании/просмотре
                            <img src={form.image} alt="Загруженное изображение" className="image-preview" />
                        )}
                    </div>

                    <input name="rating" type="number" step="0.1" value={form.rating} onChange={handleChange} placeholder="Оценка (например, 4.5)" min="0" max="5" />
                    <textarea name="description" value={form.description} onChange={handleChange} placeholder="Описание товара" rows={4} />

                    <div className="actions">
                        <button type="button" className="secondary" onClick={() => { setForm(initialFormState); setPreview(null); }}>
                            Очистить форму
                        </button>
                        <button type="submit" disabled={uploading}>Добавить товар</button>
                    </div>
                </form>
            )}

            {tab === 'manage' && (
                <div className="product-list">
                    {loading ? (
                        <p className="loading-text">Загрузка товаров...</p>
                    ) : products.length > 0 ? (
                        <div className="table-responsive">
                            <table>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Фото</th>
                                    <th>Название</th>
                                    <th>Категория</th>
                                    <th>Размеры</th>
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
                                        <td>{p.sizes && p.sizes.length > 0 ? p.sizes.join(', ') : '—'}</td>
                                        <td>{Number(p.price).toLocaleString()} ₽</td>
                                        <td>
                                            <button onClick={() => handleDelete(p.id)} className="delete-btn">🗑 Удалить</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="no-products-text">Товаров пока нет. Добавьте первый товар!</p>
                    )}
                </div>
            )}
        </div>
    );
}