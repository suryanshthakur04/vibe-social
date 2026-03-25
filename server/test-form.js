async function testFormDataPost() {
  try {
    const baseURL = 'http://localhost:5000/api';

    // 1. Get Token
    const email = `testform${Date.now()}@example.com`;
    let res = await fetch(`${baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Form Data Tester',
        email: email,
        password: 'password123'
      })
    });
    let data = await res.json();
    const token = data.token;
    console.log('Got token');

    // 2. Post FormData
    const formData = new FormData();
    formData.append('content', 'Testing FormData without image');
    formData.append('mood', 'calm');
    formData.append('song', 'Test Song');

    res = await fetch(`${baseURL}/posts`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}` 
      },
      body: formData
    });
    
    // We expect 201
    const text = await res.text();
    console.log('Post Response:', res.status, text);
  } catch (err) {
    console.error('Fetch Error:', err);
  }
}

testFormDataPost();
