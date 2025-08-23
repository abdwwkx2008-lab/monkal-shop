import React, { useState } from 'react';
import './Faq.css';

const faqData = [
    {
        category: 'Общие вопросы',
        items: [
            {
                question: 'Чем занимается ваш интернет-магазин?',
                answer: 'Мы специализируемся на продаже оригинальной брендовой одежды, обуви и аксессуаров. Наша цель — предоставить вам лучшие товары по лучшим ценам.'
            },
            {
                question: 'Гарантирована ли безопасность моих данных?',
                answer: 'Мы гарантируем полную безопасность ваших персональных данных. Все платежные операции проходят через защищенные шлюзы. Если у вас есть вопросы, пожалуйста, ознакомьтесь с нашей Политикой конфиденциальности.'
            }
        ]
    },
    {
        category: 'Товары',
        items: [
            {
                question: 'Вы реализуете оригинальные товары?',
                answer: 'Да, мы работаем только с официальными дистрибьюторами и гарантируем 100% подлинность каждого товара в нашем магазине.'
            },
            {
                question: 'Почему цена зависит от размера?',
                answer: 'В редких случаях цена на определенные размеры может незначительно отличаться из-за разной закупочной стоимости у поставщика или специальных акций на конкретные размеры.'
            }
        ]
    },
    {
        category: 'Доставка',
        items: [
            {
                question: 'Сколько идет доставка?',
                answer: 'Доставка по городу Джалал-Абад обычно занимает 20 - 40 минут. Доставка в другие регионы занимает от 1 до 10 рабочих дней, смотря в какой город или район'
            },
            {
                question: 'Можно ли вернуть товар?',
                answer: 'Да, вы можете вернуть любой товар, который вам не подошел, в течение 3 дней с момента покупки, при условии сохранения его товарного вида и упаковки, если вы испортили товар то к возврату не подлежит'
            }
        ]
    }
];

const Faq = () => {
    const [openIndex, setOpenIndex] = useState('0-1');

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="faq-section">
            <div className="faq-container">
                <div className="faq-hero">
                    <h1 className="faq-main-title">FAQ</h1>
                    <p className="faq-subtitle">Ответы на самые часто задаваемые вопросы.</p>
                </div>

                {faqData.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="faq-category">
                        <h2 className="faq-category-title">{category.category}</h2>
                        <div className="faq-items-container">
                            {category.items.map((item, itemIndex) => {
                                const index = `${categoryIndex}-${itemIndex}`;
                                const isOpen = openIndex === index;
                                return (
                                    <div className="faq-item" key={index}>
                                        <button className="faq-question-button" onClick={() => handleToggle(index)}>
                                            <span>{item.question}</span>
                                            <div className={`faq-arrow ${isOpen ? 'open' : ''}`}></div>
                                        </button>
                                        <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
                                            <p>{item.answer}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Faq;