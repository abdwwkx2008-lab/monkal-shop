import  { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { CustomContext } from "./context/CustomContext";

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
            const parsedUser = JSON.parse(potentialUser);
            parsedUser.id = Number(parsedUser.id);
            setUser(parsedUser);
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
                loggedInUser.id = Number(loggedInUser.id);
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

    const updateUser = (userId, dataToUpdate) => {
        if (!userId) {
            toast.error("Идентификатор пользователя не найден. Пожалуйста, войдите снова.");
            return Promise.reject("No user ID");
        }

        return axios.patch(`${API_BASE_URL}/users/${Number(userId)}`, dataToUpdate)
            .then((res) => {
                const updatedUser = res.data;
                updatedUser.id = Number(updatedUser.id);
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

    const placeOrder = (orderData) => {
        return axios.post(`${API_BASE_URL}/orders`, orderData)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                console.error("Ошибка при создании заказа через бэкенд:", err.response?.data?.message || err.message);
                throw err;
            });
    };

    const value = {
        products, product, user, loading, cart, favorites,
        setUser, setCart, setFavorites, getProducts, getProduct, addCart, toggleFavorite,
        registerUser, loginUser, logOutUser, forgotPassword, resetPassword,
        updateUser,
        clearFavorites, verifyRegistration,
        changePassword,
        theme,
        toggleTheme,
        placeOrder
    };

    return (
        <CustomContext.Provider value={value}>
            {children}
        </CustomContext.Provider>
    );
}

export default Context;