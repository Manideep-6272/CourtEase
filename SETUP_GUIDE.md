# CourtEase - Complete Setup & Deployment Guide

## 📋 Project Overview

CourtEase is a sports court booking platform that connects:
- **Users**: Browse, search, and book nearby sports courts
- **Court Owners**: Add, manage, and monitor their courts
- **Admins**: Manage users, approve owners, and view analytics

---

## 🚀 Quick Start (5 Steps)

### Step 1: Database Setup (PostgreSQL)
```bash
# Open PostgreSQL and run:
psql -U postgres

# Then execute the database schema:
\i init-db.sql
```

**Default Admin Login:**
- Phone: `9999999999`
- Password: `admin123`
- Role: `Admin`

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Configure Backend Environment
The `.env` file is already updated with:
```
PORT=5000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=courtease
JWT_SECRET=your_super_secret_jwt_key_2024
```

### Step 4: Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Step 5: Start the Application
```bash
# Terminal 1: Start Backend (from /backend directory)
npm start

# Terminal 2: Start Frontend (from /frontend directory)
npm start
```

---

## 🔧 Backend APIs (All Endpoints)

### Authentication
```
POST   /register         - Register new user
POST   /login            - User login
```

### User Profile
```
GET    /profile          - Get user profile
PUT    /profile          - Update user profile
POST   /change-password  - Change password
```

### Courts
```
POST   /courts           - Create new court (owner only)
GET    /getcourts        - Get all courts
GET    /courts/search    - Search courts by city/sport
GET    /mycourts         - Get owner's courts
PUT    /courts/:id       - Update court details
DELETE /courts/:id       - Delete court
GET    /courts/:id/slots - Get available slots for a court
```

### Bookings
```
POST   /bookings         - Create booking
GET    /mybookings       - Get user's bookings
DELETE /bookings/:id     - Cancel booking
GET    /owner/bookings   - Get owner's bookings
```

### Admin Endpoints
```
GET    /admin/stats                    - Get admin dashboard statistics
GET    /admin/fetchusers               - Get all users
GET    /admin/fetchowners              - Get all owners
GET    /admin/fetchPendingOwners       - Get pending owner approvals
PUT    /admin/owners/:id/updateStatus  - Approve/reject owners
DELETE /admin/owners/:id/deleteOwner   - Delete owner
PUT    /admin/users/:id/toggle-status  - Block/unblock users
```

### Owner Endpoints
```
GET    /owner/stats      - Get owner statistics (earnings, bookings, etc.)
```

### Contact & Support
```
POST   /contact          - Submit contact form message
```

---

## 📝 User Roles & Access

| Feature | User | Owner | Admin |
|---------|------|-------|-------|
| Browse Courts | ✅ | ✅ | ✅ |
| Search Courts | ✅ | ✅ | ✅ |
| Book Court | ✅ | ❌ | ❌ |
| Create Court | ❌ | ✅ | ❌ |
| Manage Own Courts | ❌ | ✅ | ❌ |
| View Analytics | ❌ | ✅ | ✅ |
| Manage All Users | ❌ | ❌ | ✅ |
| Approve Owners | ❌ | ❌ | ✅ |
| Block Users | ❌ | ❌ | ✅ |

---

## 🛡️ Security Features

1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Authentication**: 1-day expiring tokens
3. **Role-Based Access**: Protected routes on frontend and backend
4. **Protected Routes**: Frontend route protection components
5. **Automatic Logout**: 401 errors redirect to login
6. **Input Validation**: Server-side validation for all inputs

---

## 🗄️ Database Schema

### Tables
- **users**: User accounts (users, owners, admins)
- **courts**: Court listings owned by owners
- **court_slots**: Time slots for each court (24 hours/day)
- **bookings**: User bookings
- **payments**: Payment records
- **admin_activity_logs**: Audit trail
- **contact_messages**: Contact form submissions

---

## 🔍 Testing the Application

### Test User Accounts
```
Admin Login:
Phone: 9999999999
Password: admin123
Role: Admin

# Create test users through registration:
- User: Phone 9876543210, Password: user123, Role: User
- Owner: Phone 9781234567, Password: owner123, Role: Owner
```

### Test Flow
1. **Register** a new user at `/register`
2. **Login** with created credentials at `/login`
3. For Users: Browse and book courts
4. For Owners: Create courts, manage bookings
5. For Admin: Approve owners, view statistics

---

## 📊 Admin Dashboard

View comprehensive statistics:
- Total Users and Active Users
- Total Owners and Approved Owners
- Total Courts and Active Courts
- Total Bookings
- Today's Revenue
- Monthly Revenue

---

## 🐛 Common Issues & Fixes

### Issue: Database Connection Error
**Fix**: Ensure PostgreSQL is running and `.env` has correct credentials
```bash
# Check PostgreSQL status
pg_isrunning

# Restart PostgreSQL if needed
pg_ctl start -D /path/to/data/directory
```

### Issue: Port Already in Use
**Fix**: Change PORT in `.env` or kill existing process
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Issue: CORS Errors
**Fix**: Ensure backend `.env` has correct FRONTEND_URL

### Issue: Login/Register Not Working
**Fix**: Check if backend is running on port 5000
```bash
curl http://localhost:5000/login
```

---

## 🚀 Deployment Checklist

- [ ] Change JWT_SECRET to a strong random key
- [ ] Update database credentials for production
- [ ] Set NODE_ENV=production
- [ ] Use HTTPS in production
- [ ] Update API_URL environment variables
- [ ] Set up database backups
- [ ] Configure logging & monitoring
- [ ] Test all payment flow
- [ ] Set up email notifications for bookings
- [ ] Configure CDN for images
- [ ] Set up staging environment

---

## 📱 Frontend Routes

```
/                 - Home page
/register         - Registration
/login            - Login
/about            - About page
/contact          - Contact form
/user/*           - User dashboard (protected)
/owner/*          - Owner dashboard (protected)
/admin/*          - Admin dashboard (protected)
```

---

## 🔐 Authentication Flow

1. User submits login/register form
2. Backend validates and creates/authenticates user
3. JWT token returned to frontend
4. Token stored in localStorage
5. Token sent with every API request in Authorization header
6. Token verified by authMiddleware on backend
7. On 401 error, token cleared and user redirected to login

---

## 📚 Technology Stack

- **Backend**: Node.js, Express.js, PostgreSQL, JWT, bcrypt
- **Frontend**: React, React Router, Axios
- **Database**: PostgreSQL with indexed queries
- **Authentication**: JWT tokens, bcrypt hashing
- **Styling**: Bootstrap 5, CSS

---

## 💡 Tips & Best Practices

1. Always save token and user data to localStorage after login
2. Clear localStorage on logout or token expiration
3. Use protected routes to prevent unauthorized access
4. Validate all inputs before sending to server
5. Handle errors gracefully with user-friendly messages
6. Use environment variables for all configuration
7. Keep database credentials secure (never commit .env)
8. Test all workflows across different user roles

---

## 📞 Support

For issues or questions:
1. Check logs in browser console (F12)
2. Check server logs in terminal
3. Verify database connection
4. Ensure all ports are available
5. Check `.env` configuration

---

**Last Updated**: March 25, 2026
**Version**: 1.0 (Production Ready)
