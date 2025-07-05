import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FormsBox } from "../components/froms-box";
import { ControlledTextField } from "../components/controlled-text-field";
import { auth, googleAuthProvider } from "../../infra/services/firebase";
import { Google } from "@mui/icons-material";
import Button from "@mui/material/Button";

interface LoginForm {
  email: string;
  password: string;
}

export function Login() {
  const { handleSubmit, setError, control } = useForm<LoginForm>();

  const navigate = useNavigate();

  async function onSubmit(data: LoginForm) {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate("/");
    } catch (error: any) {
      const errorCode = error.code;
      console.error("Login error:", errorCode, error.message);

      switch (errorCode) {
        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
          setError("email", { message: "E-mail ou senha inválidos." });
          setError("password", { message: "" });
          break;

        case "auth/account-exists-with-different-credential":
          setError("email", {
            message:
              "Esta conta foi criada com Google. Use o botão 'Entrar com Google' abaixo.",
          });
          break;

        default:
          setError("email", {
            message: "Erro ao fazer login. Tente novamente.",
          });
          break;
      }
    }
  }

  async function handleGoogleLogin() {
    try {
      await signInWithPopup(auth, googleAuthProvider);
      navigate("/");
    } catch (error: any) {
      const errorCode = error.code;

      switch (errorCode) {
        case "auth/popup-closed-by-user":
          setError("email", { message: "Login cancelado pelo usuário." });
          break;

        case "auth/popup-blocked":
          setError("email", {
            message:
              "Pop-up bloqueado. Permita pop-ups para este site e tente novamente.",
          });
          break;

        default:
          setError("email", { message: "Erro ao fazer login com Google." });
          break;
      }
    }
  }

  return (
    <FormsBox title="Login">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ControlledTextField<LoginForm>
          name="email"
          control={control}
          rules={{ required: "E-mail obrigatório" }}
          label="E-mail"
          type="email"
        />
        <ControlledTextField<LoginForm>
          name="password"
          control={control}
          rules={{ required: "Senha obrigatória" }}
          label="Senha"
          type="password"
        />
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
