"use client";

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
} from "@mui/material";
import {
  CATEGORY_LABELS,
  TAG_LABELS,
  PLAN_LABELS,
  DAY_LABELS,
  DayKey,
} from "@/constants/directory";

interface BusinessPreviewCardProps {
  name: string;
  description: string;
  logoUrl?: string;
  categories: string[];
  tags: string[];
  subServices: Array<{ categoryId: string; label: string }>;
  city: string;
  whatsapp: string;
  phone: string;
  hours: Record<string, { open: string; close: string; closed: boolean }>;
  carouselUrls: string[];
  plan: string;
}

export default function BusinessPreviewCard({
  name,
  description,
  logoUrl,
  categories,
  tags,
  subServices,
  city,
  whatsapp,
  phone,
  hours,
  carouselUrls,
  plan,
}: BusinessPreviewCardProps) {
  return (
    <Card sx={{ position: "sticky", top: 24 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar
            src={logoUrl}
            sx={{ width: 64, height: 64, bgcolor: "primary.main" }}
          >
            {name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {name || "Nombre del negocio"}
            </Typography>
            <Chip
              size="small"
              label={PLAN_LABELS[plan as keyof typeof PLAN_LABELS] || plan}
              color="secondary"
            />
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description || "Descripción..."}
        </Typography>

        <Typography variant="subtitle2">Rubros</Typography>
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 2 }}>
          {categories.map((c) => (
            <Chip
              key={c}
              size="small"
              label={CATEGORY_LABELS[c as keyof typeof CATEGORY_LABELS] || c}
            />
          ))}
        </Box>

        <Typography variant="subtitle2">Sub-servicios</Typography>
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 2 }}>
          {subServices.map((s, idx) => (
            <Chip key={idx} size="small" variant="outlined" label={s.label} />
          ))}
        </Box>

        <Typography variant="subtitle2">Tags</Typography>
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 2 }}>
          {tags.map((t) => (
            <Chip
              key={t}
              size="small"
              color="primary"
              label={TAG_LABELS[t as keyof typeof TAG_LABELS] || t}
            />
          ))}
        </Box>

        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Ciudad:</strong> {city || "—"}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>WhatsApp:</strong> {whatsapp || "—"}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          <strong>Teléfono:</strong> {phone || "—"}
        </Typography>

        <Typography variant="subtitle2">Horarios</Typography>
        {Object.entries(hours).map(([day, info]) => (
          <Typography key={day} variant="body2">
            {DAY_LABELS[day as DayKey]}:{" "}
            {info.closed ? "Cerrado" : `${info.open} - ${info.close}`}
          </Typography>
        ))}

        {carouselUrls.length > 0 && (
          <Box sx={{ display: "flex", gap: 1, overflowX: "auto", mt: 2 }}>
            {carouselUrls.map((url, idx) => (
              <Avatar
                key={idx}
                src={url}
                variant="rounded"
                sx={{ width: 80, height: 80, flexShrink: 0 }}
              />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
