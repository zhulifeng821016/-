import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, collection, getDocs, addDoc, serverTimestamp } from '../firebase';
import { User, TaskPriority } from '../types';
import { 
  Terminal, 
  Bell, 
  UserCircle, 
  ChevronRight, 
  Info, 
  ArrowLeft, 
  Undo, 
  Send, 
  UserCheck, 
  Calendar 
} from 'lucide-react';
import { motion } from 'motion/react';

export const CreateTask: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    assignedToUid: '',
    title: '',
    goal: '',
    processDetails: '',
    priority: 'medium' as TaskPriority
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      setEmployees(querySnapshot.docs.map(doc => doc.data() as User).filter(u => u.role === 'employee'));
    };
    fetchEmployees();
  }, []);

  const handleSubmit = async () => {
    if (!formData.assignedToUid || !formData.title) return;
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'tasks'), {
        ...formData,
        processDetails: formData.processDetails.split('\n').filter(s => s.trim() !== ''),
        status: 'pending',
        postedAt: serverTimestamp(),
        createdByUid: 'admin_1' // Mock admin UID
      });
      navigate('/admin/status');
    } catch (e) {
      console.error("Error adding task", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="layout-container flex h-full grow flex-col">
        {/* Top Navigation Bar */}
        <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 md:px-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-8 h-8 rounded bg-blue-600 text-white">
              <Terminal className="w-5 h-5" />
            </div>
            <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">Windows Management Server</h2>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <UserCircle className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex flex-1 justify-center py-8 px-4 md:px-10">
          <div className="max-w-[800px] flex-1">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 mb-6 text-sm">
              <button onClick={() => navigate('/admin')} className="text-slate-500 hover:text-blue-600 transition-colors">Dashboard</button>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <button onClick={() => navigate('/admin/status')} className="text-slate-500 hover:text-blue-600 transition-colors">Tasks</button>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <span className="text-slate-900 dark:text-slate-100 font-medium">Add New Task</span>
            </nav>

            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Create New Task</h1>
              <p className="text-slate-500 dark:text-slate-400">Assign and define the parameters for a new server management operational task.</p>
            </div>

            {/* Form Section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 md:p-8 space-y-6">
                {/* Employee Selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Assign to Employee</label>
                  <div className="relative">
                    <select 
                      value={formData.assignedToUid}
                      onChange={(e) => setFormData({ ...formData, assignedToUid: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Choose an employee...</option>
                      {employees.map(emp => (
                        <option key={emp.uid} value={emp.uid}>{emp.name}</option>
                      ))}
                    </select>
                  </div>
                  {!formData.assignedToUid && (
                    <p className="text-amber-600 dark:text-amber-400 text-xs flex items-center gap-1 mt-1">
                      <Info className="w-3 h-3" />
                      Please select an employee first
                    </p>
                  )}
                </div>

                {/* Task Title */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Task Title <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Weekly Kernel Update"
                    className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Priority */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Priority</label>
                  <div className="flex gap-4">
                    {['low', 'medium', 'high'].map((p) => (
                      <button
                        key={p}
                        onClick={() => setFormData({ ...formData, priority: p as TaskPriority })}
                        className={`px-4 py-2 rounded-xl border transition-all capitalize ${
                          formData.priority === p 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Task Goal */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Task Goal</label>
                  <textarea 
                    rows={3}
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    placeholder="Describe the primary objective of this task..."
                    className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>

                {/* Process Details */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Process Details</label>
                  <textarea 
                    rows={6}
                    value={formData.processDetails}
                    onChange={(e) => setFormData({ ...formData, processDetails: e.target.value })}
                    placeholder="Step-by-step instructions for the assigned staff... (One per line)"
                    className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>
              </div>

              {/* Footer / Buttons */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <button 
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold hover:bg-white dark:hover:bg-slate-700 transition-colors">
                    <Undo className="w-4 h-4" />
                    Recall
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={loading || !formData.assignedToUid || !formData.title}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-lg shadow-blue-600/20"
                  >
                    <Send className="w-4 h-4" />
                    Publish
                  </button>
                </div>
              </div>
            </div>

            {/* Helper Card */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-blue-600/5 border border-blue-600/10 flex gap-4">
                <UserCheck className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Security Policy</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Tasks are logged and audited. Ensure all sensitive data is handled via secure vaults.</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-blue-600/5 border border-blue-600/10 flex gap-4">
                <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Deployment Windows</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Tasks published after 5 PM will be scheduled for the next business day.</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="py-6 px-10 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-slate-400 dark:text-slate-500 text-xs">© 2024 Windows Management Server. System Version 4.2.0-stable</p>
        </footer>
      </div>
    </div>
  );
};
