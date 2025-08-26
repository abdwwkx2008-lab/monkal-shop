import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { CustomContext } from '../../store/store';

const ChangePassword = () => {
    const { changePassword } = useContext(CustomContext);
    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm({ mode: 'onBlur' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = (data) => {
        setIsSubmitting(true);
        changePassword({ oldPassword: data.oldPassword, newPassword: data.newPassword })
            .then(() => {
                toast.success("Пароль успешно изменен!");
                reset();
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || "Произошла ошибка");
            })
            .finally(() => setIsSubmitting(false));
    };

    return (
        <div>
            <h2 className="profile-content-title">Смена пароля</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
                <div className="form-group">
                    <label>Старый пароль</label>
                    <input {...register('oldPassword', { required: 'Это поле обязательно' })} type="password" />
                    {errors.oldPassword && <p className="form-error-message">{errors.oldPassword.message}</p>}
                </div>
                <div className="form-group">
                    <label>Новый пароль</label>
                    <input {...register('newPassword', { required: 'Это поле обязательно', minLength: { value: 6, message: 'Минимум 6 символов' } })} type="password" />
                    {errors.newPassword && <p className="form-error-message">{errors.newPassword.message}</p>}
                </div>
                <div className="form-group">
                    <label>Повторите новый пароль</label>
                    <input {...register('confirmPassword', { required: 'Это поле обязательно', validate: (value) => value === watch('newPassword') || 'Пароли не совпадают' })} type="password" />
                    {errors.confirmPassword && <p className="form-error-message">{errors.confirmPassword.message}</p>}
                </div>
                <button type="submit" className="profile-form-btn" disabled={isSubmitting}>
                    {isSubmitting ? "Сохранение..." : "Сохранить"}
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;