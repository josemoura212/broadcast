import { openDialog } from "../../dialog/dialog-facade";
import { Message } from "../message.model";
import AddEditMessageDialog from "./add-edit-message-dialog";
import DeleteMessageDialog from "./delete-message-dialog";
import SendNowMessageDialog from "./send-now-message-dialog";

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

export async function openSendNowMessageDialog(messageId: string) {
  openDialog({
    fullWidth: true,
    maxWidth: "sm",
    children: <SendNowMessageDialog messageId={messageId} />,
  });
}
