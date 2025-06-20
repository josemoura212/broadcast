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
import { useContacts } from "../hooks/useContacts";
import { db } from "../../infra/services/firebase";
import { useAuth } from "../context/AuthContext";

const Contacts: React.FC = () => {
  const { user } = useAuth();
  const [newContact, setNewContact] = useState({ name: "", phone: "" });
  const { contacts, loading } = useContacts(user?.uid);

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newContact.name.trim() || !newContact.phone.trim()) return;
    await addDoc(collection(db, `clients/${user.uid}/contacts`), {
      name: newContact.name.trim(),
      phone: newContact.phone.trim(),
    });
    setNewContact({ name: "", phone: "" });
  };

  return (
    <>
      <AppBarComponent />
      <Box maxWidth={400} mx="auto" mt={4}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>
            Contatos
          </Typography>
          <form
            onSubmit={handleAddContact}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <TextField
              label="Nome do contato"
              value={newContact.name}
              onChange={(e) =>
                setNewContact((c) => ({ ...c, name: e.target.value }))
              }
              size="small"
              fullWidth
            />
            <TextField
              label="Telefone"
              value={newContact.phone}
              onChange={(e) =>
                setNewContact((c) => ({ ...c, phone: e.target.value }))
              }
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
                {contacts.map((contact) => (
                  <ListItem key={contact.id} divider>
                    <ListItemText
                      primary={contact.name}
                      secondary={contact.phone}
                    />
                  </ListItem>
                ))}
                {contacts.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Nenhum contato cadastrado.
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

export default Contacts;
