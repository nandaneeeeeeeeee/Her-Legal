import { api } from './client';

export async function login(email, password) {
  return api('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
}

export async function register(data) {
  return api('/auth/register', {
    method: 'POST',
    body: data,
    auth: false,
  });
}

export async function verifyEmail(email, verificationCode) {
  return api('/auth/verifyEmail', {
    method: 'POST',
    body: { email, verificationCode },
    auth: false,
  });
}

export async function forgotPassword(email) {
  return api('/auth/forgotPassword', {
    method: 'POST',
    body: { email },
    auth: false,
  });
}

export async function resetPassword(email, resetCode, newPassword, confirmPassword) {
  return api('/auth/resetPassword', {
    method: 'POST',
    body: { email, resetCode, newPassword, confirmPassword },
    auth: false,
  });
}

export async function googleAuth(idToken) {
  return api('/auth/google', {
    method: 'POST',
    body: { idToken },
    auth: false,
  });
}

export async function sendMagicLink(email) {
  return api('/auth/magic-link/send', {
    method: 'POST',
    body: { email },
    auth: false,
  });
}

export async function verifyMagicLink(token) {
  return api('/auth/magic-link/verify', {
    method: 'POST',
    body: { token },
    auth: false,
  });
}

export async function logout() {
  return api('/auth/logout', { method: 'POST' });
}

export async function validateToken() {
  return api('/auth/validateToken');
}

export async function changePassword(currentPassword, newPassword, confirmPassword) {
  return api('/auth/changePassword', {
    method: 'POST',
    body: { currentPassword, newPassword, confirmPassword },
  });
}
