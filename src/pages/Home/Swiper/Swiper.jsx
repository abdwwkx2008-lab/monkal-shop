import React from 'react';
import './Swiper.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from "swiper";
import SwiperIMG1 from '/assets/erke banner 1.jpg';
import SwiperIMG5 from '/assets/erke banner 2.jpg';
import SwiperIMG6 from '/assets/xtep banner.webp';
import SwiperIMG7 from '/assets/xtep banner 2.webp';
import SwiperIMG78 from '/assets/xtep banner 3.webp';
import SwiperIMG2 from '/assets/swiperimg2.png';
import SwiperIMG3 from '/assets/swiperimg3.jpg';

function MySwiper() {

    const slideImages = [
        SwiperIMG1,
        SwiperIMG2,
        SwiperIMG3,
        SwiperIMG78,
        SwiperIMG5,
        SwiperIMG6,
        SwiperIMG7
    ];

    return (
        <section className='swiper-section'>
            <div className='container'>
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1}
                    navigation={true}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    loop={true}
                    className='swiper-container'
                >
                    {slideImages.map(function(imageSrc, index) {
                        return (
                            <SwiperSlide key={index}>
                                <div className='slide-content'>
                                    <img src={imageSrc} alt={`Slide ${index + 1}`} className='slide-img' />
                                    <div className='text-overlay'>
                                        <Link className='swiper-link' to='/catalog'>
                                            ПЕРЕЙТИ В КАТАЛОГ
                                        </Link>
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
        </section>
    );
}

export default MySwiper;