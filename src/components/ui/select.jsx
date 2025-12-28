import React from "react";

export function Select({ value, onValueChange, children }) {
  return (
    <div>
      {React.Children.map(children, (c) =>
        React.isValidElement(c) ? React.cloneElement(c, { value, onValueChange }) : c
      )}
    </div>
  );
}

export function SelectTrigger({ className = "", children }) {
  return <div className={className}>{children}</div>;
}

export function SelectValue() {
  return null;
}

export function SelectContent({ children, value, onValueChange }) {
  const items = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.props?.value !== undefined) items.push(child);
  });

  return (
    <select
      className="w-full h-14 bg-[#1a1a24] border border-white/10 text-white text-lg rounded-xl px-4"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    >
      {items.map((it) => (
        <option key={it.props.value} value={it.props.value}>
          {it.props.children}
        </option>
      ))}
    </select>
  );
}

export function SelectItem({ children }) {
  return <>{children}</>;
}
