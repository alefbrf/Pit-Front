import { ArrowBack } from "@mui/icons-material";
import { Box, Button, IconButton, Snackbar, SnackbarContent, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addressDTO, AddressService } from "../../shared/services/api/Addresses/AddressesService";

export default function Address() {
    const {id} = useParams();
    const navigation = useNavigate();
    const [snackBarOpen, setSnackBarOpen] = useState(false);

    const [formData, setFormData] = useState<addressDTO>({
        postalCode: "",
        neighborhood: "",
        street: "",
        number: "",
        complement: ""
    });

    const [errors, setErrors] = useState({
        PostalCode: new Array<String>(),
        Neighborhood: new Array<String>(),
        Street: new Array<String>(),
        Number: new Array<String>(),
        Complement: new Array<String>()
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
        if (!!id) {
            if (isNaN(Number(id))) {
                navigation('..');
                return;
            }
            AddressService.getById(Number(id)).
                then(response => {
                    if(!response) {
                        navigation('..');
                        return;
                    }
                    setFormData({
                        complement: response.complement,
                        neighborhood: response.neighborhood,
                        number: response.number,
                        postalCode: response.postalCode,
                        street: response.street
                    });
                });
        }
    }, []);

    function handleSubmit(event: React.BaseSyntheticEvent) {
        event.preventDefault();
        setErrors({
            PostalCode: new Array<String>(),
            Neighborhood: new Array<String>(),
            Street: new Array<String>(),
            Number: new Array<String>(),
            Complement: new Array<String>()
        });
        
        if(!id) {
            AddressService.create(formData).
                then(response => {
                    navigation(`${response.data.id}`);
                }).
                catch(error => {
                    setErrors(error.errors);
                });
            return;
        }

        AddressService.update(Number(id), formData).
            then(response => {
                setFormData({
                    complement: response.data.complement,
                    neighborhood: response.data.neighborhood,
                    number: response.data.number,
                    postalCode: response.data.postalCode,
                    street: response.data.street
                });
            }).
            catch(error => {
                setErrors(error.errors);
            });
    }

    return(
        <>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                margin: 10
            }}>
                <Link to={!!id ? '../..' : '..'}>
                    <IconButton>
                        <ArrowBack />                    
                    </IconButton>
                </Link>
                <Typography
                    component="h1"
                    fontSize="1.5rem"
                >
                    {!!id ? 'Endereço' : 'Novo endereço'}
                </Typography>
            </div>
            <div style={{
                    overflow: "auto",
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10
                }}>
                <Box
                    component="form"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "20px",
                        width: "100%",
                        maxWidth:"400px"
                    }}
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit}    
                >
                    <TextField
                        size="small"
                        fullWidth
                        required
                        label="CEP" 
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        error={hasError(errors.PostalCode)}
                        helperText={getErrorMessage(errors.PostalCode)}
                    />
                    <TextField
                        size="small"
                        fullWidth
                        required
                        label="Bairro" 
                        type="text"
                        name="neighborhood"
                        value={formData.neighborhood}
                        onChange={handleInputChange}
                        error={hasError(errors.Neighborhood)}
                        helperText={getErrorMessage(errors.Neighborhood)}
                    />
                    <TextField
                        size="small"
                        fullWidth
                        required
                        label="Rua" 
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        error={hasError(errors.Street)}
                        helperText={getErrorMessage(errors.Street)}
                    />
                    <TextField
                        size="small"
                        fullWidth
                        required
                        label="Número" 
                        type="text"
                        name="number"
                        value={formData.number}
                        onChange={handleInputChange}
                        error={hasError(errors.Number)}
                        helperText={getErrorMessage(errors.Number)}
                    />
                    <TextField
                        size="small"
                        fullWidth
                        label="Complemento" 
                        type="text"
                        name="complement"
                        value={formData.complement}
                        onChange={handleInputChange}
                        error={hasError(errors.Complement)}
                        helperText={getErrorMessage(errors.Complement)}
                    />
                    <Button
                        variant="contained"
                        type="submit"
                    >
                        Salvar
                    </Button>
                </Box>
            </div>
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
                    message="Endereço salvo com sucesso!"
                />
            </Snackbar>
        </>
    )
}