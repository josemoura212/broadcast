import { DefaultMenu } from "@/app/components/default-menu";
import { ActionListItem } from "@/app/components/action-list-item";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import {
  openCreateContactDialog,
  openDeleteContactDialog,
} from "./contact.facade";
import { useAuth } from "@/app/context/auth-context";
import { useConnectionCtx } from "@/app/context/connection-context";
import { useContacts } from "../contact.model";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

export function ContactPage() {
  const { user } = useAuth();
  const { conn } = useConnectionCtx();

  const [contacts, loading] = useContacts(user?.uid || "", conn?.id || "");

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
        <Divider />
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
                  onDelete={() => openDeleteContactDialog(contact.id)}
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
    </>
  );
}
