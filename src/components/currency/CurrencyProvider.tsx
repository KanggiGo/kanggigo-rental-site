"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";
import type { Currency } from "@prisma/client";
import { CURRENCIES } from "@/lib/currency";

const STORAGE_KEY = "kanggigo-currency";
const DEFAULT_CURRENCY: Currency = "USD";

function isValidCurrency(value: string | null): value is Currency {
  return value !== null && (CURRENCIES as string[]).includes(value);
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): Currency {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return isValidCurrency(saved) ? saved : DEFAULT_CURRENCY;
}

// Server never knows the visitor's saved preference, so it always renders
// the default — matching the client's first paint and avoiding a hydration
// mismatch. useSyncExternalStore picks up the real value right after.
function getServerSnapshot(): Currency {
  return DEFAULT_CURRENCY;
}

type CurrencyContextValue = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
};

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: DEFAULT_CURRENCY,
  setCurrency: () => {},
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const currency = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setCurrency = useCallback((next: Currency) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    // The native `storage` event only fires in *other* tabs, so dispatch it
    // manually here to make this tab's useSyncExternalStore re-read too.
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useDisplayCurrency() {
  return useContext(CurrencyContext);
}
