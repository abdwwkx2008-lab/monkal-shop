import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { CustomContext } from '../../store/store';
import './Product.css';

const StarRating = ({ rating }) => {
    return (
        <div className="star-rating">
            <div className="stars-background">★★★★★</div>
            <div className="stars-foreground" style={{ width: `${rating * 20}%` }}>★★★★★</div>
        </div>
    );
};


const RelatedProductCard = ({ item }) => {
    return (
        <Link to={`/product/${item.id}`} className="related-card">
            <div className="related-card-image-wrapper">
                <img src={item.image} alt={item.name} />
            </div>
            <div className="related-card-info">
                <p className="related-card-brand">{item.brand}</p>
                <h3 className="related-card-name">{item.name}</h3>
                <p className="related-card-price">{item.price.toLocaleString()} C</p>
            </div>
        </Link>
    );
};

const Product = () => {
    const [count, setCount] = useState(1);
    const [selectedSize, setSelectedSize] = useState(null);

    const { products, product, getProduct, addCart, toggleFavorite, favorites } = useContext(CustomContext);
    const params = useParams();

    useEffect(() => {
        if (params.id) {
            getProduct(params.id);
            window.scrollTo(0, 0);
            setSelectedSize(null);
            setCount(1);
        }
    }, [params.id]);

    const hasMultipleSizes = product.sizes && product.sizes.length > 1;

    function handleAddToCartClick() {
        if (hasMultipleSizes && !selectedSize) {
            toast.error("Пожалуйста, выберите размер");
            return;
        }

        const sizeToAdd = hasMultipleSizes ? selectedSize : 'one size';
        const itemForCart = { ...product, size: sizeToAdd };

        addCart(itemForCart, count);
        toast.success(`'${product.name}' добавлен в корзину!`);
    }

    const relatedProducts = products
        .filter(item => item.category === product.category && item.id !== product.id)
        .slice(0, 8);

    if (!product.id) {
        return <div className="loading-screen">Загрузка...</div>;
    }

    return (
        <div className="product-page-container">
            <div className="product-layout-grid">
                <div className="product-gallery-column">
                    <div className="product-main-image-wrapper">
                        <img src={product.image} alt={product.name} />
                    </div>
                </div>

                <div className="product-details-column">
                    <p className="product-brand-label">{product.brand}</p>
                    <h1 className="product-title-heading">{product.name}</h1>

                    <div className="product-rating-price-row">
                        <div className="product-rating-box">
                            <StarRating rating={product.rating} />
                            <span>{product.rating}</span>
                        </div>
                        <p className="product-price-display">{product.price.toLocaleString()} C</p>
                    </div>

                    <p className="product-description-text">{product.description}</p>

                    {hasMultipleSizes && (
                        <div className="size-selector-wrapper">
                            <div className="size-selector-header">
                                <p>Выберите размер</p>
                                <Link to='/Size'>Таблица размеров</Link>
                            </div>
                            <div className="size-buttons-container">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`size-button ${selectedSize === size ? 'selected' : ''}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="product-actions-row">
                        <div className="quantity-stepper">
                            <button onClick={() => setCount(prev => (prev > 1 ? prev - 1 : 1))}>-</button>
                            <span>{count}</span>
                            <button onClick={() => setCount(prev => prev + 1)}>+</button>
                        </div>
                        <button onClick={handleAddToCartClick} className="add-to-cart-main-button">
                            Добавить в корзину
                        </button>
                    </div>

                    <button onClick={() => toggleFavorite(product.id)} className="favorite-toggle-button">
                        <svg className={favorites.includes(product.id) ? "heart-icon filled" : "heart-icon"} viewBox="0 0 24 24">
                            {/* ВОТ ИСПРАВЛЕННАЯ СТРОКА: l-1.45 вместо l-i.45 */}
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        {favorites.includes(product.id) ? 'В избранном' : 'В избранное'}
                    </button>

                    <div className="product-benefits-bar">
                        <div className="benefit-item">🚚 Быстрая доставка</div>
                        <div className="benefit-item">💳 Безопасная оплата</div>
                        <div className="benefit-item">🔄 Легкий возврат</div>
                    </div>
                </div>
            </div>

            {relatedProducts.length > 0 && (
                <div className="related-products-wrapper">
                    <h2 className="section-title-heading">Вам также может понравиться</h2>
                    <Swiper
                        className="related-products-swiper"
                        spaceBetween={30}
                        slidesPerView={4}
                        grabCursor={true}
                        breakpoints={{
                            320: { slidesPerView: 1.5, spaceBetween: 15 },
                            640: { slidesPerView: 2.5, spaceBetween: 20 },
                            1024: { slidesPerView: 4, spaceBetween: 30 },
                        }}
                    >
                        {relatedProducts.map(item => (
                            <SwiperSlide key={item.id}>
                                <RelatedProductCard item={item} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
        </div>
    );
};

export default Product;