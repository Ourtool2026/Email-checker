"use client";

import { createContext, useContext } from "react";

/** Shared HQ state handed to every page: navigation helpers, search query and date range. */
export const HQContext = createContext(null);

export const useHQ = () => useContext(HQContext);
