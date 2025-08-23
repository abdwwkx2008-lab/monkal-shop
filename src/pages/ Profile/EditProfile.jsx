import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { CustomContext } from '../../store/store';
import { toast } from 'react-toastify';

const EditProfile = () => {
    const { user, updateUser } = useContext(CustomContext);
    const { register, handleSubmit } = useForm({
        defaultValues: {
            fullname: user?.fullname || '',
            email: user?.email || '',
            phone: user?.phone || ''
        }
    });

    const onSubmit = (data) => {
        updateUser({
            fullname: data.fullname,
            phone: data.phone
        }).then(() => {
            toast.success("Профиль успешно обновлен!");
        });
    };

    if (!user) return <p>Загрузка...</p>;

    return (
        <div>
            <h2 className="profile-content-title">Редактировать профиль</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
                <div className="form-group">
                    <label>Полное имя</label>
                    <input {...register('fullname')} type="text" />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input {...register('email')} type="email" disabled />
                </div>
                <div className="form-group">
                    <label>Телефон</label>
                    <input {...register('phone')} type="tel" />
                </div>
                <button type="submit" className="profile-form-btn">Сохранить изменения</button>
            </form>
        </div>
    );
};

export default EditProfile;