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
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Chip,
  Button,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BuildIcon from "@mui/icons-material/Build";
import MessageIcon from "@mui/icons-material/Message";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PeopleIcon from "@mui/icons-material/People";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { useBusinessPanel } from "./BusinessPanelContext";
import SuspendedBanner from "./SuspendedBanner";
import BranchSelector from "./BranchSelector";

const DRAWER_WIDTH = 260;

const NAV_ITEMS = [
  {
    key: "dashboard",
    label: "Inicio",
    href: "/directory/business",
    icon: DashboardIcon,
  },
  {
    key: "orders",
    label: "Órdenes de Servicio",
    href: "/directory/business/orders",
    icon: BuildIcon,
  },
  {
    key: "contacts",
    label: "Contactos",
    href: "/directory/business/contacts",
    icon: MessageIcon,
  },
  {
    key: "reports",
    label: "Reportes",
    href: "/directory/business/reports",
    icon: AssessmentIcon,
  },
  {
    key: "offers",
    label: "Ofertas",
    href: "/directory/business/offers",
    icon: LocalOfferIcon,
  },
  {
    key: "profile",
    label: "Ficha",
    href: "/directory/business/profile",
    icon: StorefrontIcon,
  },
  {
    key: "team",
    label: "Equipo",
    href: "/directory/business/team",
    icon: PeopleIcon,
  },
  {
    key: "subscription",
    label: "Plan",
    href: "/directory/business/subscription",
    icon: CreditCardIcon,
  },
];

export default function BusinessPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { enterprise, myRole, subscription } = useBusinessPanel();

  const plan = enterprise?.plan || "free";
  const status =
    subscription?.licenseStatus || enterprise?.licenseStatus || "none";

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: "primary.main" }}
        >
          CareDriver
        </Typography>
      </Toolbar>

      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <Avatar
            src={enterprise?.logoImgUrl?.url}
            alt={enterprise?.name}
            sx={{ width: 48, height: 48, bgcolor: "primary.main" }}
          >
            {enterprise?.name?.charAt(0)}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography noWrap variant="body2" fontWeight={700}>
              {enterprise?.name}
            </Typography>
            <Typography noWrap variant="caption" color="text.secondary">
              {myRole === "admin"
                ? "Dueño"
                : myRole === "marketing"
                  ? "Marketing"
                  : "Operador"}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Chip
            size="small"
            label={
              plan === "free"
                ? "Ficha"
                : plan === "verified"
                  ? "Verificado"
                  : "Destacado"
            }
            color={plan === "featured" ? "secondary" : "default"}
          />
          <Chip
            size="small"
            label={
              status === "active"
                ? "Activo"
                : status === "past_due"
                  ? "Mora"
                  : status === "suspended"
                    ? "Suspendido"
                    : "Sin suscripción"
            }
            color={
              status === "active"
                ? "success"
                : status === "past_due"
                  ? "warning"
                  : status === "suspended"
                    ? "error"
                    : "default"
            }
          />
        </Box>
        <Box sx={{ mt: 1.5 }}>
          <BranchSelector />
        </Box>
      </Box>

      <List sx={{ flex: 1, py: 1 }}>
        {NAV_ITEMS.map((item) => {
          const selected =
            pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <ListItem key={item.key} disablePadding>
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
                    "& .MuiListItemIcon-root": {
                      color: "primary.contrastText",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: selected ? "inherit" : "text.secondary",
                  }}
                >
                  <Icon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button
          fullWidth
          variant="outlined"
          href="/directory/business/subscription"
        >
          Gestionar plan
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
              borderRight: `1px solid ${theme.palette.divider}`,
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
        <SuspendedBanner />
        {children}
      </Box>
    </Box>
  );
}
