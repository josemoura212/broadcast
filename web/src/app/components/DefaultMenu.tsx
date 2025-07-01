import { Box, Paper } from "@mui/material";
import { AppBar } from "./app-bar";

function DefaultMenu({ children }: { children: React.ReactNode }) {
  function Drawer() {
    return (
      <Box
        sx={{
          width: 240,
          height: "calc(100vh - 64px)",
          bgcolor: "background.paper",
          boxShadow: 2,
          p: 2,
          position: "fixed",
          top: 64,
          left: 0,
          display: "block", // Sempre visível
          zIndex: 1200,
        }}
      >
        Menu Lateral
      </Box>
    );
  }

  return (
    <>
      <AppBar />
      <Drawer />
      <Box
        width="100%"
        maxWidth={{ xs: "100%", sm: "100%", md: "60%" }}
        mx="auto"
        mt={4}
        ml="240px"
        sx={{
          transition: "margin 0.3s ease",
        }}
      >
        <Paper sx={{ p: 3 }}>{children}</Paper>
      </Box>
    </>
  );
}

export default DefaultMenu;
