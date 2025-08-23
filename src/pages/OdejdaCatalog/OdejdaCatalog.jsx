import React, { useContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { CustomContext } from '../../store/store';
import useProductFilter from '../../hooks/useProductFilter';
import ProductCard from '../../components/ProductCards.jsx';
import FilterSidebar from '../../components/FilterSidebar/FilterSidebar.jsx';
import './OdejdaCatalog.css';

function useQuery() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    return searchParams;
}

function OdejdaCatalog() {

    const { products } = useContext(CustomContext);

    const query = useQuery();

    const subcategoryFromUrl = query.get('subcategory');

    const clothes = useMemo(function() {
        const filteredClothes = products.filter(function(item) {
            return item.category === 'одежда';
        });
        return filteredClothes;
    }, [products]);

    let initialCategory;

    if (subcategoryFromUrl) {
        initialCategory = decodeURIComponent(subcategoryFromUrl);
    } else {
        initialCategory = null;
    }

    const initialFilters = {
        category: initialCategory
    };

    const {
        filteredProducts,
        filterOptions,
        ...filterHandlers
    } = useProductFilter(clothes, initialFilters);

    let productListContent;

    if (filteredProducts.length > 0) {
        productListContent = filteredProducts.map(function(product) {
            return (
                <ProductCard key={product.id} product={product} />
            );
        });
    } else {
        productListContent = (
            <p className="no-products-message">
                Товары с такими параметрами не найдены.
            </p>
        );
    }

    return (
        <div className="container">
            <div className="catalog-layout">

                <aside className="catalog-sidebar">
                    <FilterSidebar options={filterOptions} {...filterHandlers} />
                </aside>

                <main className="catalog-content">
                    <div className="catalog-header">
                        <h1 className="page-title">Одежда</h1>
                        <p className="product-count">
                            В Нашем каталоге Одежды: {filteredProducts.length} товаров
                        </p>
                    </div>

                    <div className="catalog-page-grid">
                        {productListContent}
                    </div>
                </main>

            </div>
        </div>
    );
};

export default OdejdaCatalog;