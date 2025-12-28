import React from "react";

export function Button({ className = "", variant = "default", size, ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-semibold transition active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none";
  const variants = {
    default: "bg-white text-black hover:bg-gray-200",
    ghost: "bg-transparent hover:bg-white/10 text-white",
  };
  const sizes = { icon: "w-10 h-10" };

  return (
    <button
      className={[base, variants[variant] || variants.default, size ? sizes[size] : "", className].join(" ")}
      {...props}
    />
  );
}
