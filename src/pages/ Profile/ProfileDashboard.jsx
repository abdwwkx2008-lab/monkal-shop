import React, { useContext, useState, useEffect } from 'react';
// ...
import { CustomContext } from '../../store/store';
import axios from 'axios';

// Получаем API_BASE_URL из контекста
const { API_BASE_URL } = CustomContext;

const ProfileDashboard = () => {
    // ...
    useEffect(() => {
        if (user && user.id) {
            // ИСПОЛЬЗУЕМ ПРАВИЛЬНЫЙ АДРЕС
            axios(`${API_BASE_URL}/orders?userId=${user.id}&_sort=createdAt&_order=desc&_limit=5`)
                .then(res => setOrders(res.data))
                .catch(err => console.error("Ошибка загрузки последних заказов:", err));
        }
    }, [user]);
    // ...
};

export default ProfileDashboard;