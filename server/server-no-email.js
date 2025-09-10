const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Valentia Backend Server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Contact form endpoint (without email)
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message, course, language } = req.body;
    
    console.log('📧 Received contact form submission:', { name, email, course, language });
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, email, and message are required'
      });
    }
    
    // Simulate email sending
    console.log('✅ Form data received successfully');
    
    res.json({
      success: true,
      message: 'Form submitted successfully (Email functionality will be enabled once configured)'
    });
    
  } catch (error) {
    console.error('❌ Error processing form:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process form. Please try again later.'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🚀 Valentia Backend Server is running on port ${PORT}`);
  console.log(`📧 Email service: Temporarily disabled for testing`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`🔗 Test API: http://localhost:${PORT}/api/test\n`);
});
