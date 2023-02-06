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
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

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
}
type validColor = typeof ColorsApp[keyof typeof ColorsApp];

interface ThemeAppProps {
	children: JSX.Element,
	color?: validColor
}

export const ThemeApp: React.FC<ThemeAppProps> = ({ children, color }) => {
	const trueColor: validColor = color != undefined ? color : ColorsApp.Primary;
	const theme = createTheme({
		palette: {
			primary: trueColor,
		},
	});

	return (
		<ThemeProvider theme={theme}>
			{children};
		</ThemeProvider>
	)
}
