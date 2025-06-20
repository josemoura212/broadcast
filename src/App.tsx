import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Connections from "./pages/Connections";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import Home from "./pages/Home";
import Contacts from "./pages/Contacts";
import Messages from "./pages/Messages";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#028C2EFF",
    },
  },
});

const App: React.FC = () => (
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/messages" element={<Messages />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
