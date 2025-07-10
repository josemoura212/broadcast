import { DefaultMenu } from "@/app/components/default-menu";
import { ActionListItem } from "@/app/components/action-list-item";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import {  useConnections } from "../connection.model";
import { useAuth } from "@/app/context/auth-context";
import { openAddEditConnectionDialog, openDeleteConnectionDialog } from "./connection.facade";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

export function ConnectionPage() {
  const { user } = useAuth();
  const [connections, loading] = useConnections(user?.uid || "");

  return (

      <DefaultMenu>
        <Typography variant="h4" mb={2} textAlign={"center"}>
          Minhas Conexões
        </Typography>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            onClick={() => openAddEditConnectionDialog()}
          >
            Criar Conexão
          </Button>
        </Box>
        <Divider />
        {loading ? (
          <Typography>Carregando...</Typography>
        ) : (
          <Box sx={{ maxHeight: "60vh", overflowY: "auto" }}>
            <List>
              {connections.map((conn) => (
                <ActionListItem
                  key={conn.id}
                  primary={conn.name}
                  onEdit={() => openAddEditConnectionDialog(conn)}
                  onDelete={() => openDeleteConnectionDialog(conn.id)}
                  divider={true}
                />
              ))}
              {connections.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Nenhuma conexão cadastrada.
                </Typography>
              )}
            </List>
          </Box>
        )}
      </DefaultMenu>
  );
}
