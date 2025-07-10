import { DefaultMenu } from "@/app/components/default-menu";
import { ConfirmDialog } from "@/app/components/confirm-dialog";
import { ActionListItem } from "@/app/components/action-list-item";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import { useState } from "react";
import { deleteContact, useContactc } from "../contact.model";
import { Button } from "@mui/material";
import { openCreateContactDialog } from "./contact.facade";
import { useAuth } from "@/app/context/auth-context";
import { useConnectionCtx } from "@/app/context/connection-context";

export function ContactPage() {
  const { user } = useAuth();
  const { conn } = useConnectionCtx();

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [contacts, loading] = useContactc(user?.uid || "", conn?.id || "");

  async function handleRemoveContact(contactId: string) {
    if (!user) return;
    await deleteContact(contactId);
    setConfirmDeleteId(null);
  }

  return (
    <>
      <DefaultMenu>
        <Typography variant="h4" mb={2} textAlign={"center"}>
          Contatos
        </Typography>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => openCreateContactDialog()}
          >
            Criar Contato
          </Button>
        </Box>
        {loading ? (
          <Typography>Carregando...</Typography>
        ) : (
          <Box sx={{ maxHeight: "60vh", overflowY: "auto" }}>
            <List>
              {contacts.map((contact) => (
                <ActionListItem
                  key={contact.id}
                  primary={contact.name}
                  secondary={contact.phone}
                  onEdit={() => openCreateContactDialog(contact)}
                  onDelete={() => setConfirmDeleteId(contact.id)}
                  divider={true}
                />
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
}
