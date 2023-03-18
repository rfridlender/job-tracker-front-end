import { Category, Status } from './enums';
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
    address: string;
    status: Status;
    lockStatus: string;
    shelvingStatus: string;
    showerStatus: string;
    mirrorStatus: string;
    contractor: Contractor | null;
    jobSiteAccess: string;
}

export interface PhotoFormData {
  photo: File | null;
}

export interface WorkLogFormData {
  category: Category;
  workDate: Date;
  startTime: number;
  endTime: number;
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

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  passwordConf: string;
}

export interface ChangePasswordFormData {
  oldPassword: string;
  newPassword: string;
  newPasswordConf: string;
}
