import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CustomContext } from '../../store/store';
import { toast } from 'react-toastify';

const EditProfile = () => {
    const { user, updateUser } = useContext(CustomContext);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({ mode: 'onBlur' });

    useEffect(() => {
        if (user) {
            reset({
                fullname: user.fullname || '',
                email: user.email || '',
                phone: user.phone || ''
            });
        }
    }, [user, reset]);

    const onSubmit = async (data) => {
        if (!user || !user.id) {
            toast.error("Пользователь не найден. Пожалуйста, войдите снова.");
            return;
        }

        try {
            const updatedUser = await updateUser(user.id, {
                fullname: data.fullname,
                phone: data.phone
            });
            toast.success("Профиль успешно обновлен!");
            reset({
                fullname: updatedUser.fullname,
                email: updatedUser.email,
                phone: updatedUser.phone
            });
        } catch (err) {
            toast.error(err.response?.data?.message || "Не удалось обновить профиль");
        }
    };

    return (
        <div>
            <h2 className="profile-content-title">Редактировать профиль</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
                <div className="form-group">
                    <label>Полное имя</label>
                    <input
                        {...register('fullname', { required: 'Введите имя' })}
                        type="text"
                        className={errors.fullname ? 'invalid' : ''}
                    />
                    {errors.fullname && <span className="form-error-message">{errors.fullname.message}</span>}
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        {...register('email')}
                        type="email"
                        disabled
                    />
                </div>

                <div className="form-group">
                    <label>Телефон</label>
                    <input
                        {...register('phone', {
                            required: 'Введите номер телефона',
                            pattern: {
                                value: /^\+996\d{9}$/,
                                message: 'Формат: +996XXXXXXXXX'
                            }
                        })}
                        type="tel"
                        className={errors.phone ? 'invalid' : ''}
                    />
                    {errors.phone && <span className="form-error-message">{errors.phone.message}</span>}
                </div>

                <button type="submit" className="profile-form-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                </button>
            </form>
        </div>
    );
};

export default EditProfile;
