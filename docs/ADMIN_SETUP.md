# Application Management Dashboard - Setup Guide

## Overview

The Application Management Dashboard allows administrators to view, manage, and export student applications submitted through the website's "Apply Now" feature.

## Features

- ✅ View all student applications
- ✅ Filter by course, status, language, and date range
- ✅ Search applications by name, email, phone, or application ID
- ✅ Export applications to Excel format
- ✅ View application details and attachments
- ✅ Update application status
- ✅ Add notes to applications
- ✅ Dashboard statistics and analytics

## Backend Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

This will install:
- `better-sqlite3` - Database
- `exceljs` - Excel export functionality
- `bcryptjs` - Password hashing
- `jsonwebtoken` - Authentication tokens

### 2. Environment Variables

Make sure your `.env` file in the `server` directory includes:

```env
PORT=3001
FRONTEND_URL=http://localhost:5173
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
JWT_SECRET=your-secret-key-change-in-production
```

### 3. Start the Server

```bash
npm start
# or for development
npm run dev
```

The server will:
- Create database automatically at `server/data/applications.db`
- Create default admin user: `admin` / `admin123`
- Create `server/uploads` directory for file attachments

### 4. Default Admin Account

- **Username:** `admin`
- **Password:** `admin123`

⚠️ **IMPORTANT:** Change the default password after first login!

## Frontend Setup

### 1. Install React Router (if not already installed)

```bash
cd ..  # back to project root
npm install react-router-dom
```

### 2. Add Admin Routes

You need to add routes to your main App.tsx or router configuration:

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';

// In your router:
<Routes>
  {/* ... existing routes ... */}
  <Route path="/admin/login" element={<AdminLogin />} />
  <Route 
    path="/admin/dashboard" 
    element={
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    } 
  />
</Routes>
```

### 3. Create Protected Route Component

Create `src/components/ProtectedRoute.tsx`:

```typescript
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
```

### 4. Update API Base URL (if needed)

If your backend runs on a different port or domain, update the fetch URLs in:
- `src/pages/Admin/Login.tsx`
- `src/pages/Admin/Dashboard.tsx`

Or create an API utility:

```typescript
// src/utils/api.ts
const API_BASE = import.meta.env.VITE_API_BASE || '';

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('adminToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  
  return fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
};
```

## Usage

### 1. Access Admin Dashboard

Navigate to: `http://localhost:5173/admin/login`

### 2. Login

Use the default credentials:
- Username: `admin`
- Password: `admin123`

### 3. View Applications

After login, you'll see:
- Dashboard statistics (total, today, this week, this month, pending)
- Applications table with all submitted applications
- Filter and search options

### 4. Filter Applications

- **Search:** By name, email, phone, or application ID
- **Course:** Filter by Advanced, English, or Basic
- **Status:** Filter by Pending, Under Review, Accepted, Rejected, Waitlisted
- **Language:** Filter by language preference

### 5. Export to Excel

Click the "Export to Excel" button to download all filtered applications as an Excel file.

The Excel file includes:
- Application ID
- Full Name
- Email
- Phone
- Course
- Status (with color coding)
- Language Preference
- Message
- Attachment Count
- Submitted Date
- Reviewed By
- Reviewed Date

### 6. View Application Details

Click "View" on any application to see:
- Complete application information
- Attached files (with download option)
- Status history
- Notes and comments

## API Endpoints

### Authentication
- `POST /api/admin/auth/login` - Login
- `GET /api/admin/auth/me` - Get current user

### Applications
- `GET /api/admin/applications` - List applications (with filters)
- `GET /api/admin/applications/:id` - Get application details
- `PUT /api/admin/applications/:id` - Update application status
- `DELETE /api/admin/applications/:id` - Delete application (admin only)
- `POST /api/admin/applications/:id/notes` - Add note

### Export
- `GET /api/admin/applications/export/excel` - Export to Excel

### Statistics
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

### Files
- `GET /api/admin/applications/:id/attachments/:attachmentId` - Download attachment

## Database Schema

The database is automatically created at `server/data/applications.db` with the following tables:

- `applications` - Main application data
- `application_attachments` - File attachments
- `application_notes` - Notes and comments
- `application_status_history` - Status change history
- `admin_users` - Admin user accounts

## Security Notes

1. **Change Default Password:** The default admin password should be changed immediately
2. **JWT Secret:** Use a strong, random JWT_SECRET in production
3. **HTTPS:** Always use HTTPS in production
4. **File Uploads:** File uploads are validated and stored securely
5. **Authentication:** All admin endpoints require valid JWT tokens

## Troubleshooting

### Database not created
- Check file permissions
- Ensure `server/data` directory is writable

### Login fails
- Verify admin user exists in database
- Check server logs for errors
- Verify JWT_SECRET is set

### Export fails
- Check file size limits
- Verify ExcelJS is installed
- Check server logs

### Files not uploading
- Verify `server/uploads` directory exists and is writable
- Check file size limits (10MB per file)
- Verify file types are allowed

## Support

For issues or questions, please contact the development team.
