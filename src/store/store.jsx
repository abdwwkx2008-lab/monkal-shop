import React, { createContext, useState, useEffect } from "react";
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const CustomContext = createContext();

const API_BASE_URL = " https://monkal-shop.onrender.com";
const FRONTEND_URL = "https://monkal-shop-3vo2.vercel.app";

function Context({ children }) {
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
    const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites')) || []);

    useEffect(() => {
        const potentialUser = localStorage.getItem('currentUser');
        if (potentialUser) {
            setUser(JSON.parse(potentialUser));
        }
        setLoading(false);
    }, []);

    useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);
    useEffect(() => { localStorage.setItem('favorites', JSON.stringify(favorites)); }, [favorites]);

    const getProducts = () => {
        axios.get(`${API_BASE_URL}/products`)
            .then(res => setProducts(res.data))
            .catch(err => console.error("Ошибка при получении продуктов:", err));
    };

    const startRegistration = (data) => {
        return axios.post(`${API_BASE_URL}/register/start`, data);
    };

    const verifyRegistration = (data) => {
        return axios.post(`${API_BASE_URL}/register/verify`, data);
    };

    const loginUser = (data) => {
        return axios.post(`${API_BASE_URL}/login`, data)
            .then((res) => {
                const loggedInUser = res.data.user;
                localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
                setUser(loggedInUser);
                toast.success(`Добро пожаловать, ${loggedInUser.fullname}!`);
                return loggedInUser;
            });
    };

    const logOutUser = () => {
        localStorage.removeItem('currentUser');
        setUser(null);
    };

    const forgotPassword = (data) => {
        return axios.post(`${API_BASE_URL}/forgot-password`, data);
    };

    const resetPassword = (data) => {
        return axios.post(`${API_BASE_URL}/reset-password/${data.token}`, { password: data.password });
    };

    useEffect(() => { getProducts(); }, []);

    const value = {
        products, user, setUser, cart, setCart, favorites, setFavorites, loading,
        startRegistration, verifyRegistration, loginUser, logOutUser, forgotPassword, resetPassword
    };

    return (
        <CustomContext.Provider value={value}>
            {children}
        </CustomContext.Provider>
    );
}

export default Context;