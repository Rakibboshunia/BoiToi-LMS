async function test() {
  try {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test' + Date.now() + '@example.com',
        password: 'password123',
        role: 'student'
      })
    });
    const data = await res.json();
    console.log(res.status, data);
  } catch (err) {
    console.error(err.message);
  }
}
test();
