import { Box, Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { ArrowBack, Visibility, VisibilityOff } from "@mui/icons-material";
import api from "../../../shared/services/api/config/axios";
import Logo from "../../../shared/components/logo";
import { Link } from "react-router-dom";

export default function Register() {    
    const theme = useTheme();

    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [errorMessage, setErrorMessage] = useState('');
    const [sucessMessage, setSuccessMessage] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

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

    function handleSubmit(event: React.BaseSyntheticEvent) {
        event.preventDefault()
        
        setNameError('');
        setEmailError('');
        setPasswordError('');
        setErrorMessage('');
        setSuccessMessage('');
 
        if (formData.name == '') {
            setNameError('Nome é obrigatório.')
        }
        if (formData.email == '') {
            setEmailError('E-mail é obrigatório.')
        }
        if (formData.password == '') {
            setPasswordError('Senha é obrigatório.')
        }
 
        if (formData.name && formData.email && formData.password) {
            api.post<string>(
                '/auth/register',
                formData
            ).then(
                (response) => {
                    if(response.status == 200){
                        setSuccessMessage(response.data);
                    }
                }
            ).catch(
                (error) => {
                    setErrorMessage(error.message);
                }
            )
        }
    }

    return (
        <>
            <Link to={'../login'}>
                <IconButton sx={{
                    position: 'absolute',
                    top: 10,
                    left: 10
                }}>
                    <ArrowBack />
                </IconButton>
            </Link>
            <Box
                display="flex"
                alignItems="center"
                flexDirection="column"
                width="100%"
                maxWidth="400px"
                height="100%"
                maxHeight="400px"
                paddingLeft="20px"
                paddingRight="20px"
            >
                <Typography
                    component="h1"
                    fontSize="2rem"
                    display="flex"
                >
                    Coffee Break 
                    <Logo width={40} height={40}/>
                </Typography>
                <h1>Criar conta</h1>
                <Box
                    component="form"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "20px",
                        width: "100%",
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
                        error={!!nameError}
                    />
                    <TextField
                        size="small"
                        fullWidth
                        required
                        label="E-mail"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        error={!!emailError}
                    />
                    <FormControl size="small" variant="outlined" fullWidth required>
                        <InputLabel htmlFor="outlined-adornment-password" error={!!passwordError}>Senha</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                        >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Senha"
                                name="password"
                                error={!!passwordError}
                                onChange={handleInputChange}
                            />
                    </FormControl>
                    {errorMessage !== '' && <Typography color={theme.palette.error.main}>{errorMessage}</Typography>}
                    {sucessMessage !== '' && <Typography color={theme.palette.success.main}>{sucessMessage}</Typography>}
                    <Button
                        variant="contained"
                        type="submit"
                    >
                        Confirmar
                    </Button>
                </Box>
            </Box>
        </>
    )
}