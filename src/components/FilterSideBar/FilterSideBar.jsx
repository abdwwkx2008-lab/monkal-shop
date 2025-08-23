import React, { useState } from 'react';
import { Range } from 'react-range';
import './FilterSidebar.css';

function FilterSidebar({
                           options,
                           activeFilters,
                           onCategorySelect,
                           onBrandChange,
                           onPriceChange,
                           onSizeSelect,
                           onReset,
                           showCategories = true,
                           showSizes = true
                       }) {

    const [openSections, setOpenSections] = useState({
        categories: true,
        price: true,
        sizes: true,
        brands: true,
    });

    function toggleSection(section) {
        const newOpenSections = {
            ...openSections,
            [section]: !openSections[section]
        };
        setOpenSections(newOpenSections);
    };

    function handleBrandToggle(brandName) {
        const isBrandSelected = activeFilters.brands.includes(brandName);
        let newBrands;

        if (isBrandSelected) {
            newBrands = activeFilters.brands.filter(function(b) {
                return b !== brandName;
            });
        } else {
            newBrands = [...activeFilters.brands, brandName];
        }

        onBrandChange(newBrands);
    };

    let categoriesBlock = null;

    if (showCategories && options.categories.length > 0) {
        let toggleArrowClass = 'toggle-arrow';
        if (openSections.categories) {
            toggleArrowClass = 'toggle-arrow open';
        }

        let contentBlockClass = 'filter-block-content';
        if (openSections.categories) {
            contentBlockClass = 'filter-block-content open';
        }

        categoriesBlock = (
            <div className="filter-block">
                <button className="filter-block-header" onClick={function() { toggleSection('categories'); }}>
                    <h3 className="filter-block-title">Категории</h3>
                    <span className={toggleArrowClass}></span>
                </button>

                <div className={contentBlockClass}>
                    <ul className="category-list">
                        {options.categories.map(function(cat) {

                            let listItemClass = '';
                            if (activeFilters.category === cat) {
                                listItemClass = 'active';
                            }

                            function handleCategoryClick() {
                                if (activeFilters.category === cat) {
                                    onCategorySelect(null);
                                } else {
                                    onCategorySelect(cat);
                                }
                            }

                            return (
                                <li
                                    key={cat}
                                    className={listItemClass}
                                    onClick={handleCategoryClick}
                                >
                                    {cat}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    }

    let priceBlock;

    let priceToggleArrowClass = 'toggle-arrow';
    if (openSections.price) {
        priceToggleArrowClass = 'toggle-arrow open';
    }

    let priceContentBlockClass = 'filter-block-content';
    if (openSections.price) {
        priceContentBlockClass = 'filter-block-content open';
    }

    priceBlock = (
        <div className="filter-block">
            <button className="filter-block-header" onClick={function() { toggleSection('price'); }}>
                <h3 className="filter-block-title">Фильтр по цене</h3>
                <span className={priceToggleArrowClass}></span>
            </button>
            <div className={priceContentBlockClass}>
                <div className="price-slider">
                    <Range
                        step={10}
                        min={0}
                        max={options.maxPrice}
                        values={activeFilters.price}
                        onChange={function(values) { onPriceChange(values); }}
                        renderTrack={function({ props, children }) {
                            return (
                                <div {...props} className="slider-track">
                                    {children}
                                </div>
                            );
                        }}
                        renderThumb={function({ props }) {
                            return (
                                <div {...props} className="slider-thumb" />
                            );
                        }}
                    />
                    <div className="price-values">
                        <span>{activeFilters.price[0]} с</span>
                        <span>{activeFilters.price[1]} с </span>
                    </div>
                </div>
            </div>
        </div>
    );

    let sizesBlock = null;

    if (showSizes && options.sizes.length > 1) {
        let sizesToggleArrowClass = 'toggle-arrow';
        if (openSections.sizes) {
            sizesToggleArrowClass = 'toggle-arrow open';
        }

        let sizesContentBlockClass = 'filter-block-content';
        if (openSections.sizes) {
            sizesContentBlockClass = 'filter-block-content open';
        }

        sizesBlock = (
            <div className="filter-block">
                <button className="filter-block-header" onClick={function() { toggleSection('sizes'); }}>
                    <h3 className="filter-block-title">Размеры (EU)</h3>
                    <span className={sizesToggleArrowClass}></span>
                </button>
                <div className={sizesContentBlockClass}>
                    <div className="size-grid">
                        {options.sizes.map(function(size) {

                            let sizeBoxClass = 'size-box';
                            if (activeFilters.size === size) {
                                sizeBoxClass = 'size-box active';
                            }

                            return (
                                <button
                                    key={size}
                                    className={sizeBoxClass}
                                    onClick={function() { onSizeSelect(size); }}
                                >
                                    {size}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    let brandsBlock = null;

    if (options.brands.length > 0) {

        let brandsToggleArrowClass = 'toggle-arrow';
        if (openSections.brands) {
            brandsToggleArrowClass = 'toggle-arrow open';
        }

        let brandsContentBlockClass = 'filter-block-content scrollable';
        if (openSections.brands) {
            brandsContentBlockClass = 'filter-block-content scrollable open';
        }

        brandsBlock = (
            <div className="filter-block">
                <button className="filter-block-header" onClick={function() { toggleSection('brands'); }}>
                    <h3 className="filter-block-title">Бренды</h3>
                    <span className={brandsToggleArrowClass}></span>
                </button>
                <div className={brandsContentBlockClass}>
                    <ul className="checkbox-list">
                        {options.brands.map(function(brand) {
                            return (
                                <li key={brand}>
                                    <label className="custom-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={activeFilters.brands.includes(brand)}
                                            onChange={function() { handleBrandToggle(brand); }}
                                        />
                                        <span className="checkmark"></span>
                                        {brand}
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    }

    return (
        <aside className="sidebar">

            {categoriesBlock}

            {priceBlock}

            {sizesBlock}

            {brandsBlock}

            <div className="filter-block-reset">
                <button className="reset-button" onClick={onReset}>
                    Сбросить фильтры
                </button>
            </div>
        </aside>
    );
};

export default FilterSidebar;