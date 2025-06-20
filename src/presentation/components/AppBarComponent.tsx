import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { signOut } from "firebase/auth";
import { auth } from "../../infra/services/firebase";
import { useNavigate } from "react-router-dom";

const AppBarComponent: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Button
          color="inherit"
          onClick={() => navigate("/")}
          sx={{
            textTransform: "capitalize",
            fontWeight: "semibold",
            fontSize: 20,
          }}
        >
          Broadcast
        </Button>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
        <Button color="inherit" onClick={handleLogout}>
          <Typography
            sx={{
              textTransform: "capitalize",
              fontWeight: "semibold",
              fontSize: 20,
            }}
          >
            Logout
          </Typography>
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
