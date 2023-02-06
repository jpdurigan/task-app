import {
  blue,
  indigo,
  lightGreen,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow,
} from "@mui/material/colors";
import { createTheme } from "@mui/system";

declare module "@mui/material/styles" {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

export const AppTheme = createTheme({
  palette: {
    red: red,
    pink: pink,
    purple: purple,
    indigo: indigo,
    blue: blue,
    teal: teal,
    green: lightGreen,
    yellow: yellow,
    orange: orange,
  },
});
