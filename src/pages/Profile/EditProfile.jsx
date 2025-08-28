import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CustomContext } from '../../store/store';
import { toast } from 'react-toastify';

const EditProfile = () => {
    const { user, updateUser } = useContext(CustomContext);
    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        if (user) {
            reset({
                fullname: user.fullname || '',
                email: user.email || '',
                phone: user.phone || ''
            });
        }
    }, [user, reset]);

    // EditProfile.jsx
    const onSubmit = (data) => {
        // ⬇️ ЛОГИ ДЛЯ ПРОВЕРКИ
        console.log("User object:", user);
        console.log("User ID:", user?.id);

        if (!user || !user.id) {
            toast.error("Пользователь не найден. Пожалуйста, войдите снова.");
            return;
        }

        updateUser(user.id, {
            fullname: data.fullname,
            phone: data.phone
        })
            .then((updatedUser) => {
                console.log("Update success:", updatedUser); // можно увидеть ответ сервера
                toast.success("Профиль успешно обновлен!");
            })
            .catch((err) => {
                console.error("Update error:", err?.response?.data || err.message);
                toast.error(err.response?.data?.message || "Не удалось обновить профиль");
            });
    };


    return (
        <div>
            <h2 className="profile-content-title">Редактировать профиль</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
                <div className="form-group"><label>Полное имя</label><input {...register('fullname')} type="text" /></div>
                <div className="form-group"><label>Email</label><input {...register('email')} type="email" disabled /></div>
                <div className="form-group"><label>Телефон</label><input {...register('phone')} type="tel" /></div>
                <button type="submit" className="profile-form-btn">Сохранить изменения</button>

            </form>
        </div>
    );
};

export default EditProfile;