"use client";

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const inputId = id || (typeof label === "string" ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block mb-2 text-sm font-medium text-[var(--color-text)]"
          >
            {label}
            {props.required && (
              <span className="ml-1 text-[var(--color-accent-coral)]">*</span>
            )}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3
            bg-[var(--color-surface)]
            border border-white/[0.1]
            text-[var(--color-text)]
            placeholder:text-[var(--color-text-muted)]
            focus:outline-none focus:border-[var(--color-accent)]
            focus:ring-1 focus:ring-[var(--color-accent)]/20
            transition-all duration-300
            ${error ? "border-[var(--color-accent-coral)]" : ""}
            ${className}
          `}
          {...props}
        />
        {hint && !error && (
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">{hint}</p>
        )}
        {error && (
          <p className="mt-1 text-xs text-[var(--color-accent-coral)]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

// TextArea
interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  error?: string;
  hint?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const inputId = id || (typeof label === "string" ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block mb-2 text-sm font-medium text-[var(--color-text)]"
          >
            {label}
            {props.required && (
              <span className="ml-1 text-[var(--color-accent-coral)]">*</span>
            )}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3
            bg-[var(--color-surface)]
            border border-white/[0.1]
            text-[var(--color-text)]
            placeholder:text-[var(--color-text-muted)]
            focus:outline-none focus:border-[var(--color-accent)]
            focus:ring-1 focus:ring-[var(--color-accent)]/20
            transition-all duration-300
            resize-y min-h-[120px]
            ${error ? "border-[var(--color-accent-coral)]" : ""}
            ${className}
          `}
          {...props}
        />
        {hint && !error && (
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">{hint}</p>
        )}
        {error && (
          <p className="mt-1 text-xs text-[var(--color-accent-coral)]">{error}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";
