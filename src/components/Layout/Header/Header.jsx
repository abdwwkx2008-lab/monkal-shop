import React, { useContext, useState, useMemo, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { CustomContext } from '../../../store/store';
import SearchModal from '../../SearchModal.jsx';
import './Header.css';

import HeaderLogo from '/public/assets/dani-logo.jpg';

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
);

const SearchIcon = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const StarIcon = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);

const CartIcon = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
);

const UserIcon = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);


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
    const { products, cart, favorites, theme, toggleTheme } = useContext(CustomContext);
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

    const iconColor = theme === 'light' ? 'black' : 'white';

    return (
        <>
            <header className="header">
                <div className="header-container">
                    <div className="header-group-left">
                        <button className="theme-toggle" onClick={toggleTheme} aria-label="Сменить тему">
                            <div className="theme-toggle-inner">
                                <SunIcon />
                                <MoonIcon />
                                <span className="theme-toggle-slider"></span>
                            </div>
                        </button>
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
                            <SearchIcon color={iconColor} />
                        </button>
                    </div>

                    <Link to="/" className="header-logo-wrapper">
                        <img src={HeaderLogo} alt="Логотип" className="header-logo" />
                        <h2 className="monkal">MONKAL</h2>
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
                            <SearchIcon color={iconColor} />
                        </button>
                        <Link to="/favorites" className="header-icon-btn">
                            <div className="icon-wrapper">
                                <StarIcon color={iconColor} />
                                {totalFavoritesItems > 0 && <span className="icon-counter">{totalFavoritesItems}</span>}
                            </div>
                        </Link>
                        <Link to="/basket" className="header-icon-btn">
                            <div className="icon-wrapper">
                                <CartIcon color={iconColor} />
                                {totalCartItems > 0 && <span className="icon-counter">{totalCartItems}</span>}
                            </div>
                        </Link>
                        <Link to="/profile" className="header-icon-btn">
                            <UserIcon color={iconColor} />
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