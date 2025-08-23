import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import eyeOpen from '/public/assets/eyeOpen.png';
import eyeClosed from '/public/assets/eyeClosed.png';
import './Login.css';

const ResetPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { handleSubmit, register, watch, formState: { errors, isValid } } = useForm({ mode: 'onBlur' });
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const submitNewPassword = (data) => {
        axios.post("http://localhost:8080/reset-password", { token, password: data.password })
            .then(() => {
                toast.success("Пароль успешно изменен!");
                navigate('/login');
            })
            .catch(() => {
                toast.error("Ссылка недействительна или срок ее действия истек.");
            });
    };

    if (!token) {
        return <p>Неверная ссылка для сброса пароля.</p>;
    }

    return (
        <div className="auth-page-wrapper">
            <form onSubmit={handleSubmit(submitNewPassword)} noValidate className="auth-form">
                <h1 className="auth-form-title">Создайте новый пароль</h1>
                <p className="auth-form-subtitle">Ваш новый пароль должен отличаться от старого</p>

                <div className="auth-form-group">
                    <label className="auth-form-label">Новый пароль</label>
                    <div className="password-input-wrapper">
                        <input
                            {...register("password", { required: 'Это поле обязательно', minLength: { value: 6, message: 'Минимум 6 символов' } })}
                            className={`auth-form-input ${errors.password ? 'invalid' : ''}`}
                            type={showPassword ? "text" : "password"} placeholder='••••••••'
                        />
                        <img
                            src={showPassword ? eyeClosed : eyeOpen}
                            alt="toggle password" className="password-eye-icon"
                            onClick={() => setShowPassword(prev => !prev)}
                        />
                    </div>
                    {errors.password && <span className="auth-form-error">{errors.password.message}</span>}
                </div>

                <div className="auth-form-group">
                    <label className="auth-form-label">Повторите новый пароль</label>
                    <input
                        {...register("confirmPassword", { required: 'Это поле обязательно', validate: (value) => value === watch("password") || "Пароли не совпадают" })}
                        className={`auth-form-input ${errors.confirmPassword ? 'invalid' : ''}`}
                        type="password" placeholder='••••••••'
                    />
                    {errors.confirmPassword && <span className="auth-form-error">{errors.confirmPassword.message}</span>}
                </div>

                <button type="submit" className="auth-form-button" disabled={!isValid}>Сбросить пароль</button>
            </form>
        </div>
    );
};

export default ResetPassword;