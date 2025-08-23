import React from 'react';
import './Info.css'
import Contact from "../Contact/Contact.jsx";
import Payment from "../Payment/Payment.jsx";
import Delivery from "../Delivery/Delivery.jsx";
const Info = () => {
    return (
        <>
            <Contact/>
            <Payment/>
            <Delivery/>
        </>
    );
};

export default Info;