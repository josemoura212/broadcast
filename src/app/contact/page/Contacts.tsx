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
import { collection, CollectionReference } from "firebase/firestore";
import { Contact } from "../domain/models/Contact";
import { useSnapshot } from "../../hooks/global-hooks";
import { db } from "../../../infra/services/firebase";

const ContactPage: React.FC = () => {
  const { user } = useAuth();
  const [newContact, setNewContact] = useState({ name: "", phone: "" });
  const ref = useMemo(
    () =>
      collection(
        db,
        `clients/${user?.uid}/contacts`
      ) as CollectionReference<Contact>,
    [user?.uid]
  );
  const { state: contacts, loading } = useSnapshot<Contact>(ref);

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newContact.name.trim() || !newContact.phone.trim()) return;

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

export default ContactPage;
