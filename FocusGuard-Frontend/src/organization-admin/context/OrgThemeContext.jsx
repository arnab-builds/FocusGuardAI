import React, { createContext, useContext, useState } from "react";

const OrgThemeContext = createContext();

export const OrgThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("focusguard_org_theme") === "dark" ? "dark" : "light";
  });

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === "light" ? "dark" : "light";
      localStorage.setItem("focusguard_org_theme", nextTheme);
      return nextTheme;
    });
  };

  React.useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <OrgThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </OrgThemeContext.Provider>
  );
};

export const useOrgTheme = () => {
  const context = useContext(OrgThemeContext);
  if (!context) {
    throw new Error("useOrgTheme must be used within an OrgThemeProvider");
  }
  return context;
};
