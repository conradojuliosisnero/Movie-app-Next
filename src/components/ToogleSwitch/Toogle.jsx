"use client";
import "./toggle.css";
import { useEffect, useState } from "react";

export default function Toogle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("theme") || "light"; // Valor por defecto "dark"
    }
    return "dark";
  });

  useEffect(() => {
    if (theme) {
      sessionStorage.setItem("theme", theme);
    }

    const checkbox = document.querySelector(".theme-checkbox");
    checkbox.checked = theme === "light" ? false : true;
    if (theme === "dark") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }

    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    sessionStorage.setItem("theme", newTheme);
    };

    useEffect(() => { 
        const themeHtml = document.querySelector('.dark')
        if (themeHtml) {
            const checkSwitch = document.querySelector('.theme-checkbox')
            checkSwitch.classList.add('light')
        } else {
            const checkSwitch = document.querySelector('.theme-checkbox')
            checkSwitch.classList.remove('light')
        }

        return () => {
            const checkSwitch = document.querySelector('.theme-checkbox')
            checkSwitch.classList.remove('light')
        }

    }, [theme]);

  return (
    <input type="checkbox" onClick={toggleTheme} className="theme-checkbox" />
  );
}
