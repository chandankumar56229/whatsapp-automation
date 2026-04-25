import api from './client.js';

export const sendContact = (payload) =>
  api.post('/api/contact', payload).then((r) => r.data);

export const listMessages = () =>
  api.get('/api/contact').then((r) => r.data.messages);

export const markRead = (id) =>
  api.patch(`/api/contact/${id}/read`).then((r) => r.data);

export const deleteMessage = (id) =>
  api.delete(`/api/contact/${id}`).then((r) => r.data);
