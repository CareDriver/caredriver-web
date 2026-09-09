"use client";

import React from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
} from "@mui/material";
import { useAdminPanel } from "../AdminPanelContext";
import { PLAN_LABELS } from "@/constants/directory";

export default function AdminDashboardView() {
  const {
    businesses,
    requests,
    receipts,
    subscriptions,
    referrals,
    userReferralEarnings,
  } = useAdminPanel();

  const totalUsers = 0; // Would need users listener
  const totalRevenue = subscriptions.reduce((sum, s) => {
    const history = s.history || [];
    return sum + history.reduce((hSum, h) => hSum + (h.amount || 0), 0);
  }, 0);
  const activeBusinesses = businesses.filter(
    (b) => b.active && b.licenseStatus !== "suspended",
  ).length;
  const suspendedBusinesses = businesses.filter(
    (b) => b.licenseStatus === "suspended",
  ).length;
  const byPlan = {
    free: businesses.filter((b) => b.plan === "free").length,
    verified: businesses.filter((b) => b.plan === "verified").length,
    featured: businesses.filter((b) => b.plan === "featured").length,
  };
  const totalOwed = userReferralEarnings.reduce(
    (sum, e) => sum + (e.totalOwed || 0),
    0,
  );

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: "primary.main", mb: 3 }}
      >
        Dashboard Admin
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            label="Negocios"
            value={String(businesses.length)}
            sub={`${activeBusinesses} activos`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            label="Suspendidos"
            value={String(suspendedBusinesses)}
            sub="requieren atención"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            label="Ingresos por suscripción"
            value={`Bs ${totalRevenue}`}
            sub="histórico aprobado"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            label="Deuda referidos"
            value={`Bs ${totalOwed}`}
            sub="pendiente de pago"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Colas de trabajo
              </Typography>
              <QueueItem
                label="Solicitudes de registro"
                count={requests.length}
                href="/directory/admin/requests"
              />
              <QueueItem
                label="Comprobantes de pago"
                count={receipts.length}
                href="/directory/admin/receipts"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Negocios por plan
              </Typography>
              {Object.entries(byPlan).map(([plan, count]) => (
                <Box
                  key={plan}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 1,
                  }}
                >
                  <Typography>
                    {PLAN_LABELS[plan as keyof typeof PLAN_LABELS]}
                  </Typography>
                  <Typography fontWeight={700}>{count}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Referidos
              </Typography>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", py: 1 }}
              >
                <Typography>Negocio → negocio</Typography>
                <Typography fontWeight={700}>{referrals.length}</Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", py: 1 }}
              >
                <Typography>Usuarios con comisiones</Typography>
                <Typography fontWeight={700}>
                  {userReferralEarnings.length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

function MetricCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: "primary.main", mt: 1 }}
        >
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {sub}
        </Typography>
      </CardContent>
    </Card>
  );
}

function QueueItem({
  label,
  count,
  href,
}: {
  label: string;
  count: number;
  href: string;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: 1.5,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography>{label}</Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          fontWeight={700}
          color={count > 0 ? "error" : "text.primary"}
        >
          {count}
        </Typography>
        <Button component={Link} href={href} size="small" variant="outlined">
          Ver
        </Button>
      </Box>
    </Box>
  );
}
