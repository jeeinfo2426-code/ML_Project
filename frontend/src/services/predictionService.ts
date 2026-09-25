import type { PredictionPayload, PredictionResult } from '../types';


const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

export const predictRisk = async (payload: PredictionPayload): Promise<PredictionResult> => {
  const response = await fetch(`${API_URL}/predict`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Server error ${response.status}: ${text}`);
  }

  const data = await response.json();
  if (typeof data.risk === 'undefined') throw new Error('Unexpected response format.');
  
  // Normalize probability to a percentage (0–100).
  // The backend may return it as a decimal (0.0–1.0), as an integer (0–100), or not at all.
  let probability: number | undefined = data.probability;
  if (typeof probability === 'number') {
    if (probability >= 0 && probability <= 1) {
      // Decimal form → convert to percentage
      probability = Number((probability * 100).toFixed(1));
    }
    // If it's > 1, assume it's already a percentage and keep it as is.
  }
  
  return { risk: data.risk, probability };
};
