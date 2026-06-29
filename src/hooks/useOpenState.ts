"use client";

import { useEffect, useState } from "react";
import { isOpenNow, type OpenState } from "@/config/clinic";

/** Live open/closed state, recomputed every 30 seconds so the indicator never goes stale. */
export function useOpenState(): OpenState {
  const [state, setState] = useState<OpenState>(() => isOpenNow());

  useEffect(() => {
    const id = setInterval(() => setState(isOpenNow()), 30_000);
    return () => clearInterval(id);
  }, []);

  return state;
}
