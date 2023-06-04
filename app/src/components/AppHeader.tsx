import { Assignment } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export const AppHeader: React.FC = () => {
	const { t } = useTranslation();
	return (
		<Stack direction="row" alignItems="center" justifyContent="right" my={2}>
			<Assignment sx={{ fontSize: 48 }} color="primary" />
			<Typography variant="h3" component="h1" color="primary">
				{t("APP_NAME")}
			</Typography>
		</Stack>
	);
};
