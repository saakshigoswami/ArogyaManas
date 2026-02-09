import React, { useEffect, useState } from 'react';
import { BrainCircuit, ShieldCheck, ArrowRight, Heart, Users, Fingerprint, ShieldEllipsis } from 'lucide-react';

const abhaIcon = new URL('../assets/abha_icon.png', import.meta.url).href;
const arogyamanasLogo = new URL('../assets/ArogyaManas_logo.png', import.meta.url).href;
const digitalIndiaLogo = new URL('../assets/digital_india_logo.jpg', import.meta.url).href;
const abdmLogo = new URL('../assets/logo-Ayushman_Bharat.png', import.meta.url).href;
const geminiLogo = new URL('../assets/gemini-logo.png', import.meta.url).href;

interface LandingPageProps {
  onExplore: () => void;
}

function LandingPage({ onExplore }: LandingPageProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-emerald-50/50 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] bg-blue-50/30 rounded-full blur-[150px]"></div>
      </div>

      {/* Navigation */}
      <nav className={`relative z-10 px-8 py-6 flex justify-between items-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
        <div className="flex items-center space-x-3">
          <img src={arogyamanasLogo} alt="ArogyaManas" className="w-10 h-10 object-contain rounded-xl shadow-lg shadow-indigo-200" />
          <span className="text-2xl font-black text-slate-800 tracking-tight">ArogyaManas</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-orange-50 rounded-full border border-orange-100 shadow-sm">
            <img src={digitalIndiaLogo} alt="Digital India" className="w-9 h-9 object-contain" />
            <span className="text-[9px] font-black uppercase tracking-widest text-orange-700">Made for Digital India</span>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-slate-200 shadow-sm">
            <img src={geminiLogo} alt="Gemini" className="w-6 h-6 object-contain" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Powered by Gemini</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-8 pt-12 pb-24 flex flex-col items-center text-center">
        <div className={`transition-all duration-1000 delay-300 transform ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100 text-indigo-600 font-bold text-[10px] uppercase tracking-wider flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping mr-2"></div>
              <span>Intelligence Platform v3.1</span>
            </div>
            <div className="px-3 py-1 bg-white rounded-full text-slate-800 font-black text-[10px] uppercase tracking-wider shadow-lg shadow-slate-200 border border-slate-200 flex items-center gap-2">
              <img src={abhaIcon} alt="ABHA" className="w-6 h-6 object-contain" />
              ABHA Integrated
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8">
            Longitudinal Intelligence for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Psychiatric Healthcare.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-slate-500 text-base md:text-lg font-medium leading-relaxed mb-12">
            Aligned with Ayushman Bharat. ArogyaManas digitizes records, reduces clinical time, and helps psychiatrists treat more patients—accurately and efficiently.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button 
              onClick={onExplore}
              className="group relative px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-bold text-lg hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 overflow-hidden"
            >
              <div className="relative z-10 flex items-center">
                Explore ArogyaManas
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            <div className="text-slate-400 font-bold text-xs flex flex-col items-start uppercase tracking-widest text-left">
              <div className="flex items-center mb-1 text-emerald-600">
                <img src={abdmLogo} alt="ABDM" className="w-12 h-12 object-contain mr-2" />
                ABDM Compliant Facility
              </div>
              <div className="text-[10px] font-medium text-slate-400">Secure Healthcare Data Exchange</div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full transition-all duration-1000 delay-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 clinical-shadow hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col items-center group">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
              <BrainCircuit className="w-8 h-8 text-indigo-600 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">AI Case Synthesis</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Powered by Google Gemini to analyze longitudinal sessions, psychometric trends, and pharmacological history with unmatched precision.
            </p>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 clinical-shadow hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col items-center group">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 border border-slate-100 shadow-sm p-2">
              <img src={abhaIcon} alt="ABHA" className="w-14 h-14 object-contain" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">ABHA Account Sync</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Seamlessly link and pull records from patient's 14-digit ABHA (Ayushman Bharat Health Account) for a truly holistic 360&deg; health view.
            </p>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 clinical-shadow hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col items-center group">
            <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors p-2">
              <img src={digitalIndiaLogo} alt="Digital India" className="w-14 h-14 object-contain" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Digital India Compliant</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Strict adherence to Indian data sovereignty laws and ABDM milestones for secure, interoperable health records across India.
            </p>
          </div>
        </div>

        {/* ABDM Branding Section */}
        <div className={`mt-24 p-12 bg-white rounded-[3rem] border border-slate-100 clinical-shadow w-full flex flex-col md:flex-row items-center justify-between text-left transition-all duration-1000 delay-700 transform ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="md:w-1/2 mb-8 md:mb-0">
             <div className="flex items-center space-x-4 mb-4 flex-wrap gap-2">
                <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-[9px] font-black uppercase tracking-widest">Azadi Ka Amrit Mahotsav</div>
                <div className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <img src={digitalIndiaLogo} alt="Digital India" className="w-6 h-6 object-contain" />
                  Digital India
                </div>
                <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <img src={abdmLogo} alt="ABDM" className="w-6 h-6 object-contain" />
                  ABDM
                </div>
             </div>
             <h2 className="text-3xl font-black text-slate-800 mb-4 flex items-center gap-3">
               <img src={abdmLogo} alt="ABDM" className="w-20 h-20 object-contain" />
               Ayushman Bharat Digital Mission (ABDM) Integration
             </h2>
             <p className="text-slate-500 font-medium leading-relaxed">
                ArogyaManas is built to serve the national healthcare vision. We facilitate secure health data exchange between patients and doctors via the Unified Health Interface (UHI), ensuring every Indian has access to their longitudinal mental health history.
             </p>
          </div>
          <div className="md:w-1/3 flex flex-col items-center justify-center p-8 bg-slate-50 rounded-[2rem] border border-slate-100 text-center">
             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-xl border border-slate-200 p-3">
                <img src={abhaIcon} alt="ABHA" className="w-full h-full object-contain" />
             </div>
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">ABHA Integrated Facility</p>
             <p className="text-lg font-bold text-slate-800">14-Digit Health ID Verification Enabled</p>
          </div>
        </div>

        {/* Footer info */}
        <div className={`mt-24 pt-12 border-t border-slate-200 w-full flex flex-col md:flex-row justify-between items-center transition-all duration-1000 delay-1000 transform ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center space-x-8 mb-8 md:mb-0">
             <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Empowering Indian Clinicians</span>
             </div>
             <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Accessible Mental Health</span>
             </div>
          </div>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
            ArogyaManas &copy; 2024 &bull; A Digital India Initiative
          </div>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
