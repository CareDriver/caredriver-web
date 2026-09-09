"use client";

import React from "react";
import { Alert, AlertTitle, Box, Button } from "@mui/material";
import Link from "next/link";
import { useBusinessPanel } from "./BusinessPanelContext";

export default function SuspendedBanner() {
  const { enterprise, subscription } = useBusinessPanel();

  const status =
    subscription?.licenseStatus || enterprise?.licenseStatus || "none";
  const daysOverdue = subscription?.daysOverdue ?? enterprise?.daysOverdue ?? 0;

  if (status === "active" || status === "none") return null;

  const isSuspended = status === "suspended";

  return (
    <Box sx={{ mb: 3 }}>
      <Alert
        severity={isSuspended ? "error" : "warning"}
        action={
          <Button
            component={Link}
            href="/directory/business/subscription"
            color="inherit"
            size="small"
          >
            Regularizar
          </Button>
        }
      >
        <AlertTitle>
          {isSuspended ? "Suscripción suspendida" : "Suscripción en mora"}
        </AlertTitle>
        {isSuspended
          ? `Tu negocio está en modo limitado. Subí un comprobante de pago para reactivar todos los beneficios.`
          : `Tu suscripción tiene ${daysOverdue} día(s) de mora. Regularizá el pago para evitar la suspensión.`}
      </Alert>
    </Box>
  );
}
