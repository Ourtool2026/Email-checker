"use client";

export const BrandMark = ({ size = 20 }) => (
  <span
    className="bg-white"
    style={{
      width: size,
      height: size,
      WebkitMask: "var(--mark) center/contain no-repeat",
      mask: "var(--mark) center/contain no-repeat",
    }}
  />
);
