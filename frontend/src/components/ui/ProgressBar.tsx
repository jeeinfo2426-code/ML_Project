import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="mb-8" aria-label="Form completion progress">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-[13px] font-medium text-text-secondary">Progress</span>
        <span className="text-[13px] font-medium text-text-muted tabular-nums" aria-live="polite">
          {current}/{total}
        </span>
      </div>
      <div 
        className="h-[3px] bg-border rounded-full overflow-hidden"
        role="progressbar" 
        aria-valuenow={percentage} 
        aria-valuemin={0} 
        aria-valuemax={100}
      >
        <div 
          className="h-full bg-signal rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
