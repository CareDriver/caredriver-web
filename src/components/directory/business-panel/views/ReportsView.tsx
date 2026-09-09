"use client";

import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { useBusinessPanel } from "../BusinessPanelContext";

export default function ReportsView() {
  const { leads, offers, enterprise } = useBusinessPanel();

  const contactsByMonth = useMemo(() => {
    const map: Record<string, number> = {};
    leads.forEach((lead) => {
      const date = lead.createdAt?.toDate?.();
      if (!date) return;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count }));
  }, [leads]);

  const closureRate = useMemo(() => {
    if (leads.length === 0) return 0;
    const closed = leads.filter(
      (l) => l.businessReportedStatus === "closed",
    ).length;
    return Math.round((closed / leads.length) * 100);
  }, [leads]);

  const avgResponse = enterprise?.avgResponseMinutes ?? null;
  const totalOfferViews = offers.reduce((sum, o) => sum + (o.views || 0), 0);
  const totalRedemptions = offers.reduce(
    (sum, o) => sum + (o.redemptions || 0),
    0,
  );

  const exportCsv = () => {
    const rows = leads.map((lead) => ({
      Fecha: lead.createdAt?.toDate?.().toLocaleDateString("es-BO") || "",
      Rubro: lead.category,
      Vehiculo: lead.vehicleSummary,
      Problema: lead.problemText,
      Estado: lead.businessReportedStatus || "",
      Zona: lead.zoneLabel || "",
    }));
    const headers = Object.keys(rows[0] || {});
    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        headers.map((h) => `"${(r as Record<string, string>)[h]}"`).join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contactos-${enterprise?.name || "negocio"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const maxContacts = Math.max(...contactsByMonth.map((c) => c.count), 1);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: "primary.main" }}
        >
          Reportes
        </Typography>
        <Button variant="outlined" onClick={exportCsv}>
          Exportar contactos CSV
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard label="Total contactos" value={String(leads.length)} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard label="Tasa de cierre" value={`${closureRate}%`} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            label="Tiempo respuesta"
            value={avgResponse != null ? `${avgResponse} min` : "—"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard label="Canjes ofertas" value={String(totalRedemptions)} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Contactos por mes
              </Typography>
              {contactsByMonth.length > 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 2,
                    height: 200,
                  }}
                >
                  {contactsByMonth.map((item) => (
                    <Box
                      key={item.month}
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
                          height: `${(item.count / maxContacts) * 160}px`,
                          bgcolor: "primary.main",
                          borderRadius: 1,
                          minHeight: 8,
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {item.month}
                      </Typography>
                      <Typography variant="caption" fontWeight={700}>
                        {item.count}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 4 }}
                >
                  No hay datos suficientes.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Ofertas
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Oferta</TableCell>
                      <TableCell align="right">Vistas</TableCell>
                      <TableCell align="right">Canjes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {offers.map((offer) => (
                      <TableRow key={offer.id}>
                        <TableCell>{offer.title}</TableCell>
                        <TableCell align="right">{offer.views || 0}</TableCell>
                        <TableCell align="right">
                          {offer.redemptions || 0}
                        </TableCell>
                      </TableRow>
                    ))}
                    {offers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                          Sin ofertas registradas.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: "primary.main", mt: 1 }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
