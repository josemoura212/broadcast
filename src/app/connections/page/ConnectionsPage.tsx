import React, { useMemo, useState } from "react";
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
import { useAuth } from "../../context/AuthContext";
import AppBarComponent from "../../components/AppBarComponent";
import { addConnection, Connection } from "../domain/models/ConnectionModel";
import { useSnapshot } from "../../hooks/global-hooks";
import { collection, CollectionReference } from "firebase/firestore";
import { db } from "../../../infra/services/firebase";

const ConnectionPage: React.FC = () => {
  const { user } = useAuth();
  const [newConnection, setNewConnection] = useState("");

  const ref = useMemo(
    () =>
      collection(
        db,
        `clients/${user?.uid}/connections`
      ) as CollectionReference<Connection>,
    [user?.uid]
  );
  const { state: connections, loading } = useSnapshot<Connection>(ref);

  const handleAddConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newConnection.trim()) return;
    console.log("Adding connection Model", user.uid, newConnection.trim());
    await addConnection({
      userId: user.uid,
      connectionName: newConnection.trim(),
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

export default ConnectionPage;
