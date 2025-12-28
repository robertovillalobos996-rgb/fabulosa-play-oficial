import React from "react";

export function Slider({ value, onValueChange, max = 100, step = 1, className = "" }) {
  const v = Array.isArray(value) ? value[0] : value;
  return (
    <input
      type="range"
      className={["w-full", className].join(" ")}
      value={v}
      max={max}
      step={step}
      onChange={(e) => onValueChange([Number(e.target.value)])}
    />
  );
}
