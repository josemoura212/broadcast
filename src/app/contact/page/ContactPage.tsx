import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import {
  collection,
  CollectionReference,
  orderBy,
  query,
} from "firebase/firestore";
import {
  Contact,
  addContact,
  deleteContact,
  updateContact,
} from "../domain/models/ContactModel";
import { useSnapshot } from "../../hooks/global-hooks";
import { db } from "../../../infra/services/firebase";
import DefaultMenu from "../../components/DefaultMenu";
import ConfirmDialog from "../../components/ConfirmDialog";

const ContactPage: React.FC = () => {
  const { user } = useAuth();
  const [newContact, setNewContact] = useState({ name: "", phone: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContact, setEditingContact] = useState({ name: "", phone: "" });
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [newContactError, setNewContactError] = useState("");

  const ref = useMemo(
    () =>
      query(
        collection(
          db,
          `clients/${user?.uid}/contacts`
        ) as CollectionReference<Contact>,
        orderBy("name")
      ),
    [user?.uid]
  );
  const { state: contacts, loading } = useSnapshot<Contact>(ref);

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newContact.name.trim() || !newContact.phone.trim()) {
      setNewContactError("Nome e telefone são obrigatórios.");
      return;
    }
    setNewContactError("");
    await addContact(user.uid, {
      name: newContact.name.trim(),
      phone: newContact.phone.trim(),
    });
    setNewContact({ name: "", phone: "" });
  };

  const handleStartEdit = (id: string, name: string, phone: string) => {
    setEditingId(id);
    setEditingContact({ name, phone });
  };

  const handleSaveEdit = async () => {
    if (
      !user ||
      !editingId ||
      !editingContact.name.trim() ||
      !editingContact.phone.trim()
    )
      return;
    await updateContact(user.uid, editingId, {
      name: editingContact.name.trim(),
      phone: editingContact.phone.trim(),
    });
    setEditingId(null);
    setEditingContact({ name: "", phone: "" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingContact({ name: "", phone: "" });
  };

  const handleRemoveContact = async (contactId: string) => {
    if (!user) return;
    await deleteContact(user.uid, contactId);
    setConfirmDeleteId(null);
  };

  return (
    <>
      <DefaultMenu>
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
            error={!!newContactError && !newContact.name.trim()}
          />
          <TextField
            label="Telefone"
            value={newContact.phone}
            onChange={(e) =>
              setNewContact((c) => ({ ...c, phone: e.target.value }))
            }
            size="small"
            fullWidth
            error={!!newContactError && !newContact.phone.trim()}
            helperText={newContactError}
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
                <ListItem key={contact.id} divider sx={{ mb: 1, py: 2 }}>
                  {editingId === contact.id ? (
                    <>
                      <TextField
                        label="Nome"
                        value={editingContact.name}
                        onChange={(e) =>
                          setEditingContact((c) => ({
                            ...c,
                            name: e.target.value,
                          }))
                        }
                        size="small"
                        sx={{ mr: 1, flex: 1 }}
                        fullWidth
                      />
                      <TextField
                        label="Telefone"
                        value={editingContact.phone}
                        onChange={(e) =>
                          setEditingContact((c) => ({
                            ...c,
                            phone: e.target.value,
                          }))
                        }
                        size="small"
                        sx={{ mr: 1, flex: 1 }}
                        fullWidth
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={handleSaveEdit}
                      >
                        Salvar
                      </Button>
                      <Button
                        variant="outlined"
                        color="inherit"
                        size="small"
                        onClick={handleCancelEdit}
                      >
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
                      <ListItemText
                        primary={contact.name}
                        secondary={contact.phone}
                      />
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() =>
                          handleStartEdit(
                            contact.id,
                            contact.name,
                            contact.phone
                          )
                        }
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => setConfirmDeleteId(contact.id)}
                      >
                        Remover
                      </Button>
                    </>
                  )}
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
      </DefaultMenu>
      <ConfirmDialog
        open={!!confirmDeleteId}
        title="Confirmar remoção"
        message="Tem certeza que deseja remover este contato? Essa ação não pode ser desfeita."
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={() => handleRemoveContact(confirmDeleteId!)}
        confirmText="Remover"
        confirmColor="error"
      />
    </>
  );
};

export default ContactPage;
