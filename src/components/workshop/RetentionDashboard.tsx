"use client";

import React, { useMemo } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LoopIcon from "@mui/icons-material/Loop";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { generateWhatsAppMessage, openWhatsAppUrl } from "@/utils/helpers/whatsappHelper";

export interface ServiceRecordItem {
  id: string;
  plate: string;
  customerName: string;
  customerPhone: string;
  serviceDate: any;
  nextServiceDate: any;
  nextServiceKm: number;
  totalAmount: number;
  currentMileage: number;
}

interface Props {
  records: ServiceRecordItem[];
  workshopName: string;
}

export default function RetentionDashboard({ records, workshopName }: Props) {
  const metrics = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentMonthRecords = records.filter((r) => {
      const d = r.serviceDate?.toDate ? r.serviceDate.toDate() : new Date(r.serviceDate);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const totalMonthIncome = currentMonthRecords.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
    const avgTicket = currentMonthRecords.length > 0 ? Math.round(totalMonthIncome / currentMonthRecords.length) : 0;

    const plateFrequency: Record<string, number> = {};
    records.forEach((r) => {
      plateFrequency[r.plate] = (plateFrequency[r.plate] || 0) + 1;
    });
    const uniquePlates = Object.keys(plateFrequency).length;
    const returningPlates = Object.values(plateFrequency).filter((count) => count > 1).length;
    const retentionRate = uniquePlates > 0 ? Math.round((returningPlates / uniquePlates) * 100) : 0;

    const pendingThisMonth = records.filter((r) => {
      if (!r.nextServiceDate) return false;
      const nd = r.nextServiceDate?.toDate ? r.nextServiceDate.toDate() : new Date(r.nextServiceDate);
      return nd.getMonth() === currentMonth && nd.getFullYear() === currentYear;
    });

    return {
      avgTicket,
      totalMonthIncome,
      retentionRate,
      currentMonthCount: currentMonthRecords.length,
      pendingThisMonth,
    };
  }, [records]);

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <AttachMoneyIcon color="primary" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Ticket Promedio Mensual
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  Bs. {metrics.avgTicket}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total: Bs. {metrics.totalMonthIncome.toLocaleString()} ({metrics.currentMonthCount} órdenes)
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <LoopIcon color="success" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Tasa de Retorno (Clientes Recurrentes)
                </Typography>
                <Typography variant="h4" fontWeight={700} color="success.main">
                  {metrics.retentionRate}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Vehículos que regresaron a tu taller
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <NotificationsActiveIcon color="warning" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Mantenimientos Proyectados (Este Mes)
                </Typography>
                <Typography variant="h4" fontWeight={700} color="warning.main">
                  {metrics.pendingThisMonth.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Autos a contactar para no perder el cliente
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        📅 Clientes con Mantenimiento Previsto este Mes
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: "grey.50" }}>
            <TableRow>
              <TableCell><strong>Placa</strong></TableCell>
              <TableCell><strong>Cliente</strong></TableCell>
              <TableCell><strong>Celular</strong></TableCell>
              <TableCell><strong>Fecha Estimada</strong></TableCell>
              <TableCell><strong>Km Proyectado</strong></TableCell>
              <TableCell align="center"><strong>Acción WhatsApp</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {metrics.pendingThisMonth.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay mantenimientos proyectados pendientes para este mes.
                </TableCell>
              </TableRow>
            ) : (
              metrics.pendingThisMonth.map((row) => (
                <TableRow key={row.id}>
                  <TableCell><Chip label={row.plate} size="small" variant="outlined" /></TableCell>
                  <TableCell>{row.customerName}</TableCell>
                  <TableCell>{row.customerPhone}</TableCell>
                  <TableCell>
                    {row.nextServiceDate?.toDate
                      ? row.nextServiceDate.toDate().toLocaleDateString("es-BO")
                      : "—"}
                  </TableCell>
                  <TableCell>{row.nextServiceKm?.toLocaleString()} km</TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      startIcon={<WhatsAppIcon />}
                      onClick={() => {
                        const url = generateWhatsAppMessage({
                          type: "preventive_reminder",
                          phone: row.customerPhone,
                          customerName: row.customerName,
                          plate: row.plate,
                          workshopName,
                          currentKm: row.currentMileage,
                          nextKm: row.nextServiceKm,
                        });
                        openWhatsAppUrl(url);
                      }}
                    >
                      Recordar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

