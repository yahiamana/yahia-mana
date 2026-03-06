"use client";

import React from "react";

interface FormLabelProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

/**
 * FormLabel - A stable label wrapper for administrative forms.
 * Defined at the top level to prevent remounting and focus loss on state changes.
 */
export default function FormLabel({ label, hint, children }: FormLabelProps) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <label
        style={{
          display: "block",
          fontSize: "0.8125rem",
          fontWeight: 600,
          color: "#94A3B8",
          marginBottom: "0.5rem",
        }}
      >
        {label}
      </label>
      {hint && (
        <p
          style={{
            fontSize: "0.7rem",
            color: "#64748B",
            marginBottom: "0.5rem",
            marginTop: "-0.25rem",
          }}
        >
          {hint}
        </p>
      )}
      {children}
    </div>
  );
}
