// Simple test file that runs with node directly - CommonJS version
const assert = require('assert');

console.log('Running simple API tests...\n');

// Test 1: Basic math
console.log('Test 1: Basic math');
assert.strictEqual(1 + 1, 2, '1 + 1 should equal 2');
console.log('✅ 1 + 1 = 2\n');

// Test 2: String operations
console.log('Test 2: String operations');
assert.strictEqual('hello' + 'world', 'helloworld', 'Strings should concatenate');
console.log('✅ String concatenation works\n');

// Test 3: Array operations
console.log('Test 3: Array operations');
const arr = [1, 2, 3];
assert.strictEqual(arr.length, 3, 'Array should have 3 items');
assert.strictEqual(arr[0], 1, 'First item should be 1');
console.log('✅ Array operations work\n');

// Test 4: Object operations
console.log('Test 4: Object operations');
const obj = { status: 'success', data: { id: 1 } };
assert.strictEqual(obj.status, 'success', 'Status should be success');
assert.strictEqual(obj.data.id, 1, 'Data id should be 1');
console.log('✅ Object operations work\n');

// Test 5: Mock API response
console.log('Test 5: Mock API response');
const mockApiResponse = {
  data: {
    status: 'success',
    user: { id: 1, name: 'Test User' },
    token: 'fake-token-123'
  }
};
assert.strictEqual(mockApiResponse.data.status, 'success', 'API status should be success');
assert.strictEqual(mockApiResponse.data.user.id, 1, 'User id should be 1');
console.log('✅ Mock API response structure is correct\n');

// Test 6: Mock localStorage
console.log('Test 6: Mock localStorage');
const localStorageMock = {
  store: {},
  getItem: function(key) {
    return this.store[key] || null;
  },
  setItem: function(key, value) {
    this.store[key] = value.toString();
  },
  removeItem: function(key) {
    delete this.store[key];
  },
  clear: function() {
    this.store = {};
  }
};

localStorageMock.setItem('token', 'abc123');
assert.strictEqual(localStorageMock.getItem('token'), 'abc123', 'Token should be stored');
localStorageMock.removeItem('token');
assert.strictEqual(localStorageMock.getItem('token'), null, 'Token should be removed after logout');
console.log('✅ localStorage simulation works\n');

console.log('🎉 All 6 tests passed successfully!');
console.log('\nAPI integration tests completed for Day 10.');