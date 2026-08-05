"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

export type Language = "ar" | "en";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  tr: (ar: string, en: string) => string;
};

const LanguageContext = createContext<LanguageContextValue>({
  language: "ar" as Language,
  setLanguage: () => {},
  tr: (ar: string) => ar,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("ar");
  const initialized = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem("spiders-language");
      if (saved === "en") setLanguage("en");
      initialized.current = true;
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    if (initialized.current) window.localStorage.setItem("spiders-language", language);
  }, [language]);

  return <LanguageContext.Provider value={{ language, setLanguage, tr: (ar, en) => language === "ar" ? ar : en }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageToggle({ light = false }: { light?: boolean }) {
  const { language, setLanguage } = useLanguage();
  return <button type="button" className={`language-toggle ${light ? "language-toggle--light" : ""}`} onClick={() => setLanguage(language === "ar" ? "en" : "ar")} aria-label={language === "ar" ? "Switch to English" : "التبديل إلى العربية"}>{language === "ar" ? "EN" : "العربية"}</button>;
}

export function LocalizedText({ ar, en }: { ar: string; en: string }) {
  const { tr } = useLanguage();
  return <>{tr(ar, en)}</>;
}
