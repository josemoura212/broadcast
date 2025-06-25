import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ConnectionPage from "./connections/page/ConnectionsPage";
import Messages from "./messages/page/Messages";
import ContactPage from "./contact/page/ContactPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/connections" element={<ConnectionPage />} />
        <Route path="/contacts" element={<ContactPage />} />
        <Route path="/messages" element={<Messages />} />
      </Route>
    </Routes>
  );
}
