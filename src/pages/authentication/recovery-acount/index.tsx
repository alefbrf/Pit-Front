import { Box, Button, IconButton, TextField, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import api from "../../../shared/services/api/config/axios";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../../shared/components/logo";
import { ArrowBack } from "@mui/icons-material";

export default function Recovery() {    
    const navigate = useNavigate();
    const theme = useTheme();

    const [email, setEmail] = useState('');

    const [emailError, setEmailError] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');
    function handleSubmit(event: React.BaseSyntheticEvent) {
        event.preventDefault();
 
        setEmailError(false);
        setErrorMessage('');
 
        if (!email) {
            setEmailError(true)
        }
        if (email) {
            api.post(
                '/auth/request-code',
                email
            ).then(
                (response) => {
                    if(response.status == 200){
                        navigate('../login-code');
                        return;
                    }
                }
            ).catch(
                (error) => {
                    setErrorMessage(error.message);
                    setEmailError(true);
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
                <h1>Recuperar Conta</h1>
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={emailError}
                    />
                    {errorMessage !== '' && <Typography color={theme.palette.error.main}>{errorMessage}</Typography>}
                    <Button
                        variant="contained"
                        type="submit"
                    >
                        Confirmar
                    </Button>
                    <Typography marginTop="10px" textAlign="center">
                        Você receberá um email<br/> com um código de acesso
                    </Typography>
                </Box>
            </Box>
        </>
    )
}