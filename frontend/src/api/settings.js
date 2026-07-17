import { api } from './client';
import { changePassword as changePw } from './auth';

export async function getProfile() {
  return api('/settings/profile');
}

export async function updateProfile(data) {
  return api('/settings/profile', { method: 'PUT', body: data });
}

export async function updatePreferences(data) {
  return api('/settings/preferences', { method: 'PUT', body: data });
}

export async function completeOnboarding(data) {
  return api('/settings/onboarding', { method: 'POST', body: data });
}

export { changePw as changePassword };
