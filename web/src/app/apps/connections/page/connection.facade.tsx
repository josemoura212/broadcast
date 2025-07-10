import { openDialog } from "../../dialog/dialog-facade";
import { Connection } from "../connection.model";
import AddEditConnectionDialog from "./add-edit-connection-dialog";

export async function openAddEditConnectionDialog(data?: Connection) {
  openDialog({
    fullWidth: true,
    maxWidth: "xs",
    children: <AddEditConnectionDialog connection={data} />,
  });
}
