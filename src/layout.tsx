import { Box } from "@mui/material";

export default function Layout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return(
        <Box
            height="100%"
            width="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
        >
            {children}
        </Box>
    )
}