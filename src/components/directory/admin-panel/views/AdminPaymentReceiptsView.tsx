"use client";

import React, { useState } from "react";
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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useAdminPanel } from "../AdminPanelContext";
import {
  reviewPaymentReceipt,
  markReceiptInvoiced,
} from "@/utils/requesters/AdminRequester";
import { PLAN_LABELS } from "@/constants/directory";
import { PaymentReceipt } from "@/interfaces/Directory";
import LoadingButton from "@/components/directory/business-panel/LoadingButton";

export default function AdminPaymentReceiptsView() {
  const { receipts, businesses } = useAdminPanel();
  const [selected, setSelected] = useState<PaymentReceipt | null>(null);
  const [loading, setLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [filterPendingInvoice, setFilterPendingInvoice] = useState(false);

  const pendingReceipts = receipts.filter((r) => r.status === "pending");
  const displayed = filterPendingInvoice
    ? receipts.filter((r) => !r.invoiced)
    : pendingReceipts;

  const handleApprove = async () => {
    if (!selected?.id) return;
    setLoading(true);
    await reviewPaymentReceipt(selected.id, "approved");
    setLoading(false);
    setSelected(null);
  };

  const handleReject = async () => {
    if (!selected?.id) return;
    setLoading(true);
    await reviewPaymentReceipt(selected.id, "rejected", rejectionReason);
    setLoading(false);
    setSelected(null);
    setRejectionReason("");
  };

  const handleToggleInvoiced = async (receipt: PaymentReceipt) => {
    if (receipt.status === "pending" || !receipt.id) return;
    await markReceiptInvoiced(receipt.id);
  };

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: "primary.main", mb: 3 }}
      >
        Comprobantes de pago
      </Typography>

      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3 }}>
        <Chip
          label={`${pendingReceipts.length} pendientes de aprobación`}
          color="error"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={filterPendingInvoice}
              onChange={(e) => setFilterPendingInvoice(e.target.checked)}
            />
          }
          label="Ver todos los pendientes de facturar"
        />
      </Box>

      <Grid container spacing={3}>
        {displayed.map((receipt) => {
          const business = businesses.find(
            (b) => b.id === receipt.enterpriseId,
          );
          return (
            <Grid item xs={12} md={6} key={receipt.id}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {business?.name || "Negocio desconocido"}
                    </Typography>
                    <Chip
                      size="small"
                      label={
                        receipt.status === "pending"
                          ? "Pendiente"
                          : receipt.status === "approved"
                            ? "Aprobado"
                            : "Rechazado"
                      }
                      color={
                        receipt.status === "pending"
                          ? "warning"
                          : receipt.status === "approved"
                            ? "success"
                            : "error"
                      }
                    />
                  </Box>

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Monto declarado:</strong> Bs {receipt.amount}
                  </Typography>
                  {receipt.plan && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Plan:</strong> {PLAN_LABELS[receipt.plan]}
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Fecha de subida:</strong>{" "}
                    {receipt.submittedAt
                      ? new Date(
                          (receipt.submittedAt as any).toDate?.() ||
                            receipt.submittedAt,
                        ).toLocaleString()
                      : "—"}
                  </Typography>

                  {receipt.fileUrl && (
                    <Box sx={{ my: 1 }}>
                      <Avatar
                        src={receipt.fileUrl}
                        variant="rounded"
                        sx={{
                          width: "100%",
                          height: 180,
                          objectFit: "contain",
                        }}
                      />
                    </Box>
                  )}

                  {receipt.status !== "pending" && (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={Boolean(receipt.invoiced)}
                          onChange={() => handleToggleInvoiced(receipt)}
                        />
                      }
                      label="Facturado"
                    />
                  )}

                  {receipt.status === "pending" && (
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        justifyContent: "flex-end",
                        mt: 2,
                      }}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setSelected(receipt)}
                      >
                        Revisar
                      </Button>
                    </Box>
                  )}
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
        maxWidth="sm"
      >
        <DialogTitle>Revisar comprobante</DialogTitle>
        <DialogContent>
          {selected?.fileUrl && (
            <Box sx={{ mb: 2 }}>
              <img
                src={selected.fileUrl}
                alt="Comprobante"
                style={{ width: "100%", maxHeight: 300, objectFit: "contain" }}
              />
            </Box>
          )}
          <TextField
            label="Motivo de rechazo"
            fullWidth
            multiline
            rows={2}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
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
