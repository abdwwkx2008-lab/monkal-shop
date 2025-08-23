import React, { useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { CustomContext } from '../../store/store';
import ProductCard from '../../components/ProductCards.jsx';

import './BrandPage.css';

function BrandPage() {

    const { products } = useContext(CustomContext);
    const { brandName } = useParams();

    const brandProducts = useMemo(function() {

        const filteredProducts = products.filter(function(product) {
            const productBrandFormatted = product.brand?.toLowerCase().replace(/\s+/g, '-');
            return productBrandFormatted === brandName.toLowerCase();
        });

        return filteredProducts;
    }, [products, brandName]);

    const formattedBrandName = brandName.replace(/-/g, ' ');

    let productListContent;

    if (brandProducts.length > 0) {
        productListContent = brandProducts.map(function(product) {
            return (
                <ProductCard key={product.id} product={product} />
            );
        });
    } else {
        productListContent = (
            <p>Товары этого бренда не найдены.</p>
        );
    }

    return (
        <div className="container">
            <h1 className="brand-page-title">
                Бренд: <span className="brand-highlight">{formattedBrandName}</span>
            </h1>

            <div className="brand-page-grid">
                {productListContent}
            </div>
        </div>
    );
};

export default BrandPage;