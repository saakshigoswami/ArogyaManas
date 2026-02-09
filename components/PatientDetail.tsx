
import React, { useState, useEffect, useMemo } from 'react';
import { Patient, Session, AIInsight, Assessment, ClinicalJourneyRecord, FamilyNode, ScannedPrescription, BiomarkerRecord, PrescribedMedication, ClinicalEncounter } from '../types';
import { MOCK_SESSIONS, MEDICATIONS_LIST, DIAGNOSES_LIST } from '../constants';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  Calendar, 
  ChevronRight, 
  Activity, 
  TrendingUp, 
  AlertCircle, 
  BrainCircuit, 
  Plus, 
  User,
  History,
  FileText,
  Pill,
  ClipboardCheck,
  ChevronDown,
  Building2,
  Stethoscope,
  ScanLine,
  Heart,
  Zap,
  Weight,
  Moon,
  FlaskConical,
  Scale,
  Thermometer,
  ArrowRightLeft,
  Clock,
  Layers,
  ChevronUp,
  Info,
  Network,
  Filter,
  ChevronLeft as ChevronLeftIcon,
  Maximize2,
  X,
  Printer,
  ShieldCheck,
  Dna,
  Stethoscope as StethoscopeIcon,
  Save,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import TestAdministration from './TestAdministration';
import PrescriptionScanner from './PrescriptionScanner';

interface PatientDetailProps {
  patient: Patient;
  onBack: () => void;
  onUpdatePatient?: (patient: Patient) => void;
}

const calculateAge = (dob: string) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const ClinicalEncounterForm: React.FC<{ patient: Patient; onFinalize: (encounter: ClinicalEncounter) => void }> = ({ patient, onFinalize }) => {
  const [encounter, setEncounter] = useState<ClinicalEncounter>(patient.currentEncounter || {
    primaryDiagnosis: '',
    secondaryDiagnosis: '',
    isConfirmed: false,
    medications: [],
    labTestsOrdered: false,
    supplementsPrescribed: false,
    therapyRecommended: '',
    doctorNotes: ''
  });

  const addMedication = () => {
    setEncounter({
      ...encounter,
      medications: [...encounter.medications, { name: MEDICATIONS_LIST[0], dosage: '', frequency: 'OD', duration: '', route: 'Oral', instructions: '' }]
    });
  };

  const removeMedication = (index: number) => {
    setEncounter({
      ...encounter,
      medications: encounter.medications.filter((_, i) => i !== index)
    });
  };

  const updateMedication = (index: number, field: keyof PrescribedMedication, value: string) => {
    const updatedMeds = [...encounter.medications];
    updatedMeds[index] = { ...updatedMeds[index], [field]: value };
    setEncounter({ ...encounter, medications: updatedMeds });
  };

  const inputClasses = "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-slate-800";
  const labelClasses = "block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1";

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Section A: Patient Overview (Read-only) */}
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <div className="border-b border-slate-50 pb-4 mb-6 flex justify-between items-center">
           <h3 className="text-sm font-bold text-slate-800 flex items-center">
             <Info className="w-4 h-4 mr-2 text-indigo-600" /> Section A: Patient Overview (Read-only)
           </h3>
           <div className="flex items-center space-x-2">
             <span className="text-[10px] font-black text-slate-400 uppercase">Assigned Doctor:</span>
             <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-black uppercase">
               {patient.assignedDoctor}
             </span>
           </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div>
            <p className={labelClasses}>Full Name</p>
            <p className="text-sm font-bold text-slate-800">{patient.name}</p>
          </div>
          <div>
            <p className={labelClasses}>Age</p>
            <p className="text-sm font-bold text-slate-800">{calculateAge(patient.dob)} Years</p>
          </div>
          <div>
            <p className={labelClasses}>Gender</p>
            <p className="text-sm font-bold text-slate-800">{patient.gender}</p>
          </div>
          <div>
            <p className={labelClasses}>Visit Type</p>
            <p className="text-sm font-bold text-slate-800">{patient.visitType}</p>
          </div>
          <div className="col-span-2">
            <p className={labelClasses}>Chief Complaint</p>
            <p className="text-sm font-bold text-slate-800 italic">"{patient.chiefComplaint}"</p>
          </div>
          {patient.abha && (patient.abha.abhaNumber || patient.abha.abhaAddress) && (
            <div className="col-span-full flex items-center gap-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div className="flex flex-wrap gap-x-6 gap-y-1">
                {patient.abha.abhaNumber && (
                  <span className="text-xs font-bold text-slate-700">ABHA Number: <span className="text-emerald-700">{patient.abha.abhaNumber}</span></span>
                )}
                {patient.abha.abhaAddress && (
                  <span className="text-xs font-bold text-slate-700">ABHA Address: <span className="text-emerald-700">{patient.abha.abhaAddress}</span></span>
                )}
                {patient.abha.linkedAt && (
                  <span className="text-[10px] text-slate-500">Linked {patient.abha.linkedAt}</span>
                )}
              </div>
            </div>
          )}
          <div className="col-span-full pt-4 border-t border-slate-50">
            <p className={labelClasses}>Receptionist Notes</p>
            <p className="text-sm text-slate-600">{patient.receptionNotes || "No administrative notes provided."}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Section B: Clinical Diagnosis */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 clinical-shadow">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center">
              <Heart className="w-4 h-4 mr-2 text-rose-500" /> Section B: Clinical Diagnosis
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Primary Diagnosis</label>
                <select 
                  className={inputClasses}
                  value={encounter.primaryDiagnosis}
                  onChange={(e) => setEncounter({...encounter, primaryDiagnosis: e.target.value})}
                >
                  <option value="">Select Primary Diagnosis...</option>
                  {DIAGNOSES_LIST.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClasses}>Secondary Diagnosis (Optional)</label>
                <select 
                  className={inputClasses}
                  value={encounter.secondaryDiagnosis}
                  onChange={(e) => setEncounter({...encounter, secondaryDiagnosis: e.target.value})}
                >
                  <option value="">None</option>
                  {DIAGNOSES_LIST.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="md:col-span-2 flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <label className="flex items-center cursor-pointer group">
                  <span className="text-xs font-bold text-slate-700 mr-4">Provisional</span>
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={encounter.isConfirmed}
                      onChange={(e) => setEncounter({...encounter, isConfirmed: e.target.checked})}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${encounter.isConfirmed ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${encounter.isConfirmed ? 'translate-x-4' : ''}`}></div>
                  </div>
                  <span className="ml-4 text-xs font-bold text-slate-700">Confirmed Diagnosis</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section C: Medication Prescription (Structured) */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 clinical-shadow">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                <Pill className="w-4 h-4 mr-2 text-indigo-600" /> Section C: Medication Prescription (Structured)
              </h4>
              <button onClick={addMedication} className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition font-bold text-xs">
                <Plus className="w-4 h-4 mr-1.5" /> Add Another Medicine
              </button>
            </div>
            
            {encounter.medications.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl">
                <Pill className="w-10 h-10 text-slate-100 mx-auto mb-3" />
                <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">No medications added to this encounter</p>
              </div>
            ) : (
              <div className="space-y-6">
                {encounter.medications.map((med, idx) => (
                  <div key={idx} className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 relative group animate-in slide-in-from-top-2 duration-300">
                    <button 
                      onClick={() => removeMedication(idx)} 
                      className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition"
                      title="Remove Medication"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <label className={labelClasses}>Medicine Name (Searchable)</label>
                        <select 
                          className={inputClasses}
                          value={med.name}
                          onChange={(e) => updateMedication(idx, 'name', e.target.value)}
                        >
                          {MEDICATIONS_LIST.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelClasses}>Dosage</label>
                        <input 
                          className={inputClasses} 
                          placeholder="e.g. 20mg / 1 tablet" 
                          value={med.dosage}
                          onChange={(e) => updateMedication(idx, 'dosage', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>Frequency</label>
                        <select 
                          className={inputClasses}
                          value={med.frequency}
                          onChange={(e) => updateMedication(idx, 'frequency', e.target.value as any)}
                        >
                          <option>OD</option><option>BD</option><option>TDS</option><option>HS</option><option>PRN</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClasses}>Duration</label>
                        <input 
                          className={inputClasses} 
                          placeholder="e.g. 15 Days" 
                          value={med.duration}
                          onChange={(e) => updateMedication(idx, 'duration', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>Route</label>
                        <select 
                          className={inputClasses}
                          value={med.route}
                          onChange={(e) => updateMedication(idx, 'route', e.target.value as any)}
                        >
                          <option>Oral</option><option>Injection</option><option>Topical</option><option>Other</option>
                        </select>
                      </div>
                      <div className="md:col-span-full">
                        <label className={labelClasses}>Special Instructions (Optional)</label>
                        <input 
                          className={inputClasses} 
                          placeholder="e.g. After meals, avoid alcohol..." 
                          value={med.instructions || ''}
                          onChange={(e) => updateMedication(idx, 'instructions', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Sections */}
        <div className="space-y-8">
          {/* Section D: Additional Orders */}
          <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl">
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6 flex items-center">
              <ClipboardCheck className="w-4 h-4 mr-2" /> Section D: Additional Orders
            </h4>
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer group">
                 <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-500" checked={encounter.labTestsOrdered} onChange={(e) => setEncounter({...encounter, labTestsOrdered: e.target.checked})} />
                 <span className="text-xs font-medium text-slate-300 group-hover:text-white">Lab Tests Ordered</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer group">
                 <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-500" checked={encounter.supplementsPrescribed} onChange={(e) => setEncounter({...encounter, supplementsPrescribed: e.target.checked})} />
                 <span className="text-xs font-medium text-slate-300 group-hover:text-white">Supplements Prescribed</span>
              </label>
              <div className="pt-4">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Therapy Recommended</label>
                 <select className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-indigo-500" value={encounter.therapyRecommended} onChange={(e) => setEncounter({...encounter, therapyRecommended: e.target.value})}>
                    <option value="">None</option>
                    <option>CBT (Cognitive Behavioral Therapy)</option>
                    <option>DBT (Dialectical Behavioral Therapy)</option>
                    <option>Psychodynamic Therapy</option>
                    <option>Counselling</option>
                 </select>
              </div>
            </div>
          </div>

          {/* Section E: Clinical Notes */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 clinical-shadow">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center">
              <Stethoscope className="w-4 h-4 mr-2 text-indigo-600" /> Section E: Clinical Notes (Doctor-only)
            </h4>
            <textarea 
              className={`${inputClasses} h-48 resize-none font-medium text-slate-700 leading-relaxed`}
              placeholder="Record observations, mental status exam, progress notes..."
              value={encounter.doctorNotes}
              onChange={(e) => setEncounter({...encounter, doctorNotes: e.target.value})}
            />
          </div>

          <div className="flex flex-col space-y-3 sticky bottom-8">
             <button onClick={() => onFinalize(encounter)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition shadow-2xl shadow-indigo-100 flex items-center justify-center">
               <ShieldCheck className="w-5 h-5 mr-2" /> Finalize Prescription
             </button>
             <button className="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition text-sm">
               Save Draft
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MedicationTimelineProps {
  patient: Patient;
  assessments: Assessment[];
}

const MedicationTimeline: React.FC<MedicationTimelineProps> = ({ patient, assessments }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedMed, setSelectedMed] = useState<string | null>(null);
  
  const [filters, setFilters] = useState({
    categories: {
      psychiatric: true,
      medical: false,
      supplements: false,
      prn: false
    },
    classes: {
      ssri: true,
      benzodiazepine: true,
      antipsychotic: true,
      moodStabilizer: true,
      antidiabetic: true,
      vitamins: true
    }
  });

  const allMeds = useMemo(() => {
    const list: any[] = [];
    
    patient.clinicalJourney?.forEach(rec => {
      rec.prescribedMedications?.forEach(m => {
        const existing = list.find(l => l.name === m);
        const isPrn = m.toLowerCase().includes('prn') || m.toLowerCase().includes('sos');
        const drugClass = m.includes('Fluox') || m.includes('Sertra') || m.includes('Escital') ? 'SSRI' : 
                          m.includes('Clona') ? 'Benzodiazepine' : 'Other';
        
        if (!existing) {
          list.push({
            name: m,
            category: isPrn ? 'prn' : 'psychiatric',
            class: drugClass,
            start: new Date(rec.date).getTime(),
            end: rec.endDate ? new Date(rec.endDate).getTime() : Date.now(),
            dosageHistory: [
              { date: rec.date, value: parseInt(m.match(/\d+/)?.[0] || '10') }
            ],
            notes: rec.outcome || 'Maintenance dose'
          });
        } else {
          existing.end = rec.endDate ? new Date(rec.endDate).getTime() : Date.now();
          existing.dosageHistory.push({ date: rec.date, value: parseInt(m.match(/\d+/)?.[0] || '10') });
        }
      });
    });

    patient.medicalHistory?.forEach(ill => {
      ill.medications.forEach(m => {
        list.push({
          name: m.name,
          category: 'medical',
          class: m.drugClass || 'Other',
          start: m.startDate ? new Date(m.startDate).getTime() : 0,
          end: m.endDate ? new Date(m.endDate).getTime() : Date.now(),
          dosageHistory: [{ date: m.startDate || '', value: parseInt(m.dosage.match(/\d+/)?.[0] || '500') }],
          notes: 'Chronic condition management'
        });
      });
    });

    if (patient.biomarkers?.vitaminD) {
       list.push({
         name: 'Vitamin D3 (Cholecalciferol)',
         category: 'supplements',
         class: 'Vitamins',
         start: new Date(patient.biomarkers.vitaminD[0].date).getTime(),
         end: Date.now(),
         dosageHistory: [{ date: patient.biomarkers.vitaminD[0].date, value: 60000 }],
         notes: 'Corrective supplementation'
       });
    }

    return list.sort((a, b) => a.start - b.start);
  }, [patient]);

  const filteredMeds = useMemo(() => {
    return allMeds.filter(med => {
      const catKey = med.category as keyof typeof filters.categories;
      if (!filters.categories[catKey]) return false;
      
      const classLower = med.class.toLowerCase();
      if (classLower === 'ssri' && !filters.classes.ssri) return false;
      if (classLower === 'benzodiazepine' && !filters.classes.benzodiazepine) return false;
      if (classLower === 'anti-diabetic' && !filters.classes.antidiabetic) return false;
      if (classLower === 'vitamins' && !filters.classes.vitamins) return false;
      
      return true;
    });
  }, [allMeds, filters]);

  const minTime = Math.min(...allMeds.map(d => d.start), Date.now() - (1000 * 60 * 60 * 24 * 365));
  const maxTime = Date.now();
  const totalRange = maxTime - minTime;

  const phq9TrendData = useMemo(() => {
    return assessments
      .filter(a => a.type === 'PHQ-9')
      .map(a => ({
        time: new Date(a.date).getTime(),
        score: a.score
      }))
      .sort((a, b) => a.time - b.time);
  }, [assessments]);

  return (
    <div className="flex bg-white rounded-2xl border border-slate-100 clinical-shadow mb-8 overflow-hidden">
      <div className="flex-1 p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold text-slate-800 flex items-center">
            <Layers className="w-4 h-4 mr-2 text-indigo-600" />
            Medication Exposure Timeline
          </h3>
          <div className="flex items-center space-x-3">
             <div className="flex items-center space-x-4 mr-4">
              <div className="flex items-center text-[10px] font-bold text-slate-400">
                <span className="w-2 h-2 rounded-full bg-indigo-500 mr-1"></span> Psychiatric
              </div>
              <div className="flex items-center text-[10px] font-bold text-slate-400">
                <span className="w-2 h-2 rounded-full bg-slate-300 mr-1"></span> Medical
              </div>
              <div className="flex items-center text-[10px] font-bold text-slate-400">
                <span className="w-2 h-2 rounded-full bg-amber-300 mr-1"></span> Supplement
              </div>
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition border ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative min-h-[200px] mt-4">
          {showOverlay && phq9TrendData.length > 0 && (
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={phq9TrendData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" hide domain={[minTime, maxTime]} />
                  <YAxis hide domain={[0, 27]} />
                  <Area type="monotone" dataKey="score" stroke="#4f46e5" fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
              <div className="absolute top-0 right-0 p-2 text-[8px] font-black text-indigo-400 uppercase">Symptom Overlay Active</div>
            </div>
          )}

          {filteredMeds.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                <Layers className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest">No medications selected</p>
             </div>
          ) : (
            <div className="space-y-4">
              {filteredMeds.map((drug, i) => {
                const left = ((drug.start - minTime) / totalRange) * 100;
                const width = ((drug.end - drug.start) / totalRange) * 100;
                const isSelected = selectedMed === drug.name;
                
                return (
                  <div key={i} className="relative h-10 flex items-center group">
                    <div className="absolute left-0 -top-1 text-[8px] font-black text-slate-200 uppercase tracking-tighter">
                      {new Date(drug.start).getFullYear()}
                    </div>
                    <button 
                      onClick={() => setSelectedMed(isSelected ? null : drug.name)}
                      className={`h-6 rounded-md absolute shadow-sm flex items-center px-3 transition-all cursor-pointer ring-offset-2 hover:h-8 ${
                        isSelected ? 'ring-2 ring-indigo-500 h-8 z-20' : 'z-10'
                      } ${
                        drug.category === 'psychiatric' ? 'bg-indigo-500 text-white' : 
                        drug.category === 'supplements' ? 'bg-amber-300 text-amber-900' :
                        'bg-slate-200 text-slate-600'
                      }`}
                      style={{ left: `${left}%`, width: `${width}%` }}
                    >
                      <span className="text-[10px] font-bold truncate">{drug.name}</span>
                      {isSelected && <Maximize2 className="w-3 h-3 ml-2 shrink-0 opacity-50" />}
                    </button>
                    
                    {isSelected && (
                      <div className="absolute top-10 left-0 bg-white border border-slate-100 shadow-2xl rounded-xl p-4 z-[100] w-64 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{drug.class}</p>
                            <h4 className="text-sm font-bold text-slate-800">{drug.name}</h4>
                          </div>
                          <button onClick={() => setSelectedMed(null)}><X className="w-4 h-4 text-slate-300" /></button>
                        </div>
                        
                        <div className="h-24 w-full mb-3 bg-slate-50 rounded-lg p-2">
                           <ResponsiveContainer width="100%" height="100%">
                             <LineChart data={drug.dosageHistory}>
                               <XAxis dataKey="date" hide />
                               <YAxis hide />
                               <Tooltip content={({ active, payload }) => {
                                 if (active && payload && payload.length) {
                                   return (
                                     <div className="bg-slate-800 text-white text-[9px] px-2 py-1 rounded">
                                       {payload[0].value}mg on {payload[0].payload.date}
                                     </div>
                                   );
                                 }
                                 return null;
                               }} />
                               <Line type="stepAfter" dataKey="value" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3 }} />
                             </LineChart>
                           </ResponsiveContainer>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-slate-400">Exposure</span>
                            <span className="font-bold text-slate-700">{Math.round((drug.end - drug.start) / (1000*60*60*24*30))} Months</span>
                          </div>
                          <div className="flex justify-between text-[10px]">
                            <span className="text-slate-400">Latest Note</span>
                            <span className="font-bold text-slate-700 text-right max-w-[120px] truncate">{drug.notes}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="mt-8 pt-4 border-t border-slate-50 flex items-center justify-between">
           <label className="flex items-center cursor-pointer group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={showOverlay}
                  onChange={(e) => setShowOverlay(e.target.checked)}
                />
                <div className={`block w-8 h-5 rounded-full transition-colors ${showOverlay ? 'bg-indigo-500' : 'bg-slate-200'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform ${showOverlay ? 'translate-x-3' : ''}`}></div>
              </div>
              <span className="ml-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition">Overlay symptom scores (PHQ-9)</span>
           </label>
        </div>
      </div>

      {showFilters && (
        <div className="w-64 border-l border-slate-100 bg-slate-50/50 p-6 animate-in slide-in-from-right duration-300">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filters</h4>
            <button onClick={() => setShowFilters(false)}><X className="w-4 h-4 text-slate-300" /></button>
          </div>

          <div className="space-y-6">
            <section>
              <h5 className="text-[9px] font-black text-slate-300 uppercase tracking-tighter mb-3">Medication Category</h5>
              <div className="space-y-2">
                {Object.entries(filters.categories).map(([key, val]) => (
                  <label key={key} className="flex items-center space-x-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
                      checked={val}
                      onChange={(e) => setFilters({...filters, categories: {...filters.categories, [key]: e.target.checked}})}
                    />
                    <span className="text-[11px] font-bold text-slate-600 capitalize group-hover:text-slate-900 transition">{key}</span>
                  </label>
                ))}
              </div>
            </section>

            <section>
              <h5 className="text-[9px] font-black text-slate-300 uppercase tracking-tighter mb-3">Therapeutic Class</h5>
              <div className="space-y-2">
                {Object.entries(filters.classes).map(([key, val]) => (
                  <label key={key} className="flex items-center space-x-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
                      checked={val}
                      onChange={(e) => setFilters({...filters, classes: {...filters.classes, [key]: e.target.checked}})}
                    />
                    <span className="text-[11px] font-bold text-slate-600 capitalize group-hover:text-slate-900 transition">{key.replace(/([A-Z])/g, ' $1')}</span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          <button 
            onClick={() => setFilters({
              categories: { psychiatric: true, medical: false, supplements: false, prn: false },
              classes: { ssri: true, benzodiazepine: true, antipsychotic: true, moodStabilizer: true, antidiabetic: true, vitamins: true }
            })}
            className="mt-8 text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-700 transition"
          >
            Reset Defaults
          </button>
        </div>
      )}
    </div>
  );
};

const BiomarkerCard: React.FC<{ 
  label: string, 
  icon: any, 
  data: BiomarkerRecord[], 
  unit: string, 
  status?: string,
  range?: string 
}> = ({ label, icon: Icon, data, unit, status, range }) => {
  const latest = data[data.length - 1];
  if (!latest) return null;

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 clinical-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className={`p-1.5 rounded-lg ${status === 'low' ? 'bg-amber-50 text-amber-600' : status === 'high' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'}`}>
          <Icon className="w-4 h-4" />
        </div>
        {status && (
          <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
            status === 'low' ? 'bg-amber-50 text-amber-600' : status === 'high' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
          }`}>
            {status}
          </span>
        )}
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <div className="flex items-baseline space-x-1 mt-1">
        <span className="text-lg font-black text-slate-800">{latest.value}</span>
        <span className="text-[10px] font-bold text-slate-400">{unit}</span>
      </div>
      {range && <p className="text-[9px] text-slate-400 mt-1 font-medium">Ref: {range}</p>}
      
      <div className="h-10 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <Area type="monotone" dataKey="value" stroke={status === 'low' ? '#f59e0b' : '#64748b'} fill={status === 'low' ? '#fef3c7' : '#f1f5f9'} strokeWidth={1} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const FamilyPedigree: React.FC<{ history: FamilyNode[] }> = ({ history }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 clinical-shadow h-full">
      <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center">
        <Network className="w-4 h-4 mr-2 text-indigo-600" />
        Family Psychiatric Pedigree
      </h3>
      <div className="space-y-4">
        {history.map((node, i) => (
          <div key={i} className="flex items-start space-x-4 p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
              node.status === 'Diagnosed' ? 'bg-amber-100 text-amber-700' : node.status === 'Deceased' ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-700'
            }`}>
              {node.relation[0]}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{node.relation}</h4>
                  <p className="text-[10px] font-medium text-slate-500">{node.status} {node.onsetAge ? `(Onset: ${node.onsetAge})` : ''}</p>
                </div>
                {node.severity && (
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 uppercase">
                    {node.severity}
                  </span>
                )}
              </div>
              {node.condition && (
                <p className="text-xs font-bold text-indigo-600 mt-1">{node.condition}</p>
              )}
              {node.notes && (
                <p className="text-[10px] text-slate-400 mt-1 italic">"{node.notes}"</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PatientDetail: React.FC<PatientDetailProps> = ({ patient, onBack, onUpdatePatient }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [scannedPrescriptions, setScannedPrescriptions] = useState<ScannedPrescription[]>(patient.prescriptions || []);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'trends' | 'ai' | 'tests' | 'history' | 'encounter'>('overview');
  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [administeringTest, setAdministeringTest] = useState<'PHQ-9' | 'GAD-7' | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [expandedAssessment, setExpandedAssessment] = useState<number | null>(null);

  useEffect(() => {
    const patientSessions = MOCK_SESSIONS.filter(s => s.patientId === patient.id).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setSessions(patientSessions);
    
    const allAssessments = patientSessions.flatMap(s => s.assessments).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setAssessments(allAssessments);
  }, [patient.id]);

  const exposureSummary = useMemo(() => {
    if (!patient.clinicalJourney) return null;
    const start = new Date(patient.firstDiagnosisDate || patient.clinicalJourney[0].date).getTime();
    const years = Math.round((Date.now() - start) / (1000 * 60 * 60 * 24 * 365.25) * 10) / 10;
    const switches = patient.clinicalJourney.reduce((acc, rec) => acc + (rec.medicationChanges?.length || 0), 0);
    return { years, switches };
  }, [patient]);

  const generateAIInsights = async () => {
    setIsLoadingAI(true);
    const gemini = new GeminiService();
    try {
      const insight = await gemini.analyzePatientHistory(patient, sessions);
      setAiInsight(insight);
      setActiveTab('ai');
    } catch (error) {
      alert("Failed to generate AI insights.");
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handlePrescriptionComplete = (newRx: ScannedPrescription) => {
    setScannedPrescriptions(prev => [newRx, ...prev]);
    setShowScanner(false);

    const newJourneyEntry: ClinicalJourneyRecord = {
      date: newRx.date,
      facility: newRx.hospitalName ?? 'External / Scanned record',
      clinician: newRx.doctorName ?? '',
      reasonForVisit: newRx.diagnosis ?? 'From scanned prescription',
      prescribedMedications: newRx.items.map(i => `${i.name} ${i.dosage}${i.frequency ? ` ${i.frequency}` : ''}`),
    };
    const updatedPrescriptions = [newRx, ...(patient.prescriptions || [])];
    const updatedJourney = [newJourneyEntry, ...(patient.clinicalJourney || [])];
    const updated: Patient = {
      ...patient,
      prescriptions: updatedPrescriptions,
      clinicalJourney: updatedJourney,
    };
    if (onUpdatePatient) onUpdatePatient(updated);
  };

  const handleTestComplete = async (newAssessment: Assessment) => {
    const previous = assessments.find(a => a.type === newAssessment.type);
    const gemini = new GeminiService();
    const interpretation = await gemini.interpretTestResult(newAssessment, previous);
    const assessmentWithAI = { ...newAssessment, aiInterpretation: interpretation };
    setAssessments(prev => [assessmentWithAI, ...prev]);
    setAdministeringTest(null);
  };

  const handleFinalizeEncounter = (encounter: ClinicalEncounter) => {
    if (onUpdatePatient) {
      const updated: Patient = {
        ...patient,
        currentEncounter: encounter,
        diagnosis: encounter.primaryDiagnosis,
        clinicalStatus: 'Under Treatment'
      };
      onUpdatePatient(updated);
      alert("Prescription finalized and patient status updated to 'Under Treatment'.");
      setActiveTab('overview');
    }
  };

  const phq9Data = assessments.filter(a => a.type === 'PHQ-9').reverse().map(a => ({
    date: new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: a.score
  }));

  const gad7Data = assessments.filter(a => a.type === 'GAD-7').reverse().map(a => ({
    date: new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: a.score
  }));

  const medicationChangePoints = useMemo(() => {
    return patient.clinicalJourney
      ?.filter(r => r.medicationChanges && r.medicationChanges.length > 0)
      .map(r => ({
        date: new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        label: r.medicationChanges![0]
      })) || [];
  }, [patient]);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {showScanner && <PrescriptionScanner onCancel={() => setShowScanner(false)} onComplete={handlePrescriptionComplete} />}

      <div className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="text-slate-400 hover:text-slate-600 transition">
            <ChevronRight className="rotate-180 w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{patient.name}</h1>
            <p className="text-sm text-slate-500 flex items-center flex-wrap gap-x-3 gap-y-1">
              <span>{patient.gender}, {calculateAge(patient.dob)} years</span>
              <span className="flex items-center"><User className="w-3 h-3 mr-1" /> ID: {patient.id}</span>
              {patient.abha?.abhaNumber && (
                <span className="flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                  <ShieldCheck className="w-3 h-3 mr-1" /> ABHA: {patient.abha.abhaNumber}
                </span>
              )}
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                patient.clinicalStatus === 'In Progress' ? 'bg-amber-50 text-amber-600' : 
                patient.clinicalStatus === 'Under Treatment' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'
              }`}>{patient.clinicalStatus || 'Pending'}</span>
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setActiveTab('encounter')}
            className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition font-bold text-sm shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Prescription
          </button>
          <button onClick={generateAIInsights} disabled={isLoadingAI} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-300 shadow-sm">
            {isLoadingAI ? <span className="animate-spin mr-2">◌</span> : <BrainCircuit className="w-4 h-4 mr-2" />}
            AI Insight Engine
          </button>
        </div>
      </div>

      <div className="bg-white border-b px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'history', label: 'Clinical History', icon: History },
            { id: 'tests', label: 'Clinical Tests', icon: ClipboardCheck },
            { id: 'timeline', label: 'Timeline', icon: Calendar },
            { id: 'trends', label: 'Trends', icon: TrendingUp },
            { id: 'ai', label: 'Intelligence', icon: BrainCircuit },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center py-4 border-b-2 text-sm font-medium transition whitespace-nowrap ${
                activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 overflow-y-auto flex-1">
        {administeringTest ? (
          <TestAdministration testType={administeringTest} onCancel={() => setAdministeringTest(null)} onComplete={handleTestComplete} />
        ) : (
          <div className="max-w-7xl mx-auto">
            {activeTab === 'encounter' && (
              <ClinicalEncounterForm patient={patient} onFinalize={handleFinalizeEncounter} />
            )}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <MedicationTimeline patient={patient} assessments={assessments} />

                <section>
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center">
                    <FlaskConical className="w-4 h-4 mr-2" /> Clinical Biomarkers & Vitals
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {patient.biomarkers && (
                      <>
                        <BiomarkerCard label="Body Weight" icon={Weight} data={patient.biomarkers.weight} unit="kg" />
                        <BiomarkerCard label="Blood Pressure" icon={Thermometer} data={patient.biomarkers.systolicBP} unit="mmHg" status={patient.biomarkers.systolicBP[patient.biomarkers.systolicBP.length-1].value > 140 ? 'high' : 'normal'} />
                        <BiomarkerCard label="Sleep Duration" icon={Moon} data={patient.biomarkers.sleepHours} unit="hrs/night" status={patient.biomarkers.sleepHours[patient.biomarkers.sleepHours.length-1].value < 5 ? 'low' : 'normal'} />
                        <BiomarkerCard label="HbA1c" icon={Activity} data={patient.biomarkers.hbA1c || []} unit="%" status={patient.biomarkers.hbA1c?.[0]?.value && patient.biomarkers.hbA1c[0].value > 6.5 ? 'high' : 'normal'} range="< 6.0%" />
                        <BiomarkerCard label="Vitamin B12" icon={FlaskConical} data={patient.biomarkers.vitaminB12} unit="pg/mL" status={patient.biomarkers.vitaminB12[0].value < 200 ? 'low' : 'optimal'} range="200 - 900" />
                        <BiomarkerCard label="Vitamin D" icon={FlaskConical} data={patient.biomarkers.vitaminD} unit="ng/mL" status={patient.biomarkers.vitaminD[0].value < 20 ? 'low' : 'optimal'} range="20 - 50" />
                      </>
                    )}
                  </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                  <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-100 clinical-shadow">
                    <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-indigo-600" /> Current Clinical Context
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Main Diagnosis</span>
                        <p className="text-slate-800 text-xl font-black mt-1">{patient.diagnosis || 'Clinical evaluation pending'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Psychosocial Factors</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {patient.psychosocialFactors?.map((f, i) => (
                            <span key={i} className="px-3 py-1 bg-slate-50 border border-slate-100 text-slate-600 text-[10px] font-bold rounded-lg">{f}</span>
                          )) || <p className="text-xs text-slate-400 italic">No factors recorded.</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-10 animate-in fade-in duration-300">
                <div className="flex justify-between items-center">
                   <h3 className="text-xl font-bold text-slate-800 flex items-center">
                    <History className="w-5 h-5 mr-3 text-indigo-600" /> Longitudinal Clinical Journey
                  </h3>
                  <button onClick={() => setShowScanner(true)} className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition font-bold border border-indigo-100 shadow-sm">
                    <ScanLine className="w-4 h-4 mr-2" /> Scan External Record
                  </button>
                </div>

                {exposureSummary && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-xl flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Medication Tenure</p>
                        <p className="text-2xl font-black mt-1">{exposureSummary.years} <span className="text-xs font-medium">Years Active</span></p>
                      </div>
                      <Clock className="w-10 h-10 text-indigo-600 opacity-50" />
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 clinical-shadow flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medication Switches</p>
                        <p className="text-2xl font-black text-slate-800 mt-1">{exposureSummary.switches} <span className="text-xs font-medium text-slate-400">Recorded</span></p>
                      </div>
                      <ArrowRightLeft className="w-10 h-10 text-slate-100" />
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 clinical-shadow flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Continuous Regimen</p>
                        <p className="text-2xl font-black text-slate-800 mt-1">Sertraline <span className="text-xs font-medium text-slate-400">3 yrs</span></p>
                      </div>
                      <Pill className="w-10 h-10 text-slate-100" />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-2 space-y-12">
                    <section>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center">
                        <Calendar className="w-3 h-3 mr-2" /> Historical Timeline Records
                      </h4>
                      <div className="relative pl-10 space-y-12">
                        <div className="absolute left-[15px] top-3 bottom-10 w-0.5 bg-slate-200 border-l-2 border-dotted" />
                        
                        {patient.clinicalJourney?.map((record, i) => (
                          <div key={i} className="relative">
                            <div className="absolute -left-[34px] top-1.5 w-6 h-6 rounded-full bg-white border-4 border-indigo-600 shadow-sm z-10 flex items-center justify-center">
                              <span className="text-[8px] font-black">{new Date(record.date).getFullYear().toString().slice(-2)}</span>
                            </div>
                            <div className="bg-white p-8 rounded-2xl border border-slate-100 clinical-shadow hover:border-indigo-200 transition group">
                              <div className="flex justify-between items-start mb-6">
                                <div>
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{record.date} {record.endDate ? `— ${record.endDate}` : '— Present'}</span>
                                  <h4 className="font-black text-slate-800 text-lg mt-1">{record.facility}</h4>
                                  <p className="text-xs text-slate-500 font-bold flex items-center mt-1">
                                    <Stethoscope className="w-3 h-3 mr-1 text-slate-300" /> {record.clinician}
                                  </p>
                                </div>
                                <div className="bg-indigo-50/50 px-4 py-2 rounded-xl text-center border border-indigo-100/30">
                                  <p className="text-[8px] font-black text-indigo-400 uppercase">Outcome</p>
                                  <p className="text-xs font-black text-indigo-700">{record.outcome || 'Review'}</p>
                                </div>
                              </div>

                              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/50 mb-6">
                                <p className="text-xs text-slate-600 leading-relaxed italic">"{record.reasonForVisit}"</p>
                              </div>

                              {record.medicationChanges && record.medicationChanges.length > 0 && (
                                <div className="mb-6 space-y-2">
                                  {record.medicationChanges.map((change, ci) => (
                                    <div key={ci} className="flex items-center text-[10px] font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100/50">
                                      <Zap className="w-3 h-3 mr-2" /> {change}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {record.prescribedMedications && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {record.prescribedMedications.map((med, midx) => (
                                    <div key={midx} className="flex items-center p-2.5 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-700 shadow-sm">
                                      <div className="w-6 h-6 bg-indigo-50 rounded-lg flex items-center justify-center mr-3">
                                        <Pill className="w-3.5 h-3.5 text-indigo-600" />
                                      </div>
                                      {med}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  <aside className="space-y-8">
                    <FamilyPedigree history={patient.familyHistory || []} />
                  </aside>
                </div>
              </div>
            )}

            {activeTab === 'tests' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-800">Clinical Assessment History</h3>
                  <div className="flex space-x-3">
                    <button onClick={() => setAdministeringTest('PHQ-9')} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition text-sm font-bold flex items-center shadow-sm"><Plus className="w-4 h-4 mr-2" /> PHQ-9</button>
                    <button onClick={() => setAdministeringTest('GAD-7')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-bold flex items-center shadow-lg"><Plus className="w-4 h-4 mr-2" /> GAD-7</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {assessments.map((a, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-slate-100 clinical-shadow overflow-hidden">
                      <div className="p-6 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${a.type === 'PHQ-9' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            <ClipboardCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800">{a.type} - {a.severity}</h4>
                            <p className="text-xs text-slate-500">Conducted on {a.date}</p>
                          </div>
                        </div>
                        <div className="text-center px-6 border-l border-slate-50">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Raw Score</p>
                          <p className="text-2xl font-black text-slate-800">{a.score}</p>
                        </div>
                        <button onClick={() => setExpandedAssessment(expandedAssessment === idx ? null : idx)} className="p-2 hover:bg-slate-50 rounded-full transition text-slate-400">
                          <ChevronDown className={`w-5 h-5 transition-transform ${expandedAssessment === idx ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                      {expandedAssessment === idx && (
                        <div className="px-6 pb-6 pt-2 border-t border-slate-50 bg-slate-50/30">
                          <div className="mt-4 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                            <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center"><BrainCircuit className="w-3 h-3 mr-1" /> AI Interpretation</h5>
                            <p className="text-sm text-slate-700 leading-relaxed italic">{a.aiInterpretation || "Generating analysis..."}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="max-w-4xl mx-auto py-6 animate-in fade-in duration-300">
                <div className="relative pl-8 space-y-12">
                  <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-slate-200" />
                  {[...sessions].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((session, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[30px] top-1 w-5 h-5 rounded-full bg-indigo-600 border-4 border-white shadow-sm z-10" />
                      <div className="bg-white p-6 rounded-xl border border-slate-100 clinical-shadow">
                        <div className="flex justify-between mb-4">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{session.date}</span>
                            <h4 className="text-lg font-bold text-slate-800">Clinical Session</h4>
                            <p className="text-xs text-slate-500 mt-1">Conducted by {session.clinicianName}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase h-fit ${
                            session.status === 'improving' ? 'bg-emerald-50 text-emerald-600' : 
                            session.status === 'worsening' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {session.status}
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 italic bg-slate-50 p-4 rounded-lg border border-slate-100 mb-4">"{session.notes}"</p>
                        <div className="flex flex-wrap gap-2">
                          {session.symptoms.map((s, i) => (
                            <span key={i} className="px-2 py-1 bg-white border border-slate-200 text-[10px] font-medium text-slate-500 rounded-md">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'trends' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white p-8 rounded-2xl border border-slate-100 clinical-shadow">
                    <h3 className="text-lg font-bold text-slate-800 mb-8">Depression Intensity (PHQ-9)</h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={phq9Data}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                          <YAxis domain={[0, 27]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                          <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} dot={{ r: 6, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} />
                          <ReferenceLine y={10} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Moderate', fill: '#f59e0b', fontSize: 10 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-2xl border border-slate-100 clinical-shadow">
                    <h3 className="text-lg font-bold text-slate-800 mb-8">Anxiety Intensity (GAD-7)</h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={gad7Data}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                          <YAxis domain={[0, 21]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                          <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} />
                          <ReferenceLine y={10} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Moderate', fill: '#f59e0b', fontSize: 10 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="max-w-5xl mx-auto py-4 animate-in fade-in duration-500">
                {!aiInsight ? (
                  <div className="bg-white p-16 rounded-3xl border border-slate-100 clinical-shadow text-center">
                    <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
                       <BrainCircuit className="w-10 h-10 text-indigo-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">Generate Clinical Intelligence Report</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-10 leading-relaxed">Synthesize years of longitudinal history, pharmacological exposure, and symptom trends into a structured decision-support summary.</p>
                    <button onClick={generateAIInsights} className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition shadow-2xl shadow-indigo-100 flex items-center mx-auto">
                       {isLoadingAI ? <span className="animate-spin mr-3">◌</span> : <Zap className="w-5 h-5 mr-3" />}
                       Initiate Longitudinal Analysis
                    </button>
                  </div>
                ) : (
                  <div className="bg-white rounded-[2rem] border border-slate-100 clinical-shadow overflow-hidden">
                    <div className="bg-slate-900 p-10 text-white flex justify-between items-start">
                       <div>
                         <div className="flex items-center space-x-3 mb-2 text-indigo-400">
                            <ShieldCheck className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Clinical Decision Support Profile</span>
                         </div>
                         <h2 className="text-3xl font-black tracking-tight mb-2">Longitudinal Intelligence Report</h2>
                         <div className="flex items-center space-x-6 text-slate-400 text-sm">
                            <p className="flex items-center"><User className="w-4 h-4 mr-2" /> {patient.name}</p>
                            <p className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> Generated: {new Date().toLocaleDateString()}</p>
                            <p className="flex items-center"><Info className="w-4 h-4 mr-2" /> ID: AM-{patient.id.toUpperCase()}</p>
                         </div>
                       </div>
                       <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition text-white">
                         <Printer className="w-5 h-5" />
                       </button>
                    </div>

                    <div className="p-10 space-y-12">
                      <section>
                         <div className="flex items-center space-x-3 mb-6">
                            <FileText className="w-5 h-5 text-indigo-600" />
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Executive Clinical Summary</h3>
                         </div>
                         <div className="bg-slate-50/50 rounded-3xl p-8 border border-slate-100 leading-relaxed text-slate-700 font-medium">
                            <p className="text-lg text-slate-900 mb-6">{aiInsight.summary}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
                               <div>
                                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Primary Clinical Focus</p>
                                  <p className="text-sm font-bold text-slate-800">{patient.diagnosis || 'Diagnosis Pending Review'}</p>
                               </div>
                               <div>
                                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Trajectory Estimate</p>
                                  <p className="text-sm font-bold text-emerald-600 flex items-center">
                                     <TrendingUp className="w-4 h-4 mr-2" /> Improving Stability
                                  </p>
                               </div>
                            </div>
                         </div>
                      </section>

                      <section>
                         <div className="flex items-center space-x-3 mb-6">
                            <Activity className="w-5 h-5 text-indigo-600" />
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Longitudinal Symptom Trajectory</h3>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="bg-white rounded-3xl border border-slate-100 p-6">
                               <p className="text-[10px] font-black text-slate-400 uppercase mb-6 tracking-tighter">PHQ-9 (Depression Inventory)</p>
                               <div className="h-40 w-full mb-6">
                                  <ResponsiveContainer width="100%" height="100%">
                                     <AreaChart data={phq9Data}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="date" hide />
                                        <YAxis hide domain={[0, 27]} />
                                        <Area type="monotone" dataKey="score" stroke="#4f46e5" fill="#f5f3ff" strokeWidth={2} />
                                        {medicationChangePoints.map((point, pi) => (
                                           <ReferenceLine key={pi} x={point.date} stroke="#f59e0b" strokeDasharray="3 3" />
                                        ))}
                                     </AreaChart>
                                  </ResponsiveContainer>
                               </div>
                               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                  <p className="text-[10px] text-slate-500 italic leading-relaxed">Observed correlation between pharmacological adjustments and score delta in Q4 2023.</p>
                               </div>
                            </div>
                            <div className="bg-white rounded-3xl border border-slate-100 p-6">
                               <p className="text-[10px] font-black text-slate-400 uppercase mb-6 tracking-tighter">GAD-7 (Anxiety Inventory)</p>
                               <div className="h-40 w-full mb-6">
                                  <ResponsiveContainer width="100%" height="100%">
                                     <AreaChart data={gad7Data}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="date" hide />
                                        <YAxis hide domain={[0, 21]} />
                                        <Area type="monotone" dataKey="score" stroke="#10b981" fill="#ecfdf5" strokeWidth={2} />
                                     </AreaChart>
                                  </ResponsiveContainer>
                               </div>
                               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                  <p className="text-[10px] text-slate-500 italic leading-relaxed">Secondary anxiety symptoms remaining stable under current therapeutic regimen.</p>
                               </div>
                            </div>
                         </div>
                      </section>

                      <section>
                         <div className="flex items-center space-x-3 mb-6">
                            <Pill className="w-5 h-5 text-indigo-600" />
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Treatment & Pharmacological Intelligence</h3>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-3xl border border-slate-100">
                               <p className="text-[10px] font-black text-slate-400 uppercase mb-3">Therapeutic Exposure</p>
                               <div className="flex items-baseline space-x-2">
                                  <span className="text-2xl font-black text-slate-800">{exposureSummary?.years || 'N/A'}</span>
                                  <span className="text-xs font-bold text-slate-500">Years</span>
                               </div>
                               <p className="text-[10px] text-slate-400 mt-2">Continuous managed psychiatric care since initial diagnosis.</p>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-slate-100">
                               <p className="text-[10px] font-black text-slate-400 uppercase mb-3">Switch/Augmentation Pattern</p>
                               <div className="flex items-baseline space-x-2">
                                  <span className="text-2xl font-black text-slate-800">{exposureSummary?.switches || '0'}</span>
                                  <span className="text-xs font-bold text-slate-500">Events</span>
                               </div>
                               <p className="text-[10px] text-slate-400 mt-2">Moderate switching frequency indicates trial for optimal efficacy.</p>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-slate-100">
                               <p className="text-[10px] font-black text-slate-400 uppercase mb-3">Current Regimen Stability</p>
                               <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                  <span className="text-sm font-bold text-slate-800">Established</span>
                               </div>
                               <p className="text-[10px] text-slate-400 mt-2">No adjustments in last 6 months. Inferred high adherence.</p>
                            </div>
                         </div>
                         <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-tighter">Pharmacological Pattern Analysis</p>
                            <p className="text-sm text-slate-700 leading-relaxed italic">"{aiInsight.trendAnalysis}"</p>
                         </div>
                      </section>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                         <section>
                            <div className="flex items-center space-x-3 mb-6">
                               <Dna className="w-5 h-5 text-indigo-600" />
                               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Family & Risk Context</h3>
                            </div>
                            <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-4">
                               {patient.familyHistory && patient.familyHistory.length > 0 ? (
                                  <ul className="space-y-3">
                                     {patient.familyHistory.filter(f => f.status === 'Diagnosed').map((f, i) => (
                                        <li key={i} className="flex items-start text-sm">
                                           <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 mr-3 shrink-0" />
                                           <span className="text-slate-700 font-medium">Significant psychiatric history in <b>{f.relation}</b> ({f.condition})</span>
                                        </li>
                                     ))}
                                  </ul>
                               ) : (
                                  <p className="text-sm text-slate-500 italic">No significant familial burden reported.</p>
                               )}
                            </div>
                         </section>

                         <section>
                            <div className="flex items-center space-x-3 mb-6">
                               <StethoscopeIcon className="w-5 h-5 text-indigo-600" />
                               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Physiological Comorbid Factors</h3>
                            </div>
                            <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-6">
                               {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                                  <div className="space-y-4">
                                     {patient.medicalHistory.map((m, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                           <span className="text-sm font-bold text-slate-800">{m.name}</span>
                                           <span className="text-[10px] font-black text-slate-400 uppercase">Active Chronic</span>
                                        </div>
                                     ))}
                                  </div>
                               ) : (
                                  <p className="text-sm text-slate-500 italic">No physiological comorbidities recorded.</p>
                               )}
                            </div>
                         </section>
                      </div>

                      <section>
                         <div className="flex items-center space-x-3 mb-6">
                            <AlertCircle className="w-5 h-5 text-rose-500" />
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Clinical Watchpoints</h3>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {aiInsight.clinicalFlags.map((flag, idx) => (
                               <div key={idx} className="flex items-center p-5 bg-rose-50/50 rounded-2xl border border-rose-100">
                                  <div className="w-2 h-2 rounded-full bg-rose-500 mr-4 shadow-sm" />
                                  <div>
                                     <p className="text-sm font-bold text-rose-900">{flag}</p>
                                     <p className="text-[10px] text-rose-700 mt-1">Longitudinal marker detected in clinical trajectory.</p>
                                  </div>
                               </div>
                            ))}
                         </div>
                      </section>

                      <div className="pt-12 border-t border-slate-100">
                         <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
                            <div className="flex items-center justify-between mb-6">
                               <div className="flex items-center space-x-3">
                                  <BrainCircuit className="w-5 h-5 text-slate-400" />
                                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Report Quality & Confidence</span>
                               </div>
                               <div className="flex items-center space-x-2">
                                  <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                                     <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${aiInsight.confidence * 100}%` }} />
                                  </div>
                                  <span className="text-xs font-bold text-slate-800">{Math.round(aiInsight.confidence * 100)}% Confidence</span>
                               </div>
                            </div>
                            <div className="flex items-start space-x-4 text-xs text-slate-500 leading-relaxed">
                               <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                               <div className="space-y-3">
                                  <p>This report is synthesized from longitudinal history and assessments. Confidence is determined by data density and temporal consistency.</p>
                                  <p className="font-black text-slate-800 bg-white p-3 border border-slate-100 rounded-xl">
                                     IMPORTANT: This report reflects patterns for decision support only. It is not a diagnosis and does not replace professional clinical judgment.
                                  </p>
                               </div>
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetail;
