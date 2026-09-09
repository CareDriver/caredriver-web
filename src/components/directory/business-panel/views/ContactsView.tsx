"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Menu,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  CircularProgress,
  Alert,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useBusinessPanel } from "../BusinessPanelContext";
import { Lead } from "@/interfaces/Directory";
import {
  LEAD_STATUS_LABELS,
  LEAD_STATUS_COLORS,
  RATING_REQUEST_LIMITS,
  CATEGORY_LABELS,
} from "@/constants/directory";
import {
  updateLeadBusinessStatus,
  requestRating,
  markBusinessResponse,
} from "@/utils/requesters/DirectoryRequester";
import { timestampDateInSpanish } from "@/utils/helpers/DateHelper";
import LoadingButton from "../LoadingButton";

export default function ContactsView() {
  const { enterprise, leads, myRole } = useBusinessPanel();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [statusLeadId, setStatusLeadId] = useState<string | null>(null);
  const [loadingStatusId, setLoadingStatusId] = useState<string | null>(null);
  const [ratingLeadId, setRatingLeadId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const plan = enterprise?.plan || "free";
  const canRequestRating = myRole === "admin" || myRole === "marketing";
  const ratingLimit = RATING_REQUEST_LIMITS[plan];

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        (lead.problemText || "").toLowerCase().includes(search.toLowerCase()) ||
        (lead.vehicleSummary || "")
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || lead.businessReportedStatus === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || lead.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [leads, search, statusFilter, categoryFilter]);

  const handleOpenStatusMenu = (
    event: React.MouseEvent<HTMLElement>,
    leadId: string,
  ) => {
    setAnchorEl(event.currentTarget);
    setStatusLeadId(leadId);
  };

  const handleCloseStatusMenu = () => {
    setAnchorEl(null);
    setStatusLeadId(null);
  };

  const handleStatusChange = async (
    status: "contacted" | "quoted" | "closed" | "not_closed",
  ) => {
    if (!statusLeadId) return;
    setLoadingStatusId(statusLeadId);
    if (status === "contacted") {
      await markBusinessResponse(statusLeadId, enterprise?.id || "");
    }
    await updateLeadBusinessStatus(statusLeadId, status);
    setLoadingStatusId(null);
    handleCloseStatusMenu();
  };

  const handleRequestRating = async (lead: Lead) => {
    if (!enterprise) return;
    setRatingLeadId(lead.id || null);
    await requestRating(enterprise.id || "", lead.userId);
    setRatingLeadId(null);
  };

  const categories = useMemo(
    () => Array.from(new Set(leads.map((l) => l.category).filter(Boolean))),
    [leads],
  );

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: "primary.main", mb: 1 }}
      >
        Contactos
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Bandeja de contactos recibidos. Sin datos personales del usuario.
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              label="Buscar"
              placeholder="Problema o vehículo"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{ minWidth: 240 }}
            />
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Estado</InputLabel>
              <Select
                value={statusFilter}
                label="Estado"
                onChange={(e: SelectChangeEvent) =>
                  setStatusFilter(e.target.value)
                }
              >
                <MenuItem value="all">Todos</MenuItem>
                {Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Rubro</InputLabel>
              <Select
                value={categoryFilter}
                label="Rubro"
                onChange={(e: SelectChangeEvent) =>
                  setCategoryFilter(e.target.value)
                }
              >
                <MenuItem value="all">Todos</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS] ||
                      cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Problema</TableCell>
              <TableCell>Vehículo</TableCell>
              <TableCell>Rubro</TableCell>
              <TableCell>Zona</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeads.map((lead) => {
              const currentStatus =
                lead.businessReportedStatus as keyof typeof LEAD_STATUS_LABELS;
              return (
                <TableRow key={lead.id} hover>
                  <TableCell>{lead.problemText || "Sin descripción"}</TableCell>
                  <TableCell>{lead.vehicleSummary}</TableCell>
                  <TableCell>
                    {CATEGORY_LABELS[
                      lead.category as keyof typeof CATEGORY_LABELS
                    ] || lead.category}
                  </TableCell>
                  <TableCell>{lead.zoneLabel || "—"}</TableCell>
                  <TableCell>
                    {lead.createdAt
                      ? timestampDateInSpanish(lead.createdAt)
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={LEAD_STATUS_LABELS[currentStatus] || "Sin estado"}
                      sx={{
                        bgcolor:
                          LEAD_STATUS_COLORS[currentStatus] || "grey.400",
                        color: "#fff",
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        size="small"
                        onClick={(e) => handleOpenStatusMenu(e, lead.id || "")}
                        disabled={loadingStatusId === lead.id}
                        endIcon={
                          loadingStatusId === lead.id ? (
                            <CircularProgress size={14} />
                          ) : undefined
                        }
                      >
                        Cambiar estado
                      </Button>
                      {canRequestRating && (
                        <LoadingButton
                          size="small"
                          onClick={() => handleRequestRating(lead)}
                          disabled={plan === "free" || ratingLeadId === lead.id}
                          loading={ratingLeadId === lead.id}
                        >
                          Calificar
                        </LoadingButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredLeads.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No se encontraron contactos.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseStatusMenu}
      >
        {Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => (
          <MenuItem
            key={value}
            onClick={() =>
              handleStatusChange(
                value as "contacted" | "quoted" | "closed" | "not_closed",
              )
            }
          >
            {label}
          </MenuItem>
        ))}
      </Menu>

      {plan === "free" && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Los negocios del plan Gratuito no pueden solicitar calificaciones.
          Subí a Verificado para activar esta función.
        </Alert>
      )}
    </Box>
  );
}
