import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import FormsBase from "../components/FormsBase";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err: any) {
      setError("Erro ao criar conta. Verifique os dados e tente novamente.");
    }
  };

  return (
    <FormsBase title="Criar Conta">
      <form onSubmit={handleRegister}>
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
        <TextField
          label="Confirmar Senha"
          type="password"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
          Cadastrar
        </Button>
      </form>
      <Button
        color="secondary"
        fullWidth
        sx={{ mt: 1 }}
        onClick={() => navigate("/login")}
      >
        Já tenho conta
      </Button>
    </FormsBase>
  );
};

export default Register;
