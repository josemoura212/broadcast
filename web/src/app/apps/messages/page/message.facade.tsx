import { openDialog } from "../../dialog/dialog-facade";
import { Message } from "../message.model";
import AddEditMessageDialog from "./add-edit-message-dialog";
import DeleteMessageDialog from "./delete-message-dialog";

export async function openAddEditMessageDialog(data?: Message) {
  openDialog({
    fullWidth: true,
    maxWidth: "xs",
    children: <AddEditMessageDialog message={data} />,
  });
}

export async function openDeleteMessageDialog(messageId: string) {
  openDialog({
    fullWidth: true,
    maxWidth: "sm",
    children: <DeleteMessageDialog messageId={messageId} />,
  });
}
