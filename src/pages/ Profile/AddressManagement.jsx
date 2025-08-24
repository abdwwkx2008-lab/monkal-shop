import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { CustomContext } from '../../store/store';
import { toast } from 'react-toastify';

// Получаем API_BASE_URL из контекста
const { API_BASE_URL } = CustomContext;

const AddressManagement = () => {
    const { user } = useContext(CustomContext);
    const [addresses, setAddresses] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const { register, handleSubmit, reset, setValue } = useForm();

    const fetchAddresses = () => {
        if (user && user.id) {
            // ИСПОЛЬЗУЕМ ПРАВИЛЬНЫЙ АДРЕС
            axios(`${API_BASE_URL}/addresses?userId=${user.id}`)
                .then(res => setAddresses(res.data));
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, [user]);

    const handleFormSubmit = (data) => {
        const addressData = { ...data, userId: user.id };
        const request = editingAddress
            // ИСПОЛЬЗУЕМ ПРАВИЛЬНЫЙ АДРЕС
            ? axios.patch(`${API_BASE_URL}/addresses/${editingAddress.id}`, addressData)
            : axios.post(`${API_BASE_URL}/addresses`, addressData);

        request.then(() => {
            toast.success(editingAddress ? "Адрес обновлен" : "Адрес добавлен");
            fetchAddresses();
            closeForm();
        }).catch(err => {
            toast.error("Произошла ошибка");
            console.error(err);
        });
    };

    // ... остальной код компонента без изменений ...

    const deleteAddress = (id) => {
        if (window.confirm("Вы уверены, что хотите удалить этот адрес?")) {
            // ИСПОЛЬЗУЕМ ПРАВИЛЬНЫЙ АДРЕС
            axios.delete(`${API_BASE_URL}/addresses/${id}`)
                .then(() => {
                    toast.success("Адрес удален");
                    fetchAddresses();
                });
        }
    };

    // ... остальной код компонента без изменений ...
};

export default AddressManagement;