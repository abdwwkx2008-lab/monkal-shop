import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { CustomContext } from '../../store/store.jsx';
import { toast } from 'react-toastify';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(CustomContext);

    if (loading) {
        return <div>Проверка авторизации...</div>;
    }

    if (!user) {
        toast.error("Пожалуйста, войдите в аккаунт для доступа в личный кабинет.");
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;