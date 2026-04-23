import './checkout-warning.css';
import { LucideIcon } from 'lucide-react';

interface CheckoutWarningProps {
    icon: LucideIcon;
    title: string;
    text: string;
    variant?: 'danger' | 'alert';
}

export function CheckoutWarning({
    icon: Icon,
    title,
    text,
    variant = 'danger',
}: CheckoutWarningProps) {
    return (
        <div className={`checkout-warning checkout-warning--${variant}`}>
            <Icon size={18} />
            <div>
                <strong>{title}</strong>
                <p>{text}</p>
            </div>
        </div>
    );
}
