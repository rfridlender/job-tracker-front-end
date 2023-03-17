import * as tokenService from './tokenService';
import { Job, User } from '../types/models';

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

export { index };
