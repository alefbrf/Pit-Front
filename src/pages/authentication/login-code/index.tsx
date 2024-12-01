import { Box, Button, IconButton, TextField, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import api from "../../../shared/services/api/config/axios";
import { setToken } from "../../../shared/services/api/auth/authentication";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../../shared/components/logo";
import { ArrowBack } from "@mui/icons-material";

export default function LoginCode() {    
    const navigate = useNavigate();
    const theme = useTheme();

    const [formData, setFormData] = useState({
        email: "",
        code: "",
    });

    const handleInputChange = (e: React.BaseSyntheticEvent) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const [emailError, setEmailError] = useState(false);
    const [codeError, setCodeError] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');
    function handleSubmit(event: React.BaseSyntheticEvent) {
        event.preventDefault();
 
        setEmailError(false);
        setCodeError(false);
        setErrorMessage('');
 
        if (formData.email == '') {
            setEmailError(true)
        }
        if (formData.code == '') {
            setCodeError(true)
        }
 
        if (formData.email && formData.code) {
            api.post<string>(
                '/auth/login-code',
                formData
            ).then(
                (response) => {
                    if(response.status == 200){
                        setToken(response.data);
                        navigate("..");
                        return;
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
                <h1>Login com código</h1>
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
                        label="E-mail" 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        error={emailError}
                    />
                    <TextField
                        size="small"
                        fullWidth
                        required
                        label="Código" 
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleInputChange}
                        error={codeError}
                    />
                    {errorMessage !== '' && <Typography color={theme.palette.error.main}>{errorMessage}</Typography>}
                    <Button
                        variant="contained"
                        type="submit"
                    >
                        Entrar
                    </Button>
                </Box>
            </Box>
        </>
    )
}