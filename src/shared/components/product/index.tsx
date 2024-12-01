import { Card, CardActions, CardContent, CardMedia, IconButton, Typography } from "@mui/material";
import {Product as ProductClass} from "../../classes/Product";
import Logo from "../logo";
import { useLocation, useNavigate } from "react-router-dom";
import { Favorite } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { FavoriteService } from "../../services/api/Favorites/FavoritesService";

export default function ProductCard(props: {product: ProductClass}) {
    const product = props.product;
    const [favorite, setFavorite] = useState<boolean>();
    const navigation = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setFavorite(product.favorite)
    },[])
    async function addFavorite(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.stopPropagation();
        await FavoriteService.addFavorite(product.id);
        setFavorite(true);
    }

    async function removeFavorite(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.stopPropagation();
        await FavoriteService.removeFavorite(product.id);

        product.favorite = false;
        setFavorite(false);
    }

    function redirectToProduct() {
        let baseUrl = `/product/${product.id}`

        if (window.location.pathname.length > 1) {
            baseUrl = `${window.location.pathname}${baseUrl}`
        }
        navigation(baseUrl, {state: {background: location}});
    }
    return (
        <Card onClick={redirectToProduct}
            sx={{
                margin: '10px',
                maxWidth: '300px',
                width: '100%',
                float: 'left',
                cursor: "pointer"
            }}
        >
            {!!product.imageUrl && 
                <CardMedia
                    component='img'
                    image={product.imageUrl}
                    sx={{
                        height: '170px',
                    }}
                />
            }
            {!product.imageUrl && 
                <div style={{
                    height:'170px',
                    display:'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Logo width={300} height={120}/>
                </div>
            }
            <CardContent sx={{
                paddingBottom: 0,
                paddingTop: '5px'
            }}>
                <Typography variant="body1" sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {product.name}
                </Typography>
                <Typography variant="caption" sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    height: '60px'
                }}>
                    {product.description}
                </Typography>
            </CardContent>
            <CardActions sx={{
                justifyContent: 'space-between',
            }}>
                <Typography marginLeft="10px" variant="body2">
                    {product.formatedPrice}
                </Typography>
                {favorite ? 
                    <IconButton onClick={removeFavorite} color='primary'>
                        <Favorite />
                    </IconButton>
                    :
                    <IconButton onClick={addFavorite} color='default'>
                        <Favorite />
                    </IconButton>
                }
            </CardActions>
        </Card>
    )
}