

async function test() {
  const email = `test${Date.now()}@example.com`;
  console.log('Testing signup...');
  const signupRes = await fetch('http://localhost:5000/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test', email, password: 'password123' })
  });
  console.log('Signup status:', signupRes.status);
  
  const cookies = signupRes.headers.get('set-cookie');
  console.log('Signup set-cookie:', cookies);
  
  const cookieHeader = cookies;
  
  console.log('\\nTesting refresh...');
  const refreshRes = await fetch('http://localhost:5000/api/auth/refresh', {
    method: 'POST',
    headers: { 'Cookie': cookieHeader }
  });
  console.log('Refresh status:', refreshRes.status);
  const refreshCookies = refreshRes.headers.get('set-cookie');
  console.log('Refresh set-cookie:', refreshCookies);
  
  console.log('\\nTesting logout...');
  const logoutRes = await fetch('http://localhost:5000/api/auth/logout', {
    method: 'POST',
    headers: { 'Cookie': refreshCookies }
  });
  console.log('Logout status:', logoutRes.status);
  console.log('Logout set-cookie:', logoutRes.headers.get('set-cookie'));
}

test();

