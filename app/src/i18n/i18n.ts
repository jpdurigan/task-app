import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";

import * as RESOURCES_PT from "./pt.json";
import * as RESOURCES_EN from "./en.json";

i18next
	.use(initReactI18next)
	.use(I18nextBrowserLanguageDetector)
	.init({
		debug: true,
		fallbackLng: "en",
		resources: {
			en: RESOURCES_EN,
			pt: RESOURCES_PT,
		},
		// react: {
		// 	transEmptyNodeValue: "",
		// 	transSupportBasicHtmlNodes: true,
		// 	transKeepBasicHtmlNodesFor: ["p", "a", "br", "em", "strong", "i"],
		// },
	});
