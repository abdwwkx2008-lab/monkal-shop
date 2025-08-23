import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import Home from "../pages/Home/Home";
import Catalog from "../pages/Catalog/Catalog";
import OdejdaCatalog from "../pages/OdejdaCatalog/OdejdaCatalog";
import ShoesCatalog from "../pages/ShoesCatalog/ShoesCatalog";
import AksesuaryCatalog from "../pages/AksesuaryCatalog/AksesuaryCatalog";
import BrandPage from "../pages/BrandPage/BrandPage";
import Size from "../pages/Size/Size.jsx";
import Favorites from "../pages/Favorites/Favorites.jsx";
import Basket from "../pages/Basket/Basket.jsx";
import Contact from "../pages/Contact/Contact.jsx";
import Product from "../pages/Product/Product.jsx";
import Payment from "../pages/Payment/Payment.jsx";
import Info from "../pages/Info/Info.jsx";
import Delivery from "../pages/Delivery/Delivery.jsx";
import Register from "../pages/Register/Register.jsx";
import Login from "../pages/Login/Login.jsx";
import ForgotPassword from "../pages/Login/ForgotPassword.jsx";
import ResetPassword from "../pages/Login/ResetPassword.jsx";
import Faq from "../pages/FAQ/Faq.jsx";
import Return from "../pages/Return/Return.jsx";
import Politika from "../pages/Politika/Politika.jsx";

import Profile from "../pages/ Profile/ Profile.jsx";
import ProfileDashboard from "../pages/ Profile/ProfileDashboard.jsx";
import EditProfile from "../pages/ Profile/EditProfile.jsx";
import OrderHistory from "../pages/ Profile/OrderHistory.jsx";
import AddressManagement from "../pages/ Profile/AddressManagement.jsx";
import ChangePassword from "../pages/ Profile/ChangePassword.jsx";


import PrivateRoute from "../components/PrivateRoute/PrivateRoute.jsx";


const routes = [
    {
        path: "/",
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            { path: "catalog", element: <Catalog /> },
            { path: "info", element: <Info /> },
            { path: "delivery", element: <Delivery /> },
            { path: "odejdacatalog", element: <OdejdaCatalog /> },
            { path: "shoescatalog", element: <ShoesCatalog /> },
            { path: "aksesuarycatalog", element: <AksesuaryCatalog /> },
            { path: "contact", element: <Contact /> },
            { path: "payment", element: <Payment /> },
            { path: "size", element: <Size /> },
            { path: "brands/:brandName", element: <BrandPage /> },
            { path: "favorites", element: <Favorites /> },
            { path: "basket", element: <Basket /> },
            { path: "return", element: <Return /> },
            { path: "product/:id", element: <Product /> },
            { path: "faq", element: <Faq /> },
            { path: "politika", element: <Politika /> },


            {
                path: "profile",
                element: (
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                ),
                children: [
                    { index: true, element: <ProfileDashboard /> },
                    { path: "edit", element: <EditProfile /> },
                    { path: "orders", element: <OrderHistory /> },
                    { path: "address", element: <AddressManagement /> },
                    { path: "password", element: <ChangePassword /> },
                ],
            },
        ],
    },
    { path: "login", element: <Login /> },
    { path: "register", element: <Register /> },
    { path: "forgot-password", element: <ForgotPassword /> },
    { path: "reset-password", element: <ResetPassword /> },
];

const router = createBrowserRouter(routes);

export default router;