import React from 'react'
import './AboutBrand.css'
import delivery from '/assets/delivery.icon.svg'
import Chel from '/assets/chel.icon.png'
import Galochka from '/assets/galochka.icon.svg'

function AboutBrand() {
  return (
    <section className="aboutbrand">
      <div className="container">
        <div className="about-box">
          <div className="about-cart-1">
            <h2 className="about-title">
              О ИНТЕРНЕТ- <br />
              МАГАЗИНЕ MONKAL
            </h2>
            <p className="about-text">
              Команда MONKAL предоставляет услугу доставки только оригинальных
              товаров с <br />
              крупнейшего китайского маркетплейса Pinduoduo, чтобы наши клиенты
              экономили более 40% <br />
              на каждой покупке. <br />
              Мы работаем без посредников, благодаря чему можем предлагать
              лучшие цены. Быстрая <br />
              и бесплатная доставка. <br />
              Удобный сайт, где вы можете оформить заказ без необходимости
              скачивать китайское <br />
              приложение Pinduoduo, с удобной фильтрацией огромного ассортимента
              и мгновенным отображением <br />
              окончательной цены товара.
            </p>
          </div>

          <div className="about-cart-2">
            <div className="feature-item">
              <img src={delivery} alt="Delivery Icon" className="about-icon" />
              <div className="text-content">
                <h3 className="about-subtitle">БЫСТРАЯ ДОСТАВКА</h3>
                <p className="about-text-small">
                  По городу Жалал-Абад доставим ваш заказ за 100сом{' '}
                </p>
              </div>
            </div>

            <div className="feature-item">
              <img src={Chel} alt="Support Icon" className="about-icon" />
              <div className="text-content">
                <h3 className="about-subtitle">ПРОВЕРКА ТОВАРА</h3>
                <p className="about-text-small">
                  Мы тщательно проверяем каждый товар на наличие брака перед
                  отправкой.
                </p>
              </div>
            </div>

            <div className="feature-item">
              <img src={Galochka} alt="Guarantee Icon" className="about-icon" />
              <div className="text-content">
                <h3 className="about-subtitle">ГАРАНТИЯ КАЧЕСТВА</h3>
                <p className="about-text-small">
                  Только оригинальные и качественные товары с Pinduoduo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutBrand
