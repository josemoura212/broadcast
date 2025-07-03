import { DefaultMenu } from "../../components/default-menu";
import { ConfirmDialog } from "../../components/confirm-dialog";
import { ActionListItem } from "../../components/action-list-item";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import { useContactPage } from "./use-contact-page";
import { ContactForm } from "../components/contact-form";
import { useState } from "react";
import { Contact } from "../contact.model";

export function ContactPage() {
  const controller = useContactPage();
  const [editingMode, setEditingMode] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  function onEditContact(contact: Contact) {
    setEditingMode(true);
    setEditingContact(contact);
  }

  return (
    <>
      <DefaultMenu>
        <Typography variant="h6" mb={2}>
          Contatos
        </Typography>
        <ContactForm
          contact={editingContact}
          editingMode={editingMode}
          setEditingMode={setEditingMode}
        />
        {controller.loading ? (
          <Typography>Carregando...</Typography>
        ) : (
          <Box sx={{ maxHeight: "60vh", overflowY: "auto" }}>
            <List>
              {!editingMode &&
                controller.contacts.map((contact) => (
                  <ActionListItem
                    key={contact.id}
                    primary={contact.name}
                    secondary={contact.phone}
                    onEdit={() => onEditContact(contact)}
                    onDelete={() => controller.setConfirmDeleteId(contact.id)}
                    divider={true}
                  />
                ))}
              {controller.contacts.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Nenhum contato cadastrado.
                </Typography>
              )}
            </List>
          </Box>
        )}
      </DefaultMenu>
      <ConfirmDialog
        open={!!controller.confirmDeleteId}
        title="Confirmar remoção"
        message="Tem certeza que deseja remover este contato? Essa ação não pode ser desfeita."
        onClose={() => controller.setConfirmDeleteId(null)}
        onConfirm={() =>
          controller.handleRemoveContact(controller.confirmDeleteId!)
        }
        confirmText="Remover"
        confirmColor="error"
      />
    </>
  );
}
