import React from "react";

export function Input({ className = "", ...props }) {
  return (
    <input
      className={["w-full rounded-xl px-4 py-3 outline-none", className].join(" ")}
      {...props}
    />
  );
}
