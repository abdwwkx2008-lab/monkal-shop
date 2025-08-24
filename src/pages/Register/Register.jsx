import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { CustomContext } from '../../store/store';
import { toast } from 'react-toastify';
import './Register.css';

const Register = () => {
    const { startRegistration } = useContext(CustomContext);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onBlur' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = (data) => {
        setIsSubmitting(true);
        startRegistration(data)
            .then(() => {
                toast.success("Код подтверждения отправлен на вашу почту!");
                navigate(`/verify-email?email=${data.email}`);
            })
            .catch((err) => {
                const message = err.response?.data?.message || "Ошибка при регистрации";
                toast.error(message);
            })
            .finally(() => setIsSubmitting(false));
    };

    return (
        <section className="register">
            <div className="container">
                <form className="register__form" onSubmit={handleSubmit(onSubmit)}>
                    <h2 className="register__title">Создать аккаунт</h2>
                    <p className="register__subtitle">
                        Введите ваши данные, и мы отправим 6-значный код подтверждения на ваш e-mail.
                    </p>
                    <input {...register('fullname', { required: true })} placeholder="Имя и фамилия" />
                    <input {...register('email', { required: true })} type="email" placeholder="E-mail" />
                    <input {...register('password', { required: true, minLength: 6 })} type="password" placeholder="Пароль" />
                    <button type="submit" className="register__form-btn" disabled={isSubmitting}>
                        {isSubmitting ? "Отправка..." : "Получить код"}
                    </button>
                    <p className="register__link-text">
                        Уже есть аккаунт? <Link to="/login">Войти</Link>
                    </p>
                </form>
            </div>
        </section>
    );
};

export default Register;