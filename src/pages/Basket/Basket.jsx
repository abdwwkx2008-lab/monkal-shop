import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CustomContext, API_BASE_URL } from "../../store/store";
import { toast } from 'react-toastify';
import './Basket.css';

const Basket = () => {
    const { cart, setCart, user, placeOrder } = useContext(CustomContext);
    const navigate = useNavigate();
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

    function getUniqueCartId(item) {
        return `${item.id}-${item.size}`;
    }

    const incrementCount = (cartId) => {
        setCart(prevCart => prevCart.map(item => getUniqueCartId(item) === cartId ? { ...item, count: item.count + 1 } : item));
    };

    const decrementCount = (cartId) => {
        setCart(prevCart => prevCart.map(item => getUniqueCartId(item) === cartId && item.count > 1 ? { ...item, count: item.count - 1 } : item));
    };

    const removeCartItem = (cartId) => {
        setCart(prevCart => prevCart.filter(item => getUniqueCartId(item) !== cartId));
    };

    const clearCart = () => setCart([]);

    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.count), 0);
    const totalItems = cart.reduce((acc, item) => acc + item.count, 0);

    function getItemWord(count) {
        if (count % 10 === 1 && count % 100 !== 11) return 'товар';
        if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'товара';
        return 'товаров';
    }

    const handleCheckout = () => {
        if (!user) {
            toast.info("Пожалуйста, войдите в аккаунт, чтобы оформить заказ.");
            navigate('/login');
            return;
        }
        setIsCheckoutModalOpen(true);
    };

    const confirmOrder = () => {
        if (!user) {
            toast.error("Произошла ошибка авторизации.");
            setIsCheckoutModalOpen(false);
            navigate('/login');
            return;
        }

        const newOrder = {
            user_id: user.id,
            user_email: user.email,
            user_fullname: user.fullname,
            user_phone: user.phone,
            items: cart,
            total_price: totalPrice,
            created_at: new Date().toISOString()
        };

  placeOrder(newOrder)
  .then(() => {
    setCart([]);
    setIsCheckoutModalOpen(false);
    toast.success("Заказ успешно оформлен!");
    navigate('/profile/orders');
  })
  .catch((err) => {
    console.error("Ошибка при оформлении заказа:", err);
    toast.error("Не удалось оформить заказ.");
  });
  };


    if (cart.length === 0) {
        return (
            <div className="empty-basket-container">
                <div className="empty-basket-content">
                    <svg className="empty-basket-icon" viewBox="0 0 24 24"><path d="M19.5,8H17.21l-3.3-6.6a.75.75,0,0,0-1.34.66l3,6h-7.14l3-6A.75.75,0,0,0,10.13,1.4L6.79,8H4.5a.75.75,0,0,0,0,1.5h.34l.89,7.12A4,4,0,0,0,9.66,20H14.3a4,4,0,0,0,3.93-3.38L19.16,9.5h.34a.75.75,0,0,0,0-1.5Zm-4.34,9.62A2.5,2.5,0,0,1,12.72,18.5H11.24a2.5,2.5,0,0,1-2.43-2.12L8,9.5h8Z"/></svg>
                    <h2 className="empty-basket-title">Ваша корзина пуста</h2>
                    <p className="empty-basket-text">Добавьте что-нибудь, чтобы сделать её счастливой!</p>
                    <button className="empty-basket-button" onClick={() => navigate('/catalog')}>Перейти в каталог</button>
                </div>
            </div>
        );
    }

    return (
        <>
            <section className="basket-section">
                <div className="basket-container">
                    <div className="basket-header">
                        <h1 className="basket-title">Корзина</h1>
                        <button onClick={clearCart} className="clear-basket-button">Очистить корзину</button>
                    </div>
                    <div className="basket-layout">
                        <div className="basket-items-list">
                            {cart.map((item) => {
                                const uniqueId = getUniqueCartId(item);
                                return (
                                    <div key={uniqueId} className="basket-item-card">
                                        <Link to={`/product/${item.id}`} className="item-image-link">
                                            <img src={item.image} alt={item.name} className="item-image" />
                                        </Link>
                                        <div className="item-details">
                                            <Link to={`/product/${item.id}`} className="item-title-link">
                                                <p className="item-brand">{item.brand}</p>
                                                <h3 className="item-title">{item.name}</h3>
                                            </Link>
                                            <p className="item-size">Размер: {item.size}</p>
                                            <div className="item-quantity-stepper">
                                                <button onClick={() => decrementCount(uniqueId)}>-</button>
                                                <span>{item.count}</span>
                                                <button onClick={() => incrementCount(uniqueId)}>+</button>
                                            </div>
                                        </div>
                                        <div className="item-price-and-remove">
                                            <p className="item-price">{(item.price * item.count).toLocaleString()} С</p>
                                            <button onClick={() => removeCartItem(uniqueId)} className="item-remove-button">Удалить</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="order-summary-card">
                            <h2 className="summary-title">Итог заказа</h2>
                            <div className="summary-row">
                                <p>{totalItems} {getItemWord(totalItems)}</p>
                                <p>{totalPrice.toLocaleString()} C</p>
                            </div>
                            <div className="summary-row">
                                <p>Доставка по городу <br/>Жалал-Абад</p>
                                <p className="delivery-free">100 С</p>
                            </div>
                            <div className="summary-total-row">
                                <p>К оплате</p>
                                <p>{totalPrice.toLocaleString()} C</p>
                            </div>
                            <button onClick={handleCheckout} className="checkout-main-button">Перейти к оформлению</button>
                        </div>
                    </div>
                </div>
            </section>

            {isCheckoutModalOpen && (
                <div className="logout-modal-overlay">
                    <div className="logout-modal-content">
                        <h2>Подтверждение заказа</h2>
                        <p>Ваш заказ на сумму {totalPrice.toLocaleString()} С будет оформлен. Продолжить?</p>
                        <div className="logout-modal-actions">
                            <button onClick={() => setIsCheckoutModalOpen(false)} className="modal-btn-cancel">Отмена</button>
                            <button onClick={confirmOrder} className="modal-btn-confirm">Подтвердить</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Basket;