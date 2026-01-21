"use client";

import { HTMLAttributes, forwardRef } from "react";

type BadgeVariant = "default" | "session" | "success" | "warning" | "error" | "coral" | "yellow" | "teal";
type BadgeStatus = "pending" | "active" | "completed";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  status?: BadgeStatus;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[var(--color-surface)] border-l-[var(--color-accent)]",
  session: "bg-[var(--color-surface)] border-l-[var(--color-accent)]",
  success: "bg-[var(--color-accent-teal)]/10 border-l-[var(--color-accent-teal)] text-[var(--color-accent-teal)]",
  warning: "bg-[var(--color-accent)]/10 border-l-[var(--color-accent)] text-[var(--color-accent)]",
  error: "bg-[var(--color-accent-coral)]/10 border-l-[var(--color-accent-coral)] text-[var(--color-accent-coral)]",
  coral: "bg-[var(--color-accent-coral)]/10 border-l-[var(--color-accent-coral)] text-[var(--color-accent-coral)]",
  yellow: "bg-[var(--color-accent)]/10 border-l-[var(--color-accent)] text-[var(--color-accent)]",
  teal: "bg-[var(--color-accent-teal)]/10 border-l-[var(--color-accent-teal)] text-[var(--color-accent-teal)]",
};

const statusStyles: Record<BadgeStatus, string> = {
  pending: "border-l-[var(--color-text-muted)] text-[var(--color-text-muted)]",
  active: "border-l-[var(--color-accent-coral)] bg-[var(--color-accent-coral)]/10 text-[var(--color-accent-coral)]",
  completed: "border-l-[var(--color-accent-teal)] text-[var(--color-accent-teal)]",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", status, children, className = "", ...props }, ref) => {
    const statusStyle = status ? statusStyles[status] : "";

    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center gap-1
          px-3 py-1
          font-[var(--font-display)]
          text-xs font-semibold
          uppercase tracking-wider
          border-l-[3px]
          ${status ? statusStyle : variantStyles[variant]}
          ${className}
        `}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

// Session Badge with number
interface SessionBadgeProps extends Omit<BadgeProps, "children"> {
  sessionNumber: number;
  label?: string;
}

export const SessionBadge = forwardRef<HTMLSpanElement, SessionBadgeProps>(
  ({ sessionNumber, label, status = "pending", className = "", ...props }, ref) => {
    return (
      <Badge
        ref={ref}
        status={status}
        className={className}
        {...props}
      >
        <span className="font-bold">Session {sessionNumber}</span>
        {label && <span className="opacity-75">· {label}</span>}
      </Badge>
    );
  }
);

SessionBadge.displayName = "SessionBadge";
