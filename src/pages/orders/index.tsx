import { ArrowBack } from "@mui/icons-material";
import { Card, CardContent, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import IOrder from "../../shared/interfaces/IOrder";
import { OrderService } from "../../shared/services/api/Order/OrderService";
import PriceFormat from "../../shared/Utils/PriceFormat";

export default function Orders() {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const navigation = useNavigate();

    useEffect(() => {
        OrderService.getMyOrders().
            then(response => setOrders(response.data));
    }, []);

    return (
        <>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                margin: 10
            }}>
                <Link to={'..'}>
                    <IconButton>
                        <ArrowBack />                    
                    </IconButton>
                </Link>
                <Typography
                    component="h1"
                    fontSize="1.5rem"
                >
                    Meus pedidos
                </Typography>
            </div>
            <div
                style={{
                    overflow: "auto",
                    height: '100%',
                    width: '100%'
                }}
            >
                {orders?.map((order) => 
                    <div key={order.id}
                        style={{
                            width: '100%',
                            maxWidth: '700px',
                            padding: '10px',
                            margin: '0px auto'              
                        }}
                    >
                        <Card
                            sx={{
                                width: '100%',
                                height: '100%',
                                paddingTop: '10px',
                                paddingBottom: '10px',
                                paddingRight: '10px',
                                display: 'flex',
                                alignItems: 'center' 
                            }}
                        >
                            <CardContent
                                sx={{
                                    flexGrow: 1,
                                    flexShrink: 1,
                                    height: '100%',
                                    paddingTop: '0',
                                    paddingBottom: '0 !important',
                                    cursor: 'pointer'
                                }}
                                onClick={() => navigation(`./${order.id}`)}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <div>{order.createdDateFormated}</div>
                                    <div>
                                        {PriceFormat(order.price)}
                                    </div>
                                </div>
                                <div>
                                    #{order.code}
                                </div>
                                <div>
                                    {order.status}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </>
    )
}