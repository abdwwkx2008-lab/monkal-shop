import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { CustomContext } from '../../store/store';

const OrderHistory = () => {
    const { user } = useContext(CustomContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.id) {
            axios(`http://localhost:8080/orders?userId=${user.id}&_sort=createdAt&_order=desc`)
                .then(res => {
                    setOrders(res.data);
                })
                .catch(err => {
                    console.error("Ошибка загрузки заказов:", err);
                    setOrders([]);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else if (user === null) {
            setLoading(false);
        }
    }, [user]);

   

    if (!user) {
        return <p>Не удалось загрузить данные пользователя. Попробуйте войти снова.</p>;
    }

    return (
        <div>
            <h2 className="profile-content-title">История заказов</h2>
            {orders.length > 0 ? (
                <table className="orders-table">
                    <thead>
                    <tr>
                        <th>НОМЕР</th>
                        <th>ДАТА</th>
                        <th>СТАТУС</th>
                        <th>ИТОГ</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>#{order.id}</td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td>{order.status}</td>
                            <td className="order-total">{order.totalPrice.toLocaleString()} ₽</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>У вас еще нет заказов.</p>
            )}
        </div>
    );
};

export default OrderHistory;