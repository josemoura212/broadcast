import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FormsBox } from "../components/froms-box";
import { auth, googleAuthProvider } from "../../infra/services/firebase";
import { Google } from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err: any) {
      setError("E-mail ou senha inválidos.");
    }
  }

  async function handleGoogleLogin() {
    try {
      await signInWithPopup(auth, googleAuthProvider);
      navigate("/");
    } catch (err: any) {
      setError("Erro ao fazer login com o Google.");
    }
  }

  return (
    <FormsBox title="Login">
      <form onSubmit={handleLogin}>
        <TextField
          label="E-mail"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Senha"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Entrar
        </Button>
      </form>
      <Button
        color="secondary"
        fullWidth
        sx={{ mt: 1 }}
        onClick={() => navigate("/register")}
      >
        Criar conta
      </Button>

      <Button
        color="primary"
        fullWidth
        variant="contained"
        sx={{ mt: 4 }}
        onClick={handleGoogleLogin}
      >
        <Google sx={{ mr: 1 }} style={{ fontSize: 20 }} />
        Entrar com Google
      </Button>
    </FormsBox>
  );
}
