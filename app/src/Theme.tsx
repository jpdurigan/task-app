import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { ThemeOptions } from "@mui/material/styles";
import { PropsWithChildren } from "react";

export enum TagColors {
	BLUE = "blue",
	TEAL = "teal",
	GREEN = "green",
	YELLOW = "yellow",
	RED = "red",
	PINK = "pink",
	PURPLE = "purple",
}

export const getRandomTagColor = (): TagColors => {
	const colors = Object.values(TagColors);
	const index = Math.floor(Math.random() * colors.length);
	return colors[index];
};

const themeOptions: ThemeOptions = {
	palette: {
		primary: {
			main: "#0F7173",
		},
		secondary: {
			main: "#B30089",
		},
		background: {
			default: "#F5F4F6",
		},
		text: {
			primary: "#6A5B6E",
		},
		error: {
			main: "#F05D5E",
		},
		warning: {
			main: "#F3C93F",
		},
		info: {
			main: "#1E2EDE",
		},
		success: {
			main: "#73B62B",
		},

		// custom colors
		blue: {
			main: "#1E2EDE",
			contrastText: "#fff",
		},
		teal: {
			main: "#0F7173",
			contrastText: "#fff",
		},
		green: {
			main: "#73B62B",
			contrastText: "#fff",
		},
		yellow: {
			main: "#F3C93F",
			contrastText: "#fff",
		},
		red: {
			main: "#F05D5E",
			contrastText: "#fff",
		},
		pink: {
			main: "#B30089",
			contrastText: "#fff",
		},
		purple: {
			main: "#651C82",
			contrastText: "#fff",
		},
	},
};

const AppTheme = createTheme(themeOptions);

export const AppThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
	return (
		<ThemeProvider theme={AppTheme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	);
};

// allow custom colors on MUI Theme
// as seen in https://mui.com/material-ui/customization/palette/#typescript

declare module "@mui/material/styles" {
	interface Palette {
		blue: Palette["secondary"];
		teal: Palette["secondary"];
		green: Palette["secondary"];
		yellow: Palette["secondary"];
		red: Palette["secondary"];
		pink: Palette["secondary"];
		purple: Palette["secondary"];
	}

	// allow configuration using `createTheme`
	interface PaletteOptions {
		blue?: PaletteOptions["secondary"];
		teal?: PaletteOptions["secondary"];
		green?: PaletteOptions["secondary"];
		yellow?: PaletteOptions["secondary"];
		red?: PaletteOptions["secondary"];
		pink?: PaletteOptions["secondary"];
		purple?: PaletteOptions["secondary"];
	}
}

// @babel-ignore-comment-in-output Update the Button's color prop options
declare module "@mui/material/Chip" {
	interface ChipPropsColorOverrides {
		blue: true;
		teal: true;
		green: true;
		yellow: true;
		red: true;
		pink: true;
		purple: true;
	}
}

declare module "@mui/material/TextField" {
	interface TextFieldPropsColorOverrides {
		blue: true;
		teal: true;
		green: true;
		yellow: true;
		red: true;
		pink: true;
		purple: true;
	}
}

declare module "@mui/material/SvgIcon" {
	interface SvgIconPropsColorOverrides {
		blue: true;
		teal: true;
		green: true;
		yellow: true;
		red: true;
		pink: true;
		purple: true;
	}
}