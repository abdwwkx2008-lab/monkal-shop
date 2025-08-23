import React, { createContext, useState, useEffect } from "react";
import { toast } from 'react-toastify';
import axios from 'axios';

export const CustomContext = createContext();

function Context({ children }) {
    const [products, setProducts]       = useState([]);
    const [product, setProduct]         = useState({});
    const [cart, setCart]               = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
    const [favorites, setFavorites]     = useState(() => JSON.parse(localStorage.getItem('favorites')) || []);
    const [user, setUser]               = useState(null);
    const [loading, setLoading]         = useState(true);

    useEffect(() => {
        const checkUser = () => {
            const potentialUser = localStorage.getItem('currentUser');
            if (potentialUser) {
                setUser(JSON.parse(potentialUser));
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    const addCart = (item, count) => {
        setCart(prevCart => {
            const uniqueCartId = `${item.id}-${item.size}`;
            const existingItem = prevCart.find(cartItem => `${cartItem.id}-${cartItem.size}` === uniqueCartId);
            if (existingItem) {
                return prevCart.map(cartItem =>
                    `${cartItem.id}-${cartItem.size}` === uniqueCartId
                        ? { ...cartItem, count: cartItem.count + count }
                        : cartItem
                );
            } else {
                return [...prevCart, { ...item, count: count }];
            }
        });
    };

    const toggleFavorite = (id) => {
        setFavorites(prevFavorites =>
            prevFavorites.includes(id)
                ? prevFavorites.filter(favId => favId !== id)
                : [...prevFavorites, id]
        );
    };

    const getProducts = () => {
        axios("http://localhost:8080/products")
            .then((res) => setProducts(res.data))
            .catch((err) => console.error("Ошибка при получении продуктов:", err));
    };

    const getProduct = (id) => {
        axios(`http://localhost:8080/products/${id}`)
            .then((res) => setProduct(res.data))
            .catch((err) => {
                console.error("Ошибка при получении продукта:", err);
                setProduct({});
            });
    };

    const sendTelegramNotification = (order) => {
        const TELEGRAM_BOT_TOKEN = '7413471080:AAEMyug52DKFSWwVcFSn7PfanTFP_QOcpA8';
        const TELEGRAM_CHAT_ID = '1722434856';
        const NGROK_BASE_URL = "https://56e5dd2da219.ngrok-free.app";

        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            console.error("Telegram Token или Chat ID не настроены.");
            return;
        }

        let addressText = 'Адрес не указан';
        if (order.userInfo && order.userInfo.address && order.userInfo.address.city && order.userInfo.address.street) {
            addressText = `${order.userInfo.address.city}, ${order.userInfo.address.street}`;
        }

        let caption = `*Новый заказ!* №${order.id}\n\n`;
        caption += `*Клиент:* ${order.userInfo.fullname}\n`;
        caption += `*Телефон:* \`${order.userInfo.phone}\`\n`;
        caption += `*Email:* ${order.userInfo.email}\n\n`;
        caption += `*Адрес:* ${addressText}\n\n`;
        caption += "*Состав заказа:*\n";
        order.items.forEach(item => {
            caption += `- ${item.name} (Размер: ${item.size}) - ${item.count} шт. - ${(item.price * item.count).toLocaleString()} ₽\n`;
        });
        caption += `\n*Итого:* ${order.totalPrice.toLocaleString()} ₽`;

        let photoUrl = order.items[0]?.image;

        // УЛУЧШЕННАЯ ЛОГИКА СОЗДАНИЯ ССЫЛКИ
        if (photoUrl && !photoUrl.startsWith('http')) {
            const path = photoUrl.startsWith('/') ? photoUrl : `/${photoUrl}`;
            photoUrl = NGROK_BASE_URL + path;
        }

        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;

        axios.post(url, {
            chat_id: TELEGRAM_CHAT_ID,
            photo: photoUrl,
            caption: caption,
            parse_mode: 'Markdown',
        })
            .catch((err) => {
                console.error("Не удалось отправить фото, отправляем текст. Ошибка:", err.response?.data);
                axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    chat_id: TELEGRAM_CHAT_ID,
                    text: caption,
                    parse_mode: 'Markdown'
                });
            });
    };

    const registerUser = (data, navigate) => {
        axios.post('http://localhost:8080/register', data)
            .then(() => {
                toast.success("Регистрация завершена! Теперь вы можете войти.");
                navigate('/login');
            })
            .catch(() => {
                toast.error("Ошибка при регистрации. Возможно, такой email уже существует.");
            });
    };

    const loginUser = (login, password, navigate) => {
        axios.post('http://localhost:8080/login', {
            email: login,
            password: password
        })
            .then((res) => {
                const { user: loggedInUser } = res.data;
                localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
                setUser(loggedInUser);
                toast.success(`Добро пожаловать, ${loggedInUser.fullname}!`);
                navigate('/profile');
            })
            .catch(() => {
                toast.error("Неверный логин или пароль.");
            });
    };

    const updateUser = (updatedData) => {
        if (!user || !user.id) {
            toast.error("Ошибка: пользователь не найден.");
            return Promise.reject("User not found");
        }
        return axios.patch(`http://localhost:8080/users/${user.id}`, updatedData)
            .then((res) => {
                setUser(res.data);
                localStorage.setItem('currentUser', JSON.stringify(res.data));
                return res.data;
            })
            .catch((err) => {
                toast.error("Не удалось обновить данные.");
                console.error(err);
                throw err;
            });
    };

    const logOutUser = (navigate) => {
        localStorage.removeItem('currentUser');
        setUser(null);
        navigate('/login');
    };

    useEffect(() => {
        getProducts();
    }, []);

    const value = {
        products, product, getProduct,
        cart, setCart, addCart,
        favorites, setFavorites, toggleFavorite,
        user, setUser, updateUser, registerUser, loginUser, logOutUser,
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