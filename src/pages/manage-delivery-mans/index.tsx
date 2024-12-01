import { useEffect, useState } from "react";
import IUser from "../../shared/interfaces/IUser";
import { AdminService } from "../../shared/services/api/Admin/AdminService";
import { Link } from "react-router-dom";
import { Box, Button, Card, CardContent, Dialog, IconButton, TextField, Typography } from "@mui/material";
import { AddCircle, ArrowBack, Clear } from "@mui/icons-material";

export default function ManageDeliveryMans() {    
    const [deliveryMans, setDeliveryMans] = useState<IUser[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleInputChange = (e: React.BaseSyntheticEvent) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const [errors, setErrors] = useState({
        Name: new Array<String>(),
        Email: new Array<String>(),
        Password: new Array<String>()
    });

    function hasError(errors: String[]) {
        if (errors) {
            return !!errors.join(',');
        }

        return false;
    }

    function getErrorMessage(errors: String[]) {
        if (!hasError(errors)) {
            return '';
        }

        return errors.join(', ');
    }

    function handleSubmit(event: React.BaseSyntheticEvent) {
        event.preventDefault();
        setErrors({
            Name: new Array<String>(),
            Email: new Array<String>(),
            Password: new Array<String>()
        });

        AdminService.createDeliveryMan(formData).
            then(() => {
                setDialogOpen(false);
                getDeliveryMans();
            }).
            catch(errors => {
                setErrors(errors.errors);
                console.log(errors)
            });
    }

    function getDeliveryMans() {
        AdminService.getDeliveryMans().
            then(response => {
                setDeliveryMans(response.data);
            })
    }

    useEffect(() => {
        getDeliveryMans();
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
                    Entregadores
                </Typography>
            </div>
            <div
                style={{
                    overflow: "auto",
                    height: '100%',
                    width: '100%'
                }}
            >
                {deliveryMans?.map((deliveryMan) => 
                    <div key={deliveryMan.id}
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
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <div>{deliveryMan.name}</div>
                                    <div>{deliveryMan.email}</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>                    
                )}
                    <div
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
                                    display: 'flex',
                                    justifyContent: 'center',
                                    flexGrow: 1,
                                    flexShrink: 1,
                                    height: '100%',
                                    paddingTop: '0',
                                    paddingBottom: '0 !important',
                                    cursor: 'pointer'
                                }}
                                onClick={() => setDialogOpen(true)}
                            >
                                <AddCircle style={{
                                    marginRight: '10px'
                                }}/> Adicione um novo entregador
                            </CardContent>
                        </Card>
                    </div>
            </div>
            <Dialog open={dialogOpen} sx={{
                    padding: 10,
                    overflow: "auto",
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    width: '100%',
                }}>
                    <IconButton onClick={() => setDialogOpen(false)}>
                        <Clear />                    
                    </IconButton>
                </div>
                <Box
                    component="form"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "20px",
                        width: "100%",
                        maxWidth:"400px",
                        padding: '10px'
                    }}
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit}    
                >
                    <TextField
                        size="small"
                        fullWidth
                        required
                        label="Nome" 
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        error={hasError(errors.Name)}
                        helperText={getErrorMessage(errors.Name)}
                    />
                    <TextField
                        size="small"
                        fullWidth
                        required
                        label="Email" 
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        error={hasError(errors.Email)}
                        helperText={getErrorMessage(errors.Email)}
                    />
                    <TextField
                        size="small"
                        fullWidth
                        required
                        label="Senha" 
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        error={hasError(errors.Password)}
                        helperText={getErrorMessage(errors.Password)}
                    />
                    <Button
                        variant="contained"
                        type="submit"
                    >
                        Salvar
                    </Button>
                </Box>
            </Dialog>
        </>
    )
}