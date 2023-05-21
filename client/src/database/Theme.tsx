import {
	blue,
	blueGrey,
	indigo,
	lightGreen,
	orange,
	pink,
	purple,
	red,
	teal,
	yellow,
} from "@mui/material/colors";
import { Color, createTheme, ThemeProvider } from "@mui/material";

export const Palette = {
	primary: blueGrey,
	red: red,
	pink: pink,
	purple: purple,
	indigo: indigo,
	blue: blue,
	teal: teal,
	green: lightGreen,
	yellow: yellow,
	orange: orange,
};

export type ValidColor = keyof typeof Palette;

export const PaletteGrid: ValidColor[] = [
	"red",
	"pink",
	"purple",
	"indigo",
	"blue",
	"teal",
	"green",
	"yellow",
	"orange",
];

interface ThemeAppProps {
	children: JSX.Element;
	color_name?: ValidColor;
}

export const ThemeApp: React.FC<ThemeAppProps> = ({
	children,
	color_name = "primary",
}) => {
	const trueColor: Color = Palette[color_name];
	const theme = createTheme({
		palette: {
			primary: trueColor,
			secondary: { main: trueColor.A400 },
			info: { main: trueColor[100] },
		},
	});

	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
