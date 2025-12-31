import api from './api';

export const fetchActivities = async (filters = {}) => {
  const response = await api.get('/activities', { params: filters }); // Add params support
  return response;
};

export const fetchActivityById = async (id) => {
  const response = await api.get(`/activities/${id}`);
  return response;
};

export const createActivity = async (activityData) => {
  const response = await api.post('/activities', activityData);
  return response;
};

export const updateActivity = async (id, activityData) => {
  const response = await api.put(`/activities/${id}`, activityData);
  return response;
};

export const deleteActivity = async (id) => {
  const response = await api.delete(`/activities/${id}`);
  return response;
};

// ADD THIS MISSING FUNCTION
export const getActivitySummary = async () => {
  const response = await api.get('/activities/summary');
  return response;
};

export default {
  fetchActivities,
  fetchActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  getActivitySummary, // Add to default export
};