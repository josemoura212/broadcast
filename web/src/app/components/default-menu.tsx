import Box from "@mui/material/Box";
import { CustomDrawer } from "./custom-drawer";
import Paper from "@mui/material/Paper";
import { useState } from "react";

export function DefaultMenu({ children }: { children: React.ReactNode }) {
  const [isPinned, setIsPinned] = useState(false);

  return (
    <>
      <CustomDrawer onPinnedChange={(pinned) => setIsPinned(pinned)} />
      <Box
        className={`flex flex-col items-center justify-start pt-5 ${
          isPinned ? "ml-42" : "ml-16"
        } `}
      >
        <Paper className="p-3 w-full max-w-3xl mx-2">{children}</Paper>
      </Box>
    </>
  );
}
