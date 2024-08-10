"use client";
import { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { usePathname } from "next/navigation";
import { auth } from "@/firebase/servicesFirebase";


const AuthContext = createContext({});

export function ContextAuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const userLogged = user !== null ? true : false;
      if (userLogged) {
        setIsLoggedIn(userLogged);
        if (pathname === "/" || pathname === "/forgot-password") {
         window.location.href = "/home";
        }
      } else if(!userLogged) {
        setIsLoggedIn(false);
        if (pathname !== "/") {
          window.location.href = "/";
        }
      }
    });

    return () => unsubscribe();
  }, [pathname]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
