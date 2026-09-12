"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  InputAdornment,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SaveIcon from "@mui/icons-material/Save";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { firestore, auth } from "@/firebase/FirebaseConfig";
import { generateWhatsAppMessage, openWhatsAppUrl } from "@/utils/helpers/whatsappHelper";

const PREVENTIVE_SERVICES = [
  { id: "oil_synthetic", label: "Aceite Sintético", defaultIntervalKm: 10000, defaultMonths: 6 },
  { id: "oil_mineral", label: "Aceite Mineral", defaultIntervalKm: 5000, defaultMonths: 3 },
  { id: "filter_oil", label: "Filtro de Aceite", defaultIntervalKm: 5000, defaultMonths: 3 },
  { id: "filter_air", label: "Filtro de Aire", defaultIntervalKm: 10000, defaultMonths: 6 },
  { id: "brakes_inspect", label: "Frenos / Balatas", defaultIntervalKm: 10000, defaultMonths: 6 },
  { id: "fluids_check", label: "Revisión de Niveles", defaultIntervalKm: 5000, defaultMonths: 3 },
  { id: "spark_plugs", label: "Bujías", defaultIntervalKm: 20000, defaultMonths: 12 },
];

interface Props {
  workshopId: string;
  workshopName: string;
}

export default function FastServiceOrderForm({ workshopId, workshopName }: Props) {
  const [plate, setPlate] = useState("");
  const [phone, setPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [currentMileage, setCurrentMileage] = useState<number | "">("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [totalAmount, setTotalAmount] = useState<number | "">("");
  const [notes, setNotes] = useState("");

  const [linkedUserId, setLinkedUserId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [servicesDone, setServicesDone] = useState<string[]>(["oil_synthetic", "filter_oil"]);

  const [nextServiceKm, setNextServiceKm] = useState<number>(0);
  const [nextServiceMonths, setNextServiceMonths] = useState<number>(6);

  const [saving, setSaving] = useState(false);
  const [successOrder, setSuccessOrder] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const normalizePlate = (val: string) => val.toUpperCase().replace(/[^A-Z0-9]/g, "");

  useEffect(() => {
    if (typeof currentMileage === "number" && currentMileage > 0) {
      const intervals = servicesDone.map((id) => {
        const item = PREVENTIVE_SERVICES.find((s) => s.id === id);
        return item ? item.defaultIntervalKm : 5000;
      });
      const minInterval = intervals.length > 0 ? Math.min(...intervals) : 5000;
      setNextServiceKm(currentMileage + minInterval);

      const months = servicesDone.map((id) => {
        const item = PREVENTIVE_SERVICES.find((s) => s.id === id);
        return item ? item.defaultMonths : 3;
      });
      setNextServiceMonths(months.length > 0 ? Math.min(...months) : 3);
    }
  }, [currentMileage, servicesDone]);

  // Reactive search with debounce
  useEffect(() => {
    const cleanPlate = normalizePlate(plate);
    if (cleanPlate.length < 5) return;

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const vRef = doc(firestore, "vehicles", cleanPlate);
        const vSnap = await getDoc(vRef);
        if (vSnap.exists()) {
          const vData = vSnap.data();
          setBrand(vData.brand || "");
          setModel(vData.model || "");
          if (vData.currentMileage) setCurrentMileage(vData.currentMileage);
          if (vData.currentOwnerPhone && !phone) setPhone(vData.currentOwnerPhone);
          if (vData.userId) setLinkedUserId(vData.userId);
        }

        const cleanPhone = phone.trim();
        if (cleanPhone.length >= 8) {
          const uQuery = query(
            collection(firestore, "users"),
            where("phoneNumber", "in", [cleanPhone, `+591${cleanPhone}`]),
            where("role", "==", "driver")
          );
          const uSnap = await getDocs(uQuery);
          if (!uSnap.empty) {
            const uData = uSnap.docs[0].data();
            setLinkedUserId(uSnap.docs[0].id);
            if (!customerName) setCustomerName(uData.fullName || "");
          }
        }
      } catch (err) {
        console.error("Error buscando vehículo/cliente:", err);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [plate, phone]);

  const toggleService = (id: string) => {
    setServicesDone((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSaveOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPlate = normalizePlate(plate);
    if (!cleanPlate || !phone || !currentMileage || !totalAmount) {
      setToastMessage("Por favor completa los campos requeridos.");
      return;
    }

    setSaving(true);
    try {
      const now = new Date();
      const projectedDate = new Date();
      projectedDate.setMonth(now.getMonth() + nextServiceMonths);

      const recordRef = doc(collection(firestore, "service_records"));
      const serviceData = {
        id: recordRef.id,
        workshopId,
        workshopName,
        vehicleId: cleanPlate,
        plate: cleanPlate,
        customerPhone: phone.trim().startsWith("+") ? phone.trim() : `+591${phone.trim()}`,
        customerName: customerName.trim() || "Cliente",
        userId: linkedUserId,
        serviceDate: Timestamp.fromDate(now),
        currentMileage: Number(currentMileage),
        nextServiceDate: Timestamp.fromDate(projectedDate),
        nextServiceKm,
        servicesDone,
        totalAmount: Number(totalAmount),
        status: "completed",
        notes: notes.trim(),
        reminderStatus: "pending",
        createdAt: serverTimestamp(),
        createdByUid: auth.currentUser?.uid || "counter_operator",
      };

      await setDoc(recordRef, serviceData);

      const vehicleRef = doc(firestore, "vehicles", cleanPlate);
      await setDoc(
        vehicleRef,
        {
          plate: cleanPlate,
          brand: brand.trim(),
          model: model.trim(),
          currentMileage: Number(currentMileage),
          lastServiceDate: serverTimestamp(),
          currentOwnerPhone: serviceData.customerPhone,
          userId: linkedUserId,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setSuccessOrder(serviceData);
      setToastMessage("¡Orden registrada exitosamente en < 60 segundos!");
    } catch (err) {
      console.error("Error guardando orden:", err);
      setToastMessage("Ocurrió un error al registrar la orden.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setPlate("");
    setPhone("");
    setCustomerName("");
    setCurrentMileage("");
    setBrand("");
    setModel("");
    setTotalAmount("");
    setNotes("");
    setLinkedUserId(null);
    setSuccessOrder(null);
  };

  return (
    <Card sx={{ maxWidth: 800, mx: "auto", p: 2, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight={700} color="primary">
            Nueva Orden de Mantenimiento
          </Typography>
          {isSearching && <CircularProgress size={22} />}
        </Box>

        {linkedUserId ? (
          <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2 }}>
            Conductor registrado en CareDriver App. Recibirá notificaciones push automáticas.
          </Alert>
        ) : (
          <Alert severity="info" sx={{ mb: 2 }}>
            Conductor no registrado. Podrás enviarle comprobante por WhatsApp en 1 clic.
          </Alert>
        )}

        <form onSubmit={handleSaveOrder}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Placa del Vehículo"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                placeholder="Ej: 4059KLP"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DirectionsCarIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Celular / WhatsApp"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej: 71234567"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre del Cliente"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="number"
                label="Kilometraje Actual (km)"
                value={currentMileage}
                onChange={(e) => setCurrentMileage(e.target.value === "" ? "" : Number(e.target.value))}
              />
            </Grid>

            <Grid item xs={6} sm={6}>
              <TextField
                fullWidth
                label="Marca"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Toyota, Suzuki..."
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
                fullWidth
                label="Modelo"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Corolla, Jimny..."
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Servicios Realizados:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {PREVENTIVE_SERVICES.map((srv) => (
                  <Chip
                    key={srv.id}
                    label={srv.label}
                    clickable
                    color={servicesDone.includes(srv.id) ? "primary" : "default"}
                    onClick={() => toggleService(srv.id)}
                  />
                ))}
              </Box>
            </Grid>

            {nextServiceKm > 0 && (
              <Grid item xs={12}>
                <Box sx={{ p: 1.5, bgcolor: "grey.100", borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Próximo servicio proyectado: <strong>{nextServiceKm.toLocaleString()} km</strong> (~{nextServiceMonths} meses)
                  </Typography>
                </Box>
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="number"
                label="Total Cobrado (Bs.)"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value === "" ? "" : Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Observaciones"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Fuga leve, etc."
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 1 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={saving}
                startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                sx={{ py: 1.5, fontWeight: 700 }}
              >
                {saving ? "Guardando..." : "Registrar Orden (<60s)"}
              </Button>
            </Grid>
          </Grid>
        </form>

        {successOrder && (
          <Box sx={{ mt: 3, p: 2, border: "2px dashed #4caf50", borderRadius: 2, bgcolor: "#f9fff9" }}>
            <Typography variant="subtitle1" fontWeight={700} color="success.main">
              ✅ Orden #{successOrder.id.slice(-6)} Guardada Exitosamente
            </Typography>
            <Typography variant="body2" sx={{ my: 1 }}>
              Envía el comprobante digital al conductor por WhatsApp con 1 clic:
            </Typography>
            <Box display="flex" gap={2} mt={1}>
              <Button
                variant="contained"
                color="success"
                startIcon={<WhatsAppIcon />}
                onClick={() => {
                  const url = generateWhatsAppMessage({
                    type: "service_receipt",
                    phone: successOrder.customerPhone,
                    customerName: successOrder.customerName,
                    plate: successOrder.plate,
                    workshopName: successOrder.workshopName,
                    currentKm: successOrder.currentMileage,
                    nextKm: successOrder.nextServiceKm,
                    totalBs: successOrder.totalAmount,
                  });
                  openWhatsAppUrl(url);
                }}
              >
                Enviar Comprobante WhatsApp
              </Button>
              <Button variant="outlined" onClick={handleReset}>
                Nueva Orden
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>

      <Snackbar
        open={!!toastMessage}
        autoHideDuration={4000}
        onClose={() => setToastMessage(null)}
        message={toastMessage}
      />
    </Card>
  );
}

