import { useEffect, useState } from "react";
import {
  Home as HomeIcon,
  Message as MessageIcon,
  Lan as LanIcon,
  Contacts as ContactsIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import { DrawerItem } from "./drawer-item";

const DRAWER_KEY = "drawerPinned";

export function CustomDrawer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(
    JSON.parse(localStorage.getItem(DRAWER_KEY) ?? "false")
  );

  const drawerWidth = 240;
  const collapsedWidth = 64;

  useEffect(() => {
    localStorage.setItem(DRAWER_KEY, JSON.stringify(isPinned));
  }, [isPinned]);

  const menuItems = [
    { icon: <HomeIcon />, label: "Home", path: "/" },
    { icon: <LanIcon />, label: "Conexões", path: "/connections" },
    { icon: <ContactsIcon />, label: "Contatos", path: "/contacts" },
    { icon: <MessageIcon />, label: "Mensagens", path: "/messages" },
  ];

  const currentWidth = isExpanded || isPinned ? drawerWidth : collapsedWidth;

  return (
    <Box
      className={`flex flex-col w-${currentWidth} h-full fixed overflow-x-hidden  shadow-md shadow-gray-700`}
      onMouseEnter={() => !isPinned && setIsExpanded(true)}
      onMouseLeave={() => !isPinned && setIsExpanded(false)}
    >
      <Box>
        <Tooltip title={isPinned ? "Desafixar" : "Fixar"}>
          <IconButton
            sx={{ ml: 1.5 }}
            onClick={() => setIsPinned(!isPinned)}
            color={isPinned ? "primary" : "default"}
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>
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
