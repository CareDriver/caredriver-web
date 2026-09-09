"use client";

import React from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

interface MapPickerProps {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
}

export default function MapPicker({
  latitude,
  longitude,
  onChange,
}: MapPickerProps) {
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          onChange(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          // ignore error
        },
      );
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Latitud"
          type="number"
          value={latitude || ""}
          onChange={(e) => onChange(Number(e.target.value), longitude)}
          size="small"
        />
        <TextField
          label="Longitud"
          type="number"
          value={longitude || ""}
          onChange={(e) => onChange(latitude, Number(e.target.value))}
          size="small"
        />
        <Button
          variant="outlined"
          onClick={handleUseCurrentLocation}
          size="small"
        >
          Mi ubicación
        </Button>
      </Box>
      <Box
        component="iframe"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01}%2C${latitude - 0.01}%2C${longitude + 0.01}%2C${latitude + 0.01}&layer=mapnik&marker=${latitude}%2C${longitude}`}
        sx={{
          width: "100%",
          height: 300,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      />
      <Typography variant="caption" color="text.secondary">
        Ajustá latitud/longitud para marcar la ubicación exacta.
      </Typography>
    </Box>
  );
}
