import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { AppRoutes } from "./routes";
import darkTheme from "./theme";
import { AuthProvider } from "./context/AuthContext";

const App: React.FC = () => (
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
