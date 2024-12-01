import { Box, Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { ArrowBack, Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { getUser } from "../../../shared/services/api/auth/authentication";
import api from "../../../shared/services/api/config/axios";

export default function ChangePassword() {    
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);    
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const [showConfirmationPassword, setShowConfirmationPassword] = useState(false);
    const handleClickShowConfirmationPassword = () => setShowConfirmationPassword((show) => !show);
    
    const [sendCodeMessage, setSendCodeMessage] = useState('');
    const [sendCodeError, setSendCodeError] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [changePasswordError, setChangePasswordError] = useState('');
    const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);

    const [formData, setFormData] = useState({
        code: "",
        newPassword: "",
        confirmationPassword: ""
    });

    const handleInputChange = (e: React.BaseSyntheticEvent) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    function handleSubmitCode(event: React.BaseSyntheticEvent) {
        event.preventDefault();
        
        const user = getUser();

        if (!user){
            navigate('..');
            return;
        }

        setSendCodeMessage('');
        setSendCodeError(false);
        
        if (user.email) {
            api.post(
                '/auth/request-code',
                user.email
            ).then(
                (response) => {
                    if(response.status == 200){                        
                        setSendCodeMessage('Código de verificação enviado para seu email.');
                        return;
                    }
                }
            ).catch(
                (error) => {
                    setSendCodeMessage(error.message);
                }
            )
        }
    }

    function handleSubmitNewPassword(event: React.BaseSyntheticEvent) {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }
        
        api.post(
            '/auth/change-password',
            formData
        ).then(
            (response) => {
                if(response.status == 200){                        
                    setChangePasswordSuccess(true);
                    return;
                }
            }
        ).catch(
            (error) => {
                setChangePasswordError(error.message); 
                setSendCodeError(true);
            }
        )
    }

    function validateForm() {
        let valid = true;
        setSendCodeMessage('');
        setPasswordError('');
        setChangePasswordError('');
        setSendCodeError(false);          
        setChangePasswordSuccess(false);

        if (!formData.code) {
            setSendCodeMessage('Código é obrigatório.');
            setSendCodeError(true);
            valid = false;
        }

        if (formData.newPassword !== formData.confirmationPassword) {
            setPasswordError('As senhas devem ser iguais!');
            valid = false;
        }
        
        if (!formData.newPassword || !formData.confirmationPassword) {
            setPasswordError('Senha e confirmação de senha são obrigatórios!');
            valid = false;
        }

        return valid;
    }

    return(
        <>
            <div style={{
                position: 'absolute',
                top: 10,
                left: 10,
                display: 'flex',
                alignItems: 'center'
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
                    Alterar Senha
                </Typography>
            </div>
            <Box             
                display="flex"
                alignItems="center"
                flexDirection="column"
                justifyContent="center"
                width="100%"
                height="100%"
            >
                <Box
                    component="form"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "20px",
                        width: "100%",
                        maxWidth: "400px",
                        maxHeight: "400px",
                        paddingLeft:"20px",
                        paddingRight:"20px"
                    }}
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmitNewPassword}
                >
                    <TextField
                        size="small"
                        fullWidth
                        required
                        label="Código" 
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleInputChange}
                        helperText={sendCodeMessage}
                        error={sendCodeError}
                    />
                    <FormControl size="small" variant="outlined" fullWidth required>
                        <InputLabel htmlFor="outlined-adornment-password" error={!!passwordError}>Nova Senha</InputLabel>
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
                            label="Nova Senha"
                            name="newPassword"
                            error={!!passwordError}
                            onChange={handleInputChange}
                            value={formData.newPassword}
                        />
                    </FormControl>
                    <FormControl size="small" variant="outlined" fullWidth required>
                        <InputLabel htmlFor="outlined-adornment-confirm-password" error={!!passwordError}>Confirmar Nova Senha</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-confirm-password"
                            type={showConfirmationPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowConfirmationPassword}
                                        edge="end"
                                    >
                                    {showConfirmationPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Confirmar Nova Senha"
                            name="confirmationPassword"
                            error={!!passwordError}
                            onChange={handleInputChange}
                            value={formData.confirmationPassword}
                        />
                    </FormControl>
                    {passwordError && 
                        <Typography color='red' fontSize='0.8'>
                            {passwordError}
                        </Typography>
                    }
                    {!!changePasswordError &&
                        <Typography color='red' fontSize='0.8'>
                            {changePasswordError}
                        </Typography>
                    }
                    {!!changePasswordSuccess &&
                        <Typography color='green' fontSize='0.8'>
                            Senha alterada com sucesso.
                        </Typography>
                    }
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        width: '100%'
                    }}>
                        <Button
                            variant="contained"
                            onClick={handleSubmitCode}
                        >
                            Enviar código
                        </Button>
                        <Button
                            variant="contained"
                            type="submit"
                        >
                            Confirmar
                        </Button>
                    </div>
                </Box>
            </Box>
        </>
    )
}