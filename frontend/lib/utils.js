import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...t) => twMerge(clsx(t));
