"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

export type Language = "ar" | "en";

const LanguageContext = createContext({
  language: "ar" as Language,
  setLanguage: (language: Language) => { void language; },
  tr: (ar: string, en: string) => { void en; return ar; },
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("ar");
  const initialized = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      initialized.current = true;
      if (window.localStorage.getItem("spiders-language") === "en") setLanguage("en");
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
  return <button className={`language-toggle ${light ? "language-toggle--light" : ""}`} onClick={() => setLanguage(language === "ar" ? "en" : "ar")} aria-label={language === "ar" ? "Switch to English" : "التبديل إلى العربية"}>{language === "ar" ? "EN" : "العربية"}</button>;
}
