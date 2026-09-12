"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { firestore } from "@/firebase/FirebaseConfig";
import { useBusinessPanel } from "@/components/directory/business-panel/BusinessPanelContext";
import FastServiceOrderForm from "@/components/workshop/FastServiceOrderForm";
import RetentionDashboard, { ServiceRecordItem } from "@/components/workshop/RetentionDashboard";

export default function WorkshopOrdersPage() {
  const { enterprise, loading: panelLoading } = useBusinessPanel();
  const [tabIndex, setTabIndex] = useState(0);
  const [records, setRecords] = useState<ServiceRecordItem[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(true);

  useEffect(() => {
    if (!enterprise?.id) return;

    const q = query(
      collection(firestore, "service_records"),
      where("workshopId", "==", enterprise.id),
      orderBy("serviceDate", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as ServiceRecordItem[];
        setRecords(items);
        setLoadingRecords(false);
      },
      (error) => {
        console.error("Error al cargar service_records:", error);
        setLoadingRecords(false);
      }
    );

    return () => unsubscribe();
  }, [enterprise?.id]);

  if (panelLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!enterprise) {
    return (
      <Alert severity="warning">
        No se encontró un taller asociado a esta cuenta.
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.main", mb: 0.5 }}>
          Gestión de Mantenimientos & Retención
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Registra órdenes de servicio en segundos y mantén la lealtad de tus clientes con alertas predictivas.
        </Typography>
      </Box>

      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={tabIndex}
          onChange={(_, newVal) => setTabIndex(newVal)}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<AddCircleOutlineIcon />} label="Nueva Orden (<60 seg)" iconPosition="start" />
          <Tab icon={<QueryStatsIcon />} label={`Métricas & Retención (${records.length})`} iconPosition="start" />
        </Tabs>
      </Paper>

      {tabIndex === 0 && (
        <FastServiceOrderForm
          workshopId={enterprise.id || ""}
          workshopName={enterprise.name || "Taller Afiliado"}
        />
      )}

      {tabIndex === 1 && (
        <>
          {loadingRecords ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            <RetentionDashboard
              records={records}
              workshopName={enterprise.name || "Taller Afiliado"}
            />
          )}
        </>
      )}
    </Box>
  );
}
