"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  TextField,
  Grid,
  Avatar,
  IconButton,
  Divider,
  Alert,
  FormControlLabel,
  Switch,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { GeoPoint } from "firebase/firestore";
import { useBusinessPanel } from "../BusinessPanelContext";
import MapLocationSetter from "@/components/form/view/maps/MapLocationSetter";
import { updateEnterpriseProfile } from "@/utils/requesters/DirectoryRequester";
import { uploadFileBlod } from "@/utils/requesters/FileUploader";
import {
  CATEGORY_LABELS,
  TAG_LABELS,
  TAGS,
  CATEGORIES,
  DEFAULT_HOURS,
  DayKey,
  DAY_LABELS,
  CategoryId,
} from "@/constants/directory";
import { DirectorySubService, Enterprise } from "@/interfaces/Enterprise";
import LoadingButton from "../LoadingButton";

export default function ProfileView() {
  const { enterprise, myRole } = useBusinessPanel();
  const [draft, setDraft] = useState<Partial<Enterprise>>(enterprise || {});
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCarousel, setUploadingCarousel] = useState(false);
  const [newSubService, setNewSubService] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<
    CategoryId | ""
  >("");
  const logoInputRef = useRef<HTMLInputElement>(null);
  const carouselInputRef = useRef<HTMLInputElement>(null);

  const canEdit = myRole === "admin" || myRole === "marketing";

  useEffect(() => {
    if (enterprise) setDraft(enterprise);
  }, [enterprise?.id]);

  const handleSave = async () => {
    if (!enterprise?.id) return;
    setSaving(true);
    await updateEnterpriseProfile(enterprise.id, {
      name: draft.name,
      description: draft.description,
      whatsapp: draft.whatsapp,
      phone: draft.phone,
      directoryCategories: draft.directoryCategories,
      tags: draft.tags,
      hours: draft.hours,
      subServices: draft.subServices,
    });
    setSaving(false);
  };

  const uploadLogo = async (file: File) => {
    if (!enterprise?.id) return;
    setUploadingLogo(true);
    const uploaded = await uploadFileBlod(
      `enterprises/${enterprise.id}/logo_`,
      file,
    );
    await updateEnterpriseProfile(enterprise.id, { logoImgUrl: uploaded });
    setUploadingLogo(false);
  };

  const uploadCarousel = async (file: File) => {
    if (!enterprise?.id) return;
    const current = (draft.carouselPhotoUrls || []) as string[];
    if (current.length >= 6) return;
    setUploadingCarousel(true);
    const uploaded = await uploadFileBlod(
      `enterprises/${enterprise.id}/carousel_`,
      file,
    );
    await updateEnterpriseProfile(enterprise.id, {
      carouselPhotoUrls: [...current, uploaded.url],
    });
    setUploadingCarousel(false);
  };

  const removeCarousel = async (idx: number) => {
    if (!enterprise?.id) return;
    const current = [...((draft.carouselPhotoUrls || []) as string[])];
    current.splice(idx, 1);
    await updateEnterpriseProfile(enterprise.id, {
      carouselPhotoUrls: current,
    });
  };

  const toggleCategory = (cat: CategoryId) => {
    if (!canEdit) return;
    const current = (draft.directoryCategories || []) as CategoryId[];
    const next = current.includes(cat)
      ? current.filter((c) => c !== cat)
      : [...current, cat];
    setDraft((d) => ({ ...d, directoryCategories: next }));
  };

  const toggleTag = (tag: string) => {
    if (!canEdit) return;
    const current = (draft.tags || []) as string[];
    const next = current.includes(tag)
      ? current.filter((t) => t !== tag)
      : [...current, tag];
    setDraft((d) => ({ ...d, tags: next }));
  };

  const updateHour = (
    day: DayKey,
    patch: Partial<{ open: string; close: string; closed: boolean }>,
  ) => {
    if (!canEdit) return;
    const hours = {
      ...((draft.hours as Record<
        DayKey,
        { open: string; close: string; closed: boolean }
      >) || DEFAULT_HOURS),
    };
    hours[day] = { ...hours[day], ...patch };
    setDraft((d) => ({ ...d, hours }));
  };

  const addSubService = () => {
    if (!selectedSubCategory || !newSubService.trim()) return;
    const current = (draft.subServices || []) as DirectorySubService[];
    const item: DirectorySubService = {
      id: `${Date.now()}`,
      categoryId: selectedSubCategory,
      label: newSubService.trim(),
      active: true,
    };
    setDraft((d) => ({ ...d, subServices: [...current, item] }));
    setNewSubService("");
  };

  const toggleSubService = (id: string) => {
    const current = (draft.subServices || []) as DirectorySubService[];
    setDraft((d) => ({
      ...d,
      subServices: current.map((s) =>
        s.id === id ? { ...s, active: !s.active } : s,
      ),
    }));
  };

  const removeSubService = (id: string) => {
    const current = (draft.subServices || []) as DirectorySubService[];
    setDraft((d) => ({
      ...d,
      subServices: current.filter((s) => s.id !== id),
    }));
  };

  const setLocation = (g: GeoPoint) => {
    setDraft((d) => ({
      ...d,
      coordinates: g,
      latitude: g.latitude,
      longitude: g.longitude,
    }));
  };

  const hours =
    (draft.hours as Record<
      DayKey,
      { open: string; close: string; closed: boolean }
    >) || DEFAULT_HOURS;
  const categories = (draft.directoryCategories || []) as CategoryId[];

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: "primary.main", mb: 3 }}
      >
        Ficha del negocio
      </Typography>

      {!canEdit && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Solo los dueños y el rol Marketing pueden editar la ficha.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Fotos
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Avatar
                  src={enterprise?.logoImgUrl?.url}
                  sx={{
                    width: 120,
                    height: 120,
                    mb: 1,
                    bgcolor: "primary.main",
                  }}
                >
                  {enterprise?.name?.charAt(0)}
                </Avatar>
                {canEdit && (
                  <>
                    <LoadingButton
                      size="small"
                      onClick={() => logoInputRef.current?.click()}
                      loading={uploadingLogo}
                    >
                      Cambiar logo
                    </LoadingButton>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) =>
                        e.target.files?.[0] && uploadLogo(e.target.files[0])
                      }
                    />
                  </>
                )}
              </Box>

              <Typography variant="body2" sx={{ mb: 1 }}>
                Carrusel (hasta 6)
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
                {((draft.carouselPhotoUrls || []) as string[]).map(
                  (url, idx) => (
                    <Box key={idx} sx={{ position: "relative" }}>
                      <Avatar
                        src={url}
                        variant="rounded"
                        sx={{ width: 100, height: 100 }}
                      />
                      {canEdit && (
                        <IconButton
                          size="small"
                          sx={{
                            position: "absolute",
                            top: -8,
                            right: -8,
                            bgcolor: "background.paper",
                          }}
                          onClick={() => removeCarousel(idx)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  ),
                )}
                {canEdit &&
                  ((draft.carouselPhotoUrls || []) as string[]).length < 6 && (
                    <>
                      <LoadingButton
                        variant="outlined"
                        sx={{ width: 100, height: 100 }}
                        onClick={() => carouselInputRef.current?.click()}
                        loading={uploadingCarousel}
                      >
                        <AddPhotoAlternateIcon />
                      </LoadingButton>
                      <input
                        ref={carouselInputRef}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) =>
                          e.target.files?.[0] &&
                          uploadCarousel(e.target.files[0])
                        }
                      />
                    </>
                  )}
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Datos básicos
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Nombre"
                    fullWidth
                    value={draft.name || ""}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, name: e.target.value }))
                    }
                    disabled={!canEdit}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Descripción"
                    fullWidth
                    multiline
                    rows={3}
                    value={draft.description || ""}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, description: e.target.value }))
                    }
                    disabled={!canEdit}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="WhatsApp"
                    fullWidth
                    value={draft.whatsapp || ""}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, whatsapp: e.target.value }))
                    }
                    disabled={!canEdit}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Teléfono"
                    fullWidth
                    value={draft.phone || ""}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, phone: e.target.value }))
                    }
                    disabled={!canEdit}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Ubicación
              </Typography>
              <Box
                sx={{ height: 300, borderRadius: 2, overflow: "hidden", mb: 2 }}
              >
                <MapLocationSetter
                  location={draft.coordinates as GeoPoint | undefined}
                  setLocation={setLocation}
                />
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Rubros
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {CATEGORIES.map((cat) => {
                  const selected = categories.includes(cat);
                  return (
                    <Chip
                      key={cat}
                      label={CATEGORY_LABELS[cat]}
                      onClick={() => toggleCategory(cat)}
                      disabled={!canEdit}
                      color={selected ? "primary" : "default"}
                      variant={selected ? "filled" : "outlined"}
                    />
                  );
                })}
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Sub-servicios por rubro
              </Typography>
              {categories.length === 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Seleccioná al menos un rubro para cargar sub-servicios.
                </Alert>
              )}
              {categories.map((cat) => (
                <Box key={cat} sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, mb: 1 }}
                  >
                    {CATEGORY_LABELS[cat]}
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}
                  >
                    {((draft.subServices || []) as DirectorySubService[])
                      .filter((s) => s.categoryId === cat)
                      .map((s) => (
                        <Chip
                          key={s.id}
                          label={s.label}
                          onDelete={
                            canEdit ? () => removeSubService(s.id) : undefined
                          }
                          onClick={
                            canEdit ? () => toggleSubService(s.id) : undefined
                          }
                          color={s.active ? "secondary" : "default"}
                          variant={s.active ? "filled" : "outlined"}
                        />
                      ))}
                  </Box>
                  {canEdit && (
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <TextField
                        size="small"
                        placeholder={`Ej. Cambio de pastillas (${CATEGORY_LABELS[cat]})`}
                        value={selectedSubCategory === cat ? newSubService : ""}
                        onChange={(e) => {
                          setSelectedSubCategory(cat);
                          setNewSubService(e.target.value);
                        }}
                        onKeyDown={(e) => e.key === "Enter" && addSubService()}
                        fullWidth
                      />
                      <Button variant="contained" onClick={addSubService}>
                        Agregar
                      </Button>
                    </Box>
                  )}
                </Box>
              ))}
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Características
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {TAGS.map((tag) => {
                  const selected = ((draft.tags || []) as string[]).includes(
                    tag,
                  );
                  return (
                    <Chip
                      key={tag}
                      label={TAG_LABELS[tag]}
                      onClick={() => toggleTag(tag)}
                      disabled={!canEdit}
                      color={selected ? "primary" : "default"}
                      variant={selected ? "filled" : "outlined"}
                    />
                  );
                })}
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Horarios
              </Typography>
              <Grid container spacing={2}>
                {(Object.keys(DAY_LABELS) as DayKey[]).map((day) => (
                  <Grid item xs={12} key={day}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography sx={{ minWidth: 90, fontWeight: 600 }}>
                        {DAY_LABELS[day]}
                      </Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={!hours[day]?.closed}
                            onChange={(e) =>
                              updateHour(day, { closed: !e.target.checked })
                            }
                            disabled={!canEdit}
                          />
                        }
                        label={hours[day]?.closed ? "Cerrado" : "Abierto"}
                      />
                      {!hours[day]?.closed && (
                        <>
                          <TextField
                            size="small"
                            label="Apertura"
                            value={hours[day]?.open || ""}
                            onChange={(e) =>
                              updateHour(day, { open: e.target.value })
                            }
                            disabled={!canEdit}
                            inputProps={{ maxLength: 5 }}
                            sx={{ width: 110 }}
                          />
                          <Typography>-</Typography>
                          <TextField
                            size="small"
                            label="Cierre"
                            value={hours[day]?.close || ""}
                            onChange={(e) =>
                              updateHour(day, { close: e.target.value })
                            }
                            disabled={!canEdit}
                            inputProps={{ maxLength: 5 }}
                            sx={{ width: 110 }}
                          />
                        </>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {canEdit && (
            <LoadingButton
              variant="contained"
              size="large"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              loading={saving}
              fullWidth
            >
              Guardar cambios
            </LoadingButton>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ position: "sticky", top: 24 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Vista previa
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Avatar
                  src={enterprise?.logoImgUrl?.url}
                  sx={{ width: 64, height: 64, bgcolor: "primary.main" }}
                >
                  {draft.name?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {draft.name || "Nombre del negocio"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {categories.map((c) => CATEGORY_LABELS[c]).join(", ") ||
                      "Sin rubros"}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {draft.description || "Sin descripción"}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>WhatsApp:</strong> {draft.whatsapp || "—"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Teléfono:</strong> {draft.phone || "—"}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 2 }}>
                {((draft.tags || []) as string[]).map((tag) => (
                  <Chip
                    key={tag}
                    label={TAG_LABELS[tag as keyof typeof TAG_LABELS] || tag}
                    size="small"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
