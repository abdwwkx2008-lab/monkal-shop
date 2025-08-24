import React, { createContext, useState, useEffect } from "react";
import { toast } from 'react-toastify';
import axios from 'axios';

export const CustomContext = createContext();

// Наши постоянные адреса
const API_BASE_URL = "https://modeline-api.onrender.com";
const FRONTEND_URL = "https://monkal.vercel.app"; // Убедись, что это твоя правильная ссылка

function Context({ children }) {
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState({});
    const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
    const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites')) || []);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const potentialUser = localStorage.getItem('currentUser');
        if (potentialUser) {
            setUser(JSON.parse(potentialUser));
        }
        setLoading(false);
    }, []);

    useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);
    useEffect(() => { localStorage.setItem('favorites', JSON.stringify(favorites)); }, [favorites]);

    const addCart = (item, count) => { /* ... твой код добавления в корзину ... */ };
    const toggleFavorite = (id) => { /* ... твой код избранного ... */ };

    const getProducts = () => {
        axios(`${API_BASE_URL}/products`)
            .then((res) => setProducts(res.data))
            .catch((err) => console.error("Ошибка при получении продуктов:", err));
    };

    const getProduct = (id) => {
        axios(`${API_BASE_URL}/products/${id}`)
            .then((res) => setProduct(res.data))
            .catch((err) => console.error("Ошибка при получении продукта:", err));
    };

    // --- НОВАЯ, ЧИСТАЯ ЛОГИКА РЕГИСТРАЦИИ ---
    const registerUser = (data, navigate) => {
        axios.post(`${API_BASE_URL}/register`, data)
            .then(() => {
                toast.success("Вы успешно зарегистрировались!");
                navigate('/login');
            })
            .catch((err) => {
                // json-server-auth возвращает ошибку в err.response.data
                const errorMessage = err.response?.data || "Неизвестная ошибка";
                if (errorMessage.toLowerCase().includes("email already exists")) {
                    toast.error("Этот e-mail уже занят.");
                } else {
                    toast.error("Ошибка при регистрации.");
                }
            });
    };

    // --- НОВАЯ, ЧИСТАЯ ЛОГИКА ВХОДА ---
    const loginUser = (data, navigate) => {
        axios.post(`${API_BASE_URL}/login`, data)
            .then((res) => {
                const loggedInUser = res.data.user;
                localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
                setUser(loggedInUser);
                toast.success(`Добро пожаловать, ${loggedInUser.fullname}!`);
                navigate('/profile');
            })
            .catch(() => {
                toast.error("Неверный логин или пароль.");
            });
    };

    const logOutUser = (navigate) => {
        localStorage.removeItem('currentUser');
        setUser(null);
        navigate('/login');
    };

    const sendTelegramNotification = (order) => { /* ... твой код отправки в телеграм ... */ };

    useEffect(() => { getProducts(); }, []);

    const value = {
        products, product, getProduct,
        cart, setCart, addCart,
        favorites, setFavorites, toggleFavorite,
        user, setUser, registerUser, loginUser, logOutUser,
        loading,
        sendTelegramNotification
    };

    return (
        <CustomContext.Provider value={value}>
            {children}
        </CustomContext.Provider>
    );
}

export default Context;