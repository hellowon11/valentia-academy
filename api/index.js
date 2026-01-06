const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ExcelJS = require('exceljs');
require('dotenv').config();

// Initialize Supabase Client
const supabase = require('./supabase');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'valentia-admin-secret-key-change-this';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug/Health Check Endpoint
app.get('/api', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Valentia Backend is Running',
    env: {
      supabaseConfigured: !!process.env.SUPABASE_URL
    }
  });
});

// Keep-alive endpoint for Supabase
app.get('/api/ping', async (req, res) => {
  try {
    // Perform a lightweight query to keep Supabase active
    const { data, error } = await supabase
      .from('valentia_admin_users')
      .select('id')
      .limit(1);
      
    if (error) throw error;
    
    res.json({ 
      success: true, 
      message: 'Pong! Supabase is active.', 
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Ping failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Configure Multer (Memory Storage for Supabase Uploads)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Email Transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ==========================================
// Public Routes
// ==========================================

// Submit Application
app.post('/api/application', upload.array('attachments'), async (req, res) => {
  try {
    const { name, email, phone, course, message, language = 'en' } = req.body;
    
    // 1. Generate Application ID
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    // We can't get sequence easily before insert, so we'll use a random suffix or update after
    // Simple random ID for now
    const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const applicationId = `APP-${dateStr}-${randomSuffix}`;

    console.log('📝 New Application:', name, email);

    // 2. Insert into Supabase
    const insertResult = await supabase
      .from('valentia_applications')
      .insert([{
        full_name: name,
        email,
        phone,
        course,
        message,
        status: 'pending',
        application_id: applicationId,
        language
      }])
      .select()
      .single();

    console.log('🔍 Supabase Insert Result:', JSON.stringify(insertResult));

    const { data: appData, error: appError } = insertResult;

    if (appError) {
      console.error('❌ Database Insert Error:', appError);
      throw appError;
    }

    console.log('✅ Database Insert Success, ID:', appData.id);
    const appId = appData.id;

    // 3. Handle File Uploads
    const uploadedFiles = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // Generate unique filename for storage
        const fileExt = path.extname(file.originalname);
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExt}`;
        const filePath = `${applicationId}/${fileName}`; // Organize by App ID

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('valentia-uploads')
          .upload(filePath, file.buffer, {
            contentType: file.mimetype
          });

        if (uploadError) {
          console.error('Upload failed:', uploadError);
          continue;
        }

        // Record in Database
        await supabase
          .from('valentia_attachments')
          .insert([{
            application_id: appId,
            file_name: file.originalname,
            file_path: filePath,
            file_type: file.mimetype,
            file_size: file.size
          }]);

        uploadedFiles.push({
          filename: file.originalname,
          content: file.buffer // Keep buffer for email
        });
      }
    }

    // 4. Send Emails (Async)
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'valentiacabincrew@gmail.com', // Replace with admin email
      subject: `New Application: ${name} - ${course}`,
      html: `
        <h2>New Application Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Course:</strong> ${course}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Application ID:</strong> ${applicationId}</p>
      `,
      attachments: uploadedFiles.map(f => ({
        filename: f.filename,
        content: f.content
      }))
    };

    transporter.sendMail(mailOptions).catch(err => console.error('Email error:', err));

    // Send Auto-reply
    const autoReplySubject = language === 'zh' ? '收到您的申请 - Valentia Cabin Crew Academy' : 'Application Received - Valentia Cabin Crew Academy';
    // ... (Keep existing auto-reply logic, simplified for brevity here) ...
    // For now, sending a simple success response
    
    res.status(200).json({ success: true, message: 'Application submitted successfully', applicationId });

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Contact Form
app.post('/api/contact', async (req, res) => {
  // Similar logic, or just send email directly
  try {
    const { name, email, phone, message, course, language } = req.body;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'valentiacabincrew@gmail.com',
      subject: `New Contact Inquiry: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nCourse: ${course}\nMessage: ${message}`
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

// ==========================================
// Admin Routes (Protected)
// ==========================================

// Admin Login
app.post('/api/admin/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Check user in Supabase
    const { data: user, error } = await supabase
      .from('valentia_admin_users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Verify password
    if (bcrypt.compareSync(password, user.password_hash)) {
      // Create token
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Update last login
      await supabase
        .from('valentia_admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id);

      res.json({ success: true, token });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Login error' });
  }
});

// Get Applications List
app.get('/api/admin/applications', authenticateToken, async (req, res) => {
  try {
    const { 
      page = 1, limit = 10, 
      status, course, search 
    } = req.query;

    const offset = (page - 1) * limit;

    let query = supabase
      .from('valentia_applications')
      .select('*', { count: 'exact' });

    // Apply Filters
    if (status && status !== 'all') query = query.eq('status', status);
    if (course && course !== 'all') query = query.eq('course', course);
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,application_id.ilike.%${search}%`);
    }

    // Pagination & Sort
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    const { data: apps, count, error } = await query;

    if (error) throw error;

    // Fetch attachment counts for each app (Optimization: could be a view or separate query)
    const appsWithCounts = await Promise.all(apps.map(async (app) => {
      const { count: attCount } = await supabase
        .from('valentia_attachments')
        .select('id', { count: 'exact', head: true })
        .eq('application_id', app.id);
      return { ...app, attachment_count: attCount || 0 };
    }));

    res.json({
      data: appsWithCounts,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch applications' });
  }
});

// Get Single Application Detail
app.get('/api/admin/applications/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Get App
    const { data: appData, error: appError } = await supabase
      .from('valentia_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (appError) throw appError;

    // Get Attachments
    const { data: attachments } = await supabase
      .from('valentia_attachments')
      .select('*')
      .eq('application_id', id);

    // Get History
    const { data: history } = await supabase
      .from('valentia_status_history')
      .select('*')
      .eq('application_id', id)
      .order('created_at', { ascending: false });

    res.json({
      success: true,
      data: {
        ...appData,
        attachments: attachments || [],
        status_history: history || []
      }
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// Update Status
app.put('/api/admin/applications/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewerNotes } = req.body;

    // Update App
    const { error } = await supabase
      .from('valentia_applications')
      .update({ status })
      .eq('id', id);

    if (error) throw error;

    // Log History
    await supabase.from('valentia_status_history').insert([{
      application_id: id,
      status: status,
      updated_by: req.user.username,
      notes: reviewerNotes
    }]);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// Download Attachment
app.get('/api/admin/applications/:id/attachments/:attachmentId', authenticateToken, async (req, res) => {
  try {
    const { attachmentId } = req.params;

    // Get file info
    const { data: att, error } = await supabase
      .from('valentia_attachments')
      .select('*')
      .eq('id', attachmentId)
      .single();

    if (error || !att) return res.status(404).send('File not found');

    // Create Signed URL from Storage
    const { data: signedUrlData, error: signError } = await supabase
      .storage
      .from('valentia-uploads')
      .createSignedUrl(att.file_path, 60); // Valid for 60 seconds

    if (signError) throw signError;

    // Redirect to the signed URL (simplest way)
    // Or fetch and stream if you want to mask the URL
    // For admin dashboard, getting the signed URL and sending it back for frontend to open is better,
    // but the current frontend expects a file stream or direct download.
    // Let's Fetch the file and stream it to keep frontend compatible.
    
    const fileResponse = await fetch(signedUrlData.signedUrl);
    const arrayBuffer = await fileResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', att.file_type);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(att.file_name)}"`);
    res.send(buffer);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).send('Download failed');
  }
});

// Bulk Delete
app.post('/api/admin/applications/bulk-delete', authenticateToken, async (req, res) => {
  try {
    const { ids } = req.body;
    if (req.user.role !== 'admin') return res.status(403).json({ success: false });

    // 1. Get attachments to delete files
    const { data: attachments } = await supabase
      .from('valentia_attachments')
      .select('file_path')
      .in('application_id', ids);

    if (attachments && attachments.length > 0) {
      const paths = attachments.map(a => a.file_path);
      await supabase.storage.from('valentia-uploads').remove(paths);
    }

    // 2. Delete applications (Cascade will delete attachments metadata and history)
    const { error } = await supabase
      .from('valentia_applications')
      .delete()
      .in('id', ids);

    if (error) throw error;

    res.json({ success: true, message: 'Applications deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
});

// Stats
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  try {
    const { count: total } = await supabase.from('valentia_applications').select('*', { count: 'exact', head: true });
    const { count: pending } = await supabase.from('valentia_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending');
    
    // For specific time ranges, we need query
    // Simple implementation for now
    res.json({
      total: total || 0,
      today: 0, // Implement date filtering later if needed
      thisWeek: 0,
      thisMonth: 0,
      pending: pending || 0
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// Export Excel (Conditional)
app.get('/api/admin/applications/export/excel', authenticateToken, async (req, res) => {
  try {
    const { ids, status, course, search } = req.query;
    let query = supabase.from('valentia_applications').select('*');

    if (ids) {
      const idList = ids.split(',').map(id => parseInt(id));
      query = query.in('id', idList);
    } else {
      if (status && status !== 'all') query = query.eq('status', status);
      if (course && course !== 'all') query = query.eq('course', course);
       // ... search logic
    }

    const { data: apps } = await query;
    
    // Generate Excel (Same as before)
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Applications');
    
    worksheet.columns = [
      { header: 'ID', key: 'application_id', width: 15 },
      { header: 'Name', key: 'full_name', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Course', key: 'course', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Date', key: 'created_at', width: 20 },
      { header: 'Message', key: 'message', width: 30 }
    ];

    if (apps) {
      apps.forEach(app => {
        worksheet.addRow(app);
      });
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=applications.xlsx');
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error(error);
    res.status(500).send('Export failed');
  }
});

// Export for Vercel Serverless
// Global Error Handler for Vercel Debugging
app.use((err, req, res, next) => {
  console.error('🔥 Unhandled Error:', err);
  // Send error details to client for easier debugging
  res.status(500).json({ 
    success: false, 
    message: 'Internal Server Error',
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

module.exports = app;

// Only listen when running locally
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Supabase Connected: ${!!process.env.SUPABASE_URL}`);
  });
}


