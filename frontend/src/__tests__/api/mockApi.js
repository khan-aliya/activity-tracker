// Mock implementations for testing - CommonJS syntax
const authService = {
  register: async (userData) => {
    return {
      data: {
        status: 'success',
        user: { id: 1, ...userData },
        token: 'fake-token-123'
      }
    };
  },
  
  login: async (credentials) => {
    return {
      data: {
        status: 'success',
        user: { id: 1, email: credentials.email },
        token: 'fake-token-456'
      }
    };
  },
  
  logout: async () => {
    return {
      data: {
        status: 'success',
        message: 'Logged out'
      }
    };
  },
  
  getUser: async () => {
    return {
      data: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com'
      }
    };
  }
};

const activityService = {
  getAll: async (params = {}) => {
    return {
      data: {
        activities: [
          { id: 1, title: 'Morning Run', category: 'Self-care', duration: 45 },
          { id: 2, title: 'Work', category: 'Productivity', duration: 120 }
        ]
      }
    };
  },
  
  create: async (activity) => {
    return {
      data: {
        status: 'success',
        activity: { id: 3, ...activity }
      }
    };
  },
  
  update: async (id, activity) => {
    return {
      data: {
        status: 'success',
        activity: { id, ...activity }
      }
    };
  },
  
  delete: async (id) => {
    return {
      data: {
        status: 'success',
        message: 'Activity deleted'
      }
    };
  },
  
  getCategories: async () => {
    return {
      data: {
        categories: ['Self-care', 'Productivity', 'Reward']
      }
    };
  }
};

const api = {
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() }
  }
};

module.exports = { authService, activityService, api };