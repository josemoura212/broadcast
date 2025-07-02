import TextField from "@mui/material/TextField";
import { useContactPage } from "../page/use-contact-page";
import Button from "@mui/material/Button";

export function ContactForm() {
  const { controller } = useContactPage();

  return (
    <form
      onSubmit={controller.handleAddContact}
      className="flex gap-3 mb-3 items-start flex-col"
    >
      <TextField
        label="Nome do contato"
        value={controller.newContact.name}
        onChange={(e) =>
          controller.setNewContact((c) => ({ ...c, name: e.target.value }))
        }
        size="small"
        fullWidth
        required
      />
      <TextField
        label="Telefone"
        value={controller.newContact.phone}
        onChange={(e) => {
          const onlyNumbers = e.target.value.replace(/\D/g, "");
          controller.setNewContact((c) => ({ ...c, phone: onlyNumbers }));
        }}
        size="small"
        fullWidth
        required
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Adicionar
      </Button>
    </form>
  );
}
