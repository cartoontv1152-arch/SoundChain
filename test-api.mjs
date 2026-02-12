const BASE = 'http://localhost:3000';

async function test(method, path, body) {
  try {
    const opts = { method, headers: {} };
    if (body) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }
    const r = await fetch(BASE + path, opts);
    const text = await r.text();
    const isJson = text.startsWith('{') || text.startsWith('[');
    console.log(`${method} ${path}: ${r.status} ${isJson ? '(JSON)' : '(HTML)'}`);
    if (r.status >= 400 || !isJson) {
      console.log(`  Preview: ${text.substring(0, 200)}`);
    }
  } catch (e) {
    console.log(`${method} ${path}: ERROR - ${e.message}`);
  }
}

await test('GET', '/api/artists');
await test('POST', '/api/artists', { name: 'Test Artist', walletAddress: '0x1234567890abcdef1234567890abcdef12345678', genres: ['Electronic'] });
await test('GET', '/api/tracks');
await test('GET', '/api/search?q=test');
await test('GET', '/api/playlists');

console.log('\nDone.');
