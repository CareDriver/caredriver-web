"use client";

import React, { useContext } from "react";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { AuthContext } from "@/context/AuthContext";
import { UserRole } from "@/interfaces/UserInterface";

export default function RegistrationTopBar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user, logout, isAdminClaim } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isAdmin = isAdminClaim || user?.role === UserRole.Admin;

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={1}
      sx={{
        bgcolor: "background.paper",
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          minHeight: 64,
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* Brand & Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            component={Link}
            href="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              textDecoration: "none",
            }}
          >
            <Box
              component="img"
              src={
                theme.palette.mode === "dark"
                  ? "/assets/logo/logoWhite.png"
                  : "/assets/logo/logoGreen.png"
              }
              alt="CareDriver"
              sx={{
                height: { xs: 32, sm: 38 },
                width: "auto",
                objectFit: "contain",
                display: "block",
              }}
              onError={(e: any) => {
                e.currentTarget.src = "/logo.svg";
              }}
            />
            <Chip
              label="Empresas"
              size="small"
              color="primary"
              variant="outlined"
              sx={{
                fontWeight: 700,
                fontSize: "0.7rem",
                height: 22,
                borderRadius: 1.5,
                display: { xs: "none", sm: "inline-flex" },
              }}
            />
          </Box>
        </Box>

        {/* User Info & Actions */}
        <Box
          sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}
        >
          {isAdmin && !isMobile && (
            <Button
              component={Link}
              href="/directory/admin"
              variant="outlined"
              size="small"
              color="primary"
              startIcon={<AdminPanelSettingsIcon />}
              sx={{ borderRadius: 2 }}
            >
              Panel Admin
            </Button>
          )}

          {user && (
            <>
              {!isMobile && (
                <Box
                  sx={{
                    textAlign: "right",
                    display: { xs: "none", md: "block" },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      color: "text.primary",
                      maxWidth: 180,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.fullName || user.email?.split("@")[0] || "Usuario"}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      display: "block",
                      maxWidth: 180,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.email}
                  </Typography>
                </Box>
              )}

              <IconButton
                onClick={handleMenuClick}
                size="small"
                sx={{ p: 0.5 }}
              >
                <Avatar
                  src={
                    typeof user.photoUrl === "string"
                      ? user.photoUrl
                      : user.photoUrl?.url
                  }
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: "primary.main",
                    color: "#051A15",
                    fontWeight: 700,
                  }}
                >
                  {(user.fullName || user.email || "U").charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                PaperProps={{
                  elevation: 4,
                  sx: {
                    minWidth: 220,
                    borderRadius: 2,
                    mt: 1.5,
                    border: `1px solid ${theme.palette.divider}`,
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700 }}
                    noWrap
                  >
                    {user.fullName || "Usuario conectado"}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    noWrap
                    display="block"
                  >
                    {user.email}
                  </Typography>
                  {isAdmin && (
                    <Chip
                      size="small"
                      label="Administrador"
                      color="primary"
                      sx={{
                        mt: 1,
                        height: 20,
                        fontSize: "0.65rem",
                        fontWeight: 700,
                      }}
                    />
                  )}
                </Box>
                <Divider />

                {isAdmin && (
                  <MenuItem
                    component={Link}
                    href="/directory/admin"
                    onClick={handleMenuClose}
                    sx={{ gap: 1.5 }}
                  >
                    <AdminPanelSettingsIcon fontSize="small" color="action" />
                    Panel de Administración
                  </MenuItem>
                )}

                <MenuItem
                  component={Link}
                  href="/directory/business"
                  onClick={handleMenuClose}
                  sx={{ gap: 1.5 }}
                >
                  <StorefrontIcon fontSize="small" color="action" />
                  Ir a mi Negocio
                </MenuItem>

                <Divider />

                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    logout();
                  }}
                  sx={{ color: "error.main", gap: 1.5, fontWeight: 600 }}
                >
                  <LogoutIcon fontSize="small" color="error" />
                  Cerrar sesión
                </MenuItem>
              </Menu>

              {/* Botón directo de Cerrar Sesión en desktop */}
              {!isMobile && (
                <Button
                  variant="outlined"
                  color="inherit"
                  size="small"
                  onClick={logout}
                  startIcon={<LogoutIcon />}
                  sx={{
                    borderRadius: 2,
                    borderColor: "divider",
                    color: "text.secondary",
                    "&:hover": {
                      borderColor: "error.main",
                      color: "error.main",
                    },
                  }}
                >
                  Cerrar sesión
                </Button>
              )}
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
