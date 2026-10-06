import pg from 'pg';
const { Client } = pg;
const client = new Client({ connectionString: 'postgresql://postgres:123456@localhost:5432/dayar_db' });
async function run() {
  await client.connect();
  await client.query('UPDATE apartments SET images = $1', [[]]);
  console.log('Cleared all apartment images to use logos.');
  await client.end();
}
run();
