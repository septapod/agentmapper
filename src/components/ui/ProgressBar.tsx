"use client";

import { HTMLAttributes, forwardRef } from "react";
import { motion } from "framer-motion";

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "gradient" | "teal" | "yellow" | "coral";
}

const sizes = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

const variants = {
  gradient: "bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-coral)]",
  teal: "bg-[var(--color-accent-teal)]",
  yellow: "bg-[var(--color-accent)]",
  coral: "bg-[var(--color-accent-coral)]",
};

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value,
      max = 100,
      showLabel = false,
      size = "md",
      variant = "gradient",
      className = "",
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div ref={ref} className={`w-full ${className}`} {...props}>
        {showLabel && (
          <div className="flex justify-between mb-1 text-xs">
            <span className="text-[var(--color-text-muted)]">Progress</span>
            <span className="text-[var(--color-text)]">{Math.round(percentage)}%</span>
          </div>
        )}
        <div
          className={`
            w-full bg-[var(--color-surface)] rounded-full overflow-hidden
            ${sizes[size]}
          `}
        >
          <motion.div
            className={`h-full ${variants[variant]}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = "ProgressBar";

// Multi-step progress indicator
interface StepProgressProps extends HTMLAttributes<HTMLDivElement> {
  steps: string[];
  currentStep: number;
  completedSteps?: number[];
}

export const StepProgress = forwardRef<HTMLDivElement, StepProgressProps>(
  ({ steps, currentStep, completedSteps = [], className = "", ...props }, ref) => {
    return (
      <div ref={ref} className={`w-full ${className}`} {...props}>
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(index) || index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <div key={index} className="flex items-center flex-1">
                {/* Step circle */}
                <div className="flex flex-col items-center">
                  <motion.div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      font-[var(--font-display)] font-semibold text-sm
                      border-2 transition-colors duration-300
                      ${
                        isCompleted
                          ? "bg-[var(--color-accent-teal)] border-[var(--color-accent-teal)] text-[var(--color-bg)]"
                          : isCurrent
                          ? "bg-transparent border-[var(--color-accent)] text-[var(--color-accent)]"
                          : "bg-transparent border-white/20 text-[var(--color-text-muted)]"
                      }
                    `}
                    animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {isCompleted ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </motion.div>
                  <span
                    className={`
                      mt-2 text-xs font-medium text-center max-w-[80px]
                      ${
                        isCompleted || isCurrent
                          ? "text-[var(--color-text)]"
                          : "text-[var(--color-text-muted)]"
                      }
                    `}
                  >
                    {step}
                  </span>
                </div>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-2">
                    <div className="h-[2px] bg-[var(--color-surface)] relative">
                      <motion.div
                        className="absolute inset-0 bg-[var(--color-accent-teal)]"
                        initial={{ width: "0%" }}
                        animate={{
                          width: isCompleted ? "100%" : "0%",
                        }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

StepProgress.displayName = "StepProgress";
