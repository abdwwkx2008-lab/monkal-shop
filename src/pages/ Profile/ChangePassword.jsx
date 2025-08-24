import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { CustomContext } from '../../store/store';
import eyeOpen from '/assets/eyeOpen.png';
import eyeClosed from '/assets/eyeClosed.png';

const ChangePassword = () => {
    const { user, updateUser } = useContext(CustomContext);
    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm({ mode: 'onBlur' });
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = (data) => {
        if (!user || !user.password) {
            toast.error("Не удалось проверить старый пароль.");
            return;
        }

        // Эта проверка не будет работать, т.к. на фронтенде нет реального пароля
        // Логику проверки старого пароля нужно будет перенести на бэкенд
        // if (user.password !== data.oldPassword) {
        //     toast.error("Старый пароль введен неверно.");
        //     return;
        // }

        updateUser({ password: data.newPassword })
            .then(() => {
                toast.success("Пароль успешно изменен!");
                reset();
            });
    };

    if (!user) {
        return <p>Загрузка...</p>;
    }

    return (
        <div>
            <h2 className="profile-content-title">Смена пароля</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
                <div className="form-group">
                    <label>Старый пароль</label>
                    <input {...register('oldPassword', { required: 'Это поле обязательно' })} type={showPassword ? 'text' : 'password'} />
                    {errors.oldPassword && <p className="form-error-message">{errors.oldPassword.message}</p>}
                </div>
                <div className="form-group">
                    <label>Новый пароль</label>
                    <div className="password-input-wrapper">
                        <input {...register('newPassword', { required: 'Это поле обязательно', minLength: { value: 6, message: 'Минимум 6 символов' } })} type={showPassword ? 'text' : 'password'} />
                        <img src={showPassword ? eyeClosed : eyeOpen} alt="Toggle password" className="password-eye-icon" onClick={() => setShowPassword(prev => !prev)} />
                    </div>
                    {errors.newPassword && <p className="form-error-message">{errors.newPassword.message}</p>}
                </div>
                <div className="form-group">
                    <label>Повторите новый пароль</label>
                    <div className="password-input-wrapper">
                        <input {...register('confirmPassword', { required: 'Это поле обязательно', validate: (value) => value === watch('newPassword') || 'Пароли не совпадают' })} type={showPassword ? 'text' : 'password'} />
                        <img src={showPassword ? eyeClosed : eyeOpen} alt="Toggle password" className="password-eye-icon" onClick={() => setShowPassword(prev => !prev)} />
                    </div>
                    {errors.confirmPassword && <p className="form-error-message">{errors.confirmPassword.message}</p>}
                </div>
                <button type="submit" className="profile-form-btn">Сохранить</button>
            </form>
        </div>
    );
};

export default ChangePassword;