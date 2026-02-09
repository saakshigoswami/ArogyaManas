
import React, { useState } from 'react';
import { Assessment } from '../types';
import { TEST_TEMPLATES } from '../testTemplates';
import { ChevronLeft, CheckCircle2, AlertCircle, Info, BrainCircuit } from 'lucide-react';

interface TestAdministrationProps {
  testType: 'PHQ-9' | 'GAD-7';
  onComplete: (assessment: Assessment) => void;
  onCancel: () => void;
}

const TestAdministration: React.FC<TestAdministrationProps> = ({ testType, onComplete, onCancel }) => {
  const template = TEST_TEMPLATES[testType];
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResponseChange = (questionIndex: number, value: number) => {
    setResponses(prev => ({ ...prev, [questionIndex]: value }));
  };

  const isComplete = Object.keys(responses).length === template.questions.length;

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Explicitly cast Object.values to number[] to resolve 'unknown' type inference in the reducer.
    const score = (Object.values(responses) as number[]).reduce((sum: number, val: number) => sum + val, 0);
    const assessment: Assessment = {
      type: testType,
      score,
      responses,
      date: new Date().toISOString().split('T')[0],
      severity: template.getSeverity(score)
    };
    
    // Parent handles interpretation via Gemini
    onComplete(assessment);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-100 clinical-shadow overflow-hidden mb-12">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center space-x-4">
          <button onClick={onCancel} className="p-2 hover:bg-slate-200 rounded-full transition text-slate-400">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{template.name} Administration</h2>
            <p className="text-xs text-slate-500 font-medium">Clinician-guided assessment for psychological monitoring.</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-indigo-600 font-bold text-sm bg-indigo-50 px-3 py-1 rounded-full">
          <span>{Object.keys(responses).length} / {template.questions.length} Items</span>
        </div>
      </div>

      {/* Questions */}
      <div className="p-8 space-y-10 max-h-[65vh] overflow-y-auto">
        <div className="bg-indigo-50 p-5 rounded-xl flex items-start space-x-4 text-indigo-700 text-sm border border-indigo-100">
          <Info className="w-5 h-5 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="font-bold">Instructions to Patient:</p>
            <p className="leading-relaxed font-medium">Over the <b>last 2 weeks</b>, how often have you been bothered by any of the following problems? Please respond honestly for accurate clinical monitoring.</p>
          </div>
        </div>

        {template.questions.map((question, idx) => (
          <div key={idx} className="space-y-4 pb-8 border-b border-slate-50 last:border-0">
            <p className="text-slate-800 font-semibold leading-relaxed">
              <span className="text-slate-400 font-bold mr-3">{idx + 1}.</span>
              {question}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {template.scale.map((option, val) => (
                <button
                  key={val}
                  onClick={() => handleResponseChange(idx, val)}
                  className={`px-4 py-4 rounded-xl text-xs font-bold transition border-2 text-center flex flex-col items-center justify-center ${
                    responses[idx] === val 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                      : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200'
                  }`}
                >
                  <span className={`text-[10px] mb-1 font-black ${responses[idx] === val ? 'text-indigo-200' : 'text-slate-300'}`}>{val}</span>
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
        {!isComplete ? (
          <div className="flex items-center text-amber-600 text-xs font-bold uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 mr-2" />
            Incomplete: {template.questions.length - Object.keys(responses).length} items remaining
          </div>
        ) : (
          <div className="flex items-center text-emerald-600 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Validation Passed
          </div>
        )}
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition text-sm"
          >
            Discard
          </button>
          <button
            disabled={!isComplete || isSubmitting}
            onClick={handleSubmit}
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed shadow-xl shadow-indigo-100 flex items-center text-sm"
          >
            {isSubmitting ? (
              <>
                <BrainCircuit className="w-4 h-4 mr-2 animate-pulse" />
                Interpreting...
              </>
            ) : (
              'Submit Assessment'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestAdministration;
