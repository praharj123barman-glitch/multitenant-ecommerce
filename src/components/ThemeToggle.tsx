"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-raised text-foreground transition-all duration-300 hover:border-accent hover:shadow-lg hover:shadow-accent/10"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "light" ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <Sun className="h-4 w-4 text-amber-500" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <Moon className="h-4 w-4 text-indigo-300" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
