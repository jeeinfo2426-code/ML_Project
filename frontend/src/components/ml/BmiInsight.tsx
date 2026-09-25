import React from 'react';
import { cn } from '../../utils/cn';

interface BmiInsightProps {
  height: number | '';
  weight: number | '';
}

const BMI_CATEGORIES = [
  { max: 18.5, label: 'Underweight', cls: 'text-caution' },
  { max: 24.9, label: 'Normal',      cls: 'text-clearance' },
  { max: 29.9, label: 'Overweight',  cls: 'text-caution' },
  { max: Infinity, label: 'Obesity', cls: 'text-pulse' },
];

export const BmiInsight: React.FC<BmiInsightProps> = ({ height, weight }) => {
  if (!height || !weight || height <= 0 || weight <= 0) return null;

  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);

  if (!isFinite(bmi) || bmi < 5 || bmi > 80) return null;

  const category = BMI_CATEGORIES.find(c => bmi <= c.max) || BMI_CATEGORIES[BMI_CATEGORIES.length - 1];

  return (
    <div className="mt-3 flex items-baseline gap-3 text-[13px]">
      <span className="text-text-muted">BMI</span>
      <span className="font-semibold text-text-bright tabular-nums">{bmi.toFixed(1)}</span>
      <span className={cn("font-medium", category.cls)}>{category.label}</span>
    </div>
  );
};
