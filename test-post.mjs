const BASE = 'http://localhost:3000';

// Test POST /api/artists with correct field name
const res = await fetch(BASE + '/api/artists', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    artistName: 'Test Artist',
    genres: ['Electronic'],
    bio: 'Test bio'
  })
});
const data = await res.json();
console.log('POST /api/artists:', res.status, JSON.stringify(data, null, 2));
