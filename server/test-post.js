async function testPost() {
  try {
    const baseURL = 'http://localhost:5000/api';

    console.log('1. Registering fake user...');
    const email = `test${Date.now()}@example.com`;
    
    let res = await fetch(`${baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Integration Test Vibe',
        email: email,
        password: 'password123'
      })
    });
    
    let data = await res.json();
    console.log('Register Response:', res.status, data);
    const token = data.token;

    console.log('2. Attempting to create a Vibe...');
    res = await fetch(`${baseURL}/posts`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        content: 'This is a test reflection',
        mood: 'calm',
        song: 'Test Track - Artist'
      })
    });
    
    data = await res.json();
    console.log('Post Response:', res.status, data);
  } catch (err) {
    console.error('Fetch Error:', err);
  }
}

testPost();
