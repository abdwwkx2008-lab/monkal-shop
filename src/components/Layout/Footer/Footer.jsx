import React, { useContext } from 'react';
import './Footer.css';
import { Link, useNavigate } from 'react-router-dom';
import { CustomContext } from '../../../store/store.jsx';

import Tg from '/assets/tg.icon.svg';
import WhatsApp from '/assets/whatsApp.icon.svg';
import Inst from '/assets/inst.icon2.png';
import Footerlogo from '/assets/header-monkal-logo-removebg-preview.png';

function Footer() {
    const { user, logOutUser } = useContext(CustomContext);
    const navigate = useNavigate();

    return (
        <footer className="footer">
            <div className="footer-container">

                <div className="footer-box">
                    <Link to='catalog' className="footer-title">
                        КАТАЛОГ
                    </Link>
                    <Link to='/odejdacatalog' className="footer-link">Одежда</Link>
                    <Link to='/shoescatalog' className="footer-link">Обувь</Link>
                    <Link to='/aksesuarycatalog' className="footer-link">Аксессуары</Link>
                    <img src={Footerlogo} alt="" className="footer-logo"/>
                </div>

                <div className="footer-box">
                    <Link to='info' className="footer-title">
                        ИНФОРМАЦИЯ
                    </Link>
                    <Link to="contact" className="footer-link">Контакты</Link>
                    <Link to="delivery" className="footer-link">Доставка</Link>
                    <Link to="payment" className="footer-link">Оплата</Link>
                    <Link to="faq" className="footer-link">FAQ</Link>
                </div>

                <div className="footer-box">
                    <Link to='contact' className="footer-title">
                        КОНТАКТЫ
                    </Link>
                    <a href="mailto:mline@gmail.com" className="footer-link">mline@gmail.com</a>
                    <a href="tel:+996559242417" className="footer-link">+996557220308</a>
                    <h2 className="footer-title">МЕССЕНДЖЕРЫ</h2>
                    <div className="messenger-box">
                        <a href="https://t.me/996557220308" className="messenger-link" target="_blank" rel="noopener noreferrer">
                            <img src={Tg} alt="Telegram" className="messenger-img" />
                        </a>
                        <a href="https://wa.me/996557220308" className="messenger-link" target="_blank" rel="noopener noreferrer">
                            <img src={WhatsApp} alt="WhatsApp" className="messenger-img" />
                        </a>
                    </div>
                    <h2 className="footer-title">НАШИ СОЦ.СЕТИ</h2>
                    <a href="https://www.instagram.com/monkal.kg/" className="messenger-link" target="_blank" rel="noopener noreferrer">
                        <img src={Inst} alt="Instagram" className="messenger-img" />
                    </a>
                </div>

                <div className="footer-box login-box">
                    {user && user.email ? (
                        <>
                            <Link to="/profile" className="footer-title">АККАУНТ</Link>
                            <p className="footer-link">Добро пожаловать, {user.fullname}!</p>
                            <Link to="/orders" className="footer-link">Мои заказы</Link>
                            <Link to="/favorites" className="footer-link">Избранное</Link>
                            <button onClick={() => logOutUser(navigate)} className="footer-button">Выйти</button>
                        </>
                    ) : (
                        <>
                            <h2 className="footer-title">АККАУНТ</h2>
                            <p className="footer-link">Войдите в аккаунт, чтобы просматривать заказы, избранное и историю.</p>
                            <Link to="/login" className="footer-button">Войти</Link>
                            <p className="footer-link">
                                Нет аккаунта? <Link to="/register" className="register-link">Зарегистрируйтесь</Link>
                            </p>
                        </>
                    )}
                    <Link to='/politika' className='politika-link'>ПОЛИТИКА КОНФЕДЕНЦИАЛЬНОСТИ</Link>
                </div>
            </div>

            <div className="footer-bottom">
                <img src={Footerlogo} alt="" className="footer-logo"/>
                <Link to='/politika' className='politika-link'>ПОЛИТИКА КОНФЕДЕНЦИАЛЬНОСТИ</Link>
            </div>
        </footer>
    );
}

export default Footer;