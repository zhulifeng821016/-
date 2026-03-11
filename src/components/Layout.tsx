import React from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, RefreshCw, CheckSquare, Calendar, MessageSquare, User as UserIcon, LogOut } from 'lucide-react';
import { motion } from 'motion/react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  showTabs?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  tabs?: { id: string; label: string; count?: number }[];
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title, 
  showTabs, 
  activeTab, 
  onTabChange,
  tabs 
}) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 min-h-screen flex flex-col items-center">
      <div className="relative flex h-full min-h-screen w-full max-w-[480px] flex-col bg-white dark:bg-slate-900 overflow-hidden shadow-2xl">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between px-4 h-16">
            <div className="flex items-center gap-3">
              <button onClick={handleSignOut} className="text-slate-600 dark:text-slate-400">
                <LogOut className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold tracking-tight">{title}</h1>
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
          
          {showTabs && tabs && (
            <div className="flex px-4 overflow-x-auto no-scrollbar border-b border-slate-100 dark:border-slate-800">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange?.(tab.id)}
                  className={`px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
                    activeTab === tab.id 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {tab.label} {tab.count !== undefined && `(${tab.count})`}
                </button>
              ))}
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="flex-1 relative overflow-y-auto pb-24">
          {children}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe shadow-lg z-50">
          <div className="flex justify-around items-center px-2 py-2">
            <button 
              onClick={() => navigate('/tasks')}
              className={`flex flex-col items-center gap-1 flex-1 py-1 ${location.pathname === '/tasks' ? 'text-blue-600' : 'text-slate-400 dark:text-slate-500'}`}
            >
              <CheckSquare className={`w-6 h-6 ${location.pathname === '/tasks' ? 'fill-blue-600/10' : ''}`} />
              <span className="text-[10px] font-bold tracking-wide uppercase">Tasks</span>
            </button>
            <button className="flex flex-col items-center gap-1 flex-1 py-1 text-slate-400 dark:text-slate-500">
              <Calendar className="w-6 h-6" />
              <span className="text-[10px] font-bold tracking-wide uppercase">Schedule</span>
            </button>
            <button className="relative flex flex-col items-center gap-1 flex-1 py-1 text-slate-400 dark:text-slate-500">
              <MessageSquare className="w-6 h-6" />
              <span className="text-[10px] font-bold tracking-wide uppercase">Messages</span>
              <span className="absolute top-1 right-1/3 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <button 
              onClick={() => user?.role === 'admin' && navigate('/admin')}
              className={`flex flex-col items-center gap-1 flex-1 py-1 ${location.pathname === '/admin' ? 'text-blue-600' : 'text-slate-400 dark:text-slate-500'}`}
            >
              <UserIcon className="w-6 h-6" />
              <span className="text-[10px] font-bold tracking-wide uppercase">{user?.role === 'admin' ? 'Admin' : 'Profile'}</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};
