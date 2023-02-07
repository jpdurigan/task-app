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
import { Color, createTheme, CssBaseline, ThemeProvider } from "@mui/material";

export const ColorsApp = {
	Primary: blueGrey,
	Red: red,
	Pink: pink,
	Purple: purple,
	Indigo: indigo,
	Blue: blue,
	Teal: teal,
	Green: lightGreen,
	Yellow: yellow,
	Orange: orange,
};
export type validColor = typeof ColorsApp[keyof typeof ColorsApp];
export const ColorGrid: validColor[] = [
	ColorsApp.Red,
	ColorsApp.Pink,
	ColorsApp.Purple,
	ColorsApp.Indigo,
	ColorsApp.Blue,
	ColorsApp.Teal,
	ColorsApp.Green,
	ColorsApp.Yellow,
	ColorsApp.Orange,
];

interface ThemeAppProps {
	children: JSX.Element,
	color?: validColor
}

export const ThemeApp: React.FC<ThemeAppProps> = ({ children, color }) => {
	const trueColor: Color = color != undefined ? color : ColorsApp.Primary;
	const theme = createTheme({
		palette: {
			primary: trueColor,
			secondary: { main: trueColor.A400 },
			info: { main: trueColor[100] },
		},
	});

	return (
		<ThemeProvider theme={theme}>
			{children}
		</ThemeProvider>
	)
}
