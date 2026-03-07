import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = "primary",
    size = "md",
    loading = false,
    children,
    disabled,
    ...props
}) => {
    return (
        <button
            data-variant={variant}
            data-size={size}
            disabled={disabled || loading}
            aria-busy={loading}
            {...props}
        >
            {loading ? "Loading..." : children}
        </button>
    );
};
