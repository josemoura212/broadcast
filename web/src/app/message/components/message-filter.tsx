import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export function MessageFilter({
  filter,
  setFilter,
}: {
  filter: "enviada" | "agendada" | "all";
  setFilter: React.Dispatch<
    React.SetStateAction<"enviada" | "agendada" | "all">
  >;
}) {
  return (
    <>
      <Stack direction="row" spacing={2} mb={2}>
        <Button
          variant={filter === "all" ? "contained" : "outlined"}
          onClick={() => setFilter("all")}
        >
          Todas
        </Button>
        <Button
          variant={filter === "enviada" ? "contained" : "outlined"}
          onClick={() => setFilter("enviada")}
        >
          Enviadas
        </Button>
        <Button
          variant={filter === "agendada" ? "contained" : "outlined"}
          onClick={() => setFilter("agendada")}
        >
          Agendadas
        </Button>
      </Stack>
      <Typography variant="h6" mb={1}>
        Mensagens
      </Typography>
    </>
  );
}
