import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import { useAuth } from "../context/auth-context";
import { useConnectionCtx } from "../context/connection-context";
import { useEffect, useState } from "react";
import { Connection, useConnection } from "../connection/connection.model";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";

export function SelectConnection() {
  const { user } = useAuth();
  const { conn, setConn } = useConnectionCtx();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<string>(
    conn?.id || ""
  );

  const { state: connectionsList } = useConnection(user?.uid || "");

  useEffect(() => {
    if (user?.uid) {
      setConnections(connectionsList);
    }
  }, [connectionsList]);

  function handlerSelectConnection(connectionId: string) {
    const conn = connections.find((c) => c.id === connectionId);
    if (!conn) return;
    setConn(conn);
    setSelectedConnection(connectionId);
  }

  return (
    <FormControl fullWidth sx={{ mt: 3 }} variant="outlined">
      <InputLabel>Conexões</InputLabel>
      <Select
        required
        value={
          connections.some((c) => c.id === selectedConnection)
            ? selectedConnection
            : ""
        }
        onChange={(e) => handlerSelectConnection(e.target.value as string)}
        input={<OutlinedInput label="Conexões" />}
        renderValue={(selected) =>
          connections.find((c) => c.id === selected)?.name || ""
        }
      >
        {connections.map((connection) => (
          <MenuItem key={connection.id} value={connection.id}>
            <ListItemText primary={connection.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
