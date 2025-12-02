import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const error = data.message || "Something went wrong";
    toast.error(error);
    throw new Error(error);
  }
  return data;
};

export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  post: async (endpoint, body) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  put: async (endpoint, body) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  delete: async (endpoint) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
};

export const userAPI = {
  getMe: () => api.get("/api/user/me"),
  updateProfile: (data) => api.put("/api/user/update", data),
  getCredits: () => api.get("/api/user/credits"),
};

export const curriculumAPI = {
  create: (data) => api.post("/api/curriculum/create", data),
  getAll: (params) => api.get(`/api/curriculum?${new URLSearchParams(params)}`),
  getById: (id) => api.get(`/api/curriculum/${id}`),
  update: (id, data) => api.put(`/api/curriculum/${id}`, data),
  delete: (id) => api.delete(`/api/curriculum/${id}`),
};

export const quizAPI = {
  generate: (curriculumId) =>
    api.post(`/api/curriculum/${curriculumId}/quiz/generate`),
  get: (curriculumId) => api.get(`/api/curriculum/${curriculumId}/quiz`),
  submit: (curriculumId, answers) =>
    api.post(`/api/curriculum/${curriculumId}/quiz/submit`, { answers }),
  delete: (curriculumId) => api.delete(`/api/curriculum/${curriculumId}/quiz`),
};

export const mentorAPI = {
  chat: (data) => api.post("/api/mentor/chat", data),
};

export const adminAPI = {
  getUsers: (params) =>
    api.get(`/api/admin/users?${new URLSearchParams(params)}`),
  getUser: (id) => api.get(`/api/admin/users/${id}`),
  updateUserRole: (id, role) =>
    api.put(`/api/admin/users/${id}/role`, { role }),
  updateUserCredits: (id, credits) =>
    api.put(`/api/admin/users/${id}/credits`, { credits }),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),
  getCurricula: (params) =>
    api.get(`/api/admin/curriculum?${new URLSearchParams(params)}`),
  getCurriculum: (id) => api.get(`/api/admin/curriculum/${id}`),
  deleteCurriculum: (id) => api.delete(`/api/admin/curriculum/${id}`),
  getStats: () => api.get("/api/admin/stats"),
};
