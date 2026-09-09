"use client";

import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useBusinessPanel } from "./BusinessPanelContext";

export default function BranchSelector() {
  const { enterprise, branches, selectedEnterpriseId, selectEnterprise } =
    useBusinessPanel();

  const options = React.useMemo(() => {
    const list = enterprise
      ? [enterprise, ...branches.filter((b) => b.id !== enterprise.id)]
      : branches;
    return list.filter(Boolean);
  }, [enterprise, branches]);

  if (options.length <= 1) return null;

  const handleChange = (e: SelectChangeEvent) => {
    selectEnterprise(e.target.value);
  };

  return (
    <FormControl fullWidth size="small">
      <InputLabel id="branch-selector-label">Sucursal</InputLabel>
      <Select
        labelId="branch-selector-label"
        value={selectedEnterpriseId || ""}
        label="Sucursal"
        onChange={handleChange}
      >
        {options.map((branch) => (
          <MenuItem key={branch.id} value={branch.id}>
            {branch.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
