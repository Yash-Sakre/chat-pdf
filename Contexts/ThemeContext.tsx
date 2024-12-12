"use client";

import { createContext, useEffect, useState } from "react";

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: string;
    storageKey?: string;
};

export type ThemeProviderState = {
    theme: string;
    setTheme: (theme: string) => void;
};

const initialState = {
    theme: "system",
    setTheme: () => null,
};

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "shadcn-ui-theme",
    ...props
}: ThemeProviderProps) {
    const [theme, setTheme] = useState(defaultTheme);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // Ensure we are in the client environment
        if (typeof window !== "undefined") {
            const storedTheme = localStorage.getItem(storageKey);
            setTheme(storedTheme ?? defaultTheme);
            setIsMounted(true);
        }
    }, [defaultTheme, storageKey]);

    useEffect(() => {
        if (!isMounted) return;

        const root = window.document.documentElement;

        root.classList.remove("light", "dark");

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";

            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }
    }, [theme, isMounted]);

    return (
        <ThemeProviderContext.Provider
            {...props}
            value={{
                theme,
                setTheme: (theme: string) => {
                    localStorage.setItem(storageKey, theme);
                    setTheme(theme);
                },
            }}
        >
            {children}
        </ThemeProviderContext.Provider>
    );
}
