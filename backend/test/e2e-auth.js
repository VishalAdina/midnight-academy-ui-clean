const http = require('http');

function makeRequest(path, data, token = null) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'POST',
      headers
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('1. Registration (gets tokens)');
  const email = `test-${Date.now()}@example.com`;
  let res = await makeRequest('/auth/register', { email, password: 'ValidPassword123!', fullName: 'Test User' });
  console.log('Status:', res.status, 'Tokens Present:', !!res.body.accessToken, !!res.body.refreshToken);
  
  const originalRefreshToken = res.body.refreshToken;
  const accessToken = res.body.accessToken;

  console.log('\n2. Successful Login');
  res = await makeRequest('/auth/login', { email: 'admin@midnightacademy.local', password: 'admin123' });
  console.log('Status:', res.status, 'Tokens Present:', !!res.body.accessToken, !!res.body.refreshToken);
  
  console.log('\n3. Refresh with valid token (Rotation check)');
  res = await makeRequest('/auth/refresh', { refreshToken: originalRefreshToken });
  console.log('Status:', res.status, 'New Tokens Present:', !!res.body.accessToken, !!res.body.refreshToken);
  const newRefreshToken = res.body.refreshToken;

  console.log('\n4. Refresh with OLD token (should fail)');
  res = await makeRequest('/auth/refresh', { refreshToken: originalRefreshToken });
  console.log('Status:', res.status, 'Message:', res.body.message);

  console.log('\n5. Logout with valid access token and new refresh token');
  res = await makeRequest('/auth/logout', { refreshToken: newRefreshToken }, accessToken);
  console.log('Status:', res.status, 'Body:', res.body);

  console.log('\n6. Refresh with REVOKED token (should fail)');
  res = await makeRequest('/auth/refresh', { refreshToken: newRefreshToken });
  console.log('Status:', res.status, 'Message:', res.body.message);

  console.log('\n7. Logout with INVALID access token');
  res = await makeRequest('/auth/logout', { refreshToken: newRefreshToken }, 'invalid_token_xyz');
  console.log('Status:', res.status, 'Message:', res.body.message);
}

runTests().catch(console.error);
