import React from "react";
import { Box, Paper, Typography } from "@mui/material";

interface FormsBaseProps {
  title: string;
  children: React.ReactNode;
}

const FormsBase: React.FC<FormsBaseProps> = ({ title, children }) => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
    padding={2}
  >
    <Paper
      elevation={3}
      sx={{
        padding: 4,
        width: "100%",
        maxWidth: { xs: "100%", sm: "30vw" },
        minWidth: { xs: "100%", sm: 400 },
      }}
    >
      <Typography variant="h5" mb={2}>
        {title}
      </Typography>
      {children}
    </Paper>
  </Box>
);

export default FormsBase;
