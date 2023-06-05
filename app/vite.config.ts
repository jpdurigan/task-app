import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const manualChunks = (id: string) => {
	if (id.includes("node_modules")) {
		if (id.includes("firebase")) {
			return "firebase";
		} else if (id.includes("mui")) {
			return "material";
		}

		return "vendor";
	}
};

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		rollupOptions: {
			output: {
				manualChunks: manualChunks,
			},
		},
	},
});
