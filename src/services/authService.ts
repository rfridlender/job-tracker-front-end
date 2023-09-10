import * as tokenService from './tokenService';
import { 
  ChangePasswordFormData,
  LoginFormData,
} from '../types/forms';
import { User } from '../types/models';

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/auth`;

async function login(formData: LoginFormData): Promise<void> {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const json = await res.json();
    if (json.token) {
      tokenService.setToken(json.token);
    }
    if (json.err) {
      throw new Error(json.err);
    }
  } catch (error) {
    throw error;
  }
}

function logout(): void {
  tokenService.removeToken();
}

function getUser(): User | null {
  return tokenService.getUserFromToken()
}

async function changePassword(formData: ChangePasswordFormData): Promise<void> {
  try {
    const res = await fetch(`${BASE_URL}/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenService.getToken()}`,
      },
      body: JSON.stringify(formData),
    });
    const json = await res.json();
    if (json.token) {
      tokenService.removeToken();
      tokenService.setToken(json.token);
    }
    if (json.err) {
      throw new Error(json.err);
    }
  } catch (error) {
    throw error;
  }
}

export { login, logout, getUser, changePassword };
