import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2, Check, X, AlertCircle, Info } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

// ============================================================================
// LOADING BUTTON - Bouton avec état de chargement intégré
// ============================================================================

const loadingButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
      state: {
        idle: "",
        loading: "cursor-wait",
        success: "bg-green-600 hover:bg-green-600 text-white",
        error: "bg-red-600 hover:bg-red-600 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      state: "idle",
    },
  }
);

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof loadingButtonVariants> {
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  loadingText?: string;
  successText?: string;
  errorText?: string;
  successDuration?: number;
  errorDuration?: number;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      isSuccess = false,
      isError = false,
      loadingText,
      successText,
      errorText,
      successDuration = 2000,
      errorDuration = 3000,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showSuccess, setShowSuccess] = React.useState(false);
    const [showError, setShowError] = React.useState(false);

    React.useEffect(() => {
      if (isSuccess) {
        setShowSuccess(true);
        const timer = setTimeout(() => setShowSuccess(false), successDuration);
        return () => clearTimeout(timer);
      }
    }, [isSuccess, successDuration]);

    React.useEffect(() => {
      if (isError) {
        setShowError(true);
        const timer = setTimeout(() => setShowError(false), errorDuration);
        return () => clearTimeout(timer);
      }
    }, [isError, errorDuration]);

    const currentState = isLoading
      ? "loading"
      : showSuccess
      ? "success"
      : showError
      ? "error"
      : "idle";

    const content = isLoading ? (
      <>
        <Loader2 className="h-4 w-4 animate-spin" />
        {loadingText || children}
      </>
    ) : showSuccess ? (
      <>
        <Check className="h-4 w-4" />
        {successText || "Succès"}
      </>
    ) : showError ? (
      <>
        <X className="h-4 w-4" />
        {errorText || "Erreur"}
      </>
    ) : (
      children
    );

    return (
      <button
        className={cn(loadingButtonVariants({ variant, size, state: currentState, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {content}
      </button>
    );
  }
);
LoadingButton.displayName = "LoadingButton";

// ============================================================================
// PROGRESS INDICATOR - Indicateur de progression
// ============================================================================

interface ProgressIndicatorProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "error";
  className?: string;
}

function ProgressIndicator({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = "md",
  variant = "default",
  className,
}: ProgressIndicatorProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const variantClasses = {
    default: "bg-primary",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
  };

  return (
    <div className={cn("w-full space-y-1", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between text-sm">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showPercentage && (
            <span className="font-medium">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className={cn("w-full bg-muted rounded-full overflow-hidden", sizeClasses[size])}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            variantClasses[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// PULSE DOT - Point animé pour indiquer une activité
// ============================================================================

interface PulseDotProps {
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
  className?: string;
}

function PulseDot({ variant = "default", size = "md", className }: PulseDotProps) {
  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  };

  const variantClasses = {
    default: "bg-primary",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <span className={cn("relative flex", sizeClasses[size], className)}>
      <span
        className={cn(
          "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
          variantClasses[variant]
        )}
      />
      <span
        className={cn(
          "relative inline-flex rounded-full h-full w-full",
          variantClasses[variant]
        )}
      />
    </span>
  );
}

// ============================================================================
// STATUS BADGE - Badge avec statut visuel
// ============================================================================

interface StatusBadgeProps {
  status: "idle" | "loading" | "success" | "error" | "warning" | "info";
  label?: string;
  showIcon?: boolean;
  className?: string;
}

function StatusBadge({ status, label, showIcon = true, className }: StatusBadgeProps) {
  const statusConfig = {
    idle: {
      bg: "bg-muted",
      text: "text-muted-foreground",
      icon: null,
      defaultLabel: "En attente",
    },
    loading: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-700 dark:text-blue-300",
      icon: <Loader2 className="h-3 w-3 animate-spin" />,
      defaultLabel: "Chargement",
    },
    success: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-700 dark:text-green-300",
      icon: <Check className="h-3 w-3" />,
      defaultLabel: "Succès",
    },
    error: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-700 dark:text-red-300",
      icon: <X className="h-3 w-3" />,
      defaultLabel: "Erreur",
    },
    warning: {
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      text: "text-yellow-700 dark:text-yellow-300",
      icon: <AlertCircle className="h-3 w-3" />,
      defaultLabel: "Attention",
    },
    info: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-700 dark:text-blue-300",
      icon: <Info className="h-3 w-3" />,
      defaultLabel: "Information",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.bg,
        config.text,
        className
      )}
    >
      {showIcon && config.icon}
      {label || config.defaultLabel}
    </span>
  );
}

// ============================================================================
// RIPPLE EFFECT - Effet de vague au clic
// ============================================================================

interface RippleProps {
  duration?: number;
  color?: string;
}

function useRipple({ duration = 600, color = "rgba(255, 255, 255, 0.3)" }: RippleProps = {}) {
  const [ripples, setRipples] = React.useState<
    Array<{ x: number; y: number; size: number; id: number }>
  >([]);

  const addRipple = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const element = event.currentTarget;
      const rect = element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      const newRipple = { x, y, size, id: Date.now() };
      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, duration);
    },
    [duration]
  );

  const RippleContainer = React.useMemo(
    () =>
      function RippleContainerComponent() {
        return (
          <span className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none">
            {ripples.map((ripple) => (
              <span
                key={ripple.id}
                className="absolute rounded-full animate-ripple"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  width: ripple.size,
                  height: ripple.size,
                  backgroundColor: color,
                  animationDuration: `${duration}ms`,
                }}
              />
            ))}
          </span>
        );
      },
    [ripples, color, duration]
  );

  return { addRipple, RippleContainer };
}

// ============================================================================
// ANIMATED COUNTER - Compteur animé
// ============================================================================

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  formatFn?: (value: number) => string;
  className?: string;
}

function AnimatedCounter({
  value,
  duration = 1000,
  formatFn = (v) => v.toLocaleString(),
  className,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = React.useState(0);
  const previousValue = React.useRef(0);

  React.useEffect(() => {
    const startValue = previousValue.current;
    const endValue = value;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * easeOut;

      setDisplayValue(Math.round(currentValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        previousValue.current = endValue;
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span className={className}>{formatFn(displayValue)}</span>;
}

// ============================================================================
// SKELETON PULSE - Animation de pulsation pour skeleton
// ============================================================================

interface SkeletonPulseProps {
  className?: string;
  children?: React.ReactNode;
}

function SkeletonPulse({ className, children }: SkeletonPulseProps) {
  return (
    <div className={cn("animate-pulse", className)}>
      {children}
    </div>
  );
}

// ============================================================================
// SHIMMER EFFECT - Effet de brillance
// ============================================================================

interface ShimmerProps {
  className?: string;
}

function Shimmer({ className }: ShimmerProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent",
        className
      )}
    />
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  LoadingButton,
  ProgressIndicator,
  PulseDot,
  StatusBadge,
  useRipple,
  AnimatedCounter,
  SkeletonPulse,
  Shimmer,
};
