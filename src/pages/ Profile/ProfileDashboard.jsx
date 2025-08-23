import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CustomContext } from '../../store/store';
import { PersonIcon, ListIcon, GeoIcon, StarIcon, ExitIcon, EditIcon } from './icons';
import axios from 'axios';
import './Profile.css';

const ProfileDashboard = () => {
    const { user, logOutUser } = useContext(CustomContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (user && user.id) {
            axios(`http://localhost:8080/orders?userId=${user.id}&_sort=createdAt&_order=desc&_limit=5`)
                .then(res => setOrders(res.data))
                .catch(err => console.error("Ошибка загрузки последних заказов:", err));
        }
    }, [user]);

    if (!user) {
        return null;
    }

    return (
        <div>
            <h2 className="profile-greeting">Приветствуем, {user.fullname}!</h2>

            <div className="profile-quick-links">
                <Link to="/profile/edit" className="quick-link-item">
                    <PersonIcon />
                    <span>Мой профиль</span>
                </Link>
                <Link to="/profile/orders" className="quick-link-item">
                    <ListIcon />
                    <span>Заказы</span>
                </Link>
                <Link to="/profile/address" className="quick-link-item">
                    <GeoIcon />
                    <span>Мои адреса</span>
                </Link>
                <Link to="/profile/edit" className="quick-link-item">
                    <EditIcon />
                    <span>Редактировать профиль</span>
                </Link>
                <Link to="/favorites" className="quick-link-item">
                    <StarIcon />
                    <span>Избранные товары</span>
                </Link>
                <div className="quick-link-item" onClick={() => logOutUser(navigate)} style={{cursor: 'pointer'}}>
                    <ExitIcon />
                    <span>Выход</span>
                </div>
            </div>

            <div className="current-orders">
                <h3 className="current-orders-title">Последние заказы</h3>
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
                                <td>{order.totalPrice.toLocaleString()} ₽</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>У вас пока нет заказов.</p>
                )}
            </div>
        </div>
    );
};

export default ProfileDashboard;