import * as tokenService from './tokenService';
import { Job, User } from '../types/models';
import { JobFormData, PhotoFormData } from '../types/forms';

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/jobs`;

async function index(): Promise<Job[]> {
  try {
    const res = await fetch(BASE_URL, {
      headers: {
        'Authorization': `Bearer ${tokenService.getToken()}`,
      },
    });
    return await res.json() as Job[];
  } catch (error) {
    throw error;
  }
}

async function create(formData: JobFormData, photoFormData: PhotoFormData): Promise<Job> {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenService.getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    });
    const job = await res.json() as Job;
    if (photoFormData.photo) {
      const photoData = new FormData()
      photoData.append('photo', photoFormData.photo)
      job.takeoff = await addPhoto(job.id, photoData)
    }
    return job;
  } catch (error) {
    throw error;
  }
}

async function update(jobId: number, formData: JobFormData, photoFormData: PhotoFormData): Promise<Job> {
  try {
    const res = await fetch(`${BASE_URL}/${jobId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${tokenService.getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    });
    const job = await res.json() as Job;
    if (photoFormData.photo) {
      const photoData = new FormData()
      photoData.append('photo', photoFormData.photo)
      job.takeoff = await addPhoto(job.id, photoData)
    }
    return job;
  } catch (error) {
    throw error;
  }
}

async function deleteJob(jobId: number): Promise<Job> {
  try {
    const res = await fetch(`${BASE_URL}/${jobId}`, {
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

async function addPhoto( jobId: number, photoData: FormData): Promise<string> {
  try {
    const res = await fetch(`${BASE_URL}/${jobId}/add-photo`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${tokenService.getToken()}`
      },
      body: photoData
    })
    return await res.json() as string
  } catch (error) {
    throw error
  }
}

export { index, create, update, deleteJob as delete, addPhoto };
