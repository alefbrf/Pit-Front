import { HashRouter } from "react-router-dom"
import MUIWrapper from "./theme"
import { CssBaseline } from "@mui/material"
import Layout from "./layout"
import { GlobalLoader } from "./shared/components/loader/GlobalLoader"
import AppRouter from "./routes/AppRouter"

function App() {
  return (
    <MUIWrapper>
      <CssBaseline/>
      <Layout>
        <GlobalLoader/>
        <HashRouter>
          <AppRouter /> 
        </HashRouter>
      </Layout>
    </MUIWrapper>
  )
}

export default App
