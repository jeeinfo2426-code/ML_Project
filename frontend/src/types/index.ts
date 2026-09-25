export interface PatientMetrics {
  age: number | '';
  gender: string;
  height: number | '';
  weight: number | '';
  ap_hi: number | '';
  ap_lo: number | '';
  cholesterol: string;
  gluc: string;
  smoke: boolean;
  alco: boolean;
  active: boolean;
}

export interface PredictionPayload {
  age: number;
  gender: number;
  height: number;
  weight: number;
  ap_hi: number;
  ap_lo: number;
  cholesterol: number;
  gluc: number;
  smoke: number;
  alco: number;
  active: number;
}

export interface PredictionResult {
  risk: boolean;
  probability?: number;
}
