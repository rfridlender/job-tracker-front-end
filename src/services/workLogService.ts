import { WorkLogFormData } from '../types/forms';
import { Job, WorkLog } from '../types/models';
import * as tokenService from './tokenService';

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/logs`;

async function create(formData: WorkLogFormData): Promise<Job> {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenService.getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    });
    return await res.json() as Job;
  } catch (error) {
    throw error;
  }
}

async function update(workLogId: number, formData: WorkLogFormData): Promise<Job> {
  try {
    const res = await fetch(`${BASE_URL}/${workLogId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${tokenService.getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    });
    return await res.json() as Job;
  } catch (error) {
    throw error;
  }
}

async function deleteWorkLog(workLogId: number): Promise<Job> {
  try {
    const res = await fetch(`${BASE_URL}/${workLogId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${tokenService.getToken()}`,
      },
    });
    return await res.json() as Job;
  } catch (error) {
    throw error;
  }
}

export { create, update, deleteWorkLog as delete };