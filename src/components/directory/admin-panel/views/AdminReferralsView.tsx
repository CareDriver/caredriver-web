"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse,
} from "@mui/material";
import { useAdminPanel } from "../AdminPanelContext";
import {
  fetchReferralEarningsForUser,
  payUserReferralEarnings,
} from "@/utils/requesters/AdminRequester";
import {
  UserReferralEarnings,
  ReferralEarningsLedger,
} from "@/interfaces/Referrals";
import LoadingButton from "@/components/directory/business-panel/LoadingButton";

export default function AdminReferralsView() {
  const { referrals, userReferralEarnings, businesses } = useAdminPanel();
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [ledger, setLedger] = useState<ReferralEarningsLedger[]>([]);
  const [payingUser, setPayingUser] = useState<UserReferralEarnings | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  const totalOwed = userReferralEarnings.reduce(
    (sum, e) => sum + (e.totalOwed || 0),
    0,
  );
  const totalReferrals =
    referrals.length +
    userReferralEarnings.reduce((sum, e) => sum + (e.totalReferred || 0), 0);

  const expandUser = async (user: UserReferralEarnings) => {
    if (expandedUser === user.userId) {
      setExpandedUser(null);
      return;
    }
    setExpandedUser(user.userId || "");
    const data = await fetchReferralEarningsForUser(user.userId || "");
    setLedger(data);
  };

  const handlePay = async () => {
    if (!payingUser?.userId) return;
    setLoading(true);
    await payUserReferralEarnings(payingUser.userId);
    setLoading(false);
    setPayingUser(null);
  };

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: "primary.main", mb: 3 }}
      >
        Referidos
      </Typography>

      <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Total referidos
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "primary.main" }}
            >
              {totalReferrals}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Total adeudado en plata
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "error.main" }}
            >
              Bs {totalOwed}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Negocio refiere a negocio (días gratis)
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Referidor</TableCell>
              <TableCell>Referido</TableCell>
              <TableCell>Código</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {referrals.map((r) => {
              const referrer = businesses.find(
                (b) => b.id === r.referrerEnterpriseId,
              );
              const referred = businesses.find(
                (b) => b.id === r.referredEnterpriseId,
              );
              return (
                <TableRow key={r.id} hover>
                  <TableCell>
                    {referrer?.name || r.referrerEnterpriseId}
                  </TableCell>
                  <TableCell>
                    {referred?.name || r.referredEnterpriseId}
                  </TableCell>
                  <TableCell>{r.codeUsed || "—"}</TableCell>
                  <TableCell>
                    {r.capturedAt
                      ? new Date(
                          (r.capturedAt as any).toDate?.() || r.capturedAt,
                        ).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={
                        r.benefitApplied
                          ? "Beneficio aplicado"
                          : "Pendiente de primer pago"
                      }
                      color={r.benefitApplied ? "success" : "warning"}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Usuario refiere a negocio (pago en efectivo)
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Referidos</TableCell>
              <TableCell>Total adeudado</TableCell>
              <TableCell>Total pagado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userReferralEarnings.map((user) => (
              <React.Fragment key={user.userId}>
                <TableRow hover>
                  <TableCell>{user.fullName || user.userId || "—"}</TableCell>
                  <TableCell>{user.phone || "—"}</TableCell>
                  <TableCell>{user.totalReferred}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "error.main" }}>
                    Bs {user.totalOwed}
                  </TableCell>
                  <TableCell>Bs {user.totalPaid}</TableCell>
                  <TableCell align="right">
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button size="small" onClick={() => expandUser(user)}>
                        Detalle
                      </Button>
                      <LoadingButton
                        size="small"
                        variant="contained"
                        disabled={(user.totalOwed || 0) <= 0}
                        onClick={() => setPayingUser(user)}
                      >
                        Pagar
                      </LoadingButton>
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={6} sx={{ py: 0, border: 0 }}>
                    <Collapse in={expandedUser === user.userId}>
                      <Box sx={{ p: 2, bgcolor: "action.hover" }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Auditoría de pagos
                        </Typography>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Negocio</TableCell>
                              <TableCell>Pago #</TableCell>
                              <TableCell>Monto</TableCell>
                              <TableCell>Estado</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {ledger.map((l) => {
                              const business = businesses.find(
                                (b) => b.id === l.referredEnterpriseId,
                              );
                              return (
                                <TableRow key={l.id}>
                                  <TableCell>
                                    {business?.name || l.referredEnterpriseId}
                                  </TableCell>
                                  <TableCell>{l.paymentNumber}</TableCell>
                                  <TableCell>Bs {l.amountEarned}</TableCell>
                                  <TableCell>
                                    <Chip
                                      size="small"
                                      label={l.status}
                                      color={
                                        l.status === "paid"
                                          ? "success"
                                          : "warning"
                                      }
                                    />
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={Boolean(payingUser)}
        onClose={() => setPayingUser(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Confirmar pago manual</DialogTitle>
        <DialogContent>
          <Typography>
            Vas a marcar como pagado <strong>Bs {payingUser?.totalOwed}</strong>{" "}
            a <strong>{payingUser?.fullName || payingUser?.userId}</strong>.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esto no transfiere la plata — haz la transferencia vos primero. Esto
            solo registra que ya se pagó.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPayingUser(null)}>Cancelar</Button>
          <LoadingButton
            onClick={handlePay}
            loading={loading}
            variant="contained"
          >
            Confirmar pago
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
