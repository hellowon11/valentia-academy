# Product Requirements Document (PRD)
## Application Management Dashboard
### Valentia Cabin Crew Academy

**Version:** 1.0  
**Date:** December 2024  
**Status:** Draft

---

## 1. Executive Summary

### 1.1 Overview
This document outlines the requirements for an Application Management Dashboard system for Valentia Cabin Crew Academy. The system will allow administrators to view, manage, and export student applications submitted through the public website's "Apply Now" feature.

### 1.2 Objectives
- Provide a centralized platform for viewing all student applications
- Enable efficient management of application data
- Allow export of application data to Excel format for offline analysis
- Improve the admissions team's workflow and productivity

### 1.3 Success Criteria
- All applications submitted through the website are captured in the system
- Administrators can view applications within 5 seconds
- Excel export completes within 10 seconds for up to 1000 applications
- 99.9% system availability during business hours

---

## 2. Target Users

### 2.1 Primary Users
- **Admissions Officers**: View, review, and manage student applications
- **Administrators**: Full access to all applications and system settings
- **Management**: View reports and analytics

### 2.2 User Personas

**Persona 1: Admissions Officer - Sarah**
- Age: 28
- Role: Reviews 50-100 applications per week
- Needs: Quick access to application details, ability to filter and search, export data for offline review
- Technical Level: Intermediate

**Persona 2: Administrator - Michael**
- Age: 35
- Role: Manages system access and monitors application flow
- Needs: Dashboard overview, user management, system configuration
- Technical Level: Advanced

---

## 3. Functional Requirements

### 3.1 Application Data Storage

#### 3.1.1 Data Model
The system shall store the following application information:

**Required Fields:**
- Application ID (Auto-generated, unique)
- Full Name
- Email Address
- Phone Number
- Selected Course (Advanced/English/Basic)
- Submission Date/Time
- Status (Pending/Under Review/Accepted/Rejected)
- Language Preference (en/zh/ko/ja)

**Optional Fields:**
- Message/Additional Notes
- Attachments (File references/URLs)
- Reviewer Notes
- Review Date
- Assigned Reviewer
- Follow-up Date

**Metadata:**
- Created At (Timestamp)
- Updated At (Timestamp)
- IP Address (for security/analytics)
- User Agent

#### 3.1.2 Data Persistence
- All application data must be stored in a database
- File attachments must be stored securely (cloud storage or local file system)
- Data retention: Minimum 5 years
- Backup frequency: Daily automated backups

### 3.2 Dashboard Interface

#### 3.2.1 Application List View

**Display Features:**
- Table view showing all applications
- Sortable columns:
  - Application ID
  - Name
  - Email
  - Course
  - Status
  - Submission Date
- Pagination (20/50/100 items per page)
- Real-time data updates

**Filtering Options:**
- By Course (Advanced/English/Basic/All)
- By Status (Pending/Under Review/Accepted/Rejected/All)
- By Date Range (Submission date)
- By Language Preference
- Text search (Name, Email, Phone)

**Action Buttons:**
- View Details (Modal or dedicated page)
- Change Status
- Add Notes
- Download Attachments
- Delete (with confirmation)

#### 3.2.2 Application Detail View

**Information Display:**
- All application fields in organized sections
- Attachments list with download links
- Status history timeline
- Notes and comments section
- Reviewer assignment

**Actions:**
- Update Status
- Add/Edit Notes
- Download Individual Application as PDF
- Send Email to Applicant
- Mark for Follow-up

#### 3.2.3 Dashboard Statistics

**Key Metrics Display:**
- Total Applications (All time)
- Applications Today
- Applications This Week
- Applications This Month
- Pending Applications Count
- Applications by Course (Pie chart)
- Applications by Status (Bar chart)
- Applications Timeline (Line chart)

### 3.3 Excel Export Functionality

#### 3.3.1 Export Options

**Export Scope:**
- All applications (with current filters applied)
- Selected applications only (bulk selection)
- Applications within date range
- Applications by course
- Applications by status

**Export Format:**
- Excel (.xlsx) format
- CSV format (optional)

#### 3.3.2 Export Data Structure

**Worksheet 1: Application Summary**
Columns:
1. Application ID
2. Full Name
3. Email
4. Phone
5. Course
6. Status
7. Submission Date
8. Language Preference
9. Message (truncated if too long)
10. Attachment Count
11. Reviewer Notes

**Worksheet 2: Application Details** (if needed for detailed export)
- All fields including full messages and notes

**Formatting:**
- Header row with bold text and background color
- Date columns formatted as readable dates
- Status column with color coding (conditional formatting)
- Auto-width columns for readability
- Frozen header row

#### 3.3.3 Export Process
1. User clicks "Export to Excel" button
2. System shows loading indicator
3. Data is fetched based on current filters/selections
4. Excel file is generated server-side
5. File is downloaded to user's browser
6. Success notification displayed

**Performance Requirements:**
- Export up to 1000 applications: < 10 seconds
- Export up to 5000 applications: < 30 seconds
- Progress indicator for large exports

### 3.4 Search and Filter

#### 3.4.1 Search Functionality
- Full-text search across:
  - Name
  - Email
  - Phone Number
  - Application ID
- Real-time search results
- Highlight matching text in results
- Search history (optional)

#### 3.4.2 Advanced Filters
- Multi-select filters
- Combine multiple filter criteria (AND/OR logic)
- Save filter presets (favorite filters)
- Reset filters button

### 3.5 Status Management

#### 3.5.1 Status Options
- **Pending**: Newly submitted, not yet reviewed
- **Under Review**: Being evaluated by admissions team
- **Accepted**: Application approved
- **Rejected**: Application declined
- **Waitlisted**: Qualified but no immediate space available

#### 3.5.2 Status Workflow
- Applications default to "Pending" status
- Status changes are logged with timestamp and user
- Email notifications sent on status change (optional, configurable)
- Status change history visible in detail view

### 3.6 Notes and Comments

#### 3.6.1 Features
- Add multiple notes per application
- Notes include:
  - Content
  - Author
  - Timestamp
  - Type (Note/Comment/Internal)
- Edit/Delete own notes
- View notes history
- Notes exported in Excel (configurable)

---

## 4. Technical Requirements

### 4.1 Technology Stack

#### 4.1.1 Backend
- **Runtime**: Node.js (existing stack)
- **Framework**: Express.js
- **Database**: 
  - Primary: PostgreSQL or MongoDB (recommended: PostgreSQL for structured data)
  - File Storage: AWS S3, Google Cloud Storage, or local filesystem
- **ORM/ODM**: Prisma (PostgreSQL) or Mongoose (MongoDB)

#### 4.1.2 Frontend (Admin Dashboard)
- **Framework**: React (TypeScript) - matching existing frontend
- **UI Library**: Tailwind CSS (existing)
- **State Management**: React Context or Redux
- **Table Component**: TanStack Table (React Table) or similar
- **Charts**: Chart.js or Recharts

#### 4.1.3 Excel Export
- **Library**: 
  - Backend: `exceljs` or `xlsx` (Node.js)
  - Alternative: Generate on frontend using `xlsx` (smaller datasets)

#### 4.1.4 Authentication & Authorization
- **Authentication**: JWT tokens or session-based
- **Authorization**: Role-based access control (RBAC)
  - Admin: Full access
  - Officer: View and update applications, cannot delete
  - Viewer: Read-only access

### 4.2 API Endpoints

#### 4.2.1 Application Management

```
GET    /api/admin/applications
  Query params: page, limit, course, status, search, dateFrom, dateTo
  Response: { applications: [], total: number, page: number, limit: number }

GET    /api/admin/applications/:id
  Response: { application: {} }

PUT    /api/admin/applications/:id
  Body: { status, notes, reviewer }
  Response: { application: {} }

DELETE /api/admin/applications/:id
  Response: { success: boolean }

POST   /api/admin/applications/:id/notes
  Body: { content, type }
  Response: { note: {} }
```

#### 4.2.2 Export

```
GET    /api/admin/applications/export/excel
  Query params: course, status, dateFrom, dateTo (same as list)
  Response: Excel file download

GET    /api/admin/applications/export/excel/:ids
  Query params: ids (comma-separated application IDs)
  Response: Excel file download
```

#### 4.2.3 Statistics

```
GET    /api/admin/dashboard/stats
  Response: { 
    total: number,
    today: number,
    thisWeek: number,
    thisMonth: number,
    pending: number,
    byCourse: {},
    byStatus: {},
    timeline: []
  }
```

#### 4.2.4 Authentication

```
POST   /api/admin/auth/login
  Body: { email, password }
  Response: { token: string, user: {} }

POST   /api/admin/auth/logout
  Response: { success: boolean }

GET    /api/admin/auth/me
  Response: { user: {} }
```

### 4.3 Database Schema

#### 4.3.1 Applications Table (PostgreSQL)

```sql
CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  application_id VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  course VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  message TEXT,
  language_preference VARCHAR(10) DEFAULT 'en',
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_by VARCHAR(255),
  reviewed_at TIMESTAMP
);

CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_course ON applications(course);
CREATE INDEX idx_applications_created_at ON applications(created_at);
CREATE INDEX idx_applications_email ON applications(email);
```

#### 4.3.2 Attachments Table

```sql
CREATE TABLE application_attachments (
  id SERIAL PRIMARY KEY,
  application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER,
  file_type VARCHAR(100),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.3.3 Notes Table

```sql
CREATE TABLE application_notes (
  id SERIAL PRIMARY KEY,
  application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  note_type VARCHAR(20) DEFAULT 'note',
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.3.4 Status History Table

```sql
CREATE TABLE application_status_history (
  id SERIAL PRIMARY KEY,
  application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
  old_status VARCHAR(20),
  new_status VARCHAR(20) NOT NULL,
  changed_by VARCHAR(255) NOT NULL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT
);
```

### 4.4 Integration with Existing System

#### 4.4.1 Application Submission Endpoint
Modify existing `/api/application` endpoint to:
1. Continue sending email notifications (existing behavior)
2. Save application data to database (new requirement)
3. Store file attachments (new requirement)
4. Return success response (existing behavior)

---

## 5. User Interface Requirements

### 5.1 Layout

#### 5.1.1 Dashboard Structure
- **Header**: Logo, navigation, user profile, logout
- **Sidebar**: Navigation menu
  - Dashboard Overview
  - Applications
  - Settings
  - Logout
- **Main Content Area**: Dynamic content based on selected page
- **Footer**: Copyright, version info

#### 5.1.2 Color Scheme
- Primary: Blue (#1e40af) - matching website
- Success: Green (#10b981)
- Warning: Yellow (#f59e0b)
- Error: Red (#ef4444)
- Neutral: Gray scale

### 5.2 Responsive Design
- Desktop-first design (primary use case)
- Tablet support (responsive tables)
- Mobile: Basic viewing (not primary use case)

### 5.3 Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatible
- High contrast mode support

---

## 6. Security Requirements

### 6.1 Authentication
- Secure password hashing (bcrypt, Argon2)
- Session management with secure cookies
- Password reset functionality
- Account lockout after failed login attempts

### 6.2 Authorization
- Role-based access control
- API endpoint protection
- File access restrictions
- Audit logging for sensitive operations

### 6.3 Data Protection
- Encrypt sensitive data at rest
- HTTPS for all communications
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- XSS protection
- CSRF protection

### 6.4 File Security
- Secure file upload validation
- Virus scanning (optional)
- Access-controlled file storage
- File download authentication

---

## 7. Performance Requirements

### 7.1 Response Times
- Dashboard load: < 2 seconds
- Application list load: < 3 seconds (1000 applications)
- Application detail load: < 1 second
- Search results: < 1 second
- Excel export: < 10 seconds (1000 applications)

### 7.2 Scalability
- Support up to 10,000 applications
- Handle 100 concurrent admin users
- Database indexing for optimal query performance
- Caching for frequently accessed data

---

## 8. Non-Functional Requirements

### 8.1 Reliability
- 99.9% uptime during business hours (9 AM - 6 PM)
- Automatic error logging and monitoring
- Graceful error handling
- Data backup and recovery procedures

### 8.2 Maintainability
- Clean, documented code
- Modular architecture
- Comprehensive error logging
- Version control best practices

### 8.3 Usability
- Intuitive navigation
- Clear labels and instructions
- Help tooltips where needed
- Consistent UI/UX patterns

---

## 9. Future Enhancements (Out of Scope for V1)

### 9.1 Phase 2 Features
- Email templates for status updates
- Automated email notifications
- Bulk status updates
- Application comparison view
- Interview scheduling integration
- Analytics and reporting dashboard
- Application workflow automation
- Integration with CRM systems
- Multi-language admin interface

---

## 10. Implementation Plan

### 10.1 Phase 1: Foundation (Week 1-2)
- Database setup and schema creation
- Backend API development
- Basic authentication system
- Application storage integration

### 10.2 Phase 2: Core Features (Week 3-4)
- Admin dashboard UI
- Application list and detail views
- Search and filtering
- Status management

### 10.3 Phase 3: Export & Polish (Week 5)
- Excel export functionality
- Dashboard statistics
- Testing and bug fixes
- Documentation

### 10.4 Phase 4: Deployment (Week 6)
- Production deployment
- User training
- Monitoring setup
- Go-live

---

## 11. Testing Requirements

### 11.1 Unit Testing
- API endpoint testing
- Database query testing
- Utility function testing

### 11.2 Integration Testing
- End-to-end application flow
- Excel export functionality
- Authentication flow

### 11.3 User Acceptance Testing
- Admin user workflow testing
- Performance testing
- Security testing

---

## 12. Documentation Requirements

### 12.1 Technical Documentation
- API documentation
- Database schema documentation
- Setup and deployment guide

### 12.2 User Documentation
- Admin user manual
- Feature guides
- FAQ

---

## 13. Dependencies

### 13.1 External Services
- Email service (existing)
- File storage (to be determined)
- Monitoring service (recommended)

### 13.2 Libraries
- See Technical Requirements section 4.1

---

## 14. Acceptance Criteria

### 14.1 Must Have (MVP)
- ✅ View all applications in a list
- ✅ Filter applications by course, status, date
- ✅ Search applications
- ✅ View application details
- ✅ Export applications to Excel
- ✅ Update application status
- ✅ Secure authentication

### 14.2 Should Have
- Dashboard statistics
- Application notes
- Status history
- Bulk export

### 14.3 Nice to Have
- Advanced analytics
- Email notifications
- Customizable views

---

## 15. Glossary

- **Application**: Student submission for course enrollment
- **Dashboard**: Admin interface for managing applications
- **Status**: Current state of an application (Pending, Under Review, etc.)
- **Export**: Download application data in Excel format

---

## 16. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Dec 2024 | Product Team | Initial PRD |

---

**Document Owner**: Product Manager  
**Stakeholders**: Admissions Team, Development Team, Management  
**Review Cycle**: Bi-weekly during development
