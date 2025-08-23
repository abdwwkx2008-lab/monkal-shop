import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { CustomContext } from '../../store/store';
import { toast } from 'react-toastify';

const AddressManagement = () => {
    const { user } = useContext(CustomContext);
    const [addresses, setAddresses] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const { register, handleSubmit, reset, setValue } = useForm();

    const fetchAddresses = () => {
        if (user.id) {
            axios(`http://localhost:8080/addresses?userId=${user.id}`)
                .then(res => setAddresses(res.data));
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, [user.id]);

    const handleFormSubmit = (data) => {
        const addressData = { ...data, userId: user.id };

        const request = editingAddress
            ? axios.patch(`http://localhost:8080/addresses/${editingAddress.id}`, addressData)
            : axios.post('http://localhost:8080/addresses', addressData);

        request.then(() => {
            toast.success(editingAddress ? "Адрес обновлен" : "Адрес добавлен");
            fetchAddresses();
            closeForm();
        }).catch(err => {
            toast.error("Произошла ошибка");
            console.error(err);
        });
    };

    const openEditForm = (address) => {
        setEditingAddress(address);
        setValue('city', address.city);
        setValue('street', address.street);
        setIsFormVisible(true);
    };

    const deleteAddress = (id) => {
        if (window.confirm("Вы уверены, что хотите удалить этот адрес?")) {
            axios.delete(`http://localhost:8080/addresses/${id}`)
                .then(() => {
                    toast.success("Адрес удален");
                    fetchAddresses();
                });
        }
    };

    const closeForm = () => {
        setIsFormVisible(false);
        setEditingAddress(null);
        reset();
    };

    return (
        <div>
            <h2 className="profile-content-title">Мои адреса</h2>

            {!isFormVisible && (
                <button onClick={() => setIsFormVisible(true)} className="add-address-btn">
                    Добавить новый адрес
                </button>
            )}

            {isFormVisible && (
                <form onSubmit={handleSubmit(handleFormSubmit)} className="profile-form address-form">
                    <h3>{editingAddress ? 'Редактировать адрес' : 'Новый адрес'}</h3>
                    <div className="form-group">
                        <label>Город</label>
                        <input {...register('city', { required: true })} type="text" placeholder="г. Бишкек"/>
                    </div>
                    <div className="form-group">
                        <label>Улица, дом, квартира</label>
                        <input {...register('street', { required: true })} type="text" placeholder="ул. Исанова, д. 105, кв. 34"/>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="profile-form-btn">Сохранить</button>
                        <button type="button" onClick={closeForm} className="profile-form-btn-cancel">Отмена</button>
                    </div>
                </form>
            )}

            <div className="address-list">
                {addresses.length === 0 && !isFormVisible && (
                    <p>У вас пока нет сохраненных адресов.</p>
                )}
                {addresses.map(addr => (
                    <div key={addr.id} className="address-card">
                        <h4>{addr.city}</h4>
                        <p>{addr.street}</p>
                        <div className="address-card-actions">
                            <button onClick={() => openEditForm(addr)}>Редактировать</button>
                            <button onClick={() => deleteAddress(addr.id)} className="btn-delete">Удалить</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AddressManagement;