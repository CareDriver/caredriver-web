"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Divider,
} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShareIcon from "@mui/icons-material/Share";
import { useBusinessPanel } from "../BusinessPanelContext";
import {
  getCurrentPrice,
  submitPaymentReceipt,
  applyReferralCode,
} from "@/utils/requesters/DirectoryRequester";
import { uploadFileBlod } from "@/utils/requesters/FileUploader";
import {
  PLAN_LABELS,
  PLAN_FEATURES,
  LICENSE_STATUS_LABELS,
  REFERRAL_BONUS_DAYS,
} from "@/constants/directory";
import { PlanPricingResponse } from "@/utils/requesters/DirectoryRequester";
import { timestampDateInSpanish } from "@/utils/helpers/DateHelper";
import LoadingButton from "../LoadingButton";

export default function SubscriptionView() {
  const { enterprise, receipts, subscription, myRole } = useBusinessPanel();
  const [pricing, setPricing] = useState<PlanPricingResponse | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [receiptModal, setReceiptModal] = useState(false);
  const [receiptAmount, setReceiptAmount] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [referralInput, setReferralInput] = useState("");
  const [applyingReferral, setApplyingReferral] = useState(false);
  const [copied, setCopied] = useState(false);

  const canManage = myRole === "admin";
  const plan = enterprise?.plan || "free";
  const status =
    subscription?.licenseStatus || enterprise?.licenseStatus || "none";
  const daysOverdue = subscription?.daysOverdue ?? enterprise?.daysOverdue ?? 0;

  useEffect(() => {
    if (!enterprise?.id || plan === "free") return;
    setLoadingPrice(true);
    getCurrentPrice(enterprise.id).then((p) => {
      setPricing(p);
      setLoadingPrice(false);
    });
  }, [enterprise?.id, plan]);

  const handleUploadReceipt = async () => {
    if (!enterprise || !receiptFile || !receiptAmount) return;
    setUploading(true);
    const uploaded = await uploadFileBlod(
      `payment-receipts/${enterprise.id}/`,
      receiptFile,
    );
    const result = await submitPaymentReceipt(
      enterprise.id || "",
      uploaded.url,
      Number(receiptAmount),
    );
    setUploading(false);

    if (result) {
      try {
        await fetch("https://ntfy.sh/CareDriver_Comprobantes_Admin", {
          method: "POST",
          body: `Nuevo comprobante — ${enterprise.name} — Bs ${receiptAmount}`,
        });
      } catch {
        // silent
      }
      setReceiptModal(false);
      setReceiptAmount("");
      setReceiptFile(null);
    }
  };

  const handleApplyReferral = async () => {
    if (!enterprise || !referralInput.trim()) return;
    setApplyingReferral(true);
    await applyReferralCode(
      enterprise.id || "",
      referralInput.trim().toUpperCase(),
    );
    setApplyingReferral(false);
    setReferralInput("");
  };

  const shareReferral = () => {
    if (!enterprise?.referralCode) return;
    const text = `Usá mi código ${enterprise.referralCode} al registrarte en CareDriver y los dos ganamos ${REFERRAL_BONUS_DAYS} días gratis.`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  const copyReferral = () => {
    if (!enterprise?.referralCode) return;
    navigator.clipboard.writeText(enterprise.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const latestReceipt = receipts[0];

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: "primary.main", mb: 3 }}
      >
        Suscripción
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
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
                  Plan {PLAN_LABELS[plan]}
                </Typography>
                <Chip
                  label={LICENSE_STATUS_LABELS[status] || status}
                  color={
                    status === "active"
                      ? "success"
                      : status === "past_due"
                        ? "warning"
                        : status === "suspended"
                          ? "error"
                          : "default"
                  }
                />
              </Box>
              {daysOverdue > 0 && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Llevás {daysOverdue} día(s) de mora.
                </Alert>
              )}
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                {PLAN_FEATURES[plan].map((feature, idx) => (
                  <li key={idx}>
                    <Typography variant="body2">{feature}</Typography>
                  </li>
                ))}
              </ul>

              {plan !== "featured" && canManage && (
                <Button
                  fullWidth
                  variant="outlined"
                  component={Link}
                  href="/directory/business/subscription"
                  sx={{ mt: 2 }}
                >
                  Subir de plan
                </Button>
              )}
            </CardContent>
          </Card>

          {plan !== "free" && (
            <Card sx={{ mt: 3, bgcolor: "secondary.light" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Pago de este ciclo
                </Typography>

                {loadingPrice ? (
                  <Typography>Cargando precio...</Typography>
                ) : pricing ? (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      {pricing.discountApplied &&
                        pricing.basePrice > pricing.finalPrice && (
                          <Typography
                            variant="h6"
                            sx={{
                              textDecoration: "line-through",
                              color: "text.secondary",
                            }}
                          >
                            Bs {pricing.basePrice}
                          </Typography>
                        )}
                      <Typography
                        variant="h3"
                        sx={{ fontWeight: 700, color: "primary.main" }}
                      >
                        Bs {pricing.finalPrice}
                      </Typography>
                    </Box>
                    {pricing.campaignName && (
                      <Chip
                        label={pricing.campaignName}
                        color="secondary"
                        size="small"
                        sx={{ mb: 2 }}
                      />
                    )}

                    {pricing.qrCodeImageUrl && (
                      <Box sx={{ textAlign: "center", my: 2 }}>
                        <Box
                          component="img"
                          src={pricing.qrCodeImageUrl}
                          alt="QR de pago"
                          sx={{
                            width: 220,
                            height: 220,
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        />
                        <Box sx={{ mt: 1 }}>
                          <Button
                            size="small"
                            component="a"
                            href={pricing.qrCodeImageUrl}
                            download
                          >
                            Descargar QR
                          </Button>
                        </Box>
                      </Box>
                    )}

                    {pricing.paymentInstructions && (
                      <Typography
                        variant="body2"
                        sx={{ whiteSpace: "pre-line", mb: 2 }}
                      >
                        {pricing.paymentInstructions}
                      </Typography>
                    )}

                    {canManage && (
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => setReceiptModal(true)}
                      >
                        Subir comprobante de pago
                      </Button>
                    )}
                  </>
                ) : null}
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          {latestReceipt && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Último comprobante
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Bs {latestReceipt.amount}
                  </Typography>
                  <Chip
                    label={
                      latestReceipt.status === "approved"
                        ? "Aprobado"
                        : latestReceipt.status === "rejected"
                          ? "Rechazado"
                          : "Pendiente"
                    }
                    color={
                      latestReceipt.status === "approved"
                        ? "success"
                        : latestReceipt.status === "rejected"
                          ? "error"
                          : "warning"
                    }
                  />
                </Box>
                {latestReceipt.status === "rejected" &&
                  latestReceipt.rejectionReason && (
                    <Typography variant="body2" color="error">
                      Motivo: {latestReceipt.rejectionReason}
                    </Typography>
                  )}
              </CardContent>
            </Card>
          )}

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Historial de comprobantes
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Monto</TableCell>
                      <TableCell>Estado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {receipts.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>
                          {r.submittedAt
                            ? timestampDateInSpanish(r.submittedAt)
                            : "—"}
                        </TableCell>
                        <TableCell>Bs {r.amount}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={
                              r.status === "approved"
                                ? "Aprobado"
                                : r.status === "rejected"
                                  ? "Rechazado"
                                  : "Pendiente"
                            }
                            color={
                              r.status === "approved"
                                ? "success"
                                : r.status === "rejected"
                                  ? "error"
                                  : "warning"
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    {receipts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                          Sin comprobantes aún.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Referidos
              </Typography>
              {enterprise?.referralCode && (
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: "secondary.main",
                      letterSpacing: 2,
                    }}
                  >
                    {enterprise.referralCode}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ my: 1 }}
                  >
                    Cuando un negocio se registra con tu código y hace su primer
                    pago, ambos ganan {REFERRAL_BONUS_DAYS} días gratis.
                  </Typography>
                  <Box
                    sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                  >
                    <Button size="small" onClick={copyReferral}>
                      {copied ? "Copiado" : "Copiar"}
                    </Button>
                    <Button size="small" onClick={shareReferral}>
                      Compartir
                    </Button>
                  </Box>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              {!enterprise?.referredByCode && canManage && (
                <>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    ¿Tenés un código de referido?
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      size="small"
                      placeholder="Ej. CDR-XXXXXX"
                      value={referralInput}
                      onChange={(e) => setReferralInput(e.target.value)}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      fullWidth
                    />
                    <LoadingButton
                      variant="contained"
                      onClick={handleApplyReferral}
                      loading={applyingReferral}
                      disabled={applyingReferral || !referralInput.trim()}
                    >
                      Aplicar
                    </LoadingButton>
                  </Box>
                </>
              )}

              {enterprise?.referredByCode && (
                <Alert severity="success">
                  Ya aplicaste el código {enterprise.referredByCode}.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog
        open={receiptModal}
        onClose={() => setReceiptModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Subir comprobante de pago</DialogTitle>
        <DialogContent>
          <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
            {receiptFile ? receiptFile.name : "Elegir imagen o PDF"}
            <input
              type="file"
              accept="image/*,application/pdf"
              hidden
              onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
            />
          </Button>
          <TextField
            label="Monto pagado (Bs)"
            fullWidth
            type="number"
            value={receiptAmount}
            onChange={(e) => setReceiptAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReceiptModal(false)}>Cancelar</Button>
          <LoadingButton
            onClick={handleUploadReceipt}
            variant="contained"
            disabled={uploading || !receiptFile || !receiptAmount}
            loading={uploading}
          >
            Enviar comprobante
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
