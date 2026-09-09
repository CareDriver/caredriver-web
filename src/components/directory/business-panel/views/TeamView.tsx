"use client";

import React from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Grid,
  Avatar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useBusinessPanel } from "../BusinessPanelContext";
import { ROLE_LABELS, TEAM_MEMBER_LIMITS } from "@/constants/directory";

export default function TeamView() {
  const { enterprise, members, branches, isOwner, myRole } = useBusinessPanel();

  const plan = enterprise?.plan || "free";
  const userLimit = TEAM_MEMBER_LIMITS[plan];
  const activeMembers = members.filter((m) => m.accepted);
  const canManageTeam = isOwner;

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: "primary.main", mb: 3 }}
      >
        Equipo y sucursales
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Equipo
                </Typography>
                <Chip
                  label={`${activeMembers.length} / ${userLimit}`}
                  size="small"
                />
              </Box>

              {members.map((member) => (
                <Box
                  key={member.id || member.userId}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 1.5,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      src={member.profilePhoto?.url}
                      sx={{ bgcolor: "primary.main" }}
                    >
                      {member.fullName?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        {member.fullName || "Sin nombre"}
                      </Typography>
                      {!member.accepted && (
                        <Typography variant="caption" color="warning.main">
                          Pendiente de aceptar
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Chip
                    size="small"
                    label={
                      ROLE_LABELS[member.role as keyof typeof ROLE_LABELS] ||
                      member.role
                    }
                  />
                </Box>
              ))}

              {canManageTeam && activeMembers.length < userLimit && (
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() =>
                    alert(
                      "La invitación de miembros se habilitará en una próxima versión.",
                    )
                  }
                >
                  Agregar miembro
                </Button>
              )}

              {!canManageTeam && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Solo el dueño puede invitar miembros.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Sucursales
              </Typography>

              {branches.map((branch) => (
                <Box
                  key={branch.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 1.5,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight={600}>
                      {branch.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {branch.city}
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    component={Link}
                    href={`/directory/business?branch=${branch.id}`}
                  >
                    Ver
                  </Button>
                </Box>
              ))}

              {branches.length === 0 && (
                <Typography color="text.secondary" sx={{ py: 2 }}>
                  No hay sucursales registradas.
                </Typography>
              )}

              {isOwner && (
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 2 }}
                  component={Link}
                  href={`/directory/register?chainId=${enterprise?.id}`}
                >
                  Agregar sucursal
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
