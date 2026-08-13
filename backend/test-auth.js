const http = require('http');

function makeRequest(path, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('1. Valid Registration');
  let res = await makeRequest('/auth/register', { email: 'test@example.com', password: 'ValidPassword123!', fullName: 'Test User' });
  console.log('Status:', res.status, 'Body:', res.body);

  console.log('\n2. Duplicate Email');
  res = await makeRequest('/auth/register', { email: 'test@example.com', password: 'ValidPassword123!', fullName: 'Test User' });
  console.log('Status:', res.status, 'Body:', res.body);

  console.log('\n3. Weak Password');
  res = await makeRequest('/auth/register', { email: 'test2@example.com', password: '123' });
  console.log('Status:', res.status, 'Body:', res.body);

  console.log('\n4. Successful Login');
  res = await makeRequest('/auth/login', { email: 'admin@midnightacademy.local', password: 'admin123' });
  console.log('Status:', res.status, 'Body:', res.body);

  console.log('\n5. Failed Login (wrong password)');
  res = await makeRequest('/auth/login', { email: 'admin@midnightacademy.local', password: 'wrong' });
  console.log('Status:', res.status, 'Body:', res.body);

  console.log('\n6. Failed Login (unknown email)');
  res = await makeRequest('/auth/login', { email: 'unknown@midnightacademy.local', password: 'admin123' });
  console.log('Status:', res.status, 'Body:', res.body);
}

runTests().catch(console.error);
