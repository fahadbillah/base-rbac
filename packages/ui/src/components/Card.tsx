import React from "react";

export interface CardProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className }) => {
    return (
        <div data-component="card" className={className}>
            {title && <h3>{title}</h3>}
            <div data-role="card-body">{children}</div>
        </div>
    );
};
