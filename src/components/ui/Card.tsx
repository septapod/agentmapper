"use client";

import { forwardRef, HTMLAttributes } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

type CardAccent = "teal" | "yellow" | "coral" | "none";

interface CardProps extends Omit<HTMLMotionProps<"div">, "children" | "className"> {
  accent?: CardAccent;
  hoverable?: boolean;
  padding?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

const accents: Record<CardAccent, string> = {
  teal: "border-l-4 border-l-[var(--color-accent-teal)]",
  yellow: "border-l-4 border-l-[var(--color-accent)]",
  coral: "border-l-4 border-l-[var(--color-accent-coral)]",
  none: "",
};

const paddings = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      accent = "teal",
      hoverable = true,
      padding = "md",
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={`
          bg-[var(--color-surface)]
          border border-white/[0.08]
          ${accents[accent]}
          ${paddings[padding]}
          ${hoverable ? "cursor-pointer" : ""}
          ${className}
        `}
        initial={false}
        whileHover={
          hoverable
            ? {
                y: -2,
                backgroundColor: "var(--color-surface-hover)",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.4)",
              }
            : undefined
        }
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";

// Card Header
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`mb-4 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

// Card Title
interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4";
  children: React.ReactNode;
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ as: Component = "h3", children, className = "", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`font-[var(--font-display)] font-semibold text-[var(--color-text)] ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

CardTitle.displayName = "CardTitle";

// Card Description
interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={`text-[var(--color-text-muted)] text-sm mt-1 ${className}`}
        {...props}
      >
        {children}
      </p>
    );
  }
);

CardDescription.displayName = "CardDescription";

// Card Content
interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = "CardContent";

// Card Footer
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`mt-4 pt-4 border-t border-white/[0.08] ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = "CardFooter";
