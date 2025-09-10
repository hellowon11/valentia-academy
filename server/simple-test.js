console.log('Testing dotenv...');
require('dotenv').config();

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);

// Test if we can read the file directly
const fs = require('fs');
try {
  const envContent = fs.readFileSync('.env', 'utf8');
  console.log('Raw .env content:');
  console.log(envContent);
} catch (error) {
  console.log('Error reading .env file:', error.message);
}
