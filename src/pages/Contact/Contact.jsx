import React from 'react';
import './Contact.css';

import gmail from '/public/assets/gmail.logo.png';
import adres from '/public/assets/adres.logo.png';
import whatsapp from '/public/assets/whatsApp.icon.svg';
import tg from '/public/assets/tg.icon.svg';
import inst from '/public/assets/inst.icon.png';

const Contact = () => {
    return (
        <section className='contact-section'>
            <div className="contact-container">
                <div className="contact-hero">
                    <h1 className="contact-main-title">Наши контакты</h1>
                    <p className="contact-subtitle">Свяжитесь с нами для получения дополнительной информации и консультации.</p>
                </div>

                <div className="contact-layout-grid">
                    <div className="contact-details-column">
                        <div className="contact-info-group">
                            <h3 className="contact-group-title">КОНТАКТЫ</h3>
                            <div className="contact-item">
                                <div className="contact-item-icon">
                                    <img src={gmail} alt="Email" />
                                </div>
                                <a href="mailto:mline@gmail.com" className="contact-item-link">monkal@gmail.com</a>
                            </div>
                            <div className="contact-item">
                                <div className="contact-item-icon">
                                    <img src={adres} alt="Адрес" />
                                </div>
                                <p className="contact-item-text">ул.Тургенева 9</p>
                            </div>
                        </div>

                        <div className="contact-info-group">
                            <h3 className="contact-group-title">МЕССЕНДЖЕРЫ</h3>
                            <div className="contact-item">
                                <div className="contact-item-icon">
                                    <img src={whatsapp} alt="WhatsApp" />
                                </div>
                                <a href="https://wa.me/996557220308" target="_blank" rel="noopener noreferrer" className="contact-item-link">WhatsApp</a>
                            </div>
                            <div className="contact-item">
                                <div className="contact-item-icon">
                                    <img src={tg} alt="Telegram" />
                                </div>
                                <a href="https://t.me/996557220308" target="_blank" rel="noopener noreferrer" className="contact-item-link">Telegram</a>
                            </div>
                        </div>

                        <div className="contact-info-group">
                            <h3 className="contact-group-title">СОЦИАЛЬНЫЕ СЕТИ</h3>
                            <div className="contact-item">
                                <div className="contact-item-icon">
                                    <img src={inst} alt="Instagram" />
                                </div>
                                <a href="https://www.instagram.com/monkal.kg/" target="_blank" rel="noopener noreferrer" className="contact-item-link">Instagram</a>
                            </div>
                        </div>
                    </div>

                    <div className="contact-map-column">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2970.833533281143!2d72.9991613154181!3d40.92080197931003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3897b20be5f6e8d1%3A0x8f2d5f2a1a8a2a8!2z0YPQuy4g0K7QutGO0YfQuNCx0LDQsNC90LAsIDIxLCDQlNC20LDQutC00Lwt0JDQsdCw0LQ!5e0!3m2!1sru!2skg!4v1671234567890!5m2!1sru!2skg"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;