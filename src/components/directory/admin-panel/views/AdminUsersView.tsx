"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Chip,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Stack,
  Card,
  CardContent,
} from "@mui/material";
import { DocumentSnapshot } from "firebase/firestore";
import {
  fetchAdminUsersPaginated,
  getTotalUsersCount,
  searchUsers,
  setUserAdminClaim,
} from "@/utils/requesters/AdminRequester";
import { UserInterface } from "@/interfaces/UserInterface";
import LoadingButton from "@/components/directory/business-panel/LoadingButton";

function formatCreatedAt(createdAt: any): string {
  if (!createdAt) return "Sin fecha";
  try {
    const date = createdAt.toDate
      ? createdAt.toDate()
      : new Date(createdAt.seconds ? createdAt.seconds * 1000 : createdAt);
    if (isNaN(date.getTime())) return "Sin fecha";
    return date.toLocaleDateString("es-BO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Sin fecha";
  }
}

export default function AdminUsersView() {
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState<"createdAt" | "fullName">("createdAt");
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");

  const [users, setUsers] = useState<UserInterface[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [docHistory, setDocHistory] = useState<(DocumentSnapshot | null)[]>([
    null,
  ]);

  // Load total count on mount
  useEffect(() => {
    getTotalUsersCount().then((count) => {
      setTotalCount(count);
    });
  }, []);

  // Fetch page data
  const loadPage = useCallback(
    async (
      targetPage: number,
      currentDocHistory: (DocumentSnapshot | null)[],
      currentRowsPerPage: number,
      currentSortBy: "createdAt" | "fullName",
      currentSortDir: "desc" | "asc",
    ) => {
      setLoading(true);
      const cursor = currentDocHistory[targetPage] || null;
      const response = await fetchAdminUsersPaginated({
        pageSize: currentRowsPerPage,
        sortBy: currentSortBy,
        sortDirection: currentSortDir,
        startAfterDoc: cursor,
      });

      setUsers(response.users);
      setPage(targetPage);

      if (response.lastDoc) {
        setDocHistory((prev) => {
          const updated = [...prev];
          updated[targetPage + 1] = response.lastDoc;
          return updated;
        });
      }
      setLoading(false);
    },
    [],
  );

  // Initial load or sort change
  useEffect(() => {
    if (!isSearching) {
      setDocHistory([null]);
      setPage(0);
      loadPage(0, [null], rowsPerPage, sortBy, sortDirection);
    }
  }, [sortBy, sortDirection, rowsPerPage, isSearching, loadPage]);

  // Handle Search
  const handleSearch = async () => {
    const term = search.trim();
    if (!term) {
      handleClearSearch();
      return;
    }
    setIsSearching(true);
    setLoading(true);
    const results = await searchUsers(term);
    setUsers(results);
    setLoading(false);
  };

  const handleClearSearch = () => {
    setSearch("");
    setIsSearching(false);
    setDocHistory([null]);
    setPage(0);
    loadPage(0, [null], rowsPerPage, sortBy, sortDirection);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    if (isSearching) {
      setPage(newPage);
      return;
    }
    loadPage(newPage, docHistory, rowsPerPage, sortBy, sortDirection);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newRows = parseInt(event.target.value, 10);
    setRowsPerPage(newRows);
    setDocHistory([null]);
    setPage(0);
  };

  const handleToggleAdmin = async (user: UserInterface) => {
    setLoadingUserId(user.id || "");
    await setUserAdminClaim(user.id || "", !user.isAdmin);
    setLoadingUserId(null);

    // Update user locally
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, isAdmin: !u.isAdmin } : u)),
    );
  };

  const isUserAdmin = (u: UserInterface) => u.isAdmin || false;

  // Sliced users for search mode client pagination
  const displayedUsers = isSearching
    ? users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : users;

  const effectiveTotalCount = isSearching ? users.length : totalCount;

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "primary.main", mb: 0.5 }}
          >
            Usuarios y Administradores
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Administra todos los usuarios registrados en la plataforma, tanto
            antiguos como nuevos.
          </Typography>
        </Box>

        {/* Stat Pill */}
        <Card variant="outlined" sx={{ borderRadius: 2, px: 2, py: 1 }}>
          <CardContent sx={{ p: "0 !important" }}>
            <Typography variant="caption" color="text.secondary">
              Total registrados en base de datos
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "text.primary" }}
            >
              {totalCount > 0
                ? `${totalCount.toLocaleString()} usuarios`
                : "Cargando..."}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Filter and Search Bar */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ flex: 1, minWidth: 300 }}>
          <TextField
            label="Buscar por nombre, email o teléfono"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            size="small"
            fullWidth
            placeholder="Ej: Juan Perez, test@gmail.com, 71234567..."
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{ whiteSpace: "nowrap", px: 3 }}
          >
            Buscar
          </Button>
          {isSearching && (
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleClearSearch}
              sx={{ whiteSpace: "nowrap" }}
            >
              Limpiar
            </Button>
          )}
        </Stack>

        {!isSearching && (
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel id="sort-select-label">Ordenar por</InputLabel>
              <Select
                labelId="sort-select-label"
                value={`${sortBy}-${sortDirection}`}
                label="Ordenar por"
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "createdAt-desc") {
                    setSortBy("createdAt");
                    setSortDirection("desc");
                  } else if (val === "createdAt-asc") {
                    setSortBy("createdAt");
                    setSortDirection("asc");
                  } else if (val === "fullName-asc") {
                    setSortBy("fullName");
                    setSortDirection("asc");
                  }
                }}
              >
                <MenuItem value="createdAt-desc">
                  Más recientes primero (fecha)
                </MenuItem>
                <MenuItem value="createdAt-asc">
                  Más antiguos primero (fecha)
                </MenuItem>
                <MenuItem value="fullName-asc">
                  Nombre alfabético (A - Z)
                </MenuItem>
              </Select>
            </FormControl>
          </Stack>
        )}
      </Paper>

      {/* Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          position: "relative",
          minHeight: 300,
        }}
      >
        {loading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(255, 255, 255, 0.7)",
              zIndex: 2,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        <Table>
          <TableHead sx={{ bgcolor: "grey.50" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Usuario</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Contacto</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Fecha de Registro</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Rol</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Admin Claim
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedUsers.length === 0 && !loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary">
                    No se encontraron usuarios{" "}
                    {isSearching && `con el término "${search}"`}.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              displayedUsers.map((u) => {
                const initials = (u.fullName || "U")
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <TableRow key={u.id} hover>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: isUserAdmin(u)
                              ? "primary.main"
                              : "grey.400",
                            width: 36,
                            height: 36,
                            fontSize: "0.85rem",
                            fontWeight: 600,
                          }}
                        >
                          {initials}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: "text.primary" }}
                          >
                            {u.fullName || "Sin nombre registrado"}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "text.disabled", display: "block" }}
                          >
                            ID: {u.id?.slice(0, 10)}...
                          </Typography>
                          {u.deleted && (
                            <Chip
                              label="Eliminado"
                              size="small"
                              color="error"
                              variant="outlined"
                              sx={{ height: 18, fontSize: "0.65rem", mt: 0.5 }}
                            />
                          )}
                          {u.disable && (
                            <Chip
                              label="Deshabilitado"
                              size="small"
                              color="warning"
                              variant="outlined"
                              sx={{ height: 18, fontSize: "0.65rem", mt: 0.5 }}
                            />
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{u.email || "—"}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {u.phoneNumber?.number
                          ? `${u.phoneNumber.countryCode || ""} ${u.phoneNumber.number}`
                          : "Sin teléfono"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatCreatedAt(u.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={u.role || "Usuario"}
                        size="small"
                        color={
                          u.role === "Admin"
                            ? "primary"
                            : u.role?.startsWith("Support")
                              ? "secondary"
                              : "default"
                        }
                        variant={u.role === "Admin" ? "filled" : "outlined"}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <LoadingButton
                        size="small"
                        loading={loadingUserId === u.id}
                        onClick={() => handleToggleAdmin(u)}
                        variant={isUserAdmin(u) ? "contained" : "outlined"}
                        color={isUserAdmin(u) ? "primary" : "inherit"}
                      >
                        {isUserAdmin(u) ? "Admin" : "No admin"}
                      </LoadingButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination Bar */}
        <TablePagination
          component="div"
          count={effectiveTotalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100]}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} de ${count !== -1 ? count.toLocaleString() : `más de ${to}`}`
          }
        />
      </TableContainer>
    </Box>
  );
}
