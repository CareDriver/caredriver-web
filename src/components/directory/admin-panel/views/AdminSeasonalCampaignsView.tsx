"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
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
  TextField,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useAdminPanel } from "../AdminPanelContext";
import { saveSeasonalCampaign } from "@/utils/requesters/AdminRequester";
import { SeasonalCampaign } from "@/interfaces/Directory";
import { CATEGORIES, CATEGORY_LABELS, CategoryId } from "@/constants/directory";
import LoadingButton from "@/components/directory/business-panel/LoadingButton";
import { Timestamp } from "firebase/firestore";

function toDateInputValue(
  value: Timestamp | string | undefined | null,
): string {
  if (!value) return "";
  if (typeof value === "string") {
    try {
      return new Date(value).toISOString().slice(0, 16);
    } catch {
      return "";
    }
  }
  const date = value.toDate
    ? value.toDate()
    : new Date(value as unknown as number);
  return date.toISOString().slice(0, 16);
}

export default function AdminSeasonalCampaignsView() {
  const { seasonalCampaigns } = useAdminPanel();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<SeasonalCampaign> | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  const openNew = () => {
    setEditing({
      name: "",
      bannerText: "",
      categoryIds: [],
      active: true,
      startsAt: new Date().toISOString(),
      endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    setLoading(true);
    await saveSeasonalCampaign(editing);
    setLoading(false);
    setDialogOpen(false);
    setEditing(null);
  };

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: "primary.main", mb: 3 }}
      >
        Campañas estacionales
      </Typography>

      <Card>
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
              Campañas activas
            </Typography>
            <Button variant="contained" onClick={openNew}>
              + Nueva campaña
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Banner</TableCell>
                  <TableCell>Rubros</TableCell>
                  <TableCell>Inicio</TableCell>
                  <TableCell>Fin</TableCell>
                  <TableCell>Activa</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {seasonalCampaigns.map((campaign) => (
                  <TableRow key={campaign.id} hover>
                    <TableCell>{campaign.name}</TableCell>
                    <TableCell>{campaign.bannerText}</TableCell>
                    <TableCell>
                      {(campaign.categoryIds || [])
                        .slice(0, 3)
                        .map(
                          (c) =>
                            CATEGORY_LABELS[
                              c as keyof typeof CATEGORY_LABELS
                            ] || c,
                        )
                        .join(", ")}
                    </TableCell>
                    <TableCell>
                      {campaign.startsAt
                        ? new Date(
                            (campaign.startsAt as any).toDate?.() ||
                              campaign.startsAt,
                          ).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {campaign.endsAt
                        ? new Date(
                            (campaign.endsAt as any).toDate?.() ||
                              campaign.endsAt,
                          ).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={campaign.active}
                        onChange={async () => {
                          await saveSeasonalCampaign({
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
                          setEditing(campaign);
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
          {editing?.id ? "Editar campaña" : "Nueva campaña"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre interno"
            fullWidth
            sx={{ my: 1 }}
            value={editing?.name || ""}
            onChange={(e) => setEditing({ ...editing, name: e.target.value })}
          />
          <TextField
            label="Texto del banner"
            fullWidth
            sx={{ my: 1 }}
            value={editing?.bannerText || ""}
            onChange={(e) =>
              setEditing({ ...editing, bannerText: e.target.value })
            }
          />
          <FormControl fullWidth sx={{ my: 1 }}>
            <InputLabel>Rubros</InputLabel>
            <Select
              multiple
              value={editing?.categoryIds || []}
              onChange={(e: SelectChangeEvent<string[]>) =>
                setEditing({
                  ...editing,
                  categoryIds: e.target.value as string[],
                })
              }
            >
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {CATEGORY_LABELS[cat as CategoryId]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Inicio"
            type="datetime-local"
            fullWidth
            sx={{ my: 1 }}
            value={toDateInputValue(editing?.startsAt)}
            onChange={(e) =>
              setEditing({ ...editing, startsAt: e.target.value })
            }
          />
          <TextField
            label="Fin"
            type="datetime-local"
            fullWidth
            sx={{ my: 1 }}
            value={toDateInputValue(editing?.endsAt)}
            onChange={(e) => setEditing({ ...editing, endsAt: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <LoadingButton
            onClick={handleSave}
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
