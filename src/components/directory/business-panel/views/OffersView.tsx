"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useBusinessPanel } from "../BusinessPanelContext";
import {
  createOffer,
  updateOffer,
} from "@/utils/requesters/DirectoryRequester";
import { OFFER_LIMITS, MAX_OFFER_DURATION_DAYS } from "@/constants/directory";
import { Offer } from "@/interfaces/Directory";
import LoadingButton from "../LoadingButton";

export default function OffersView() {
  const { enterprise, offers, myRole } = useBusinessPanel();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discountValue, setDiscountValue] = useState("");

  const plan = enterprise?.plan || "free";
  const canManage = myRole === "admin" || myRole === "marketing";
  const limit = OFFER_LIMITS[plan];
  const activeOffers = offers.filter(
    (o) => o.active && o.endsAt?.toDate?.() > new Date(),
  );
  const atLimit = activeOffers.length >= limit;

  const handleCreate = async () => {
    if (!enterprise) return;
    setLoading(true);
    const now = new Date();
    const end = new Date();
    end.setDate(end.getDate() + MAX_OFFER_DURATION_DAYS);
    await createOffer({
      enterpriseId: enterprise.id || "",
      title: title.trim(),
      description: description.trim(),
      discountValue: Number(discountValue) || 0,
      startsAt: now.toISOString(),
      endsAt: end.toISOString(),
    });
    setLoading(false);
    setModalOpen(false);
    setTitle("");
    setDescription("");
    setDiscountValue("");
  };

  const toggleOffer = async (offer: Offer) => {
    if (!enterprise) return;
    await updateOffer({
      offerId: offer.id || "",
      enterpriseId: enterprise.id || "",
      active: !offer.active,
    });
  };

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
          Ofertas y códigos
        </Typography>
        {canManage && limit > 0 && (
          <Button
            variant="contained"
            onClick={() => setModalOpen(true)}
            disabled={atLimit}
          >
            Nueva oferta
          </Button>
        )}
      </Box>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Activas: {activeOffers.length} / {limit === 0 ? "—" : limit}
      </Typography>

      {plan === "free" && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Tu plan Gratuito no permite crear ofertas. Actualizá a Verificado o
          Destacado.
        </Alert>
      )}

      <Grid container spacing={3}>
        {offers.map((offer) => {
          const isActive =
            offer.active && offer.endsAt?.toDate?.() > new Date();
          return (
            <Grid item xs={12} md={6} key={offer.id}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {offer.title}
                    </Typography>
                    <Chip
                      size="small"
                      label={isActive ? "Activa" : "Pausada"}
                      color={isActive ? "success" : "default"}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {offer.description || "Sin descripción"}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Descuento: <strong>{offer.discountValue}%</strong> • Vistas:{" "}
                    {offer.views || 0} • Canjes: {offer.redemptions || 0}
                  </Typography>
                  {canManage && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => toggleOffer(offer)}
                    >
                      {isActive ? "Pausar" : "Reactivar"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {offers.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: "center", py: 6 }}>
          No tenés ofertas creadas.
        </Typography>
      )}

      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Nueva oferta</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Título"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Descripción (opcional)"
            fullWidth
            multiline
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            margin="dense"
            label="% de descuento"
            fullWidth
            type="number"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
          />
          <Typography variant="caption" color="text.secondary">
            Duración máxima: {MAX_OFFER_DURATION_DAYS} días desde hoy.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
          <LoadingButton
            onClick={handleCreate}
            variant="contained"
            disabled={loading || !title.trim()}
            loading={loading}
          >
            Crear
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
