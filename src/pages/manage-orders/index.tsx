import { ArrowBack} from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import IOrder from "shared/interfaces/IOrder";
import { OrderService } from "../../shared/services/api/Order/OrderService";
import ManageOrder from "../../shared/components/ManageOrder";
import { AdminService } from "../../shared/services/api/Admin/AdminService";
import IUser from "../../shared/interfaces/IUser";

export default function ManageOrders() {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [deliveryMans, setDeliveryMans] = useState<IUser[] | undefined>();
    const navigation = useNavigate();

    useEffect(() => {
        OrderService.getAll().
            then(response => {
                setOrders(response.data);
            }).
            catch(() => navigation('..'));

        AdminService.getDeliveryMans().
            then(response => {
                setDeliveryMans(response.data);
            })
    }, []);
    
    return(
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
                    Gerenciar pedidos
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
                    <ManageOrder order={order} key={order.id} deliveryMans={deliveryMans}/>
                )}
            </div>
        </>
    )
}