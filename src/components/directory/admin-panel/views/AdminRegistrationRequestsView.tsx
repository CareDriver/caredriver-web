"use client";

import React, { useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useAdminPanel } from "../AdminPanelContext";
import { approveDirectoryEnterpriseRequest } from "@/utils/requesters/AdminRequester";
import {
  CATEGORY_LABELS,
  PLAN_LABELS,
  TAG_LABELS,
  DAY_LABELS,
} from "@/constants/directory";
import { EnterpriseRequest } from "@/interfaces/Enterprise";
import { Timestamp } from "firebase/firestore";
import LoadingButton from "@/components/directory/business-panel/LoadingButton";

export default function AdminRegistrationRequestsView() {
  const { requests, businesses } = useAdminPanel();
  const [selected, setSelected] = useState<EnterpriseRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleApprove = async () => {
    if (!selected) return;
    setLoading(true);
    await approveDirectoryEnterpriseRequest(selected.id, "approved");
    setLoading(false);
    setSelected(null);
  };

  const handleReject = async () => {
    if (!selected) return;
    setLoading(true);
    await approveDirectoryEnterpriseRequest(
      selected.id,
      "rejected",
      rejectionReason,
    );
    setLoading(false);
    setSelected(null);
    setRejectionReason("");
  };

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: "primary.main", mb: 3 }}
      >
        Solicitudes de registro ({requests.length})
      </Typography>

      <Grid container spacing={3}>
        {requests.map((req) => {
          const isBranch = Boolean(req.chainId);
          const parent = businesses.find((b) => b.id === req.chainId);
          return (
            <Grid item xs={12} md={6} key={req.id}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Avatar
                      src={req.logoImgUrl?.url}
                      sx={{ bgcolor: "primary.main" }}
                    >
                      {req.name?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {req.name}
                      </Typography>
                      {isBranch && parent && (
                        <Chip
                          size="small"
                          color="info"
                          label={`Sucursal de ${parent.name}`}
                          component={Link}
                          href={`/directory/admin/businesses?id=${parent.id}`}
                          clickable
                        />
                      )}
                    </Box>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {req.description || "Sin descripción"}
                  </Typography>

                  <Box sx={{ mb: 1 }}>
                    <Chip
                      size="small"
                      label={PLAN_LABELS[req.requestedPlan || "free"]}
                      color="secondary"
                    />
                  </Box>

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Rubros:</strong>{" "}
                    {(req.directoryCategories || [])
                      .map(
                        (c) =>
                          CATEGORY_LABELS[c as keyof typeof CATEGORY_LABELS] ||
                          c,
                      )
                      .join(", ")}
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>WhatsApp:</strong> {req.whatsapp || "—"}
                  </Typography>

                  <Box
                    sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}
                  >
                    {(req.tags || []).map((tag) => (
                      <Chip
                        key={tag}
                        size="small"
                        label={
                          TAG_LABELS[tag as keyof typeof TAG_LABELS] || tag
                        }
                      />
                    ))}
                  </Box>

                  <Box
                    sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setSelected(req)}
                    >
                      Revisar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Dialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Revisar solicitud: {selected?.name}</DialogTitle>
        <DialogContent>
          {selected && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Fotos del local</Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", my: 1 }}>
                  {(selected.carouselPhotoUrls || []).map((url, idx) => (
                    <Avatar
                      key={idx}
                      src={url}
                      variant="rounded"
                      sx={{ width: 80, height: 80 }}
                    />
                  ))}
                </Box>
                <Typography variant="subtitle2" sx={{ mt: 2 }}>
                  Horarios
                </Typography>
                {Object.entries(selected.hours || {}).map(([day, info]) => {
                  const hourInfo = info as {
                    open: string;
                    close: string;
                    closed: boolean;
                  };
                  return (
                    <Typography key={day} variant="body2">
                      {DAY_LABELS[day as keyof typeof DAY_LABELS]}:{" "}
                      {hourInfo.closed
                        ? "Cerrado"
                        : `${hourInfo.open} - ${hourInfo.close}`}
                    </Typography>
                  );
                })}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Sub-servicios</Typography>
                {(selected.subServices || []).map((s) => (
                  <Chip
                    key={s.id}
                    size="small"
                    label={s.label}
                    sx={{ m: 0.5 }}
                  />
                ))}
                <Typography variant="subtitle2" sx={{ mt: 2 }}>
                  Plan solicitado
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 700, color: "secondary.main" }}
                >
                  {PLAN_LABELS[selected.requestedPlan || "free"]}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Al aprobar se crea en plan Ficha; el negocio sube comprobante
                  después si quiere el plan pago.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Motivo de rechazo (solo si rechazás)"
                  fullWidth
                  multiline
                  rows={2}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  sx={{ mt: 1 }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Cerrar</Button>
          <LoadingButton
            onClick={handleReject}
            loading={loading}
            color="error"
            disabled={loading}
          >
            Rechazar
          </LoadingButton>
          <LoadingButton
            onClick={handleApprove}
            loading={loading}
            variant="contained"
            disabled={loading}
          >
            Aprobar
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
