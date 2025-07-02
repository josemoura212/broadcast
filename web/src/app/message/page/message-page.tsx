import { DateTimePicker } from "@mui/x-date-pickers";
import { DefaultMenu } from "../../components/default-menu";
import { ConfirmDialog } from "../../components/confirm-dialog";
import { DialogEditingMessage } from "../components/dialog-editing-message";
import { ActionListItem } from "../../components/action-list-item";
import { formatDateTimeLocal } from "@/infra/utils/format-date-time-local";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import { useMessagePage } from "./use-message-page";

export function MessagePage() {
  const controller = useMessagePage();

  return (
    <>
      <DefaultMenu>
        <Typography variant="h6" mb={2}>
          Enviar Mensagem
        </Typography>
        <form
          onSubmit={controller.handleSend}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <FormControl fullWidth>
            <InputLabel>Contatos</InputLabel>
            <Select
              multiple
              required
              value={controller.selectedContacts}
              onChange={(e) =>
                controller.setSelectedContacts(e.target.value as string[])
              }
              input={<OutlinedInput label="Contatos" />}
              renderValue={(selected) =>
                controller.contacts
                  .filter((c) => selected.includes(c.id))
                  .map((c) => c.name)
                  .join(", ")
              }
            >
              {controller.contacts.map((contact) => (
                <MenuItem key={contact.id} value={contact.id}>
                  <Checkbox
                    checked={
                      controller.selectedContacts.indexOf(contact.id) > -1
                    }
                  />
                  <ListItemText primary={contact.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Mensagem"
            value={controller.content}
            onChange={(e) => controller.setContent(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            required
          />

          <DateTimePicker
            label="Agendar para (opcional)"
            value={controller.scheduledAt}
            onChange={(newValue) => controller.setScheduledAt(newValue)}
            slotProps={{ textField: { fullWidth: true } }}
            minDateTime={new Date()}
          />
          <Button type="submit" variant="contained" color="primary">
            {controller.scheduledAt ? "Agendar Mensagem" : "Enviar Mensagem"}
          </Button>
        </form>
        <Stack direction="row" spacing={2} mb={2}>
          <Button
            variant={controller.filter === "all" ? "contained" : "outlined"}
            onClick={() => controller.setFilter("all")}
          >
            Todas
          </Button>
          <Button
            variant={controller.filter === "enviada" ? "contained" : "outlined"}
            onClick={() => controller.setFilter("enviada")}
          >
            Enviadas
          </Button>
          <Button
            variant={
              controller.filter === "agendada" ? "contained" : "outlined"
            }
            onClick={() => controller.setFilter("agendada")}
          >
            Agendadas
          </Button>
        </Stack>
        <Typography variant="h6" mb={1}>
          Mensagens
        </Typography>
        {controller.loading ? (
          <Typography>Carregando...</Typography>
        ) : (
          <Box sx={{ overflowY: "auto" }}>
            <List>
              {controller.messages.map((msg) => (
                <ActionListItem
                  key={msg.id}
                  primary={msg.content}
                  secondary={
                    `Status: ${msg.status} | Para: ${controller.contacts
                      .filter((c) => msg.contactIds.includes(c.id))
                      .map((c) => c.name)
                      .join(", ")} | ` +
                    (msg.status === "agendada"
                      ? `\nAgendada para: ${formatDateTimeLocal(
                          msg.scheduledAt
                        )}`
                      : `\nEnviada em: ${formatDateTimeLocal(msg.sentAt)}`)
                  }
                  {...(msg.status === "agendada"
                    ? {
                        onEdit: () => controller.handleStartEdit(msg),
                        editLabel: "Editar",
                      }
                    : {})}
                  onDelete={() => controller.setConfirmDeleteId(msg.id)}
                  deleteLabel="Remover"
                  divider={true}
                />
              ))}
              {controller.messages.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Nenhuma mensagem encontrada.
                </Typography>
              )}
            </List>
          </Box>
        )}
        <ConfirmDialog
          open={!!controller.confirmDeleteId}
          title="Confirmar remoção"
          message="Tem certeza que deseja remover esta mensagem? Essa ação não pode ser desfeita."
          onClose={() => controller.setConfirmDeleteId(null)}
          onConfirm={() =>
            controller.handleRemoveMessage(controller.confirmDeleteId!)
          }
          confirmText="Remover"
          confirmColor="error"
        />
        <DialogEditingMessage
          open={!!controller.editingId}
          value={controller.editingMessage}
          contacts={controller.contacts}
          onChange={controller.handleEditChange}
          onClose={controller.handleCancelEdit}
          onSave={controller.handleSaveEdit}
          saving={false}
          error={controller.editError}
          agendada={
            controller.messages.find((m) => m.id === controller.editingId)
              ?.status === "agendada"
          }
        />
      </DefaultMenu>
    </>
  );
}
