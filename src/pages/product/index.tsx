import { ArrowBack, Favorite, ShoppingCart } from "@mui/icons-material";
import { Button, CardMedia, Dialog, IconButton, Paper, Snackbar, SnackbarContent, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductService } from "../../shared/services/api/Products/ProductsService";
import Logo from "../../shared/components/logo";
import { Product } from "../../shared/classes/Product";
import { FavoriteService } from "../../shared/services/api/Favorites/FavoritesService";
import DialogTransition from "../../shared/components/DialogTransition";
import { CartService } from "../../shared/services/api/Cart/CartService";
import Navigation from "../../shared/components/navigation";

export default function ProductPage() {
    const {id} = useParams();
    const [product, setProduct] = useState<Product>();
    const [favorite, setFavorite] = useState<boolean>();
    const [snackBarOpen, setSnackBarOpen] = useState(false);

    useEffect(() => {
        ProductService.getById(Number(id)).
            then(response => {
                setProduct(new Product(response));                
                setFavorite(response.favorite);
            });
    }, [])

    async function addFavorite() {
        if (!product) {
            return;
        }
        await FavoriteService.addFavorite(product.id);
        setFavorite(true);
    }

    async function removeFavorite() {
        if (!product) {
            return;
        }
        await FavoriteService.removeFavorite(product?.id);

        product.favorite = false;
        setFavorite(false);
    }

    function addToCart() {
        if (!product) {
            return;
        }
        CartService.addItemCart(product.id).
            then(() => {
                setSnackBarOpen(true);
            });
    }

    return (
        <Dialog
            open={!!product}
            fullScreen
            TransitionComponent={DialogTransition}
        >
            <div style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '10px 10px 0'
            }}>
                <Link to={'..'}>
                    <IconButton>
                        <ArrowBack />                    
                    </IconButton>
                </Link>
            </div>
            <div className="product">
                <Paper elevation={8} className="product_image">
                    {!!product?.imageUrl &&
                        <CardMedia 
                            component='img'
                            image={product.imageUrl}
                        />
                    }
                    {!product?.imageUrl &&
                        <Logo width={'100%'} height={'100%'}/>
                    }
                </Paper>
                <div className="product_content">
                    <h2>{product?.name}</h2>
                    <Typography variant="h6">
                        {product?.formatedPrice}
                    </Typography>
                    <div className="description">
                        <h4>
                            {product?.description}
                        </h4>
                    </div>
                    <div className="product_action">
                        {favorite ? 
                            <IconButton onClick={removeFavorite} color='primary'>
                                <Favorite />
                            </IconButton>
                            :
                            <IconButton onClick={addFavorite} color='default'>
                                <Favorite />
                            </IconButton>
                        }
                        <Button variant="contained" onClick={addToCart}>
                            <ShoppingCart sx={{paddingRight: '5px'}}/> Adicionar 
                        </Button>
                    </div>
                </div>
            </div>
            <Navigation />
            <Snackbar
                open={snackBarOpen}
                anchorOrigin={{ horizontal: "center", vertical: "bottom"}}
                autoHideDuration={5000}
                onClose={() => setSnackBarOpen(false)}                
            >
                <SnackbarContent
                    sx={{
                        backgroundColor: 'green',
                        color: 'white'
                    }}
                    message="Produto adicionado ao carrinho!"
                />
            </Snackbar>
        </Dialog>
    )
}