
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  BrainCircuit,
  MessageSquare
} from 'lucide-react';

const arogyamanasLogo = new URL('../assets/ArogyaManas_logo.png', import.meta.url).href;

interface LayoutProps {
  children: React.ReactNode;
  activeView: 'dashboard' | 'patients' | 'settings';
  onNavigate: (view: 'dashboard' | 'patients' | 'settings') => void;
  onLogoClick?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate, onLogoClick }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Patient Management', icon: Users },
    { id: 'insights', label: 'Clinical Insights', icon: BrainCircuit },
    { id: 'messages', label: 'Team Distribution', icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-8">
          <button
            type="button"
            onClick={onLogoClick}
            className="flex items-center space-x-3 mb-12 w-full text-left rounded-xl hover:bg-slate-800/50 transition py-1 -mx-1 px-1"
            aria-label="Back to home"
          >
            <img src={arogyamanasLogo} alt="ArogyaManas" className="w-10 h-10 object-contain shrink-0 rounded-xl" />
            <span className="text-xl font-bold tracking-tight">ArogyaManas</span>
          </button>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as any)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                  activeView === item.id 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-800">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
              <span className="font-bold text-sm">AR</span>
            </div>
            <div>
              <p className="text-sm font-bold">Dr. Aditi Rao</p>
              <p className="text-xs text-slate-500">Chief Psychiatrist</p>
            </div>
          </div>
          <button className="flex items-center space-x-3 text-slate-400 hover:text-rose-400 transition">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-50 relative">
        {children}
      </main>
    </div>
  );
};

export default Layout;
