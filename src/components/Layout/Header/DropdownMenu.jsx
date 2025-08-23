import React from 'react';
import { Link } from 'react-router-dom';

function DropdownMenu({ items, parentPath, menuStructure, type }) {
    return (
        <ul className="dropdown-menu">
            {items.map(function(item) {
                let path = '#';

                if (type === 'catalog-main') {
                    const targetLink = menuStructure.find(function(link) {
                        return link.name.toLowerCase() === item.toLowerCase();
                    });
                    if (targetLink) {
                        path = targetLink.path;
                    }
                } else if (type === 'brands') {
                    path = `/brands/${item.toLowerCase().replace(/\s+/g, '-')}`;
                } else if (type === 'info') {
                    path = `/${item.toLowerCase()}`;
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

export default DropdownMenu;