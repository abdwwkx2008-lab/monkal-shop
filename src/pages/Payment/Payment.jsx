import React, { useState } from 'react';
import { toast } from 'react-toastify';
import qr from '/public/assets/asad.mbank.jpg';
import './Payment.css';

const Payment = () => {
    const [copyButtonText, setCopyButtonText] = useState('Копировать');
    const phoneNumber = '+996557220308';

    const handleCopyClick = () => {
        navigator.clipboard.writeText(phoneNumber);
        setCopyButtonText('Готово!');
        toast.success('Номер телефона скопирован!');
        setTimeout(() => {
            setCopyButtonText('Копировать');
        }, 2000);
    };

    return (
        <section className="payment-page-section">
            <div className="payment-layout-grid">
                <div className="payment-instructions-column">
                    <h1 className="instructions-title">Как оплатить заказ</h1>
                    <p className="instructions-subtitle">
                        Это займет не больше минуты. Следуйте простым шагам:
                    </p>
                    <div className="steps-container">
                        <div className="step-item">
                            <div className="step-number">1</div>
                            <div className="step-text-content">
                                <h3 className="step-title">Откройте приложение</h3>
                                <p className="step-description">Запустите Mbank или приложение другого банка на вашем телефоне.</p>
                            </div>
                        </div>
                        <div className="step-item">
                            <div className="step-number">2</div>
                            <div className="step-text-content">
                                <h3 className="step-title">Найдите сканер QR</h3>
                                <p className="step-description">Перейдите в раздел "Оплата по QR" или "Сканировать QR-код".</p>
                            </div>
                        </div>
                        <div className="step-item">
                            <div className="step-number">3</div>
                            <div className="step-text-content">
                                <h3 className="step-title">Отсканируйте код</h3>
                                <p className="step-description">Наведите камеру на QR-код, который вы видите на этой странице справа.</p>
                            </div>
                        </div>
                        <div className="step-item">
                            <div className="step-number">4</div>
                            <div className="step-text-content">
                                <h3 className="step-title">Подтвердите перевод</h3>
                                <p className="step-description">Введите сумму вашего заказа и подтвердите платеж. Готово!</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="payment-details-column">
                    <div className="payment-details-card">
                        <div className="qr-display-wrapper">
                            <img className='qr' src={qr} alt="QR Code для оплаты" />
                        </div>
                        <div className="recipient-info-block">
                            <p className="recipient-label">Получатель</p>
                            <p className="recipient-name">Асад.П</p>
                        </div>
                        <div className="phone-info-block">
                            <p className="phone-info-label">Или по номеру телефона</p>
                            <div className="phone-number-box">
                                <p className="phone-number">{phoneNumber}</p>
                                <button onClick={handleCopyClick} className={`copy-button ${copyButtonText === 'Готово!' ? 'copied' : ''}`}>
                                    {copyButtonText}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Payment;