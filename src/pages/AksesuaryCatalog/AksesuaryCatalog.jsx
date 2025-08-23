import React, { useContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { CustomContext } from '../../store/store';
import useProductFilter from '../../hooks/useProductFilter';
import ProductCard from '../../components/ProductCards.jsx';
import FilterSidebar from '../../components/Filtersidebar/Filtersidebar.jsx';
import './AksesuaryCatalog.css';

function useQuery() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    return searchParams;
}

function AksesuaryCatalog() {

    const { products } = useContext(CustomContext);

    const query = useQuery();

    const subcategoryFromUrl = query.get('subcategory');

    const accessories = useMemo(function() {
        const filteredAccessories = products.filter(function(item) {
            return item.category === 'аксессуары';
        });
        return filteredAccessories;
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
    } = useProductFilter(accessories, initialFilters);

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
                Аксессуары с такими параметрами не найдены.
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
                        showSizes={false}
                    />
                </aside>

                <main className="catalog-content">
                    <div className="catalog-header">
                        <h1 className="page-title">Аксессуары</h1>
                        <p className="product-count">
                            В Нашем каталоге Аксессуаров: {filteredProducts.length} товаров
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

export default AksesuaryCatalog;