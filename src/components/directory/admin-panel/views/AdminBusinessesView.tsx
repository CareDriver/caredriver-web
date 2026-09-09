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
  Button,
  TextField,
  MenuItem,
  Select,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useAdminPanel } from "../AdminPanelContext";
import {
  verifyBusiness,
  changeBusinessPlan,
  suspendBusiness,
} from "@/utils/requesters/AdminRequester";
import {
  PLAN_LABELS,
  CATEGORY_LABELS,
  LICENSE_STATUS_LABELS,
} from "@/constants/directory";
import LoadingButton from "@/components/directory/business-panel/LoadingButton";

export default function AdminBusinessesView() {
  const { businesses } = useAdminPanel();
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [selected, setSelected] = useState<(typeof businesses)[0] | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = businesses.filter((b) => {
    const matchesSearch = (b.name || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesPlan = planFilter === "all" || b.plan === planFilter;
    return matchesSearch && matchesPlan;
  });

  const handleVerify = async (id: string, verified: boolean) => {
    setLoading(`verify-${id}`);
    await verifyBusiness(id, verified);
    setLoading(null);
  };

  const handlePlanChange = async (
    id: string,
    plan: "free" | "verified" | "featured",
  ) => {
    setLoading(`plan-${id}`);
    await changeBusinessPlan(id, plan);
    setLoading(null);
    setSelected(null);
  };

  const handleSuspend = async (id: string, suspended: boolean) => {
    setLoading(`suspend-${id}`);
    await suspendBusiness(id, suspended);
    setLoading(null);
  };

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: "primary.main", mb: 3 }}
      >
        Gestión de negocios
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
          value={planFilter}
          onChange={(e: SelectChangeEvent) => setPlanFilter(e.target.value)}
          displayEmpty
        >
          <MenuItem value="all">Todos los planes</MenuItem>
          <MenuItem value="free">Ficha</MenuItem>
          <MenuItem value="verified">Verificado</MenuItem>
          <MenuItem value="featured">Destacado</MenuItem>
        </Select>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Negocio</TableCell>
              <TableCell>Rubros</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Calif.</TableCell>
              <TableCell>Discrep.</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((b) => (
              <TableRow key={b.id} hover>
                <TableCell>{b.name}</TableCell>
                <TableCell>
                  {(b.directoryCategories || [])
                    .slice(0, 2)
                    .map(
                      (c) =>
                        CATEGORY_LABELS[c as keyof typeof CATEGORY_LABELS] || c,
                    )
                    .join(", ")}
                </TableCell>
                <TableCell>{PLAN_LABELS[b.plan || "free"]}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={LICENSE_STATUS_LABELS[b.licenseStatus || "none"]}
                    color={
                      b.licenseStatus === "active"
                        ? "success"
                        : b.licenseStatus === "suspended"
                          ? "error"
                          : "default"
                    }
                  />
                </TableCell>
                <TableCell>
                  {b.rating ? `${b.rating} (${b.ratingCount})` : "—"}
                </TableCell>
                <TableCell>{b.discrepancyCount || 0}</TableCell>
                <TableCell align="right">
                  <Box
                    sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}
                  >
                    <LoadingButton
                      size="small"
                      loading={loading === `verify-${b.id}`}
                      onClick={() => handleVerify(b.id || "", !b.verifiedAt)}
                    >
                      {b.verifiedAt ? "Des-verificar" : "Verificar"}
                    </LoadingButton>
                    <Button size="small" onClick={() => setSelected(b)}>
                      Plan
                    </Button>
                    <LoadingButton
                      size="small"
                      loading={loading === `suspend-${b.id}`}
                      onClick={() =>
                        handleSuspend(b.id || "", b.active !== false)
                      }
                    >
                      {b.active === false ? "Reactivar" : "Suspender"}
                    </LoadingButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Cambiar plan de {selected?.name}</DialogTitle>
        <DialogContent>
          <Select
            fullWidth
            value={selected?.plan || "free"}
            onChange={(e: SelectChangeEvent) =>
              selected &&
              handlePlanChange(
                selected.id || "",
                e.target.value as "free" | "verified" | "featured",
              )
            }
          >
            <MenuItem value="free">Ficha</MenuItem>
            <MenuItem value="verified">Verificado</MenuItem>
            <MenuItem value="featured">Destacado</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
