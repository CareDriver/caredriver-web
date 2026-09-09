"use client";

import React from "react";
import { Button, CircularProgress, ButtonProps } from "@mui/material";

interface Props extends ButtonProps {
  loading?: boolean;
}

export default function LoadingButton({
  children,
  loading,
  disabled,
  ...rest
}: Props) {
  return (
    <Button disabled={disabled || loading} {...rest}>
      {loading ? (
        <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
      ) : null}
      {children}
    </Button>
  );
}
