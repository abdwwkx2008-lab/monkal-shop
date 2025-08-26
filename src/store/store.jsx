import React, { createContext, useState, useEffect } from "react";
import { toast } from 'react-toastify';
import axios from 'axios';

export const CustomContext = createContext();
export const API_BASE_URL = "https://monkal-shop.onrender.com";

function Context({ children }) {
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState({});
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
    const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites')) || []);

    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
    });

    useEffect(() => {
        setLoading(true);
        const potentialUser = localStorage.getItem('currentUser');
        if (potentialUser) {
            setUser(JSON.parse(potentialUser));
        }
        axios.get(`${API_BASE_URL}/products`)
            .then(res => { setProducts(res.data); })
            .catch(err => { console.error("Ошибка при получении продуктов:", err); setProducts([]); })
            .finally(() => { setLoading(false); });
    }, []);

    useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);
    useEffect(() => { localStorage.setItem('favorites', JSON.stringify(favorites)); }, [favorites]);

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(`${theme}-theme`);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const getProducts = () => {
        setLoading(true);
        axios.get(`${API_BASE_URL}/products`)
            .then(res => setProducts(res.data))
            .catch(err => console.error("Ошибка при получении продуктов:", err))
            .finally(() => setLoading(false));
    };

    const getProduct = (id) => {
        const foundProduct = products.find(p => p.id === parseInt(id));
        if (foundProduct) {
            setProduct(foundProduct);
        } else {
            axios.get(`${API_BASE_URL}/products/${id}`)
                .then(res => setProduct(res.data))
                .catch(err => { console.error("Товар не найден:", err); setProduct({}); });
        }
    };

    const addCart = (item, count) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => cartItem.id === item.id && cartItem.size === item.size);
            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem.id === item.id && cartItem.size === item.size
                        ? { ...cartItem, count: cartItem.count + count } : cartItem );
            } else {
                return [...prevCart, { ...item, count }];
            }
        });

    };

    const toggleFavorite = (product) => {
        setFavorites(prevFavorites => {
            if (prevFavorites.includes(product.id)) {
                toast.error(`'${product.name}' удален из избранного`);
                return prevFavorites.filter(favId => favId !== product.id);
            } else {
                toast.success(`'${product.name}' добавлен в избранное`);
                return [...prevFavorites, product.id];
            }
        });
    };

    const clearFavorites = () => {
        setFavorites([]);
        toast.success("Избранное было полностью очищено");
    };

    const registerUser = (data) => axios.post(`${API_BASE_URL}/register`, data);

    const verifyRegistration = (data) => axios.post(`${API_BASE_URL}/verify-email`, data);

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

    const updateUser = (dataToUpdate) => {
        if (!user || !user.id) {
            toast.error("Пользователь не найден. Пожалуйста, войдите снова.");
            return Promise.reject("No user");
        }
        return axios.patch(`${API_BASE_URL}/users/${user.id}`, dataToUpdate)
            .then((res) => {
                const updatedUser = res.data;
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                setUser(updatedUser);
                return updatedUser;
            })
            .catch((err) => {
                toast.error("Не удалось обновить профиль");
                return Promise.reject(err);
            });
    };

    const changePassword = (data) => {
        if (!user || !user.id) return Promise.reject("Пользователь не найден");
        return axios.patch(`${API_BASE_URL}/users/${user.id}/password`, data);
    };

    const sendTelegramNotification = (order) => {
        const botToken = "7815642060:AAGny8UWvjM3FcuN6NZ6agQ28ZoUJRgxucQ";
        const chatId = "1722434856";
        const frontendUrl = "https://monkal-shop-3vo2.vercel.app";
        const messageText = `🎉 *Новый заказ!* №${order.id}\n\n*Клиент:*\nИмя: ${order.userInfo.fullname}\nEmail: ${order.userInfo.email}\nТелефон: ${order.userInfo.phone || 'Не указан'}\n\n*Состав заказа:*\n${order.items.map(item => `- ${item.name} (Размер: ${item.size}) - ${item.count} шт.`).join('\n')}\n\n*Итого: ${order.totalPrice.toLocaleString()} ₽*`;
        const media = order.items.map(item => ({ type: 'photo', media: `${frontendUrl}${item.image}` }));
        const sendPhotos = () => {
            if (media.length === 0) return Promise.resolve();
            if (media.length === 1) {
                return axios.post(`https://api.telegram.org/bot${botToken}/sendPhoto`, { chat_id: chatId, photo: media[0].media });
            }
            return axios.post(`https://api.telegram.org/bot${botToken}/sendMediaGroup`, { chat_id: chatId, media: media.slice(0, 10) });
        };
        sendPhotos()
            .then(() => {
                axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, { chat_id: chatId, text: messageText, parse_mode: 'Markdown' });
            })
            .catch(err => {
                axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, { chat_id: chatId, text: "Не удалось загрузить фото заказа. \n\n" + messageText, parse_mode: 'Markdown' });
            });
    };

    const value = {
        products, product, user, loading, cart, favorites,
        setUser, setCart, setFavorites, getProducts, getProduct, addCart, toggleFavorite,
        registerUser, loginUser, logOutUser, forgotPassword, resetPassword,
        updateUser, sendTelegramNotification,
        clearFavorites, verifyRegistration,
        changePassword,
        theme,
        toggleTheme
    };

    return (
        <CustomContext.Provider value={value}>
            {children}
        </CustomContext.Provider>
    );
}

export default Context;