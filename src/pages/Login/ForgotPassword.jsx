import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Login.css';

const ForgotPassword = () => {
    const { handleSubmit, register, formState: { errors, isValid } } = useForm({ mode: 'onBlur' });

    const submitEmail = (data) => {
        axios.post("http://localhost:8080/forgot-password", data)
            .then(() => {
                toast.success("Ссылка для сброса пароля отправлена на вашу почту!");
            })
            .catch(() => {
                toast.error("Произошла ошибка. Попробуйте снова.");
            });
    };

    return (
        <div className="auth-page-wrapper">
            <form onSubmit={handleSubmit(submitEmail)} noValidate className="auth-form">
                <h1 className="auth-form-title">Восстановить пароль</h1>
                <p className="auth-form-subtitle">Введите email, который вы использовали при регистрации</p>

                <div className="auth-form-group">
                    <label className="auth-form-label">Email</label>
                    <input
                        {...register('email', { required: 'Это поле обязательно', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Некорректный email' } })}
                        className={`auth-form-input ${errors.email ? 'invalid' : ''}`}
                        type="email" placeholder="example@mail.com"
                    />
                    {errors.email && <span className="auth-form-error">{errors.email.message}</span>}
                </div>

                <button type="submit" className="auth-form-button" disabled={!isValid}>Отправить ссылку</button>

                <p className="auth-form-switch-text">
                    Вспомнили пароль?{' '}
                    <Link to="/login" className="auth-form-link">Войти</Link>
                </p>
            </form>
        </div>
    );
};

export default ForgotPassword;