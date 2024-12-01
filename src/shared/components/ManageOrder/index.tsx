import { Clear, Done } from "@mui/icons-material";
import { Autocomplete, Button, Card, CardActions, CardContent, IconButton, TextField } from "@mui/material";
import IOrder from "../../interfaces/IOrder";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OrderService } from "../../services/api/Order/OrderService";
import PriceFormat from "../../../shared/Utils/PriceFormat";
import { getUser } from "../../../shared/services/api/auth/authentication";
import { Role } from "../../../shared/Enums/Role";
import IUser from "../../../shared/interfaces/IUser";
import { AdminService } from "../../../shared/services/api/Admin/AdminService";

export default function ManageOrder(props: {order: IOrder, deliveryMans?: IUser[]}) {    
    const [order, setOrder] = useState<IOrder>(props.order)
    const [deliveryMan, setDeliveryMan] = useState<{
        id: number | undefined,
        label: string | undefined
    } | null>();
    const navigation = useNavigate();
    const user = getUser();

    function approve() {
        OrderService.approve(order.id).
            then(response => {
                setOrder(response.data);
            });
    }

    function disapprove() {
        OrderService.disapprove(order.id).
            then(response => {
                setOrder(response.data);
            });
    }

    function makeReady() {
        OrderService.makeReady(order.id).
            then(response => {
                setOrder(response.data);
            });
    }

    function sent() {
        OrderService.sent(order.id).
            then(response => {
                setOrder(response.data);
            });
    }

    function deliver() {
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
        if (!!newValue && !!newValue.id) {
            AdminService.updateOrderDeliveyMan(order.id, newValue.id);
        } else {            
            AdminService.updateOrderDeliveyMan(order.id, null);
        }
    }

    useEffect(() => {
        if (props.deliveryMans?.length == 0) {
            return;
        }

        const Man = props.deliveryMans?.find((deliveryMan) => deliveryMan.id == order.deliveryManId);
        if (!Man) {
            setDeliveryMan(null);
            return;
        }

        setDeliveryMan({
            id: Man.id,
            label: Man.name
        })
    }, []);

    return (
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
                    flexDirection: 'column'
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
                    {!order.isDelivery && 
                        <div>
                            Retirada
                        </div>
                    }
                    {order.isDelivery && 
                        <div>
                            {order.address}
                        </div>
                    }
                    {!!order.observation && 
                        <div>
                            - {order.observation}
                        </div>
                    }
                    <div>
                        {order.status}
                    </div>
                </CardContent>
                <CardActions sx={{marginLeft: '5px', flexDirection: 'column', alignItems: 'flex-start'}}>
                    <>
                        {user?.role == Role.Admin && !order.preparing && !order.disapproved && 
                            <div>
                                <IconButton sx={{backgroundColor: 'green'}} onClick={approve}>
                                    <Done />
                                </IconButton>
                                <IconButton sx={{backgroundColor: 'red', marginLeft: '5px'}} onClick={disapprove}>
                                    <Clear />
                                </IconButton>
                            </div>
                        }
                        {user?.role == Role.Admin && !!order.preparing && !order.ready && !order.inDelivery &&
                            <>
                                <Button
                                    variant="contained"
                                    onClick={makeReady}
                                >
                                    Pronto
                                </Button>
                            </>
                        }
                        {!!order.isDelivery && !!order.ready && !order.inDelivery &&
                            <>
                                <Button
                                    variant="contained"
                                    onClick={sent}
                                >
                                    Enviar
                                </Button>
                            </>
                        }
                        {!!order.inDelivery && order.isDelivery && !order.delivered &&
                            <>
                                <Button
                                    variant="contained"
                                    onClick={deliver}
                                >
                                    Entregar
                                </Button>
                            </>
                        }
                        {user?.role == Role.Admin && !!props.deliveryMans?.length && props.deliveryMans?.length > 0 &&
                            <Autocomplete
                                size="small"
                                sx={{ marginLeft: '0 !important', marginTop: '15px', width: '100%'}}
                                options={props.deliveryMans?.map((deliveryMan) => {
                                    return {
                                        label: deliveryMan.name,
                                        id: deliveryMan.id
                                    }
                                })}
                                value={!!deliveryMan? {
                                    id: deliveryMan?.id,
                                    label: deliveryMan?.label
                                } : null}
                                onChange={(event, newValue) => updateOrderDeliveryMan(newValue)}
                                renderInput={(params) => <TextField {...params} label="Entregador *" />}
                            />
                        }
                    </>
                </CardActions>
            </Card>
        </div>
    )
}