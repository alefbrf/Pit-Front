import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import api from "../../services/api/config/axios";
import { Box, CircularProgress } from "@mui/material";

const useAxiosLoader = () => {
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        const inc = (mod: number) => setCounter(c => c + mod);

        const handleRequest = (config: InternalAxiosRequestConfig) => (inc(1), config);
        const handleResponse = (response: AxiosResponse) => (inc(-1), response);
        const handleError = (error: AxiosError) => (inc(-1), Promise.reject(error.response?.data));

        const reqInterceptor = api.interceptors.request.use(handleRequest, handleError);
        const resInterceptor = api.interceptors.response.use(handleResponse, handleError);
        return () => {
            api.interceptors.request.eject(reqInterceptor);
            api.interceptors.response.eject(resInterceptor);
        };
    }, []);

    return counter > 0;
};

export function GlobalLoader() {
    const loading = useAxiosLoader();
    return (
        <>
            {
                loading &&
                <Box 
                    position={'absolute'}
                    width={'100%'}
                    height={'100%'}
                    zIndex={9999}
                    left={0}
                    top={0}
                    display={"flex"}
                    justifyContent={'center'}
                    alignItems={'center'}
                    sx={{
                        backgroundColor: '#00000080'
                    }}
                >
                    <CircularProgress />
                </Box>
            }
        </>
    )
}