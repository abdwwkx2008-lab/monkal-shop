import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CustomContext } from '../../store/store';
import './Favorites.css';

const FavoriteProductCard = ({ product }) => {
    const { toggleFavorite } = useContext(CustomContext);

    function handleRemoveClick() {

        toggleFavorite(product);
    }

    return (
        <div className="favorite-card">
            <button onClick={handleRemoveClick} className="remove-favorite-button">×</button>
            <Link to={`/product/${product.id}`} className="favorite-card-link">
                <div className="favorite-card-image-wrapper">
                    <img src={product.image} alt={product.name} />
                </div>
                <div className="favorite-card-info">
                    <p className="favorite-card-brand">{product.brand}</p>
                    <h3 className="favorite-card-name">{product.name}</h3>
                    <p className="favorite-card-price">{product.price.toLocaleString()} ₽</p>
                </div>
            </Link>
        </div>
    );
};

const Favorites = () => {
    const { favorites, products, clearFavorites } = useContext(CustomContext);
    const favoriteItems = products.filter(item => favorites.includes(item.id));

    const handleClearAll = () => {
        if (window.confirm("Вы уверены, что хотите полностью очистить избранное?")) {
            clearFavorites();
        }
    };

    if (favoriteItems.length === 0) {
        return (
            <div className="empty-favorites-container">
                <div className="empty-favorites-content">
                    <svg className="empty-favorites-icon" viewBox="0 0 24 24">
                        <path d="M12 2.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L12 16.9l-5.2 2.62.99-5.8L3.58 8.62l5.82-.85L12 2.5z"/>
                    </svg>
                    <h2 className="empty-favorites-title">Ваш список желаний пуст</h2>
                    <p className="empty-favorites-text">Нажмите на звездочку, чтобы сохранить самое лучшее.</p>
                    <Link className="empty-favorites-button" to='/catalog'>
                        Найти лучшее
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <section className='favorites-section'>
            <div className="favorites-container">
                <div className="favorites-header">
                    <h1 className="favorites-main-title">Избранное</h1>
                    <div className="favorites-actions">
                        <p className="favorites-count">
                            {favoriteItems.length} {favoriteItems.length === 1 ? 'товар' : favoriteItems.length > 4 ? 'товаров' : 'товара'}
                        </p>

                        <button onClick={handleClearAll} className="clear-favorites-button">Очистить избранное</button>
                    </div>
                </div>
                <div className='favorites-grid'>
                    {favoriteItems.map((product, index) => (
                        <FavoriteProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Favorites;