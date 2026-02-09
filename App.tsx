import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import PatientList from './components/PatientList';
import PatientDetail from './components/PatientDetail';
import NewPatientForm from './components/NewPatientForm';
import Collaborations from './components/Collaborations';
import ClinicalInsights from './components/ClinicalInsights';
import LandingPage from './components/LandingPage';
import { Patient } from './types';
import { MOCK_PATIENTS } from './constants';
import { fetchPatients, seedDemoDataIfEmpty, insertPatient, updatePatientInSupabase } from './services/patientService';
import PrescriptionScanner from './components/PrescriptionScanner';
import type { ScannedPrescription } from './types';
import { LayoutDashboard, Users, Clock, AlertCircle, Plus, ScanLine } from 'lucide-react';

const DashboardOverview: React.FC<{
  onSeeAll: () => void;
  onAddPatient: () => void;
  onScanForNewPatient: () => void;
}> = ({ onSeeAll, onAddPatient, onScanForNewPatient }) => (
  <div className="p-8">
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Welcome back, Dr. Rao</h1>
        <p className="text-slate-500 mt-1">Here is what's happening in your clinic today.</p>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={onScanForNewPatient}
          className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition font-bold border border-indigo-100 shadow-sm"
        >
          <ScanLine className="w-4 h-4 mr-2" />
          Scan External Record
        </button>
        <button 
          onClick={onAddPatient}
          className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-bold shadow-lg shadow-indigo-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Patient
        </button>
        <div className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 text-sm font-medium">
          Today: March 14, 2024
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {[
        { label: 'Total Patients', value: '124', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Sessions Today', value: '8', icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Attention Needed', value: '12', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
        { label: 'Avg PHQ-9 Delta', value: '-15%', icon: LayoutDashboard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      ].map((stat) => (
        <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-100 clinical-shadow">
          <div className={`${stat.bg} w-10 h-10 rounded-lg flex items-center justify-center mb-4`}>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 clinical-shadow">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
          <button onClick={onSeeAll} className="text-indigo-600 text-sm font-semibold hover:underline">View All</button>
        </div>
        <div className="space-y-4">
          {[
            { patient: 'Ananya Sharma', type: 'Digitized Prescription Added', time: 'Just now' },
            { patient: 'Ananya Sharma', type: 'Clinical Interview', time: '10 mins ago' },
            { patient: 'Arjun Mehta', type: 'GAD-7 Submission', time: '2 hours ago' },
            { patient: 'Rahul Gupta', type: 'AI Intelligence Generated', time: 'Yesterday' },
          ].map((item, i) => (
            <div key={i} className="flex items-center p-4 hover:bg-slate-50 rounded-xl transition cursor-pointer">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500 mr-4">
                {item.patient[0]}
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-800">{item.patient}</p>
                <p className="text-xs text-slate-500">{item.type}</p>
              </div>
              <span className="text-xs text-slate-400">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 p-8 rounded-2xl text-white relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-4">Longitudinal Intelligence</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Our AI engine tracks longitudinal patterns across sessions to help you spot 
            hidden markers for relapse or recovery faster than manual paper-based reviews.
          </p>
          <button onClick={onSeeAll} className="px-6 py-3 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-700 transition">
            Explore Cases
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'landing' | 'dashboard' | 'patients' | 'settings' | 'new-patient' | 'messages' | 'insights'>('landing');
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDashboardScanner, setShowDashboardScanner] = useState(false);
  const [pendingScanForNewPatient, setPendingScanForNewPatient] = useState<ScannedPrescription | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const fromDb = await fetchPatients();
        if (cancelled) return;
        if (fromDb.length > 0) {
          setPatients(fromDb);
        } else {
          const afterSeed = await seedDemoDataIfEmpty();
          if (cancelled) return;
          if (afterSeed.length > 0) setPatients(afterSeed);
        }
      } catch (e) {
        console.warn('[App] Patient data load failed:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleNavigate = (view: string) => {
    setActiveView(view as any);
    setSelectedPatient(null);
  };

  const handleAddPatient = (newPatient: Patient) => {
    setPatients(prev => [newPatient, ...prev]);
    setActiveView('patients');
    insertPatient(newPatient);
  };

  const updatePatient = (updatedPatient: Patient) => {
    setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
    setSelectedPatient(updatedPatient);
    updatePatientInSupabase(updatedPatient);
  };

  const renderContent = () => {
    if (selectedPatient) {
      return (
        <PatientDetail 
          patient={selectedPatient} 
          onBack={() => setSelectedPatient(null)} 
          onUpdatePatient={updatePatient}
        />
      );
    }

    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardOverview 
            onSeeAll={() => setActiveView('patients')} 
            onAddPatient={() => { setPendingScanForNewPatient(null); setActiveView('new-patient'); }}
            onScanForNewPatient={() => setShowDashboardScanner(true)}
          />
        );
      case 'patients':
        return (
          <PatientList 
            patients={patients}
            onSelectPatient={setSelectedPatient} 
            onAddNew={() => setActiveView('new-patient')}
          />
        );
      case 'new-patient':
        return (
          <NewPatientForm 
            onSave={(patient) => { setPendingScanForNewPatient(null); handleAddPatient(patient); }}
            onCancel={() => { setPendingScanForNewPatient(null); setActiveView('dashboard'); }}
            initialFromScan={pendingScanForNewPatient ? {
              diagnosis: pendingScanForNewPatient.diagnosis,
              chiefComplaint: pendingScanForNewPatient.diagnosis || 'From scanned record',
              receptionNotes: [pendingScanForNewPatient.hospitalName, pendingScanForNewPatient.doctorName].filter(Boolean).length
                ? `Scanned: ${pendingScanForNewPatient.hospitalName || 'External'} – ${pendingScanForNewPatient.doctorName || 'Doctor'}`
                : 'Registered from scanned prescription.',
              scannedPrescription: pendingScanForNewPatient,
            } : undefined}
          />
        );
      case 'messages':
        return <Collaborations />;
      case 'insights':
        return <ClinicalInsights patients={patients} />;
      default:
        return <div className="p-8 text-slate-500 italic">Module under development...</div>;
    }
  };

  if (loading) {
    return (
      <Layout activeView="dashboard" onNavigate={() => {}}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-slate-500 font-medium">Loading patient data…</p>
        </div>
      </Layout>
    );
  }

  if (activeView === 'landing') {
    return <LandingPage onExplore={() => setActiveView('dashboard')} />;
  }

  return (
    <Layout
      activeView={activeView === 'new-patient' ? 'patients' : activeView as any}
      onNavigate={handleNavigate}
      onLogoClick={() => setActiveView('landing')}
    >
      {renderContent()}
      {showDashboardScanner && (
        <PrescriptionScanner
          onCancel={() => setShowDashboardScanner(false)}
          onComplete={(rx) => {
            setPendingScanForNewPatient(rx);
            setShowDashboardScanner(false);
            setActiveView('new-patient');
          }}
        />
      )}
    </Layout>
  );
};

export default App;
