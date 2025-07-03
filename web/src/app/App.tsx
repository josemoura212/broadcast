import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes";
import { darkTheme } from "./theme";
import { AuthProvider } from "./context/auth-context";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR } from "date-fns/locale";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { ConnectionProvider } from "./context/connection-context";

export function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <AuthProvider>
          <ConnectionProvider>
            <Router>
              <AppRoutes />
            </Router>
          </ConnectionProvider>
        </AuthProvider>
      </ThemeProvider>
    </LocalizationProvider>
  );
}
