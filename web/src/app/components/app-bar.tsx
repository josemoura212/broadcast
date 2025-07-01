import { AppBar as MuiAppBar } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../infra/services/firebase";

export function AppBar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <MuiAppBar position="static">
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
    </MuiAppBar>
  );
}
