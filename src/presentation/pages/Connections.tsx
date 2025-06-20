import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import AppBarComponent from "../components/AppBarComponent";
import { useAuth } from "../context/AuthContext";
import { useConnections } from "../hooks/useConnections";
import { db } from "../../infra/services/firebase";

const Connections: React.FC = () => {
  const { user } = useAuth();
  const [newConnection, setNewConnection] = useState("");
  const { connections, loading } = useConnections(user?.uid);

  const handleAddConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newConnection.trim()) return;
    await addDoc(collection(db, `clients/${user.uid}/connections`), {
      name: newConnection.trim(),
    });
    setNewConnection("");
  };

  return (
    <>
      <AppBarComponent />
      <Box maxWidth={400} mx="auto" mt={4}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>
            Minhas Conexões
          </Typography>
          <form
            onSubmit={handleAddConnection}
            style={{ display: "flex", gap: 8, marginBottom: 16 }}
          >
            <TextField
              label="Nome da conexão"
              value={newConnection}
              onChange={(e) => setNewConnection(e.target.value)}
              size="small"
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary">
              Adicionar
            </Button>
          </form>
          {loading ? (
            <Typography>Carregando...</Typography>
          ) : (
            <Box sx={{ maxHeight: "60vh", overflowY: "auto" }}>
              <List>
                {connections.map((conn) => (
                  <ListItem key={conn.id} divider>
                    <ListItemText primary={conn.name} />
                  </ListItem>
                ))}
                {connections.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Nenhuma conexão cadastrada.
                  </Typography>
                )}
              </List>
            </Box>
          )}
        </Paper>
      </Box>
    </>
  );
};

export default Connections;
