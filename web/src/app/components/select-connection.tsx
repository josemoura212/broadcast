import { useAuth } from "../context/auth-context";
import { useConnectionCtx } from "../context/connection-context";
import { useConnections } from "@/app/apps/connection/connection.model";
import { useForm } from "react-hook-form";
import { ControlledSelect } from "./controlled-select";
import { useEffect } from "react";

export function SelectConnection() {
  const { user } = useAuth();
  const { conn, setConn } = useConnectionCtx();
  const [connections] = useConnections(user?.uid || "");
  const { control, watch } = useForm({
    defaultValues: {
      connectionId: conn?.id || "",
    },
  });

  const watchedConnectionId = watch("connectionId");

  useEffect(() => {
    if (watchedConnectionId) {
      const connection = connections.find((c) => c.id === watchedConnectionId);
      if (connection) {
        setConn(connection);
      }
    }
  }, [watchedConnectionId]);

  return (
    <ControlledSelect
      name="connectionId"
      control={control}
      rules={{ required: "Selecione uma conexão" }}
      label="Conexões"
      options={connections}
    />
  );
}
