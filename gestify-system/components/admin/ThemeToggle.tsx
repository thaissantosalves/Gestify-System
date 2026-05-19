"use client";

import { useEffect, useState } from "react";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import MuiIcon from "@/components/ui/MuiIcon";
import { applyTheme, getStoredTheme, type ThemeMode } from "@/lib/theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getStoredTheme());
    setMounted(true);
  }, []);

  function toggleTheme() {
    const next: ThemeMode = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
      title={theme === "dark" ? "Modo claro" : "Modo escuro"}
      suppressHydrationWarning
    >
      {!mounted ? (
        <span className="inline-block h-5 w-5" />
      ) : theme === "dark" ? (
        <MuiIcon icon={LightModeOutlinedIcon} />
      ) : (
        <MuiIcon icon={DarkModeOutlinedIcon} />
      )}
    </button>
  );
}
