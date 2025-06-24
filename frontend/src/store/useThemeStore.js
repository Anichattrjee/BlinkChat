import { create } from "zustand";

export const useThemeStore=create((set)=>({
    theme:"winter",
    setTheme:(theme)=>set({theme}),
}));

