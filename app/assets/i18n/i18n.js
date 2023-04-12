import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import sv from "./sv.json";
import * as Localization from "expo-localization";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  lng: Localization.locale.slice(0, 2),
  fallbackLng: "en",
  resources: {
    en: en,
    sv: sv,
  },
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;
