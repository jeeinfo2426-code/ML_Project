import { useState } from 'react';
import { Activity, Droplet, Wind, ArrowRight } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { ToggleCard } from '../ui/ToggleCard';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { BmiInsight } from './BmiInsight';
import type { PatientMetrics, PredictionPayload } from '../../types';

interface AssessmentFormProps {
  onSubmit: (payload: PredictionPayload) => void;
  isLoading: boolean;
}

const INITIAL_STATE: PatientMetrics = {
  age: '',
  gender: '',
  height: '',
  weight: '',
  ap_hi: '',
  ap_lo: '',
  cholesterol: '',
  gluc: '',
  smoke: false,
  alco: false,
  active: true,
};

export const AssessmentForm: React.FC<AssessmentFormProps> = ({ onSubmit, isLoading }) => {
  const [metrics, setMetrics] = useState<PatientMetrics>(INITIAL_STATE);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Calculate progress
  const completedFields = Object.entries(metrics).filter(([key, value]) => {
    if (key === 'smoke' || key === 'alco' || key === 'active') return true;
    return value !== '';
  }).length;
  
  const handleInputChange = (field: keyof PatientMetrics, value: any) => {
    setMetrics(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field: keyof PatientMetrics) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, metrics[field]);
  };

  const validateField = (field: string, value: any) => {
    let error = '';
    
    if (value === '' || value === null) {
      if (!['smoke', 'alco', 'active'].includes(field)) {
        error = 'Required.';
      }
    } else {
      const num = Number(value);
      switch(field) {
        case 'age':
          if (num < 1 || num > 120) error = 'Between 1 and 120.';
          break;
        case 'height':
          if (num < 50 || num > 250) error = 'Between 50 and 250 cm.';
          break;
        case 'weight':
          if (num < 10 || num > 300) error = 'Between 10 and 300 kg.';
          break;
        case 'ap_hi':
          if (num < 50 || num > 250) error = 'Between 50 and 250 mmHg.';
          break;
        case 'ap_lo':
          if (num < 30 || num > 200) error = 'Between 30 and 200 mmHg.';
          break;
      }
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
    return error === '';
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    Object.keys(metrics).forEach(key => {
      if (!['smoke', 'alco', 'active'].includes(key)) {
        setTouched(prev => ({ ...prev, [key]: true }));
        const value = metrics[key as keyof PatientMetrics];
        
        let error = '';
        if (value === '') {
          error = 'Required.';
        } else {
          const num = Number(value);
          switch(key) {
            case 'age':
              if (num < 1 || num > 120) error = 'Between 1 and 120.';
              break;
            case 'height':
              if (num < 50 || num > 250) error = 'Between 50 and 250 cm.';
              break;
            case 'weight':
              if (num < 10 || num > 300) error = 'Between 10 and 300 kg.';
              break;
            case 'ap_hi':
              if (num < 50 || num > 250) error = 'Between 50 and 250 mmHg.';
              break;
            case 'ap_lo':
              if (num < 30 || num > 200) error = 'Between 30 and 200 mmHg.';
              break;
          }
        }
        
        if (error) {
          isValid = false;
          newErrors[key] = error;
        }
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const payload: PredictionPayload = {
        age: Number(metrics.age),
        gender: Number(metrics.gender),
        height: Number(metrics.height),
        weight: Number(metrics.weight),
        ap_hi: Number(metrics.ap_hi),
        ap_lo: Number(metrics.ap_lo),
        cholesterol: Number(metrics.cholesterol),
        gluc: Number(metrics.gluc),
        smoke: metrics.smoke ? 1 : 0,
        alco: metrics.alco ? 1 : 0,
        active: metrics.active ? 1 : 0,
      };
      onSubmit(payload);
    }
  };

  return (
    <section aria-labelledby="form-section-heading">
      <h2 id="form-section-heading" className="sr-only">Patient assessment form</h2>
      
      <ProgressBar current={completedFields} total={11} />
      
      <form 
        className="bg-slate border border-border rounded-xl shadow-card"
        onSubmit={handleSubmit}
        noValidate
        autoComplete="off"
      >
        {/* Personal details */}
        <div className="p-6 sm:p-4">
          <p className="text-[13px] font-semibold text-text-secondary mb-5">Personal details</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-4">
            <Input 
              id="age"
              label="Age"
              type="number"
              unit="yrs"
              placeholder="45"
              value={metrics.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              onBlur={() => handleBlur('age')}
              error={touched.age ? errors.age : undefined}
              isValid={touched.age && !errors.age && metrics.age !== ''}
            />
            
            <Select 
              id="gender"
              label="Biological sex"
              value={metrics.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              onBlur={() => handleBlur('gender')}
              error={touched.gender ? errors.gender : undefined}
              options={[
                { value: '1', label: 'Female' },
                { value: '2', label: 'Male' }
              ]}
            />
            
            <Input 
              id="height"
              label="Height"
              type="number"
              unit="cm"
              placeholder="170"
              value={metrics.height}
              onChange={(e) => handleInputChange('height', e.target.value)}
              onBlur={() => handleBlur('height')}
              error={touched.height ? errors.height : undefined}
              isValid={touched.height && !errors.height && metrics.height !== ''}
            />
            
            <Input 
              id="weight"
              label="Weight"
              type="number"
              unit="kg"
              placeholder="70.5"
              step="0.1"
              value={metrics.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              onBlur={() => handleBlur('weight')}
              error={touched.weight ? errors.weight : undefined}
              isValid={touched.weight && !errors.weight && metrics.weight !== ''}
            />
          </div>
          
          <BmiInsight height={metrics.height} weight={metrics.weight} />
        </div>
        
        {/* Vitals */}
        <div className="px-6 pb-6 sm:px-4 sm:pb-4">
          <p className="text-[13px] font-semibold text-text-secondary mb-5">Vitals</p>
          
          <div className="flex sm:flex-col items-start gap-4">
            <div className="flex-1 w-full">
              <Input 
                id="ap_hi"
                label="Systolic"
                type="number"
                unit="mmHg"
                placeholder="120"
                hint="Upper reading"
                value={metrics.ap_hi}
                onChange={(e) => handleInputChange('ap_hi', e.target.value)}
                onBlur={() => handleBlur('ap_hi')}
                error={touched.ap_hi ? errors.ap_hi : undefined}
                isValid={touched.ap_hi && !errors.ap_hi && metrics.ap_hi !== ''}
              />
            </div>
            
            <div className="text-xl font-light text-text-muted mt-7 sm:hidden shrink-0" aria-hidden="true">/</div>
            
            <div className="flex-1 w-full">
              <Input 
                id="ap_lo"
                label="Diastolic"
                type="number"
                unit="mmHg"
                placeholder="80"
                hint="Lower reading"
                value={metrics.ap_lo}
                onChange={(e) => handleInputChange('ap_lo', e.target.value)}
                onBlur={() => handleBlur('ap_lo')}
                error={touched.ap_lo ? errors.ap_lo : undefined}
                isValid={touched.ap_lo && !errors.ap_lo && metrics.ap_lo !== ''}
              />
            </div>
          </div>
        </div>
        
        {/* Blood work */}
        <div className="px-6 pb-6 sm:px-4 sm:pb-4">
          <p className="text-[13px] font-semibold text-text-secondary mb-5">Blood work</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-4">
            <Select 
              id="cholesterol"
              label="Cholesterol"
              value={metrics.cholesterol}
              onChange={(e) => handleInputChange('cholesterol', e.target.value)}
              onBlur={() => handleBlur('cholesterol')}
              error={touched.cholesterol ? errors.cholesterol : undefined}
              options={[
                { value: '1', label: 'Normal' },
                { value: '2', label: 'Above normal' },
                { value: '3', label: 'Well above normal' }
              ]}
            />
            
            <Select 
              id="gluc"
              label="Glucose"
              value={metrics.gluc}
              onChange={(e) => handleInputChange('gluc', e.target.value)}
              onBlur={() => handleBlur('gluc')}
              error={touched.gluc ? errors.gluc : undefined}
              options={[
                { value: '1', label: 'Normal' },
                { value: '2', label: 'Above normal' },
                { value: '3', label: 'Well above normal' }
              ]}
            />
          </div>
        </div>
        
        {/* Habits */}
        <div className="px-6 pb-6 sm:px-4 sm:pb-4">
          <p className="text-[13px] font-semibold text-text-secondary mb-5">Habits</p>
          
          <div className="grid gap-2.5" role="group" aria-label="Lifestyle factors">
            <ToggleCard 
              id="smoke"
              name="smoke"
              title="Smoking"
              description="Currently smokes tobacco"
              icon={<Wind size={18} />}
              checked={metrics.smoke}
              onChange={(e) => handleInputChange('smoke', e.target.checked)}
            />
            <ToggleCard 
              id="alco"
              name="alco"
              title="Alcohol"
              description="Regular alcohol consumption"
              icon={<Droplet size={18} />}
              checked={metrics.alco}
              onChange={(e) => handleInputChange('alco', e.target.checked)}
            />
            <ToggleCard 
              id="active"
              name="active"
              title="Physical activity"
              description="Exercises regularly"
              icon={<Activity size={18} />}
              checked={metrics.active}
              onChange={(e) => handleInputChange('active', e.target.checked)}
            />
          </div>
        </div>
        
        {/* Submit */}
        <div className="px-6 pb-5 sm:px-4 sm:pb-4">
          <Button type="submit" isLoading={isLoading} loadingText="Analyzing…">
            Run analysis
            <ArrowRight size={16} strokeWidth={2} />
          </Button>
        </div>
        
        <p className="px-6 pb-6 sm:px-4 sm:pb-4 text-[12px] text-text-muted leading-relaxed">
          This tool provides an ML-based risk estimate. It is not a diagnosis and does not replace professional medical advice.
        </p>
      </form>
    </section>
  );
};
