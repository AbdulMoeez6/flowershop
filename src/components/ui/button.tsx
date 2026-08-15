import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "accent" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]",
          {
            "bg-primary text-primary-foreground shadow-md hover:bg-gold hover:text-gold-foreground hover:shadow-lg": variant === "default",
            "border border-primary text-primary shadow-sm hover:bg-primary hover:text-primary-foreground": variant === "secondary",
            "bg-gold text-gold-foreground shadow-md hover:bg-primary hover:text-primary-foreground hover:shadow-lg": variant === "accent",
            "border border-border bg-background shadow-sm hover:bg-muted hover:text-muted-foreground": variant === "outline",
            "hover:bg-muted/80 hover:text-foreground": variant === "ghost",
            "text-primary underline-offset-4 hover:underline": variant === "link",
            "bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90": variant === "destructive",
            "h-10 px-5 py-2": size === "default",
            "h-8 rounded-md px-3 text-xs": size === "sm",
            "h-12 rounded-lg px-8 text-base": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
