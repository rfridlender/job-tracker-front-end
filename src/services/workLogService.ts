import { WorkLogFormData } from '../types/forms';
import { Job, WorkLog } from '../types/models';
import * as tokenService from './tokenService';

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/jobs`;

async function create(jobId: number, formData: WorkLogFormData): Promise<Job> {
  try {
    const res = await fetch(`${BASE_URL}/${jobId}/logs`, {
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

async function update(jobId: number, workLogId: number, formData: WorkLogFormData): Promise<Job> {
  try {
    const res = await fetch(`${BASE_URL}/${jobId}/logs/${workLogId}`, {
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

async function deleteWorkLog(jobId: number, workLogId: number): Promise<Job> {
  try {
    const res = await fetch(`${BASE_URL}/${jobId}/logs/${workLogId}`, {
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