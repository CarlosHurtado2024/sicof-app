
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-bold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F28482]/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
    {
        variants: {
            variant: {
                default: "bg-[#2B463C] text-white hover:bg-[#1e3329] shadow-md shadow-[#2B463C]/10 hover:shadow-lg",
                destructive:
                    "bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/20",
                outline:
                    "border-2 border-[#2B463C]/15 bg-transparent hover:bg-[#2B463C]/5 text-[#2B463C]",
                secondary:
                    "bg-[#FDF4E3] text-[#2B463C] hover:bg-[#FBE8C6] border border-[#F5DEB3]/50",
                ghost: "hover:bg-[#2B463C]/5 text-[#2B463C]/70 hover:text-[#2B463C]",
                link: "text-[#F28482] underline-offset-4 hover:underline font-bold",
            },
            size: {
                default: "h-11 px-5 py-2",
                sm: "h-9 rounded-xl px-4 text-xs",
                lg: "h-13 rounded-2xl px-8 text-base",
                icon: "h-11 w-11 rounded-xl",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
