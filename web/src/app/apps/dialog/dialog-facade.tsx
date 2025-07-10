import { DialogProps } from "@mui/material/Dialog";
import Paper, { PaperProps } from "@mui/material/Paper";
import { BehaviorSubject } from "rxjs";

export type DialogType = Partial<DialogProps>;

export const dialogs$ = new BehaviorSubject<DialogType[]>([]);

export function openDialog(dialog: DialogType) {
  dialog.key = dialog.key || `dialog-${dialogs$.value.length}`;

  dialog.PaperComponent = (props: PaperProps) => (
    <Paper
      {...props}
      style={{
        position: "absolute",
        padding: 0,
        boxShadow:
          "0px 3px 5px -1px var(--color-theme-dialog-shadow), 0px 3px 5px -1px var(--color-theme-dialog-shadow), 0px 1px 18px 0px var(--color-theme-dialog-shadow)",
      }}
    />
  );

  dialogs$.next([...dialogs$.value, dialog]);

  return () => closeDialog(dialog);
}

export function closeDialog(dialog: Partial<DialogType>) {
  dialogs$.next(dialogs$.value.filter((d) => d !== dialog));
}
