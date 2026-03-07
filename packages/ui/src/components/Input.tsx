import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, id, ...props }) => {
    return (
        <div data-component="input-field">
            {label && <label htmlFor={id}>{label}</label>}
            <input id={id} aria-invalid={!!error} {...props} />
            {error && <span role="alert">{error}</span>}
        </div>
    );
};
