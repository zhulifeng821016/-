import React, { useState, useEffect } from 'react';
import { Layout } from './Layout';
import { useAuth } from '../AuthContext';
import { db, collection, query, where, onSnapshot, updateDoc, doc } from '../firebase';
import { Task, TaskStatus } from '../types';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

export const TaskList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<TaskStatus>('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'tasks'),
      where('assignedToUid', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      setTasks(taskData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredTasks = tasks.filter(t => t.status === activeTab);

  const handleComplete = async (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    try {
      await updateDoc(doc(db, 'tasks', taskId), { status: 'completed' });
    } catch (e) {
      console.error("Error updating task", e);
    }
  };

  const tabs = [
    { id: 'pending', label: 'Pending', count: tasks.filter(t => t.status === 'pending').length },
    { id: 'in-progress', label: 'In Progress', count: tasks.filter(t => t.status === 'in-progress').length },
    { id: 'completed', label: 'Completed', count: tasks.filter(t => t.status === 'completed').length },
  ];

  return (
    <Layout 
      title="My Tasks" 
      showTabs 
      activeTab={activeTab} 
      onTabChange={(tab) => setActiveTab(tab as TaskStatus)}
      tabs={tabs}
    >
      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => navigate(`/tasks/${task.id}`)}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden cursor-pointer hover:border-blue-600/30 transition-all"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold leading-tight text-slate-900 dark:text-slate-50">{task.title}</h3>
                    {task.priority === 'high' && (
                      <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider rounded-lg">High Priority</span>
                    )}
                    {task.priority === 'medium' && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded-lg">Medium</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{task.goal}</p>
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-slate-400 uppercase font-bold tracking-widest">Posted</span>
                      <span className="text-sm font-medium">
                        {task.postedAt?.toDate ? format(task.postedAt.toDate(), 'MMM d, yyyy') : 'Recently'}
                      </span>
                    </div>
                    {task.status !== 'completed' && (
                      <button 
                        onClick={(e) => handleComplete(e, task.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : !loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">No {activeTab} tasks</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-1">You're all caught up for today!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {user?.role === 'admin' && (
        <button 
          onClick={() => navigate('/admin/create-task')}
          className="fixed bottom-24 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform active:scale-95 z-40"
        >
          <Plus className="w-8 h-8" />
        </button>
      )}
    </Layout>
  );
};
