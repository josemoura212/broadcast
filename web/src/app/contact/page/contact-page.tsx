import { DefaultMenu } from "../../components/default-menu";
import { ConfirmDialog } from "../../components/confirm-dialog";
import { InlineEditFields } from "../../components/inline-edit-fields";
import { ActionListItem } from "../../components/action-list-item";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useContactPage } from "./use-contact-page";
import { ContactForm } from "../components/contact-form";

export function ContactPage() {
  const { controller } = useContactPage();

  const fields = [
    {
      label: "Nome",
      name: "name",
      value: controller.editingContact.name,
    },
    {
      label: "Telefone",
      name: "phone",
      value: controller.editingContact.phone,
    },
  ];

  return (
    <>
      <DefaultMenu>
        <Typography variant="h6" mb={2}>
          Contatos
        </Typography>
        <ContactForm />
        {controller.loading ? (
          <Typography>Carregando...</Typography>
        ) : (
          <Box sx={{ maxHeight: "60vh", overflowY: "auto" }}>
            <List>
              {controller.contacts.map((contact) =>
                controller.editingId === contact.id ? (
                  <ListItem key={contact.id} divider>
                    <InlineEditFields
                      fields={fields}
                      onChange={(name, value) =>
                        controller.setEditingContact((c) => ({
                          ...c,
                          [name]: value,
                        }))
                      }
                      onSave={controller.handleSaveEdit}
                      onCancel={controller.handleCancelEdit}
                    />
                  </ListItem>
                ) : (
                  <ActionListItem
                    key={contact.id}
                    primary={contact.name}
                    secondary={contact.phone}
                    onEdit={() =>
                      controller.handleStartEdit(
                        contact.id,
                        contact.name,
                        contact.phone
                      )
                    }
                    onDelete={() => controller.setConfirmDeleteId(contact.id)}
                    divider={true}
                  />
                )
              )}
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
