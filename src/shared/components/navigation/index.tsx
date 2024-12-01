import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material"
import { Favorite, Home as HomeIcon, Person, ShoppingCart } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

export default function Navigation() {
    const location = useLocation();
    let pathname = location.pathname.split('/')[1];
    if (pathname != 'favorite' && pathname != 'cart' && pathname != 'profile') {
        pathname = ''
    }
    pathname = `/${pathname}`;
    return(
        <Paper sx={{width: "100%"}} elevation={3}>
            <BottomNavigation value={pathname}>
                <BottomNavigationAction component={Link} to="/" value="/" label="Home" icon={<HomeIcon/>}/>
                <BottomNavigationAction component={Link} to="/favorite" value="/favorite" label="Favoritos" icon={<Favorite />} />
                <BottomNavigationAction component={Link} to="/cart" value="/cart" label="Carrinho" icon={<ShoppingCart />}/>
                <BottomNavigationAction component={Link} to="/profile" value="/profile" label="Perfil" icon={<Person />}/>
            </BottomNavigation>
        </Paper>
    )
}