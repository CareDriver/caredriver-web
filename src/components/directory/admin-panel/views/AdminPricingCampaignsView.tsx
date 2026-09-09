"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  SelectChangeEvent,
} from "@mui/material";
import { useAdminPanel } from "../AdminPanelContext";
import {
  fetchPlatformPricing,
  fetchPlatformPayment,
  updatePricingSettings,
  updatePlatformPaymentSettings,
  saveDiscountCampaign,
  countSubscriptionsWithCampaign,
} from "@/utils/requesters/AdminRequester";
import { DiscountCampaign } from "@/interfaces/Directory";
import LoadingButton from "@/components/directory/business-panel/LoadingButton";

export default function AdminPricingCampaignsView() {
  const { discountCampaigns } = useAdminPanel();
  const [pricing, setPricing] = useState<any>({});
  const [payment, setPayment] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [campaignCounts, setCampaignCounts] = useState<Record<string, number>>(
    {},
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] =
    useState<Partial<DiscountCampaign> | null>(null);

  useEffect(() => {
    fetchPlatformPricing().then((p) => p && setPricing(p));
    fetchPlatformPayment().then((p) => p && setPayment(p));
  }, []);

  useEffect(() => {
    const counts: Record<string, number> = {};
    discountCampaigns.forEach(async (c) => {
      counts[c.id || ""] = await countSubscriptionsWithCampaign(c.id || "");
      setCampaignCounts({ ...counts });
    });
  }, [discountCampaigns]);

  const handleSavePricing = async () => {
    setLoading(true);
    await updatePricingSettings({
      verifiedBasePrice: Number(pricing.verifiedBasePrice),
      featuredBasePrice: Number(pricing.featuredBasePrice),
      verifiedTag: pricing.verifiedTag,
      featuredTag: pricing.featuredTag,
    });
    setLoading(false);
  };

  const handleSavePayment = async () => {
    setLoading(true);
    await updatePlatformPaymentSettings({
      qrCodeImageUrl: payment.qrCodeImageUrl,
      paymentInstructions: payment.paymentInstructions,
    });
    setLoading(false);
  };

  const handleSaveCampaign = async () => {
    if (!editingCampaign) return;
    setLoading(true);
    await saveDiscountCampaign(editingCampaign);
    setLoading(false);
    setDialogOpen(false);
    setEditingCampaign(null);
  };

  const openNewCampaign = () => {
    setEditingCampaign({
      name: "",
      appliesToPlans: ["verified"],
      discountType: "percent",
      discountValue: 0,
      durationCycles: 1,
      active: true,
    });
    setDialogOpen(true);
  };

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: "primary.main", mb: 3 }}
      >
        Precios, pago y campañas
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Precios base
              </Typography>
              <TextField
                label="Verificado (Bs)"
                type="number"
                fullWidth
                sx={{ mb: 2 }}
                value={pricing.verifiedBasePrice ?? ""}
                onChange={(e) =>
                  setPricing({ ...pricing, verifiedBasePrice: e.target.value })
                }
              />
              <TextField
                label="Tag Verificado (opcional)"
                fullWidth
                sx={{ mb: 2 }}
                value={pricing.verifiedTag || ""}
                onChange={(e) =>
                  setPricing({ ...pricing, verifiedTag: e.target.value })
                }
              />
              <TextField
                label="Destacado (Bs)"
                type="number"
                fullWidth
                sx={{ mb: 2 }}
                value={pricing.featuredBasePrice ?? ""}
                onChange={(e) =>
                  setPricing({ ...pricing, featuredBasePrice: e.target.value })
                }
              />
              <TextField
                label="Tag Destacado (opcional)"
                fullWidth
                sx={{ mb: 2 }}
                value={pricing.featuredTag || ""}
                onChange={(e) =>
                  setPricing({ ...pricing, featuredTag: e.target.value })
                }
              />
              <LoadingButton
                onClick={handleSavePricing}
                loading={loading}
                variant="contained"
              >
                Guardar precios
              </LoadingButton>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Método de pago
              </Typography>
              <TextField
                label="URL imagen QR"
                fullWidth
                sx={{ mb: 2 }}
                value={payment.qrCodeImageUrl || ""}
                onChange={(e) =>
                  setPayment({ ...payment, qrCodeImageUrl: e.target.value })
                }
              />
              {payment.qrCodeImageUrl && (
                <Box sx={{ mb: 2 }}>
                  <img
                    src={payment.qrCodeImageUrl}
                    alt="QR preview"
                    style={{
                      width: "100%",
                      maxHeight: 240,
                      objectFit: "contain",
                    }}
                  />
                </Box>
              )}
              <TextField
                label="Instrucciones de pago"
                fullWidth
                multiline
                rows={3}
                sx={{ mb: 2 }}
                value={payment.paymentInstructions || ""}
                onChange={(e) =>
                  setPayment({
                    ...payment,
                    paymentInstructions: e.target.value,
                  })
                }
              />
              <LoadingButton
                onClick={handleSavePayment}
                loading={loading}
                variant="contained"
              >
                Guardar método de pago
              </LoadingButton>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Campañas de descuento
            </Typography>
            <Button variant="contained" onClick={openNewCampaign}>
              + Nueva campaña
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Planes</TableCell>
                  <TableCell>Descuento</TableCell>
                  <TableCell>Duración</TableCell>
                  <TableCell>Asignada a</TableCell>
                  <TableCell>Activa</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {discountCampaigns.map((campaign) => (
                  <TableRow key={campaign.id} hover>
                    <TableCell>{campaign.name}</TableCell>
                    <TableCell>
                      {(campaign.appliesToPlans || []).map((p) => (
                        <Chip key={p} size="small" label={p} sx={{ mr: 0.5 }} />
                      ))}
                    </TableCell>
                    <TableCell>
                      {campaign.discountType === "percent"
                        ? `${campaign.discountValue}%`
                        : `Bs ${campaign.discountValue}`}
                    </TableCell>
                    <TableCell>{campaign.durationCycles} pagos</TableCell>
                    <TableCell>
                      {campaignCounts[campaign.id || ""] ?? 0} negocios
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={campaign.active}
                        onChange={async () => {
                          await saveDiscountCampaign({
                            ...campaign,
                            active: !campaign.active,
                          });
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        onClick={() => {
                          setEditingCampaign(campaign);
                          setDialogOpen(true);
                        }}
                      >
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingCampaign?.id ? "Editar campaña" : "Nueva campaña"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre interno"
            fullWidth
            sx={{ my: 1 }}
            value={editingCampaign?.name || ""}
            onChange={(e) =>
              setEditingCampaign({ ...editingCampaign, name: e.target.value })
            }
          />
          <FormControl fullWidth sx={{ my: 1 }}>
            <InputLabel>Aplica a planes</InputLabel>
            <Select
              multiple
              value={editingCampaign?.appliesToPlans || []}
              onChange={(e: SelectChangeEvent<string[]>) =>
                setEditingCampaign({
                  ...editingCampaign,
                  appliesToPlans: e.target.value as ["verified" | "featured"],
                })
              }
            >
              <MenuItem value="verified">Verificado</MenuItem>
              <MenuItem value="featured">Destacado</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ my: 1 }}>
            <InputLabel>Tipo de descuento</InputLabel>
            <Select
              value={editingCampaign?.discountType || "percent"}
              onChange={(e: SelectChangeEvent) =>
                setEditingCampaign({
                  ...editingCampaign,
                  discountType: e.target.value as "percent" | "fixed_amount",
                })
              }
            >
              <MenuItem value="percent">Porcentaje</MenuItem>
              <MenuItem value="fixed_amount">Monto fijo</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Valor"
            type="number"
            fullWidth
            sx={{ my: 1 }}
            value={editingCampaign?.discountValue ?? 0}
            onChange={(e) =>
              setEditingCampaign({
                ...editingCampaign,
                discountValue: Number(e.target.value),
              })
            }
          />
          <TextField
            label="Cantidad de pagos consecutivos"
            type="number"
            fullWidth
            sx={{ my: 1 }}
            value={editingCampaign?.durationCycles ?? 1}
            onChange={(e) =>
              setEditingCampaign({
                ...editingCampaign,
                durationCycles: Number(e.target.value),
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <LoadingButton
            onClick={handleSaveCampaign}
            loading={loading}
            variant="contained"
          >
            Guardar
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
