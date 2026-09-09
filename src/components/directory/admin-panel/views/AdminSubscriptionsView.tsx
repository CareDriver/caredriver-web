"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useAdminPanel } from "../AdminPanelContext";
import { PLAN_LABELS, LICENSE_STATUS_LABELS } from "@/constants/directory";
import { suspendBusiness } from "@/utils/requesters/AdminRequester";
import LoadingButton from "@/components/directory/business-panel/LoadingButton";

export default function AdminSubscriptionsView() {
  const { businesses, subscriptions } = useAdminPanel();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [overdueFilter, setOverdueFilter] = useState<string>("all");
  const [loading, setLoading] = useState<string | null>(null);

  interface Row {
    id?: string;
    name?: string;
    plan?: "free" | "verified" | "featured";
    licenseStatus?: "active" | "past_due" | "suspended" | "none";
    daysOverdue: number;
    currentPeriodEnd: any;
    discountCyclesRemaining: number;
  }

  const rows: Row[] = businesses
    .map((b) => {
      const sub = subscriptions.find((s) => s.enterpriseId === b.id);
      return {
        id: b.id,
        name: b.name,
        plan: b.plan,
        licenseStatus: b.licenseStatus,
        daysOverdue: sub?.daysOverdue ?? b.daysOverdue ?? 0,
        currentPeriodEnd: sub?.currentPeriodEnd || null,
        discountCyclesRemaining: sub?.discountCyclesRemaining ?? 0,
      };
    })
    .filter((row) => {
      const matchesSearch = (row.name || "")
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || row.licenseStatus === statusFilter;
      let matchesOverdue = true;
      if (overdueFilter === "7+") matchesOverdue = row.daysOverdue >= 7;
      if (overdueFilter === "30+") matchesOverdue = row.daysOverdue >= 30;
      if (overdueFilter === "0") matchesOverdue = row.daysOverdue === 0;
      return matchesSearch && matchesStatus && matchesOverdue;
    })
    .sort((a, b) => b.daysOverdue - a.daysOverdue);

  const handleSuspend = async (id: string, suspended: boolean) => {
    setLoading(id);
    await suspendBusiness(id, suspended);
    setLoading(null);
  };

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: "primary.main", mb: 3 }}
      >
        Suscripciones y mora
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          label="Buscar negocio"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ minWidth: 240 }}
        />
        <Select
          size="small"
          value={statusFilter}
          onChange={(e: SelectChangeEvent) => setStatusFilter(e.target.value)}
          displayEmpty
        >
          <MenuItem value="all">Todos los estados</MenuItem>
          <MenuItem value="active">Activo</MenuItem>
          <MenuItem value="past_due">Vencido</MenuItem>
          <MenuItem value="suspended">Suspendido</MenuItem>
        </Select>
        <Select
          size="small"
          value={overdueFilter}
          onChange={(e: SelectChangeEvent) => setOverdueFilter(e.target.value)}
          displayEmpty
        >
          <MenuItem value="all">Cualquier mora</MenuItem>
          <MenuItem value="0">Sin mora</MenuItem>
          <MenuItem value="7+">Más de 7 días</MenuItem>
          <MenuItem value="30+">Más de 30 días</MenuItem>
        </Select>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Negocio</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Días de mora</TableCell>
              <TableCell>Vencimiento</TableCell>
              <TableCell>Descuento activo</TableCell>
              <TableCell align="right">Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.name}</TableCell>
                <TableCell>{PLAN_LABELS[row.plan || "free"]}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={LICENSE_STATUS_LABELS[row.licenseStatus || "none"]}
                    color={
                      row.licenseStatus === "active"
                        ? "success"
                        : row.licenseStatus === "suspended"
                          ? "error"
                          : "warning"
                    }
                  />
                </TableCell>
                <TableCell>
                  {row.daysOverdue > 0 ? `${row.daysOverdue} días` : "—"}
                </TableCell>
                <TableCell>
                  {row.currentPeriodEnd
                    ? new Date(
                        (row.currentPeriodEnd as any).toDate?.() ||
                          row.currentPeriodEnd,
                      ).toLocaleDateString()
                    : "—"}
                </TableCell>
                <TableCell>
                  {row.discountCyclesRemaining > 0
                    ? `${row.discountCyclesRemaining} pagos restantes`
                    : "—"}
                </TableCell>
                <TableCell align="right">
                  <LoadingButton
                    size="small"
                    loading={loading === row.id}
                    onClick={() =>
                      handleSuspend(
                        row.id || "",
                        row.licenseStatus !== "suspended",
                      )
                    }
                  >
                    {row.licenseStatus === "suspended"
                      ? "Reactivar"
                      : "Suspender"}
                  </LoadingButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
