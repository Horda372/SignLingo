// theme/ThemeContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightModeColors, darkModeColors } from "@/constants/themeColors";

const CustomThemeContext = createContext({
  isDark: false,
  colors: lightModeColors,
  toggle: () => {},
});

export const CustomThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("DARK_MODE").then((val) => {
      if (val !== null) setIsDark(val === "true");
    });
  }, []);

  const toggle = () => {
    setIsDark((d) => {
      const next = !d;
      AsyncStorage.setItem("DARK_MODE", String(next));
      return next;
    });
  };

  const colors = isDark ? darkModeColors : lightModeColors;

  return (
    <CustomThemeContext.Provider value={{ isDark, colors, toggle }}>
      {children}
    </CustomThemeContext.Provider>
  );
};

export const useCustomTheme = () => useContext(CustomThemeContext);
