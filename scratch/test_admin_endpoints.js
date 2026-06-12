async function testAdminEndpoints() {
  console.log('Testing admin endpoints with credentials...');

  let token = null;

  // 1. Admin login
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        usernameOrEmail: 'Admin',
        password: 'UMAAdmin@26'
      })
    });
    const data = await res.json();
    console.log('Login status:', res.status);
    if (res.status === 200) {
      token = data.token;
      console.log('Login successful. Token acquired.');
    } else {
      console.log('Login failed:', data);
      return;
    }
  } catch (err) {
    console.error('Login request failed:', err.message);
    return;
  }

  // 2. Fetch admin memberships
  try {
    const res = await fetch('http://localhost:5000/api/memberships', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    console.log('GET /api/memberships. Status:', res.status, 'Data:', data);
  } catch (err) {
    console.error('GET /api/memberships failed:', err.message);
  }

  // 3. Fetch admin nominations
  try {
    const res = await fetch('http://localhost:5000/api/awards/admin/nominations', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    console.log('GET /api/awards/admin/nominations. Status:', res.status, 'Data:', data);
  } catch (err) {
    console.error('GET /api/awards/admin/nominations failed:', err.message);
  }
}

testAdminEndpoints();
