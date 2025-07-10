import { deleteConnection } from "../connection.model";
import { useCloseDialog } from "../../dialog/dialog-app";
import { memo } from "react";
import { ConfirmDialog } from "@/app/components/confirm-dialog";

function DeleteConnectionDialog({ connectionId }: { connectionId: string }) {
  const closeDialog = useCloseDialog();

  async function handleRemoveConnection() {
    await deleteConnection(connectionId);
    closeDialog();
  }

  return (
    <ConfirmDialog
      message="Tem certeza que deseja remover essa conexão? Essa ação não pode ser desfeita."
      onClickConfirm={handleRemoveConnection}
      onClose={closeDialog}
    />
  );
}

export default memo(DeleteConnectionDialog);
