import { Box, Button, FormControl, IconButton, InputAdornment, InputLabel, Link, OutlinedInput, TextField, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { Link as RouterLink, useNavigate} from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import api from "../../../shared/services/api/config/axios";
import { setToken } from "../../../shared/services/api/auth/authentication";
import Logo from "../../../shared/components/logo";

export default function Login() {    
    const navigate = useNavigate();
    const theme = useTheme();

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const [formData, setFormData] = useState({
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

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');
    function handleSubmit(event: React.BaseSyntheticEvent) {
        event.preventDefault();
 
        setEmailError(false);
        setPasswordError(false);
        setErrorMessage('');
 
        if (formData.email == '') {
            setEmailError(true)
        }
        if (formData.password == '') {
            setPasswordError(true)
        }
 
        if (formData.email && formData.password) {
            api.post<string>(
                '/auth/login',
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
            <h1>Login</h1>
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
                <FormControl size="small" variant="outlined" fullWidth required>
                    <InputLabel htmlFor="outlined-adornment-password">Senha</InputLabel>
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
                            value={formData.password}
                        />
                </FormControl>
                {errorMessage !== '' && <Typography color={theme.palette.error.main}>{errorMessage}</Typography>}
                <Button
                    variant="contained"
                    type="submit"
                >
                    Entrar
                </Button>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                    marginTop: "20px"
                }}
            >
                <Link
                    component={RouterLink}
                    to="/register"
                    underline="none"
                    color="secondary"
                >
                    Criar Conta
                </Link>
                <span>
                    Esqueceu a senha?
                    <Link
                        component={RouterLink}
                        marginLeft="5px"
                        to="/recovery"
                        underline="none"
                        color="secondary"
                    >
                        Recuperar conta
                    </Link>
                </span>
                <Link
                    component={RouterLink}
                    to="/login-code"
                    underline="none"
                    color="secondary"
                >
                    Entrar com código
                </Link>
            </Box>
        </Box>
    )
}