import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, doc, getDoc, updateDoc } from '../firebase';
import { Task } from '../types';
import { ArrowLeft, MoreVertical, Target, ClipboardList, Play, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';

export const TaskDetails: React.FC = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) return;
      try {
        const docSnap = await getDoc(doc(db, 'tasks', taskId));
        if (docSnap.exists()) {
          setTask({ id: docSnap.id, ...docSnap.data() } as Task);
        }
      } catch (e) {
        console.error("Error fetching task", e);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [taskId]);

  const handleStartProgress = async () => {
    if (!task) return;
    try {
      await updateDoc(doc(db, 'tasks', task.id), { status: 'in-progress' });
      setTask({ ...task, status: 'in-progress' });
    } catch (e) {
      console.error("Error starting task", e);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!task) return <div className="flex items-center justify-center min-h-screen">Task not found</div>;

  return (
    <div className="bg-slate-100 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 min-h-screen flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-[480px] w-full min-h-screen flex flex-col bg-white dark:bg-slate-900 shadow-xl"
      >
        {/* Top App Bar */}
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center p-4 h-16">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mr-2"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold tracking-tight">Task Details</h1>
            <div className="ml-auto flex items-center gap-2">
              <button className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <main className="flex-1 p-6 space-y-8 overflow-y-auto">
          {/* Task Header Section */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                task.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' :
                task.status === 'in-progress' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Due {task.dueAt ? format(task.dueAt.toDate(), 'MMM d, h:mm a') : 'Today, 5:00 PM'}
              </span>
            </div>
            <h2 className="text-2xl font-bold leading-tight tracking-tight select-text">
              {task.title}
            </h2>
          </section>

          {/* Task Goal */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-blue-600">
              <Target className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Task Goal</h3>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 select-text">
                {task.goal || "No goal specified for this task."}
              </p>
            </div>
          </section>

          {/* Process Details */}
          {task.processDetails && task.processDetails.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-blue-600">
                <ClipboardList className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Process Details</h3>
              </div>
              <div className="space-y-4">
                {task.processDetails.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="size-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold">
                        {index + 1}
                      </div>
                      {index < task.processDetails!.length - 1 && (
                        <div className="w-0.5 h-full bg-slate-200 dark:bg-slate-800 mt-2"></div>
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="text-base text-slate-700 dark:text-slate-300 select-text">
                        {step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Additional Metadata */}
          <section className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Assigned To</span>
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold">JD</div>
                <p className="text-sm font-medium">John Doe</p>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Priority</span>
              <div className={`flex items-center gap-2 ${task.priority === 'high' ? 'text-amber-600' : 'text-blue-600'}`}>
                <AlertTriangle className="w-4 h-4 fill-current" />
                <p className="text-sm font-medium capitalize">{task.priority} Priority</p>
              </div>
            </div>
          </section>
        </main>

        {/* Action Footer */}
        <footer className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          {task.status === 'pending' ? (
            <button 
              onClick={handleStartProgress}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Start Progress</span>
              <Play className="w-5 h-5 fill-current" />
            </button>
          ) : task.status === 'in-progress' ? (
            <button 
              onClick={async () => {
                await updateDoc(doc(db, 'tasks', task.id), { status: 'completed' });
                navigate('/tasks');
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Mark as Completed</span>
              <CheckCircle className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-full py-4 text-center text-green-600 font-bold">
              Task Completed
            </div>
          )}
        </footer>
      </motion.div>
    </div>
  );
};
