// src/pages/Register/Register.jsx

import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { CustomContext } from '../../store/store'; // Проверь правильность пути
import '../Login/Login.css'; // Не забудь создать этот файл стилей

const Register = () => {
    const { registerUser } = useContext(CustomContext);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({ mode: 'onBlur' });

    const onRegisterSubmit = (data) => {
        registerUser(data, navigate);
        reset();
    };

    return (
        <section className="register">
            <div className="container">
                <form className="register__form" onSubmit={handleSubmit(onRegisterSubmit)} noValidate>

                    <h2 className="register__title">Регистрация</h2>

                    <p className="register__subtitle">
                        Пожалуйста, введите ваши настоящие данные.
                        Мы свяжемся с вами для подтверждения заказа.
                    </p>

                    <div className="register__form-group">
                        <input
                            {...register('fullname', { required: "Имя и фамилия обязательны" })}
                            className={`register__form-input ${errors.fullname ? 'invalid' : ''}`}
                            type="text"
                            placeholder="Имя и фамилия"
                        />
                        {errors.fullname && <p className="error-message">{errors.fullname.message}</p>}
                    </div>

                    <div className="register__form-group">
                        <input
                            {...register('email', {
                                required: "E-mail обязателен",
                                pattern: {
                                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                    message: "Введите корректный e-mail"
                                }
                            })}
                            className={`register__form-input ${errors.email ? 'invalid' : ''}`}
                            type="email"
                            placeholder="E-mail"
                        />
                        {errors.email && <p className="error-message">{errors.email.message}</p>}
                    </div>

                    <div className="register__form-group">
                        <input
                            {...register('password', {
                                required: "Пароль обязателен",
                                minLength: {
                                    value: 6,
                                    message: "Пароль должен быть не менее 6 символов"
                                }
                            })}
                            className={`register__form-input ${errors.password ? 'invalid' : ''}`}
                            type="password"
                            placeholder="Пароль"
                        />
                        {errors.password && <p className="error-message">{errors.password.message}</p>}
                    </div>

                    <button className="register__form-btn" type="submit">Зарегистрироваться</button>

                </form>
            </div>
        </section>
    );
};

export default Register;