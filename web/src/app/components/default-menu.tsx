import Box from "@mui/material/Box";
import { CustomDrawer } from "./custom-drawer";
import Paper from "@mui/material/Paper";

export function DefaultMenu({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CustomDrawer />
      <Box className="flex flex-col items-center justify-start pt-5">
        <Paper className="p-3 w-full max-w-3xl mx-2">{children}</Paper>
      </Box>
    </>
  );
}
