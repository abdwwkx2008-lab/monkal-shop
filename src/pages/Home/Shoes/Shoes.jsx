import React, { useContext } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Link, useNavigate } from 'react-router-dom'
import { CustomContext } from '../../../store/CustomContext.js'
import './Shoes.css'

function Shoes() {
  const { products } = useContext(CustomContext)
  const navigate = useNavigate()

  const shoes = products
    .filter(function (item) {
      return item.category === 'обувь'
    })
    .slice(0, 6)

  return (
    <section className="shoes-home-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-header-title">Обувь</h2>
          <Link to="/shoescatalog" className="section-header-link">
            <span>Больше товаров</span>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
            </svg>
          </Link>
        </div>

        <Swiper
          className="shoes-swiper"
          spaceBetween={30}
          slidesPerView={'auto'}
          grabCursor={true}
        >
          {shoes.map(function (item) {
            return (
              <SwiperSlide key={item.id} className="shoe-slide">
                <div
                  className="shoe-card"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <div className="shoe-image-wrapper">
                    <img
                      className="shoe-img"
                      src={item.image}
                      alt={item.name}
                    />
                  </div>
                  <div className="shoe-info-wrapper">
                    <p className="shoe-brand">{item.brand}</p>
                    <p className="shoe-name">{item.name}</p>

                    <p className="shoe-price">
                      {item.price.toLocaleString()} с
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </section>
  )
}

export default Shoes
