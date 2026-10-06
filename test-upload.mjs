import fs from 'fs';

async function testUpload() {
  const buffer = fs.readFileSync('./attached_assets/ديار_بدون_خلفيه-02_1783264617965.png');
  const blob = new Blob([buffer], { type: 'image/png' });
  
  const form = new FormData();
  form.append('image', blob, 'logo.png');

  try {
    const response = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: form
    });
    const text = await response.text();
    console.log('Status:', response.status);
    console.log('Response:', text);
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

testUpload();
