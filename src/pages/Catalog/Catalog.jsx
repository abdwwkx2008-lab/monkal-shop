import React, { useContext } from 'react';
import { CustomContext } from '../../store/store';
import useMainCatalogFilter from '../../hooks/useMainCatalogFilter';
import ProductCard from '../../components/ProductCards.jsx';
import FilterSidebar from '../../components/Filtersidebar/Filtersidebar.jsx';
import './Catalog.css';

function Catalog() {

    const { products } = useContext(CustomContext);

    const {
        filteredProducts,
        filterOptions,
        ...filterHandlers
    } = useMainCatalogFilter(products);

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
                    <FilterSidebar
                        options={filterOptions}
                        {...filterHandlers}
                    />
                </aside>

                <main className="catalog-content">
                    <div className="catalog-header">
                        <h1 className="page-title">Все товары</h1>
                        <p className="product-count">
                            В нашем главном каталоге: {filteredProducts.length} товаров
                        </p>
                    </div>

                    <div className="catalog-box">
                        {productListContent}
                    </div>
                </main>

            </div>
        </div>
    );
};

export default Catalog;