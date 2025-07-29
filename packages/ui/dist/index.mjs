// src/index.ts
export * from "@greenlink/design-tokens";

// src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import React from "react";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
var focusRing = cn(
  "outline-none",
  "ring-2 ring-offset-2",
  "ring-primary-primary ring-offset-background-primary",
  "focus-visible:ring-2 focus-visible:ring-offset-2",
  "transition-all duration-fast"
);
var disabledStyles = cn(
  "disabled:opacity-50",
  "disabled:cursor-not-allowed",
  "disabled:pointer-events-none"
);
var animations = {
  fadeIn: "animate-fade-in",
  fadeOut: "animate-fade-out",
  slideInUp: "animate-slide-in-up",
  slideInDown: "animate-slide-in-down",
  scaleIn: "animate-scale-in",
  scaleOut: "animate-scale-out",
  spin: "animate-spin",
  pulse: "animate-pulse"
};
var sizes = {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl"
};
var intents = {
  primary: "primary",
  secondary: "secondary",
  success: "success",
  warning: "warning",
  error: "error",
  info: "info"
};
function getContrastColor(backgroundColor) {
  const darkColors = ["primary", "secondary", "success", "error"];
  return darkColors.some((color) => backgroundColor.includes(color)) ? "white" : "black";
}
function formatClassNames(classes) {
  return classes.split(" ").filter(Boolean).sort().join(" ");
}
function createContext(name) {
  const Context = React.createContext(void 0);
  function useContext3() {
    const context = React.useContext(Context);
    if (!context) {
      throw new Error(`use${name} must be used within ${name}Provider`);
    }
    return context;
  }
  return [Context.Provider, useContext3];
}

// src/components/atoms/Button.tsx
import * as React3 from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva as cva2 } from "class-variance-authority";

// src/components/atoms/Spinner.tsx
import * as React2 from "react";
import { cva } from "class-variance-authority";
import { jsx } from "react/jsx-runtime";
var spinnerVariants = cva(
  cn(
    "inline-block animate-spin rounded-full",
    "border-2 border-current border-t-transparent"
  ),
  {
    variants: {
      size: {
        xs: "h-3 w-3",
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
        xl: "h-8 w-8"
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
);
var Spinner = React2.forwardRef(
  ({ className, size, label = "Loading", ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        className: cn(spinnerVariants({ size }), className),
        role: "status",
        "aria-label": label,
        ...props,
        children: /* @__PURE__ */ jsx("span", { className: "sr-only", children: label })
      }
    );
  }
);
Spinner.displayName = "Spinner";

// src/components/atoms/Button.tsx
import { Fragment, jsx as jsx2, jsxs } from "react/jsx-runtime";
var buttonVariants = cva2(
  cn(
    // Base styles
    "inline-flex items-center justify-center gap-2",
    "font-button text-button font-semibold",
    "rounded-sm transition-all duration-normal",
    "select-none whitespace-nowrap",
    focusRing,
    disabledStyles,
    // Active state
    "active:scale-[0.98]"
  ),
  {
    variants: {
      variant: {
        primary: cn(
          "bg-primary-primary text-on-primary",
          "hover:bg-primary-secondary",
          "active:bg-primary-dark"
        ),
        secondary: cn(
          "bg-transparent text-primary-primary",
          "border-2 border-primary-primary",
          "hover:bg-primary-primary hover:text-on-primary",
          "active:bg-primary-dark active:border-primary-dark"
        ),
        tertiary: cn(
          "bg-transparent text-primary-primary",
          "hover:bg-interactive-hover",
          "active:bg-interactive-active"
        ),
        success: cn(
          "bg-status-success text-white",
          "hover:bg-status-success/90",
          "active:bg-status-success/80"
        ),
        error: cn(
          "bg-status-error text-white",
          "hover:bg-status-error/90",
          "active:bg-status-error/80"
        ),
        ghost: cn(
          "bg-transparent text-text-primary",
          "hover:bg-interactive-hover",
          "active:bg-interactive-active"
        ),
        link: cn(
          "bg-transparent text-primary-primary underline-offset-4",
          "hover:underline",
          "focus:underline",
          "px-0 h-auto"
        )
      },
      size: {
        xs: "h-7 px-3 text-caption",
        sm: "h-9 px-4 text-body-sm",
        md: "h-11 px-6 text-button",
        lg: "h-12 px-8 text-body-lg-mobile",
        xl: "h-14 px-10 text-body-lg-desktop"
      },
      fullWidth: {
        true: "w-full"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false
    }
  }
);
var Button = React3.forwardRef(
  ({
    className,
    variant,
    size,
    fullWidth,
    asChild = false,
    loading = false,
    leftIcon,
    rightIcon,
    disabled,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;
    return /* @__PURE__ */ jsx2(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, fullWidth }), className),
        ref,
        disabled: isDisabled,
        "aria-busy": loading,
        ...props,
        children: loading ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx2(Spinner, { size, className: "mr-2" }),
          children
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          leftIcon && /* @__PURE__ */ jsx2("span", { className: "inline-flex shrink-0", children: leftIcon }),
          children,
          rightIcon && /* @__PURE__ */ jsx2("span", { className: "inline-flex shrink-0", children: rightIcon })
        ] })
      }
    );
  }
);
Button.displayName = "Button";

// src/components/atoms/Input.tsx
import * as React4 from "react";
import { cva as cva3 } from "class-variance-authority";
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var inputVariants = cva3(
  cn(
    // Base styles
    "flex w-full rounded-sm",
    "border-2 border-border-primary",
    "bg-background-primary text-text-primary",
    "px-4 py-2",
    "font-body-medium text-body-md",
    "transition-all duration-fast",
    "placeholder:text-text-tertiary",
    focusRing,
    disabledStyles,
    // Hover state
    "hover:border-border-secondary",
    // Focus state
    "focus:border-primary-primary",
    // Invalid state
    "aria-[invalid=true]:border-status-error",
    "aria-[invalid=true]:focus:ring-status-error"
  ),
  {
    variants: {
      size: {
        xs: "h-7 px-3 text-caption",
        sm: "h-9 px-3 text-body-sm",
        md: "h-11 px-4 text-body-md",
        lg: "h-12 px-4 text-body-lg-mobile",
        xl: "h-14 px-5 text-body-lg-desktop"
      },
      variant: {
        default: "",
        filled: cn(
          "bg-background-secondary",
          "border-transparent",
          "hover:bg-background-tertiary",
          "focus:bg-background-primary focus:border-primary-primary"
        ),
        ghost: cn(
          "border-transparent",
          "hover:bg-background-secondary",
          "focus:bg-background-secondary focus:border-primary-primary"
        )
      },
      hasIcon: {
        left: "pl-10",
        right: "pr-10",
        both: "px-10"
      }
    },
    defaultVariants: {
      size: "md",
      variant: "default"
    }
  }
);
var Input = React4.forwardRef(
  ({
    className,
    type = "text",
    size,
    variant,
    leftElement,
    rightElement,
    error,
    disabled,
    ...props
  }, ref) => {
    const hasIcon = leftElement && rightElement ? "both" : leftElement ? "left" : rightElement ? "right" : void 0;
    return /* @__PURE__ */ jsxs2("div", { className: "relative inline-flex w-full", children: [
      leftElement && /* @__PURE__ */ jsx3("div", { className: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-secondary", children: leftElement }),
      /* @__PURE__ */ jsx3(
        "input",
        {
          type,
          className: cn(inputVariants({ size, variant, hasIcon }), className),
          ref,
          disabled,
          "aria-invalid": error || void 0,
          ...props
        }
      ),
      rightElement && /* @__PURE__ */ jsx3("div", { className: "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary", children: rightElement })
    ] });
  }
);
Input.displayName = "Input";

// src/components/atoms/Label.tsx
import * as React5 from "react";
import { cva as cva4 } from "class-variance-authority";
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
var labelVariants = cva4(
  cn(
    "block font-label text-label text-text-primary",
    "cursor-default select-none"
  ),
  {
    variants: {
      size: {
        sm: "text-caption",
        md: "text-label",
        lg: "text-body-md font-medium"
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed"
      }
    },
    defaultVariants: {
      size: "md",
      disabled: false
    }
  }
);
var Label = React5.forwardRef(
  ({
    className,
    size,
    disabled,
    required,
    helperText,
    error,
    children,
    ...props
  }, ref) => {
    return /* @__PURE__ */ jsxs3("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxs3(
        "label",
        {
          ref,
          className: cn(labelVariants({ size, disabled }), className),
          ...props,
          children: [
            children,
            required && /* @__PURE__ */ jsx4("span", { className: "ml-1 text-status-error", "aria-label": "required", children: "*" })
          ]
        }
      ),
      error && /* @__PURE__ */ jsx4("p", { className: "text-caption text-status-error", role: "alert", children: error }),
      helperText && !error && /* @__PURE__ */ jsx4("p", { className: "text-caption text-text-secondary", children: helperText })
    ] });
  }
);
Label.displayName = "Label";

// src/components/atoms/Badge.tsx
import * as React6 from "react";
import { cva as cva5 } from "class-variance-authority";
import { jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
var badgeVariants = cva5(
  cn(
    "inline-flex items-center gap-1",
    "rounded-full font-medium",
    "transition-colors duration-fast"
  ),
  {
    variants: {
      variant: {
        default: cn(
          "bg-primary-primary/10 text-primary-primary",
          "border border-primary-primary/20"
        ),
        secondary: cn(
          "bg-secondary-primary/10 text-secondary-primary",
          "border border-secondary-primary/20"
        ),
        success: cn(
          "bg-status-success/10 text-status-success",
          "border border-status-success/20"
        ),
        warning: cn(
          "bg-status-warning/10 text-status-warning",
          "border border-status-warning/20"
        ),
        error: cn(
          "bg-status-error/10 text-status-error",
          "border border-status-error/20"
        ),
        info: cn(
          "bg-status-info/10 text-status-info",
          "border border-status-info/20"
        ),
        outline: cn(
          "bg-transparent text-text-primary",
          "border border-border-primary"
        )
      },
      size: {
        xs: "px-2 py-0.5 text-[10px]",
        sm: "px-2.5 py-0.5 text-caption",
        md: "px-3 py-1 text-body-sm",
        lg: "px-4 py-1.5 text-body-md"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);
var Badge = React6.forwardRef(
  ({ className, variant, size, icon, dot, children, ...props }, ref) => {
    return /* @__PURE__ */ jsxs4(
      "span",
      {
        ref,
        className: cn(badgeVariants({ variant, size }), className),
        ...props,
        children: [
          dot && /* @__PURE__ */ jsx5("span", { className: "h-1.5 w-1.5 rounded-full bg-current", "aria-hidden": "true" }),
          icon && /* @__PURE__ */ jsx5("span", { className: "inline-flex shrink-0", children: icon }),
          children
        ]
      }
    );
  }
);
Badge.displayName = "Badge";

// src/components/atoms/Card.tsx
import * as React7 from "react";
import { cva as cva6 } from "class-variance-authority";
import { jsx as jsx6 } from "react/jsx-runtime";
var cardVariants = cva6(
  cn(
    "rounded-lg transition-all duration-normal",
    "bg-background-primary"
  ),
  {
    variants: {
      variant: {
        elevated: cn(
          "border border-border-primary",
          "shadow-md hover:shadow-lg"
        ),
        outlined: cn(
          "border-2 border-border-primary",
          "hover:border-border-secondary"
        ),
        filled: cn(
          "bg-background-secondary",
          "hover:bg-background-tertiary"
        ),
        ghost: cn(
          "hover:bg-background-secondary"
        )
      },
      padding: {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        xl: "p-10"
      },
      interactive: {
        true: cn(
          "cursor-pointer",
          "active:scale-[0.99]",
          "focus:outline-none focus:ring-2 focus:ring-primary-primary focus:ring-offset-2"
        )
      }
    },
    defaultVariants: {
      variant: "elevated",
      padding: "md",
      interactive: false
    }
  }
);
var CardRoot = React7.forwardRef(
  ({ className, variant, padding, interactive, asButton, ...props }, ref) => {
    if (asButton) {
      return /* @__PURE__ */ jsx6(
        "button",
        {
          ref,
          className: cn(
            cardVariants({ variant, padding, interactive: true }),
            className
          ),
          ...props
        }
      );
    }
    return /* @__PURE__ */ jsx6(
      "div",
      {
        ref,
        className: cn(
          cardVariants({ variant, padding, interactive }),
          className
        ),
        ...props
      }
    );
  }
);
CardRoot.displayName = "Card";
var CardHeader = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx6(
  "div",
  {
    ref,
    className: cn("space-y-1.5", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
var CardTitle = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx6(
  "h3",
  {
    ref,
    className: cn("text-h6-desktop font-semibold leading-none tracking-tight", className),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
var CardDescription = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx6(
  "p",
  {
    ref,
    className: cn("text-body-sm text-text-secondary", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
var CardContent = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx6("div", { ref, className: cn("pt-4", className), ...props }));
CardContent.displayName = "CardContent";
var CardFooter = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx6(
  "div",
  {
    ref,
    className: cn("flex items-center pt-4", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
var Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter
});

// src/components/atoms/Avatar.tsx
import * as React8 from "react";
import { cva as cva7 } from "class-variance-authority";
import { jsx as jsx7, jsxs as jsxs5 } from "react/jsx-runtime";
var avatarVariants = cva7(
  cn(
    "relative inline-flex items-center justify-center overflow-hidden",
    "rounded-full bg-background-secondary",
    "font-medium text-text-primary",
    "select-none shrink-0"
  ),
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-[10px]",
        sm: "h-8 w-8 text-caption",
        md: "h-10 w-10 text-body-sm",
        lg: "h-12 w-12 text-body-md",
        xl: "h-16 w-16 text-body-lg-mobile",
        "2xl": "h-20 w-20 text-body-lg-desktop"
      },
      status: {
        online: "",
        offline: "",
        busy: "",
        away: ""
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
);
var statusIndicatorVariants = cva7(
  cn(
    "absolute bottom-0 right-0",
    "rounded-full border-2 border-background-primary"
  ),
  {
    variants: {
      size: {
        xs: "h-1.5 w-1.5",
        sm: "h-2 w-2",
        md: "h-2.5 w-2.5",
        lg: "h-3 w-3",
        xl: "h-4 w-4",
        "2xl": "h-5 w-5"
      },
      status: {
        online: "bg-status-success",
        offline: "bg-text-tertiary",
        busy: "bg-status-error",
        away: "bg-status-warning"
      }
    }
  }
);
var Avatar = React8.forwardRef(
  ({ className, size, status, src, alt, fallback, icon, ...props }, ref) => {
    const [imageError, setImageError] = React8.useState(false);
    return /* @__PURE__ */ jsxs5(
      "div",
      {
        ref,
        className: cn(avatarVariants({ size }), className),
        ...props,
        children: [
          src && !imageError ? /* @__PURE__ */ jsx7(
            "img",
            {
              src,
              alt: alt || "Avatar",
              className: "h-full w-full object-cover",
              onError: () => setImageError(true)
            }
          ) : icon ? /* @__PURE__ */ jsx7("span", { className: "flex h-full w-full items-center justify-center", children: icon }) : fallback ? /* @__PURE__ */ jsx7("span", { className: "uppercase", children: fallback.slice(0, 2) }) : /* @__PURE__ */ jsx7(
            "svg",
            {
              className: "h-[60%] w-[60%] text-text-secondary",
              fill: "currentColor",
              viewBox: "0 0 20 20",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ jsx7(
                "path",
                {
                  fillRule: "evenodd",
                  d: "M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z",
                  clipRule: "evenodd"
                }
              )
            }
          ),
          status && /* @__PURE__ */ jsx7(
            "span",
            {
              className: cn(statusIndicatorVariants({ size, status })),
              "aria-label": `Status: ${status}`
            }
          )
        ]
      }
    );
  }
);
Avatar.displayName = "Avatar";

// src/components/atoms/Divider.tsx
import * as React9 from "react";
import { cva as cva8 } from "class-variance-authority";
import { jsx as jsx8, jsxs as jsxs6 } from "react/jsx-runtime";
var dividerVariants = cva8("", {
  variants: {
    orientation: {
      horizontal: "w-full h-px",
      vertical: "h-full w-px"
    },
    variant: {
      solid: "bg-border-primary",
      dashed: "bg-gradient-to-r from-transparent via-border-primary to-transparent",
      dotted: "bg-gradient-to-r from-transparent via-border-primary to-transparent"
    }
  },
  defaultVariants: {
    orientation: "horizontal",
    variant: "solid"
  }
});
var Divider = React9.forwardRef(
  ({
    className,
    orientation,
    variant,
    text,
    textPosition = "center",
    children,
    ...props
  }, ref) => {
    const content = children || text;
    if (!content || orientation === "vertical") {
      return /* @__PURE__ */ jsx8(
        "div",
        {
          ref,
          className: cn(dividerVariants({ orientation, variant }), className),
          role: "separator",
          "aria-orientation": orientation || void 0,
          ...props
        }
      );
    }
    return /* @__PURE__ */ jsxs6(
      "div",
      {
        ref,
        className: cn("relative flex items-center", className),
        role: "separator",
        "aria-orientation": orientation || void 0,
        ...props,
        children: [
          textPosition !== "left" && /* @__PURE__ */ jsx8("div", { className: cn("flex-1", dividerVariants({ orientation, variant })) }),
          /* @__PURE__ */ jsx8("span", { className: "mx-4 flex-shrink-0 text-body-sm text-text-secondary", children: content }),
          textPosition !== "right" && /* @__PURE__ */ jsx8("div", { className: cn("flex-1", dividerVariants({ orientation, variant })) })
        ]
      }
    );
  }
);
Divider.displayName = "Divider";

// src/components/atoms/IconButton.tsx
import * as React10 from "react";
import { Slot as Slot2 } from "@radix-ui/react-slot";
import { cva as cva9 } from "class-variance-authority";
import { jsx as jsx9 } from "react/jsx-runtime";
var iconButtonVariants = cva9(
  cn(
    // Base styles
    "inline-flex items-center justify-center",
    "rounded-sm transition-all duration-normal",
    "select-none",
    focusRing,
    disabledStyles,
    // Active state
    "active:scale-[0.92]"
  ),
  {
    variants: {
      variant: {
        primary: cn(
          "bg-primary-primary text-on-primary",
          "hover:bg-primary-secondary",
          "active:bg-primary-dark"
        ),
        secondary: cn(
          "bg-transparent text-primary-primary",
          "border-2 border-primary-primary",
          "hover:bg-primary-primary hover:text-on-primary",
          "active:bg-primary-dark active:border-primary-dark"
        ),
        tertiary: cn(
          "bg-transparent text-primary-primary",
          "hover:bg-interactive-hover",
          "active:bg-interactive-active"
        ),
        ghost: cn(
          "bg-transparent text-text-primary",
          "hover:bg-interactive-hover",
          "active:bg-interactive-active"
        ),
        success: cn(
          "bg-status-success text-white",
          "hover:bg-status-success/90",
          "active:bg-status-success/80"
        ),
        error: cn(
          "bg-status-error text-white",
          "hover:bg-status-error/90",
          "active:bg-status-error/80"
        )
      },
      size: {
        xs: "h-7 w-7 [&>svg]:h-3 [&>svg]:w-3",
        sm: "h-9 w-9 [&>svg]:h-4 [&>svg]:w-4",
        md: "h-11 w-11 [&>svg]:h-5 [&>svg]:w-5",
        lg: "h-12 w-12 [&>svg]:h-6 [&>svg]:w-6",
        xl: "h-14 w-14 [&>svg]:h-8 [&>svg]:w-8"
      }
    },
    defaultVariants: {
      variant: "ghost",
      size: "md"
    }
  }
);
var IconButton = React10.forwardRef(
  ({
    className,
    variant,
    size,
    asChild = false,
    loading = false,
    disabled,
    label,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot2 : "button";
    const isDisabled = disabled || loading;
    return /* @__PURE__ */ jsx9(
      Comp,
      {
        className: cn(iconButtonVariants({ variant, size }), className),
        ref,
        disabled: isDisabled,
        "aria-label": label,
        "aria-busy": loading,
        ...props,
        children: loading ? /* @__PURE__ */ jsx9(Spinner, { size }) : children
      }
    );
  }
);
IconButton.displayName = "IconButton";

// src/components/atoms/Link.tsx
import * as React11 from "react";
import { Slot as Slot3 } from "@radix-ui/react-slot";
import { cva as cva10 } from "class-variance-authority";
import { jsx as jsx10 } from "react/jsx-runtime";
var linkVariants = cva10(
  cn(
    "inline-flex items-center gap-1",
    "font-link text-link",
    "transition-all duration-fast",
    "cursor-pointer",
    focusRing
  ),
  {
    variants: {
      variant: {
        default: cn(
          "text-primary-primary underline-offset-4",
          "hover:underline",
          "active:text-primary-dark"
        ),
        subtle: cn(
          "text-text-secondary underline-offset-4",
          "hover:text-text-primary hover:underline",
          "active:text-primary-primary"
        ),
        inline: cn(
          "text-inherit underline underline-offset-4",
          "hover:text-primary-primary",
          "active:text-primary-dark"
        ),
        standalone: cn(
          "text-primary-primary font-medium",
          "hover:text-primary-secondary",
          "active:text-primary-dark"
        )
      },
      size: {
        sm: "text-body-sm",
        md: "text-body-md",
        lg: "text-body-lg-mobile"
      },
      external: {
        true: 'after:content-["_\u2197"] after:text-[0.8em]'
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      external: false
    }
  }
);
var Link = React11.forwardRef(
  ({
    className,
    variant,
    size,
    external,
    asChild = false,
    showExternal,
    target,
    rel,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot3 : "a";
    const isExternal = external || showExternal || target === "_blank";
    return /* @__PURE__ */ jsx10(
      Comp,
      {
        className: cn(linkVariants({ variant, size, external: isExternal }), className),
        ref,
        target,
        rel: isExternal ? rel || "noopener noreferrer" : rel,
        ...props
      }
    );
  }
);
Link.displayName = "Link";

// src/components/atoms/Text.tsx
import * as React12 from "react";
import { Slot as Slot4 } from "@radix-ui/react-slot";
import { cva as cva11 } from "class-variance-authority";
import { jsx as jsx11 } from "react/jsx-runtime";
var textVariants = cva11("", {
  variants: {
    variant: {
      body: "text-text-primary",
      caption: "text-text-secondary",
      label: "font-medium text-text-primary",
      helper: "text-text-tertiary",
      error: "text-status-error",
      success: "text-status-success",
      warning: "text-status-warning",
      info: "text-status-info"
    },
    size: {
      xs: "text-[10px]",
      sm: "text-body-sm",
      md: "text-body-md",
      lg: "text-body-lg-mobile md:text-body-lg-desktop"
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold"
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify"
    },
    truncate: {
      true: "truncate",
      clamp1: "line-clamp-1",
      clamp2: "line-clamp-2",
      clamp3: "line-clamp-3",
      clamp4: "line-clamp-4"
    }
  },
  defaultVariants: {
    variant: "body",
    size: "md",
    weight: "normal",
    align: "left"
  }
});
var Text = React12.forwardRef(
  ({
    className,
    variant,
    size,
    weight,
    align,
    truncate,
    as = "span",
    asChild = false,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot4 : as;
    return /* @__PURE__ */ jsx11(
      Comp,
      {
        className: cn(
          textVariants({ variant, size, weight, align, truncate }),
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Text.displayName = "Text";

// src/components/atoms/Heading.tsx
import * as React13 from "react";
import { Slot as Slot5 } from "@radix-ui/react-slot";
import { cva as cva12 } from "class-variance-authority";
import { jsx as jsx12 } from "react/jsx-runtime";
var headingVariants = cva12(
  "font-heading font-bold text-text-primary",
  {
    variants: {
      level: {
        h1: "text-h1-mobile md:text-h1-desktop",
        h2: "text-h2-mobile md:text-h2-desktop",
        h3: "text-h3-mobile md:text-h3-desktop",
        h4: "text-h4-mobile md:text-h4-desktop",
        h5: "text-h5-mobile md:text-h5-desktop",
        h6: "text-h6-mobile md:text-h6-desktop"
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right"
      },
      color: {
        default: "text-text-primary",
        secondary: "text-text-secondary",
        primary: "text-primary-primary",
        inverse: "text-text-inverse"
      },
      tracking: {
        tight: "tracking-tight",
        normal: "tracking-normal",
        wide: "tracking-wide"
      }
    },
    defaultVariants: {
      level: "h2",
      align: "left",
      color: "default",
      tracking: "tight"
    }
  }
);
var Heading = React13.forwardRef(
  ({
    className,
    level,
    align,
    color,
    tracking,
    as,
    asChild = false,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot5 : as || level || "h2";
    return /* @__PURE__ */ jsx12(
      Comp,
      {
        className: cn(
          headingVariants({ level: level || as || "h2", align, color, tracking }),
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Heading.displayName = "Heading";

// src/components/atoms/Switch.tsx
import * as React14 from "react";
import { cva as cva13 } from "class-variance-authority";
import { jsx as jsx13, jsxs as jsxs7 } from "react/jsx-runtime";
var switchVariants = cva13(
  cn(
    "relative inline-flex shrink-0 cursor-pointer items-center",
    "rounded-full transition-colors duration-normal",
    focusRing,
    disabledStyles
  ),
  {
    variants: {
      size: {
        sm: "h-5 w-9",
        md: "h-6 w-11",
        lg: "h-7 w-14"
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
);
var thumbVariants = cva13(
  cn(
    "pointer-events-none block rounded-full",
    "bg-white shadow-sm",
    "transition-transform duration-normal"
  ),
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6"
      },
      checked: {
        true: "",
        false: ""
      }
    },
    compoundVariants: [
      {
        size: "sm",
        checked: false,
        className: "translate-x-0.5"
      },
      {
        size: "sm",
        checked: true,
        className: "translate-x-[18px]"
      },
      {
        size: "md",
        checked: false,
        className: "translate-x-0.5"
      },
      {
        size: "md",
        checked: true,
        className: "translate-x-[22px]"
      },
      {
        size: "lg",
        checked: false,
        className: "translate-x-0.5"
      },
      {
        size: "lg",
        checked: true,
        className: "translate-x-[30px]"
      }
    ],
    defaultVariants: {
      size: "md",
      checked: false
    }
  }
);
var Switch = React14.forwardRef(
  ({
    className,
    size,
    checked,
    defaultChecked,
    disabled,
    label,
    labelPosition = "right",
    onChange,
    ...props
  }, ref) => {
    const [isChecked, setIsChecked] = React14.useState(defaultChecked || false);
    const controlledChecked = checked !== void 0 ? checked : isChecked;
    const handleChange = (e) => {
      if (checked === void 0) {
        setIsChecked(e.target.checked);
      }
      onChange?.(e);
    };
    const switchElement = /* @__PURE__ */ jsxs7("label", { className: "relative inline-flex cursor-pointer items-center", children: [
      /* @__PURE__ */ jsx13(
        "input",
        {
          type: "checkbox",
          className: "sr-only",
          ref,
          checked: controlledChecked,
          disabled,
          onChange: handleChange,
          ...props
        }
      ),
      /* @__PURE__ */ jsx13(
        "div",
        {
          className: cn(
            switchVariants({ size }),
            controlledChecked ? "bg-primary-primary" : "bg-border-secondary",
            className
          ),
          "aria-hidden": "true",
          children: /* @__PURE__ */ jsx13(
            "span",
            {
              className: cn(thumbVariants({ size, checked: controlledChecked }))
            }
          )
        }
      )
    ] });
    if (!label) {
      return switchElement;
    }
    return /* @__PURE__ */ jsxs7("div", { className: "inline-flex items-center gap-3", children: [
      labelPosition === "left" && /* @__PURE__ */ jsx13("span", { className: cn("text-body-md", disabled && "opacity-50"), children: label }),
      switchElement,
      labelPosition === "right" && /* @__PURE__ */ jsx13("span", { className: cn("text-body-md", disabled && "opacity-50"), children: label })
    ] });
  }
);
Switch.displayName = "Switch";

// src/components/atoms/Checkbox.tsx
import * as React15 from "react";
import { Check, Minus } from "lucide-react";
import { cva as cva14 } from "class-variance-authority";
import { jsx as jsx14, jsxs as jsxs8 } from "react/jsx-runtime";
var checkboxVariants = cva14(
  cn(
    "peer shrink-0 rounded-sm border-2",
    "transition-all duration-fast",
    focusRing,
    disabledStyles,
    "cursor-pointer"
  ),
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6"
      },
      variant: {
        default: cn(
          "border-border-primary bg-background-primary",
          "hover:border-border-secondary",
          "data-[state=checked]:border-primary-primary data-[state=checked]:bg-primary-primary",
          "data-[state=indeterminate]:border-primary-primary data-[state=indeterminate]:bg-primary-primary"
        ),
        filled: cn(
          "border-transparent bg-background-secondary",
          "hover:bg-background-tertiary",
          "data-[state=checked]:border-primary-primary data-[state=checked]:bg-primary-primary",
          "data-[state=indeterminate]:border-primary-primary data-[state=indeterminate]:bg-primary-primary"
        )
      }
    },
    defaultVariants: {
      size: "md",
      variant: "default"
    }
  }
);
var Checkbox = React15.forwardRef(
  ({
    className,
    size,
    variant,
    checked,
    defaultChecked,
    disabled,
    label,
    indeterminate = false,
    helperText,
    error,
    onChange,
    ...props
  }, ref) => {
    const [isChecked, setIsChecked] = React15.useState(defaultChecked || false);
    const controlledChecked = checked !== void 0 ? checked : isChecked;
    const handleChange = (e) => {
      if (checked === void 0) {
        setIsChecked(e.target.checked);
      }
      onChange?.(e);
    };
    const checkboxElement = /* @__PURE__ */ jsxs8("div", { className: "relative inline-flex", children: [
      /* @__PURE__ */ jsx14(
        "input",
        {
          type: "checkbox",
          className: "sr-only",
          ref,
          checked: controlledChecked,
          disabled,
          onChange: handleChange,
          "aria-invalid": !!error,
          ...props
        }
      ),
      /* @__PURE__ */ jsx14(
        "div",
        {
          className: cn(checkboxVariants({ size, variant }), className),
          "data-state": indeterminate ? "indeterminate" : controlledChecked ? "checked" : "unchecked",
          "aria-hidden": "true",
          children: indeterminate ? /* @__PURE__ */ jsx14(Minus, { className: "h-full w-full text-white", strokeWidth: 3 }) : controlledChecked ? /* @__PURE__ */ jsx14(Check, { className: "h-full w-full text-white", strokeWidth: 3 }) : null
        }
      )
    ] });
    if (!label && !helperText && !error) {
      return checkboxElement;
    }
    return /* @__PURE__ */ jsxs8(
      "label",
      {
        className: cn(
          "flex gap-3",
          disabled && "cursor-not-allowed opacity-50"
        ),
        children: [
          checkboxElement,
          /* @__PURE__ */ jsxs8("div", { className: "flex flex-col gap-1", children: [
            label && /* @__PURE__ */ jsx14("span", { className: "text-body-md leading-none", children: label }),
            error && /* @__PURE__ */ jsx14("span", { className: "text-caption text-status-error", role: "alert", children: error }),
            helperText && !error && /* @__PURE__ */ jsx14("span", { className: "text-caption text-text-secondary", children: helperText })
          ] })
        ]
      }
    );
  }
);
Checkbox.displayName = "Checkbox";

// src/components/atoms/Radio.tsx
import * as React16 from "react";
import { cva as cva15 } from "class-variance-authority";
import { jsx as jsx15, jsxs as jsxs9 } from "react/jsx-runtime";
var radioVariants = cva15(
  cn(
    "peer shrink-0 rounded-full border-2",
    "transition-all duration-fast",
    focusRing,
    disabledStyles,
    "cursor-pointer"
  ),
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6"
      },
      variant: {
        default: cn(
          "border-border-primary bg-background-primary",
          "hover:border-border-secondary",
          "data-[state=checked]:border-primary-primary"
        ),
        filled: cn(
          "border-transparent bg-background-secondary",
          "hover:bg-background-tertiary",
          "data-[state=checked]:border-primary-primary"
        )
      }
    },
    defaultVariants: {
      size: "md",
      variant: "default"
    }
  }
);
var dotVariants = cva15(
  cn(
    "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
    "rounded-full bg-primary-primary",
    "opacity-0 transition-opacity duration-fast",
    "peer-data-[state=checked]:opacity-100"
  ),
  {
    variants: {
      size: {
        sm: "h-2 w-2",
        md: "h-2.5 w-2.5",
        lg: "h-3 w-3"
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
);
var Radio = React16.forwardRef(
  ({
    className,
    size,
    variant,
    checked,
    disabled,
    label,
    helperText,
    error,
    ...props
  }, ref) => {
    const radioElement = /* @__PURE__ */ jsxs9("div", { className: "relative inline-flex", children: [
      /* @__PURE__ */ jsx15(
        "input",
        {
          type: "radio",
          className: "sr-only peer",
          ref,
          checked,
          disabled,
          "aria-invalid": !!error,
          ...props
        }
      ),
      /* @__PURE__ */ jsx15(
        "div",
        {
          className: cn(radioVariants({ size, variant }), className),
          "data-state": checked ? "checked" : "unchecked",
          "aria-hidden": "true",
          children: /* @__PURE__ */ jsx15("span", { className: cn(dotVariants({ size })) })
        }
      )
    ] });
    if (!label && !helperText && !error) {
      return radioElement;
    }
    return /* @__PURE__ */ jsxs9(
      "label",
      {
        className: cn(
          "flex gap-3",
          disabled && "cursor-not-allowed opacity-50"
        ),
        children: [
          radioElement,
          /* @__PURE__ */ jsxs9("div", { className: "flex flex-col gap-1", children: [
            label && /* @__PURE__ */ jsx15("span", { className: "text-body-md leading-none", children: label }),
            error && /* @__PURE__ */ jsx15("span", { className: "text-caption text-status-error", role: "alert", children: error }),
            helperText && !error && /* @__PURE__ */ jsx15("span", { className: "text-caption text-text-secondary", children: helperText })
          ] })
        ]
      }
    );
  }
);
Radio.displayName = "Radio";
var RadioGroupContext = React16.createContext({});
var RadioGroup = React16.forwardRef(
  ({
    className,
    name,
    value,
    defaultValue,
    onValueChange,
    orientation = "vertical",
    children,
    ...props
  }, ref) => {
    const [selectedValue, setSelectedValue] = React16.useState(defaultValue);
    const controlledValue = value !== void 0 ? value : selectedValue;
    const handleChange = (newValue) => {
      if (value === void 0) {
        setSelectedValue(newValue);
      }
      onValueChange?.(newValue);
    };
    return /* @__PURE__ */ jsx15(
      RadioGroupContext.Provider,
      {
        value: { name, value: controlledValue, onChange: handleChange },
        children: /* @__PURE__ */ jsx15(
          "div",
          {
            ref,
            role: "radiogroup",
            className: cn(
              "flex",
              orientation === "vertical" ? "flex-col gap-3" : "flex-row gap-6",
              className
            ),
            ...props,
            children
          }
        )
      }
    );
  }
);
RadioGroup.displayName = "RadioGroup";
var RadioGroupItem = React16.forwardRef(
  ({ value, onChange, ...props }, ref) => {
    const context = React16.useContext(RadioGroupContext);
    return /* @__PURE__ */ jsx15(
      Radio,
      {
        ref,
        name: context.name,
        value,
        checked: context.value === value,
        onChange: (e) => {
          onChange?.(e);
          if (e.target.checked) {
            context.onChange?.(value);
          }
        },
        ...props
      }
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";

// src/components/atoms/Textarea.tsx
import * as React17 from "react";
import { cva as cva16 } from "class-variance-authority";
import { jsx as jsx16, jsxs as jsxs10 } from "react/jsx-runtime";
var textareaVariants = cva16(
  cn(
    "flex w-full rounded-md border-2 px-3 py-2",
    "text-body-md placeholder:text-text-tertiary",
    "transition-colors duration-fast",
    "resize-y min-h-[80px]",
    focusRing,
    disabledStyles
  ),
  {
    variants: {
      variant: {
        default: cn(
          "border-border-primary bg-background-primary",
          "hover:border-border-secondary",
          "focus:border-primary-primary"
        ),
        filled: cn(
          "border-transparent bg-background-secondary",
          "hover:bg-background-tertiary",
          "focus:border-primary-primary focus:bg-background-primary"
        ),
        ghost: cn(
          "border-transparent bg-transparent",
          "hover:bg-background-secondary",
          "focus:border-primary-primary focus:bg-background-primary"
        )
      },
      size: {
        sm: "px-2.5 py-1.5 text-body-sm min-h-[60px]",
        md: "px-3 py-2 text-body-md min-h-[80px]",
        lg: "px-4 py-3 text-body-lg-mobile md:text-body-lg-desktop min-h-[100px]"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);
var Textarea = React17.forwardRef(
  ({
    className,
    variant,
    size,
    label,
    helperText,
    error,
    autoResize = false,
    maxHeight = 300,
    onChange,
    ...props
  }, ref) => {
    const textareaRef = React17.useRef(null);
    const combinedRef = React17.useMemo(
      () => ref || textareaRef,
      [ref]
    );
    const adjustHeight = React17.useCallback(() => {
      const textarea = combinedRef.current;
      if (!textarea || !autoResize) return;
      textarea.style.height = "auto";
      const scrollHeight = Math.min(textarea.scrollHeight, maxHeight);
      textarea.style.height = `${scrollHeight}px`;
      textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
    }, [autoResize, maxHeight, combinedRef]);
    React17.useEffect(() => {
      if (autoResize) {
        adjustHeight();
      }
    }, [adjustHeight, autoResize]);
    const handleChange = (e) => {
      onChange?.(e);
      if (autoResize) {
        adjustHeight();
      }
    };
    const textareaElement = /* @__PURE__ */ jsx16(
      "textarea",
      {
        className: cn(
          textareaVariants({ variant, size }),
          error && "border-status-error focus:border-status-error",
          className
        ),
        ref: combinedRef,
        "aria-invalid": !!error,
        onChange: handleChange,
        ...props
      }
    );
    if (!label && !helperText && !error) {
      return textareaElement;
    }
    return /* @__PURE__ */ jsxs10("div", { className: "w-full space-y-2", children: [
      label && /* @__PURE__ */ jsxs10("label", { className: "block text-body-sm font-medium text-text-primary", children: [
        label,
        props.required && /* @__PURE__ */ jsx16("span", { className: "ml-1 text-status-error", "aria-label": "required", children: "*" })
      ] }),
      textareaElement,
      error && /* @__PURE__ */ jsx16("p", { className: "text-caption text-status-error", role: "alert", children: error }),
      helperText && !error && /* @__PURE__ */ jsx16("p", { className: "text-caption text-text-secondary", children: helperText })
    ] });
  }
);
Textarea.displayName = "Textarea";

// src/components/atoms/Select.tsx
import * as React18 from "react";
import { ChevronDown, Check as Check2, X, Search } from "lucide-react";
import { cva as cva17 } from "class-variance-authority";
import { jsx as jsx17, jsxs as jsxs11 } from "react/jsx-runtime";
var selectVariants = cva17(
  cn(
    "flex min-h-[40px] w-full items-center justify-between rounded-md border-2 px-3 py-2",
    "text-body-md cursor-pointer",
    "transition-colors duration-fast",
    focusRing,
    disabledStyles
  ),
  {
    variants: {
      variant: {
        default: cn(
          "border-border-primary bg-background-primary",
          "hover:border-border-secondary",
          "focus:border-primary-primary"
        ),
        filled: cn(
          "border-transparent bg-background-secondary",
          "hover:bg-background-tertiary",
          "focus:border-primary-primary focus:bg-background-primary"
        ),
        ghost: cn(
          "border-transparent bg-transparent",
          "hover:bg-background-secondary",
          "focus:border-primary-primary focus:bg-background-primary"
        )
      },
      size: {
        sm: "min-h-[32px] px-2.5 py-1.5 text-body-sm",
        md: "min-h-[40px] px-3 py-2 text-body-md",
        lg: "min-h-[48px] px-4 py-3 text-body-lg-mobile md:text-body-lg-desktop"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);
var Select = React18.forwardRef(
  ({
    className,
    variant,
    size,
    options = [],
    value,
    defaultValue,
    placeholder = "Select option...",
    label,
    helperText,
    error,
    disabled = false,
    multiple = false,
    searchable = false,
    searchPlaceholder = "Search...",
    clearable = false,
    maxHeight = 240,
    onChange,
    onSearch,
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = React18.useState(false);
    const [searchQuery, setSearchQuery] = React18.useState("");
    const [internalValue, setInternalValue] = React18.useState(
      defaultValue || (multiple ? [] : "")
    );
    const selectRef = React18.useRef(null);
    const searchRef = React18.useRef(null);
    const dropdownRef = React18.useRef(null);
    const currentValue = value !== void 0 ? value : internalValue;
    const selectedOptions = React18.useMemo(() => {
      if (multiple && Array.isArray(currentValue)) {
        return options.filter((option) => currentValue.includes(option.value));
      }
      if (!multiple && typeof currentValue === "string") {
        return options.filter((option) => option.value === currentValue);
      }
      return [];
    }, [options, currentValue, multiple]);
    const filteredOptions = React18.useMemo(() => {
      if (!searchQuery) return options;
      return options.filter(
        (option) => option.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [options, searchQuery]);
    const groupedOptions = React18.useMemo(() => {
      const groups = {};
      filteredOptions.forEach((option) => {
        const group = option.group || "default";
        if (!groups[group]) groups[group] = [];
        groups[group].push(option);
      });
      return groups;
    }, [filteredOptions]);
    const handleToggle = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
        if (!isOpen && searchable) {
          setTimeout(() => searchRef.current?.focus(), 0);
        }
      }
    };
    const handleSelect = (optionValue) => {
      let newValue;
      if (multiple && Array.isArray(currentValue)) {
        newValue = currentValue.includes(optionValue) ? currentValue.filter((v) => v !== optionValue) : [...currentValue, optionValue];
      } else {
        newValue = optionValue;
        setIsOpen(false);
      }
      if (value === void 0) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    };
    const handleClear = (e) => {
      e.stopPropagation();
      const newValue = multiple ? [] : "";
      if (value === void 0) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    };
    const handleSearchChange = (e) => {
      const query = e.target.value;
      setSearchQuery(query);
      onSearch?.(query);
    };
    React18.useEffect(() => {
      const handleClickOutside = (event) => {
        if (selectRef.current && !selectRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [isOpen]);
    React18.useEffect(() => {
      const handleKeyDown = (event) => {
        if (!isOpen) return;
        switch (event.key) {
          case "Escape":
            setIsOpen(false);
            break;
          case "ArrowDown":
          case "ArrowUp":
            event.preventDefault();
            break;
          case "Enter":
            event.preventDefault();
            break;
        }
      };
      if (isOpen) {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
      }
    }, [isOpen]);
    const displayValue = React18.useMemo(() => {
      if (selectedOptions.length === 0) return placeholder;
      if (multiple) {
        return selectedOptions.length === 1 ? selectedOptions[0].label : `${selectedOptions.length} selected`;
      }
      return selectedOptions[0]?.label || placeholder;
    }, [selectedOptions, placeholder, multiple]);
    const selectElement = /* @__PURE__ */ jsxs11("div", { className: "relative w-full", ref: selectRef, children: [
      /* @__PURE__ */ jsxs11(
        "div",
        {
          className: cn(
            selectVariants({ variant, size }),
            error && "border-status-error focus:border-status-error",
            isOpen && "border-primary-primary",
            className
          ),
          onClick: handleToggle,
          role: "combobox",
          "aria-expanded": isOpen,
          "aria-haspopup": "listbox",
          "aria-invalid": !!error,
          tabIndex: disabled ? -1 : 0,
          ref,
          ...props,
          children: [
            /* @__PURE__ */ jsx17(
              "span",
              {
                className: cn(
                  "flex-1 truncate",
                  selectedOptions.length === 0 && "text-text-tertiary"
                ),
                children: displayValue
              }
            ),
            /* @__PURE__ */ jsxs11("div", { className: "flex items-center gap-2", children: [
              clearable && selectedOptions.length > 0 && !disabled && /* @__PURE__ */ jsx17(
                "button",
                {
                  type: "button",
                  onClick: handleClear,
                  className: "rounded p-0.5 hover:bg-background-secondary",
                  tabIndex: -1,
                  children: /* @__PURE__ */ jsx17(X, { className: "h-4 w-4 text-text-secondary" })
                }
              ),
              /* @__PURE__ */ jsx17(
                ChevronDown,
                {
                  className: cn(
                    "h-4 w-4 text-text-secondary transition-transform duration-fast",
                    isOpen && "rotate-180"
                  )
                }
              )
            ] })
          ]
        }
      ),
      isOpen && /* @__PURE__ */ jsxs11(
        "div",
        {
          ref: dropdownRef,
          className: cn(
            "absolute z-50 mt-1 w-full rounded-md border border-border-primary",
            "bg-background-primary shadow-lg",
            "animate-in fade-in-0 zoom-in-95"
          ),
          style: { maxHeight },
          children: [
            searchable && /* @__PURE__ */ jsx17("div", { className: "border-b border-border-primary p-2", children: /* @__PURE__ */ jsxs11("div", { className: "relative", children: [
              /* @__PURE__ */ jsx17(Search, { className: "absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" }),
              /* @__PURE__ */ jsx17(
                "input",
                {
                  ref: searchRef,
                  type: "text",
                  placeholder: searchPlaceholder,
                  value: searchQuery,
                  onChange: handleSearchChange,
                  className: cn(
                    "w-full rounded border border-border-primary bg-background-primary",
                    "py-2 pl-8 pr-3 text-body-sm",
                    "focus:border-primary-primary focus:outline-none"
                  )
                }
              )
            ] }) }),
            /* @__PURE__ */ jsxs11("div", { className: "max-h-60 overflow-auto", children: [
              Object.entries(groupedOptions).map(([group, groupOptions]) => /* @__PURE__ */ jsxs11("div", { children: [
                group !== "default" && /* @__PURE__ */ jsx17("div", { className: "px-3 py-2 text-caption font-medium text-text-secondary", children: group }),
                groupOptions.map((option) => {
                  const isSelected = multiple && Array.isArray(currentValue) ? currentValue.includes(option.value) : currentValue === option.value;
                  return /* @__PURE__ */ jsxs11(
                    "button",
                    {
                      type: "button",
                      className: cn(
                        "flex w-full items-center justify-between px-3 py-2 text-left",
                        "hover:bg-background-secondary",
                        "focus:bg-background-secondary focus:outline-none",
                        option.disabled && "cursor-not-allowed opacity-50",
                        isSelected && "bg-primary-primary/10 text-primary-primary"
                      ),
                      onClick: () => !option.disabled && handleSelect(option.value),
                      disabled: option.disabled,
                      role: "option",
                      "aria-selected": isSelected,
                      children: [
                        /* @__PURE__ */ jsx17("span", { className: "truncate", children: option.label }),
                        isSelected && /* @__PURE__ */ jsx17(Check2, { className: "h-4 w-4" })
                      ]
                    },
                    option.value
                  );
                })
              ] }, group)),
              filteredOptions.length === 0 && /* @__PURE__ */ jsx17("div", { className: "px-3 py-6 text-center text-caption text-text-secondary", children: "No options found" })
            ] })
          ]
        }
      )
    ] });
    if (!label && !helperText && !error) {
      return selectElement;
    }
    return /* @__PURE__ */ jsxs11("div", { className: "w-full space-y-2", children: [
      label && /* @__PURE__ */ jsxs11("label", { className: "block text-body-sm font-medium text-text-primary", children: [
        label,
        props.required && /* @__PURE__ */ jsx17("span", { className: "ml-1 text-status-error", "aria-label": "required", children: "*" })
      ] }),
      selectElement,
      error && /* @__PURE__ */ jsx17("p", { className: "text-caption text-status-error", role: "alert", children: error }),
      helperText && !error && /* @__PURE__ */ jsx17("p", { className: "text-caption text-text-secondary", children: helperText })
    ] });
  }
);
Select.displayName = "Select";

// src/components/atoms/Tooltip.tsx
import * as React19 from "react";
import { cva as cva18 } from "class-variance-authority";
import { Fragment as Fragment2, jsx as jsx18, jsxs as jsxs12 } from "react/jsx-runtime";
var tooltipVariants = cva18(
  cn(
    "absolute z-50 rounded-md px-3 py-2 text-caption",
    "pointer-events-none select-none",
    "transition-opacity duration-fast",
    "whitespace-nowrap max-w-xs"
  ),
  {
    variants: {
      variant: {
        default: "bg-background-inverse text-text-inverse",
        dark: "bg-neutral-900 text-white",
        light: "bg-white text-neutral-900 border border-border-primary shadow-md",
        primary: "bg-primary-primary text-white",
        success: "bg-status-success text-white",
        warning: "bg-status-warning text-white",
        error: "bg-status-error text-white"
      },
      size: {
        sm: "px-2 py-1 text-xs",
        md: "px-3 py-2 text-caption",
        lg: "px-4 py-3 text-body-sm"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);
var arrowVariants = cva18(
  "absolute h-2 w-2 rotate-45",
  {
    variants: {
      variant: {
        default: "bg-background-inverse",
        dark: "bg-neutral-900",
        light: "bg-white border-l border-t border-border-primary",
        primary: "bg-primary-primary",
        success: "bg-status-success",
        warning: "bg-status-warning",
        error: "bg-status-error"
      },
      side: {
        top: "-bottom-1",
        bottom: "-top-1",
        left: "-right-1",
        right: "-left-1"
      }
    },
    defaultVariants: {
      variant: "default",
      side: "top"
    }
  }
);
var Tooltip = React19.forwardRef(
  ({
    content,
    children,
    variant,
    size,
    side = "top",
    align = "center",
    offset = 8,
    delayShow = 200,
    delayHide = 0,
    arrow = true,
    disabled = false,
    open,
    defaultOpen = false,
    onOpenChange
  }, ref) => {
    const [isOpen, setIsOpen] = React19.useState(defaultOpen);
    const [position, setPosition] = React19.useState({ x: 0, y: 0 });
    const triggerRef = React19.useRef(null);
    const tooltipRef = React19.useRef(null);
    const showTimeoutRef = React19.useRef(null);
    const hideTimeoutRef = React19.useRef(null);
    const controlledOpen = open !== void 0 ? open : isOpen;
    const calculatePosition = React19.useCallback(() => {
      if (!triggerRef.current || !tooltipRef.current) return;
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      let x = 0;
      let y = 0;
      switch (side) {
        case "top":
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          y = triggerRect.top - tooltipRect.height - offset;
          break;
        case "bottom":
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          y = triggerRect.bottom + offset;
          break;
        case "left":
          x = triggerRect.left - tooltipRect.width - offset;
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          break;
        case "right":
          x = triggerRect.right + offset;
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          break;
      }
      if (side === "top" || side === "bottom") {
        switch (align) {
          case "start":
            x = triggerRect.left;
            break;
          case "end":
            x = triggerRect.right - tooltipRect.width;
            break;
        }
      } else {
        switch (align) {
          case "start":
            y = triggerRect.top;
            break;
          case "end":
            y = triggerRect.bottom - tooltipRect.height;
            break;
        }
      }
      x = Math.max(8, Math.min(x, viewport.width - tooltipRect.width - 8));
      y = Math.max(8, Math.min(y, viewport.height - tooltipRect.height - 8));
      setPosition({ x, y });
    }, [side, align, offset]);
    const handleShow = React19.useCallback(() => {
      if (disabled) return;
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      showTimeoutRef.current = setTimeout(() => {
        const newOpen = true;
        if (open === void 0) {
          setIsOpen(newOpen);
        }
        onOpenChange?.(newOpen);
      }, delayShow);
    }, [disabled, delayShow, open, onOpenChange]);
    const handleHide = React19.useCallback(() => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      hideTimeoutRef.current = setTimeout(() => {
        const newOpen = false;
        if (open === void 0) {
          setIsOpen(newOpen);
        }
        onOpenChange?.(newOpen);
      }, delayHide);
    }, [delayHide, open, onOpenChange]);
    React19.useEffect(() => {
      if (controlledOpen) {
        calculatePosition();
        const handleResize = () => calculatePosition();
        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", handleResize);
        return () => {
          window.removeEventListener("resize", handleResize);
          window.removeEventListener("scroll", handleResize);
        };
      }
    }, [controlledOpen, calculatePosition]);
    React19.useEffect(() => {
      return () => {
        if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      };
    }, []);
    const getArrowPosition = () => {
      const arrowOffset = 12;
      switch (side) {
        case "top":
          return {
            left: "50%",
            transform: "translateX(-50%)"
          };
        case "bottom":
          return {
            left: "50%",
            transform: "translateX(-50%)"
          };
        case "left":
          return {
            top: "50%",
            transform: "translateY(-50%)"
          };
        case "right":
          return {
            top: "50%",
            transform: "translateY(-50%)"
          };
      }
    };
    return /* @__PURE__ */ jsxs12(Fragment2, { children: [
      /* @__PURE__ */ jsx18(
        "div",
        {
          ref: triggerRef,
          onMouseEnter: handleShow,
          onMouseLeave: handleHide,
          onFocus: handleShow,
          onBlur: handleHide,
          className: "inline-block",
          children
        }
      ),
      controlledOpen && content && /* @__PURE__ */ jsxs12(
        "div",
        {
          ref: tooltipRef,
          className: cn(tooltipVariants({ variant, size })),
          style: {
            position: "fixed",
            left: position.x,
            top: position.y
          },
          role: "tooltip",
          "aria-hidden": !controlledOpen,
          children: [
            typeof content === "string" ? /* @__PURE__ */ jsx18("span", { children: content }) : content,
            arrow && /* @__PURE__ */ jsx18(
              "div",
              {
                className: cn(arrowVariants({ variant, side })),
                style: getArrowPosition()
              }
            )
          ]
        }
      )
    ] });
  }
);
Tooltip.displayName = "Tooltip";

// src/components/atoms/Progress.tsx
import * as React20 from "react";
import { cva as cva19 } from "class-variance-authority";
import { jsx as jsx19, jsxs as jsxs13 } from "react/jsx-runtime";
var progressVariants = cva19(
  "relative overflow-hidden rounded-full bg-background-secondary",
  {
    variants: {
      size: {
        xs: "h-1",
        sm: "h-2",
        md: "h-3",
        lg: "h-4",
        xl: "h-6"
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
);
var progressBarVariants = cva19(
  cn(
    "h-full rounded-full transition-all duration-normal ease-out",
    "bg-gradient-to-r"
  ),
  {
    variants: {
      variant: {
        default: "from-primary-primary to-primary-primary",
        success: "from-status-success to-status-success",
        warning: "from-status-warning to-status-warning",
        error: "from-status-error to-status-error",
        gradient: "from-primary-primary via-primary-600 to-primary-700",
        rainbow: "from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500"
      },
      animated: {
        true: "animate-pulse",
        false: ""
      }
    },
    defaultVariants: {
      variant: "default",
      animated: false
    }
  }
);
var circularProgressVariants = cva19(
  "relative inline-flex items-center justify-center",
  {
    variants: {
      size: {
        xs: "h-8 w-8",
        sm: "h-12 w-12",
        md: "h-16 w-16",
        lg: "h-20 w-20",
        xl: "h-24 w-24"
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
);
var Progress = React20.forwardRef(
  ({
    className,
    size,
    variant,
    animated,
    value = 0,
    max = 100,
    showValue = false,
    label,
    indeterminate = false,
    ...props
  }, ref) => {
    const percentage = Math.min(Math.max(value / max * 100, 0), 100);
    return /* @__PURE__ */ jsxs13("div", { className: "w-full space-y-2", children: [
      (label || showValue) && /* @__PURE__ */ jsxs13("div", { className: "flex items-center justify-between text-body-sm", children: [
        label && /* @__PURE__ */ jsx19("span", { className: "text-text-primary", children: label }),
        showValue && /* @__PURE__ */ jsx19("span", { className: "text-text-secondary", children: indeterminate ? "\u2014" : `${Math.round(percentage)}%` })
      ] }),
      /* @__PURE__ */ jsx19(
        "div",
        {
          ref,
          className: cn(progressVariants({ size }), className),
          role: "progressbar",
          "aria-valuenow": indeterminate ? void 0 : value,
          "aria-valuemax": max,
          "aria-valuemin": 0,
          "aria-label": label,
          ...props,
          children: /* @__PURE__ */ jsx19(
            "div",
            {
              className: cn(
                progressBarVariants({ variant, animated: animated || indeterminate }),
                indeterminate && "animate-pulse"
              ),
              style: {
                width: indeterminate ? "100%" : `${percentage}%`,
                transform: indeterminate ? "translateX(-100%)" : void 0,
                animation: indeterminate ? "progress-indeterminate 2s infinite linear" : void 0
              }
            }
          )
        }
      ),
      /* @__PURE__ */ jsx19("style", { children: `
          @keyframes progress-indeterminate {
            0% {
              transform: translateX(-100%);
            }
            50% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        ` })
    ] });
  }
);
Progress.displayName = "Progress";
var CircularProgress = React20.forwardRef(
  ({
    className,
    size,
    variant,
    animated,
    value = 0,
    max = 100,
    strokeWidth = 8,
    showValue = false,
    children,
    indeterminate = false,
    ...props
  }, ref) => {
    const percentage = Math.min(Math.max(value / max * 100, 0), 100);
    const sizeValue = {
      xs: 32,
      sm: 48,
      md: 64,
      lg: 80,
      xl: 96
    }[size || "md"];
    const radius = (sizeValue - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - percentage / 100 * circumference;
    const colorMap = {
      default: "#0052FF",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      gradient: "#0052FF",
      rainbow: "#0052FF"
    };
    return /* @__PURE__ */ jsxs13(
      "div",
      {
        ref,
        className: cn(circularProgressVariants({ size }), className),
        role: "progressbar",
        "aria-valuenow": indeterminate ? void 0 : value,
        "aria-valuemax": max,
        "aria-valuemin": 0,
        ...props,
        children: [
          /* @__PURE__ */ jsxs13(
            "svg",
            {
              className: "transform -rotate-90",
              width: sizeValue,
              height: sizeValue,
              children: [
                /* @__PURE__ */ jsx19(
                  "circle",
                  {
                    cx: sizeValue / 2,
                    cy: sizeValue / 2,
                    r: radius,
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth,
                    className: "text-background-secondary"
                  }
                ),
                /* @__PURE__ */ jsx19(
                  "circle",
                  {
                    cx: sizeValue / 2,
                    cy: sizeValue / 2,
                    r: radius,
                    fill: "none",
                    stroke: colorMap[variant || "default"],
                    strokeWidth,
                    strokeLinecap: "round",
                    strokeDasharray: circumference,
                    strokeDashoffset: indeterminate ? circumference / 4 : strokeDashoffset,
                    className: cn(
                      "transition-all duration-normal ease-out",
                      (animated || indeterminate) && "animate-spin",
                      indeterminate && "animation-duration-1000"
                    ),
                    style: {
                      animation: indeterminate ? "spin 2s linear infinite" : void 0
                    }
                  }
                )
              ]
            }
          ),
          (showValue || children) && /* @__PURE__ */ jsx19("div", { className: "absolute inset-0 flex items-center justify-center", children: children || /* @__PURE__ */ jsx19("span", { className: "text-body-sm font-medium text-text-primary", children: indeterminate ? "\u2014" : `${Math.round(percentage)}%` }) })
        ]
      }
    );
  }
);
CircularProgress.displayName = "CircularProgress";
var StepProgress = React20.forwardRef(
  ({
    className,
    currentStep,
    totalSteps,
    steps = [],
    showNumbers = true,
    orientation = "horizontal",
    size = "md",
    ...props
  }, ref) => {
    const stepSize = {
      sm: "h-6 w-6 text-xs",
      md: "h-8 w-8 text-sm",
      lg: "h-10 w-10 text-base"
    }[size];
    const connectorHeight = {
      sm: "h-0.5",
      md: "h-1",
      lg: "h-1.5"
    }[size];
    return /* @__PURE__ */ jsx19(
      "div",
      {
        ref,
        className: cn(
          "flex",
          orientation === "horizontal" ? "items-center space-x-4" : "flex-col space-y-4",
          className
        ),
        ...props,
        children: Array.from({ length: totalSteps }, (_, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const stepLabel = steps[index] || `Step ${index + 1}`;
          return /* @__PURE__ */ jsxs13(
            "div",
            {
              className: cn(
                "flex items-center",
                orientation === "vertical" && "w-full"
              ),
              children: [
                /* @__PURE__ */ jsxs13("div", { className: "flex items-center", children: [
                  /* @__PURE__ */ jsx19(
                    "div",
                    {
                      className: cn(
                        "flex items-center justify-center rounded-full border-2 font-medium",
                        stepSize,
                        isCompleted && "border-primary-primary bg-primary-primary text-white",
                        isCurrent && "border-primary-primary bg-background-primary text-primary-primary",
                        !isCompleted && !isCurrent && "border-border-secondary bg-background-secondary text-text-secondary"
                      ),
                      children: showNumbers ? index + 1 : null
                    }
                  ),
                  steps.length > 0 && /* @__PURE__ */ jsx19(
                    "span",
                    {
                      className: cn(
                        "ml-3 text-body-sm font-medium",
                        isCompleted && "text-primary-primary",
                        isCurrent && "text-text-primary",
                        !isCompleted && !isCurrent && "text-text-secondary"
                      ),
                      children: stepLabel
                    }
                  )
                ] }),
                index < totalSteps - 1 && /* @__PURE__ */ jsx19(
                  "div",
                  {
                    className: cn(
                      orientation === "horizontal" ? `flex-1 ${connectorHeight} mx-4` : `w-0.5 h-8 ml-4`,
                      "bg-border-secondary",
                      index < currentStep && "bg-primary-primary"
                    )
                  }
                )
              ]
            },
            index
          );
        })
      }
    );
  }
);
StepProgress.displayName = "StepProgress";

// src/components/molecules/FormField.tsx
import * as React21 from "react";
import { jsx as jsx20, jsxs as jsxs14 } from "react/jsx-runtime";
var FormField = React21.forwardRef(
  ({
    className,
    type,
    name,
    label,
    helperText,
    error,
    required = false,
    disabled = false,
    fieldProps = {},
    ...props
  }, ref) => {
    const fieldId = React21.useId();
    const errorId = error ? `${fieldId}-error` : void 0;
    const helperTextId = helperText ? `${fieldId}-helper` : void 0;
    const sharedProps = {
      id: fieldId,
      name,
      required,
      disabled,
      "aria-invalid": !!error,
      "aria-describedby": cn(errorId, helperTextId).trim() || void 0
    };
    const renderField = () => {
      switch (type) {
        case "input":
          return /* @__PURE__ */ jsx20(
            Input,
            {
              ...sharedProps,
              ...fieldProps
            }
          );
        case "textarea":
          return /* @__PURE__ */ jsx20(
            Textarea,
            {
              ...sharedProps,
              ...fieldProps
            }
          );
        case "select":
          return /* @__PURE__ */ jsx20(
            Select,
            {
              ...sharedProps,
              ...fieldProps
            }
          );
        case "checkbox":
          return /* @__PURE__ */ jsx20(
            Checkbox,
            {
              ...sharedProps,
              ...fieldProps
            }
          );
        case "radio":
          return /* @__PURE__ */ jsx20(
            Radio,
            {
              ...sharedProps,
              ...fieldProps
            }
          );
        case "switch":
          return /* @__PURE__ */ jsx20(
            Switch,
            {
              ...sharedProps,
              ...fieldProps
            }
          );
        default:
          return null;
      }
    };
    const isFieldSelfLabeled = ["checkbox", "radio", "switch"].includes(type);
    if (isFieldSelfLabeled) {
      return /* @__PURE__ */ jsxs14("div", { ref, className: cn("space-y-2", className), ...props, children: [
        renderField(),
        error && /* @__PURE__ */ jsx20("p", { id: errorId, className: "text-caption text-status-error", role: "alert", children: error }),
        helperText && !error && /* @__PURE__ */ jsx20("p", { id: helperTextId, className: "text-caption text-text-secondary", children: helperText })
      ] });
    }
    return /* @__PURE__ */ jsxs14("div", { ref, className: cn("space-y-2", className), ...props, children: [
      label && /* @__PURE__ */ jsxs14("label", { htmlFor: fieldId, className: "block text-body-sm font-medium text-text-primary", children: [
        label,
        required && /* @__PURE__ */ jsx20("span", { className: "ml-1 text-status-error", "aria-label": "required", children: "*" })
      ] }),
      renderField(),
      error && /* @__PURE__ */ jsx20("p", { id: errorId, className: "text-caption text-status-error", role: "alert", children: error }),
      helperText && !error && /* @__PURE__ */ jsx20("p", { id: helperTextId, className: "text-caption text-text-secondary", children: helperText })
    ] });
  }
);
FormField.displayName = "FormField";
var InputField = React21.forwardRef(
  ({ fieldProps, ...props }, ref) => /* @__PURE__ */ jsx20(FormField, { ref, type: "input", fieldProps, ...props })
);
InputField.displayName = "InputField";
var TextareaField = React21.forwardRef(
  ({ fieldProps, ...props }, ref) => /* @__PURE__ */ jsx20(FormField, { ref, type: "textarea", fieldProps, ...props })
);
TextareaField.displayName = "TextareaField";
var SelectField = React21.forwardRef(
  ({ fieldProps, ...props }, ref) => /* @__PURE__ */ jsx20(FormField, { ref, type: "select", fieldProps, ...props })
);
SelectField.displayName = "SelectField";
var CheckboxField = React21.forwardRef(
  ({ fieldProps, ...props }, ref) => /* @__PURE__ */ jsx20(FormField, { ref, type: "checkbox", fieldProps, ...props })
);
CheckboxField.displayName = "CheckboxField";
var RadioField = React21.forwardRef(
  ({ fieldProps, ...props }, ref) => /* @__PURE__ */ jsx20(FormField, { ref, type: "radio", fieldProps, ...props })
);
RadioField.displayName = "RadioField";
var SwitchField = React21.forwardRef(
  ({ fieldProps, ...props }, ref) => /* @__PURE__ */ jsx20(FormField, { ref, type: "switch", fieldProps, ...props })
);
SwitchField.displayName = "SwitchField";

// src/components/molecules/SearchInput.tsx
import * as React22 from "react";
import { Search as Search2, X as X2, Loader2 } from "lucide-react";
import { cva as cva20 } from "class-variance-authority";
import { jsx as jsx21, jsxs as jsxs15 } from "react/jsx-runtime";
var searchInputVariants = cva20(
  "relative w-full",
  {
    variants: {
      size: {
        sm: "",
        md: "",
        lg: ""
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
);
var suggestionListVariants = cva20(
  cn(
    "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border",
    "border-border-primary bg-background-primary shadow-lg",
    "animate-in fade-in-0 zoom-in-95"
  )
);
var SearchInput = React22.forwardRef(
  ({
    className,
    size,
    suggestions = [],
    loading = false,
    clearable = true,
    debounceMs = 300,
    minLength = 2,
    maxSuggestions = 10,
    searchIcon,
    placeholder = "Search...",
    value,
    onChange,
    onSearch,
    onSuggestionSelect,
    onClear,
    renderSuggestion,
    ...props
  }, ref) => {
    const [internalValue, setInternalValue] = React22.useState("");
    const [isOpen, setIsOpen] = React22.useState(false);
    const [highlightedIndex, setHighlightedIndex] = React22.useState(-1);
    const searchRef = React22.useRef(null);
    const inputRef = React22.useRef(null);
    const suggestionsRef = React22.useRef(null);
    const debounceRef = React22.useRef();
    const currentValue = value !== void 0 ? value : internalValue;
    const visibleSuggestions = suggestions.slice(0, maxSuggestions);
    const shouldShowSuggestions = isOpen && currentValue.length >= minLength && visibleSuggestions.length > 0;
    React22.useEffect(() => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (currentValue.length >= minLength) {
        debounceRef.current = setTimeout(() => {
          onSearch?.(currentValue);
        }, debounceMs);
      }
      return () => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
      };
    }, [currentValue, minLength, debounceMs, onSearch]);
    const handleInputChange = (e) => {
      const newValue = e.target.value;
      if (value === void 0) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
      setIsOpen(true);
      setHighlightedIndex(-1);
    };
    const handleClear = () => {
      const newValue = "";
      if (value === void 0) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
      onClear?.();
      setIsOpen(false);
      setHighlightedIndex(-1);
      inputRef.current?.focus();
    };
    const handleSuggestionClick = (suggestion) => {
      onSuggestionSelect?.(suggestion);
      setIsOpen(false);
      setHighlightedIndex(-1);
      inputRef.current?.focus();
    };
    const handleKeyDown = (e) => {
      if (!shouldShowSuggestions) return;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex(
            (prev) => prev < visibleSuggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex(
            (prev) => prev > 0 ? prev - 1 : visibleSuggestions.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && visibleSuggestions[highlightedIndex]) {
            handleSuggestionClick(visibleSuggestions[highlightedIndex]);
          } else if (currentValue.length >= minLength) {
            onSearch?.(currentValue);
            setIsOpen(false);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
      }
    };
    React22.useEffect(() => {
      const handleClickOutside = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
          setIsOpen(false);
          setHighlightedIndex(-1);
        }
      };
      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [isOpen]);
    const defaultRenderSuggestion = (suggestion, isHighlighted) => /* @__PURE__ */ jsxs15(
      "div",
      {
        className: cn(
          "flex cursor-pointer items-center px-3 py-2",
          "hover:bg-background-secondary",
          isHighlighted && "bg-background-secondary"
        ),
        onClick: () => handleSuggestionClick(suggestion),
        children: [
          /* @__PURE__ */ jsxs15("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx21("div", { className: "truncate text-body-sm font-medium text-text-primary", children: suggestion.label }),
            suggestion.description && /* @__PURE__ */ jsx21("div", { className: "truncate text-caption text-text-secondary", children: suggestion.description })
          ] }),
          suggestion.category && /* @__PURE__ */ jsx21("div", { className: "ml-2 rounded-full bg-background-tertiary px-2 py-0.5 text-xs text-text-secondary", children: suggestion.category })
        ]
      }
    );
    const leftElement = /* @__PURE__ */ jsx21("div", { className: "flex items-center", children: loading ? /* @__PURE__ */ jsx21(Loader2, { className: "h-4 w-4 animate-spin text-text-secondary" }) : searchIcon || /* @__PURE__ */ jsx21(Search2, { className: "h-4 w-4 text-text-secondary" }) });
    const rightElement = clearable && currentValue ? /* @__PURE__ */ jsx21(
      "button",
      {
        type: "button",
        onClick: handleClear,
        className: "flex items-center rounded p-0.5 hover:bg-background-secondary",
        tabIndex: -1,
        children: /* @__PURE__ */ jsx21(X2, { className: "h-4 w-4 text-text-secondary" })
      }
    ) : void 0;
    return /* @__PURE__ */ jsxs15("div", { className: cn(searchInputVariants({ size }), className), ref: searchRef, children: [
      /* @__PURE__ */ jsx21(
        Input,
        {
          ref: inputRef,
          value: currentValue,
          placeholder,
          leftElement,
          rightElement,
          onChange: handleInputChange,
          onKeyDown: handleKeyDown,
          onFocus: () => currentValue.length >= minLength && setIsOpen(true),
          autoComplete: "off",
          role: "combobox",
          "aria-expanded": shouldShowSuggestions,
          "aria-haspopup": "listbox",
          "aria-activedescendant": highlightedIndex >= 0 ? `suggestion-${highlightedIndex}` : void 0,
          ...props
        }
      ),
      shouldShowSuggestions && /* @__PURE__ */ jsx21("div", { ref: suggestionsRef, className: suggestionListVariants(), role: "listbox", children: visibleSuggestions.map((suggestion, index) => /* @__PURE__ */ jsx21(
        "div",
        {
          id: `suggestion-${index}`,
          role: "option",
          "aria-selected": index === highlightedIndex,
          children: renderSuggestion ? renderSuggestion(suggestion, index === highlightedIndex) : defaultRenderSuggestion(suggestion, index === highlightedIndex)
        },
        suggestion.id
      )) })
    ] });
  }
);
SearchInput.displayName = "SearchInput";

// src/components/molecules/ButtonGroup.tsx
import * as React23 from "react";
import { cva as cva21 } from "class-variance-authority";
import { jsx as jsx22, jsxs as jsxs16 } from "react/jsx-runtime";
var buttonGroupVariants = cva21(
  "inline-flex",
  {
    variants: {
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col"
      },
      attached: {
        true: "",
        false: "gap-2"
      },
      size: {
        sm: "[&>*]:h-8 [&>*]:px-3 [&>*]:text-sm",
        md: "[&>*]:h-10 [&>*]:px-4 [&>*]:text-sm",
        lg: "[&>*]:h-12 [&>*]:px-6 [&>*]:text-base"
      }
    },
    compoundVariants: [
      {
        orientation: "horizontal",
        attached: true,
        className: "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none [&>*:not(:first-child)]:-ml-px"
      },
      {
        orientation: "vertical",
        attached: true,
        className: "[&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none [&>*:not(:first-child)]:-mt-px"
      }
    ],
    defaultVariants: {
      orientation: "horizontal",
      attached: true,
      size: "md"
    }
  }
);
var ButtonGroup = React23.forwardRef(
  ({
    className,
    orientation,
    attached,
    size,
    options,
    value,
    defaultValue,
    multiple = false,
    variant = "secondary",
    disabled = false,
    onChange,
    ...props
  }, ref) => {
    const [internalValue, setInternalValue] = React23.useState(
      defaultValue || (multiple ? [] : "")
    );
    const currentValue = value !== void 0 ? value : internalValue;
    const handleOptionClick = (optionValue) => {
      let newValue;
      if (multiple && Array.isArray(currentValue)) {
        newValue = currentValue.includes(optionValue) ? currentValue.filter((v) => v !== optionValue) : [...currentValue, optionValue];
      } else {
        newValue = currentValue === optionValue ? "" : optionValue;
      }
      if (value === void 0) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    };
    const isSelected = (optionValue) => {
      if (multiple && Array.isArray(currentValue)) {
        return currentValue.includes(optionValue);
      }
      return currentValue === optionValue;
    };
    const getButtonVariant = (optionValue) => {
      if (isSelected(optionValue)) {
        return variant === "secondary" ? "primary" : variant;
      }
      return variant;
    };
    return /* @__PURE__ */ jsx22(
      "div",
      {
        ref,
        className: cn(buttonGroupVariants({ orientation, attached, size }), className),
        role: multiple ? "group" : "radiogroup",
        "aria-label": "Button group",
        ...props,
        children: options.map((option) => /* @__PURE__ */ jsxs16(
          Button,
          {
            variant: getButtonVariant(option.value),
            disabled: disabled || option.disabled,
            onClick: () => handleOptionClick(option.value),
            role: multiple ? "button" : "radio",
            "aria-checked": multiple ? void 0 : isSelected(option.value),
            "aria-pressed": multiple ? isSelected(option.value) : void 0,
            title: option.tooltip,
            className: cn(
              // Ensure proper z-index layering for attached buttons
              attached && isSelected(option.value) && "relative z-10"
            ),
            children: [
              option.icon && /* @__PURE__ */ jsx22("span", { className: "mr-2 flex items-center", children: option.icon }),
              option.label
            ]
          },
          option.value
        ))
      }
    );
  }
);
ButtonGroup.displayName = "ButtonGroup";
var ToggleGroup = React23.forwardRef(
  ({
    variant = "secondary",
    allowEmpty = true,
    value,
    defaultValue,
    onChange,
    ...props
  }, ref) => {
    const handleChange = (newValue) => {
      if (!allowEmpty && newValue === "") {
        return;
      }
      onChange?.(newValue);
    };
    return /* @__PURE__ */ jsx22(
      ButtonGroup,
      {
        ref,
        multiple: false,
        variant,
        value,
        defaultValue,
        onChange: handleChange,
        ...props
      }
    );
  }
);
ToggleGroup.displayName = "ToggleGroup";
var CheckboxGroup = React23.forwardRef(
  ({
    variant = "secondary",
    value,
    defaultValue = [],
    ...props
  }, ref) => {
    return /* @__PURE__ */ jsx22(
      ButtonGroup,
      {
        ref,
        multiple: true,
        variant,
        value,
        defaultValue,
        ...props
      }
    );
  }
);
CheckboxGroup.displayName = "CheckboxGroup";
var SegmentedControl = React23.forwardRef(
  ({
    variant = "secondary",
    value,
    defaultValue,
    onChange,
    ...props
  }, ref) => {
    const handleChange = (newValue) => {
      if (newValue !== "") {
        onChange?.(newValue);
      }
    };
    return /* @__PURE__ */ jsx22(
      ButtonGroup,
      {
        ref,
        multiple: false,
        attached: true,
        variant: variant === "primary" ? "secondary" : "tertiary",
        value,
        defaultValue: defaultValue || (props.options[0]?.value || ""),
        onChange: handleChange,
        ...props
      }
    );
  }
);
SegmentedControl.displayName = "SegmentedControl";

// src/components/molecules/Notification.tsx
import * as React24 from "react";
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  X as X3,
  Bell
} from "lucide-react";
import { cva as cva22 } from "class-variance-authority";
import { jsx as jsx23, jsxs as jsxs17 } from "react/jsx-runtime";
var notificationVariants = cva22(
  cn(
    "relative flex items-start gap-3 rounded-lg border p-4",
    "transition-all duration-normal",
    "animate-in slide-in-from-right-full"
  ),
  {
    variants: {
      variant: {
        default: "border-border-primary bg-background-primary text-text-primary",
        success: "border-status-success/20 bg-status-success/5 text-status-success",
        warning: "border-status-warning/20 bg-status-warning/5 text-status-warning",
        error: "border-status-error/20 bg-status-error/5 text-status-error",
        info: "border-status-info/20 bg-status-info/5 text-status-info"
      },
      size: {
        sm: "p-3 text-body-sm",
        md: "p-4 text-body-md",
        lg: "p-5 text-body-lg-mobile md:text-body-lg-desktop"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);
var iconVariants = cva22(
  "shrink-0",
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6"
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
);
var Notification = React24.forwardRef(
  ({
    className,
    variant,
    size,
    title,
    description,
    icon,
    hideIcon = false,
    closable = true,
    actions = [],
    duration,
    onDismiss,
    onClick,
    ...props
  }, ref) => {
    const [isVisible, setIsVisible] = React24.useState(true);
    const timeoutRef = React24.useRef();
    React24.useEffect(() => {
      if (duration && duration > 0) {
        timeoutRef.current = setTimeout(() => {
          handleDismiss();
        }, duration);
        return () => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        };
      }
    }, [duration]);
    const handleDismiss = () => {
      setIsVisible(false);
      setTimeout(() => {
        onDismiss?.();
      }, 150);
    };
    const getDefaultIcon = () => {
      const iconClass = iconVariants({ size });
      switch (variant) {
        case "success":
          return /* @__PURE__ */ jsx23(CheckCircle, { className: iconClass });
        case "warning":
          return /* @__PURE__ */ jsx23(AlertTriangle, { className: iconClass });
        case "error":
          return /* @__PURE__ */ jsx23(AlertCircle, { className: iconClass });
        case "info":
          return /* @__PURE__ */ jsx23(Info, { className: iconClass });
        default:
          return /* @__PURE__ */ jsx23(Bell, { className: iconClass });
      }
    };
    if (!isVisible) {
      return null;
    }
    return /* @__PURE__ */ jsxs17(
      "div",
      {
        ref,
        className: cn(
          notificationVariants({ variant, size }),
          onClick && "cursor-pointer hover:scale-105",
          className
        ),
        onClick,
        role: "alert",
        "aria-live": "polite",
        ...props,
        children: [
          !hideIcon && /* @__PURE__ */ jsx23("div", { className: "flex items-center", children: icon || getDefaultIcon() }),
          /* @__PURE__ */ jsxs17("div", { className: "min-w-0 flex-1", children: [
            title && /* @__PURE__ */ jsx23("div", { className: "font-medium text-text-primary", children: title }),
            description && /* @__PURE__ */ jsx23("div", { className: cn(
              "text-text-secondary",
              title && "mt-1"
            ), children: description }),
            actions.length > 0 && /* @__PURE__ */ jsx23("div", { className: "mt-3 flex gap-2", children: actions.map((action, index) => /* @__PURE__ */ jsx23(
              Button,
              {
                size: "sm",
                variant: action.variant || "ghost",
                onClick: (e) => {
                  e.stopPropagation();
                  action.onClick();
                },
                children: action.label
              },
              index
            )) })
          ] }),
          closable && /* @__PURE__ */ jsx23(
            IconButton,
            {
              size: "sm",
              variant: "ghost",
              onClick: (e) => {
                e.stopPropagation();
                handleDismiss();
              },
              className: cn(
                "absolute right-2 top-2",
                variant !== "default" && "text-current hover:bg-current/10"
              ),
              "aria-label": "Dismiss notification",
              children: /* @__PURE__ */ jsx23(X3, { className: "h-4 w-4" })
            }
          )
        ]
      }
    );
  }
);
Notification.displayName = "Notification";
var ToastContext = React24.createContext(null);

// src/components/molecules/Dialog.tsx
import * as React25 from "react";
import { X as X4 } from "lucide-react";
import { cva as cva23 } from "class-variance-authority";
import { Fragment as Fragment3, jsx as jsx24, jsxs as jsxs18 } from "react/jsx-runtime";
var overlayVariants = cva23(
  cn(
    "fixed inset-0 z-50 bg-black/50",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
  )
);
var dialogVariants = cva23(
  cn(
    "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2",
    "rounded-lg border border-border-primary bg-background-primary shadow-lg",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
    "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
    "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
  ),
  {
    variants: {
      size: {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-[95vw] max-h-[95vh]"
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
);
var Dialog = React25.forwardRef(
  ({
    className,
    size,
    open,
    defaultOpen = false,
    title,
    description,
    header,
    footer,
    primaryAction,
    secondaryAction,
    actions = [],
    closable = true,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    preventScroll = true,
    onOpenChange,
    onClose,
    children,
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = React25.useState(defaultOpen);
    const [isAnimating, setIsAnimating] = React25.useState(false);
    const dialogRef = React25.useRef(null);
    const previousFocusRef = React25.useRef(null);
    const controlledOpen = open !== void 0 ? open : isOpen;
    const handleOpenChange = (newOpen) => {
      if (open === void 0) {
        setIsOpen(newOpen);
      }
      onOpenChange?.(newOpen);
      if (!newOpen) {
        setIsAnimating(true);
        setTimeout(() => {
          setIsAnimating(false);
          onClose?.();
        }, 200);
      }
    };
    const handleClose = () => {
      handleOpenChange(false);
    };
    React25.useEffect(() => {
      if (!controlledOpen || !closeOnEscape) return;
      const handleKeyDown = (event) => {
        if (event.key === "Escape") {
          handleClose();
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [controlledOpen, closeOnEscape]);
    React25.useEffect(() => {
      if (controlledOpen) {
        previousFocusRef.current = document.activeElement;
        setTimeout(() => {
          dialogRef.current?.focus();
        }, 100);
      } else if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
    }, [controlledOpen]);
    React25.useEffect(() => {
      if (!preventScroll) return;
      if (controlledOpen) {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
          document.body.style.overflow = originalOverflow;
        };
      }
    }, [controlledOpen, preventScroll]);
    React25.useEffect(() => {
      if (!controlledOpen) return;
      const handleTabKey = (event) => {
        if (event.key !== "Tab" || !dialogRef.current) return;
        const focusableElements = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement?.focus();
          }
        }
      };
      document.addEventListener("keydown", handleTabKey);
      return () => document.removeEventListener("keydown", handleTabKey);
    }, [controlledOpen]);
    if (!controlledOpen && !isAnimating) {
      return null;
    }
    const allActions = [
      ...secondaryAction ? [secondaryAction] : [],
      ...actions,
      ...primaryAction ? [primaryAction] : []
    ];
    return /* @__PURE__ */ jsxs18(Fragment3, { children: [
      /* @__PURE__ */ jsx24(
        "div",
        {
          className: overlayVariants(),
          "data-state": controlledOpen ? "open" : "closed",
          onClick: closeOnOverlayClick ? handleClose : void 0,
          "aria-hidden": "true"
        }
      ),
      /* @__PURE__ */ jsxs18(
        "div",
        {
          ref: dialogRef,
          className: cn(dialogVariants({ size }), className),
          "data-state": controlledOpen ? "open" : "closed",
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": title ? "dialog-title" : void 0,
          "aria-describedby": description ? "dialog-description" : void 0,
          tabIndex: -1,
          ...props,
          children: [
            (header || title || closable) && /* @__PURE__ */ jsxs18("div", { className: "flex items-start justify-between border-b border-border-primary px-6 py-4", children: [
              /* @__PURE__ */ jsx24("div", { className: "flex-1", children: header || /* @__PURE__ */ jsxs18("div", { children: [
                title && /* @__PURE__ */ jsx24(
                  Heading,
                  {
                    id: "dialog-title",
                    level: "h3",
                    className: "text-lg font-semibold",
                    children: title
                  }
                ),
                description && /* @__PURE__ */ jsx24(
                  "p",
                  {
                    id: "dialog-description",
                    className: "mt-1 text-body-sm text-text-secondary",
                    children: description
                  }
                )
              ] }) }),
              closable && /* @__PURE__ */ jsx24(
                IconButton,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: handleClose,
                  className: "ml-4",
                  "aria-label": "Close dialog",
                  children: /* @__PURE__ */ jsx24(X4, { className: "h-4 w-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsx24("div", { className: "px-6 py-4", children }),
            (footer || allActions.length > 0) && /* @__PURE__ */ jsx24("div", { className: "flex justify-end gap-3 border-t border-border-primary px-6 py-4", children: footer || /* @__PURE__ */ jsx24(Fragment3, { children: allActions.map((action, index) => /* @__PURE__ */ jsx24(
              Button,
              {
                variant: action.variant || (index === allActions.length - 1 ? "primary" : "secondary"),
                loading: action.loading,
                disabled: action.disabled,
                onClick: action.onClick,
                children: action.label
              },
              index
            )) }) })
          ]
        }
      )
    ] });
  }
);
Dialog.displayName = "Dialog";
var AlertDialog = React25.forwardRef(
  ({
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmVariant = "primary",
    onConfirm,
    onCancel,
    confirmLoading = false,
    onClose,
    ...props
  }, ref) => {
    const handleConfirm = () => {
      onConfirm?.();
      onClose?.();
    };
    const handleCancel = () => {
      onCancel?.();
      onClose?.();
    };
    return /* @__PURE__ */ jsx24(
      Dialog,
      {
        ref,
        primaryAction: {
          label: confirmText,
          variant: confirmVariant,
          loading: confirmLoading,
          onClick: handleConfirm
        },
        secondaryAction: {
          label: cancelText,
          variant: "secondary",
          onClick: handleCancel
        },
        onClose,
        ...props
      }
    );
  }
);
AlertDialog.displayName = "AlertDialog";
var ConfirmDialog = React25.forwardRef(
  ({
    destructive = false,
    confirmText = destructive ? "Delete" : "Confirm",
    ...props
  }, ref) => {
    return /* @__PURE__ */ jsx24(
      AlertDialog,
      {
        ref,
        confirmText,
        confirmVariant: destructive ? "error" : "primary",
        ...props
      }
    );
  }
);
ConfirmDialog.displayName = "ConfirmDialog";

// src/components/molecules/Dropdown.tsx
import * as React26 from "react";
import { ChevronDown as ChevronDown2, ChevronRight } from "lucide-react";
import { cva as cva24 } from "class-variance-authority";
import { jsx as jsx25, jsxs as jsxs19 } from "react/jsx-runtime";
var dropdownContentVariants = cva24(
  cn(
    "absolute z-50 min-w-[200px] overflow-hidden rounded-md border",
    "border-border-primary bg-background-primary shadow-lg",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
    "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
    "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
  ),
  {
    variants: {
      size: {
        sm: "min-w-[150px] text-body-sm",
        md: "min-w-[200px] text-body-md",
        lg: "min-w-[250px] text-body-md"
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
);
var dropdownItemVariants = cva24(
  cn(
    "relative flex cursor-pointer select-none items-center px-3 py-2",
    "text-body-sm transition-colors",
    "focus:bg-background-secondary focus:outline-none",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
  ),
  {
    variants: {
      variant: {
        default: "hover:bg-background-secondary",
        destructive: "text-status-error hover:bg-status-error/10 focus:bg-status-error/10"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
var Dropdown = React26.forwardRef(
  ({
    size,
    trigger,
    items,
    open,
    defaultOpen = false,
    side = "bottom",
    align = "start",
    offset = 4,
    content,
    onOpenChange,
    triggerProps
  }, ref) => {
    const [isOpen, setIsOpen] = React26.useState(defaultOpen);
    const [position, setPosition] = React26.useState({ x: 0, y: 0 });
    const triggerRef = React26.useRef(null);
    const contentRef = React26.useRef(null);
    const controlledOpen = open !== void 0 ? open : isOpen;
    const calculatePosition = React26.useCallback(() => {
      if (!triggerRef.current || !contentRef.current) return;
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      let x = 0;
      let y = 0;
      switch (side) {
        case "bottom":
          x = triggerRect.left;
          y = triggerRect.bottom + offset;
          break;
        case "top":
          x = triggerRect.left;
          y = triggerRect.top - contentRect.height - offset;
          break;
        case "right":
          x = triggerRect.right + offset;
          y = triggerRect.top;
          break;
        case "left":
          x = triggerRect.left - contentRect.width - offset;
          y = triggerRect.top;
          break;
      }
      if (side === "top" || side === "bottom") {
        switch (align) {
          case "center":
            x = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
            break;
          case "end":
            x = triggerRect.right - contentRect.width;
            break;
        }
      } else {
        switch (align) {
          case "center":
            y = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2;
            break;
          case "end":
            y = triggerRect.bottom - contentRect.height;
            break;
        }
      }
      x = Math.max(8, Math.min(x, viewport.width - contentRect.width - 8));
      y = Math.max(8, Math.min(y, viewport.height - contentRect.height - 8));
      setPosition({ x, y });
    }, [side, align, offset]);
    const handleOpenChange = (newOpen) => {
      if (open === void 0) {
        setIsOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    };
    const handleTriggerClick = () => {
      handleOpenChange(!controlledOpen);
    };
    const handleItemClick = (item) => {
      if (item.disabled) return;
      item.onClick?.();
      if (item.type !== "submenu") {
        handleOpenChange(false);
      }
    };
    React26.useEffect(() => {
      if (controlledOpen) {
        calculatePosition();
        const handleResize = () => calculatePosition();
        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", handleResize);
        return () => {
          window.removeEventListener("resize", handleResize);
          window.removeEventListener("scroll", handleResize);
        };
      }
    }, [controlledOpen, calculatePosition]);
    React26.useEffect(() => {
      if (!controlledOpen) return;
      const handleClickOutside = (event) => {
        if (triggerRef.current && contentRef.current && !triggerRef.current.contains(event.target) && !contentRef.current.contains(event.target)) {
          handleOpenChange(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [controlledOpen]);
    React26.useEffect(() => {
      if (!controlledOpen) return;
      const handleKeyDown = (event) => {
        switch (event.key) {
          case "Escape":
            handleOpenChange(false);
            break;
          case "ArrowDown":
          case "ArrowUp":
            event.preventDefault();
            break;
          case "Enter":
          case " ":
            event.preventDefault();
            break;
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [controlledOpen]);
    const renderItem = (item) => {
      switch (item.type) {
        case "separator":
          return /* @__PURE__ */ jsx25(Divider, { className: "my-1" }, item.key);
        case "label":
          return /* @__PURE__ */ jsx25(
            "div",
            {
              className: "px-3 py-2 text-caption font-medium text-text-secondary",
              children: item.label
            },
            item.key
          );
        case "submenu":
          return /* @__PURE__ */ jsxs19(
            "div",
            {
              className: cn(
                dropdownItemVariants({ variant: "default" }),
                "justify-between"
              ),
              children: [
                /* @__PURE__ */ jsxs19("div", { className: "flex items-center gap-2", children: [
                  item.icon && /* @__PURE__ */ jsx25("span", { className: "flex h-4 w-4 items-center justify-center", children: item.icon }),
                  /* @__PURE__ */ jsx25("span", { children: item.label })
                ] }),
                /* @__PURE__ */ jsx25(ChevronRight, { className: "h-4 w-4" })
              ]
            },
            item.key
          );
        default:
          return /* @__PURE__ */ jsx25(
            "div",
            {
              className: cn(
                dropdownItemVariants({
                  variant: item.destructive ? "destructive" : "default"
                })
              ),
              onClick: () => handleItemClick(item),
              "data-disabled": item.disabled,
              role: "menuitem",
              tabIndex: item.disabled ? -1 : 0,
              children: /* @__PURE__ */ jsxs19("div", { className: "flex flex-1 items-center gap-2", children: [
                item.icon && /* @__PURE__ */ jsx25("span", { className: "flex h-4 w-4 items-center justify-center", children: item.icon }),
                /* @__PURE__ */ jsx25("span", { className: "flex-1", children: item.label }),
                item.shortcut && /* @__PURE__ */ jsx25("span", { className: "text-caption text-text-tertiary", children: item.shortcut })
              ] })
            },
            item.key
          );
      }
    };
    return /* @__PURE__ */ jsxs19("div", { ref, className: "relative inline-block", children: [
      /* @__PURE__ */ jsx25(
        "div",
        {
          ref: triggerRef,
          onClick: handleTriggerClick,
          role: "button",
          tabIndex: 0,
          "aria-expanded": controlledOpen,
          "aria-haspopup": "menu",
          ...triggerProps,
          children: trigger
        }
      ),
      controlledOpen && /* @__PURE__ */ jsx25(
        "div",
        {
          ref: contentRef,
          className: dropdownContentVariants({ size }),
          style: {
            position: "fixed",
            left: position.x,
            top: position.y
          },
          "data-state": controlledOpen ? "open" : "closed",
          "data-side": side,
          role: "menu",
          "aria-orientation": "vertical",
          children: content || /* @__PURE__ */ jsx25("div", { className: "py-1", children: items.map(renderItem) })
        }
      )
    ] });
  }
);
Dropdown.displayName = "Dropdown";
var DropdownMenu = React26.forwardRef(
  ({
    children,
    variant = "secondary",
    buttonSize = "md",
    showChevron = true,
    ...props
  }, ref) => {
    const trigger = /* @__PURE__ */ jsxs19(Button, { variant, size: buttonSize, children: [
      children,
      showChevron && /* @__PURE__ */ jsx25(ChevronDown2, { className: "ml-2 h-4 w-4" })
    ] });
    return /* @__PURE__ */ jsx25(Dropdown, { ref, trigger, ...props });
  }
);
DropdownMenu.displayName = "DropdownMenu";
var DropdownIconMenu = React26.forwardRef(
  ({
    icon,
    variant = "ghost",
    buttonSize = "md",
    "aria-label": ariaLabel = "Open menu",
    ...props
  }, ref) => {
    const trigger = /* @__PURE__ */ jsx25(IconButton, { variant, size: buttonSize, "aria-label": ariaLabel, children: icon });
    return /* @__PURE__ */ jsx25(Dropdown, { ref, trigger, ...props });
  }
);
DropdownIconMenu.displayName = "DropdownIconMenu";

// src/components/auth/LoginForm.tsx
import * as React27 from "react";
import { Eye, EyeOff, User, Lock, Building, Shield } from "lucide-react";
import { cva as cva25 } from "class-variance-authority";
import { Fragment as Fragment4, jsx as jsx26, jsxs as jsxs20 } from "react/jsx-runtime";
var loginFormVariants = cva25(
  "w-full max-w-md space-y-6",
  {
    variants: {
      layout: {
        card: "",
        inline: "",
        modal: ""
      }
    },
    defaultVariants: {
      layout: "card"
    }
  }
);
var roleOptions = [
  { value: "investor", label: "\u6295\u8D44\u8005 Investor" },
  { value: "issuer", label: "\u53D1\u884C\u65B9 Issuer" },
  { value: "partner", label: "\u5408\u4F5C\u4F19\u4F34 Partner" },
  { value: "operator", label: "\u8FD0\u8425\u65B9 Operator" }
];
var roleIcons = {
  investor: User,
  issuer: Building,
  partner: Shield,
  operator: Shield
};
var LoginForm = React27.forwardRef(
  ({
    className,
    layout,
    title = "\u767B\u5F55 GreenLink Capital",
    subtitle = "\u8BBF\u95EE\u60A8\u7684\u7EFF\u8272\u91D1\u878D\u95E8\u6237",
    availableRoles = ["investor", "issuer", "partner", "operator"],
    defaultRole = "investor",
    showRoleSelector = true,
    showRememberMe = true,
    showForgotPassword = true,
    showSignUp = false,
    loading = false,
    error,
    success,
    onLogin,
    onForgotPassword,
    onSignUp,
    onSocialLogin,
    ...props
  }, ref) => {
    const [formData, setFormData] = React27.useState({
      email: "",
      password: "",
      role: defaultRole,
      rememberMe: false
    });
    const [showPassword, setShowPassword] = React27.useState(false);
    const [validationErrors, setValidationErrors] = React27.useState({});
    const filteredRoleOptions = roleOptions.filter(
      (option) => availableRoles.includes(option.value)
    );
    const validateForm = () => {
      const errors = {};
      if (!formData.email) {
        errors.email = "\u8BF7\u8F93\u5165\u90AE\u7BB1\u5730\u5740";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = "\u8BF7\u8F93\u5165\u6709\u6548\u7684\u90AE\u7BB1\u5730\u5740";
      }
      if (!formData.password) {
        errors.password = "\u8BF7\u8F93\u5165\u5BC6\u7801";
      } else if (formData.password.length < 8) {
        errors.password = "\u5BC6\u7801\u81F3\u5C11\u9700\u89818\u4E2A\u5B57\u7B26";
      }
      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    };
    const handleInputChange = (field) => (e) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value
      }));
      if (validationErrors[field]) {
        setValidationErrors((prev) => ({
          ...prev,
          [field]: void 0
        }));
      }
    };
    const handleRoleChange = (role) => {
      setFormData((prev) => ({
        ...prev,
        role
      }));
    };
    const handleRememberMeChange = (e) => {
      setFormData((prev) => ({
        ...prev,
        rememberMe: e.target.checked
      }));
    };
    const handleSubmit = (e) => {
      e.preventDefault();
      if (validateForm()) {
        onLogin?.(formData);
      }
    };
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
    const handleSocialLogin = (provider) => {
      onSocialLogin?.(provider);
    };
    const currentRoleIcon = roleIcons[formData.role];
    const formContent = /* @__PURE__ */ jsxs20("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs20("div", { className: "text-center space-y-2", children: [
        /* @__PURE__ */ jsx26("div", { className: "flex items-center justify-center", children: React27.createElement(currentRoleIcon, {
          className: "h-8 w-8 text-primary-primary"
        }) }),
        /* @__PURE__ */ jsx26(Heading, { level: "h2", className: "text-xl font-semibold", children: title }),
        /* @__PURE__ */ jsx26(Text, { variant: "caption", className: "text-text-secondary", children: subtitle })
      ] }),
      error && /* @__PURE__ */ jsx26("div", { className: "rounded-md bg-status-error/10 border border-status-error/20 p-3", children: /* @__PURE__ */ jsx26(Text, { variant: "error", size: "sm", children: error }) }),
      success && /* @__PURE__ */ jsx26("div", { className: "rounded-md bg-status-success/10 border border-status-success/20 p-3", children: /* @__PURE__ */ jsx26(Text, { variant: "success", size: "sm", children: success }) }),
      showRoleSelector && filteredRoleOptions.length > 1 && /* @__PURE__ */ jsx26(
        Select,
        {
          label: "\u7528\u6237\u89D2\u8272",
          options: filteredRoleOptions,
          value: formData.role,
          onChange: handleRoleChange,
          required: true
        }
      ),
      /* @__PURE__ */ jsx26(
        Input,
        {
          type: "email",
          label: "\u90AE\u7BB1\u5730\u5740",
          placeholder: "your.email@company.com",
          value: formData.email,
          onChange: handleInputChange("email"),
          error: validationErrors.email,
          leftElement: /* @__PURE__ */ jsx26(User, { className: "h-4 w-4 text-text-secondary" }),
          required: true,
          autoComplete: "email"
        }
      ),
      /* @__PURE__ */ jsx26(
        Input,
        {
          type: showPassword ? "text" : "password",
          label: "\u5BC6\u7801",
          placeholder: "\u8F93\u5165\u60A8\u7684\u5BC6\u7801",
          value: formData.password,
          onChange: handleInputChange("password"),
          error: validationErrors.password,
          leftElement: /* @__PURE__ */ jsx26(Lock, { className: "h-4 w-4 text-text-secondary" }),
          rightElement: /* @__PURE__ */ jsx26(
            "button",
            {
              type: "button",
              onClick: togglePasswordVisibility,
              className: "flex items-center p-1 hover:bg-background-secondary rounded",
              tabIndex: -1,
              children: showPassword ? /* @__PURE__ */ jsx26(EyeOff, { className: "h-4 w-4 text-text-secondary" }) : /* @__PURE__ */ jsx26(Eye, { className: "h-4 w-4 text-text-secondary" })
            }
          ),
          required: true,
          autoComplete: "current-password"
        }
      ),
      /* @__PURE__ */ jsxs20("div", { className: "flex items-center justify-between", children: [
        showRememberMe && /* @__PURE__ */ jsx26(
          Checkbox,
          {
            label: "\u8BB0\u4F4F\u767B\u5F55\u72B6\u6001",
            checked: formData.rememberMe,
            onChange: handleRememberMeChange
          }
        ),
        showForgotPassword && /* @__PURE__ */ jsx26(
          Link,
          {
            onClick: onForgotPassword,
            className: "text-sm cursor-pointer",
            children: "\u5FD8\u8BB0\u5BC6\u7801\uFF1F"
          }
        )
      ] }),
      /* @__PURE__ */ jsx26(
        Button,
        {
          type: "submit",
          variant: "primary",
          size: "lg",
          loading,
          className: "w-full",
          children: loading ? "\u767B\u5F55\u4E2D..." : "\u767B\u5F55"
        }
      ),
      onSocialLogin && /* @__PURE__ */ jsxs20(Fragment4, { children: [
        /* @__PURE__ */ jsx26(Divider, { children: "\u6216" }),
        /* @__PURE__ */ jsxs20("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx26(
            Button,
            {
              type: "button",
              variant: "secondary",
              size: "lg",
              className: "w-full",
              onClick: () => handleSocialLogin("google"),
              children: "\u4F7F\u7528 Google \u767B\u5F55"
            }
          ),
          /* @__PURE__ */ jsx26(
            Button,
            {
              type: "button",
              variant: "secondary",
              size: "lg",
              className: "w-full",
              onClick: () => handleSocialLogin("microsoft"),
              children: "\u4F7F\u7528 Microsoft \u767B\u5F55"
            }
          )
        ] })
      ] }),
      showSignUp && onSignUp && /* @__PURE__ */ jsx26("div", { className: "text-center", children: /* @__PURE__ */ jsxs20(Text, { variant: "caption", children: [
        "\u8FD8\u6CA1\u6709\u8D26\u6237\uFF1F",
        " ",
        /* @__PURE__ */ jsx26(Link, { onClick: onSignUp, className: "cursor-pointer", children: "\u7ACB\u5373\u6CE8\u518C" })
      ] }) })
    ] });
    if (layout === "inline" || layout === "modal") {
      return /* @__PURE__ */ jsx26(
        "div",
        {
          ref,
          className: cn(loginFormVariants({ layout }), className),
          ...props,
          children: formContent
        }
      );
    }
    return /* @__PURE__ */ jsx26(
      "div",
      {
        ref,
        className: cn(loginFormVariants({ layout }), className),
        ...props,
        children: /* @__PURE__ */ jsx26(Card, { className: "p-6", children: formContent })
      }
    );
  }
);
LoginForm.displayName = "LoginForm";

// src/components/auth/MFAFlow.tsx
import * as React28 from "react";
import { Shield as Shield2, Smartphone, Key, QrCode, Copy, CheckCircle as CheckCircle2, AlertCircle as AlertCircle2 } from "lucide-react";
import { cva as cva26 } from "class-variance-authority";
import { jsx as jsx27, jsxs as jsxs21 } from "react/jsx-runtime";
var mfaFlowVariants = cva26(
  "w-full max-w-md space-y-6",
  {
    variants: {
      step: {
        method: "",
        setup: "",
        verify: "",
        backup: "",
        complete: ""
      }
    },
    defaultVariants: {
      step: "method"
    }
  }
);
var methodConfig = {
  authenticator: {
    icon: Smartphone,
    title: "\u8EAB\u4EFD\u9A8C\u8BC1\u5668\u5E94\u7528",
    description: "\u4F7F\u7528 Google Authenticator \u6216\u7C7B\u4F3C\u5E94\u7528",
    security: "high"
  },
  sms: {
    icon: Smartphone,
    title: "\u77ED\u4FE1\u9A8C\u8BC1",
    description: "\u53D1\u9001\u9A8C\u8BC1\u7801\u5230\u60A8\u7684\u624B\u673A",
    security: "medium"
  },
  email: {
    icon: Key,
    title: "\u90AE\u7BB1\u9A8C\u8BC1",
    description: "\u53D1\u9001\u9A8C\u8BC1\u7801\u5230\u60A8\u7684\u90AE\u7BB1",
    security: "medium"
  },
  backup: {
    icon: Shield2,
    title: "\u5907\u7528\u4EE3\u7801",
    description: "\u4F7F\u7528\u9884\u751F\u6210\u7684\u5907\u7528\u4EE3\u7801",
    security: "low"
  }
};
var MFAFlow = React28.forwardRef(
  ({
    className,
    currentStep = "method",
    availableMethods = ["authenticator", "sms", "email"],
    selectedMethod,
    setupData,
    loading = false,
    error,
    success,
    phoneNumber,
    email,
    onMethodSelect,
    onSetupComplete,
    onVerify,
    onBackupCodesAcknowledged,
    onComplete,
    onBack,
    ...props
  }, ref) => {
    const [verificationCode, setVerificationCode] = React28.useState("");
    const [copiedSecret, setCopiedSecret] = React28.useState(false);
    const [acknowledgedBackup, setAcknowledgedBackup] = React28.useState(false);
    const stepProgress = {
      method: 20,
      setup: 40,
      verify: 60,
      backup: 80,
      complete: 100
    };
    const handleMethodSelect = (method) => {
      onMethodSelect?.(method);
    };
    const handleCodeChange = (e) => {
      const code = e.target.value.replace(/\D/g, "").slice(0, 6);
      setVerificationCode(code);
    };
    const handleVerifySubmit = (e) => {
      e.preventDefault();
      if (verificationCode.length === 6) {
        onVerify?.(verificationCode);
      }
    };
    const handleSetupComplete = () => {
      if (selectedMethod && verificationCode.length === 6) {
        onSetupComplete?.({ method: selectedMethod, code: verificationCode });
      }
    };
    const copyToClipboard = async (text) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedSecret(true);
        setTimeout(() => setCopiedSecret(false), 2e3);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    };
    const handleBackupAcknowledged = () => {
      setAcknowledgedBackup(true);
      onBackupCodesAcknowledged?.();
    };
    const renderMethodSelection = () => /* @__PURE__ */ jsxs21("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs21("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx27(Shield2, { className: "h-12 w-12 text-primary-primary mx-auto mb-4" }),
        /* @__PURE__ */ jsx27(Heading, { level: "h2", className: "text-xl font-semibold", children: "\u8BBE\u7F6E\u53CC\u56E0\u7D20\u8BA4\u8BC1" }),
        /* @__PURE__ */ jsx27(Text, { variant: "caption", className: "text-text-secondary mt-2", children: "\u9009\u62E9\u60A8\u504F\u597D\u7684\u9A8C\u8BC1\u65B9\u5F0F\u4EE5\u589E\u5F3A\u8D26\u6237\u5B89\u5168\u6027" })
      ] }),
      /* @__PURE__ */ jsx27("div", { className: "space-y-3", children: availableMethods.map((method) => {
        const config = methodConfig[method];
        const IconComponent = config.icon;
        return /* @__PURE__ */ jsx27(
          Card,
          {
            className: cn(
              "p-4 cursor-pointer transition-all hover:border-primary-primary",
              selectedMethod === method && "border-primary-primary bg-primary-primary/5"
            ),
            onClick: () => handleMethodSelect(method),
            children: /* @__PURE__ */ jsxs21("div", { className: "flex items-start space-x-3", children: [
              /* @__PURE__ */ jsx27(IconComponent, { className: "h-5 w-5 text-primary-primary mt-0.5" }),
              /* @__PURE__ */ jsxs21("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxs21("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx27(Text, { variant: "label", className: "font-medium", children: config.title }),
                  /* @__PURE__ */ jsx27(
                    Badge,
                    {
                      variant: config.security === "high" ? "success" : config.security === "medium" ? "warning" : "default",
                      size: "sm",
                      children: config.security === "high" ? "\u9AD8\u5B89\u5168" : config.security === "medium" ? "\u4E2D\u7B49" : "\u57FA\u7840"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx27(Text, { variant: "caption", className: "text-text-secondary mt-1", children: config.description }),
                method === "sms" && phoneNumber && /* @__PURE__ */ jsxs21(Text, { variant: "caption", className: "text-primary-primary mt-1", children: [
                  "\u53D1\u9001\u81F3: ",
                  phoneNumber
                ] }),
                method === "email" && email && /* @__PURE__ */ jsxs21(Text, { variant: "caption", className: "text-primary-primary mt-1", children: [
                  "\u53D1\u9001\u81F3: ",
                  email
                ] })
              ] })
            ] })
          },
          method
        );
      }) }),
      /* @__PURE__ */ jsx27(
        Button,
        {
          variant: "primary",
          size: "lg",
          className: "w-full",
          disabled: !selectedMethod,
          onClick: () => handleMethodSelect(selectedMethod),
          children: "\u7EE7\u7EED\u8BBE\u7F6E"
        }
      )
    ] });
    const renderAuthenticatorSetup = () => /* @__PURE__ */ jsxs21("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs21("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx27(Smartphone, { className: "h-12 w-12 text-primary-primary mx-auto mb-4" }),
        /* @__PURE__ */ jsx27(Heading, { level: "h2", className: "text-xl font-semibold", children: "\u8BBE\u7F6E\u8EAB\u4EFD\u9A8C\u8BC1\u5668" }),
        /* @__PURE__ */ jsx27(Text, { variant: "caption", className: "text-text-secondary mt-2", children: "\u4F7F\u7528\u60A8\u7684\u8EAB\u4EFD\u9A8C\u8BC1\u5668\u5E94\u7528\u626B\u63CF\u4E8C\u7EF4\u7801" })
      ] }),
      setupData?.qrCodeUrl && /* @__PURE__ */ jsxs21("div", { className: "text-center space-y-4", children: [
        /* @__PURE__ */ jsx27("div", { className: "inline-block p-4 bg-white rounded-lg border", children: /* @__PURE__ */ jsx27(QrCode, { className: "h-32 w-32 text-text-primary" }) }),
        /* @__PURE__ */ jsx27(Text, { variant: "caption", className: "text-text-secondary", children: "\u65E0\u6CD5\u626B\u63CF\uFF1F\u624B\u52A8\u8F93\u5165\u5BC6\u94A5" })
      ] }),
      setupData?.secret && /* @__PURE__ */ jsxs21("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx27(Text, { variant: "label", className: "text-sm font-medium", children: "\u624B\u52A8\u8F93\u5165\u5BC6\u94A5:" }),
        /* @__PURE__ */ jsxs21("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx27(
            Input,
            {
              value: setupData.secret,
              readOnly: true,
              className: "font-mono text-sm"
            }
          ),
          /* @__PURE__ */ jsx27(
            Button,
            {
              variant: "secondary",
              size: "sm",
              onClick: () => copyToClipboard(setupData.secret),
              children: copiedSecret ? /* @__PURE__ */ jsx27(CheckCircle2, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx27(Copy, { className: "h-4 w-4" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs21("form", { onSubmit: handleSetupComplete, className: "space-y-4", children: [
        /* @__PURE__ */ jsx27(
          Input,
          {
            label: "\u9A8C\u8BC1\u7801",
            placeholder: "\u8F93\u51656\u4F4D\u9A8C\u8BC1\u7801",
            value: verificationCode,
            onChange: handleCodeChange,
            maxLength: 6,
            className: "text-center text-lg tracking-widest"
          }
        ),
        /* @__PURE__ */ jsxs21("div", { className: "flex space-x-3", children: [
          /* @__PURE__ */ jsx27(
            Button,
            {
              type: "button",
              variant: "secondary",
              className: "flex-1",
              onClick: onBack,
              children: "\u8FD4\u56DE"
            }
          ),
          /* @__PURE__ */ jsx27(
            Button,
            {
              type: "submit",
              variant: "primary",
              className: "flex-1",
              disabled: verificationCode.length !== 6,
              loading,
              children: "\u9A8C\u8BC1\u5E76\u7EE7\u7EED"
            }
          )
        ] })
      ] })
    ] });
    const renderVerification = () => /* @__PURE__ */ jsxs21("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs21("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx27(Key, { className: "h-12 w-12 text-primary-primary mx-auto mb-4" }),
        /* @__PURE__ */ jsx27(Heading, { level: "h2", className: "text-xl font-semibold", children: "\u8F93\u5165\u9A8C\u8BC1\u7801" }),
        /* @__PURE__ */ jsxs21(Text, { variant: "caption", className: "text-text-secondary mt-2", children: [
          selectedMethod === "sms" && `\u9A8C\u8BC1\u7801\u5DF2\u53D1\u9001\u81F3 ${phoneNumber}`,
          selectedMethod === "email" && `\u9A8C\u8BC1\u7801\u5DF2\u53D1\u9001\u81F3 ${email}`,
          selectedMethod === "authenticator" && "\u8BF7\u8F93\u5165\u8EAB\u4EFD\u9A8C\u8BC1\u5668\u5E94\u7528\u4E2D\u76846\u4F4D\u9A8C\u8BC1\u7801"
        ] })
      ] }),
      /* @__PURE__ */ jsxs21("form", { onSubmit: handleVerifySubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsx27(
          Input,
          {
            label: "\u9A8C\u8BC1\u7801",
            placeholder: "\u8F93\u51656\u4F4D\u9A8C\u8BC1\u7801",
            value: verificationCode,
            onChange: handleCodeChange,
            maxLength: 6,
            className: "text-center text-lg tracking-widest",
            autoFocus: true
          }
        ),
        /* @__PURE__ */ jsx27(
          Button,
          {
            type: "submit",
            variant: "primary",
            size: "lg",
            className: "w-full",
            disabled: verificationCode.length !== 6,
            loading,
            children: "\u9A8C\u8BC1"
          }
        )
      ] }),
      (selectedMethod === "sms" || selectedMethod === "email") && /* @__PURE__ */ jsx27("div", { className: "text-center", children: /* @__PURE__ */ jsxs21(Text, { variant: "caption", className: "text-text-secondary", children: [
        "\u6CA1\u6709\u6536\u5230\u9A8C\u8BC1\u7801\uFF1F",
        " ",
        /* @__PURE__ */ jsx27("button", { className: "text-primary-primary hover:underline", children: "\u91CD\u65B0\u53D1\u9001" })
      ] }) })
    ] });
    const renderBackupCodes = () => /* @__PURE__ */ jsxs21("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs21("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx27(Shield2, { className: "h-12 w-12 text-status-warning mx-auto mb-4" }),
        /* @__PURE__ */ jsx27(Heading, { level: "h2", className: "text-xl font-semibold", children: "\u4FDD\u5B58\u5907\u7528\u4EE3\u7801" }),
        /* @__PURE__ */ jsx27(Text, { variant: "caption", className: "text-text-secondary mt-2", children: "\u8BF7\u5C06\u8FD9\u4E9B\u5907\u7528\u4EE3\u7801\u4FDD\u5B58\u5728\u5B89\u5168\u7684\u5730\u65B9" })
      ] }),
      setupData?.backupCodes && /* @__PURE__ */ jsxs21("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx27("div", { className: "bg-background-secondary rounded-lg p-4", children: /* @__PURE__ */ jsx27("div", { className: "grid grid-cols-2 gap-2", children: setupData.backupCodes.map((code, index) => /* @__PURE__ */ jsx27(
          "div",
          {
            className: "font-mono text-sm text-center py-2 px-3 bg-background-primary rounded border",
            children: code
          },
          index
        )) }) }),
        /* @__PURE__ */ jsx27("div", { className: "bg-status-warning/10 border border-status-warning/20 rounded-lg p-4", children: /* @__PURE__ */ jsxs21("div", { className: "flex items-start space-x-2", children: [
          /* @__PURE__ */ jsx27(AlertCircle2, { className: "h-5 w-5 text-status-warning mt-0.5" }),
          /* @__PURE__ */ jsxs21("div", { children: [
            /* @__PURE__ */ jsx27(Text, { variant: "label", className: "text-status-warning font-medium", children: "\u91CD\u8981\u63D0\u9192" }),
            /* @__PURE__ */ jsx27(Text, { variant: "caption", className: "text-text-secondary mt-1", children: "\u6BCF\u4E2A\u5907\u7528\u4EE3\u7801\u53EA\u80FD\u4F7F\u7528\u4E00\u6B21\u3002\u8BF7\u5C06\u5176\u4FDD\u5B58\u5728\u5B89\u5168\u7684\u5730\u65B9\uFF0C\u5982\u5BC6\u7801\u7BA1\u7406\u5668\u4E2D\u3002" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx27(
          Button,
          {
            variant: "secondary",
            size: "lg",
            className: "w-full",
            onClick: () => copyToClipboard(setupData.backupCodes.join("\n")),
            children: copiedSecret ? "\u5DF2\u590D\u5236" : "\u590D\u5236\u6240\u6709\u4EE3\u7801"
          }
        ),
        /* @__PURE__ */ jsx27(
          Button,
          {
            variant: "primary",
            size: "lg",
            className: "w-full",
            onClick: handleBackupAcknowledged,
            disabled: !acknowledgedBackup,
            children: "\u6211\u5DF2\u5B89\u5168\u4FDD\u5B58\u8FD9\u4E9B\u4EE3\u7801"
          }
        )
      ] })
    ] });
    const renderComplete = () => /* @__PURE__ */ jsxs21("div", { className: "space-y-4 text-center", children: [
      /* @__PURE__ */ jsx27(CheckCircle2, { className: "h-16 w-16 text-status-success mx-auto mb-4" }),
      /* @__PURE__ */ jsx27(Heading, { level: "h2", className: "text-xl font-semibold text-status-success", children: "\u53CC\u56E0\u7D20\u8BA4\u8BC1\u5DF2\u542F\u7528" }),
      /* @__PURE__ */ jsx27(Text, { variant: "caption", className: "text-text-secondary", children: "\u60A8\u7684\u8D26\u6237\u73B0\u5728\u53D7\u5230\u53CC\u56E0\u7D20\u8BA4\u8BC1\u4FDD\u62A4" }),
      /* @__PURE__ */ jsxs21("div", { className: "bg-status-success/10 border border-status-success/20 rounded-lg p-4", children: [
        /* @__PURE__ */ jsx27(Text, { variant: "label", className: "text-status-success font-medium", children: "\u5B89\u5168\u7EA7\u522B: \u9AD8" }),
        /* @__PURE__ */ jsx27(Text, { variant: "caption", className: "text-text-secondary mt-1", children: "\u542F\u7528\u53CC\u56E0\u7D20\u8BA4\u8BC1\u540E\uFF0C\u5373\u4F7F\u6709\u4EBA\u77E5\u9053\u60A8\u7684\u5BC6\u7801\uFF0C\u4E5F\u65E0\u6CD5\u8BBF\u95EE\u60A8\u7684\u8D26\u6237\u3002" })
      ] }),
      /* @__PURE__ */ jsx27(
        Button,
        {
          variant: "primary",
          size: "lg",
          className: "w-full",
          onClick: onComplete,
          children: "\u5B8C\u6210\u8BBE\u7F6E"
        }
      )
    ] });
    const renderCurrentStep = () => {
      switch (currentStep) {
        case "method":
          return renderMethodSelection();
        case "setup":
          return selectedMethod === "authenticator" ? renderAuthenticatorSetup() : renderVerification();
        case "verify":
          return renderVerification();
        case "backup":
          return renderBackupCodes();
        case "complete":
          return renderComplete();
        default:
          return renderMethodSelection();
      }
    };
    return /* @__PURE__ */ jsx27(
      "div",
      {
        ref,
        className: cn(mfaFlowVariants({ step: currentStep }), className),
        ...props,
        children: /* @__PURE__ */ jsxs21(Card, { className: "p-6", children: [
          /* @__PURE__ */ jsxs21("div", { className: "mb-6", children: [
            /* @__PURE__ */ jsx27(
              Progress,
              {
                value: stepProgress[currentStep],
                showValue: false,
                className: "mb-2"
              }
            ),
            /* @__PURE__ */ jsxs21("div", { className: "flex justify-between text-xs text-text-secondary", children: [
              /* @__PURE__ */ jsxs21("span", { children: [
                "\u6B65\u9AA4 ",
                Object.keys(stepProgress).indexOf(currentStep) + 1
              ] }),
              /* @__PURE__ */ jsxs21("span", { children: [
                "\u5171 ",
                Object.keys(stepProgress).length,
                " \u6B65"
              ] })
            ] })
          ] }),
          error && /* @__PURE__ */ jsx27("div", { className: "mb-4 rounded-md bg-status-error/10 border border-status-error/20 p-3", children: /* @__PURE__ */ jsx27(Text, { variant: "error", size: "sm", children: error }) }),
          success && /* @__PURE__ */ jsx27("div", { className: "mb-4 rounded-md bg-status-success/10 border border-status-success/20 p-3", children: /* @__PURE__ */ jsx27(Text, { variant: "success", size: "sm", children: success }) }),
          renderCurrentStep()
        ] })
      }
    );
  }
);
MFAFlow.displayName = "MFAFlow";

// src/components/auth/PermissionGuard.tsx
import * as React29 from "react";
import { Shield as Shield3, Lock as Lock2, AlertTriangle as AlertTriangle2, User as User2 } from "lucide-react";
import { cva as cva27 } from "class-variance-authority";
import { Fragment as Fragment5, jsx as jsx28, jsxs as jsxs22 } from "react/jsx-runtime";
var permissionGuardVariants = cva27(
  "w-full",
  {
    variants: {
      fallbackType: {
        redirect: "",
        inline: "",
        modal: "",
        overlay: "fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      }
    },
    defaultVariants: {
      fallbackType: "inline"
    }
  }
);
var roleLabels = {
  investor: "\u6295\u8D44\u8005",
  issuer: "\u53D1\u884C\u65B9",
  partner: "\u5408\u4F5C\u4F19\u4F34",
  operator: "\u8FD0\u8425\u65B9",
  admin: "\u7BA1\u7406\u5458"
};
var roleColors = {
  investor: "default",
  issuer: "success",
  partner: "warning",
  operator: "warning",
  admin: "error"
};
var PermissionGuard = React29.forwardRef(
  ({
    className,
    fallbackType,
    user,
    requiredRoles,
    requiredPermissions,
    requireMFA = false,
    requireVerified = true,
    loading = false,
    loadingComponent,
    fallbackComponent,
    showDetails = true,
    onAccessDenied,
    onLogin,
    onVerify,
    onEnableMFA,
    children,
    ...props
  }, ref) => {
    const checkAccess = React29.useCallback(() => {
      if (!user) {
        return {
          hasAccess: false,
          reason: "authentication_required",
          details: "\u8BF7\u767B\u5F55\u4EE5\u8BBF\u95EE\u6B64\u5185\u5BB9"
        };
      }
      if (!user.isActive) {
        return {
          hasAccess: false,
          reason: "account_inactive",
          details: "\u60A8\u7684\u8D26\u6237\u5DF2\u88AB\u505C\u7528\uFF0C\u8BF7\u8054\u7CFB\u7BA1\u7406\u5458"
        };
      }
      if (requireVerified && !user.isVerified) {
        return {
          hasAccess: false,
          reason: "verification_required",
          details: "\u8BF7\u9A8C\u8BC1\u60A8\u7684\u90AE\u7BB1\u5730\u5740\u4EE5\u7EE7\u7EED"
        };
      }
      if (requireMFA && !user.mfaEnabled) {
        return {
          hasAccess: false,
          reason: "mfa_required",
          details: "\u6B64\u64CD\u4F5C\u9700\u8981\u542F\u7528\u53CC\u56E0\u7D20\u8BA4\u8BC1"
        };
      }
      if (requiredRoles && requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.includes(user.role);
        if (!hasRequiredRole) {
          return {
            hasAccess: false,
            reason: "insufficient_role",
            details: `\u9700\u8981\u4EE5\u4E0B\u89D2\u8272\u4E4B\u4E00: ${requiredRoles.map((role) => roleLabels[role]).join(", ")}`
          };
        }
      }
      if (requiredPermissions && requiredPermissions.length > 0) {
        const missingPermissions = requiredPermissions.filter(
          (permission) => !user.permissions.includes(permission)
        );
        if (missingPermissions.length > 0) {
          return {
            hasAccess: false,
            reason: "insufficient_permissions",
            details: `\u7F3A\u5C11\u6743\u9650: ${missingPermissions.join(", ")}`
          };
        }
      }
      return { hasAccess: true, reason: "" };
    }, [user, requiredRoles, requiredPermissions, requireMFA, requireVerified]);
    const accessCheck = checkAccess();
    React29.useEffect(() => {
      if (!accessCheck.hasAccess) {
        onAccessDenied?.(accessCheck.reason, requiredRoles, requiredPermissions);
      }
    }, [accessCheck, onAccessDenied, requiredRoles, requiredPermissions]);
    if (loading) {
      if (loadingComponent) {
        return /* @__PURE__ */ jsx28(Fragment5, { children: loadingComponent });
      }
      return /* @__PURE__ */ jsx28("div", { className: "flex items-center justify-center p-8", children: /* @__PURE__ */ jsxs22("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsx28("div", { className: "animate-spin rounded-full h-6 w-6 border-b-2 border-primary-primary" }),
        /* @__PURE__ */ jsx28(Text, { variant: "caption", children: "\u68C0\u67E5\u6743\u9650\u4E2D..." })
      ] }) });
    }
    if (accessCheck.hasAccess) {
      return /* @__PURE__ */ jsx28(Fragment5, { children });
    }
    if (fallbackComponent) {
      return /* @__PURE__ */ jsx28(Fragment5, { children: fallbackComponent });
    }
    const renderFallback = () => {
      const getIcon = () => {
        switch (accessCheck.reason) {
          case "authentication_required":
            return /* @__PURE__ */ jsx28(User2, { className: "h-12 w-12 text-primary-primary" });
          case "account_inactive":
            return /* @__PURE__ */ jsx28(AlertTriangle2, { className: "h-12 w-12 text-status-error" });
          case "verification_required":
            return /* @__PURE__ */ jsx28(Shield3, { className: "h-12 w-12 text-status-warning" });
          case "mfa_required":
            return /* @__PURE__ */ jsx28(Shield3, { className: "h-12 w-12 text-status-warning" });
          default:
            return /* @__PURE__ */ jsx28(Lock2, { className: "h-12 w-12 text-status-error" });
        }
      };
      const getTitle = () => {
        switch (accessCheck.reason) {
          case "authentication_required":
            return "\u9700\u8981\u767B\u5F55";
          case "account_inactive":
            return "\u8D26\u6237\u5DF2\u505C\u7528";
          case "verification_required":
            return "\u9700\u8981\u9A8C\u8BC1";
          case "mfa_required":
            return "\u9700\u8981\u53CC\u56E0\u7D20\u8BA4\u8BC1";
          case "insufficient_role":
            return "\u6743\u9650\u4E0D\u8DB3";
          case "insufficient_permissions":
            return "\u7F3A\u5C11\u6743\u9650";
          default:
            return "\u8BBF\u95EE\u88AB\u62D2\u7EDD";
        }
      };
      const getActions = () => {
        switch (accessCheck.reason) {
          case "authentication_required":
            return onLogin ? /* @__PURE__ */ jsx28(Button, { variant: "primary", onClick: onLogin, children: "\u7ACB\u5373\u767B\u5F55" }) : null;
          case "verification_required":
            return onVerify ? /* @__PURE__ */ jsx28(Button, { variant: "primary", onClick: onVerify, children: "\u9A8C\u8BC1\u90AE\u7BB1" }) : null;
          case "mfa_required":
            return onEnableMFA ? /* @__PURE__ */ jsx28(Button, { variant: "primary", onClick: onEnableMFA, children: "\u542F\u7528\u53CC\u56E0\u7D20\u8BA4\u8BC1" }) : null;
          default:
            return null;
        }
      };
      return /* @__PURE__ */ jsxs22("div", { className: "text-center space-y-4 p-8", children: [
        /* @__PURE__ */ jsx28("div", { className: "flex justify-center mb-4", children: getIcon() }),
        /* @__PURE__ */ jsx28(Heading, { level: "h3", className: "text-lg font-semibold", children: getTitle() }),
        accessCheck.details && /* @__PURE__ */ jsx28(Text, { variant: "caption", className: "text-text-secondary", children: accessCheck.details }),
        showDetails && user && /* @__PURE__ */ jsxs22("div", { className: "mt-6 space-y-3", children: [
          /* @__PURE__ */ jsxs22("div", { className: "flex items-center justify-center space-x-2", children: [
            /* @__PURE__ */ jsx28(Text, { variant: "caption", className: "text-text-secondary", children: "\u5F53\u524D\u89D2\u8272:" }),
            /* @__PURE__ */ jsx28(Badge, { variant: roleColors[user.role], children: roleLabels[user.role] })
          ] }),
          requiredRoles && requiredRoles.length > 0 && /* @__PURE__ */ jsxs22("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx28(Text, { variant: "caption", className: "text-text-secondary", children: "\u6240\u9700\u89D2\u8272:" }),
            /* @__PURE__ */ jsx28("div", { className: "flex flex-wrap justify-center gap-2", children: requiredRoles.map((role) => /* @__PURE__ */ jsx28(Badge, { variant: "default", size: "sm", children: roleLabels[role] }, role)) })
          ] }),
          requiredPermissions && requiredPermissions.length > 0 && /* @__PURE__ */ jsxs22("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx28(Text, { variant: "caption", className: "text-text-secondary", children: "\u6240\u9700\u6743\u9650:" }),
            /* @__PURE__ */ jsx28("div", { className: "flex flex-wrap justify-center gap-2", children: requiredPermissions.map((permission) => /* @__PURE__ */ jsx28(Badge, { variant: "default", size: "sm", children: permission }, permission)) })
          ] })
        ] }),
        getActions() && /* @__PURE__ */ jsx28("div", { className: "mt-6", children: getActions() })
      ] });
    };
    const fallbackContent = renderFallback();
    if (fallbackType === "overlay") {
      return /* @__PURE__ */ jsx28(
        "div",
        {
          ref,
          className: cn(permissionGuardVariants({ fallbackType }), className),
          ...props,
          children: /* @__PURE__ */ jsx28(Card, { className: "max-w-md mx-4", children: fallbackContent })
        }
      );
    }
    if (fallbackType === "modal") {
      return /* @__PURE__ */ jsx28(
        "div",
        {
          ref,
          className: cn(permissionGuardVariants({ fallbackType }), className),
          ...props,
          children: /* @__PURE__ */ jsx28(Card, { children: fallbackContent })
        }
      );
    }
    return /* @__PURE__ */ jsx28(
      "div",
      {
        ref,
        className: cn(permissionGuardVariants({ fallbackType }), className),
        ...props,
        children: /* @__PURE__ */ jsx28(Card, { children: fallbackContent })
      }
    );
  }
);
PermissionGuard.displayName = "PermissionGuard";
function withPermissionGuard(Component, guardProps) {
  const WrappedComponent = React29.forwardRef((props, ref) => {
    return /* @__PURE__ */ jsx28(PermissionGuard, { ...guardProps, children: /* @__PURE__ */ jsx28(Component, { ...props, ref }) });
  });
  WrappedComponent.displayName = `withPermissionGuard(${Component.displayName || Component.name})`;
  return WrappedComponent;
}
function usePermissions(user) {
  const hasRole = React29.useCallback((roles) => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  }, [user]);
  const hasPermission = React29.useCallback((permissions) => {
    if (!user) return false;
    const permissionArray = Array.isArray(permissions) ? permissions : [permissions];
    return permissionArray.every((permission) => user.permissions.includes(permission));
  }, [user]);
  const hasAllRequirements = React29.useCallback((requirements) => {
    if (!user) return false;
    if (requirements.roles && !hasRole(requirements.roles)) return false;
    if (requirements.permissions && !hasPermission(requirements.permissions)) return false;
    if (requirements.requireMFA && !user.mfaEnabled) return false;
    if (requirements.requireVerified && !user.isVerified) return false;
    return true;
  }, [user, hasRole, hasPermission]);
  return {
    user,
    hasRole,
    hasPermission,
    hasAllRequirements,
    isAuthenticated: !!user,
    isActive: user?.isActive ?? false,
    isVerified: user?.isVerified ?? false,
    mfaEnabled: user?.mfaEnabled ?? false
  };
}

// src/components/auth/SessionManager.tsx
import * as React30 from "react";
import {
  Clock,
  Monitor,
  Smartphone as Smartphone2,
  MapPin,
  AlertTriangle as AlertTriangle3,
  Shield as Shield4,
  RefreshCw,
  Eye as Eye2,
  Trash2
} from "lucide-react";
import { cva as cva28 } from "class-variance-authority";
import { Fragment as Fragment6, jsx as jsx29, jsxs as jsxs23 } from "react/jsx-runtime";
var sessionManagerVariants = cva28(
  "w-full space-y-6",
  {
    variants: {
      layout: {
        full: "max-w-4xl",
        compact: "max-w-2xl",
        minimal: "max-w-md"
      }
    },
    defaultVariants: {
      layout: "full"
    }
  }
);
var deviceIcons = {
  desktop: Monitor,
  mobile: Smartphone2,
  tablet: Monitor
  // Could be a tablet icon
};
var SessionManager = React30.forwardRef(
  ({
    className,
    layout,
    currentSession,
    sessions = [],
    sessionTimeout = 60,
    // 60 minutes
    warningThreshold = 5,
    // 5 minutes warning
    refreshInterval = 30,
    // 30 seconds
    showSecurityDetails = true,
    showActivity = true,
    loading = false,
    onTerminateSession,
    onTerminateAllSessions,
    onRefreshSession,
    onTimeoutWarning,
    onSessionExpired,
    ...props
  }, ref) => {
    const [timeRemaining, setTimeRemaining] = React30.useState(null);
    const [showTimeoutWarning, setShowTimeoutWarning] = React30.useState(false);
    const [autoRefreshEnabled, setAutoRefreshEnabled] = React30.useState(true);
    React30.useEffect(() => {
      if (!currentSession) return;
      const updateTimeRemaining = () => {
        const now = /* @__PURE__ */ new Date();
        const remaining = Math.max(0, currentSession.expiresAt.getTime() - now.getTime());
        const remainingMinutes = Math.floor(remaining / (1e3 * 60));
        setTimeRemaining(remainingMinutes);
        if (remainingMinutes <= warningThreshold && remainingMinutes > 0) {
          if (!showTimeoutWarning) {
            setShowTimeoutWarning(true);
            onTimeoutWarning?.(remainingMinutes);
          }
        } else {
          setShowTimeoutWarning(false);
        }
        if (remainingMinutes <= 0) {
          onSessionExpired?.();
        }
      };
      updateTimeRemaining();
      const interval = setInterval(updateTimeRemaining, 1e3 * 60);
      return () => clearInterval(interval);
    }, [currentSession, warningThreshold, showTimeoutWarning, onTimeoutWarning, onSessionExpired]);
    React30.useEffect(() => {
      if (!autoRefreshEnabled || !onRefreshSession) return;
      const interval = setInterval(() => {
        onRefreshSession();
      }, refreshInterval * 1e3);
      return () => clearInterval(interval);
    }, [autoRefreshEnabled, refreshInterval, onRefreshSession]);
    const formatLastActivity = (date) => {
      const now = /* @__PURE__ */ new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / (1e3 * 60));
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      if (minutes < 1) return "\u521A\u521A";
      if (minutes < 60) return `${minutes}\u5206\u949F\u524D`;
      if (hours < 24) return `${hours}\u5C0F\u65F6\u524D`;
      return `${days}\u5929\u524D`;
    };
    const formatDuration = (startDate, endDate) => {
      const end = endDate || /* @__PURE__ */ new Date();
      const diff = end.getTime() - startDate.getTime();
      const hours = Math.floor(diff / (1e3 * 60 * 60));
      const minutes = Math.floor(diff % (1e3 * 60 * 60) / (1e3 * 60));
      if (hours > 0) {
        return `${hours}\u5C0F\u65F6${minutes}\u5206\u949F`;
      }
      return `${minutes}\u5206\u949F`;
    };
    const getSessionProgress = () => {
      if (!currentSession || !timeRemaining) return 0;
      const totalMinutes = sessionTimeout;
      const remainingMinutes = timeRemaining;
      return (totalMinutes - remainingMinutes) / totalMinutes * 100;
    };
    const renderCurrentSession = () => {
      if (!currentSession) return null;
      const DeviceIcon = deviceIcons[currentSession.deviceType];
      const progress = getSessionProgress();
      return /* @__PURE__ */ jsxs23(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsxs23("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxs23("div", { className: "flex items-center space-x-3", children: [
            /* @__PURE__ */ jsx29("div", { className: "flex items-center justify-center w-10 h-10 rounded-full bg-primary-primary/10", children: /* @__PURE__ */ jsx29(DeviceIcon, { className: "h-5 w-5 text-primary-primary" }) }),
            /* @__PURE__ */ jsxs23("div", { children: [
              /* @__PURE__ */ jsx29(Heading, { level: "h3", className: "text-lg font-semibold", children: "\u5F53\u524D\u4F1A\u8BDD" }),
              /* @__PURE__ */ jsxs23(Text, { variant: "caption", className: "text-text-secondary", children: [
                currentSession.deviceName || "\u672A\u77E5\u8BBE\u5907",
                " \u2022 ",
                currentSession.browser
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs23(Badge, { variant: "success", className: "flex items-center space-x-1", children: [
            /* @__PURE__ */ jsx29(Shield4, { className: "h-3 w-3" }),
            /* @__PURE__ */ jsx29("span", { children: "\u6D3B\u8DC3" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs23("div", { className: "space-y-2 mb-4", children: [
          /* @__PURE__ */ jsxs23("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx29(Text, { variant: "label", className: "text-sm", children: "\u4F1A\u8BDD\u8FDB\u5EA6" }),
            /* @__PURE__ */ jsx29(Text, { variant: "caption", className: "text-text-secondary", children: timeRemaining !== null ? `${timeRemaining}\u5206\u949F\u540E\u8FC7\u671F` : "\u8BA1\u7B97\u4E2D..." })
          ] }),
          /* @__PURE__ */ jsx29(
            Progress,
            {
              value: progress,
              variant: showTimeoutWarning ? "warning" : "default",
              size: "sm"
            }
          )
        ] }),
        showTimeoutWarning && /* @__PURE__ */ jsx29("div", { className: "mb-4 p-3 rounded-lg bg-status-warning/10 border border-status-warning/20", children: /* @__PURE__ */ jsxs23("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx29(AlertTriangle3, { className: "h-4 w-4 text-status-warning" }),
          /* @__PURE__ */ jsxs23(Text, { variant: "warning", size: "sm", children: [
            "\u4F1A\u8BDD\u5C06\u5728 ",
            timeRemaining,
            " \u5206\u949F\u540E\u8FC7\u671F"
          ] })
        ] }) }),
        showSecurityDetails && /* @__PURE__ */ jsxs23("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4", children: [
          /* @__PURE__ */ jsxs23("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx29(Text, { variant: "label", className: "text-xs uppercase tracking-wide text-text-secondary", children: "\u5B89\u5168\u4FE1\u606F" }),
            /* @__PURE__ */ jsxs23("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxs23("div", { className: "flex items-center space-x-2", children: [
                /* @__PURE__ */ jsx29(Shield4, { className: "h-3 w-3 text-text-secondary" }),
                /* @__PURE__ */ jsx29(Text, { variant: "caption", children: currentSession.isSecure ? "HTTPS \u5B89\u5168\u8FDE\u63A5" : "HTTP \u8FDE\u63A5" })
              ] }),
              /* @__PURE__ */ jsxs23("div", { className: "flex items-center space-x-2", children: [
                /* @__PURE__ */ jsx29(MapPin, { className: "h-3 w-3 text-text-secondary" }),
                /* @__PURE__ */ jsx29(Text, { variant: "caption", children: currentSession.location || "\u672A\u77E5\u4F4D\u7F6E" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs23("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx29(Text, { variant: "label", className: "text-xs uppercase tracking-wide text-text-secondary", children: "\u4F1A\u8BDD\u4FE1\u606F" }),
            /* @__PURE__ */ jsxs23("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxs23("div", { className: "flex items-center space-x-2", children: [
                /* @__PURE__ */ jsx29(Clock, { className: "h-3 w-3 text-text-secondary" }),
                /* @__PURE__ */ jsxs23(Text, { variant: "caption", children: [
                  "\u6D3B\u8DC3\u65F6\u957F: ",
                  formatDuration(currentSession.createdAt)
                ] })
              ] }),
              /* @__PURE__ */ jsxs23("div", { className: "flex items-center space-x-2", children: [
                /* @__PURE__ */ jsx29(Eye2, { className: "h-3 w-3 text-text-secondary" }),
                /* @__PURE__ */ jsxs23(Text, { variant: "caption", children: [
                  "\u6700\u540E\u6D3B\u8DC3: ",
                  formatLastActivity(currentSession.lastActivity)
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs23("div", { className: "flex space-x-3", children: [
          /* @__PURE__ */ jsxs23(
            Button,
            {
              variant: "secondary",
              size: "sm",
              onClick: onRefreshSession,
              disabled: loading,
              children: [
                /* @__PURE__ */ jsx29(RefreshCw, { className: "h-4 w-4 mr-2" }),
                "\u5237\u65B0\u4F1A\u8BDD"
              ]
            }
          ),
          /* @__PURE__ */ jsxs23(
            Button,
            {
              variant: "tertiary",
              size: "sm",
              onClick: () => setAutoRefreshEnabled(!autoRefreshEnabled),
              children: [
                autoRefreshEnabled ? "\u5173\u95ED" : "\u5F00\u542F",
                "\u81EA\u52A8\u5237\u65B0"
              ]
            }
          )
        ] })
      ] });
    };
    const renderSessionList = () => {
      const otherSessions = sessions.filter((session) => !session.isCurrent);
      if (otherSessions.length === 0) {
        return /* @__PURE__ */ jsxs23(Card, { className: "p-6 text-center", children: [
          /* @__PURE__ */ jsx29(Shield4, { className: "h-12 w-12 text-text-secondary mx-auto mb-4" }),
          /* @__PURE__ */ jsx29(Text, { variant: "caption", className: "text-text-secondary", children: "\u6CA1\u6709\u5176\u4ED6\u6D3B\u8DC3\u4F1A\u8BDD" })
        ] });
      }
      return /* @__PURE__ */ jsxs23(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsxs23("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxs23(Heading, { level: "h3", className: "text-lg font-semibold", children: [
            "\u5176\u4ED6\u4F1A\u8BDD (",
            otherSessions.length,
            ")"
          ] }),
          otherSessions.length > 1 && /* @__PURE__ */ jsx29(
            Button,
            {
              variant: "tertiary",
              size: "sm",
              onClick: onTerminateAllSessions,
              disabled: loading,
              children: "\u7EC8\u6B62\u6240\u6709\u4F1A\u8BDD"
            }
          )
        ] }),
        /* @__PURE__ */ jsx29("div", { className: "space-y-3", children: otherSessions.map((session) => {
          const DeviceIcon = deviceIcons[session.deviceType];
          return /* @__PURE__ */ jsxs23(
            "div",
            {
              className: "flex items-center justify-between p-3 rounded-lg border border-border-primary hover:bg-background-secondary",
              children: [
                /* @__PURE__ */ jsxs23("div", { className: "flex items-center space-x-3", children: [
                  /* @__PURE__ */ jsx29(DeviceIcon, { className: "h-5 w-5 text-text-secondary" }),
                  /* @__PURE__ */ jsxs23("div", { children: [
                    /* @__PURE__ */ jsx29(Text, { variant: "label", className: "font-medium", children: session.deviceName || "\u672A\u77E5\u8BBE\u5907" }),
                    /* @__PURE__ */ jsxs23("div", { className: "flex items-center space-x-2 mt-1", children: [
                      /* @__PURE__ */ jsxs23(Text, { variant: "caption", className: "text-text-secondary", children: [
                        session.browser,
                        " \u2022 ",
                        session.os
                      ] }),
                      session.location && /* @__PURE__ */ jsxs23(Fragment6, { children: [
                        /* @__PURE__ */ jsx29("span", { className: "text-text-tertiary", children: "\u2022" }),
                        /* @__PURE__ */ jsx29(Text, { variant: "caption", className: "text-text-secondary", children: session.location })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs23(Text, { variant: "caption", className: "text-text-tertiary mt-1", children: [
                      "\u6700\u540E\u6D3B\u8DC3: ",
                      formatLastActivity(session.lastActivity)
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs23("div", { className: "flex items-center space-x-2", children: [
                  !session.isSecure && /* @__PURE__ */ jsx29(Badge, { variant: "warning", size: "sm", children: "\u4E0D\u5B89\u5168" }),
                  /* @__PURE__ */ jsx29(
                    IconButton,
                    {
                      variant: "ghost",
                      size: "sm",
                      onClick: () => onTerminateSession?.(session.id),
                      disabled: loading,
                      "aria-label": "\u7EC8\u6B62\u4F1A\u8BDD",
                      children: /* @__PURE__ */ jsx29(Trash2, { className: "h-4 w-4" })
                    }
                  )
                ] })
              ]
            },
            session.id
          );
        }) })
      ] });
    };
    const renderActivitySummary = () => {
      if (!showActivity) return null;
      const totalSessions = sessions.length;
      const secureSessions = sessions.filter((s) => s.isSecure).length;
      const recentActivity = sessions.filter((s) => {
        const diff = (/* @__PURE__ */ new Date()).getTime() - s.lastActivity.getTime();
        return diff < 60 * 60 * 1e3;
      }).length;
      return /* @__PURE__ */ jsxs23(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsx29(Heading, { level: "h3", className: "text-lg font-semibold mb-4", children: "\u6D3B\u52A8\u6982\u89C8" }),
        /* @__PURE__ */ jsxs23("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxs23("div", { className: "text-center space-y-2", children: [
            /* @__PURE__ */ jsx29(Text, { variant: "label", className: "text-2xl font-bold text-primary-primary", children: totalSessions }),
            /* @__PURE__ */ jsx29(Text, { variant: "caption", className: "text-text-secondary", children: "\u6D3B\u8DC3\u4F1A\u8BDD" })
          ] }),
          /* @__PURE__ */ jsxs23("div", { className: "text-center space-y-2", children: [
            /* @__PURE__ */ jsx29(Text, { variant: "label", className: "text-2xl font-bold text-status-success", children: secureSessions }),
            /* @__PURE__ */ jsx29(Text, { variant: "caption", className: "text-text-secondary", children: "\u5B89\u5168\u8FDE\u63A5" })
          ] }),
          /* @__PURE__ */ jsxs23("div", { className: "text-center space-y-2", children: [
            /* @__PURE__ */ jsx29(Text, { variant: "label", className: "text-2xl font-bold text-status-info", children: recentActivity }),
            /* @__PURE__ */ jsx29(Text, { variant: "caption", className: "text-text-secondary", children: "\u8FD1\u671F\u6D3B\u8DC3" })
          ] })
        ] })
      ] });
    };
    if (loading) {
      return /* @__PURE__ */ jsx29("div", { className: "flex items-center justify-center p-8", children: /* @__PURE__ */ jsxs23("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsx29("div", { className: "animate-spin rounded-full h-6 w-6 border-b-2 border-primary-primary" }),
        /* @__PURE__ */ jsx29(Text, { variant: "caption", children: "\u52A0\u8F7D\u4F1A\u8BDD\u4FE1\u606F..." })
      ] }) });
    }
    return /* @__PURE__ */ jsxs23(
      "div",
      {
        ref,
        className: cn(sessionManagerVariants({ layout }), className),
        ...props,
        children: [
          layout === "full" && renderActivitySummary(),
          renderCurrentSession(),
          layout !== "minimal" && /* @__PURE__ */ jsxs23(Fragment6, { children: [
            /* @__PURE__ */ jsx29(Divider, {}),
            renderSessionList()
          ] })
        ]
      }
    );
  }
);
SessionManager.displayName = "SessionManager";

// src/components/auth/SecurityIndicator.tsx
import * as React31 from "react";
import {
  Shield as Shield5,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  CheckCircle as CheckCircle3,
  AlertTriangle as AlertTriangle4,
  AlertCircle as AlertCircle3,
  TrendingUp,
  Eye as Eye3,
  EyeOff as EyeOff2
} from "lucide-react";
import { cva as cva29 } from "class-variance-authority";
import { Fragment as Fragment7, jsx as jsx30, jsxs as jsxs24 } from "react/jsx-runtime";
var securityIndicatorVariants = cva29(
  "w-full",
  {
    variants: {
      variant: {
        full: "space-y-6",
        compact: "space-y-4",
        minimal: "space-y-2",
        badge: ""
      },
      level: {
        excellent: "border-status-success",
        good: "border-primary-primary",
        fair: "border-status-warning",
        poor: "border-status-error"
      }
    },
    defaultVariants: {
      variant: "full",
      level: "good"
    }
  }
);
var statusIcons = {
  passed: CheckCircle3,
  warning: AlertTriangle4,
  failed: AlertCircle3,
  unknown: Shield5
};
var statusColors = {
  passed: "text-status-success",
  warning: "text-status-warning",
  failed: "text-status-error",
  unknown: "text-text-secondary"
};
var levelConfig = {
  excellent: {
    icon: ShieldCheck,
    color: "text-status-success",
    bgColor: "bg-status-success/10",
    borderColor: "border-status-success/20",
    label: "\u4F18\u79C0",
    description: "\u60A8\u7684\u8D26\u6237\u5B89\u5168\u7EA7\u522B\u5F88\u9AD8"
  },
  good: {
    icon: Shield5,
    color: "text-primary-primary",
    bgColor: "bg-primary-primary/10",
    borderColor: "border-primary-primary/20",
    label: "\u826F\u597D",
    description: "\u60A8\u7684\u8D26\u6237\u5177\u6709\u57FA\u672C\u7684\u5B89\u5168\u4FDD\u62A4"
  },
  fair: {
    icon: ShieldAlert,
    color: "text-status-warning",
    bgColor: "bg-status-warning/10",
    borderColor: "border-status-warning/20",
    label: "\u4E00\u822C",
    description: "\u5EFA\u8BAE\u52A0\u5F3A\u8D26\u6237\u5B89\u5168\u8BBE\u7F6E"
  },
  poor: {
    icon: ShieldX,
    color: "text-status-error",
    bgColor: "bg-status-error/10",
    borderColor: "border-status-error/20",
    label: "\u8F83\u5DEE",
    description: "\u60A8\u7684\u8D26\u6237\u5B58\u5728\u5B89\u5168\u98CE\u9669"
  }
};
var SecurityIndicator = React31.forwardRef(
  ({
    className,
    variant,
    level,
    metrics,
    showDetails = true,
    showRecommendations = true,
    interactive = true,
    loading = false,
    onCheckClick,
    onRecommendationClick,
    onRefresh,
    ...props
  }, ref) => {
    const [expandedChecks, setExpandedChecks] = React31.useState(/* @__PURE__ */ new Set());
    const currentLevel = level || metrics.overall;
    const config = levelConfig[currentLevel];
    const LevelIcon = config.icon;
    const toggleCheckExpansion = (checkId) => {
      const newExpanded = new Set(expandedChecks);
      if (newExpanded.has(checkId)) {
        newExpanded.delete(checkId);
      } else {
        newExpanded.add(checkId);
      }
      setExpandedChecks(newExpanded);
    };
    const getCheckIcon = (check) => {
      const StatusIcon = statusIcons[check.status];
      return /* @__PURE__ */ jsx30(StatusIcon, { className: cn("h-4 w-4", statusColors[check.status]) });
    };
    const getScoreColor = (score) => {
      if (score >= 90) return "text-status-success";
      if (score >= 70) return "text-primary-primary";
      if (score >= 50) return "text-status-warning";
      return "text-status-error";
    };
    const getProgressVariant = (score) => {
      if (score >= 90) return "success";
      if (score >= 70) return "default";
      if (score >= 50) return "warning";
      return "error";
    };
    const renderBadgeVariant = () => /* @__PURE__ */ jsx30(Tooltip, { content: `\u5B89\u5168\u8BC4\u5206: ${metrics.score}/100`, children: /* @__PURE__ */ jsxs24(
      Badge,
      {
        variant: currentLevel === "excellent" ? "success" : currentLevel === "good" ? "default" : currentLevel === "fair" ? "warning" : "error",
        className: "flex items-center space-x-1",
        children: [
          /* @__PURE__ */ jsx30(LevelIcon, { className: "h-3 w-3" }),
          /* @__PURE__ */ jsx30("span", { children: config.label })
        ]
      }
    ) });
    const renderMinimalVariant = () => /* @__PURE__ */ jsxs24("div", { className: "flex items-center space-x-3", children: [
      /* @__PURE__ */ jsx30("div", { className: cn("flex items-center justify-center w-8 h-8 rounded-full", config.bgColor), children: /* @__PURE__ */ jsx30(LevelIcon, { className: cn("h-4 w-4", config.color) }) }),
      /* @__PURE__ */ jsxs24("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxs24("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsxs24(Text, { variant: "label", className: "font-medium", children: [
            "\u5B89\u5168\u72B6\u6001: ",
            config.label
          ] }),
          /* @__PURE__ */ jsxs24(Text, { variant: "caption", className: getScoreColor(metrics.score), children: [
            metrics.score,
            "/100"
          ] })
        ] }),
        /* @__PURE__ */ jsx30(
          Progress,
          {
            value: metrics.score,
            variant: getProgressVariant(metrics.score),
            size: "sm",
            className: "mt-1"
          }
        )
      ] }),
      interactive && onRefresh && /* @__PURE__ */ jsx30(Button, { variant: "ghost", size: "sm", onClick: onRefresh, disabled: loading, children: /* @__PURE__ */ jsx30(TrendingUp, { className: "h-4 w-4" }) })
    ] });
    const renderCompactVariant = () => /* @__PURE__ */ jsxs24(Card, { className: cn("p-4", config.borderColor), children: [
      /* @__PURE__ */ jsxs24("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxs24("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ jsx30("div", { className: cn("flex items-center justify-center w-10 h-10 rounded-full", config.bgColor), children: /* @__PURE__ */ jsx30(LevelIcon, { className: cn("h-5 w-5", config.color) }) }),
          /* @__PURE__ */ jsxs24("div", { children: [
            /* @__PURE__ */ jsxs24(Text, { variant: "label", className: "font-semibold", children: [
              "\u5B89\u5168\u8BC4\u5206: ",
              metrics.score,
              "/100"
            ] }),
            /* @__PURE__ */ jsx30(Text, { variant: "caption", className: "text-text-secondary", children: config.description })
          ] })
        ] }),
        interactive && onRefresh && /* @__PURE__ */ jsx30(Button, { variant: "ghost", size: "sm", onClick: onRefresh, disabled: loading, children: /* @__PURE__ */ jsx30(TrendingUp, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsx30(
        Progress,
        {
          value: metrics.score,
          variant: getProgressVariant(metrics.score),
          size: "md",
          showValue: false
        }
      ),
      showDetails && /* @__PURE__ */ jsx30("div", { className: "mt-3 grid grid-cols-2 gap-2", children: metrics.checks.slice(0, 4).map((check) => /* @__PURE__ */ jsxs24("div", { className: "flex items-center space-x-2", children: [
        getCheckIcon(check),
        /* @__PURE__ */ jsx30(Text, { variant: "caption", className: "truncate", children: check.name })
      ] }, check.id)) })
    ] });
    const renderFullVariant = () => /* @__PURE__ */ jsxs24(Fragment7, { children: [
      /* @__PURE__ */ jsxs24(Card, { className: cn("p-6", config.borderColor), children: [
        /* @__PURE__ */ jsxs24("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxs24("div", { className: "flex items-center space-x-4", children: [
            /* @__PURE__ */ jsx30("div", { className: cn("flex items-center justify-center w-12 h-12 rounded-full", config.bgColor), children: /* @__PURE__ */ jsx30(LevelIcon, { className: cn("h-6 w-6", config.color) }) }),
            /* @__PURE__ */ jsxs24("div", { children: [
              /* @__PURE__ */ jsxs24(Heading, { level: "h2", className: "text-xl font-semibold", children: [
                "\u5B89\u5168\u72B6\u6001: ",
                config.label
              ] }),
              /* @__PURE__ */ jsx30(Text, { variant: "caption", className: "text-text-secondary", children: config.description })
            ] })
          ] }),
          interactive && onRefresh && /* @__PURE__ */ jsxs24(Button, { variant: "secondary", onClick: onRefresh, disabled: loading, children: [
            /* @__PURE__ */ jsx30(TrendingUp, { className: "h-4 w-4 mr-2" }),
            "\u5237\u65B0\u72B6\u6001"
          ] })
        ] }),
        /* @__PURE__ */ jsxs24("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs24("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx30(Text, { variant: "label", className: "font-medium", children: "\u603B\u4F53\u8BC4\u5206" }),
            /* @__PURE__ */ jsxs24(Text, { variant: "label", className: cn("text-lg font-bold", getScoreColor(metrics.score)), children: [
              metrics.score,
              "/100"
            ] })
          ] }),
          /* @__PURE__ */ jsx30(
            Progress,
            {
              value: metrics.score,
              variant: getProgressVariant(metrics.score),
              size: "lg",
              showValue: false
            }
          ),
          /* @__PURE__ */ jsxs24(Text, { variant: "caption", className: "text-text-secondary", children: [
            "\u6700\u540E\u66F4\u65B0: ",
            metrics.lastUpdated.toLocaleString("zh-CN")
          ] })
        ] })
      ] }),
      showDetails && /* @__PURE__ */ jsxs24(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsxs24(Heading, { level: "h3", className: "text-lg font-semibold mb-4", children: [
          "\u5B89\u5168\u68C0\u67E5\u9879 (",
          metrics.checks.length,
          ")"
        ] }),
        /* @__PURE__ */ jsx30("div", { className: "space-y-3", children: metrics.checks.map((check) => /* @__PURE__ */ jsxs24(
          "div",
          {
            className: cn(
              "p-3 rounded-lg border transition-colors",
              check.status === "passed" && "border-status-success/20 bg-status-success/5",
              check.status === "warning" && "border-status-warning/20 bg-status-warning/5",
              check.status === "failed" && "border-status-error/20 bg-status-error/5",
              check.status === "unknown" && "border-border-primary bg-background-secondary",
              interactive && "cursor-pointer hover:bg-opacity-80"
            ),
            onClick: () => {
              if (interactive) {
                toggleCheckExpansion(check.id);
                onCheckClick?.(check);
              }
            },
            children: [
              /* @__PURE__ */ jsxs24("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs24("div", { className: "flex items-center space-x-3", children: [
                  getCheckIcon(check),
                  /* @__PURE__ */ jsxs24("div", { children: [
                    /* @__PURE__ */ jsx30(Text, { variant: "label", className: "font-medium", children: check.name }),
                    check.required && /* @__PURE__ */ jsx30(Badge, { variant: "error", size: "sm", className: "ml-2", children: "\u5FC5\u9700" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs24("div", { className: "flex items-center space-x-2", children: [
                  /* @__PURE__ */ jsxs24(
                    Badge,
                    {
                      variant: check.severity === "critical" ? "error" : check.severity === "high" ? "warning" : check.severity === "medium" ? "default" : "default",
                      size: "sm",
                      children: [
                        check.severity === "critical" && "\u4E25\u91CD",
                        check.severity === "high" && "\u9AD8",
                        check.severity === "medium" && "\u4E2D",
                        check.severity === "low" && "\u4F4E"
                      ]
                    }
                  ),
                  interactive && /* @__PURE__ */ jsx30(Button, { variant: "ghost", size: "sm", children: expandedChecks.has(check.id) ? /* @__PURE__ */ jsx30(EyeOff2, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx30(Eye3, { className: "h-4 w-4" }) })
                ] })
              ] }),
              expandedChecks.has(check.id) && /* @__PURE__ */ jsxs24("div", { className: "mt-3 pt-3 border-t border-border-primary", children: [
                /* @__PURE__ */ jsx30(Text, { variant: "caption", className: "text-text-secondary mb-2", children: check.description }),
                check.actionRequired && /* @__PURE__ */ jsxs24("div", { className: "flex items-start space-x-2", children: [
                  /* @__PURE__ */ jsx30(AlertTriangle4, { className: "h-4 w-4 text-status-warning mt-0.5" }),
                  /* @__PURE__ */ jsxs24(Text, { variant: "caption", className: "text-status-warning", children: [
                    /* @__PURE__ */ jsx30("strong", { children: "\u9700\u8981\u64CD\u4F5C:" }),
                    " ",
                    check.actionRequired
                  ] })
                ] }),
                check.lastChecked && /* @__PURE__ */ jsxs24(Text, { variant: "caption", className: "text-text-tertiary mt-2", children: [
                  "\u6700\u540E\u68C0\u67E5: ",
                  check.lastChecked.toLocaleString("zh-CN")
                ] })
              ] })
            ]
          },
          check.id
        )) })
      ] }),
      showRecommendations && metrics.recommendations.length > 0 && /* @__PURE__ */ jsxs24(Card, { className: "p-6", children: [
        /* @__PURE__ */ jsx30(Heading, { level: "h3", className: "text-lg font-semibold mb-4", children: "\u5B89\u5168\u5EFA\u8BAE" }),
        /* @__PURE__ */ jsx30("div", { className: "space-y-3", children: metrics.recommendations.map((recommendation, index) => /* @__PURE__ */ jsxs24(
          "div",
          {
            className: cn(
              "flex items-start space-x-3 p-3 rounded-lg bg-primary-primary/5 border border-primary-primary/20",
              interactive && "cursor-pointer hover:bg-primary-primary/10"
            ),
            onClick: () => {
              if (interactive) {
                onRecommendationClick?.(recommendation);
              }
            },
            children: [
              /* @__PURE__ */ jsx30(TrendingUp, { className: "h-4 w-4 text-primary-primary mt-0.5" }),
              /* @__PURE__ */ jsx30(Text, { variant: "caption", className: "flex-1", children: recommendation })
            ]
          },
          index
        )) })
      ] })
    ] });
    if (loading) {
      return /* @__PURE__ */ jsx30("div", { className: "flex items-center justify-center p-8", children: /* @__PURE__ */ jsxs24("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsx30("div", { className: "animate-spin rounded-full h-6 w-6 border-b-2 border-primary-primary" }),
        /* @__PURE__ */ jsx30(Text, { variant: "caption", children: "\u68C0\u67E5\u5B89\u5168\u72B6\u6001..." })
      ] }) });
    }
    if (variant === "badge") {
      return renderBadgeVariant();
    }
    return /* @__PURE__ */ jsxs24(
      "div",
      {
        ref,
        className: cn(securityIndicatorVariants({ variant, level: currentLevel }), className),
        ...props,
        children: [
          variant === "minimal" && renderMinimalVariant(),
          variant === "compact" && renderCompactVariant(),
          variant === "full" && renderFullVariant()
        ]
      }
    );
  }
);
SecurityIndicator.displayName = "SecurityIndicator";
function calculateSecurityScore(checks) {
  if (checks.length === 0) return 0;
  const weights = {
    critical: 30,
    high: 20,
    medium: 10,
    low: 5
  };
  const totalWeight = checks.reduce((sum, check) => sum + weights[check.severity], 0);
  const passedWeight = checks.filter((check) => check.status === "passed").reduce((sum, check) => sum + weights[check.severity], 0);
  return Math.round(passedWeight / totalWeight * 100);
}
function determineSecurityLevel(score) {
  if (score >= 90) return "excellent";
  if (score >= 70) return "good";
  if (score >= 50) return "fair";
  return "poor";
}

// src/components/charts/Chart.tsx
import * as React32 from "react";
import { cva as cva30 } from "class-variance-authority";
import { Download, Maximize, RefreshCw as RefreshCw2 } from "lucide-react";
import { jsx as jsx31, jsxs as jsxs25 } from "react/jsx-runtime";
var chartVariants = cva30(
  "w-full relative",
  {
    variants: {
      variant: {
        default: "",
        minimal: "border-none shadow-none",
        elevated: "shadow-lg"
      },
      size: {
        sm: "h-48",
        md: "h-64",
        lg: "h-80",
        xl: "h-96",
        auto: "h-auto"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);
var defaultColors = [
  "#0052FF",
  // ADDX Blue
  "#00D4AA",
  // Green Finance
  "#8B5CF6",
  // Purple
  "#F59E0B",
  // Amber
  "#EF4444",
  // Red
  "#10B981",
  // Emerald
  "#F97316",
  // Orange
  "#8B5CF6",
  // Violet
  "#06B6D4",
  // Cyan
  "#84CC16"
  // Lime
];
var Chart = React32.forwardRef(
  ({
    className,
    variant,
    size,
    type,
    data,
    config = {},
    title,
    subtitle,
    showControls = true,
    loading = false,
    error,
    emptyMessage = "\u6682\u65E0\u6570\u636E",
    onDataPointClick,
    onExport,
    onConfigChange,
    onRefresh,
    ...props
  }, ref) => {
    const [isFullscreen, setIsFullscreen] = React32.useState(false);
    const chartRef = React32.useRef(null);
    const canvasRef = React32.useRef(null);
    const chartConfig = {
      responsive: true,
      animated: true,
      showGrid: true,
      showLegend: true,
      showTooltip: true,
      showAxisLabels: true,
      colors: defaultColors,
      height: 300,
      ...config
    };
    const getChartDimensions = () => {
      if (!chartRef.current) return { width: 400, height: 300 };
      const container = chartRef.current;
      const rect = container.getBoundingClientRect();
      return {
        width: chartConfig.width || rect.width - 32,
        // Account for padding
        height: chartConfig.height || 300
      };
    };
    const renderChart = () => {
      if (loading) {
        return /* @__PURE__ */ jsx31("div", { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ jsxs25("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ jsx31("div", { className: "animate-spin rounded-full h-6 w-6 border-b-2 border-primary-primary" }),
          /* @__PURE__ */ jsx31(Text, { variant: "caption", children: "\u52A0\u8F7D\u56FE\u8868\u6570\u636E..." })
        ] }) });
      }
      if (error) {
        return /* @__PURE__ */ jsxs25("div", { className: "flex flex-col items-center justify-center h-full space-y-2", children: [
          /* @__PURE__ */ jsx31(Text, { variant: "error", children: "\u52A0\u8F7D\u5931\u8D25" }),
          /* @__PURE__ */ jsx31(Text, { variant: "caption", className: "text-text-secondary", children: error }),
          onRefresh && /* @__PURE__ */ jsxs25(Button, { variant: "ghost", size: "sm", onClick: onRefresh, children: [
            /* @__PURE__ */ jsx31(RefreshCw2, { className: "h-4 w-4 mr-2" }),
            "\u91CD\u8BD5"
          ] })
        ] });
      }
      if (!data || data.length === 0) {
        return /* @__PURE__ */ jsx31("div", { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ jsx31(Text, { variant: "caption", className: "text-text-secondary", children: emptyMessage }) });
      }
      const { width, height } = getChartDimensions();
      switch (type) {
        case "line":
          return renderLineChart(width, height);
        case "bar":
          return renderBarChart(width, height);
        case "pie":
          return renderPieChart(width, height);
        case "area":
          return renderAreaChart(width, height);
        case "heatmap":
          return renderHeatmap(width, height);
        default:
          return renderLineChart(width, height);
      }
    };
    const renderLineChart = (width, height) => {
      const padding = 40;
      const chartWidth = width - padding * 2;
      const chartHeight = height - padding * 2;
      const allValues = data.flatMap((series) => series.data.map((d) => d.value));
      const maxValue = Math.max(...allValues);
      const minValue = Math.min(...allValues, 0);
      const getX = (index, totalPoints) => padding + index * chartWidth / (totalPoints - 1);
      const getY = (value) => padding + chartHeight - (value - minValue) / (maxValue - minValue) * chartHeight;
      return /* @__PURE__ */ jsxs25("svg", { width, height, className: "overflow-visible", children: [
        chartConfig.showGrid && /* @__PURE__ */ jsxs25("g", { className: "opacity-20", children: [
          [0, 0.25, 0.5, 0.75, 1].map((ratio, i) => /* @__PURE__ */ jsx31(
            "line",
            {
              x1: padding,
              y1: padding + chartHeight * ratio,
              x2: width - padding,
              y2: padding + chartHeight * ratio,
              stroke: "currentColor",
              strokeWidth: "1"
            },
            `h-grid-${i}`
          )),
          data[0]?.data.map((_, i) => /* @__PURE__ */ jsx31(
            "line",
            {
              x1: getX(i, data[0].data.length),
              y1: padding,
              x2: getX(i, data[0].data.length),
              y2: height - padding,
              stroke: "currentColor",
              strokeWidth: "1"
            },
            `v-grid-${i}`
          ))
        ] }),
        data.map((series, seriesIndex) => {
          const color = series.color || chartConfig.colors[seriesIndex % chartConfig.colors.length];
          const pathData = series.data.map((point, index) => {
            const x = getX(index, series.data.length);
            const y = getY(point.value);
            return `${index === 0 ? "M" : "L"} ${x} ${y}`;
          }).join(" ");
          return /* @__PURE__ */ jsxs25("g", { children: [
            /* @__PURE__ */ jsx31(
              "path",
              {
                d: pathData,
                fill: "none",
                stroke: color,
                strokeWidth: "2",
                className: chartConfig.animated ? "animate-in slide-in-from-left duration-1000" : ""
              }
            ),
            series.data.map((point, index) => /* @__PURE__ */ jsx31(
              "circle",
              {
                cx: getX(index, series.data.length),
                cy: getY(point.value),
                r: "4",
                fill: color,
                className: "cursor-pointer hover:r-6 transition-all",
                onClick: () => onDataPointClick?.(point, series)
              },
              `${series.name}-${index}`
            ))
          ] }, series.name);
        }),
        chartConfig.showAxisLabels && /* @__PURE__ */ jsxs25("g", { className: "text-xs fill-current text-text-secondary", children: [
          data[0]?.data.map((point, index) => /* @__PURE__ */ jsx31(
            "text",
            {
              x: getX(index, data[0].data.length),
              y: height - 10,
              textAnchor: "middle",
              children: point.label
            },
            `x-label-${index}`
          )),
          [0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const value = minValue + (maxValue - minValue) * (1 - ratio);
            return /* @__PURE__ */ jsx31(
              "text",
              {
                x: padding - 10,
                y: padding + chartHeight * ratio + 4,
                textAnchor: "end",
                children: value.toFixed(0)
              },
              `y-label-${i}`
            );
          })
        ] })
      ] });
    };
    const renderBarChart = (width, height) => {
      const padding = 40;
      const chartWidth = width - padding * 2;
      const chartHeight = height - padding * 2;
      const allValues = data.flatMap((series) => series.data.map((d) => d.value));
      const maxValue = Math.max(...allValues);
      const barWidth = chartWidth / (data[0]?.data.length || 1) * 0.8;
      const barSpacing = chartWidth / (data[0]?.data.length || 1) * 0.2;
      return /* @__PURE__ */ jsxs25("svg", { width, height, children: [
        chartConfig.showGrid && /* @__PURE__ */ jsx31("g", { className: "opacity-20", children: [0, 0.25, 0.5, 0.75, 1].map((ratio, i) => /* @__PURE__ */ jsx31(
          "line",
          {
            x1: padding,
            y1: padding + chartHeight * ratio,
            x2: width - padding,
            y2: padding + chartHeight * ratio,
            stroke: "currentColor",
            strokeWidth: "1"
          },
          `grid-${i}`
        )) }),
        data[0]?.data.map((point, index) => {
          const x = padding + index * (barWidth + barSpacing);
          const barHeight = point.value / maxValue * chartHeight;
          const y = height - padding - barHeight;
          const color = point.color || chartConfig.colors[index % chartConfig.colors.length];
          return /* @__PURE__ */ jsxs25("g", { children: [
            /* @__PURE__ */ jsx31(
              "rect",
              {
                x,
                y,
                width: barWidth,
                height: barHeight,
                fill: color,
                className: cn(
                  "cursor-pointer hover:opacity-80 transition-opacity",
                  chartConfig.animated && "animate-in slide-in-from-bottom duration-700"
                ),
                onClick: () => onDataPointClick?.(point, data[0])
              }
            ),
            /* @__PURE__ */ jsx31(
              "text",
              {
                x: x + barWidth / 2,
                y: height - 10,
                textAnchor: "middle",
                className: "text-xs fill-current text-text-secondary",
                children: point.label
              }
            )
          ] }, `bar-${index}`);
        })
      ] });
    };
    const renderPieChart = (width, height) => {
      const radius = Math.min(width, height) / 2 - 40;
      const centerX = width / 2;
      const centerY = height / 2;
      const total = data[0]?.data.reduce((sum, point) => sum + point.value, 0) || 1;
      let currentAngle = -Math.PI / 2;
      return /* @__PURE__ */ jsx31("svg", { width, height, children: data[0]?.data.map((point, index) => {
        const angle = point.value / total * 2 * Math.PI;
        const endAngle = currentAngle + angle;
        const x1 = centerX + Math.cos(currentAngle) * radius;
        const y1 = centerY + Math.sin(currentAngle) * radius;
        const x2 = centerX + Math.cos(endAngle) * radius;
        const y2 = centerY + Math.sin(endAngle) * radius;
        const largeArcFlag = angle > Math.PI ? 1 : 0;
        const color = point.color || chartConfig.colors[index % chartConfig.colors.length];
        const pathData = [
          `M ${centerX} ${centerY}`,
          `L ${x1} ${y1}`,
          `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
          "Z"
        ].join(" ");
        currentAngle = endAngle;
        return /* @__PURE__ */ jsx31(
          "path",
          {
            d: pathData,
            fill: color,
            className: cn(
              "cursor-pointer hover:opacity-80 transition-opacity",
              chartConfig.animated && "animate-in zoom-in duration-700"
            ),
            onClick: () => onDataPointClick?.(point, data[0])
          },
          `pie-${index}`
        );
      }) });
    };
    const renderAreaChart = (width, height) => {
      const padding = 40;
      const chartWidth = width - padding * 2;
      const chartHeight = height - padding * 2;
      const allValues = data.flatMap((series) => series.data.map((d) => d.value));
      const maxValue = Math.max(...allValues);
      const minValue = Math.min(...allValues, 0);
      const getX = (index, totalPoints) => padding + index * chartWidth / (totalPoints - 1);
      const getY = (value) => padding + chartHeight - (value - minValue) / (maxValue - minValue) * chartHeight;
      return /* @__PURE__ */ jsx31("svg", { width, height, children: data.map((series, seriesIndex) => {
        const color = series.color || chartConfig.colors[seriesIndex % chartConfig.colors.length];
        const areaPath = [
          `M ${getX(0, series.data.length)} ${height - padding}`,
          ...series.data.map(
            (point, index) => `L ${getX(index, series.data.length)} ${getY(point.value)}`
          ),
          `L ${getX(series.data.length - 1, series.data.length)} ${height - padding}`,
          "Z"
        ].join(" ");
        return /* @__PURE__ */ jsx31(
          "path",
          {
            d: areaPath,
            fill: color,
            fillOpacity: "0.3",
            className: chartConfig.animated ? "animate-in slide-in-from-bottom duration-1000" : ""
          },
          `area-${seriesIndex}`
        );
      }) });
    };
    const renderHeatmap = (width, height) => {
      const padding = 40;
      const cellSize = 20;
      const cols = Math.floor((width - padding * 2) / cellSize);
      const rows = Math.floor((height - padding * 2) / cellSize);
      const allValues = data.flatMap((series) => series.data.map((d) => d.value));
      const maxValue = Math.max(...allValues);
      const minValue = Math.min(...allValues);
      return /* @__PURE__ */ jsx31("svg", { width, height, children: data[0]?.data.slice(0, cols * rows).map((point, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        const x = padding + col * cellSize;
        const y = padding + row * cellSize;
        const intensity = (point.value - minValue) / (maxValue - minValue);
        const opacity = 0.2 + intensity * 0.8;
        return /* @__PURE__ */ jsx31(
          "rect",
          {
            x,
            y,
            width: cellSize - 1,
            height: cellSize - 1,
            fill: "#0052FF",
            fillOpacity: opacity,
            className: "cursor-pointer hover:stroke-2 hover:stroke-primary-primary",
            onClick: () => onDataPointClick?.(point, data[0])
          },
          `heatmap-${index}`
        );
      }) });
    };
    const handleExport = (format) => {
      onExport?.(format);
    };
    const exportOptions = [
      { value: "png", label: "\u5BFC\u51FA\u4E3A PNG" },
      { value: "svg", label: "\u5BFC\u51FA\u4E3A SVG" },
      { value: "pdf", label: "\u5BFC\u51FA\u4E3A PDF" }
    ];
    return /* @__PURE__ */ jsxs25(
      Card,
      {
        ref,
        className: cn(chartVariants({ variant, size }), className),
        ...props,
        children: [
          (title || subtitle || showControls) && /* @__PURE__ */ jsxs25("div", { className: "flex items-start justify-between p-4 pb-2", children: [
            /* @__PURE__ */ jsxs25("div", { children: [
              title && /* @__PURE__ */ jsx31(Heading, { level: "h3", className: "text-lg font-semibold", children: title }),
              subtitle && /* @__PURE__ */ jsx31(Text, { variant: "caption", className: "text-text-secondary mt-1", children: subtitle })
            ] }),
            showControls && /* @__PURE__ */ jsxs25("div", { className: "flex items-center space-x-2", children: [
              onRefresh && /* @__PURE__ */ jsx31(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: onRefresh,
                  disabled: loading,
                  children: /* @__PURE__ */ jsx31(RefreshCw2, { className: "h-4 w-4" })
                }
              ),
              onExport && /* @__PURE__ */ jsx31(
                Dropdown,
                {
                  trigger: /* @__PURE__ */ jsx31(Button, { variant: "ghost", size: "sm", children: /* @__PURE__ */ jsx31(Download, { className: "h-4 w-4" }) }),
                  items: exportOptions.map((option) => ({
                    key: option.value,
                    type: "item",
                    label: option.label,
                    onClick: () => handleExport(option.value)
                  }))
                }
              ),
              /* @__PURE__ */ jsx31(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: () => setIsFullscreen(!isFullscreen),
                  children: /* @__PURE__ */ jsx31(Maximize, { className: "h-4 w-4" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx31(
            "div",
            {
              ref: chartRef,
              className: cn(
                "flex-1 p-4",
                isFullscreen && "fixed inset-0 z-50 bg-background-primary"
              ),
              children: renderChart()
            }
          ),
          chartConfig.showLegend && data.length > 1 && /* @__PURE__ */ jsx31("div", { className: "flex flex-wrap gap-4 p-4 pt-2 border-t border-border-primary", children: data.map((series, index) => {
            const color = series.color || chartConfig.colors[index % chartConfig.colors.length];
            return /* @__PURE__ */ jsxs25("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx31(
                "div",
                {
                  className: "w-3 h-3 rounded-full",
                  style: { backgroundColor: color }
                }
              ),
              /* @__PURE__ */ jsx31(Text, { variant: "caption", className: "text-text-secondary", children: series.name })
            ] }, series.name);
          }) })
        ]
      }
    );
  }
);
Chart.displayName = "Chart";

// src/components/charts/Dashboard.tsx
import * as React33 from "react";
import { Grid, Plus, Settings as Settings2, Trash2 as Trash22, Move } from "lucide-react";
import { cva as cva31 } from "class-variance-authority";
import { jsx as jsx32, jsxs as jsxs26 } from "react/jsx-runtime";
var dashboardVariants = cva31(
  "w-full h-full relative",
  {
    variants: {
      layout: {
        grid: "grid gap-4",
        flexible: "relative",
        masonry: "columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4"
      },
      editable: {
        true: "select-none",
        false: ""
      }
    },
    defaultVariants: {
      layout: "grid",
      editable: false
    }
  }
);
var widgetVariants = cva31(
  "relative group transition-all duration-200",
  {
    variants: {
      editable: {
        true: "cursor-move hover:shadow-lg hover:scale-105",
        false: ""
      },
      selected: {
        true: "ring-2 ring-primary-primary ring-offset-2",
        false: ""
      },
      dragging: {
        true: "opacity-50 rotate-2 scale-110 z-50",
        false: ""
      }
    },
    defaultVariants: {
      editable: false,
      selected: false,
      dragging: false
    }
  }
);
var Dashboard = React33.forwardRef(
  ({
    className,
    layout: layoutProp,
    editable = false,
    showControls = true,
    loading = false,
    availableWidgets = [],
    onLayoutChange,
    onWidgetAdd,
    onWidgetRemove,
    onWidgetUpdate,
    onSave,
    renderWidget,
    ...props
  }, ref) => {
    const [layout, setLayout] = React33.useState(layoutProp);
    const [selectedWidget, setSelectedWidget] = React33.useState(null);
    const [draggedWidget, setDraggedWidget] = React33.useState(null);
    const [dragOffset, setDragOffset] = React33.useState({ x: 0, y: 0 });
    React33.useEffect(() => {
      setLayout(layoutProp);
    }, [layoutProp]);
    React33.useEffect(() => {
      if (layout.autoSave && onLayoutChange) {
        const timeoutId = setTimeout(() => {
          onLayoutChange(layout);
        }, 1e3);
        return () => clearTimeout(timeoutId);
      }
    }, [layout, onLayoutChange]);
    const handleWidgetDragStart = (e, widgetId) => {
      if (!editable) return;
      setDraggedWidget(widgetId);
      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", widgetId);
    };
    const handleWidgetDrop = (e) => {
      e.preventDefault();
      if (!editable || !draggedWidget) return;
      const container = e.currentTarget.getBoundingClientRect();
      const x = Math.round((e.clientX - container.left - dragOffset.x) / (container.width / layout.columns));
      const y = Math.round((e.clientY - container.top - dragOffset.y) / layout.rowHeight);
      const updatedWidgets = layout.widgets.map((widget) => {
        if (widget.id === draggedWidget) {
          return { ...widget, position: { x: Math.max(0, x), y: Math.max(0, y) } };
        }
        return widget;
      });
      const newLayout = { ...layout, widgets: updatedWidgets };
      setLayout(newLayout);
      onLayoutChange?.(newLayout);
      setDraggedWidget(null);
      setDragOffset({ x: 0, y: 0 });
    };
    const handleWidgetResize = (widgetId, newSize) => {
      const updatedWidgets = layout.widgets.map((widget) => {
        if (widget.id === widgetId) {
          return { ...widget, size: newSize };
        }
        return widget;
      });
      const newLayout = { ...layout, widgets: updatedWidgets };
      setLayout(newLayout);
      onLayoutChange?.(newLayout);
    };
    const handleWidgetRemove = (widgetId) => {
      const updatedWidgets = layout.widgets.filter((widget) => widget.id !== widgetId);
      const newLayout = { ...layout, widgets: updatedWidgets };
      setLayout(newLayout);
      onLayoutChange?.(newLayout);
      onWidgetRemove?.(widgetId);
    };
    const handleWidgetAdd = (type) => {
      onWidgetAdd?.(type);
    };
    const defaultRenderWidget = (widget) => {
      switch (widget.type) {
        case "metric":
          return /* @__PURE__ */ jsxs26("div", { className: "p-4 text-center", children: [
            /* @__PURE__ */ jsx32(Text, { variant: "label", className: "text-2xl font-bold text-primary-primary", children: widget.content.value || "0" }),
            /* @__PURE__ */ jsx32(Text, { variant: "caption", className: "text-text-secondary mt-1", children: widget.content.unit || "" }),
            widget.content.change && /* @__PURE__ */ jsxs26(
              Badge,
              {
                variant: widget.content.change > 0 ? "success" : "error",
                size: "sm",
                className: "mt-2",
                children: [
                  widget.content.change > 0 ? "+" : "",
                  widget.content.change,
                  "%"
                ]
              }
            )
          ] });
        case "chart":
          return /* @__PURE__ */ jsx32("div", { className: "p-4 h-full flex items-center justify-center", children: /* @__PURE__ */ jsx32("div", { className: "w-full h-32 bg-background-secondary rounded flex items-center justify-center", children: /* @__PURE__ */ jsx32(Text, { variant: "caption", className: "text-text-secondary", children: "\u56FE\u8868\u5360\u4F4D\u7B26" }) }) });
        case "table":
          return /* @__PURE__ */ jsx32("div", { className: "p-4", children: /* @__PURE__ */ jsx32("div", { className: "space-y-2", children: widget.content.rows?.slice(0, 3).map((row, index) => /* @__PURE__ */ jsxs26("div", { className: "flex justify-between items-center py-1 border-b border-border-primary", children: [
            /* @__PURE__ */ jsx32(Text, { variant: "caption", children: row.label }),
            /* @__PURE__ */ jsx32(Text, { variant: "caption", className: "font-medium", children: row.value })
          ] }, index)) }) });
        case "text":
          return /* @__PURE__ */ jsx32("div", { className: "p-4", children: /* @__PURE__ */ jsx32(Text, { variant: "body", children: widget.content.text || "Text content" }) });
        default:
          return /* @__PURE__ */ jsx32("div", { className: "p-4 text-center", children: /* @__PURE__ */ jsxs26(Text, { variant: "caption", className: "text-text-secondary", children: [
            "Unknown widget type: ",
            widget.type
          ] }) });
      }
    };
    const renderWidgetControls = (widget) => {
      if (!editable) return null;
      return /* @__PURE__ */ jsx32("div", { className: "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxs26("div", { className: "flex items-center space-x-1 bg-background-primary rounded shadow-lg border border-border-primary p-1", children: [
        /* @__PURE__ */ jsx32(
          IconButton,
          {
            size: "sm",
            variant: "ghost",
            onClick: () => setSelectedWidget(selectedWidget === widget.id ? null : widget.id),
            children: /* @__PURE__ */ jsx32(Settings2, { className: "h-3 w-3" })
          }
        ),
        /* @__PURE__ */ jsx32(
          IconButton,
          {
            size: "sm",
            variant: "ghost",
            onClick: () => handleWidgetRemove(widget.id),
            children: /* @__PURE__ */ jsx32(Trash22, { className: "h-3 w-3" })
          }
        )
      ] }) });
    };
    const renderAddWidgetMenu = () => {
      if (!editable || availableWidgets.length === 0) return null;
      return /* @__PURE__ */ jsx32(
        Dropdown,
        {
          trigger: /* @__PURE__ */ jsxs26(Button, { variant: "primary", size: "sm", children: [
            /* @__PURE__ */ jsx32(Plus, { className: "h-4 w-4 mr-2" }),
            "\u6DFB\u52A0\u7EC4\u4EF6"
          ] }),
          items: availableWidgets.map((widget) => ({
            key: widget.type,
            type: "item",
            label: widget.name,
            icon: widget.icon,
            onClick: () => handleWidgetAdd(widget.type)
          }))
        }
      );
    };
    const getGridStyle = () => {
      if (layoutProp.layout !== "grid") return {};
      return {
        gridTemplateColumns: `repeat(${layout.columns}, 1fr)`,
        gridAutoRows: `${layout.rowHeight}px`
      };
    };
    const getWidgetStyle = (widget) => {
      if (layoutProp.layout === "grid") {
        return {
          gridColumn: `${widget.position.x + 1} / span ${widget.size.width}`,
          gridRow: `${widget.position.y + 1} / span ${widget.size.height}`
        };
      }
      return {
        position: "absolute",
        left: `${widget.position.x / layout.columns * 100}%`,
        top: `${widget.position.y * layout.rowHeight}px`,
        width: `${widget.size.width / layout.columns * 100}%`,
        height: `${widget.size.height * layout.rowHeight}px`
      };
    };
    if (loading) {
      return /* @__PURE__ */ jsx32("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsxs26("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsx32("div", { className: "animate-spin rounded-full h-6 w-6 border-b-2 border-primary-primary" }),
        /* @__PURE__ */ jsx32(Text, { variant: "caption", children: "\u52A0\u8F7D\u4EEA\u8868\u677F..." })
      ] }) });
    }
    return /* @__PURE__ */ jsxs26("div", { className: "w-full h-full space-y-4", children: [
      /* @__PURE__ */ jsxs26("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs26("div", { children: [
          /* @__PURE__ */ jsx32(Heading, { level: "h2", className: "text-xl font-semibold", children: layout.name }),
          layout.description && /* @__PURE__ */ jsx32(Text, { variant: "caption", className: "text-text-secondary mt-1", children: layout.description })
        ] }),
        showControls && /* @__PURE__ */ jsxs26("div", { className: "flex items-center space-x-3", children: [
          renderAddWidgetMenu(),
          editable && onSave && /* @__PURE__ */ jsx32(Button, { variant: "secondary", size: "sm", onClick: onSave, children: "\u4FDD\u5B58\u5E03\u5C40" }),
          /* @__PURE__ */ jsxs26(Badge, { variant: "default", className: "flex items-center space-x-1", children: [
            /* @__PURE__ */ jsx32(Grid, { className: "h-3 w-3" }),
            /* @__PURE__ */ jsxs26("span", { children: [
              layout.widgets.length,
              " \u4E2A\u7EC4\u4EF6"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs26(
        "div",
        {
          ref,
          className: cn(dashboardVariants({ layout: layoutProp.layout, editable }), className),
          style: getGridStyle(),
          onDrop: handleWidgetDrop,
          onDragOver: (e) => e.preventDefault(),
          ...props,
          children: [
            layout.widgets.map((widget) => /* @__PURE__ */ jsx32(
              "div",
              {
                className: cn(
                  widgetVariants({
                    editable,
                    selected: selectedWidget === widget.id,
                    dragging: draggedWidget === widget.id
                  })
                ),
                style: getWidgetStyle(widget),
                draggable: editable,
                onDragStart: (e) => handleWidgetDragStart(e, widget.id),
                onClick: () => editable && setSelectedWidget(widget.id),
                children: /* @__PURE__ */ jsxs26(Card, { className: "w-full h-full", children: [
                  /* @__PURE__ */ jsxs26("div", { className: "flex items-center justify-between p-3 pb-0", children: [
                    /* @__PURE__ */ jsxs26("div", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsx32(Heading, { level: "h4", className: "text-sm font-medium truncate", children: widget.title }),
                      widget.subtitle && /* @__PURE__ */ jsx32(Text, { variant: "caption", className: "text-text-secondary truncate", children: widget.subtitle })
                    ] }),
                    widget.lastUpdated && /* @__PURE__ */ jsx32(Text, { variant: "caption", className: "text-text-tertiary text-xs", children: widget.lastUpdated.toLocaleTimeString("zh-CN") })
                  ] }),
                  /* @__PURE__ */ jsx32("div", { className: "flex-1", children: renderWidget ? renderWidget(widget) : defaultRenderWidget(widget) }),
                  renderWidgetControls(widget),
                  editable && /* @__PURE__ */ jsx32("div", { className: "absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx32(Move, { className: "h-4 w-4 text-text-secondary" }) })
                ] })
              },
              widget.id
            )),
            layout.widgets.length === 0 && /* @__PURE__ */ jsxs26("div", { className: "col-span-full flex flex-col items-center justify-center py-12 text-center", children: [
              /* @__PURE__ */ jsx32(Grid, { className: "h-12 w-12 text-text-secondary mb-4" }),
              /* @__PURE__ */ jsx32(Heading, { level: "h3", className: "text-lg font-medium mb-2", children: "\u7A7A\u767D\u4EEA\u8868\u677F" }),
              /* @__PURE__ */ jsx32(Text, { variant: "caption", className: "text-text-secondary mb-4", children: "\u6DFB\u52A0\u7EC4\u4EF6\u6765\u5F00\u59CB\u6784\u5EFA\u60A8\u7684\u4EEA\u8868\u677F" }),
              renderAddWidgetMenu()
            ] })
          ]
        }
      )
    ] });
  }
);
Dashboard.displayName = "Dashboard";

// src/components/charts/RealtimeMonitor.tsx
import * as React34 from "react";
import {
  Activity,
  Wifi,
  WifiOff,
  Play,
  Pause,
  TrendingUp as TrendingUp2,
  TrendingDown,
  AlertTriangle as AlertTriangle5,
  CheckCircle as CheckCircle4,
  XCircle,
  Clock as Clock2,
  Zap
} from "lucide-react";
import { cva as cva32 } from "class-variance-authority";
import { Fragment as Fragment8, jsx as jsx33, jsxs as jsxs27 } from "react/jsx-runtime";
var monitorVariants = cva32(
  "w-full space-y-4",
  {
    variants: {
      layout: {
        grid: "",
        list: "",
        compact: ""
      },
      status: {
        normal: "border-status-success",
        warning: "border-status-warning",
        critical: "border-status-error",
        error: "border-status-error"
      }
    },
    defaultVariants: {
      layout: "grid",
      status: "normal"
    }
  }
);
var statusIcons2 = {
  normal: CheckCircle4,
  warning: AlertTriangle5,
  critical: XCircle,
  error: XCircle
};
var statusColors2 = {
  normal: "text-status-success",
  warning: "text-status-warning",
  critical: "text-status-error",
  error: "text-status-error"
};
var trendIcons = {
  up: TrendingUp2,
  down: TrendingDown,
  stable: Activity
};
var RealtimeMonitor = React34.forwardRef(
  ({
    className,
    layout,
    status,
    metrics,
    alerts = [],
    connected = true,
    running = false,
    updateInterval = 5e3,
    maxDataPoints = 100,
    showCharts = true,
    showStatus = true,
    showAlerts = true,
    onStart,
    onStop,
    onAlertAcknowledge,
    onAlertResolve,
    onMetricClick,
    ...props
  }, ref) => {
    const [isRunning, setIsRunning] = React34.useState(running);
    const [connectionStatus, setConnectionStatus] = React34.useState(connected);
    const [lastUpdate, setLastUpdate] = React34.useState(/* @__PURE__ */ new Date());
    const [uptime, setUptime] = React34.useState(0);
    const uptimeRef = React34.useRef();
    const systemStatus = React34.useMemo(() => {
      if (!connected) return "error";
      if (metrics.some((m) => m.status === "critical")) return "critical";
      if (metrics.some((m) => m.status === "warning")) return "warning";
      return "normal";
    }, [connected, metrics]);
    React34.useEffect(() => {
      if (isRunning) {
        uptimeRef.current = setInterval(() => {
          setUptime((prev) => prev + 1);
        }, 1e3);
      } else {
        if (uptimeRef.current) {
          clearInterval(uptimeRef.current);
        }
      }
      return () => {
        if (uptimeRef.current) {
          clearInterval(uptimeRef.current);
        }
      };
    }, [isRunning]);
    React34.useEffect(() => {
      setConnectionStatus(connected);
    }, [connected]);
    const handleStartStop = () => {
      if (isRunning) {
        setIsRunning(false);
        setUptime(0);
        onStop?.();
      } else {
        setIsRunning(true);
        setLastUpdate(/* @__PURE__ */ new Date());
        onStart?.();
      }
    };
    const formatUptime = (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor(seconds % 3600 / 60);
      const secs = seconds % 60;
      if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
      }
      if (minutes > 0) {
        return `${minutes}m ${secs}s`;
      }
      return `${secs}s`;
    };
    const getMetricStatusColor = (metric) => {
      switch (metric.status) {
        case "critical":
        case "error":
          return "text-status-error";
        case "warning":
          return "text-status-warning";
        default:
          return "text-status-success";
      }
    };
    const renderMiniChart = (metric) => {
      if (!showCharts || metric.history.length < 2) return null;
      const maxValue = Math.max(...metric.history.map((d) => d.value));
      const minValue = Math.min(...metric.history.map((d) => d.value));
      const range = maxValue - minValue || 1;
      const points = metric.history.slice(-20).map((point, index) => {
        const x = index / 19 * 100;
        const y = 100 - (point.value - minValue) / range * 100;
        return `${x},${y}`;
      }).join(" ");
      return /* @__PURE__ */ jsx33("div", { className: "w-16 h-8", children: /* @__PURE__ */ jsx33("svg", { viewBox: "0 0 100 100", className: "w-full h-full", children: /* @__PURE__ */ jsx33(
        "polyline",
        {
          points,
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          className: getMetricStatusColor(metric)
        }
      ) }) });
    };
    const renderMetricCard = (metric) => {
      const StatusIcon = statusIcons2[metric.status];
      const TrendIcon = trendIcons[metric.trend];
      return /* @__PURE__ */ jsxs27(
        Card,
        {
          className: cn(
            "p-4 cursor-pointer hover:shadow-md transition-shadow",
            metric.status === "critical" && "border-status-error bg-status-error/5",
            metric.status === "warning" && "border-status-warning bg-status-warning/5"
          ),
          onClick: () => onMetricClick?.(metric),
          children: [
            /* @__PURE__ */ jsxs27("div", { className: "flex items-start justify-between mb-2", children: [
              /* @__PURE__ */ jsxs27("div", { className: "flex items-center space-x-2", children: [
                /* @__PURE__ */ jsx33(StatusIcon, { className: cn("h-4 w-4", statusColors2[metric.status]) }),
                /* @__PURE__ */ jsx33(Text, { variant: "label", className: "font-medium", children: metric.name })
              ] }),
              renderMiniChart(metric)
            ] }),
            /* @__PURE__ */ jsxs27("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs27("div", { children: [
                /* @__PURE__ */ jsxs27(Text, { variant: "label", className: "text-xl font-bold", children: [
                  metric.current.toFixed(2),
                  metric.unit && /* @__PURE__ */ jsx33("span", { className: "text-sm font-normal text-text-secondary ml-1", children: metric.unit })
                ] }),
                metric.changePercent !== void 0 && /* @__PURE__ */ jsxs27("div", { className: "flex items-center space-x-1 mt-1", children: [
                  /* @__PURE__ */ jsx33(TrendIcon, { className: cn(
                    "h-3 w-3",
                    metric.trend === "up" ? "text-status-success" : metric.trend === "down" ? "text-status-error" : "text-text-secondary"
                  ) }),
                  /* @__PURE__ */ jsxs27(Text, { variant: "caption", className: cn(
                    metric.trend === "up" ? "text-status-success" : metric.trend === "down" ? "text-status-error" : "text-text-secondary"
                  ), children: [
                    metric.changePercent > 0 ? "+" : "",
                    metric.changePercent.toFixed(1),
                    "%"
                  ] })
                ] })
              ] }),
              metric.threshold && /* @__PURE__ */ jsxs27("div", { className: "text-right", children: [
                /* @__PURE__ */ jsx33(
                  Progress,
                  {
                    value: metric.current / metric.threshold.critical * 100,
                    variant: metric.status === "normal" ? "default" : metric.status === "warning" ? "warning" : "error",
                    size: "sm",
                    className: "w-16"
                  }
                ),
                /* @__PURE__ */ jsxs27(Text, { variant: "caption", className: "text-text-tertiary mt-1", children: [
                  "\u9650\u5236: ",
                  metric.threshold.critical
                ] })
              ] })
            ] })
          ]
        },
        metric.id
      );
    };
    const renderSystemStatus = () => {
      if (!showStatus) return null;
      const SystemStatusIcon = statusIcons2[systemStatus];
      return /* @__PURE__ */ jsx33(Card, { className: "p-4", children: /* @__PURE__ */ jsxs27("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs27("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ jsx33("div", { className: cn(
            "flex items-center justify-center w-10 h-10 rounded-full",
            systemStatus === "normal" && "bg-status-success/10",
            systemStatus === "warning" && "bg-status-warning/10",
            (systemStatus === "critical" || systemStatus === "error") && "bg-status-error/10"
          ), children: /* @__PURE__ */ jsx33(SystemStatusIcon, { className: cn("h-5 w-5", statusColors2[systemStatus]) }) }),
          /* @__PURE__ */ jsxs27("div", { children: [
            /* @__PURE__ */ jsx33(Heading, { level: "h3", className: "text-lg font-semibold", children: "\u7CFB\u7EDF\u72B6\u6001" }),
            /* @__PURE__ */ jsxs27("div", { className: "flex items-center space-x-4 mt-1", children: [
              /* @__PURE__ */ jsxs27("div", { className: "flex items-center space-x-1", children: [
                connectionStatus ? /* @__PURE__ */ jsx33(Wifi, { className: "h-3 w-3 text-status-success" }) : /* @__PURE__ */ jsx33(WifiOff, { className: "h-3 w-3 text-status-error" }),
                /* @__PURE__ */ jsx33(Text, { variant: "caption", className: connectionStatus ? "text-status-success" : "text-status-error", children: connectionStatus ? "\u5DF2\u8FDE\u63A5" : "\u8FDE\u63A5\u65AD\u5F00" })
              ] }),
              /* @__PURE__ */ jsxs27("div", { className: "flex items-center space-x-1", children: [
                /* @__PURE__ */ jsx33(Clock2, { className: "h-3 w-3 text-text-secondary" }),
                /* @__PURE__ */ jsxs27(Text, { variant: "caption", className: "text-text-secondary", children: [
                  "\u8FD0\u884C\u65F6\u95F4: ",
                  formatUptime(uptime)
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs27("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx33(
            Button,
            {
              variant: isRunning ? "secondary" : "primary",
              size: "sm",
              onClick: handleStartStop,
              disabled: !connectionStatus,
              children: isRunning ? /* @__PURE__ */ jsxs27(Fragment8, { children: [
                /* @__PURE__ */ jsx33(Pause, { className: "h-4 w-4 mr-2" }),
                "\u6682\u505C"
              ] }) : /* @__PURE__ */ jsxs27(Fragment8, { children: [
                /* @__PURE__ */ jsx33(Play, { className: "h-4 w-4 mr-2" }),
                "\u5F00\u59CB"
              ] })
            }
          ),
          /* @__PURE__ */ jsxs27(Badge, { variant: systemStatus === "normal" ? "success" : systemStatus === "warning" ? "warning" : "error", children: [
            /* @__PURE__ */ jsx33(Zap, { className: "h-3 w-3 mr-1" }),
            systemStatus === "normal" && "\u6B63\u5E38",
            systemStatus === "warning" && "\u8B66\u544A",
            (systemStatus === "critical" || systemStatus === "error") && "\u6545\u969C"
          ] })
        ] })
      ] }) });
    };
    const renderAlerts = () => {
      if (!showAlerts || alerts.length === 0) return null;
      const unacknowledgedAlerts = alerts.filter((alert) => !alert.acknowledged);
      const criticalAlerts = alerts.filter((alert) => alert.severity === "critical");
      return /* @__PURE__ */ jsxs27(Card, { className: "p-4", children: [
        /* @__PURE__ */ jsxs27("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsx33(Heading, { level: "h3", className: "text-lg font-semibold", children: "\u7CFB\u7EDF\u8B66\u62A5" }),
          /* @__PURE__ */ jsxs27("div", { className: "flex items-center space-x-2", children: [
            criticalAlerts.length > 0 && /* @__PURE__ */ jsxs27(Badge, { variant: "error", className: "animate-pulse", children: [
              criticalAlerts.length,
              " \u4E25\u91CD"
            ] }),
            unacknowledgedAlerts.length > 0 && /* @__PURE__ */ jsxs27(Badge, { variant: "warning", children: [
              unacknowledgedAlerts.length,
              " \u672A\u786E\u8BA4"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx33("div", { className: "space-y-2 max-h-48 overflow-y-auto", children: alerts.slice(0, 5).map((alert) => /* @__PURE__ */ jsxs27(
          "div",
          {
            className: cn(
              "flex items-start justify-between p-3 rounded-lg border",
              alert.severity === "critical" && "border-status-error bg-status-error/5",
              alert.severity === "warning" && "border-status-warning bg-status-warning/5",
              alert.severity === "info" && "border-status-info bg-status-info/5",
              alert.acknowledged && "opacity-60"
            ),
            children: [
              /* @__PURE__ */ jsxs27("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxs27("div", { className: "flex items-center space-x-2", children: [
                  /* @__PURE__ */ jsx33(
                    Badge,
                    {
                      variant: alert.severity === "critical" ? "error" : alert.severity === "warning" ? "warning" : "default",
                      size: "sm",
                      children: alert.severity
                    }
                  ),
                  /* @__PURE__ */ jsx33(Text, { variant: "label", className: "font-medium", children: alert.metric })
                ] }),
                /* @__PURE__ */ jsx33(Text, { variant: "caption", className: "text-text-secondary mt-1", children: alert.message }),
                /* @__PURE__ */ jsx33(Text, { variant: "caption", className: "text-text-tertiary mt-1", children: alert.timestamp.toLocaleString("zh-CN") })
              ] }),
              /* @__PURE__ */ jsxs27("div", { className: "flex items-center space-x-1 ml-3", children: [
                !alert.acknowledged && /* @__PURE__ */ jsx33(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    onClick: () => onAlertAcknowledge?.(alert.id),
                    children: "\u786E\u8BA4"
                  }
                ),
                !alert.resolved && /* @__PURE__ */ jsx33(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    onClick: () => onAlertResolve?.(alert.id),
                    children: "\u89E3\u51B3"
                  }
                )
              ] })
            ]
          },
          alert.id
        )) }),
        alerts.length > 5 && /* @__PURE__ */ jsx33("div", { className: "text-center mt-3", children: /* @__PURE__ */ jsxs27(Text, { variant: "caption", className: "text-text-secondary", children: [
          "\u8FD8\u6709 ",
          alerts.length - 5,
          " \u4E2A\u8B66\u62A5..."
        ] }) })
      ] });
    };
    return /* @__PURE__ */ jsxs27(
      "div",
      {
        ref,
        className: cn(monitorVariants({ layout, status: systemStatus }), className),
        ...props,
        children: [
          renderSystemStatus(),
          /* @__PURE__ */ jsx33("div", { className: cn(
            layout === "grid" && "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
            layout === "list" && "space-y-3",
            layout === "compact" && "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3"
          ), children: metrics.map(renderMetricCard) }),
          renderAlerts(),
          /* @__PURE__ */ jsxs27("div", { className: "flex items-center justify-between text-xs text-text-tertiary", children: [
            /* @__PURE__ */ jsxs27("span", { children: [
              "\u6700\u540E\u66F4\u65B0: ",
              lastUpdate.toLocaleTimeString("zh-CN")
            ] }),
            /* @__PURE__ */ jsxs27("span", { children: [
              "\u66F4\u65B0\u95F4\u9694: ",
              updateInterval / 1e3,
              "s"
            ] })
          ] })
        ]
      }
    );
  }
);
RealtimeMonitor.displayName = "RealtimeMonitor";

// src/components/charts/DataTable.tsx
import * as React35 from "react";
import {
  ChevronUp,
  ChevronDown as ChevronDown3,
  ChevronsUpDown,
  Filter,
  Search as Search3,
  Download as Download2,
  Settings as Settings3,
  Eye as Eye4,
  EyeOff as EyeOff3,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { cva as cva33 } from "class-variance-authority";
import { jsx as jsx34, jsxs as jsxs28 } from "react/jsx-runtime";
var tableVariants = cva33(
  "w-full",
  {
    variants: {
      variant: {
        default: "",
        bordered: "border border-border-primary",
        striped: "[&_tbody_tr:nth-child(even)]:bg-background-secondary/50",
        compact: "[&_td]:py-1 [&_th]:py-1"
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);
function DataTable({
  className,
  variant,
  size,
  columns: initialColumns,
  data,
  title,
  subtitle,
  selectable = false,
  selectedRows = [],
  sortable = true,
  sortConfig,
  filterable = true,
  filterConfig = {},
  paginated = true,
  pagination = { page: 1, pageSize: 10, total: 0 },
  searchable = true,
  searchQuery = "",
  resizable = true,
  reorderable = false,
  columnToggle = true,
  loading = false,
  emptyMessage = "\u6682\u65E0\u6570\u636E",
  showControls = true,
  virtual = false,
  rowHeight = 48,
  onRowSelect,
  onRowClick,
  onSortChange,
  onFilterChange,
  onPaginationChange,
  onSearchChange,
  onColumnsChange,
  onExport,
  ...props
}) {
  const [columns, setColumns] = React35.useState(initialColumns);
  const [internalSort, setInternalSort] = React35.useState(sortConfig || null);
  const [internalFilters, setInternalFilters] = React35.useState(filterConfig);
  const [internalSearch, setInternalSearch] = React35.useState(searchQuery);
  const [columnWidths, setColumnWidths] = React35.useState({});
  const [resizingColumn, setResizingColumn] = React35.useState(null);
  const tableRef = React35.useRef(null);
  const toggleColumnVisibility = (columnId) => {
    const updatedColumns = columns.map(
      (col) => col.id === columnId ? { ...col, hidden: !col.hidden } : col
    );
    setColumns(updatedColumns);
    onColumnsChange?.(updatedColumns);
  };
  const handleSort = (columnId) => {
    if (!sortable) return;
    const newSort = {
      key: columnId,
      direction: internalSort?.key === columnId && internalSort.direction === "asc" ? "desc" : "asc"
    };
    setInternalSort(newSort);
    onSortChange?.(newSort);
  };
  const handleFilterChange = (columnId, value) => {
    const newFilters = { ...internalFilters, [columnId]: value };
    setInternalFilters(newFilters);
    onFilterChange?.(newFilters);
  };
  const handleSearchChange = (query) => {
    setInternalSearch(query);
    onSearchChange?.(query);
  };
  const handleRowSelect = (rowId, checked) => {
    const newSelection = checked ? [...selectedRows, rowId] : selectedRows.filter((id) => id !== rowId);
    onRowSelect?.(newSelection);
  };
  const handleSelectAll = (checked) => {
    const newSelection = checked ? data.map((row) => row.id) : [];
    onRowSelect?.(newSelection);
  };
  const handleMouseDown = (columnId, e) => {
    if (!resizable) return;
    setResizingColumn(columnId);
    const startX = e.clientX;
    const startWidth = columnWidths[columnId] || 150;
    const handleMouseMove = (e2) => {
      const newWidth = Math.max(50, startWidth + (e2.clientX - startX));
      setColumnWidths((prev) => ({ ...prev, [columnId]: newWidth }));
    };
    const handleMouseUp = () => {
      setResizingColumn(null);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  const renderCell = (column, row) => {
    const value = row[column.key];
    if (column.format) {
      return column.format(value, row);
    }
    switch (column.type) {
      case "boolean":
        return /* @__PURE__ */ jsx34(Badge, { variant: value ? "success" : "default", size: "sm", children: value ? "\u662F" : "\u5426" });
      case "date":
        return value ? new Date(value).toLocaleDateString("zh-CN") : "-";
      case "number":
        return typeof value === "number" ? value.toLocaleString() : "-";
      default:
        return value || "-";
    }
  };
  const renderFilter = (column) => {
    if (!filterable || !column.filterable) return null;
    const filterValue = internalFilters[column.id] || "";
    switch (column.filter?.type) {
      case "select":
        return /* @__PURE__ */ jsx34(
          Select,
          {
            size: "sm",
            options: column.filter.options || [],
            value: filterValue,
            onChange: (value) => handleFilterChange(column.id, value),
            placeholder: "\u7B5B\u9009..."
          }
        );
      case "number":
        return /* @__PURE__ */ jsx34(
          Input,
          {
            type: "number",
            size: "sm",
            value: filterValue,
            onChange: (e) => handleFilterChange(column.id, e.target.value),
            placeholder: "\u7B5B\u9009..."
          }
        );
      default:
        return /* @__PURE__ */ jsx34(
          Input,
          {
            size: "sm",
            value: filterValue,
            onChange: (e) => handleFilterChange(column.id, e.target.value),
            placeholder: "\u7B5B\u9009..."
          }
        );
    }
  };
  const visibleColumns = columns.filter((col) => !col.hidden);
  const hasSelection = selectable && selectedRows.length > 0;
  const isAllSelected = selectedRows.length === data.length && data.length > 0;
  const isPartiallySelected = selectedRows.length > 0 && selectedRows.length < data.length;
  const exportOptions = [
    { value: "csv", label: "\u5BFC\u51FA\u4E3A CSV" },
    { value: "excel", label: "\u5BFC\u51FA\u4E3A Excel" },
    { value: "pdf", label: "\u5BFC\u51FA\u4E3A PDF" }
  ];
  const columnToggleOptions = columns.map((col) => ({
    key: col.id,
    type: "item",
    label: /* @__PURE__ */ jsxs28("div", { className: "flex items-center justify-between w-full", children: [
      /* @__PURE__ */ jsx34("span", { children: col.title }),
      !col.hidden && /* @__PURE__ */ jsx34(Eye4, { className: "h-3 w-3" }),
      col.hidden && /* @__PURE__ */ jsx34(EyeOff3, { className: "h-3 w-3" })
    ] }),
    onClick: () => toggleColumnVisibility(col.id)
  }));
  if (loading) {
    return /* @__PURE__ */ jsx34(Card, { className: "p-8", children: /* @__PURE__ */ jsx34("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxs28("div", { className: "flex items-center space-x-3", children: [
      /* @__PURE__ */ jsx34("div", { className: "animate-spin rounded-full h-6 w-6 border-b-2 border-primary-primary" }),
      /* @__PURE__ */ jsx34(Text, { variant: "caption", children: "\u52A0\u8F7D\u6570\u636E..." })
    ] }) }) });
  }
  return /* @__PURE__ */ jsxs28("div", { className: cn("w-full space-y-4", className), ...props, children: [
    (title || subtitle || showControls) && /* @__PURE__ */ jsxs28("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxs28("div", { children: [
        title && /* @__PURE__ */ jsx34(Heading, { level: "h2", className: "text-xl font-semibold", children: title }),
        subtitle && /* @__PURE__ */ jsx34(Text, { variant: "caption", className: "text-text-secondary mt-1", children: subtitle })
      ] }),
      showControls && /* @__PURE__ */ jsxs28("div", { className: "flex items-center space-x-2", children: [
        searchable && /* @__PURE__ */ jsx34(
          Input,
          {
            placeholder: "\u641C\u7D22...",
            value: internalSearch,
            onChange: (e) => handleSearchChange(e.target.value),
            leftElement: /* @__PURE__ */ jsx34(Search3, { className: "h-4 w-4 text-text-secondary" }),
            className: "w-64"
          }
        ),
        columnToggle && /* @__PURE__ */ jsx34(
          Dropdown,
          {
            trigger: /* @__PURE__ */ jsx34(IconButton, { variant: "ghost", size: "sm", children: /* @__PURE__ */ jsx34(Settings3, { className: "h-4 w-4" }) }),
            items: columnToggleOptions
          }
        ),
        onExport && /* @__PURE__ */ jsx34(
          Dropdown,
          {
            trigger: /* @__PURE__ */ jsx34(IconButton, { variant: "ghost", size: "sm", children: /* @__PURE__ */ jsx34(Download2, { className: "h-4 w-4" }) }),
            items: exportOptions.map((option) => ({
              key: option.value,
              type: "item",
              label: option.label,
              onClick: () => onExport(option.value)
            }))
          }
        )
      ] })
    ] }),
    hasSelection && /* @__PURE__ */ jsxs28("div", { className: "flex items-center justify-between p-3 bg-primary-primary/10 rounded-lg border border-primary-primary/20", children: [
      /* @__PURE__ */ jsxs28(Text, { variant: "label", className: "text-primary-primary", children: [
        "\u5DF2\u9009\u62E9 ",
        selectedRows.length,
        " \u9879"
      ] }),
      /* @__PURE__ */ jsx34(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => onRowSelect?.([]),
          children: "\u6E05\u9664\u9009\u62E9"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs28(Card, { children: [
      /* @__PURE__ */ jsx34("div", { ref: tableRef, className: "overflow-auto", children: /* @__PURE__ */ jsxs28("table", { className: cn("w-full border-collapse", tableVariants({ variant, size })), children: [
        /* @__PURE__ */ jsx34("thead", { className: "bg-background-secondary", children: /* @__PURE__ */ jsxs28("tr", { children: [
          selectable && /* @__PURE__ */ jsx34("th", { className: "w-12 p-3 text-left", children: /* @__PURE__ */ jsx34(
            Checkbox,
            {
              checked: isAllSelected,
              indeterminate: isPartiallySelected,
              onChange: (e) => handleSelectAll(e.target.checked)
            }
          ) }),
          visibleColumns.map((column) => /* @__PURE__ */ jsxs28(
            "th",
            {
              className: cn(
                "p-3 font-medium text-text-primary",
                column.align === "center" && "text-center",
                column.align === "right" && "text-right",
                "border-b border-border-primary",
                "relative group"
              ),
              style: {
                width: columnWidths[column.id] || column.width,
                minWidth: column.minWidth,
                maxWidth: column.maxWidth
              },
              children: [
                /* @__PURE__ */ jsxs28("div", { className: "flex items-center space-x-2", children: [
                  sortable && column.sortable ? /* @__PURE__ */ jsxs28(
                    "button",
                    {
                      onClick: () => handleSort(column.id),
                      className: "flex items-center space-x-1 hover:text-primary-primary",
                      children: [
                        /* @__PURE__ */ jsx34("span", { children: column.title }),
                        internalSort?.key === column.id ? internalSort.direction === "asc" ? /* @__PURE__ */ jsx34(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx34(ChevronDown3, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx34(ChevronsUpDown, { className: "h-4 w-4 opacity-40" })
                      ]
                    }
                  ) : /* @__PURE__ */ jsx34("span", { children: column.title }),
                  filterable && column.filterable && /* @__PURE__ */ jsx34(
                    Dropdown,
                    {
                      trigger: /* @__PURE__ */ jsx34(IconButton, { variant: "ghost", size: "sm", children: /* @__PURE__ */ jsx34(Filter, { className: "h-3 w-3" }) }),
                      content: /* @__PURE__ */ jsx34("div", { className: "p-3 w-48", children: renderFilter(column) })
                    }
                  )
                ] }),
                resizable && /* @__PURE__ */ jsx34(
                  "div",
                  {
                    className: "absolute right-0 top-0 bottom-0 w-1 cursor-col-resize opacity-0 group-hover:opacity-100 bg-primary-primary",
                    onMouseDown: (e) => handleMouseDown(column.id, e)
                  }
                )
              ]
            },
            column.id
          ))
        ] }) }),
        /* @__PURE__ */ jsx34("tbody", { children: data.length === 0 ? /* @__PURE__ */ jsx34("tr", { children: /* @__PURE__ */ jsx34(
          "td",
          {
            colSpan: visibleColumns.length + (selectable ? 1 : 0),
            className: "p-8 text-center text-text-secondary",
            children: emptyMessage
          }
        ) }) : data.map((row) => /* @__PURE__ */ jsxs28(
          "tr",
          {
            className: cn(
              "hover:bg-background-secondary/50 transition-colors",
              selectedRows.includes(row.id) && "bg-primary-primary/5",
              onRowClick && "cursor-pointer"
            ),
            onClick: () => onRowClick?.(row),
            children: [
              selectable && /* @__PURE__ */ jsx34("td", { className: "p-3", children: /* @__PURE__ */ jsx34(
                Checkbox,
                {
                  checked: selectedRows.includes(row.id),
                  onChange: (e) => handleRowSelect(row.id, e.target.checked)
                }
              ) }),
              visibleColumns.map((column) => /* @__PURE__ */ jsx34(
                "td",
                {
                  className: cn(
                    "p-3 border-b border-border-primary",
                    column.align === "center" && "text-center",
                    column.align === "right" && "text-right"
                  ),
                  children: renderCell(column, row)
                },
                column.id
              ))
            ]
          },
          row.id
        )) })
      ] }) }),
      paginated && pagination && data.length > 0 && /* @__PURE__ */ jsxs28("div", { className: "flex items-center justify-between p-4 border-t border-border-primary", children: [
        /* @__PURE__ */ jsxs28(Text, { variant: "caption", className: "text-text-secondary", children: [
          "\u663E\u793A ",
          (pagination.page - 1) * pagination.pageSize + 1,
          " - ",
          Math.min(pagination.page * pagination.pageSize, pagination.total),
          " \u9879\uFF0C\u5171 ",
          pagination.total,
          " \u9879"
        ] }),
        /* @__PURE__ */ jsxs28("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx34(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => onPaginationChange?.({ ...pagination, page: pagination.page - 1 }),
              disabled: pagination.page <= 1,
              children: /* @__PURE__ */ jsx34(ArrowLeft, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsx34("div", { className: "flex items-center space-x-1", children: Array.from({ length: Math.min(5, Math.ceil(pagination.total / pagination.pageSize)) }, (_, i) => {
            const page = pagination.page + i - 2;
            if (page < 1 || page > Math.ceil(pagination.total / pagination.pageSize)) return null;
            return /* @__PURE__ */ jsx34(
              Button,
              {
                variant: page === pagination.page ? "primary" : "ghost",
                size: "sm",
                onClick: () => onPaginationChange?.({ ...pagination, page }),
                children: page
              },
              page
            );
          }) }),
          /* @__PURE__ */ jsx34(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => onPaginationChange?.({ ...pagination, page: pagination.page + 1 }),
              disabled: pagination.page >= Math.ceil(pagination.total / pagination.pageSize),
              children: /* @__PURE__ */ jsx34(ArrowRight, { className: "h-4 w-4" })
            }
          )
        ] })
      ] })
    ] })
  ] });
}
DataTable.displayName = "DataTable";

// src/components/charts/Metrics.tsx
import * as React36 from "react";
import {
  TrendingUp as TrendingUp3,
  TrendingDown as TrendingDown2,
  Minus as Minus2,
  ArrowUp,
  ArrowDown,
  Target,
  Info as Info2,
  AlertTriangle as AlertTriangle6,
  CheckCircle as CheckCircle5,
  Clock as Clock3,
  Zap as Zap2,
  DollarSign,
  Users,
  Activity as Activity2,
  BarChart
} from "lucide-react";
import { cva as cva34 } from "class-variance-authority";
import { Fragment as Fragment9, jsx as jsx35, jsxs as jsxs29 } from "react/jsx-runtime";
var metricsVariants = cva34(
  "w-full",
  {
    variants: {
      layout: {
        grid: "grid gap-4",
        list: "space-y-4",
        compact: "grid gap-2",
        dashboard: "grid gap-6"
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg"
      }
    },
    defaultVariants: {
      layout: "grid",
      size: "md"
    }
  }
);
var metricCardVariants = cva34(
  "p-4 relative overflow-hidden transition-all duration-200",
  {
    variants: {
      variant: {
        default: "",
        elevated: "shadow-lg hover:shadow-xl",
        minimal: "border-none shadow-none",
        highlight: "ring-2 ring-primary-primary ring-offset-2"
      },
      status: {
        normal: "",
        warning: "border-status-warning bg-status-warning/5",
        error: "border-status-error bg-status-error/5",
        success: "border-status-success bg-status-success/5"
      },
      interactive: {
        true: "cursor-pointer hover:shadow-md hover:scale-105",
        false: ""
      }
    },
    defaultVariants: {
      variant: "default",
      status: "normal",
      interactive: false
    }
  }
);
var categoryIcons = {
  financial: DollarSign,
  users: Users,
  performance: Activity2,
  analytics: BarChart,
  system: Zap2,
  time: Clock3,
  default: Target
};
var statusIcons3 = {
  "on-track": CheckCircle5,
  "at-risk": AlertTriangle6,
  "behind": AlertTriangle6,
  "achieved": CheckCircle5
};
var statusColors3 = {
  "on-track": "text-status-success",
  "at-risk": "text-status-warning",
  "behind": "text-status-error",
  "achieved": "text-status-success"
};
var Metrics = React36.forwardRef(
  ({
    className,
    layout,
    size,
    metrics,
    columns = 4,
    showTrends = true,
    showGoals = true,
    showAlerts = true,
    showComparisons = false,
    interactive = false,
    loading = false,
    emptyMessage = "\u6682\u65E0\u6307\u6807\u6570\u636E",
    trendPeriod = "\u4E0E\u4E0A\u671F\u76F8\u6BD4",
    onMetricClick,
    onGoalClick,
    onAlertClick,
    renderMetric,
    ...props
  }, ref) => {
    const formatValue = (value) => {
      const { current, format = "number", unit, precision = 2 } = value;
      switch (format) {
        case "currency":
          return new Intl.NumberFormat("zh-CN", {
            style: "currency",
            currency: "CNY",
            minimumFractionDigits: precision,
            maximumFractionDigits: precision
          }).format(current);
        case "percentage":
          return `${current.toFixed(precision)}%`;
        case "duration":
          if (current < 60) return `${current.toFixed(0)}s`;
          if (current < 3600) return `${(current / 60).toFixed(1)}m`;
          return `${(current / 3600).toFixed(1)}h`;
        case "bytes":
          const units = ["B", "KB", "MB", "GB", "TB"];
          let size2 = current;
          let unitIndex = 0;
          while (size2 >= 1024 && unitIndex < units.length - 1) {
            size2 /= 1024;
            unitIndex++;
          }
          return `${size2.toFixed(precision)} ${units[unitIndex]}`;
        default:
          return current.toLocaleString("zh-CN", {
            minimumFractionDigits: precision,
            maximumFractionDigits: precision
          }) + (unit ? ` ${unit}` : "");
      }
    };
    const getTrendDisplay = (trend) => {
      const { direction, changePercent, isPositive } = trend;
      let TrendIcon;
      let colorClass;
      if (direction === "stable") {
        TrendIcon = Minus2;
        colorClass = "text-text-secondary";
      } else if (direction === "up") {
        TrendIcon = isPositive ? TrendingUp3 : ArrowUp;
        colorClass = isPositive ? "text-status-success" : "text-status-error";
      } else {
        TrendIcon = isPositive ? TrendingDown2 : ArrowDown;
        colorClass = isPositive ? "text-status-success" : "text-status-error";
      }
      return { TrendIcon, colorClass };
    };
    const renderMetricCard = (metric) => {
      const {
        id,
        name,
        description,
        category,
        value,
        trend,
        goal,
        alert,
        icon,
        color,
        lastUpdated
      } = metric;
      const MetricIcon = icon || categoryIcons[category] || categoryIcons.default;
      const alertStatus = alert ? alert.level === "error" ? "error" : alert.level === "warning" ? "warning" : "normal" : "normal";
      return /* @__PURE__ */ jsxs29(
        Card,
        {
          className: cn(
            metricCardVariants({
              variant: color ? "highlight" : "default",
              status: alertStatus,
              interactive
            })
          ),
          onClick: () => interactive && onMetricClick?.(metric),
          children: [
            /* @__PURE__ */ jsxs29("div", { className: "flex items-start justify-between mb-3", children: [
              /* @__PURE__ */ jsxs29("div", { className: "flex items-center space-x-2", children: [
                /* @__PURE__ */ jsx35("div", { className: cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg",
                  color ? `bg-[${color}]/10` : "bg-primary-primary/10"
                ), children: /* @__PURE__ */ jsx35(MetricIcon, { className: cn(
                  "h-4 w-4",
                  color ? `text-[${color}]` : "text-primary-primary"
                ) }) }),
                /* @__PURE__ */ jsxs29("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsx35(Heading, { level: "h4", className: "text-sm font-medium text-text-primary truncate", children: name }),
                  description && /* @__PURE__ */ jsx35(Text, { variant: "caption", className: "text-text-secondary truncate", children: description })
                ] })
              ] }),
              showAlerts && alert && /* @__PURE__ */ jsx35(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: (e) => {
                    e.stopPropagation();
                    onAlertClick?.(metric, alert);
                  },
                  className: "p-1",
                  children: /* @__PURE__ */ jsx35(Info2, { className: cn(
                    "h-4 w-4",
                    alert.level === "error" ? "text-status-error" : alert.level === "warning" ? "text-status-warning" : "text-status-info"
                  ) })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs29("div", { className: "mb-3", children: [
              /* @__PURE__ */ jsx35(Text, { variant: "label", className: "text-2xl font-bold text-text-primary", children: formatValue(value) }),
              value.previous !== void 0 && /* @__PURE__ */ jsxs29(Text, { variant: "caption", className: "text-text-secondary", children: [
                "\u4E0A\u671F: ",
                formatValue({ ...value, current: value.previous })
              ] })
            ] }),
            showTrends && trend && /* @__PURE__ */ jsxs29("div", { className: "flex items-center justify-between mb-3", children: [
              /* @__PURE__ */ jsx35("div", { className: "flex items-center space-x-1", children: (() => {
                const { TrendIcon, colorClass } = getTrendDisplay(trend);
                return /* @__PURE__ */ jsxs29(Fragment9, { children: [
                  /* @__PURE__ */ jsx35(TrendIcon, { className: cn("h-3 w-3", colorClass) }),
                  /* @__PURE__ */ jsxs29(Text, { variant: "caption", className: colorClass, children: [
                    trend.changePercent > 0 ? "+" : "",
                    trend.changePercent.toFixed(1),
                    "%"
                  ] })
                ] });
              })() }),
              /* @__PURE__ */ jsx35(Text, { variant: "caption", className: "text-text-tertiary", children: trendPeriod })
            ] }),
            showGoals && goal && /* @__PURE__ */ jsxs29("div", { className: "mb-3", children: [
              /* @__PURE__ */ jsxs29("div", { className: "flex items-center justify-between mb-1", children: [
                /* @__PURE__ */ jsx35(Text, { variant: "caption", className: "text-text-secondary", children: "\u76EE\u6807\u8FDB\u5EA6" }),
                /* @__PURE__ */ jsxs29("div", { className: "flex items-center space-x-1", children: [
                  (() => {
                    const StatusIcon = statusIcons3[goal.status];
                    return /* @__PURE__ */ jsx35(StatusIcon, { className: cn("h-3 w-3", statusColors3[goal.status]) });
                  })(),
                  /* @__PURE__ */ jsxs29(Text, { variant: "caption", className: statusColors3[goal.status], children: [
                    Math.round(goal.progress),
                    "%"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx35(
                Progress,
                {
                  value: goal.progress,
                  variant: goal.status === "achieved" || goal.status === "on-track" ? "default" : goal.status === "at-risk" ? "warning" : "error",
                  size: "sm",
                  className: "mb-1"
                }
              ),
              /* @__PURE__ */ jsxs29("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs29(Text, { variant: "caption", className: "text-text-tertiary", children: [
                  "\u76EE\u6807: ",
                  formatValue({ ...value, current: goal.target })
                ] }),
                goal.deadline && /* @__PURE__ */ jsx35(Text, { variant: "caption", className: "text-text-tertiary", children: goal.deadline.toLocaleDateString("zh-CN") })
              ] })
            ] }),
            showAlerts && alert && /* @__PURE__ */ jsxs29("div", { className: cn(
              "flex items-start space-x-2 p-2 rounded text-xs",
              alert.level === "error" && "bg-status-error/10 text-status-error",
              alert.level === "warning" && "bg-status-warning/10 text-status-warning",
              alert.level === "info" && "bg-status-info/10 text-status-info"
            ), children: [
              /* @__PURE__ */ jsx35(AlertTriangle6, { className: "h-3 w-3 mt-0.5 flex-shrink-0" }),
              /* @__PURE__ */ jsx35(Text, { variant: "caption", children: alert.message })
            ] }),
            lastUpdated && /* @__PURE__ */ jsx35("div", { className: "absolute bottom-2 right-2", children: /* @__PURE__ */ jsx35(Text, { variant: "caption", className: "text-text-tertiary text-xs", children: lastUpdated.toLocaleTimeString("zh-CN") }) })
          ]
        },
        id
      );
    };
    const getGridStyle = () => {
      if (layout !== "grid" && layout !== "compact" && layout !== "dashboard") return {};
      return {
        gridTemplateColumns: `repeat(${Math.min(columns, metrics.length)}, 1fr)`
      };
    };
    if (loading) {
      return /* @__PURE__ */ jsx35("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxs29("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsx35("div", { className: "animate-spin rounded-full h-6 w-6 border-b-2 border-primary-primary" }),
        /* @__PURE__ */ jsx35(Text, { variant: "caption", children: "\u52A0\u8F7D\u6307\u6807\u6570\u636E..." })
      ] }) });
    }
    if (!metrics || metrics.length === 0) {
      return /* @__PURE__ */ jsxs29("div", { className: "flex flex-col items-center justify-center py-12 text-center", children: [
        /* @__PURE__ */ jsx35(Target, { className: "h-12 w-12 text-text-secondary mb-4" }),
        /* @__PURE__ */ jsx35(Heading, { level: "h3", className: "text-lg font-medium mb-2", children: "\u6682\u65E0\u6307\u6807" }),
        /* @__PURE__ */ jsx35(Text, { variant: "caption", className: "text-text-secondary", children: emptyMessage })
      ] });
    }
    return /* @__PURE__ */ jsx35(
      "div",
      {
        ref,
        className: cn(metricsVariants({ layout, size }), className),
        style: getGridStyle(),
        ...props,
        children: metrics.map(
          (metric) => renderMetric ? renderMetric(metric) : renderMetricCard(metric)
        )
      }
    );
  }
);
Metrics.displayName = "Metrics";
var calculateTrend = (current, previous) => {
  const change = current - previous;
  const changePercent = previous !== 0 ? change / previous * 100 : 0;
  return {
    direction: change > 0 ? "up" : change < 0 ? "down" : "stable",
    change,
    changePercent,
    period: "\u4E0E\u4E0A\u671F\u76F8\u6BD4",
    isPositive: change >= 0
  };
};
var calculateGoalProgress = (current, target) => {
  return Math.min(current / target * 100, 100);
};
var determineGoalStatus = (progress, deadline) => {
  if (progress >= 100) return "achieved";
  if (progress >= 80) return "on-track";
  if (progress >= 60) return "at-risk";
  return "behind";
};
var createMetricAlert = (metric, thresholds) => {
  const value = metric.value.current;
  if (value >= thresholds.error) {
    return {
      level: "error",
      message: `${metric.name}\u5DF2\u8D85\u8FC7\u9519\u8BEF\u9608\u503C ${thresholds.error}`,
      threshold: thresholds.error
    };
  }
  if (value >= thresholds.warning) {
    return {
      level: "warning",
      message: `${metric.name}\u63A5\u8FD1\u8B66\u544A\u9608\u503C ${thresholds.warning}`,
      threshold: thresholds.warning
    };
  }
  return void 0;
};
export {
  Avatar,
  Badge,
  Button,
  ButtonGroup,
  Card,
  Chart,
  Checkbox,
  Dashboard,
  DataTable,
  Dialog,
  Divider,
  Dropdown,
  FormField,
  Heading,
  IconButton,
  Input,
  Label,
  Link,
  LoginForm,
  MFAFlow,
  Metrics,
  Notification,
  PermissionGuard,
  Progress,
  Radio,
  RealtimeMonitor,
  SearchInput,
  SecurityIndicator,
  Select,
  SessionManager,
  Spinner,
  Switch,
  Text,
  Textarea,
  Tooltip,
  animations,
  calculateGoalProgress,
  calculateSecurityScore,
  calculateTrend,
  cn,
  createContext,
  createMetricAlert,
  determineGoalStatus,
  determineSecurityLevel,
  disabledStyles,
  focusRing,
  formatClassNames,
  getContrastColor,
  intents,
  sizes,
  usePermissions,
  withPermissionGuard
};
