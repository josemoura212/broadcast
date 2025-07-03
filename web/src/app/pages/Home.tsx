import {
  Box,
  Button,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DefaultMenu } from "../components/default-menu";
import { useAuth } from "../context/auth-context";
import { useConnection } from "../context/connection-context";
import { useEffect, useState } from "react";
import { Connection, getConnections } from "../connection/connection.model";

export function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { conn, setConn } = useConnection();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<string>("");

  useEffect(() => {
    if (user?.uid) {
      getConnections(user.uid).then(setConnections);
    }
  }, [user?.uid]);

  useEffect(() => {
    if (!conn) return;
    setSelectedConnection(conn.id);
  }, []);

  function handlerSelectConnection(connectionId: string) {
    const conn = connections.find((c) => c.id === connectionId);
    if (!conn) return;
    setConn(conn);
    setSelectedConnection(connectionId);
  }

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
        <FormControl fullWidth sx={{ mt: 3 }} variant="outlined">
          <InputLabel>Conexões</InputLabel>
          <Select
            required
            value={
              connections.some((c) => c.id === selectedConnection)
                ? selectedConnection
                : ""
            }
            onChange={(e) => handlerSelectConnection(e.target.value as string)}
            input={<OutlinedInput label="Conexões" />}
            renderValue={(selected) =>
              connections.find((c) => c.id === selected)?.name || ""
            }
          >
            {connections.map((connection) => (
              <MenuItem key={connection.id} value={connection.id}>
                <ListItemText primary={connection.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
