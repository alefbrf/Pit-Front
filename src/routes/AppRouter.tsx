import { Route, Routes, Navigate, Outlet, useLocation } from "react-router-dom";
import { getToken, getUser } from "../shared/services/api/auth/authentication";
import Navigation from "../shared/components/navigation";
import Login from "../pages/authentication/login";
import Register from "../pages/authentication/register";
import Recovery from "../pages/authentication/recovery-acount";
import LoginCode from "../pages/authentication/login-code";
import Home from "../pages/home";
import ProductPage from "../pages/product";
import Favorite from "../pages/favorites";
import Cart from "../pages/cart";
import Profile from "../pages/profile";
import { Role } from "../shared/Enums/Role";
import ChangePassword from "../pages/authentication/change-password";
import Addresses from "../pages/addresses";
import Address from "../pages/address";
import Orders from "../pages/orders";
import Order from "../pages/order";
import Deliveries from "../pages/deliveries";
import ManageOrders from "../pages/manage-orders";
import ManageProduct from "../pages/manage-product";
import ManageDeliveryMans from "../pages/manage-delivery-mans";

interface Props {
    roles?: string[]
}
function ProtectedRoute({roles} : Props) {
    const authenticated = getToken();
    const user = getUser();

    if (!authenticated || !user) {
        return <Navigate to={"/login"} replace />
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to={"/"} replace />
    }

    return (
        <>
            <Outlet />
        </>
    )
}

export default function AppRouter() {
    const location = useLocation();
    const background = location.state && location.state.background;

    return (
        <>
            <Routes location={background || location}>
                <Route path="/">
                    <Route path="*" element={<Navigate to={"/"} replace />}/>
                    <Route path="login" element={<Login />}/>
                    <Route path="register" element={<Register />}/>
                    <Route path="recovery" element={<Recovery />}/>
                    <Route path="login-code" element={<LoginCode />}/>
                    <Route path="" element={
                        <>
                            <ProtectedRoute />
                            <Navigation />
                        </>
                        }>
                        <Route path="">
                            <Route path="" element={<Home/>} />
                            <Route path="product/:id" element={<ProductPage/>} />
                        </Route>
                        <Route path="favorite">
                            <Route path="" element={<Favorite/>} />
                            <Route path="product/:id" element={<ProductPage/>} />
                        </Route>
                        <Route path="cart">
                            <Route path="" element={<Cart/>} />
                            <Route path="product/:id" element={<ProductPage/>} />
                        </Route>
                        <Route path="profile">
                            <Route path="" index element={<Profile/>} />
                            <Route path="addresses">
                                <Route path="" element={<Addresses/>}/>
                                <Route path="address">
                                    <Route path="" element={<Address/>}/>
                                    <Route path=":id" element={<Address/>}/>
                                </Route>
                            </Route>
                            <Route path="change-password" element={<ChangePassword />} />
                            <Route path="orders">
                                <Route path="" element={<Orders />}/>
                                <Route path=":id" element={<Order/>}/>
                            </Route>
                            <Route path="deliveries" element={<ProtectedRoute roles={[Role.DeliveryMan, Role.Admin]} />}>
                                <Route path="" element={<Deliveries/>} />
                                <Route path=":id" element={<Order/>}/>
                            </Route>
                            <Route path="manage-itens" element={<ProtectedRoute roles={[Role.Admin]} />}>
                                <Route path="" element={<ManageProduct />} />
                            </Route>
                            <Route path="manage-orders" element={<ProtectedRoute roles={[Role.Admin]} />}>
                                <Route path="" element={<ManageOrders/>} />
                                <Route path=":id" element={<Order/>}/>
                            </Route>
                            <Route path="manage-delivery-mans" element={<ProtectedRoute roles={[Role.Admin]} />}>
                                <Route path="" element={<ManageDeliveryMans/>} />
                            </Route>
                        </Route>
                    </Route>
                </Route>
            </Routes>
            {background && (
                <Routes>
                    <Route path="/">
                        <Route path="">
                            <Route path="" index element={<Home/>} />
                            <Route path="product/:id" element={<ProductPage/>} />
                        </Route>
                        <Route path="favorite">
                            <Route path="" element={<Favorite/>} />
                            <Route path="product/:id" element={<ProductPage/>} />
                        </Route>
                        <Route path="cart">
                            <Route path="" element={<Cart/>} />
                            <Route path="product/:id" element={<ProductPage/>} />
                        </Route>
                        <Route path="profile">
                            <Route path="" index element={<Profile/>} />
                        </Route>
                    </Route>
                </Routes>
            )}
        </>
    )
}