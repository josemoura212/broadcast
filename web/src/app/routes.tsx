import { Routes, Route } from "react-router-dom";
import { lazy } from "react";
import { PrivateRoute } from "./routes/PrivateRoute";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Home = lazy(() => import("./pages/Home"));
const ConnectionPage = lazy(() => import("./connection/page/ConnectionPage"));
const ContactPage = lazy(() => import("./contact/page/ContactPage"));
const MessagePage = lazy(() => import("./message/page/MessagePage"));

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
