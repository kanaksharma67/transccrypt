
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/sonner";

// Floating toggle with gradients and icon transitions
export const ThemeToggle = () => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // So we don't flicker on SSR/hydration
  useEffect(() => { setMounted(true); }, []);
  
  // Handle theme change with notification
  const handleThemeChange = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    toast(`Theme changed to ${newTheme} mode`);
  };

  if (!mounted) return null;

  return (
    <button
      aria-label="Toggle dark mode"
      className="fixed z-50 bottom-6 right-6 md:bottom-8 md:right-8 flex items-center transition-all group shadow-xl bg-gradient-to-tr from-[#E5DEFF] via-[#D3E4FD] to-[#FDE1D3] dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 rounded-full p-3 focus:outline-none ring-2 ring-primary ring-opacity-30 hover:scale-110"
      onClick={handleThemeChange}
    >
      <span className="sr-only">Toggle theme</span>
      {theme === "dark" ? (
        <Sun className="w-6 h-6 text-yellow-400 transition-transform duration-300 group-hover:rotate-12" />
      ) : (
        <Moon className="w-6 h-6 text-gray-700 transition-transform duration-300 group-hover:-rotate-12" />
      )}
    </button>
  );
};
