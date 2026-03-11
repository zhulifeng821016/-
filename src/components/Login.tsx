import React from 'react';
import { useAuth } from '../AuthContext';
import { db, collection, getDocs, doc, setDoc } from '../firebase';
import { User } from '../types';
import { motion } from 'motion/react';
import { Menu, ChevronDown } from 'lucide-react';

export const Login: React.FC = () => {
  const { signInAs } = useAuth();
  const [employees, setEmployees] = React.useState<User[]>([]);
  const [selectedUid, setSelectedUid] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const users = querySnapshot.docs.map(doc => doc.data() as User);
        
        if (users.length === 0) {
          // Seed initial users if empty
          const initialUsers: User[] = [
            { uid: 'admin_1', name: 'Administrator', role: 'admin' },
            { uid: 'emp_1', name: 'Zhang San', role: 'employee' },
            { uid: 'emp_2', name: 'Li Si', role: 'employee' },
            { uid: 'emp_3', name: 'Wang Wu', role: 'employee' },
            { uid: 'emp_4', name: 'Chen Mei', role: 'employee' },
            { uid: 'emp_5', name: 'Liu Yang', role: 'employee' },
          ];
          
          for (const u of initialUsers) {
            await setDoc(doc(db, 'users', u.uid), u);
          }
          setEmployees(initialUsers);
        } else {
          setEmployees(users);
        }
      } catch (e) {
        console.error("Error fetching employees", e);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleSignIn = () => {
    if (selectedUid) {
      signInAs(selectedUid);
    }
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex items-center justify-center min-h-screen p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex h-full min-h-[800px] w-full max-w-[480px] flex-col bg-white dark:bg-slate-900 overflow-hidden shadow-2xl rounded-3xl"
      >
        {/* Top Navigation Area */}
        <div className="flex items-center bg-white dark:bg-slate-900 p-4 pb-2 justify-between">
          <div className="text-slate-900 dark:text-slate-100 flex size-12 shrink-0 items-center justify-center">
            <Menu className="w-6 h-6" />
          </div>
          <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-12">TaskAssign</h2>
        </div>

        {/* Hero Section */}
        <div className="px-4 py-2">
          <div 
            className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-blue-600/10 rounded-2xl min-h-[240px] border border-blue-600/20"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000")' }}
          >
            <div className="p-6 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white/80 text-sm font-medium">Internal Employee Portal</p>
              <h1 className="text-white text-3xl font-bold leading-tight">Welcome Back</h1>
            </div>
          </div>
        </div>

        {/* Login Form Section */}
        <div className="flex flex-col gap-6 px-4 py-8">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Sign In</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Please identify yourself to access your daily tasks and schedule.</p>
          </div>

          <div className="flex flex-col gap-4">
            <label className="flex flex-col flex-1">
              <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2 px-1">Select Your Name</p>
              <div className="relative">
                <select 
                  value={selectedUid}
                  onChange={(e) => setSelectedUid(e.target.value)}
                  className="w-full appearance-none rounded-2xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600/50 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-14 px-4 text-base font-normal leading-normal transition-all"
                >
                  <option disabled value="">Choose from list</option>
                  {employees.map(emp => (
                    <option key={emp.uid} value={emp.uid}>{emp.name} ({emp.role})</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>
            </label>
          </div>

          <div className="flex pt-2">
            <button 
              onClick={handleSignIn}
              disabled={!selectedUid}
              className="flex w-full cursor-pointer items-center justify-center rounded-2xl h-14 px-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-base font-bold leading-normal tracking-wide transition-all shadow-lg shadow-blue-600/20"
            >
              Confirm Identity
            </button>
          </div>
        </div>

        <div className="flex-grow"></div>

        {/* Bottom Status Bar */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 mt-auto border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <p className="text-xs font-medium tracking-wide">Connected to Server (192.168.3.105)</p>
          </div>
          <p className="text-center text-[10px] text-slate-400 dark:text-slate-600 mt-2 uppercase tracking-widest">Version 2.4.1-stable</p>
        </div>
      </motion.div>
    </div>
  );
};
