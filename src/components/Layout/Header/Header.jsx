import React, { useContext, useState, useMemo, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { CustomContext } from '../../../store/store';
import SearchModal from '../../SearchModal.jsx';
import './Header.css';

import Lupa from '/public/assets/lupa.svg';
import Star from '/public/assets/star.svg';
import Chel from '/public/assets/chelik.svg';
import Korzina from '/public/assets/korzina.svg';
import HeaderLogo from '/public/assets/header-logo-pro.png';

function DropdownMenu({ items, parentPath, menuStructure, type }) {
    return (
        <ul className="dropdown-menu">
            {items.map(function(item) {
                let path = '#';
                if (type === 'catalog-main') {
                    const targetLink = menuStructure.find(function(link) {
                        return link.name.toLowerCase() === item.toLowerCase();
                    });
                    if (targetLink) path = targetLink.path;
                } else if (type === 'brands') {
                    path = `/brands/${item.toLowerCase().replace(/\s+/g, '-')}`;
                } else if (type === 'info') {
                    if (item.toLowerCase() === 'доставка') path = '/delivery';
                    else if (item.toLowerCase() === 'контакты') path = '/contact';
                    else if (item.toLowerCase() === 'оплата') path = '/payment';
                    else if (item.toLowerCase() === 'faq') path = '/faq';
                    else if (item.toLowerCase() === 'возврат') path = '/return';
                    else if (item.toLowerCase() === 'политика') path = '/politika';
                    else path = `/${item.toLowerCase()}`;
                } else {
                    path = `${parentPath}?subcategory=${encodeURIComponent(item)}`;
                }
                return (
                    <li key={item} className="dropdown-item">
                        <Link to={path}>{item}</Link>
                    </li>
                );
            })}
        </ul>
    );
}

function Header() {
    const { products, cart, favorites } = useContext(CustomContext);
    const [activeMenu, setActiveMenu] = useState(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const totalCartItems = cart.reduce((acc, item) => acc + item.count, 0);
    const totalFavoritesItems = favorites.length;

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const menuData = useMemo(function() {
        if (!products || products.length === 0) return {};
        const data = products.reduce(function(acc, product) {
            const { category, brand } = product;
            if (category) {
                if (!acc[category]) acc[category] = new Set();
            }
            if (brand) {
                if (!acc['Бренды']) acc['Бренды'] = new Set();
                acc['Бренды'].add(brand);
            }
            return acc;
        }, {});
        Object.keys(data).forEach(function(key) {
            data[key] = [...data[key]].sort();
        });
        return data;
    }, [products]);

    const clothingSubcategories = [ 'Ветровки', 'Толстовки', 'Футболки', 'Шорты', 'Куртки','Штаны' ];
    const shoesSubcategories = ['Кроссовки', 'Тапочки'];
    const accessoriesSubcategories = ['Барсетки', 'Рюкзаки',  'Кепки'];
    const infoLinks = ['Доставка', 'Контакты', 'Оплата', 'Возврат','FAQ','Политика'];

    const mainNavLinks = [
        { name: 'Каталог', path: '/catalog', type: 'catalog-main', sublinks: Object.keys(menuData).filter(k => k !== 'Бренды').sort() },
        { name: 'Одежда', path: '/odejdacatalog', type: 'subcategory', sublinks: clothingSubcategories },
        { name: 'Обувь', path: '/shoescatalog', type: 'subcategory', sublinks: shoesSubcategories },
        { name: 'Аксессуары', path: '/aksesuarycatalog', type: 'subcategory', sublinks: accessoriesSubcategories },
        { name: 'Бренды', path: '/brands', type: 'brands', sublinks: menuData['Бренды'] || [] },
        { name: 'Информация', path: '/info', type: 'info', sublinks: infoLinks }
    ];

    const handleMobileLinkClick = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <header className="header">
                <div className="header-container">
                    <div className="header-group-left">
                        <button
                            className={`burger-menu ${isMobileMenuOpen ? 'open' : ''}`}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Открыть меню"
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                        <button className="header-icon-btn search-mobile" onClick={() => setIsSearchOpen(true)}>
                            <img src={Lupa} alt="Поиск" />
                        </button>
                    </div>

                    <Link to="/" className="header-logo-wrapper">
                        <img src={HeaderLogo} alt="Логотип" className="header-logo" />
                    </Link>

                    <nav className="header-nav">
                        {mainNavLinks.map(link => (
                            <div
                                key={link.name}
                                className="nav-item-wrapper"
                                onMouseEnter={() => setActiveMenu(link.name)}
                                onMouseLeave={() => setActiveMenu(null)}
                            >
                                <Link to={link.path} className="header-link">{link.name}</Link>
                                {link.sublinks && link.sublinks.length > 0 && activeMenu === link.name && (
                                    <DropdownMenu
                                        items={link.sublinks}
                                        parentPath={link.path}
                                        menuStructure={mainNavLinks}
                                        type={link.type}
                                    />
                                )}
                            </div>
                        ))}
                    </nav>

                    <div className="header-group-right">
                        <button className="header-icon-btn search-desktop" onClick={() => setIsSearchOpen(true)}>
                            <img src={Lupa} alt="Поиск" />
                        </button>
                        <Link to="/favorites" className="header-icon-btn">
                            <div className="icon-wrapper">
                                <img src={Star} alt="Избранное" />
                                {totalFavoritesItems > 0 && <span className="icon-counter">{totalFavoritesItems}</span>}
                            </div>
                        </Link>
                        <Link to="/basket" className="header-icon-btn">
                            <div className="icon-wrapper">
                                <img src={Korzina} alt="Корзина" />
                                {totalCartItems > 0 && <span className="icon-counter">{totalCartItems}</span>}
                            </div>
                        </Link>
                        <Link to="/profile" className="header-icon-btn">
                            <img src={Chel} alt="Профиль" />
                        </Link>
                    </div>
                </div>
            </header>

            <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
            <nav className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
                <Link to="/" className="mobile-nav-logo-wrapper" onClick={handleMobileLinkClick}>
                    <img src={HeaderLogo} alt="Логотип" className="mobile-nav-logo" />
                </Link>
                <ul>
                    {mainNavLinks.map(link => (
                        <li key={link.name}>
                            <NavLink
                                to={link.path}
                                className="mobile-nav-link"
                                onClick={handleMobileLinkClick}
                            >
                                {link.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}

export default Header;