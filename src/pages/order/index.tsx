import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import IOrder from "../../shared/interfaces/IOrder";
import { OrderService } from "../../shared/services/api/Order/OrderService";
import { Autocomplete, Button, Divider, IconButton, Paper, TextField, Typography } from "@mui/material";
import { ArrowBack, Clear, Done } from "@mui/icons-material";
import ProductCart from "../../shared/components/ProductCart";
import { Product } from "../../shared/classes/Product";
import IProduct from "../../shared/interfaces/IProduct";
import { getUser } from "../../shared/services/api/auth/authentication";
import { Role } from "../../shared/Enums/Role";
import PriceFormat from "../../shared/Utils/PriceFormat";
import IUser from "../../shared/interfaces/IUser";
import { AdminService } from "../../shared/services/api/Admin/AdminService";
import IConfigs from "../../shared/interfaces/IConfigs";

export default function Order() {
    const {id} = useParams();
    const navigation = useNavigate();
    const [order, setOrder] = useState<IOrder>();
    const [products, setProductsOrder] = useState<IProduct[]>([]);
    const [deliveryMans, setDeliveryMans] = useState<IUser[] | undefined>();
    const [deliveryMan, setDeliveryMan] = useState<{
        id: number | undefined,
        label: string | undefined
    } | null>();
    const [config, setConfig] = useState<IConfigs>();
    const user = getUser();

    useEffect(() => {
        if (!!id) {
            if(isNaN(Number(id))) {
                navigation('..');
                return;
            }

            OrderService.getById(Number(id)).
                then(response => {
                    setOrder(response.data);
                    setProductsOrder(response.data.products);
                }).
                catch(() => {
                    navigation('..');
                });
        }

        AdminService.getConfigs().
            then(response => {
                setConfig(response.data);
            });

        if (user?.role != Role.Admin) {
            return;
        }

        AdminService.getDeliveryMans().
            then(response => {
                setDeliveryMans(response.data);

                if (response.data?.length == 0) {
                    return;
                }
        
                const Man = response.data?.find((deliveryMan) => deliveryMan.id == order?.deliveryManId);
                if (!Man) {
                    setDeliveryMan(null);
                    return;
                }
        
                setDeliveryMan({
                    id: Man.id,
                    label: Man.name
                })
            });
    },[]);

    
    function approve() {
        if (!order?.id) {
            return;
        }
        OrderService.approve(order.id).
            then(response => {
                setOrder(response.data);
            });
    }

    function disapprove() {
        if (!order?.id) {
            return;
        }
        OrderService.disapprove(order.id).
            then(response => {
                setOrder(response.data);
            });
    }

    function makeReady() {
        if (!order?.id) {
            return;
        }
        OrderService.makeReady(order.id).
            then(response => {
                console.log(response.data)
                setOrder(response.data);
            });
    }

    function sent() {
        if (!order?.id) {
            return;
        }
        OrderService.sent(order.id).
            then(response => {
                setOrder(response.data);
            });
    }

    function deliver() {
        if (!order?.id) {
            return;
        }
        OrderService.deliver(order.id).
            then(response => {
                setOrder(response.data);
            });
    }

    function updateOrderDeliveryMan(newValue: {
        id: number | undefined;
        label: string | undefined;
    } | null) {
        setDeliveryMan(newValue);
        if (!order?.id) {
            return;
        }
        if (!!newValue && !!newValue.id) {
            AdminService.updateOrderDeliveyMan(order?.id, newValue.id);
        }else {            
            AdminService.updateOrderDeliveyMan(order?.id, null);
        }
    }

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
                    {`Pedido #${order?.code}`}
                </Typography>
            </div>
            <div
                style={{
                    overflow: "auto",
                    width: '100%',
                    height: '100%',
                    margin: '0px auto'
                }}
            >
                <div
                    style={{
                        height: '100%',
                        maxWidth: '700px',
                        margin: '0px auto',
                        padding: 10
                    }}
                >
                    <Typography variant="h6">
                        {order?.status}
                    </Typography>
                    <Divider />
                    {!order?.isDelivery && !!config?.address &&
                        <>
                            <Typography>
                                Endereço de retirada:
                                <br></br>
                                {config?.address}
                            </Typography>                            
                            <Divider />
                        </>                   
                    }
                    {!!order?.address && 
                        <>
                            <Typography variant="h6">
                                Endereço
                            </Typography>
                            <Typography>
                                {order?.address}
                            </Typography>
                            <Divider />
                        </>
                    }
                    <Typography variant="h6">
                        Pagamento
                    </Typography>
                    <Typography>
                        No momento da {order?.isDelivery ? 'entrega' : 'retirada'}
                    </Typography>
                    <Divider />
                    <Typography variant="h6">
                        Itens
                    </Typography>
                    {products.map((product) => 
                        <ProductCart key={product.id} product={new Product(product)} ProductOrder={true} />
                    )}
                </div>
            </div>
            <Paper sx={{
                    width: '100%'
                }}
            >
                <div style={
                {
                    maxWidth: '700px',
                    width: '100%',
                    padding: '10px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        {order?.isDelivery && config && config.deliveryTax > 0 &&
                            <>
                                <Typography variant="body2">
                                    {order?.isDelivery && config && config.deliveryTax > 0 &&
                                        `Subtotal: ${PriceFormat(order?.price - config.deliveryTax)}`
                                    }
                                </Typography>
                                <Typography variant="body2">
                                    {order?.isDelivery && config && config.deliveryTax > 0 &&
                                        `Taxa de entrega: ${PriceFormat(config.deliveryTax)}`
                                    }
                                </Typography>
                            </>
                        }
                        <Typography>
                            Total: {PriceFormat(order?.price || 0)}
                        </Typography>
                    </div>
                    <div style={{display: 'flex', flexGrow: 1, flexShrink: 1, justifyContent: 'flex-end'}}>
                        {(user?.role == Role.Admin || user?.role == Role.DeliveryMan) &&
                            <>
                                {user?.role == Role.Admin && !!deliveryMans?.length && deliveryMans?.length > 0 &&
                                    <Autocomplete
                                        size="small"
                                        sx={{paddingLeft: '20px', paddingRight: '20px', width: '100%', maxWidth: '300px', flexGrow: 1, flexShrink: 1}}
                                        options={deliveryMans?.map((deliveryMan) => {
                                            return {
                                                label: deliveryMan.name,
                                                id: deliveryMan.id
                                            }
                                        })}
                                        value={!!deliveryMan? {
                                            id: deliveryMan?.id,
                                            label: deliveryMan?.label
                                        } : null}
                                        onChange={(event, newValue) => {updateOrderDeliveryMan(newValue); console.log(event)}}
                                        renderInput={(params) => <TextField {...params} label="Entregador *" />}
                                    />
                                }
                                {user?.role == Role.Admin && !order?.preparing && !order?.disapproved && 
                                    <div>
                                        <IconButton sx={{backgroundColor: 'green', marginRight: '10px'}} onClick={approve}>
                                            <Done />
                                        </IconButton>
                                        <IconButton sx={{backgroundColor: 'red'}} onClick={disapprove}>
                                            <Clear />
                                        </IconButton>
                                    </div>
                                }
                                {user?.role == Role.Admin && !!order?.preparing && !order.ready && !order.inDelivery &&
                                    <Button
                                        variant="contained"
                                        onClick={makeReady}
                                    >
                                        Pronto
                                    </Button>
                                }
                                {!!order?.isDelivery && !!order.ready && !order.inDelivery &&
                                    <Button
                                        variant="contained"
                                        onClick={sent}
                                    >
                                        Enviar
                                    </Button>
                                }
                                {!!order?.inDelivery && order.isDelivery && !order.delivered &&
                                    <Button
                                        variant="contained"
                                        onClick={deliver}
                                    >
                                        Entregar
                                    </Button>
                                }
                            </>
                        }
                    </div>
                </div>
            </Paper>
        </>
    )
}