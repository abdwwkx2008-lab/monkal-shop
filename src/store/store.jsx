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

    useEffect(() => {
        setLoading(true);
        const potentialUser = localStorage.getItem('currentUser');
        if (potentialUser) {
            setUser(JSON.parse(potentialUser));
        }
        axios.get(`${API_BASE_URL}/products`)
            .then(res => {
                setProducts(res.data);
            })
            .catch(err => {
                console.error("Ошибка при получении продуктов:", err);
                setProducts([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);
    useEffect(() => { localStorage.setItem('favorites', JSON.stringify(favorites)); }, [favorites]);

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
                .catch(err => {
                    console.error("Товар не найден:", err)
                    setProduct({});
                });
        }
    };

    const addCart = (item, count) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => cartItem.id === item.id && cartItem.size === item.size);
            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem.id === item.id && cartItem.size === item.size
                        ? { ...cartItem, count: cartItem.count + count }
                        : cartItem
                );
            } else {
                return [...prevCart, { ...item, count }];
            }
        });
    };

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

    const registerUser = (data) => axios.post(`${API_BASE_URL}/register`, data);

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
                console.error(err);
                return Promise.reject(err);
            });
    };

    const sendTelegramNotification = (order) => {
        const botToken = "7815642060:AAGny8UWvjM3FcuN6NZ6agQ28ZoUJRgxucQ";
        const chatId = "1722434856";
        const frontendUrl = "https://monkal-shop-3vo2.vercel.app";

        const captionText = `
🎉 *Новый заказ!* №${order.id}
*Клиент:*
Имя: ${order.userInfo.fullname}
Email: ${order.userInfo.email}
Телефон: ${order.userInfo.phone || 'Не указан'}
*Адрес доставки:*
${order.userInfo.address.city}, ${order.userInfo.address.street}
*Итого: ${order.totalPrice.toLocaleString()} ₽*
        `;

        const media = order.items.map((item, index) => ({
            type: 'photo',
            media: `${frontendUrl}${item.image}`,
            caption: index === 0 ? captionText : `${item.name} (${item.size}) - ${item.count} шт.`,
            parse_mode: 'Markdown'
        }));

        if (media.length === 1) {
            axios.post(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
                chat_id: chatId,
                photo: media[0].media,
                caption: media[0].caption,
                parse_mode: 'Markdown'
            }).catch(err => console.error("Ошибка отправки фото в Telegram:", err.response?.data));
        } else if (media.length > 1) {
            axios.post(`https://api.telegram.org/bot${botToken}/sendMediaGroup`, {
                chat_id: chatId,
                media: media.slice(0, 10)
            }).then(() => {
                axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                    chat_id: chatId,
                    text: captionText,
                    parse_mode: 'Markdown'
                });
            }).catch(err => console.error("Ошибка отправки фото в Telegram:", err.response?.data));
        }
    };

    const value = {
        products, product, user, loading, cart, favorites,
        setUser, setCart, setFavorites, getProducts, getProduct, addCart, toggleFavorite,
        registerUser, loginUser, logOutUser, forgotPassword, resetPassword,
        updateUser, sendTelegramNotification
    };

    return (
        <CustomContext.Provider value={value}>
            {children}
        </CustomContext.Provider>
    );
}

export default Context;