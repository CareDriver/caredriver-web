"use client";

import React from "react";
import { Box, Container, Typography, Link as MuiLink } from "@mui/material";
import RegistrationTopBar from "@/components/directory/registration/RegistrationTopBar";

export default function RegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <RegistrationTopBar />

      <Box component="main" sx={{ flex: 1, py: { xs: 3, md: 5 } }}>
        <Container maxWidth="lg">{children}</Container>
      </Box>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          textAlign: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} CareDriver Bolivia. Todos los derechos
          reservados.
        </Typography>
      </Box>
    </Box>
  );
}
