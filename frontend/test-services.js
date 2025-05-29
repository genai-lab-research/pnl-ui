// Quick test script to verify services work
console.log('Testing API services...');

// Test if fetch works with mock fallback
fetch('http://localhost:8000/api/v1/containers')
  .then(response => {
    console.log('API Response Status:', response.status);
    return response.json().catch(() => ({ error: 'Parse error' }));
  })
  .then(data => {
    console.log('API Response:', data);
  })
  .catch(error => {
    console.log('API Error (expected in dev):', error.message);
    console.log('Mock fallback should activate...');
  });