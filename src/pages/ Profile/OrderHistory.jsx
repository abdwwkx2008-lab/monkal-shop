import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { CustomContext } from '../../store/store';

// Получаем API_BASE_URL из контекста
const { API_BASE_URL } = CustomContext;

const OrderHistory = () => {
    // ...
    useEffect(() => {
        if (user && user.id) {
            // ИСПОЛЬЗУЕМ ПРАВИЛЬНЫЙ АДРЕС
            axios(`${API_BASE_URL}/orders?userId=${user.id}&_sort=createdAt&_order=desc`)
                .then(res => {
                    setOrders(res.data);
                })
            // ...
        }
    }, [user]);
    // ...
};

export default OrderHistory;