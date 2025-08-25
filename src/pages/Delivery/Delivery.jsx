import React from 'react';
import './Delivery.css';
import yandex from '/public/assets/yandex.png'
const Delivery = () => {
    return (
        <section className="delivery-section">
            <div className="delivery-container">
                <div className="delivery-hero">
                    <h1 className="delivery-title">Доставка</h1>
                    <p className="delivery-subtitle">
                        Быстро и надежно доставим ваш заказ в любую точку.
                    </p>
                </div>

                <div className="delivery-methods-container">
                    <div className="info-card">
                        <div className="info-card-icon yandex-go">
                            <img className='yandex-logo' src={yandex} alt=""/>
                        </div>
                        <div className="info-card-content">
                            <h3 className="info-card-title">Яндекс Go доставка</h3>
                            <p className="info-card-text">Мы передадим ваш заказ водителю Яндекс Go. Доставка осуществляется в кратчайшие сроки после подтверждения.</p>
                            <div className="price-details">
                                <div className="price-item">
                                    <span className="price-label">По городу Джалал-Абад</span>
                                    <span className="price-value free">100</span>
                                </div>
                                <div className="price-item">
                                    <span className="price-label">За пределы города</span>
                                    <span className="price-value">Смотря куда</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="info-card-icon self-pickup">
                            <svg viewBox="0 0 24 24"><path d="M12,2a8,8,0,0,0-8,8c0,5.4,7,11.5,7.35,11.86a1,1,0,0,0,1.3,0C13,21.5,20,15.4,20,10A8,8,0,0,0,12,2Zm0,11a3,3,0,1,1,3-3A3,3,0,0,1,12,13Z"/></svg>
                        </div>
                        <div className="info-card-content">
                            <h3 className="info-card-title">Самовывоз</h3>
                            <p className="info-card-text">Вы можете забрать свой заказ самостоятельно из нашего пункта выдачи. Мы свяжемся с вами, когда заказ будет готов к выдаче.</p>
                            <div className="price-details">
                                <div className="price-item">
                                    <span className="price-label">Адрес пункта выдачи</span>
                                    <span className="price-value">ул.Тургенева 9</span>
                                </div>
                                <div className="price-item">
                                    <span className="price-label">Стоимость</span>
                                    <span className="price-value free">Бесплатно</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Delivery;