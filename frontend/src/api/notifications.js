import { api } from './client';

export async function getNotifications(page = 1) {
  return api(`/notifications?page=${page}`);
}

export async function markAsRead(id) {
  return api(`/notifications/${id}/read`, { method: 'PATCH' });
}

export async function markAllAsRead() {
  return api('/notifications/all/read', { method: 'PATCH' });
}

export async function deleteNotification(id) {
  return api(`/notifications/${id}`, { method: 'DELETE' });
}

export async function clearAllNotifications() {
  return api('/notifications/all', { method: 'DELETE' });
}
