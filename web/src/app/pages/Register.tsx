import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../infra/services/firebase";
import { useNavigate } from "react-router-dom";
import { FormsBox } from "../components/froms-box";
import { ControlledTextField } from "../components/controlled-text-field";
import Button from "@mui/material/Button";

interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
}

export function Register() {
  const { handleSubmit, setError, control, watch } = useForm<RegisterForm>();

  const navigate = useNavigate();
  const password = watch("password");

  async function onSubmit(data: RegisterForm) {
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      navigate("/");
    } catch (error: any) {
      const errorCode = error.code;
      console.error("Register error:", errorCode, error.message);

      switch (errorCode) {
        case "auth/email-already-in-use":
          setError("email", { message: "E-mail já cadastrado." });
          break;

        default:
          setError("email", {
            message: "Erro ao criar conta. Tente novamente mais tarde.",
          });
          break;
      }
    }
  }

  return (
    <FormsBox title="Criar Conta">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-3 items-start flex-col"
      >
        <ControlledTextField
          name="email"
          control={control}
          label="E-mail"
          type="email"
          rules={{ required: "E-mail obrigatório" }}
        />
        <ControlledTextField
          name="password"
          control={control}
          label="Senha"
          type="password"
          rules={{
            required: "Senha obrigatória",
            minLength: {
              value: 6,
              message: "A senha deve ter pelo menos 6 caracteres",
            },
          }}
        />
        <ControlledTextField
          name="confirmPassword"
          control={control}
          label="Confirmar Senha"
          type="password"
          rules={{
            required: "Confirmação de senha obrigatória",
            validate: (value: string) =>
              value === password || "As senhas não coincidem",
          }}
        />
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
    </FormsBox>
  );
}
