import React from 'react';
import { AlertCircle, RefreshCw, Download } from 'lucide-react';
import { Button } from '../ui/Button';
import { jsPDF } from 'jspdf';
import type { PredictionPayload } from '../../types';

interface ResultPanelProps {
  hasRisk: boolean | null;
  probability: number | null;
  payload: PredictionPayload | null;
  error: string | null;
  onReset: () => void;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({ hasRisk, probability, payload, error, onReset }) => {
  if (hasRisk === null && !error) return null;

  const isError = !!error;
  
  const riskColor = isError 
    ? 'text-caution' 
    : hasRisk 
      ? 'text-pulse' 
      : 'text-clearance';

  const statusLabel = isError
    ? 'Analysis failed'
    : hasRisk
      ? 'Elevated risk'
      : 'Lower risk';

  const statusDetail = isError
    ? 'Something went wrong while processing your request. Check that the prediction service is running and try again.'
    : hasRisk
      ? 'The model identified factors associated with increased cardiovascular risk. Discuss these results with a healthcare professional.'
      : 'The model did not identify high-risk patterns based on the data you provided. Maintaining a healthy lifestyle remains important.';

  const getRecommendations = () => {
    if (!payload) return [];
    const items: string[] = [];
    if (payload.smoke) items.push('Quitting smoking significantly reduces cardiovascular risk.');
    if (payload.alco) items.push('Reducing alcohol consumption lowers strain on the cardiovascular system.');
    if (!payload.active) items.push('150 minutes of moderate aerobic activity per week is recommended.');
    if (payload.ap_hi >= 130) items.push('High blood pressure detected — a lower-sodium diet may help.');
    if (payload.cholesterol >= 2) items.push('Elevated cholesterol — consider a diet low in saturated fats.');
    
    if (items.length < 2) {
      items.push('Continue with a balanced diet and regular physical activity.');
      items.push('Schedule routine check-ups with your physician.');
    }
    return items;
  };

  const recommendations = getRecommendations();

  const handleDownloadReport = () => {
    const doc = new jsPDF();
    const pageWidth = 210;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    // Header bar
    doc.setFillColor(10, 14, 26);
    doc.rect(0, 0, pageWidth, 35, 'F');
    doc.setFillColor(79, 140, 255);
    doc.rect(0, 35, pageWidth, 1.5, 'F');
    
    doc.setTextColor(232, 236, 244);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('CardioPredict', margin, 23);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(160, 174, 192);
    doc.text('Cardiovascular Risk Assessment Report', margin, 30);
    doc.text(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }), pageWidth - margin, 23, { align: 'right' });
    
    let y = 50;
    
    // Risk result — the one bold element
    doc.setFontSize(36);
    doc.setFont('helvetica', 'bold');
    if (hasRisk) {
      doc.setTextColor(232, 54, 79);
    } else {
      doc.setTextColor(34, 197, 128);
    }
    doc.text(`${probability ?? 'N/A'}%`, margin, y);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('in risk', margin + doc.getTextWidth(`${probability ?? 'N/A'}% `) + 2, y);
    
    y += 10;
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(10);
    doc.text(statusLabel, margin, y);
    
    // Divider
    y += 12;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageWidth - margin, y);
    
    // Patient data
    y += 14;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(10, 14, 26);
    doc.text('Patient data', margin, y);
    
    y += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    
    if (payload) {
      const fields = [
        [`Age: ${payload.age} years`, `Sex: ${payload.gender === 1 ? 'Female' : 'Male'}`],
        [`Height: ${payload.height} cm`, `Weight: ${payload.weight} kg`],
        [`Blood pressure: ${payload.ap_hi}/${payload.ap_lo} mmHg`, `Cholesterol: ${payload.cholesterol === 1 ? 'Normal' : payload.cholesterol === 2 ? 'Above normal' : 'Well above normal'}`],
        [`Glucose: ${payload.gluc === 1 ? 'Normal' : payload.gluc === 2 ? 'Above normal' : 'Well above normal'}`, `Smoker: ${payload.smoke ? 'Yes' : 'No'}`],
        [`Alcohol: ${payload.alco ? 'Yes' : 'No'}`, `Physically active: ${payload.active ? 'Yes' : 'No'}`],
      ];
      
      fields.forEach(([left, right]) => {
        doc.text(left, margin, y);
        doc.text(right, margin + contentWidth / 2, y);
        y += 8;
      });
    }
    
    // Divider
    y += 6;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageWidth - margin, y);
    
    // Recommendations
    y += 14;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(10, 14, 26);
    doc.text('Recommendations', margin, y);
    
    y += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    
    recommendations.forEach((item) => {
      const lines = doc.splitTextToSize(`—  ${item}`, contentWidth);
      doc.text(lines, margin, y);
      y += lines.length * 6 + 3;
    });
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('This report is generated by an ML model and does not constitute medical diagnosis.', margin, 280);
    doc.text('Consult a qualified healthcare professional regarding these results.', margin, 285);

    doc.save('cardiopredict-report.pdf');
  };

  return (
    <div className="bg-slate border border-border rounded-xl shadow-card">
      <div className="p-8 sm:p-5">
        
        {/* Error state */}
        {isError && (
          <div className="flex items-start gap-3 mb-6">
            <AlertCircle size={20} className="text-caution shrink-0 mt-0.5" />
            <div>
              <p className="text-[15px] font-semibold text-text-bright mb-1">{statusLabel}</p>
              <p className="text-[14px] text-text-secondary leading-relaxed">{statusDetail}</p>
            </div>
          </div>
        )}

        {/* Success state */}
        {!isError && (
          <>
            {/* The one bold element: the percentage */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className={`text-[64px] font-bold leading-none tracking-[-0.03em] tabular-nums ${riskColor}`}>
                  {probability !== null ? probability : (hasRisk ? '—' : '—')}%
                </span>
                <span className="text-[20px] font-medium text-text-muted">in risk</span>
              </div>
            </div>
            
            <p className="text-[15px] font-semibold text-text-bright mb-1">{statusLabel}</p>
            <p className="text-[14px] text-text-secondary leading-relaxed mb-8 max-w-[540px]">{statusDetail}</p>

            {recommendations.length > 0 && (
              <div className="mb-8">
                <p className="text-[13px] font-semibold text-text-secondary mb-3">Recommendations</p>
                <ul className="space-y-2">
                  {recommendations.map((item, idx) => (
                    <li key={idx} className="text-[14px] text-text-secondary leading-relaxed flex items-start gap-2">
                      <span className="text-signal mt-1 shrink-0">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        <div className="flex gap-3 sm:flex-col">
          {!isError && (
            <Button variant="primary" onClick={handleDownloadReport} className="flex-1">
              <Download size={16} />
              Download report
            </Button>
          )}
          <Button variant="secondary" onClick={onReset} className={isError ? "flex-1" : ""}>
            <RefreshCw size={14} />
            New assessment
          </Button>
        </div>

        <p className="text-[12px] text-text-muted leading-relaxed mt-6 max-w-[480px]">
          This is an ML-generated risk estimate. It is not a medical diagnosis. Consult a qualified healthcare professional.
        </p>
      </div>
    </div>
  );
};
