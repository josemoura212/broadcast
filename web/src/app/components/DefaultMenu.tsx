import { Box, Paper } from "@mui/material";
import AppBarComponent from "./AppBarComponent";

function DefaultMenu({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppBarComponent />
      <Box
        width="100%"
        maxWidth={{ xs: "100%", sm: "100%", md: "60%" }}
        mx="auto"
        mt={4}
      >
        <Paper sx={{ p: 3 }}>{children}</Paper>
      </Box>
    </>
  );
}

export default DefaultMenu;
