import { ArrowBack } from "@mui/icons-material";
import { Card, CardContent, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import IOrder from "../../shared/interfaces/IOrder";
import { OrderService } from "../../shared/services/api/Order/OrderService";
import ManageOrder from "../../shared/components/ManageOrder";

export default function Deliveries() {
    const [deliveries, setDeliveries] = useState<IOrder[]>([]);
    const navigation = useNavigate();

    useEffect(() => {
        OrderService.getDeliveries().
            then(response => setDeliveries(response.data)).
            catch(() => navigation('..'));
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
                    Entregas
                </Typography>
            </div>
            <div
                style={{
                    overflow: "auto",
                    height: '100%',
                    width: '100%'
                }}
            >
                {deliveries?.map((order) => 
                    <ManageOrder order={order} key={order.id} />
                )}
            </div>
        </>
    )
}