'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { APP } from '@/config/app.config';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef();

  const show = useCallback((message) => {
    clearTimeout(timer.current);
    setToast({ message, id: Date.now() });
    timer.current = setTimeout(() => setToast(null), APP.toastDurationMs);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  const value = useMemo(() => ({ toast, show }), [toast, show]);
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export const useToast = () => useContext(ToastContext);
