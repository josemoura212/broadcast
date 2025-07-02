import { Box, Button, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DefaultMenu } from "../components/default-menu";

export function Home() {
  const navigate = useNavigate();

  return (
    <DefaultMenu>
      <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h5" mb={3} align="center">
          Bem-vindo ao Broadcast!
        </Typography>
        <Stack spacing={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => navigate("/connections")}
          >
            Conexões
          </Button>
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
        </Stack>
      </Box>
    </DefaultMenu>
  );
}
