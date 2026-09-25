import React from 'react';
import { cn } from '../../utils/cn';

interface ToggleCardProps {
  id: string;
  name: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ToggleCard: React.FC<ToggleCardProps> = ({
  id,
  name,
  icon,
  title,
  description,
  checked,
  onChange,
}) => {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-center gap-3.5 py-3 px-4 rounded-lg border cursor-pointer transition-colors duration-150",
        checked 
          ? "border-signal bg-signal-muted" 
          : "border-border bg-steel hover:border-text-muted"
      )}
    >
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className="absolute opacity-0 w-0 h-0"
        role="switch"
        aria-checked={checked}
      />
      
      <div 
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-md shrink-0 transition-colors duration-150",
          checked ? "text-signal" : "text-text-muted"
        )}
        aria-hidden="true"
      >
        {icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <span className="block text-[14px] font-medium text-text-bright leading-tight">
          {title}
        </span>
        <span className="block text-[12px] text-text-muted leading-snug mt-0.5">
          {description}
        </span>
      </div>
      
      <div className="shrink-0" aria-hidden="true">
        <div 
          className={cn(
            "w-9 h-5 rounded-full relative transition-colors duration-150",
            checked ? "bg-signal" : "bg-[#3a4050]"
          )}
        >
          <div 
            className={cn(
              "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-150",
              checked ? "translate-x-4" : ""
            )}
          />
        </div>
      </div>
    </label>
  );
};
