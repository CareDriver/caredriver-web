"use client";

import React, { useState } from "react";
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
  Switch,
} from "@mui/material";
import {
  searchUsers,
  setUserAdminClaim,
} from "@/utils/requesters/AdminRequester";
import { UserInterface } from "@/interfaces/UserInterface";
import LoadingButton from "@/components/directory/business-panel/LoadingButton";

export default function AdminUsersView() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const handleSearch = async () => {
    const data = await searchUsers(search);
    setUsers(data);
  };

  const handleToggleAdmin = async (user: UserInterface) => {
    setLoadingUserId(user.id || "");
    await setUserAdminClaim(user.id || "", !user.isAdmin);
    setLoadingUserId(null);
    handleSearch();
  };

  const isUserAdmin = (u: UserInterface) => u.isAdmin || false;

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: "primary.main", mb: 3 }}
      >
        Usuarios y admins
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Buscar por nombre"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          size="small"
          sx={{ minWidth: 320 }}
        />
        <Button variant="contained" onClick={handleSearch}>
          Buscar
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell align="right">Admin claim</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id} hover>
                <TableCell>{u.fullName || "—"}</TableCell>
                <TableCell>{u.phoneNumber?.number || "—"}</TableCell>
                <TableCell>{u.email || "—"}</TableCell>
                <TableCell>{u.role || "Usuario"}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
