import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { CustomContext } from '../../store/store';
import { toast } from 'react-toastify';
import './VerifyEmail.css';

const VerifyEmail = () => {
    const { verifyRegistration } = useContext(CustomContext);
    const navigate = useNavigate();
    const location = useLocation();
    const email = new URLSearchParams(location.search).get('email');
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onBlur' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = (data) => {
        setIsSubmitting(true);
        verifyRegistration({ email, code: data.code })
            .then(() => {
                toast.success("Регистрация успешно завершена! Теперь вы можете войти.");
                navigate('/login');
            })
            .catch((err) => {
                const message = err.response?.data?.message || "Ошибка при проверке кода";
                toast.error(message);
            })
            .finally(() => setIsSubmitting(false));
    };

    if (!email) {
        return <p>Ошибка: email не найден. Попробуйте начать регистрацию заново.</p>;
    }

    return (
        <section className="verify-email">
            <div className="container">
                <form className="verify-email__form" onSubmit={handleSubmit(onSubmit)}>
                    <h2 className="verify-email__title">Подтвердите ваш e-mail</h2>
                    <p className="verify-email__subtitle">
                        Мы отправили 6-значный код на <strong>{email}</strong>. Введите его ниже.
                    </p>
                    <input
                        {...register('code', { required: true, minLength: 6, maxLength: 6 })}
                        placeholder="______"
                        className="verify-email__code-input"
                    />
                    <button type="submit" className="verify-email__btn" disabled={isSubmitting}>
                        {isSubmitting ? "Проверка..." : "Подтвердить"}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default VerifyEmail;