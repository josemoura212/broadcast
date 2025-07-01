import { Box, Button, Paper, Typography, Stack } from "@mui/material";
import AppBarComponent from "../components/AppBarComponent";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();

  return (
    <>
      <AppBarComponent />
      <Box maxWidth={400} mx="auto" mt={6}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" mb={3}>
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
        </Paper>
      </Box>
    </>
  );
}
