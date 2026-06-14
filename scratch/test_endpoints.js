const fs = require('fs');
const path = require('path');

async function testEndpoints() {
  console.log('Testing membership and awards endpoints using native fetch...');

  // 1. Test GET /api/memberships/types
  try {
    const res = await fetch('http://127.0.0.1:5000/api/memberships/types');
    const data = await res.json();
    console.log('GET /api/memberships/types success. Status:', res.status, 'Types count:', data.length);
  } catch (err) {
    console.error('GET /api/memberships/types failed:', err.message);
  }

  // 2. Test POST /api/memberships/register
  try {
    const res = await fetch('http://127.0.0.1:5000/api/memberships/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Test Member',
        email: 'testmember@example.com',
        phone: '1234567890',
        address: '123 Main St, Udupi',
        occupation: 'Software Developer',
        membershipTypeId: 1
      })
    });
    const data = await res.json();
    console.log('POST /api/memberships/register. Status:', res.status, 'Data:', data);
  } catch (err) {
    console.error('POST /api/memberships/register failed:', err.message);
  }

  // 3. Test GET /api/awards
  try {
    const res = await fetch('http://127.0.0.1:5000/api/awards');
    const data = await res.json();
    console.log('GET /api/awards success. Status:', res.status, 'Awards count:', data.length);
  } catch (err) {
    console.error('GET /api/awards failed:', err.message);
  }

  // 4. Test POST /api/awards/nominate
  try {
    const dummyFilePath = path.join(__dirname, 'dummy.txt');
    fs.writeFileSync(dummyFilePath, 'dummy pdf content');

    // Create native FormData
    const formData = new FormData();
    formData.append('award_id', '1');
    formData.append('nominee_name', 'Test Nominee');
    formData.append('organization', 'Test Org');
    formData.append('email', 'nominee@example.com');
    formData.append('phone', '0987654321');

    // Load file as Blob
    const fileBuffer = fs.readFileSync(dummyFilePath);
    const fileBlob = new Blob([fileBuffer], { type: 'application/pdf' });
    formData.append('document', fileBlob, 'dummy.pdf');

    const res = await fetch('http://127.0.0.1:5000/api/awards/nominate', {
      method: 'POST',
      body: formData // native fetch automatically sets boundary
    });
    const data = await res.json();
    console.log('POST /api/awards/nominate. Status:', res.status, 'Data:', data);

    // Clean up
    fs.unlinkSync(dummyFilePath);
  } catch (err) {
    console.error('POST /api/awards/nominate failed:', err.message);
  }
}

testEndpoints();
