"use client";

import { cn } from "@/lib/utils";

const skinTones = ["#F2C9A8", "#E2AE88", "#CC9270", "#A97352", "#8A5A3E"];

const hairTones = ["#1F1612", "#2B1D16", "#3A2A20", "#151515"];

const shirtColors = [
  "#2F7BF6",
  "#7C3AED",
  "#0F766E",
  "#DB2777",
  "#EA580C",
  "#4F46E5",
  "#B45309",
  "#15803D",
  "#0E7490",
  "#9D174D",
];

const backdropColors = [
  "#E7EEFE",
  "#EFE9FD",
  "#E4F3EF",
  "#FBE7F0",
  "#FDEDE3",
  "#E9EAFD",
  "#FBF0DD",
  "#E5F4E8",
];

const accentColors = [
  "#1F2937",
  "#7C2D12",
  "#1E3A8A",
  "#6B21A8",
  "#9F1239",
  "#334155",
  "#0F766E",
  "#78350F",
];

const hashName = (t) => {
  let a = 7;
  for (let e of t) {
    a = (a * 31 + e.charCodeAt(0)) >>> 0;
  }
  return a;
};

export function GeneratedAvatar({ name: t, size = 32 }) {
  let e = hashName(t);
  let r = (s, m) => s[(e >>> m) % s.length];
  let i = r(skinTones, 1);
  let o = r(hairTones, 3);
  let n = r(shirtColors, 5);
  let l = r(backdropColors, 7);
  let d = (e >>> 9) % 4;
  let u = r(accentColors, 11);
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="block">
      <rect width="64" height="64" fill={l} />
      {d === 1 && <path d="M17 30c0-12 7-19 15-19s15 7 15 19v20H17z" fill={o} />}
      <path d="M10 64c1-11 10-17 22-17s21 6 22 17z" fill={n} />
      <rect x="27.5" y="38" width="9" height="10" rx="4" fill={i} />
      {d === 0 && (
        <path d="M15 34c0-12 7.5-20 17-20s17 8 17 20c0 9-4 14-9 17H24c-5-3-9-8-9-17z" fill={u} />
      )}
      <ellipse cx="32" cy="31" rx="10.5" ry="12" fill={i} />
      {d === 0 && (
        <path d="M21 27c1-7 5.5-11 11-11s10 4 11 11c-3-3-7-4.5-11-4.5S24 24 21 27z" fill={u} />
      )}
      {d === 1 && (
        <path
          d="M21.5 28c0-8 4.6-12.5 10.5-12.5S42.5 20 42.5 28c-3-4-6.5-6-10.5-6s-7.5 2-10.5 6z"
          fill={o}
        />
      )}
      {d === 2 && (
        <>
          <circle cx="32" cy="14.5" r="5.5" fill={o} />
          <path
            d="M21.5 29c0-9 4.6-13.5 10.5-13.5S42.5 20 42.5 29c-2.5-4.5-6.5-7-10.5-7s-8 2.5-10.5 7z"
            fill={o}
          />
        </>
      )}
      {d === 3 && (
        <path
          d="M20 34c-1-12 4-19 12-19s13 7 12 19c-1-6-3-9-5-10-2 2-6 3-14 2-2 2-4 4-5 8z"
          fill={o}
        />
      )}
      <circle cx="28" cy="31" r="1.3" fill="#1F2937" />
      <circle cx="36" cy="31" r="1.3" fill="#1F2937" />
      <path
        d="M28.5 36.2c2 1.6 5 1.6 7 0"
        stroke="#7A3E2B"
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Avatar({ name: t, photo, size = 32, className, ring }) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden rounded-full bg-muted",
        ring && "ring-2 ring-card",
        className,
      )}
      style={{
        width: size,
        height: size,
      }}
    >
      {photo ? (
        <img src={photo} alt={t} width={size} height={size} className="size-full object-cover" />
      ) : (
        <GeneratedAvatar name={t} size={size} />
      )}
    </span>
  );
}
