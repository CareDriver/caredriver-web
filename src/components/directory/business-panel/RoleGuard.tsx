"use client";

import React from "react";
import { Box, Alert } from "@mui/material";
import { useBusinessPanel } from "./BusinessPanelContext";
import { MemberRole } from "@/constants/directory";

interface RoleGuardProps {
  children: React.ReactNode;
  allowed: MemberRole[];
  fallback?: React.ReactNode;
}

/**
 * Renders children only if the current user has one of the allowed roles.
 * Owners always pass (role === "admin").
 */
export default function RoleGuard({
  children,
  allowed,
  fallback,
}: RoleGuardProps) {
  const { myRole } = useBusinessPanel();
  const allowedSet = new Set<MemberRole>(["admin", ...allowed]);

  if (!myRole || !allowedSet.has(myRole)) {
    if (fallback) return <>{fallback}</>;
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="info">
          No tenés permisos para realizar esta acción.
        </Alert>
      </Box>
    );
  }

  return <>{children}</>;
}

export function useCanManageOffers() {
  const { myRole } = useBusinessPanel();
  return myRole === "admin" || myRole === "marketing";
}

export function useCanEditProfile() {
  const { myRole } = useBusinessPanel();
  return myRole === "admin" || myRole === "marketing";
}

export function useCanManageSubscription() {
  const { myRole } = useBusinessPanel();
  return myRole === "admin";
}
