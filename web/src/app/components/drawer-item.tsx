import Box from "@mui/material/Box";
import { useNavigate, useLocation } from "react-router-dom";

interface DrawerItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isExpanded: boolean;
  isPinned: boolean;
  onClick?: () => void;
}

export function DrawerItem(props: DrawerItemProps) {
  const { icon, label, path, isExpanded, isPinned, onClick }: DrawerItemProps =
    props;

  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === path;

  const handleClick = () => {
    navigate(path);
  };

  return (
    <Box
      onClick={onClick || handleClick}
      sx={{
        display: "flex",
        alignItems: "center",
        p: 0.5,
        borderRadius: 1,
        cursor: "pointer",
        bgcolor: isActive ? "primary.light" : "transparent",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 40,
          height: 40,
          color: isActive ? "primary.contrastText" : "primary.main",
        }}
      >
        {icon}
      </Box>
      {(isExpanded || isPinned) && (
        <Box
          sx={{
            ml: 2,
            fontWeight: 500,
            color: isActive ? "primary.contrastText" : "text.primary",
          }}
        >
          {label}
        </Box>
      )}
    </Box>
  );
}
