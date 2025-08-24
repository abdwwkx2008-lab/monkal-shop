import React, { createContext, useState, useEffect } from "react";
import { toast } from 'react-toastify';
import axios from 'axios';

export const CustomContext = createContext();

const API_BASE_URL = "https://monkal-shop.onrender.com";

function Context({ children }) {
    // --- Состояния ---
    const [products, setProducts] = useState([]); // Все товары
    const [product, setProduct] = useState({});   // Один товар для страницы Product.jsx
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
    const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites')) || []);

    // --- Эффекты ---
    useEffect(() => {
        const potentialUser = localStorage.getItem('currentUser');
        if (potentialUser) setUser(JSON.parse(potentialUser));
        setLoading(false);
    }, []);
    useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);
    useEffect(() => { localStorage.setItem('favorites', JSON.stringify(favorites)); }, [favorites]);

    // --- Функции для работы с API и данными ---

    // Загрузка всех товаров
    const getProducts = () => {
        axios.get(`${API_BASE_URL}/products`)
            .then(res => setProducts(res.data))
            .catch(err => console.error("Ошибка при получении продуктов:", err));
    };

    // Загрузка всех товаров при первом запуске
    useEffect(() => { getProducts(); }, []);

    // Находит и устанавливает один товар для страницы Product.jsx
    const getProduct = (id) => {
        // Сначала ищем в уже загруженных товарах, чтобы было быстрее
        const foundProduct = products.find(p => p.id === parseInt(id));
        if (foundProduct) {
            setProduct(foundProduct);
        } else {
            // Если не нашли (например, прямая ссылка), запрашиваем с сервера
            // ВАМ НУЖНО БУДЕТ ДОБАВИТЬ ЭТОТ РОУТ НА БЭКЕНД
            axios.get(`${API_BASE_URL}/products/${id}`)
                .then(res => setProduct(res.data))
                .catch(err => {
                    console.error("Товар не найден:", err)
                    setProduct({}); // Сбрасываем товар в случае ошибки
                });
        }
    };

    // Добавление в корзину
    const addCart = (item, count) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => cartItem.id === item.id && cartItem.size === item.size);
            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem.id === item.id && cartItem.size === item.size
                        ? { ...cartItem, count: cartItem.count + count }
                        : cartItem // <--- ВОТ ИСПРАВЛЕННАЯ СТРОКА
                );
            } else {
                return [...prevCart, { ...item, count }];
            }
        });
    };

    // Добавление/удаление из избранного
    const toggleFavorite = (id) => {
        setFavorites(prevFavorites => {
            if (prevFavorites.includes(id)) {
                toast.info("Удалено из избранного");
                return prevFavorites.filter(favId => favId !== id);
            } else {
                toast.success("Добавлено в избранное!");
                return [...prevFavorites, id];
            }
        });
    };

    // Функции для регистрации и входа
    const startRegistration = (data) => axios.post(`${API_BASE_URL}/register/start`, data);
    const verifyRegistration = (data) => axios.post(`${API_BASE_URL}/register/verify`, data);
    const loginUser = (data) => {
        return axios.post(`${API_BASE_URL}/login`, data)
            .then((res) => {
                const loggedInUser = res.data.user;
                localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
                setUser(loggedInUser);
                toast.success(`Добро пожаловать, ${loggedInUser.fullname}!`);
                return loggedInUser;
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || "Неверный логин или пароль");
                return Promise.reject(err);
            });
    };
    const logOutUser = () => {
        localStorage.removeItem('currentUser');
        setUser(null);
    };
    const forgotPassword = (data) => axios.post(`${API_BASE_URL}/forgot-password`, data);
    const resetPassword = (data) => axios.post(`${API_BASE_URL}/reset-password/${data.token}`, { password: data.password });

    const value = {
        products, user, setUser, cart, setCart, favorites, setFavorites, loading,
        startRegistration, verifyRegistration, loginUser, logOutUser, forgotPassword, resetPassword,
        product, getProduct, addCart, toggleFavorite
    };

    return (
        <CustomContext.Provider value={value}>
            {children}
        </CustomContext.Provider>
    );
}

export default Context;