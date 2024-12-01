import { createTheme, PaletteMode, ThemeProvider, useMediaQuery } from "@mui/material";
import { createContext, useEffect, useMemo, useState } from "react";

export const MUIWrapperContext = createContext({
    toggleColorMode: () => {},
});

export default function MUIWrapper({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const prefersDarkMode  = useMediaQuery('(prefers-color-scheme: dark)');
    let savedTheme = localStorage.getItem("theme") as PaletteMode;
    if(!savedTheme) {      
      if (prefersDarkMode) {
        savedTheme = "dark";
      } else {
        savedTheme = "light";
      }
    }
    const [mode, setMode] = useState<PaletteMode>(savedTheme);
    const muiWrapperUtils = useMemo(
      () => ({
        toggleColorMode: () => {
          setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
        },
      }),
      []
    );

    useEffect(() => {
      localStorage.setItem("theme", mode);
    }, [mode]);
  
    const theme = useMemo(
      () =>
        createTheme({
          palette: {
            mode,
            primary: {
              main: '#A26B00'
            },
            secondary: {
              main: '#90caf9'
            }
          },
        }),
      [mode]
    );
  
    return (
      <MUIWrapperContext.Provider value={muiWrapperUtils}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </MUIWrapperContext.Provider>
    );
  }