import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { CustomContext } from '../../store/store';
import './Register.css';

const Register = () => {
    const { registerUser } = useContext(CustomContext);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset } = useForm({ mode: 'onBlur' });

    const onSubmit = (data) => {
        registerUser(data, navigate);
        reset();
    };

    return (
        <section className="register">
            <div className="container">
                <form className="register__form" onSubmit={handleSubmit(onSubmit)}>
                    <h2 className="register__title">Регистрация</h2>
                    <p className="register__subtitle">
                        Пожалуйста, введите ваши настоящие данные.
                        Они будут использованы для оформления заказа.
                    </p>

                    <input
                        {...register('fullname', { required: "Это поле обязательно" })}
                        className="register__form-input"
                        type="text"
                        placeholder="Имя и фамилия"
                    />
                    {errors.fullname && <p className="error-message">{errors.fullname.message}</p>}

                    <input
                        {...register('email', { required: "Это поле обязательно" })}
                        className="register__form-input"
                        type="email"
                        placeholder="E-mail"
                    />
                    {errors.email && <p className="error-message">{errors.email.message}</p>}

                    <input
                        {...register('password', { required: "Это поле обязательно", minLength: { value: 6, message: "Минимум 6 символов" } })}
                        className="register__form-input"
                        type="password"
                        placeholder="Пароль"
                    />
                    {errors.password && <p className="error-message">{errors.password.message}</p>}

                    <button className="register__form-btn" type="submit">Зарегистрироваться</button>

                    <p className="register__link-text">
                        Уже есть аккаунт? <Link to="/login">Войти</Link>
                    </p>
                </form>
            </div>
        </section>
    );
};

export default Register;