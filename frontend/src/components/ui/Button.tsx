import type { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isLoading = false,
  loadingText,
  variant = 'primary',
  className,
  disabled,
  ...props
}) => {
  const base = "inline-flex items-center justify-center gap-2 font-semibold text-[15px] rounded-lg outline-none transition-colors duration-150 min-h-[48px] focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-midnight disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "w-full bg-signal text-white hover:bg-signal-hover active:bg-[#2e6ad4] px-6",
    secondary: "bg-steel text-text-bright hover:bg-[#333a4d] border border-border px-5",
  };

  return (
    <button
      className={cn(base, variants[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin" size={16} strokeWidth={2.5} />
          {loadingText && <span>{loadingText}</span>}
        </>
      ) : (
        children
      )}
    </button>
  );
};
