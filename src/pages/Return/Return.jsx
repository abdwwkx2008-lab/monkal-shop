import React from 'react';
import { Link } from 'react-router-dom';
import './Return.css';

const Return = () => {
    return (
        <section className="return-section">
            <div className="return-container">
                <div className="return-hero">
                    <h1 className="return-title">Политика возврата</h1>
                    <p className="return-subtitle">
                        Мы ценим ваше доверие. Если товар вам не подошел, мы поможем <br/>
                        оформить возврат в соответствии с нашими правилами.
                    </p>
                    <br/>
                    <p className="return-subtitle">
                        Чтобы избежать возврата, укажите свои точные размеры.
                        Вы можете перейти в <Link to='/Size'>Таблицу размеров</Link> и подобрать подходящий вариант.
                    </p>


                </div>

                <div className="return-grid">
                    <div className="return-card">
                        <div className="return-card-icon">
                            <svg viewBox="0 0 24 24"><path d="M12,2A10,10,0,1,0,22,10,10,10,0,0,0,12,2Zm5.71,7.29a1,1,0,0,1,0,1.42l-6,6a1,1,0,0,1-1.42,0l-3-3a1,1,0,0,1,1.42-1.42L10,14.59l5.29-5.3a1,1,0,0,1,1.42,0Z"/></svg>
                        </div>
                        <h3 className="return-card-title">Условия возврата</h3>
                        <ul className="return-list">
                            <li>Возврат возможен в течение <strong>3 дней</strong> с момента получения заказа.</li>
                            <li>Товар должен сохранить свой <strong>первоначальный вид</strong>, все фабричные ярлыки и оригинальную упаковку.</li>
                            <li>Товары со следами носки, стирки или любыми повреждениями, возникшими по вине покупателя, к возврату <strong>не принимаются</strong>.</li>
                        </ul>
                    </div>

                    <div className="return-card">
                        <div className="return-card-icon">
                            <svg viewBox="0 0 24 24"><path d="M19,2H5A3,3,0,0,0,2,5V15a3,3,0,0,0,3,3H16.59l3.7,3.71A1,1,0,0,0,21,22a.84.84,0,0,0,.38-.08A1,1,0,0,0,22,21V5A3,3,0,0,0,19,2ZM8,13a1,1,0,1,1,1-1A1,1,0,0,1,8,13Zm4,0a1,1,0,1,1,1-1A1,1,0,0,1,12,13Zm4,0a1,1,0,1,1,1-1A1,1,0,0,1,16,13Z"/></svg>
                        </div>
                        <h3 className="return-card-title">Процесс возврата</h3>
                        <ol className="return-list">
                            <li><strong>Свяжитесь с нами.</strong> Перейдите на страницу <Link to="/contact" className="return-link">Контакты</Link> и сообщите нашему менеджеру о вашем желании вернуть товар.</li>
                            <li><strong>Подготовьте товар.</strong> Убедитесь, что товар соответствует всем условиям возврата, и аккуратно упакуйте его.</li>
                            <li><strong>Передайте товар.</strong> Наш менеджер согласует с вами удобный способ передачи товара.</li>
                        </ol>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Return;