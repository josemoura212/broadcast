import { Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./routes/private-route";
import { Register } from "./pages/register";
import { Home } from "./pages/home";
import { ConnectionPage } from "./connection/page/connection-page";
import { ContactPage } from "./contact/page/contact-page";
import { MessagePage } from "./message/page/message-page";
import { Login } from "./pages/login";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/connections" element={<ConnectionPage />} />
        <Route path="/contacts" element={<ContactPage />} />
        <Route path="/messages" element={<MessagePage />} />
      </Route>
    </Routes>
  );
}
