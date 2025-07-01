import { Box, Paper, IconButton, Tooltip, Divider } from "@mui/material";
import { useState } from "react";
import {
  Home as HomeIcon,
  Message as MessageIcon,
  Lan as LanIcon,
  Contacts as ContactsIcon,
  PushPin as PushPinIcon,
  ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material";
import { DrawerItem } from "./drawer-item";

export function DefaultMenu({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const drawerWidth = 240;
  const collapsedWidth = 64;

  const menuItems = [
    { icon: <HomeIcon />, label: "Home", path: "/" },
    { icon: <LanIcon />, label: "Conexões", path: "/connections" },
    { icon: <ContactsIcon />, label: "Contatos", path: "/contacts" },
    { icon: <MessageIcon />, label: "Mensagens", path: "/messages" },
  ];

  function Drawer() {
    const currentWidth = isExpanded || isPinned ? drawerWidth : collapsedWidth;

    return (
      <Box
        sx={{
          width: currentWidth,
          bgcolor: "background.paper",
          boxShadow: 3,
          position: "fixed",
          overflow: "hidden",
        }}
        onMouseEnter={() => !isPinned && setIsExpanded(true)}
        onMouseLeave={() => !isPinned && setIsExpanded(false)}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            minHeight: 48,
          }}
        >
          {(isExpanded || isPinned) && (
            <>
              <Box
                sx={{ flexGrow: 1, textAlign: "center", fontWeight: "bold" }}
              ></Box>
              <Tooltip title={isPinned ? "Desafixar" : "Fixar"}>
                <IconButton
                  onClick={() => setIsPinned(!isPinned)}
                  color={isPinned ? "primary" : "default"}
                  size="small"
                >
                  <PushPinIcon />
                </IconButton>
              </Tooltip>
            </>
          )}

          {isPinned && (
            <IconButton
              onClick={() => {
                setIsPinned(false);
                setIsExpanded(false);
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
          )}
        </Box>
        <Divider />
        <Box sx={{ p: 1 }}>
          {menuItems.map((item, index) => (
            <DrawerItem
              key={index}
              icon={item.icon}
              label={item.label}
              path={item.path}
              isExpanded={isExpanded}
              isPinned={isPinned}
            />
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Drawer />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          minHeight: "100vh",
          pt: 4,
        }}
      >
        <Paper
          sx={{
            p: 3,
            width: "100%",
            maxWidth: "800px",
            mx: 2,
          }}
        >
          {children}
        </Paper>
      </Box>
    </>
  );
}
