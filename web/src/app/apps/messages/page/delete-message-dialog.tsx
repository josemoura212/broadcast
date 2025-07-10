import { memo } from "react";
import { useCloseDialog } from "../../dialog/dialog-app";
import { deleteMessage } from "../message.model";
import { ConfirmDialog } from "@/app/components/confirm-dialog";

function DeleteMessageDialog({ messageId }: { messageId: string }) {
  const closeDialog = useCloseDialog();

  async function handleRemoveMessage() {
    await deleteMessage(messageId);
    closeDialog();
  }

  return (
    <ConfirmDialog
      message="Tem certeza que deseja remover essa mensagem? Essa ação não pode ser desfeita."
      onClickConfirm={handleRemoveMessage}
      onClose={closeDialog}
    />
  );
}

export default memo(DeleteMessageDialog);
