# QUICK REFERENCE - CourtEase Application

## 🚀 START HERE - 5 Minute Setup

### 1️⃣ Database Setup
```bash
# Open PostgreSQL command line
psql -U postgres

# Execute schema
\i /path/to/init-db.sql

# Verify tables created
\dt
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
npm start

# Should see: "Server running on port 5000"
```

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm start

# Should open http://localhost:3000
```

---

## 🔑 Login Credentials

### Admin
- **Phone**: 9999999999
- **Password**: admin123
- **Role**: Admin

Then register test User or Owner accounts through the registration page.

---

## 📂 Key Files Locations

| Component | File | Purpose |
|-----------|------|---------|
| API Client | `frontend/src/api.js` | Centralized axios instance |
| Protected Routes | `frontend/src/components/ProtectedRoute.js` | Route protection |
| Admin Home | `frontend/src/dashboard/admin/.../Home.js` | Stats dashboard |
| Backend API | `backend/server.js` | All endpoints |
| Database | `init-db.sql` | Schema |
| Config | `backend/.env` | Variables |

---

## 📡 API Endpoints Quick Ref

### Auth
```
POST /register    - Register user
POST /login       - User login
```

### Courts
```
POST   /courts           - Create court
GET    /getcourts        - List all
GET    /courts/search    - Search by city/sport
PUT    /courts/:id       - Edit court
DELETE /courts/:id       - Delete court
```

### Bookings
```
POST   /bookings      - Create booking
GET    /mybookings    - User's bookings
DELETE /bookings/:id  - Cancel booking
```

### Admin
```
GET  /admin/stats     - Dashboard stats
GET  /admin/fetchusers  - All users
GET  /admin/fetchowners - All owners
```

---

## 🧪 Test Flow

1. Go to `http://localhost:3000`
2. Click "Register" 
3. Fill form as **User**
4. Login with created credentials
5. You'll see user dashboard
6. Try booking a court (create one as owner first, or list existing courts)

---

## 🐛 Debug Commands

### Check Backend Running
```bash
curl http://localhost:5000/getcourts
```

### Check Database
```bash
psql -U postgres -d courtease -c "SELECT COUNT(*) FROM users;"
```

### View Logs
- **Frontend**: Open DevTools (F12) → Console
- **Backend**: Check terminal where npm start runs

---

## 🔐 Security Notes

- ✅ Tokens expire in 24 hours
- ✅ Passwords hashed with bcrypt
- ✅ Admin endpoints require role check
- ✅ Protected routes verify role on frontend
- ✅ All API calls include token in header

---

## 🎯 Component Structure

```
frontend/
├── src/
│   ├── api.js (API client)
│   ├── index.js (routes with protection)
│   ├── components/
│   │   └── ProtectedRoute.js
│   ├── landing_page/
│   │   ├── Signup/
│   │   │   ├── Login.js (FIXED)
│   │   │   └── Register.js (FIXED)
│   │   └── HomePage/
│   └── dashboard/
│       ├── admin/ (Protected)
│       ├── courtowner/ (Protected)
│       └── user/ (Protected)

backend/
├── server.js (FIXED - all endpoints)
├── db.js (postgres connection)
├── .env (UPDATED)
└── package.json
```

---

## 🎬 Production Deployment

1. **Update .env** with production credentials
2. **Build frontend**: `npm run build`
3. **Set NODE_ENV=production**
4. **Use HTTPS** for all production URLs
5. **Update CORS** to production domain
6. **Setup database backups**
7. **Configure monitoring/logging**

---

## 💡 Tips

- Always use `api` client from `api.js` instead of axios directly
- Tokens are auto included in all requests
- 401 errors auto-redirect to login
- All forms have validation
- Loading states prevent double submission
- Check browser console for errors

---

## 🚨 If Something Breaks

1. **Check Logs**: Terminal (backend) and DevTools (frontend)
2. **Verify .env**: All variables set correctly
3. **Restart Services**: Stop backend/frontend and npm start again
4. **Clear Browser Cache**: Ctrl+Shift+Delete
5. **Check Database**: Connect with psql and verify tables exist

---

## 📊 Admin Workflow

1. Login as admin (9999999999 / admin123)
2. View **Home**: Real-time statistics
3. Go to **Users**: Manage user accounts
4. Go to **Owners**: Approve/reject owner registrations
5. Go to **Requests**: Review pending approvals
6. Go to **Profile**: Update admin profile

---

## 👤 Owner Workflow

1. Register as **Owner**
2. Wait for admin approval
3. Login once approved
4. Create courts with details
5. View bookings for own courts
6. Check earnings stats

---

## 👥 User Workflow

1. Register as **User**
2. Auto-approved (login immediately)
3. Search/browse courts
4. Book court by selecting date and time slots
5. View my bookings
6. Cancel bookings if needed

---

## ⚡ Performance Tips

- Database is properly indexed
- Queries optimized for filtering
- Frontend uses lazy loading
- No unnecessary re-renders
- Token caching prevents repeated verification

---

**Version**: 1.0  
**Last Updated**: March 25, 2026  
**Status**: ✅ Production Ready
