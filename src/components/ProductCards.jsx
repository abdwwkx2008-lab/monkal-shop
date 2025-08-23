import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { CustomContext } from "../store/store";
import './ProductCard.css';

function ProductsCard({ product }) {
    const { favorites, toggleFavorite } = useContext(CustomContext);
    const isFavorite = favorites.includes(product.id);

    if (!product) {
        return null;
    }

    const handleFavoriteClick = (event) => {
        event.stopPropagation();

        if (isFavorite) {
            toast.error(`'${product.name}' удален из избранного`);
        } else {
            toast.success(`'${product.name}' добавлен в избранное`);
        }

        toggleFavorite(product.id);
    };

    return (
        <div className='product-card'>
            <div className="product-card-favorite-button" onClick={handleFavoriteClick}>
                <svg className={isFavorite ? "star-icon filled" : "star-icon"} viewBox="0 0 24 24">
                    <path d="M12 2.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L12 16.9l-5.2 2.62.99-5.8L3.58 8.62l5.82-.85L12 2.5z"/>
                </svg>
            </div>

            <Link to={`/product/${product.id}`} className="product-card-link">
                <div className='product-image-wrapper'>
                    <img
                        className='product-img'
                        src={product.image}
                        alt={product.name}
                    />
                </div>

                <div className="product-info-wrapper">
                    <p className='product-brand-name'>{product.brand}</p>
                    <h3 className='product-name'>{product.name}</h3>
                    <p className='product-price'>{product.price.toLocaleString()} C</p>
                </div>
            </Link>
        </div>
    );
};

export default ProductsCard;