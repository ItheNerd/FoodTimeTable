import { $isDarkTheme, setDarkTheme } from "../stores/themeStore.ts";
import { useStore } from "@nanostores/react";

export default function ThemeToggle() {
  const handleToggleTheme = () => {
    setDarkTheme();
  };

  return (
    <button onClick={handleToggleTheme}>
      {useStore($isDarkTheme) ? "🌞" : "🌙"}
    </button>
  );
}
