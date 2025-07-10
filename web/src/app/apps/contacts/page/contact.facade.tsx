import { openDialog } from "../../dialog/dialog-facade";
import { Contact } from "../contact.model";
import AddEditContactDialog from "./add-edit-contact-dialog";
import DeleteContactDialog from "./delete-contact-dialog";

export async function openCreateContactDialog(data?: Partial<Contact>) {
  openDialog({
    fullWidth: true,
    maxWidth: "xs",
    children: <AddEditContactDialog contact={data} />,
  });
}

export async function openDeleteContactDialog(contactId: string) {
  openDialog({
    fullWidth: true,
    maxWidth: "sm",
    children: <DeleteContactDialog contactId={contactId} />,
  });
}
