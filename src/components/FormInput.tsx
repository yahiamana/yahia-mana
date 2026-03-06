"use client";

import { useState } from "react";

interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isTextArea?: boolean;
}

const inputGroupStyle = {
  position: "relative" as const,
  marginBottom: "1.5rem",
};

const inputStyle = {
  width: "100%",
  padding: "1rem",
  background: "var(--color-bg-secondary)",
  border: "1px solid var(--glass-border)",
  borderRadius: "12px",
  color: "var(--color-text-primary)",
  fontSize: "1rem",
  fontFamily: "var(--font-sans)",
  outline: "none",
  transition: "all var(--duration-normal) var(--ease-out-expo)",
  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
};

/**
 * FormInput - A stable, reusable input component with floating labels.
 * Defined at the top level to prevent remounting and focus loss on state changes.
 */
export default function FormInput({
  id,
  label,
  type = "text",
  required = false,
  value,
  onChange,
  isTextArea = false,
}: FormInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || value.length > 0;

  return (
    <div style={inputGroupStyle}>
      {isTextArea ? (
        <textarea
          id={id}
          required={required}
          rows={5}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            ...inputStyle,
            resize: "vertical",
            minHeight: "150px",
            borderColor: isFocused ? "var(--color-accent-warm)" : "var(--glass-border)",
            boxShadow: isFocused ? "var(--shadow-glow)" : "none",
          }}
        />
      ) : (
        <input
          id={id}
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            ...inputStyle,
            borderColor: isFocused ? "var(--color-accent-warm)" : "var(--glass-border)",
            boxShadow: isFocused ? "var(--shadow-glow)" : "none",
          }}
        />
      )}
      <label
        htmlFor={id}
        style={{
          position: "absolute",
          left: "1rem",
          top: isActive ? "-0.5rem" : isTextArea ? "1rem" : "50%",
          transform: isActive ? "none" : "translateY(-50%)",
          background: isActive ? "var(--color-bg)" : "transparent",
          padding: isActive ? "0 0.5rem" : "0",
          fontSize: isActive ? "0.75rem" : "1rem",
          color: isFocused ? "var(--color-accent-warm)" : "var(--color-text-secondary)",
          transition: "all 0.2s ease-out",
          pointerEvents: "none",
          borderRadius: "4px",
        }}
      >
        {label} {required && "*"}
      </label>
    </div>
  );
}
