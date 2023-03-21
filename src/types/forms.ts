import { Category, Role, Status } from './enums';
import { Contractor } from './models';

/* ---------==== custom forms ====--------- */

export interface ContractorFormData {
  id: number;
  companyName: string;
  contactName: string;
  phoneNumber: string;
  email: string;
}

export interface JobFormData {
  id: number;
  address: string;
  status: Status;
  lockStatus: string;
  shelvingStatus: string;
  showerStatus: string;
  mirrorStatus: string;
  contractor: Contractor | undefined;
  jobSiteAccess: string;
}

export interface PhotoFormData {
  photo: File | null;
}

export interface WorkLogFormData {
  id: number;
  category: Category;
  workDate: string;
  startTime: string;
  endTime: string;
  workCompleted: string;
  completed: boolean;
  incompleteItems: string;
  keyNumber: string;
}

/* ---------===== auth forms =====--------- */

export interface LoginFormData {
  email: string;
  password: string;
}

export interface UserFormData {
  id: number;
  name: string;
  email: string;
  password: string;
  passwordConf: string;
  role: Role;
}

export interface ChangePasswordFormData {
  oldPassword: string;
  newPassword: string;
  newPasswordConf: string;
}
