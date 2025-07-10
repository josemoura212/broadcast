import useBehavior from "@/app/hooks/use-behavior";
import { closeDialog, dialogs$ } from "./dialog-facade";
import { createContext, memo } from "react";
import MatDialog, { DialogProps } from "@mui/material/Dialog";

const DialogContext = createContext<Partial<DialogProps> | null>(null);

function DialogApp() {
  const dialogs = useBehavior(dialogs$);

  return (
    <>
      {dialogs.map((dialog) => {
        const { key, ...dialogWithoutKey } = dialog;
        return (
          <DialogContext.Provider key={key} value={dialog}>
            <MatDialog
              open={true}
              onClose={() => closeDialog(dialog)}
              classes={{
                paper: "rounded-8",
              }}
              {...dialogWithoutKey}
            />
          </DialogContext.Provider>
        );
      })}
    </>
  );
}

export default memo(DialogApp);
