import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  unit?: string;
  hint?: string;
  error?: string;
  isValid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, unit, hint, error, isValid, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        <label 
          htmlFor={id} 
          className="text-[13px] font-medium text-text-secondary"
        >
          {label}
        </label>
        
        <div className="relative flex items-center">
          <input
            id={id}
            ref={ref}
            className={cn(
              "w-full min-h-[44px] py-2.5 px-3.5 bg-steel border rounded-lg text-text-bright text-[15px] outline-none transition-all duration-150 appearance-none",
              unit ? "pr-12" : "",
              error 
                ? "border-pulse shadow-input-error" 
                : isValid 
                  ? "border-clearance shadow-input-valid" 
                  : "border-border hover:border-text-muted focus:border-border-focus focus:shadow-input-focus",
              className
            )}
            style={{ MozAppearance: 'textfield' }}
            {...props}
          />
          {unit && (
            <span className="absolute right-3.5 text-[12px] font-medium text-text-muted pointer-events-none select-none">
              {unit}
            </span>
          )}
        </div>
        
        {hint && !error && (
          <span className="text-[12px] text-text-muted">{hint}</span>
        )}
        
        <span 
          className={cn(
            "text-[12px] font-medium text-pulse min-h-[1em] block transition-opacity duration-150",
            error ? "opacity-100" : "opacity-0"
          )}
          role="alert"
          aria-live="polite"
        >
          {error}
        </span>
      </div>
    );
  }
);

Input.displayName = 'Input';
