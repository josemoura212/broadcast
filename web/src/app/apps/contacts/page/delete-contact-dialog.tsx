import { deleteContact } from "../contact.model";
import { useCloseDialog } from "../../dialog/dialog-app";
import { memo } from "react";
import { ConfirmDialog } from "@/app/components/confirm-dialog";

function DeleteContactDialog({ contactId }: { contactId: string }) {
  const closeDialog = useCloseDialog();

  async function handleRemoveContact() {
    await deleteContact(contactId);
    closeDialog();
  }

  return (
    <ConfirmDialog
      message="Tem certeza que deseja remover este contato? Essa ação não pode ser desfeita."
      onClickConfirm={handleRemoveContact}
      onClose={closeDialog}
    />
  );
}

export default memo(DeleteContactDialog);
