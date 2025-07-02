import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React from "react";

interface FormsBoxProps {
  title: string;
  children: React.ReactNode;
}

export function FormsBox(props: FormsBoxProps) {
  const { title, children } = props;
  return (
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
}
