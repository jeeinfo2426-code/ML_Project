import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageLayout } from './components/layout/PageLayout';
import { AssessmentForm } from './components/ml/AssessmentForm';
import { ResultPanel } from './components/ml/ResultPanel';
import { predictRisk } from './services/predictionService';
import type { PredictionPayload } from './types';

function App() {
  const [view, setView] = useState<'form' | 'result'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [hasRisk, setHasRisk] = useState<boolean | null>(null);
  const [probability, setProbability] = useState<number | null>(null);
  const [payload, setPayload] = useState<PredictionPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async (payloadData: PredictionPayload) => {
    setIsLoading(true);
    setError(null);
    setPayload(payloadData);
    
    try {
      const result = await predictRisk(payloadData);
      console.log('[CardioPredict] Prediction result:', result);
      setHasRisk(result.risk);
      setProbability(result.probability ?? null);
      setView('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('[CardioPredict] Prediction error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setView('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setHasRisk(null);
    setProbability(null);
    setPayload(null);
    setError(null);
    setView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PageLayout>
      {view === 'form' && (
        <div className="mb-8">
          <h1 className="text-[clamp(1.625rem,3.5vw,2.25rem)] font-bold tracking-[-0.02em] leading-[1.2] text-text-bright mb-3">
            Your cardiovascular risk profile
          </h1>
          <p className="text-[15px] text-text-secondary leading-relaxed max-w-[480px]">
            Provide your health metrics for an ML-based risk estimate. No data is stored.
          </p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {view === 'form' ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AssessmentForm onSubmit={handlePredict} isLoading={isLoading} />
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ResultPanel hasRisk={hasRisk} probability={probability} payload={payload} error={error} onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}

export default App;
