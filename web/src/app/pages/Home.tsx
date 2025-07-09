import { useNavigate } from "react-router-dom";
import { DefaultMenu } from "../components/default-menu";
import { useAuth } from "../context/auth-context";
import { useConnectionCtx } from "../context/connection-context";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

export function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { conn } = useConnectionCtx();

  return (
    <DefaultMenu>
      <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h5" mb={3} align="center">
          Olá {user?.displayName}, Bem-vindo ao Broadcast!
        </Typography>
        {conn ? (
          <Typography variant="body1" align="center">
            Você está usando a conexão: {conn.name}
          </Typography>
        ) : (
          <Typography variant="body1" align="center">
            Você não selecionou nenhuma conexão. Por favor, selecione ou crie
            uma conexão para começar.
          </Typography>
        )}
        {/* <SelectConnection /> */}
        <Stack spacing={2} mt={3}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => navigate("/connections")}
          >
            Conexões
          </Button>
          {conn && (
            <>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => navigate("/contacts")}
              >
                Contatos
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => navigate("/messages")}
              >
                Enviar Mensagem
              </Button>
            </>
          )}
        </Stack>
      </Box>
    </DefaultMenu>
  );
}
