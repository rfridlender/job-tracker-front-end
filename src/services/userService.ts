import { UserFormData } from '../types/forms';
import { User } from '../types/models';
import * as tokenService from './tokenService';

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/users`;

async function index(): Promise<User[]> {
  try {
    const res = await fetch(BASE_URL, {
      headers: {
        'Authorization': `Bearer ${tokenService.getToken()}`,
      },
    });
    return await res.json() as User[];
  } catch (error) {
    throw error;
  }
}

async function create(formData: UserFormData): Promise<User> {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenService.getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    });
    return await res.json() as User;
  } catch (error) {
    throw error;
  }
}

async function update(userId: number, formData: UserFormData): Promise<User> {
  try {
    const res = await fetch(`${BASE_URL}/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${tokenService.getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    });
    return await res.json() as User;
  } catch (error) {
    throw error;
  }
}

async function deleteUser(userId: number): Promise<User> {
  try {
    const res = await fetch(`${BASE_URL}/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${tokenService.getToken()}`,
      },
    });
    return await res.json() as User;
  } catch (error) {
    throw error;
  }
}

export { index, create, update, deleteUser as delete };