"use client";

import React, { useCallback, useContext, useRef, useState } from "react";
import { cn } from "./cn";
import { CheckIcon, CloseIcon, WarningIcon } from "./icons";

type ToastStatus = "success" | "error";

export interface ToastOptions {
  title: string;
  description?: string;
  status: ToastStatus;
  /** Milliseconds before the toast disappears. */
  duration?: number;
  isClosable?: boolean;
}

interface ToastEntry extends ToastOptions {
  id: number;
}

const ToastContext = React.createContext<(options: ToastOptions) => void>(
  () => {}
);

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((all) => all.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = nextId.current++;
      setToasts((all) => [...all, { ...options, id }]);
      setTimeout(() => dismiss(id), options.duration ?? 5000);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 pb-16"
      >
        {toasts.map((t) => {
          const Icon = t.status === "success" ? CheckIcon : WarningIcon;
          return (
            <div
              key={t.id}
              role="status"
              className={cn(
                "pointer-events-auto relative flex w-full max-w-[560px] min-w-[300px] items-start rounded-md py-3 ps-4 pe-8 text-white shadow-lg",
                t.status === "success" ? "bg-[#38a169]" : "bg-[#e53e3e]"
              )}
            >
              <Icon className="me-3 mt-0.5 size-5" />
              <div className="flex-1">
                <div className="font-bold">{t.title}</div>
                {t.description ? <div>{t.description}</div> : null}
              </div>
              {t.isClosable ? (
                <button
                  type="button"
                  aria-label="Lukk"
                  onClick={() => dismiss(t.id)}
                  className="absolute end-2 top-2 flex size-6 items-center justify-center rounded-md hover:bg-black/10"
                >
                  <CloseIcon className="size-2.5" />
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
