import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CustomContext } from '../../store/store';
import { toast } from 'react-toastify';
import eyeOpen from '/assets/eyeOpen.png';
import eyeClosed from '/assets/eyeClosed.png';

const Login = () => {
    const navigate = useNavigate();
    const { loginUser } = useContext(CustomContext);
    const [formData, setFormData] = useState({
        login: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.login || !formData.password) {
            toast.error('Пожалуйста, заполните все поля');
            return;
        }
        loginUser(formData.login, formData.password, navigate);
    };

    return (
        <div className="auth-page-wrapper">
            <form onSubmit={handleSubmit} noValidate className="auth-form">
                <h1 className="auth-form-title">С возвращением!</h1>
                <p className="auth-form-subtitle">Введите данные для входа в аккаунт</p>

                <div className="auth-form-group">
                    <label className="auth-form-label">Email или номер телефона</label>
                    <input
                        name="login"
                        value={formData.login}
                        onChange={handleChange}
                        className="auth-form-input"
                        type="text"
                        placeholder="example@mail.com или +996..."
                    />
                </div>

                <div className="auth-form-group">
                    <label className="auth-form-label">Пароль</label>
                    <div className="password-input-wrapper">
                        <input
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
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