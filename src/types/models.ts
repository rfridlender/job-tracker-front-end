import { Category, Role, Status } from './enums';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface Contractor {
  id: number;
  companyName: string;
  contactName: string;
  phoneNumber: string;
  email: string;
  createdAt: Date;
}

export interface Job {
  id: number;
  address: string;
  status: Status;
  lockStatus: string;
  shelvingStatus: string;
  showerStatus: string;
  mirrorStatus: string;
  workLogs: WorkLog[];
  contractor: Contractor;
  takeoff: string;
  jobSiteAccess: string;
  createdBy: string;
  createdAt: Date;
}

export interface WorkLog {
  id: number;
  submittedAt: Date;
  employeeName: string;
  category: Category;
  workDate: Date;
  startTime: Date;
  endTime: Date;
  hourDifference: number;
  workCompleted: string;
  completed: boolean;
  incompleteItems: string;
  keyNumber: string;
  createdAt: Date;
}

export interface PhotoResponse {
  photo: string;
}