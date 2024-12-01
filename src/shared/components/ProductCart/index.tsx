
import { useLocation, useNavigate } from "react-router-dom";
import {Product as ProductClass} from "../../classes/Product";
import { Card, CardActions, CardContent, CardMedia, Checkbox, Typography } from "@mui/material";
import Logo from "../logo";
import PlusMinusNumberInput from "../PlusMinusNumberInput";
import { useState } from "react";

interface Props {
    product: ProductClass,
    onChange?: (id: number, quantity: number, checked: boolean) => void,
    ProductOrder: boolean
}

export default function ProductCart(props: Props) {
    const product = props.product;
    const navigation = useNavigate();
    const location = useLocation();
    const [checked, setChecked] = useState(product.checked ||false);
    const [quantity, setQuantity] = useState(props.product.quantity | 1);
    function redirectToProduct() {
        if (props.ProductOrder) {
            return;
        }
        let baseUrl = `/product/${product.id}`

        if (window.location.pathname.length > 1) {
            baseUrl = `${window.location.pathname}${baseUrl}`
        }
        navigation(baseUrl, {state: {background: location}});
    }

    const handleChecked = () => {
        setChecked((prev) => !prev);
        props.onChange?.(props.product.id, quantity, !checked);
    }

    const handleQuantity = (quantity: number) => {
        setQuantity(quantity);        
        props.onChange?.(props.product.id, quantity, checked);
    }
    
    return (
        <div
            style={{
                width: '100%',
                maxWidth: '700px',
                padding: '10px'       
            }}>
            <Card onClick={redirectToProduct}
                sx={{
                    width: '100%',
                    height: '100%',
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    paddingRight: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    paddingLeft: props.ProductOrder ? '10px' : 0
                }}
            >
                {!props.ProductOrder && 
                    <Checkbox onClick={(e) => e.stopPropagation()} onChange={handleChecked} checked={checked} />
                }
                {!!product.imageUrl && 
                    <CardMedia
                        component='img'
                        image={product.imageUrl}
                        sx={{
                            height: '100%',
                            width: '30%',
                            aspectRatio: 1
                        }}
                    />
                }
                {!product.imageUrl && 
                    <div style={{
                        height: '100%',
                        maxWidth: '30%',
                        width: '30%',
                        display:'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Logo width={'100%'} height={'100%'}/>
                    </div>
                }
                <div
                    style={{
                        display: 'flex',
                        flexGrow: 1,
                        flexShrink: 1,
                        flexDirection: 'column',
                        height: '100%'
                    }}
                >
                    <CardContent sx={{
                        flexGrow: 1,
                        flexShrink: 1,
                        height: '100%',
                        paddingTop: '0',
                        paddingBottom: '0',
                    }}>
                        <Typography variant="body1" sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {product.name}
                        </Typography>
                        <Typography variant="caption" className="product_content_description">
                            {product.description}
                        </Typography>
                    </CardContent>
                    <CardActions sx={{
                        justifyContent: 'space-between',
                    }}>
                        {!props.ProductOrder &&
                            <>
                                <Typography marginLeft="10px" variant="body2">
                                    {product.formatedPrice}
                                </Typography>
                                <PlusMinusNumberInput onChange={(value: number) =>{handleQuantity(value)}} value={product.quantity}/>
                            </>
                        }
                        {props.ProductOrder && 
                            <>
                                 <Typography marginLeft="10px" variant="body1">
                                    {product.formatedPrice}
                                </Typography>
                                <Typography marginLeft="10px" variant="body1">
                                    {product.quantity}x
                                </Typography>
                            </>
                        }
                    </CardActions>
                </div>
            </Card>
        </div>
    );
}