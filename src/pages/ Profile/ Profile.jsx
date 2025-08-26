import React, { useContext, useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { CustomContext } from '../../store/store';
import './Profile.css';

const Profile = () => {
    const { user, logOutUser } = useContext(CustomContext);
    const navigate = useNavigate();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    useEffect(() => {
        if (user === null) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };

    const confirmLogout = () => {
        logOutUser();
        setIsLogoutModalOpen(false);
    };

    if (!user) {
        return <div>Загрузка профиля...</div>;
    }

    return (
        <>
            <div className="profile-container">
                <h1 className="profile-title">ЛИЧНЫЙ КАБИНЕТ</h1>
                <div className="profile-layout">
                    <aside className="profile-sidebar">
                        <nav className="profile-sidebar-nav">
                            <NavLink to="/profile" end>Мой аккаунт</NavLink>
                            <NavLink to="/profile/edit">Редактировать профиль</NavLink>
                            <NavLink to="/profile/orders">История заказов</NavLink>
                            <NavLink to="/profile/password">Пароль</NavLink>
                            <button onClick={handleLogoutClick} className="profile-logout-btn">Выход</button>
                        </nav>
                    </aside>
                    <main className="profile-content">
                        <Outlet />
                    </main>
                </div>
            </div>

            {isLogoutModalOpen && (
                <div className="logout-modal-overlay">
                    <div className="logout-modal-content">
                        <h2>Подтверждение</h2>
                        <p>Вы действительно хотите выйти из аккаунта?</p>
                        <div className="logout-modal-actions">
                            <button onClick={() => setIsLogoutModalOpen(false)} className="modal-btn-cancel">Отмена</button>
                            <button onClick={confirmLogout} className="modal-btn-confirm">Выйти</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Profile;