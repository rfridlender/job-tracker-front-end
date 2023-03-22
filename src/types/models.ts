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
  takeoffOne: string;
  takeoffTwo: string;
  jobSiteAccess: string;
  createdBy: string;
  createdAt: Date;
}

export interface WorkLog {
  id: number;
  employeeName: string;
  category: Category;
  workDate: string;
  startTime: string;
  endTime: string;
  hourDifference: number;
  workCompleted: string;
  completed: boolean;
  incompleteItems: string;
  keyNumber: string;
  submittedAt: Date;
}

export interface PhotoResponse {
  photo: string;
}