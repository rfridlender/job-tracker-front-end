import { ContractorFormData } from '../types/forms';
import { Contractor } from '../types/models';
import * as tokenService from './tokenService';

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/builders`;

async function index(): Promise<Contractor[]> {
  try {
    const res = await fetch(BASE_URL, {
      headers: {
        'Authorization': `Bearer ${tokenService.getToken()}`,
      },
    });
    return await res.json() as Contractor[];
  } catch (error) {
    throw error;
  }
}

async function create(formData: ContractorFormData): Promise<Contractor> {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenService.getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    });
    return await res.json() as Contractor;
  } catch (error) {
    throw error;
  }
}

async function update(contractorId: number, formData: ContractorFormData): Promise<Contractor> {
  try {
    const res = await fetch(`${BASE_URL}/${contractorId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${tokenService.getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    });
    return await res.json() as Contractor;
  } catch (error) {
    throw error;
  }
}

async function deleteContractor(contractorId: number): Promise<Contractor> {
  try {
    const res = await fetch(`${BASE_URL}/${contractorId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${tokenService.getToken()}`,
      },
    });
    return await res.json() as Contractor;
  } catch (error) {
    throw error;
  }
}

export { index, create, update, deleteContractor as delete };