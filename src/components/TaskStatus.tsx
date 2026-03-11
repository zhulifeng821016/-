import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, collection, query, onSnapshot, deleteDoc, doc, getDocs } from '../firebase';
import { Task, User } from '../types';
import { 
  Terminal, 
  Search, 
  Bell, 
  Settings, 
  RefreshCw, 
  Download, 
  ChevronDown, 
  CheckCircle, 
  Clock, 
  Trash2, 
  AlertTriangle,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const TaskStatusView: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      setEmployees(querySnapshot.docs.map(doc => doc.data() as User).filter(u => u.role === 'employee'));
    };
    fetchEmployees();

    const q = query(collection(db, 'tasks'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Task[]);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      setShowDeleteModal(null);
    } catch (e) {
      console.error("Error deleting task", e);
    }
  };

  const filteredTasks = selectedEmployee 
    ? tasks.filter(t => t.assignedToUid === selectedEmployee)
    : tasks;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="relative flex flex-col w-full">
        {/* Top Navigation Bar */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3 lg:px-10">
          <div className="flex items-center gap-4 text-blue-600">
            <div className="size-8 flex items-center justify-center bg-blue-600/10 rounded-lg">
              <Terminal className="w-5 h-5" />
            </div>
            <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">Windows Management Server</h2>
          </div>
          <div className="flex flex-1 justify-end gap-4 lg:gap-8 items-center">
            <label className="hidden md:flex flex-col min-w-40 h-10 max-w-64">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-slate-100 dark:bg-slate-800">
                <div className="text-slate-500 flex items-center justify-center pl-4">
                  <Search className="w-4 h-4" />
                </div>
                <input className="form-input flex w-full min-w-0 flex-1 border-none bg-transparent focus:ring-0 placeholder:text-slate-500 text-sm" placeholder="Search tasks..." />
              </div>
            </label>
            <div className="flex gap-2">
              <button className="flex items-center justify-center rounded-lg size-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="flex items-center justify-center rounded-lg size-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-blue-600/20 aspect-square rounded-full size-10 border border-blue-600/30 flex items-center justify-center overflow-hidden">
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" alt="User Profile" className="size-full object-cover" />
            </div>
          </div>
        </header>

        <main className="max-w-[1200px] mx-auto w-full p-4 lg:p-10">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-slate-900 dark:text-slate-100 text-4xl font-black leading-tight tracking-tight">Task Completion Status</h1>
              <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Monitor and manage employee task progress across the server network.</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                <Download className="w-4 h-4" />
                <span>Export to Excel</span>
              </button>
            </div>
          </div>

          {/* Filter Section */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 mb-8 shadow-sm">
            <div className="max-w-sm">
              <label className="flex flex-col gap-2">
                <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold leading-normal">Select Employee</span>
                <div className="relative">
                  <select 
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="form-select w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-600 focus:ring-blue-600 h-12 text-sm appearance-none pr-10"
                  >
                    <option value="">All Employees</option>
                    {employees.map(emp => (
                      <option key={emp.uid} value={emp.uid}>{emp.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                </div>
              </label>
            </div>
          </div>

          {/* Data Table Container */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                    <th className="px-6 py-4 text-slate-900 dark:text-slate-100 text-sm font-semibold border-b border-slate-200 dark:border-slate-800">Task Title</th>
                    <th className="px-6 py-4 text-slate-900 dark:text-slate-100 text-sm font-semibold border-b border-slate-200 dark:border-slate-800 w-48 text-center">Status</th>
                    <th className="px-6 py-4 text-slate-900 dark:text-slate-100 text-sm font-semibold border-b border-slate-200 dark:border-slate-800 w-32 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-5 text-slate-700 dark:text-slate-300 text-sm">{task.title}</td>
                      <td className="px-6 py-5 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          task.status === 'completed' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          {task.status === 'completed' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button 
                          onClick={() => setShowDeleteModal(task.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-1" title="Delete Task"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800"
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="size-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                      <AlertTriangle className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Delete Task?</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">This action cannot be undone.</p>
                    </div>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 mb-6">
                    Are you sure you want to delete this task? This will remove all associated logs and history from the server records.
                  </p>
                  <div className="flex gap-3 justify-end">
                    <button 
                      onClick={() => setShowDeleteModal(null)}
                      className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleDelete(showDeleteModal)}
                      className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                    >
                      Delete Task
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="fixed bottom-6 right-6 z-40 bg-white dark:bg-slate-900 p-4 rounded-xl border border-blue-600/20 shadow-xl max-w-xs cursor-pointer">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600" />
            <p className="text-xs text-slate-600 dark:text-slate-400">Click the delete icon in the table to see the visual style of the delete confirmation process.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
