import { api } from './client';

export async function getTemplates() {
  return api('/documents/templates');
}

export async function generateDocument(type, formData) {
  return api('/documents/generate', { method: 'POST', body: { type, formData } });
}

export async function saveDocument(title, type, content, formData) {
  return api('/documents', { method: 'POST', body: { title, type, content, formData } });
}

export async function getDocuments() {
  return api('/documents');
}

export async function getDocument(id) {
  return api(`/documents/${id}`);
}

export async function deleteDocument(id) {
  return api(`/documents/${id}`, { method: 'DELETE' });
}
