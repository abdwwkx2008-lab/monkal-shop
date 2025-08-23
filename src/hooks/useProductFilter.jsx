import { useState, useMemo, useEffect } from 'react';

function useProductFilter(initialProducts, initialFilters = {}) {

    const [priceRange, setPriceRange] = useState([0, 1000]);

    const [selectedCategory, setSelectedCategory] = useState(initialFilters.category || null);

    const [selectedBrands, setSelectedBrands] = useState(initialFilters.brands || []);

    const [selectedSize, setSelectedSize] = useState(initialFilters.size || null);

    useEffect(function() {
        setSelectedCategory(initialFilters.category || null);
    }, [initialFilters.category]);

    const filterOptions = useMemo(function() {
        if (!initialProducts || initialProducts.length === 0) {
            return {
                categories: [],
                brands: [],
                sizes: [],
                maxPrice: 40000
            };
        }

        const allSubcategories = initialProducts.map(function(p) {
            return p.subcategory;
        });
        const existingSubcategories = allSubcategories.filter(function(item) {
            return Boolean(item);
        });
        const categories = [...new Set(existingSubcategories)];

        const allBrands = initialProducts.map(function(p) {
            return p.brand;
        });
        const brands = [...new Set(allBrands)];

        const allSizes = initialProducts.flatMap(function(p) {
            return p.sizes;
        });
        const uniqueSizes = [...new Set(allSizes)];
        const sizes = uniqueSizes.sort(function(a, b) {
            return a - b;
        });

        const maxPrice = 40000;

        return {
            categories: categories,
            brands: brands,
            sizes: sizes,
            maxPrice: maxPrice
        };
    }, [initialProducts]);

    useEffect(function() {
        if (filterOptions.maxPrice > 0) {
            setPriceRange([0, filterOptions.maxPrice]);
        }
    }, [filterOptions.maxPrice]);

    const filteredProducts = useMemo(function() {
        const productsAfterFilter = initialProducts.filter(function(product) {

            const categoryMatch = !selectedCategory || product.subcategory === selectedCategory;

            const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);

            const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];

            const sizeMatch = !selectedSize || product.sizes.includes(selectedSize);

            return categoryMatch && brandMatch && priceMatch && sizeMatch;
        });

        return productsAfterFilter;
    }, [initialProducts, selectedCategory, selectedBrands, priceRange, selectedSize]);

    function handleResetFilters() {
        setSelectedCategory(null);
        setSelectedBrands([]);
        setSelectedSize(null);
        setPriceRange([0, filterOptions.maxPrice]);
    };

    function handleSizeSelect(size) {
        setSelectedSize(function(prevSize) {
            if (prevSize === size) {
                return null;
            } else {
                return size;
            }
        });
    };

    const activeFilters = {
        category: selectedCategory,
        brands: selectedBrands,
        price: priceRange,
        size: selectedSize
    };

    return {
        filteredProducts: filteredProducts,
        filterOptions: filterOptions,
        activeFilters: activeFilters,
        onCategorySelect: setSelectedCategory,
        onBrandChange: setSelectedBrands,
        onPriceChange: setPriceRange,
        onSizeSelect: handleSizeSelect,
        onReset: handleResetFilters,
    };
};

export default useProductFilter;