import { Box, Button, Dialog, IconButton, Link, Paper, Snackbar, SnackbarContent, TextField, Typography, useTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { getUser, logout } from "../../shared/services/api/auth/authentication";
import { Link as RouterLink } from "react-router-dom";
import { Role } from "../../shared/Enums/Role";
import { MUIWrapperContext } from "../../theme";
import { Clear, DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";
import { AdminService } from "../../shared/services/api/Admin/AdminService";
import PriceFormat from "../../shared/Utils/PriceFormat";
import { AutoNumericTextField } from "material-ui-autonumeric";

export default function Profile() {
    const user = getUser();

    const theme = useTheme();
    const muiUtils = useContext(MUIWrapperContext);
    const [dialogOpen, setDialogOpen] = useState(false);
    
    const [snackBarOpen, setSnackBarOpen] = useState(false);

    const [formData, setFormData] = useState({
        address: "",
        deliveryTax: ""
    });

    const [errors, setErrors] = useState({
        Address: new Array<String>(),
        DeliveryTax: new Array<String>(),
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

    const handleInputChange = (e: React.BaseSyntheticEvent) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    useEffect(() => {
        AdminService.getConfigs().
            then(response => {
                setFormData({
                    address: response.data?.address || '',
                    deliveryTax: response.data?.deliveryTax ? PriceFormat(response.data.deliveryTax).replaceAll("R$", "").trim() : ''
                })
            });
    }, []);

    function handleSubmit(event: React.BaseSyntheticEvent) {
        event.preventDefault();
        setErrors({
            Address: new Array<String>(),
            DeliveryTax: new Array<String>()
        });
        let deliveryTax = formData.deliveryTax;
        deliveryTax = deliveryTax.replaceAll(".", "").replaceAll(",", ".");
        AdminService.saveConfigs({
            address: formData.address,
            deliveryTax: Number(deliveryTax)
        }).
            then(() => {                
                setSnackBarOpen(true);
            }).
            catch(error => {
                setErrors(error.errors);
            });
    }

    return(
        <>
            <div style={{
                maxWidth: '700px',
                height: '100%',
                width: '100%',
                margin: '0 auto',
                padding: '10px'
            }}>
                <Paper elevation={10} sx={{
                    maxWidth: '700px',
                    width: '100%',
                    padding: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Typography>
                        Olá, {user?.name}!
                    </Typography>
                    <IconButton
                        disableTouchRipple
                        disableRipple
                        onClick={muiUtils.toggleColorMode}
                    >
                        {theme.palette.mode === 'dark' ? (
                                <LightModeOutlined/>
                            ) : (
                                <DarkModeOutlined/>
                            )
                        }
                    </IconButton>
                </Paper>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    rowGap: '10px',
                    marginTop: '10px'
                }}>
                    <Link 
                        to={'addresses'}
                        component={RouterLink}
                        underline='none'
                    >
                        Endereços
                    </Link>
                    <Link 
                        to={'orders'}
                        component={RouterLink}
                        underline='none'
                    >
                        Pedidos
                    </Link>
                    <Link 
                        to={'change-password'}
                        component={RouterLink}
                        underline='none'
                    >
                        Alterar Senha
                    </Link>
                    {
                        (user?.role === Role.DeliveryMan || user?.role === Role.Admin) &&
                        <Link 
                            to={'deliveries'}
                            component={RouterLink}
                            underline='none'
                        >
                            Entregas
                        </Link>
                    }
                    {
                        user?.role === Role.Admin &&
                        <Link 
                            to={'manage-itens'}
                            component={RouterLink}
                            underline='none'
                        >
                            Gerenciar itens
                        </Link>
                    }
                    {
                        user?.role === Role.Admin &&
                        <Link 
                            to={'manage-orders'}
                            component={RouterLink}
                            underline='none'
                        >
                            Gerenciar pedidos
                        </Link>
                    }
                    {
                        user?.role === Role.Admin &&
                        <Link 
                            to={'manage-delivery-mans'}
                            component={RouterLink}
                            underline='none'
                        >
                            Gerenciar entregadores
                        </Link>
                    }
                    {
                        user?.role === Role.Admin &&
                        <Link
                            to=""
                            underline='none'
                            component={RouterLink}
                            onClick={() => setDialogOpen(true)}
                        >
                            Configurações
                        </Link>
                    }
                    <Link 
                        to=''
                        component={RouterLink}
                        underline='none'
                        onClick={logout}
                    >
                        Sair
                    </Link>
                </div>
            </div>
            <Dialog open={dialogOpen} fullWidth>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
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
                        maxWidth:"700px",
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
                        label="Endereço" 
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        error={hasError(errors.Address)}
                        helperText={getErrorMessage(errors.Address)}
                        sx={{
                            maxWidth: '700px',
                            width: '100%'
                        }}
                    />
                    <AutoNumericTextField
                        props={{
                            size: 'small',
                            label:"Taxa de entrega",                                
                            fullWidth: true,
                            name: "deliveryTax",
                            value: formData.deliveryTax,
                            onChange: handleInputChange,
                            error: hasError(errors.DeliveryTax),
                            helperText: getErrorMessage(errors.DeliveryTax)
                        }}
                        autoNumericOptions={{
                            decimalCharacter: ',',
                            digitGroupSeparator: '.',
                            maximumValue: "99999.99",
                            minimumValue: '0'
                        }}
                    />
                    
                    <Button
                        variant="contained"
                        type="submit"
                    >
                        Salvar
                    </Button>
                </Box>
            </Dialog>
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
                    message="Operação realizada com sucesso!"
                />
            </Snackbar>
        </>
    )
}