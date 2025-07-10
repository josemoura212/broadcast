import { openDialog } from "../../dialog/dialog-facade";
import { Contact } from "../contact.model";
import AddEditContactDialog from "./add-edit-contact-dialog";

export async function openCreateContactDialog(data?: Partial<Contact>) {
  openDialog({
    fullWidth: true,
    maxWidth: "xs",
    children: <AddEditContactDialog contact={data} />,
  });
}
