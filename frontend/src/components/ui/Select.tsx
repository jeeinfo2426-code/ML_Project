import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder = "Choose one", id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        <label 
          htmlFor={id} 
          className="text-[13px] font-medium text-text-secondary"
        >
          {label}
        </label>
        
        <div className="relative flex items-center cursor-pointer">
          <select
            id={id}
            ref={ref}
            className={cn(
              "w-full min-h-[44px] py-2.5 px-3.5 pr-10 bg-steel border rounded-lg text-text-bright text-[15px] outline-none transition-all duration-150 appearance-none cursor-pointer",
              error 
                ? "border-pulse shadow-input-error" 
                : "border-border hover:border-text-muted focus:border-border-focus focus:shadow-input-focus",
              className
            )}
            {...props}
          >
            <option value="" disabled className="bg-slate text-text-bright">
              {placeholder}
            </option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-slate text-text-bright">
                {opt.label}
              </option>
            ))}
          </select>
          
          <span className="absolute right-3 text-text-muted pointer-events-none flex items-center">
            <ChevronDown size={14} strokeWidth={2.5} />
          </span>
        </div>
        
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

Select.displayName = 'Select';
