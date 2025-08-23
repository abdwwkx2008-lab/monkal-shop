import { useState, useMemo, useEffect } from 'react';

function smartSortSizes(sizes) {

    const sizeOrder = ["S", "M", "L", "XL", "XXL", "one size"];

    const stringSizes = sizes.filter(function(s) {
        return typeof s === 'string';
    });

    const numberSizes = sizes.filter(function(s) {
        return typeof s === 'number';
    });

    stringSizes.sort(function(a, b) {
        return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
    });

    numberSizes.sort(function(a, b) {
        return a - b;
    });

    return [...numberSizes, ...stringSizes];
};

function useMainCatalogFilter(initialProducts) {

    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);

    const filterOptions = useMemo(function() {
        if (!initialProducts || initialProducts.length === 0) {
            return {
                categories: [],
                brands: [],
                sizes: [],
                maxPrice: 40000
            };
        }

        let productsToSourceSizesFrom = initialProducts;
        if (selectedCategory) {
            productsToSourceSizesFrom = initialProducts.filter(function(p) {
                return p.category === selectedCategory;
            });
        }

        const allCategories = initialProducts.map(function(p) {
            return p.category;
        });

        const existingCategories = allCategories.filter(function(category) {
            return Boolean(category);
        });

        const categories = [...new Set(existingCategories)];

        const allBrands = initialProducts.map(function(p) {
            return p.brand;
        });
        const brands = [...new Set(allBrands)];

        const allSizes = productsToSourceSizesFrom.flatMap(function(p) {
            return p.sizes;
        });
        const uniqueSizes = [...new Set(allSizes)];
        const sizes = smartSortSizes(uniqueSizes);

        const maxPrice = 40000;

        return {
            categories: categories,
            brands: brands,
            sizes: sizes,
            maxPrice: maxPrice
        };
    }, [initialProducts, selectedCategory]);

    useEffect(function() {
        if (filterOptions.maxPrice > 0) {
            setPriceRange([0, filterOptions.maxPrice]);
        }
    }, [filterOptions.maxPrice]);

    const filteredProducts = useMemo(function() {
        const productsAfterFilter = initialProducts.filter(function(product) {

            const categoryMatch = !selectedCategory || product.category === selectedCategory;

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
        if (selectedSize === size) {
            setSelectedSize(null);
        } else {
            setSelectedSize(size);
        }
    };

    function handleCategorySelect(category) {
        let newCategory;

        if (selectedCategory === category) {
            newCategory = null;
        } else {
            newCategory = category;
        }

        setSelectedCategory(newCategory);
        setSelectedSize(null);
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
        onCategorySelect: handleCategorySelect,
        onBrandChange: setSelectedBrands,
        onPriceChange: setPriceRange,
        onSizeSelect: handleSizeSelect,
        onReset: handleResetFilters,
    };
};

export default useMainCatalogFilter;