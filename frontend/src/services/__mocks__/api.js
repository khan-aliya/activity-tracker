// Mock for the api service
const mockApi = {
  interceptors: {
    request: {
      use: jest.fn()
    },
    response: {
      use: jest.fn()
    }
  }
};

export default mockApi;
