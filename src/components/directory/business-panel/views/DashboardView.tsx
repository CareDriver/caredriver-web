"use client";

import React from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LockIcon from "@mui/icons-material/Lock";
import { useBusinessPanel } from "../BusinessPanelContext";
import {
  LEAD_STATUS_LABELS,
  LEAD_STATUS_COLORS,
  PLAN_LABELS,
} from "@/constants/directory";

export default function DashboardView() {
  const { enterprise, leads, subscription } = useBusinessPanel();

  const contactsThisMonth = leads.length;
  const closuresReported = leads.filter(
    (l) => l.businessReportedStatus === "closed",
  ).length;
  const avgResponse = enterprise?.avgResponseMinutes ?? null;
  const plan = enterprise?.plan || "free";
  const isFeatured = plan === "featured";
  const status =
    subscription?.licenseStatus || enterprise?.licenseStatus || "none";

  // Placeholder trend data (desktop can later be replaced with real trendSummaries queries)
  const trendBars = [
    { label: "Lun", value: 12 },
    { label: "Mar", value: 19 },
    { label: "Mié", value: 15 },
    { label: "Jue", value: 22 },
    { label: "Vie", value: 28 },
    { label: "Sáb", value: 18 },
    { label: "Dom", value: 10 },
  ];
  const maxTrend = Math.max(...trendBars.map((t) => t.value));

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: "primary.main", mb: 1 }}
      >
        Panel de {enterprise?.name}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Resumen de actividad y métricas del mes.
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label="Contactos"
            value={String(contactsThisMonth)}
            sub="este mes"
            icon={<MessageIcon color="primary" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label="Tiempo de respuesta"
            value={avgResponse != null ? `${avgResponse} min` : "—"}
            sub="promedio"
            icon={<AccessTimeIcon color="primary" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label="Cierres"
            value={String(closuresReported)}
            sub="reportados"
            icon={<CheckCircleIcon color="primary" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            label="Plan"
            value={PLAN_LABELS[plan]}
            sub={status === "active" ? "Activo" : "Sin suscripción"}
            icon={<TrendingUpIcon color="primary" />}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Card>
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
                  Tendencias de búsqueda
                </Typography>
                {!isFeatured && (
                  <Chip
                    size="small"
                    icon={<LockIcon />}
                    label="Solo Destacado"
                  />
                )}
              </Box>

              {isFeatured ? (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 1.5,
                      height: 160,
                      mb: 2,
                    }}
                  >
                    {trendBars.map((bar) => (
                      <Box
                        key={bar.label}
                        sx={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            height: `${(bar.value / maxTrend) * 140}px`,
                            bgcolor: "secondary.main",
                            borderRadius: 1,
                            minHeight: 8,
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {bar.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Búsquedas de tu rubro en tu zona esta semana. Datos
                    actualizados diariamente.
                  </Typography>
                </>
              ) : (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 6,
                    bgcolor: "action.hover",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    Actualiza a Destacado para ver tendencias completas de tu
                    zona.
                  </Typography>
                  <Button
                    component={Link}
                    href="/directory/business/subscription"
                    variant="contained"
                    sx={{ mt: 2 }}
                  >
                    Subir de plan
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card sx={{ height: "100%" }}>
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
                  Contactos recientes
                </Typography>
                <Button
                  component={Link}
                  href="/directory/business/contacts"
                  size="small"
                >
                  Ver todos
                </Button>
              </Box>

              {leads.slice(0, 5).length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Problema</TableCell>
                        <TableCell>Estado</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {leads.slice(0, 5).map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell>
                            <Typography
                              variant="body2"
                              noWrap
                              sx={{ maxWidth: 220 }}
                            >
                              {lead.problemText || "Sin descripción"}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {lead.vehicleSummary}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={
                                LEAD_STATUS_LABELS[
                                  lead.businessReportedStatus as keyof typeof LEAD_STATUS_LABELS
                                ] || "Sin estado"
                              }
                              sx={{
                                bgcolor:
                                  LEAD_STATUS_COLORS[
                                    lead.businessReportedStatus as keyof typeof LEAD_STATUS_COLORS
                                  ] || "grey.400",
                                color: "#fff",
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 4 }}
                >
                  Todavía no recibiste contactos este período.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

function KpiCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
}) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          {icon}
        </Box>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: "primary.main" }}
        >
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {sub}
        </Typography>
      </CardContent>
    </Card>
  );
}
