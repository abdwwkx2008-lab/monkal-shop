import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { CustomContext } from '../../store/store.jsx';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(CustomContext);

    if (loading) {
        return <div>Проверка авторизации...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
