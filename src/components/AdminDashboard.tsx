import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, collection, query, onSnapshot } from '../firebase';
import { Task } from '../types';
import { 
  Terminal, 
  LayoutDashboard, 
  Server, 
  CalendarRange, 
  ShieldCheck, 
  Settings, 
  Search, 
  Bell, 
  UserCheck, 
  PlusSquare, 
  CheckSquare, 
  Cpu, 
  Database, 
  Gauge,
  ArrowRight,
  BarChart3
} from 'lucide-react';
import { motion } from 'motion/react';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'tasks'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Task[]);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-blue-600 rounded-lg p-2 text-white">
                <Terminal className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm font-bold tracking-tight">MS Server Manager</h1>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Enterprise Edition</p>
              </div>
            </div>
            <nav className="space-y-1">
              <button className="flex w-full items-center gap-3 px-3 py-2 rounded-lg bg-blue-600/10 text-blue-600">
                <LayoutDashboard className="w-5 h-5" />
                <span className="text-sm font-medium">Dashboard</span>
              </button>
              <button className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Server className="w-5 h-5" />
                <span className="text-sm font-medium">Server Management</span>
              </button>
              <button className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <CalendarRange className="w-5 h-5" />
                <span className="text-sm font-medium">Task Scheduler</span>
              </button>
              <button className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-sm font-medium">Security Logs</span>
              </button>
              <button className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Settings className="w-5 h-5" />
                <span className="text-sm font-medium">Settings</span>
              </button>
            </nav>
          </div>
          <div className="mt-auto p-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 p-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">System Status: Active</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          {/* Header */}
          <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <Terminal className="w-5 h-5 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Server Console v2.4</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-64 group">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Quick search console..." 
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg pl-10 pr-4 py-1.5 text-sm focus:ring-1 focus:ring-blue-600 transition-all"
                />
              </div>
              <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
              </button>
              <div className="h-8 w-[1px] bg-slate-200 dark:border-slate-800 mx-1"></div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold leading-none">Administrator</p>
                  <p className="text-[10px] text-slate-500">192.168.1.1</p>
                </div>
                <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm">
                  <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" alt="Admin Avatar" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Body */}
          <div className="p-8 max-w-5xl mx-auto w-full flex flex-col items-center justify-center flex-1">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">Management Dashboard</h1>
              <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
                <UserCheck className="w-4 h-4" />
                <p className="text-sm">Session Authenticated: <span className="text-slate-900 dark:text-slate-200 font-medium">Administrator (Local/127.0.0.1)</span></p>
              </div>
            </div>

            {/* Feature Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
              <button 
                onClick={() => navigate('/admin/create-task')}
                className="group relative flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-600/50 dark:hover:border-blue-600/50 transition-all hover:shadow-2xl hover:shadow-blue-600/5"
              >
                <div className="size-20 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <PlusSquare className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-2">Add New Task</h3>
                <p className="text-slate-500 dark:text-slate-400 text-center text-sm px-4">Initialize automated scripts, system maintenance, or security scans.</p>
                <div className="mt-6 flex items-center gap-2 text-blue-600 font-semibold text-sm">
                  Configure Task <ArrowRight className="w-4 h-4" />
                </div>
              </button>

              <button 
                onClick={() => navigate('/admin/status')}
                className="group relative flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-600/50 dark:hover:border-blue-600/50 transition-all hover:shadow-2xl hover:shadow-blue-600/5"
              >
                <div className="size-20 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <CheckSquare className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-2">Completion Status</h3>
                <p className="text-slate-500 dark:text-slate-400 text-center text-sm px-4">Review historical task execution logs and real-time process monitoring.</p>
                <div className="mt-6 flex items-center gap-2 text-slate-600 dark:text-slate-300 font-semibold text-sm">
                  View Logs <BarChart3 className="w-4 h-4" />
                </div>
              </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl mt-12">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center gap-4">
                <div className="size-10 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center text-blue-600 shadow-sm">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">CPU Usage</p>
                  <p className="text-lg font-bold">24%</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center gap-4">
                <div className="size-10 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center text-blue-600 shadow-sm">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">RAM Load</p>
                  <p className="text-lg font-bold">4.2 GB</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center gap-4">
                <div className="size-10 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center text-blue-600 shadow-sm">
                  <Gauge className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Network</p>
                  <p className="text-lg font-bold">128 Mbps</p>
                </div>
              </div>
            </div>

            <div className="mt-auto py-8 text-center">
              <p className="text-xs text-slate-400 dark:text-slate-600">Last login: Today at 08:42 AM from 192.168.1.5 • All connections are encrypted via TLS 1.3</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
