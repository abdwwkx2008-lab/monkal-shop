import React from 'react';
import Shoes from "./Shoes/Shoes.jsx";
import AboutBrand from "./AboutBrand/AboutBrand.jsx";
import Size from "../Size/Size.jsx";
import Odejda from "./Odejda/Odejda.jsx";
import Aksesuary from "./Akesuary/Aksesuary.jsx";
import MySwiper from "./Swiper/Swiper.jsx";
import Contact from "../Contact/Contact.jsx";
import Payment from "../Payment/Payment.jsx";
import Delivery from "../Delivery/Delivery.jsx";
import Faq from "../FAQ/Faq.jsx";
import Return from "../Return/Return.jsx";


const Home = () => {
    return (
        <>
            <MySwiper />
            <Shoes/>
            <Odejda/>
            <Aksesuary/>
            <AboutBrand/>
            <Contact/>
            <Delivery/>
            <Payment/>
            <Size/>
            <Return/>
            <Faq/>
        </>
    );
};

export default Home;