import { useEffect, useState } from "react"
import IAddress from "../../shared/interfaces/IAddress"
import { AddressService } from "../../shared/services/api/Addresses/AddressesService";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardActions, CardContent, IconButton, Typography } from "@mui/material";
import { Add, AddCircle, ArrowBack, Delete } from "@mui/icons-material";

export default function Addresses() {
    const [addresses, setAddresses] = useState<IAddress[]>([]);
    const navigation = useNavigate();

    async function handleDelete(id: number) {
        await AddressService.remove(id);
        await searchAddresses();
    }
    async function searchAddresses() {
        const response = await AddressService.getAll();
        setAddresses(response);
    }

    useEffect(() => {
        searchAddresses()
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
                    Endereços
                </Typography>
            </div>
            <div
                style={{
                    overflow: "auto",
                    height: '100%',
                    width: '100%'
                }}
            >
                {addresses?.map((address) => 
                    <div key={address.id}
                        style={{
                            width: '100%',
                            maxWidth: '700px',
                            padding: '10px',
                            margin: '0px auto'              
                        }}>
                        <Card
                            sx={{
                                width: '100%',
                                height: '100%',
                                paddingTop: '10px',
                                paddingBottom: '10px',
                                paddingRight: '10px',
                                display: 'flex',
                                alignItems: 'center' 
                            }}>
                            <CardContent sx={{
                                flexGrow: 1,
                                flexShrink: 1,
                                height: '100%',
                                paddingTop: '0',
                                paddingBottom: '0',
                                cursor: 'pointer'
                            }}
                            onClick={() => navigation(`${window.location.pathname}/address/${address.id}`)}
                            >                                
                                {address.street}, {address.number} {address.complement && `- ${address.complement}`}<br></br>
                                {address.neighborhood}<br></br>
                                {address.postalCode}<br></br>
                            </CardContent>
                            <CardActions>
                                <IconButton onClick={() => handleDelete(address.id)}>
                                    <Delete />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </div>
                )}
                <div style={{
                        width: '100%',
                        maxWidth: '700px',
                        padding: '10px',
                        margin: '0px auto'              
                    }}>
                    <Card
                        sx={{
                            width: '100%',
                            height: '100%',
                            paddingTop: '10px',
                            paddingBottom: '10px',
                            paddingRight: '10px',
                            display: 'flex',
                            alignItems: 'center' 
                        }}>
                        <CardContent sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            flexGrow: 1,
                            flexShrink: 1,
                            height: '100%',
                            paddingTop: '0',
                            paddingBottom: '0 !important',
                            cursor: 'pointer'
                        }}
                        onClick={() => navigation(`${window.location.pathname}/address`)}
                        >                                
                            <AddCircle style={{
                                marginRight: '10px'
                            }}/> Adicione um novo endereço
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}