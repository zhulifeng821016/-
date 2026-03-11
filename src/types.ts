export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskPriority = 'high' | 'medium' | 'low';
export type UserRole = 'admin' | 'employee';

export interface User {
  uid: string;
  name: string;
  email?: string;
  role: UserRole;
  photoUrl?: string;
}

export interface Task {
  id: string;
  title: string;
  goal?: string;
  processDetails?: string[];
  status: TaskStatus;
  priority: TaskPriority;
  assignedToUid: string;
  postedAt: any; // Firestore Timestamp
  dueAt?: any; // Firestore Timestamp
  createdByUid: string;
}
