import { createTheme } from "@mui/material";

export function darkTheme() {
  return createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#028C2EFF",
      },
    },
  });
}
