/**
 * FormattedNumberInput — formats numeric input with commas for readability.
 * Usage: <FormattedNumberInput value={num} onChange={setNum} placeholder="50,000" prefix="$" />
 */

import { useState, useRef } from "react";
import { TEXT, SURFACE, GLASS_TINT } from "../tokens";

interface FormattedNumberInputProps {
  value: string;
  onChange: (raw: string) => void;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
  style?: React.CSSProperties;
  min?: number;
  max?: number;
  allowDecimals?: boolean;
}

/** Format a raw numeric string with comma separators */
export function formatWithCommas(raw: string, allowDecimals = false): string {
  if (!raw) return "";
  // Remove existing non-numeric chars (except decimal if allowed)
  const cleaned = allowDecimals
    ? raw.replace(/[^0-9.]/g, "")
    : raw.replace(/[^0-9]/g, "");
  if (!cleaned) return "";
  
  if (allowDecimals) {
    const parts = cleaned.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  
  return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** Strip commas and return raw numeric string */
export function stripCommas(formatted: string): string {
  return formatted.replace(/,/g, "");
}

/** Parse a formatted or raw string to a number (returns NaN if invalid) */
export function parseFormattedNumber(s: string): number {
  return parseFloat(stripCommas(s));
}

export function FormattedNumberInput({
  value,
  onChange,
  placeholder,
  prefix,
  suffix,
  className = "",
  style,
  min,
  max,
  allowDecimals = false,
}: FormattedNumberInputProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayValue = focused ? value : formatWithCommas(value, allowDecimals);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = stripCommas(e.target.value);
    // Allow empty
    if (!raw) { onChange(""); return; }
    // Only allow numeric (and decimal if enabled)
    if (allowDecimals && !/^\d*\.?\d*$/.test(raw)) return;
    if (!allowDecimals && !/^\d*$/.test(raw)) return;
    // Range check
    const num = parseFloat(raw);
    if (min !== undefined && num < min) return;
    if (max !== undefined && num > max) return;
    onChange(raw);
  };

  return (
    <div className="relative flex items-center">
      {prefix && (
        <span
          className="absolute left-3 text-[12px] select-none pointer-events-none"
          style={{ color: "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}
        >
          {prefix}
        </span>
      )}
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        value={focused ? value : displayValue}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className={`${prefix ? "pl-7" : ""} ${suffix ? "pr-7" : ""} ${className}`}
        style={style}
      />
      {suffix && (
        <span
          className="absolute right-3 text-[12px] select-none pointer-events-none"
          style={{ color: "var(--ce-text-secondary)", fontFamily: "var(--font-body)" }}
        >
          {suffix}
        </span>
      )}
    </div>
  );
}
