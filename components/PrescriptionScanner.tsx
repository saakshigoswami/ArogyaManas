
import React, { useState, useRef } from 'react';
import { PrescriptionItem, ScannedPrescription } from '../types';
import { GeminiService, ScanResult } from '../services/geminiService';
import { 
  X, 
  Upload, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  Pill, 
  Edit3, 
  ShieldCheck, 
  FileText,
  Search,
  Eye,
  BrainCircuit,
  Building2,
  Stethoscope,
  Calendar,
  Activity,
  Heart
} from 'lucide-react';

interface PrescriptionScannerProps {
  onComplete: (prescription: ScannedPrescription) => void;
  onCancel: () => void;
}

const PrescriptionScanner: React.FC<PrescriptionScannerProps> = ({ onComplete, onCancel }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'review'>('idle');
  const [step, setStep] = useState<'ocr' | 'parsing'>('ocr');
  const [scannedData, setScannedData] = useState<ScanResult | null>(null);
  
  // Metadata fields
  const [rxDate, setRxDate] = useState('');
  const [hospital, setHospital] = useState('');
  const [doctor, setDoctor] = useState('');
  const [dept, setDept] = useState('');
  const [diag, setDiag] = useState('');
  
  const [editedItems, setEditedItems] = useState<PrescriptionItem[]>([]);
  const [isVerified, setIsVerified] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const processPrescription = async () => {
    if (!preview) return;
    setStatus('processing');
    setStep('ocr');
    
    try {
      const gemini = new GeminiService();
      const base64Data = preview.split(',')[1];
      const result = await gemini.scanPrescription(base64Data);
      
      setScannedData(result);
      setRxDate(result.prescriptionDate || new Date().toISOString().split('T')[0]);
      setHospital(result.hospitalName || '');
      setDoctor(result.doctorName || '');
      setDept(result.department || '');
      setDiag(result.diagnosis || '');
      setEditedItems(result.items);
      setStatus('review');
    } catch (error) {
      alert("Digitization failed. Please check image quality and try again.");
      setStatus('idle');
    }
  };

  const handleItemChange = (index: number, field: keyof PrescriptionItem, value: string) => {
    const updated = [...editedItems];
    updated[index] = { ...updated[index], [field]: value };
    setEditedItems(updated);
  };

  const handleFinalize = () => {
    if (!preview || !scannedData) return;
    
    const finalized: ScannedPrescription = {
      id: `rx-${Date.now()}`,
      date: rxDate,
      hospitalName: hospital,
      doctorName: doctor,
      department: dept,
      diagnosis: diag,
      imageUrl: preview,
      rawText: scannedData.rawText,
      items: editedItems,
      verifiedBy: "Dr. Aditi Rao",
      verifiedAt: new Date().toISOString()
    };
    
    onComplete(finalized);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 flex flex-col ${
        status === 'review' ? 'max-w-7xl w-full h-[95vh]' : 'max-w-xl w-full'
      }`}>
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center">
              <ShieldCheck className="w-5 h-5 mr-3 text-indigo-600" />
              Prescription Digitization Portal
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">AI-powered medical transcription with doctor oversight.</p>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-slate-200 rounded-full transition text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {status === 'idle' && (
            <div className="p-12 flex flex-col items-center text-center">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-64 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group"
              >
                {preview ? (
                  <img src={preview} className="h-full w-full object-contain rounded-2xl p-4" alt="Preview" />
                ) : (
                  <>
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-slate-400 group-hover:text-indigo-600" />
                    </div>
                    <p className="font-bold text-slate-700">Click to upload prescription</p>
                    <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, PDF</p>
                  </>
                )}
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              
              <button
                disabled={!preview}
                onClick={processPrescription}
                className="mt-8 w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 disabled:bg-slate-200 disabled:cursor-not-allowed transition shadow-xl shadow-indigo-100"
              >
                Initialize AI Scan
              </button>
            </div>
          )}

          {status === 'processing' && (
            <div className="p-20 flex flex-col items-center justify-center text-center">
              <div className="relative mb-10">
                <div className="w-24 h-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                <BrainCircuit className="w-8 h-8 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {step === 'ocr' ? 'Performing Neural OCR...' : 'Structuring Medical Context...'}
              </h3>
              <p className="text-sm text-slate-500 max-w-xs">Our vision models are deciphering handwriting and identifying chemical signatures.</p>
            </div>
          )}

          {status === 'review' && (
            <div className="flex flex-1 overflow-hidden">
              {/* Left: Original Scan */}
              <div className="w-1/2 bg-slate-900 flex flex-col border-r border-slate-800">
                <div className="p-4 bg-slate-800/50 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Original Prescription Source</span>
                  <div className="flex space-x-2">
                    <button className="p-1.5 hover:bg-slate-700 rounded text-slate-400"><Search className="w-4 h-4" /></button>
                    <button className="p-1.5 hover:bg-slate-700 rounded text-slate-400"><Eye className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
                  <img src={preview!} className="max-w-full shadow-2xl rounded-lg" alt="Prescription Scan" />
                </div>
              </div>

              {/* Right: Structured Data Review */}
              <div className="w-1/2 bg-white overflow-y-auto p-8 space-y-8">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                    Doctor Validation Workspace
                  </h3>
                  <div className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> AI Review Complete
                  </div>
                </div>

                {/* Metadata Section */}
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                     <Edit3 className="w-3 h-3 mr-2" /> Document Metadata
                   </h4>
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1 flex items-center">
                         <Calendar className="w-3 h-3 mr-1" /> Date
                       </label>
                       <input 
                         type="date"
                         value={rxDate}
                         onChange={(e) => setRxDate(e.target.value)}
                         className="w-full p-2 bg-white rounded-lg border border-slate-200 text-sm font-bold text-slate-700"
                       />
                     </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1 flex items-center">
                         <Building2 className="w-3 h-3 mr-1" /> Hospital / Clinic
                       </label>
                       <input 
                         value={hospital}
                         onChange={(e) => setHospital(e.target.value)}
                         className="w-full p-2 bg-white rounded-lg border border-slate-200 text-sm font-bold text-slate-700"
                         placeholder="Hospital Name, City"
                       />
                     </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1 flex items-center">
                         <Stethoscope className="w-3 h-3 mr-1" /> Prescribing Doctor
                       </label>
                       <input 
                         value={doctor}
                         onChange={(e) => setDoctor(e.target.value)}
                         className="w-full p-2 bg-white rounded-lg border border-slate-200 text-sm font-bold text-slate-700"
                         placeholder="Dr. Name"
                       />
                     </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1 flex items-center">
                         <Activity className="w-3 h-3 mr-1" /> Department
                       </label>
                       <input 
                         value={dept}
                         onChange={(e) => setDept(e.target.value)}
                         className="w-full p-2 bg-white rounded-lg border border-slate-200 text-sm font-bold text-slate-700"
                         placeholder="e.g. Psychiatry"
                       />
                     </div>
                   </div>
                   <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1 flex items-center">
                       <Heart className="w-3 h-3 mr-1" /> Diagnosis on Slip
                     </label>
                     <input 
                       value={diag}
                       onChange={(e) => setDiag(e.target.value)}
                       className="w-full p-2 bg-white rounded-lg border border-slate-200 text-sm font-bold text-slate-700"
                       placeholder="Provisional Diagnosis"
                     />
                   </div>
                </div>

                {/* Medications List */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                    <Pill className="w-3 h-3 mr-2" /> Extracted Medications
                  </h4>
                  {editedItems.map((item, idx) => (
                    <div key={idx} className="p-6 bg-white rounded-2xl border border-slate-100 group hover:border-indigo-200 transition shadow-sm">
                      <div className="flex justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                            <Pill className="w-4 h-4 text-white" />
                          </div>
                          <input 
                            value={item.name}
                            onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                            className="text-lg font-bold text-slate-800 bg-transparent border-b border-transparent focus:border-indigo-300 focus:outline-none"
                          />
                        </div>
                        {item.confidence !== 'high' && (
                          <div className="flex items-center text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded h-fit">
                            <AlertTriangle className="w-3 h-3 mr-1" /> Verify Legibility
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Dosage</label>
                          <input value={item.dosage} onChange={(e) => handleItemChange(idx, 'dosage', e.target.value)} className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 text-sm font-bold text-slate-700" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Frequency</label>
                          <input value={item.frequency} onChange={(e) => handleItemChange(idx, 'frequency', e.target.value)} className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 text-sm font-bold text-slate-700" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Duration</label>
                          <input value={item.duration} onChange={(e) => handleItemChange(idx, 'duration', e.target.value)} className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 text-sm font-bold text-slate-700" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                  <label className="flex items-start cursor-pointer">
                    <input type="checkbox" className="mt-1 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" checked={isVerified} onChange={(e) => setIsVerified(e.target.checked)} />
                    <div className="ml-4">
                      <p className="text-sm font-bold text-indigo-900">Final Verification Affirmation</p>
                      <p className="text-xs text-indigo-700 mt-1 leading-relaxed">I confirm that I have reviewed the digitised output against the original scan and affirm its clinical accuracy for the patient's longitudinal record.</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {status === 'review' && (
          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Reviewing {editedItems.length} Medications & Metadata</span>
            <div className="flex space-x-3">
              <button onClick={() => setStatus('idle')} className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition text-sm">Retake Scan</button>
              <button disabled={!isVerified} onClick={handleFinalize} className="px-10 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition disabled:bg-slate-300 shadow-xl shadow-indigo-100 flex items-center text-sm">Commit to Clinical History</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionScanner;
