import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../presentation/routes/PrivateRoute";
import Login from "../presentation/pages/Login";
import Register from "../presentation/pages/Register";
import Home from "../presentation/pages/Home";
import Connections from "../presentation/pages/Connections";
import Contacts from "../presentation/pages/Contacts";
import Messages from "../presentation/pages/Messages";

export function AppRoutes() {
  return (
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
  );
}
