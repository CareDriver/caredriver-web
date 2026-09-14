import { createTheme } from "@mui/material/styles";

/**
 * CareDriver Brand Tokens
 *
 * Central source of truth for brand colors across the web panel.
 * Reference: CareDriver brand manual — Esmeralda, Verde, Menta.
 */
export const brandColors = {
  esmeralda: "#043C40", // primary dark — headers, sidebar, main text
  verde: "#07E580", // primary accent — CTAs, positive states, actions
  menta: "#B4FCC7", // soft backgrounds, badges, subtle highlights
  white: "#FFFFFF",
  black: "#000000",
  grayLight: "#F5F5F5",
  grayMedium: "#9E9E9E",
  grayDark: "#424242",
  error: "#D32F2F",
  warning: "#F9A825",
  info: "#0288D1",
} as const;

/**
 * MUI Theme configured with CareDriver brand colors.
 *
 * Use this theme in the root layout via <ThemeProvider theme={careDriverTheme}>.
 */
export const careDriverTheme = createTheme({
  palette: {
    primary: {
      main: brandColors.esmeralda,
      light: brandColors.menta,
      contrastText: brandColors.white,
    },
    secondary: {
      main: brandColors.verde,
      contrastText: brandColors.esmeralda,
    },
    background: {
      default: brandColors.grayLight,
      paper: brandColors.white,
    },
    text: {
      primary: brandColors.esmeralda,
      secondary: brandColors.grayDark,
    },
    error: { main: brandColors.error },
    warning: { main: brandColors.warning },
    info: { main: brandColors.info },
    success: { main: brandColors.verde },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, color: brandColors.esmeralda },
    h2: { fontWeight: 700, color: brandColors.esmeralda },
    h3: { fontWeight: 600, color: brandColors.esmeralda },
    h4: { fontWeight: 600, color: brandColors.esmeralda },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: "none" as const },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
        },
        containedPrimary: {
          backgroundColor: brandColors.esmeralda,
          "&:hover": { backgroundColor: "#032D30" },
        },
        containedSecondary: {
          backgroundColor: brandColors.verde,
          color: brandColors.esmeralda,
          "&:hover": { backgroundColor: "#06C96E" },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: brandColors.menta,
          color: brandColors.esmeralda,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: brandColors.esmeralda,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: brandColors.esmeralda,
          color: brandColors.white,
        },
      },
    },
  },
});

export default careDriverTheme;
