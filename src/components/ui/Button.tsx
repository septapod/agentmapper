"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

type ButtonVariant = "default" | "primary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "children" | "className"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const variants: Record<ButtonVariant, string> = {
  default: `
    border border-white/20 bg-transparent text-[var(--color-text)]
    hover:bg-gradient-to-br hover:from-[var(--color-accent)] hover:to-[var(--color-accent-coral)]
    hover:border-[var(--color-accent)] hover:text-[var(--color-bg)]
  `,
  primary: `
    bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-coral)]
    border-[var(--color-accent)] text-[var(--color-bg)]
    hover:from-[var(--color-accent-coral)] hover:to-[var(--color-accent-teal)]
    hover:border-[var(--color-accent-coral)]
  `,
  ghost: `
    border-transparent bg-transparent text-[var(--color-text)]
    hover:bg-[var(--color-surface)]
  `,
  outline: `
    border border-[var(--color-accent-teal)] bg-transparent text-[var(--color-accent-teal)]
    hover:bg-[var(--color-accent-teal)] hover:text-[var(--color-bg)]
  `,
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "default",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        className={`
          inline-flex items-center justify-center gap-2
          font-[var(--font-display)] font-medium
          transition-all duration-300 ease-out
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        disabled={disabled || isLoading}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {isLoading ? (
          <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
