"use client";
import { createContext, useState } from "react";

// Creación del contexto
const AuthContext = createContext({});

export function ContextAuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
