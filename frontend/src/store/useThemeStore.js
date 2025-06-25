import { create } from "zustand";

export const useThemeStore=create((set)=>({
    theme:localStorage.getItem("blinkchat-theme")||"winter",
    setTheme:(theme)=>{
        localStorage.setItem("blinkchat-theme",theme);
        set({theme});
    },
}));

