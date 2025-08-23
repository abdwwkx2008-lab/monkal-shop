import React from 'react';
import Header from "./Header/Header.jsx";
import Footer from "./Footer/Footer.jsx";
import { Outlet, useLocation } from "react-router-dom";

function Layout() {
    const location = useLocation();
    const authPages = ['/login', '/register', '/forgot-password', '/reset-password'];
    const isAuthPage = authPages.includes(location.pathname);

    return (
        <div className="layout">
            {!isAuthPage && <Header />}

            <main className="layout-main">
                <Outlet />
            </main>

            {!isAuthPage && <Footer />}
        </div>
    );
};

export default Layout;