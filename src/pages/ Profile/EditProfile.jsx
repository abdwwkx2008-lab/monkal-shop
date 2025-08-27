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

    const onSubmit = (data) => {
        updateUser({
            fullname: data.fullname,
            phone: data.phone
        }).then((updatedUser) => {
            toast.success("Профиль успешно обновлен!");
            // Теперь нет необходимости вручную сбрасывать форму,
            // так как user в контексте уже обновлен, и useEffect сработает.
        }).catch((err) => {
            toast.error(err.response?.data?.message || "Не удалось обновить профиль");
        });
    };

    if (!user) {
        return <p>Загрузка...</p>;
    }

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