"use client";

import React, { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import {
  DEFAULT_HOURS,
  CATEGORIES,
  TAGS,
  CATEGORY_LABELS,
  TAG_LABELS,
  DAY_LABELS,
  BOLIVIAN_CITIES,
  CATEGORY_SUB_SERVICES,
  PlanTier,
  DayKey,
  DAY_KEYS,
} from "@/constants/directory";
import { uploadFileBlod } from "@/utils/requesters/FileUploader";
import {
  submitDirectoryEnterpriseRequest,
  notifyAdminNewRequest,
} from "@/utils/requesters/DirectoryRequester";
import MapPicker from "./MapPicker";
import PlanSelector from "./PlanSelector";
import BusinessPreviewCard from "./BusinessPreviewCard";
import LoadingButton from "@/components/directory/business-panel/LoadingButton";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function BusinessRegistrationForm() {
  const searchParams = useSearchParams();
  const chainId = searchParams.get("chainId");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [city, setCity] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [subServices, setSubServices] = useState<
    Array<{ id: string; categoryId: string; label: string; active: boolean }>
  >([]);
  const [tags, setTags] = useState<string[]>([]);
  const [hours, setHours] = useState(DEFAULT_HOURS);
  const [latitude, setLatitude] = useState(-17.7833);
  const [longitude, setLongitude] = useState(-63.1821);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [carouselFiles, setCarouselFiles] = useState<File[]>([]);
  const [carouselPreviews, setCarouselPreviews] = useState<string[]>([]);
  const [plan, setPlan] = useState<PlanTier>("free");
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [newSubServiceCategory, setNewSubServiceCategory] =
    useState<string>("");
  const [newSubServiceLabel, setNewSubServiceLabel] = useState("");

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleCarouselChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      setCarouselFiles((prev) => [...prev, ...files].slice(0, 6));
      setCarouselPreviews((prev) =>
        [...prev, ...files.map((f) => URL.createObjectURL(f))].slice(0, 6),
      );
    }
  };

  const handleCategoriesChange = (e: SelectChangeEvent<string[]>) => {
    const value = e.target.value as string[];
    setCategories(value);
    setSubServices((prev) => prev.filter((s) => value.includes(s.categoryId)));
  };

  const toggleSubService = (categoryId: string, label: string) => {
    setSubServices((prev) => {
      const exists = prev.find(
        (s) => s.categoryId === categoryId && s.label === label,
      );
      if (exists) {
        return prev.filter(
          (s) => !(s.categoryId === categoryId && s.label === label),
        );
      }
      return [
        ...prev,
        { id: `${categoryId}-${label}`, categoryId, label, active: true },
      ];
    });
  };

  const addCustomSubService = () => {
    if (!newSubServiceCategory || !newSubServiceLabel.trim()) return;
    setSubServices((prev) => [
      ...prev,
      {
        id: `${newSubServiceCategory}-${newSubServiceLabel.trim()}`,
        categoryId: newSubServiceCategory,
        label: newSubServiceLabel.trim(),
        active: true,
      },
    ]);
    setNewSubServiceLabel("");
  };

  const updateHour = (
    day: DayKey,
    field: "open" | "close" | "closed",
    value: string | boolean,
  ) => {
    setHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleSubmit = async () => {
    if (!name || !city || !whatsapp || !logoFile) return;
    setLoading(true);

    const logoAttachment = await uploadFileBlod(
      `directory/requests/logos/${Date.now()}_`,
      logoFile,
    );
    const carouselUrls: string[] = [];
    for (const file of carouselFiles) {
      const att = await uploadFileBlod(
        `directory/requests/carousel/${Date.now()}_`,
        file,
      );
      carouselUrls.push(att.url);
    }

    const body = {
      type: "mechanical",
      name,
      logoImgUrl: logoAttachment,
      coordinates: { lat: latitude, lng: longitude },
      latitude,
      longitude,
      phone,
      phoneCountryCode: "+591",
      description,
      city,
      directoryCategories: categories,
      subServices,
      carouselPhotoUrls: carouselUrls,
      tags,
      whatsapp,
      requestedPlan: plan,
      chainId: chainId || undefined,
      referralCodeUsed: referralCode || undefined,
    };

    const result = await submitDirectoryEnterpriseRequest(body);
    if (result) {
      notifyAdminNewRequest(name, city);
      setSubmitted(true);
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", textAlign: "center", py: 8 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: "primary.main", mb: 2 }}
        >
          Solicitud enviada
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Tu solicitud está en revisión. Te avisaremos cuando sea aprobada.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Si elegiste un plan pago, vas a poder subir el comprobante desde tu
          panel de negocio una vez aprobada la solicitud.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={7}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: "primary.main", mb: 3 }}
        >
          {chainId ? "Agregar sucursal" : "Registrá tu negocio"}
        </Typography>

        <Section title="Datos básicos">
          <TextField
            label="Nombre del negocio"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Descripción"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Teléfono"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="WhatsApp"
            fullWidth
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            required
          />
        </Section>

        <Section title="Rubro y sub-servicios">
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Rubros</InputLabel>
            <Select
              multiple
              value={categories}
              onChange={handleCategoriesChange}
              input={<OutlinedInput label="Rubros" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={
                        CATEGORY_LABELS[
                          value as keyof typeof CATEGORY_LABELS
                        ] || value
                      }
                    />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  <Checkbox checked={categories.indexOf(cat) > -1} />
                  <ListItemText primary={CATEGORY_LABELS[cat]} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {categories.map((cat) => (
            <Box key={cat} sx={{ mb: 2 }}>
              <Typography variant="subtitle2">
                {CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]}
              </Typography>
              <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                {(
                  CATEGORY_SUB_SERVICES[
                    cat as keyof typeof CATEGORY_SUB_SERVICES
                  ] || []
                ).map((label) => {
                  const active = subServices.some(
                    (s) => s.categoryId === cat && s.label === label,
                  );
                  return (
                    <Chip
                      key={label}
                      label={label}
                      clickable
                      color={active ? "primary" : "default"}
                      variant={active ? "filled" : "outlined"}
                      onClick={() => toggleSubService(cat, label)}
                    />
                  );
                })}
              </Box>
            </Box>
          ))}

          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Rubro</InputLabel>
              <Select
                value={newSubServiceCategory}
                onChange={(e) => setNewSubServiceCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Otro sub-servicio"
              size="small"
              value={newSubServiceLabel}
              onChange={(e) => setNewSubServiceLabel(e.target.value)}
            />
            <Button variant="outlined" onClick={addCustomSubService}>
              Agregar
            </Button>
          </Box>
        </Section>

        <Section title="Tags">
          <FormControl fullWidth>
            <InputLabel>Tags</InputLabel>
            <Select
              multiple
              value={tags}
              onChange={(e) => setTags(e.target.value as string[])}
              input={<OutlinedInput label="Tags" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={
                        TAG_LABELS[value as keyof typeof TAG_LABELS] || value
                      }
                    />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {TAGS.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  <Checkbox checked={tags.indexOf(tag) > -1} />
                  <ListItemText primary={TAG_LABELS[tag]} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Section>

        <Section title="Ciudad y ubicación">
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Ciudad</InputLabel>
            <Select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            >
              {BOLIVIAN_CITIES.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <MapPicker
            latitude={latitude}
            longitude={longitude}
            onChange={(lat, lng) => {
              setLatitude(lat);
              setLongitude(lng);
            }}
          />
        </Section>

        <Section title="Fotos">
          <Typography variant="body2" sx={{ mb: 1 }}>
            Logo del negocio
          </Typography>
          <Button variant="outlined" component="label" sx={{ mb: 2 }}>
            Subir logo
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleLogoChange}
            />
          </Button>
          {logoPreview && (
            <Box
              component="img"
              src={logoPreview}
              sx={{
                width: 120,
                height: 120,
                objectFit: "cover",
                borderRadius: 2,
                ml: 2,
              }}
            />
          )}

          <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
            Fotos del local (máx. 6)
          </Typography>
          <Button
            variant="outlined"
            component="label"
            disabled={carouselFiles.length >= 6}
          >
            Agregar fotos
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleCarouselChange}
            />
          </Button>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
            {carouselPreviews.map((url, idx) => (
              <Box
                key={idx}
                component="img"
                src={url}
                sx={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 1,
                }}
              />
            ))}
          </Box>
        </Section>

        <Section title="Horarios">
          {DAY_KEYS.map((day) => (
            <Box
              key={day}
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
            >
              <Typography sx={{ minWidth: 90 }}>{DAY_LABELS[day]}</Typography>
              <TextField
                type="time"
                size="small"
                value={hours[day].open}
                onChange={(e) => updateHour(day, "open", e.target.value)}
                disabled={hours[day].closed}
              />
              <TextField
                type="time"
                size="small"
                value={hours[day].close}
                onChange={(e) => updateHour(day, "close", e.target.value)}
                disabled={hours[day].closed}
              />
              <FormControlLabelWrapper
                checked={hours[day].closed}
                onChange={(v) => updateHour(day, "closed", v)}
                label="Cerrado"
              />
            </Box>
          ))}
        </Section>

        <Section title="Plan">
          <PlanSelector value={plan} onChange={setPlan} />
        </Section>

        <Section title="Código de referido (opcional)">
          <TextField
            fullWidth
            placeholder="Si alguien te lo pasó, cargalo acá."
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
          />
        </Section>

        <LoadingButton
          variant="contained"
          size="large"
          fullWidth
          onClick={handleSubmit}
          loading={loading}
          disabled={!name || !city || !whatsapp || !logoFile}
          sx={{ mt: 2 }}
        >
          Enviar solicitud
        </LoadingButton>
      </Grid>

      <Grid item xs={12} md={5}>
        <BusinessPreviewCard
          name={name}
          description={description}
          logoUrl={logoPreview}
          categories={categories}
          tags={tags}
          subServices={subServices}
          city={city}
          whatsapp={whatsapp}
          phone={phone}
          hours={hours}
          carouselUrls={carouselPreviews}
          plan={plan}
        />
      </Grid>
    </Grid>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        mb: 4,
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function FormControlLabelWrapper({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
      <Checkbox
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <Typography variant="body2">{label}</Typography>
    </Box>
  );
}
