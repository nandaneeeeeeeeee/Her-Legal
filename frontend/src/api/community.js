import { api } from './client';

export async function getPosts(params = {}) {
  const q = new URLSearchParams(params).toString();
  return api(`/community?${q}`);
}

export async function getPost(id) {
  return api(`/community/${id}`);
}

export async function createPost(data) {
  return api('/community', { method: 'POST', body: data });
}

export async function deletePost(id) {
  return api(`/community/${id}`, { method: 'DELETE' });
}

export async function getMyPosts() {
  return api('/community/my/posts');
}

export async function getSavedPosts() {
  return api('/community/my/saved');
}

export async function reactToPost(id, type) {
  return api(`/community/${id}/react`, { method: 'POST', body: { type } });
}

export async function savePost(id) {
  return api(`/community/${id}/save`, { method: 'POST' });
}

export async function reportPost(id, reason) {
  return api(`/community/${id}/report`, { method: 'POST', body: { reason } });
}

export async function addComment(id, text, isAnonymous = true) {
  return api(`/community/${id}/comments`, { method: 'POST', body: { text, isAnonymous } });
}

export async function getComments(id) {
  return api(`/community/${id}/comments`);
}

export async function deleteComment(postId, commentId) {
  return api(`/community/${postId}/comments/${commentId}`, { method: 'DELETE' });
}
