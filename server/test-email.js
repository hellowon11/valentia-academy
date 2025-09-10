require('dotenv').config({ path: './.env' });
const nodemailer = require('nodemailer');

console.log('🔍 Testing Email Configuration...');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-4) : 'NOT SET');

// Test different Gmail configurations
const configs = [
  {
    name: 'Standard Gmail',
    config: {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    }
  },
  {
    name: 'Gmail with OAuth2',
    config: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    }
  },
  {
    name: 'Gmail with SSL',
    config: {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    }
  }
];

async function testConfig(config, name) {
  console.log(`\n🧪 Testing: ${name}`);
  try {
    const transporter = nodemailer.createTransport(config.config);
    
    // Test connection
    await transporter.verify();
    console.log(`✅ ${name}: Connection successful!`);
    
    // Test sending
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to self for testing
      subject: `Test Email - ${name}`,
      text: 'This is a test email from Valentia Cabin Crew Academy server.'
    });
    
    console.log(`✅ ${name}: Email sent successfully!`);
    console.log(`📧 Message ID: ${info.messageId}`);
    return true;
    
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('\n🚀 Starting email configuration tests...\n');
  
  for (const config of configs) {
    await testConfig(config, config.name);
  }
  
  console.log('\n📋 Test Summary:');
  console.log('If all tests failed, please check:');
  console.log('1. Gmail 2FA is enabled');
  console.log('2. App Password is correctly generated');
  console.log('3. App Password has no spaces');
  console.log('4. .env file is in the correct location');
}

runTests().catch(console.error);
