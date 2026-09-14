"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Badge,
  useMediaQuery,
  IconButton,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { useAdminPanel } from "./AdminPanelContext";
import { AuthContext } from "@/context/AuthContext";

const DRAWER_WIDTH = 280;

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { requests, receipts } = useAdminPanel();
  const { user, logout } = React.useContext(AuthContext);

  const navItems = [
    { label: "Dashboard", href: "/directory/admin", badge: 0 },
    { label: "Negocios", href: "/directory/admin/businesses", badge: 0 },
    {
      label: "Solicitudes de registro",
      href: "/directory/admin/requests",
      badge: requests.length,
    },
    {
      label: "Comprobantes de pago",
      href: "/directory/admin/receipts",
      badge: receipts.length,
    },
    {
      label: "Suscripciones / mora",
      href: "/directory/admin/subscriptions",
      badge: 0,
    },
    {
      label: "Precios y descuentos",
      href: "/directory/admin/pricing",
      badge: 0,
    },
    { label: "Referidos", href: "/directory/admin/referrals", badge: 0 },
    {
      label: "Campañas estacionales",
      href: "/directory/admin/campaigns",
      badge: 0,
    },
    { label: "Usuarios", href: "/directory/admin/users", badge: 0 },
  ];

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: "primary.main" }}
        >
          CareDriver Admin
        </Typography>
      </Toolbar>
      <List sx={{ flex: 1, py: 1 }}>
        {navItems.map((item) => {
          const selected =
            pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={selected}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  mb: 0.5,
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Badge
                      badgeContent={item.badge > 0 ? item.badge : 0}
                      color="error"
                      sx={{
                        width: "100%",
                        "& .MuiBadge-badge": { position: "relative", ml: 1 },
                      }}
                    >
                      {item.label}
                    </Badge>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {user?.fullName || "Administrador"}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            display: "block",
            mb: 1.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {user?.email || "admin@caredriver.com"}
        </Typography>
        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          size="small"
          onClick={logout}
          sx={{ borderColor: "divider" }}
        >
          Cerrar sesión
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {isMobile ? (
        <>
          <IconButton
            color="primary"
            onClick={() => setMobileOpen(true)}
            sx={{
              position: "fixed",
              top: 12,
              left: 12,
              zIndex: (t) => t.zIndex.drawer + 1,
            }}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: DRAWER_WIDTH,
              },
            }}
          >
            {drawer}
          </Drawer>
        </>
      ) : (
        <Drawer
          variant="permanent"
          open
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4 },
          pt: { xs: 6, md: 4 },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
