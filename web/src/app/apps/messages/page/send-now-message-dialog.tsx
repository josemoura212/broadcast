import { ConfirmDialog } from "@/app/components/confirm-dialog";
import { sendMessageNow } from "../message.model";
import { useCloseDialog } from "../../dialog/dialog-app";
import { memo } from "react";

function SendNowMessageDialog({ messageId }: { messageId: string }) {
  const closeDialog = useCloseDialog();

  async function handleSendNow() {
    await sendMessageNow(messageId);
    closeDialog();
  }

  return (
    <ConfirmDialog
      title="Enviar Mensagem Agora"
      message="Tem certeza que deseja enviar esta mensagem agora? Essa ação não pode ser desfeita."
      onClickConfirm={handleSendNow}
      onClose={closeDialog}
      confirmColor="primary"
      confirmText="Enviar Agora"
    />
  );
}

export default memo(SendNowMessageDialog);
