import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CustomContext } from '../../store/CustomContext.js';
import eyeOpen from '/assets/eyeOpen.png';
import eyeClosed from '/assets/eyeClosed.png';

const Login = () => {

    const navigate = useNavigate();
    const { loginUser } = useContext(CustomContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Пожалуйста, заполните все поля');
            return;
        }


        loginUser({ email, password })
            .then(() => {

                navigate('/');
            })
            .catch((err) => {

                console.error("Ошибка входа:", err);
            });
    };

    return (
        <div className="auth-page-wrapper">
            <form onSubmit={handleSubmit} noValidate className="auth-form">
                <h1 className="auth-form-title">С возвращением!</h1>
                <p className="auth-form-subtitle">Введите данные для входа в аккаунт</p>

                <div className="auth-form-group">
                    <label className="auth-form-label">Email</label>
                    <input
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="auth-form-input"
                        type="email"
                        placeholder="example@mail.com"
                    />
                </div>

                <div className="auth-form-group">
                    <label className="auth-form-label">Пароль</label>
                    <div className="password-input-wrapper">
                        <input
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="auth-form-input"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                        />
                        <img
                            src={showPassword ? eyeClosed : eyeOpen}
                            alt="Toggle password"
                            className="password-eye-icon"
                            onClick={() => setShowPassword(prev => !prev)}
                        />
                    </div>
                </div>

                <Link to="/forgot-password" className="auth-form-link forgot-password-link">Забыли пароль?</Link>

                <button type="submit" className="auth-form-button">Войти</button>

                <p className="auth-form-switch-text">
                    Нет аккаунта?{' '}
                    <Link to="/register" className="auth-form-link">Зарегистрироваться</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;