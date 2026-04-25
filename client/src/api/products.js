import api from './client.js';

export const listProducts = (params = {}) =>
  api.get('/api/products', { params }).then((r) => r.data.products);

export const getProduct = (slug) =>
  api.get(`/api/products/${slug}`).then((r) => r.data.product);

export const createProduct = (payload) =>
  api.post('/api/products', payload).then((r) => r.data.product);

export const updateProduct = (id, payload) =>
  api.put(`/api/products/${id}`, payload).then((r) => r.data.product);

export const deleteProduct = (id) =>
  api.delete(`/api/products/${id}`).then((r) => r.data);

export const uploadImage = (file) => {
  const fd = new FormData();
  fd.append('file', file);
  return api
    .post('/api/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((r) => r.data);
};
