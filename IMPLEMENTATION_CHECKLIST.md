# CourtEase - Implementation Checklist & Fix Priority

## PHASE 1: CRITICAL FIXES (Do First - 4 hours)

### 🔴 Phase 1.1: Security & Setup
- [ ] **Remove .env from Git History**
  - Run: `git rm --cached .env`
  - Add new credentials to .env (don't commit)
  - Push: `git commit -m "Remove .env from tracking"`
  
- [ ] **Update .env with New Credentials**
  - Backend: Rotate DB password, JWT_SECRET, API keys
  - Add PORT=5000
  - Add NODE_ENV=development
  
- [ ] **Create Frontend .env**
  ```env
  REACT_APP_API_URL=http://localhost:5000
  REACT_APP_ENV=development
  ```

### 🔴 Phase 1.2: Database Setup
- [ ] **Run Database Schema Script**
  - Execute `DATABASE_SCHEMA.md` SQL in PostgreSQL
  - Verify all tables created with `\dt`
  - Check indexes: `\di`
  
- [ ] **Seed Default Admin User**
  - Generate bcrypt hash for password
  - Insert admin user with proper credentials
  - Verify with login

- [ ] **Create Database Initialization Endpoint (Optional)**
  - POST `/admin/init-db` (only works once)
  - Creates all tables if they don't exist

---

## PHASE 2: AUTHENTICATION & AUTHORIZATION (Do Next - 4 hours)

### 🟠 Phase 2.1: Protected Routes Frontend
- [ ] **Create `frontend/src/components/ProtectedRoute.js`**
  ```jsx
  import { Navigate } from 'react-router-dom';
  
  export const ProtectedRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token) return <Navigate to="/login" />;
    if (requiredRole && user.role !== requiredRole) return <Navigate to="/" />;
    
    return children;
  };
  ```

- [ ] **Update `frontend/src/index.js` Routes**
  - Wrap dashboard routes with ProtectedRoute
  - Add role checks:
    ```jsx
    <Route path="/admin/*" element={<ProtectedRoute requiredRole="admin"><AdminDash /></ProtectedRoute>} />
    <Route path="/owner/*" element={<ProtectedRoute requiredRole="owner"><OwnerDash /></ProtectedRoute>} />
    <Route path="/user/*" element={<ProtectedRoute requiredRole="user"><UserDash /></ProtectedRoute>} />
    ```

- [ ] **Create Global Error Handler**
  - Create `frontend/src/api.js` with axios instance
  - Add interceptor for 401 responses (logout & redirect)
  - Add interceptor for 403 responses (permission error)

### 🟠 Phase 2.2: Backend Auth Improvements
- [ ] **Fix Login Error Catch Block**
  - File: `backend/server.js` Line 98
  - Change: `catch {` → `catch (err) {`
  - Add error logging

- [ ] **Add Auth Middleware to All Admin Routes**
  - Check `req.user.role === 'admin'` before allowing access
  - Return 403 Forbidden if not admin

- [ ] **Add User Block/Unblock Endpoint**
  ```
  PUT /admin/users/:id/toggleStatus
  ```

---

## PHASE 3: MISSING API ENDPOINTS (Do Next - 6 hours)

### 🟠 Phase 3.1: Profile Update Endpoints
- [ ] **PUT /profile** - Update user profile
  - Fields: name, email, city, favouriteSport
  - Require auth token
  
- [ ] **PUT /admin/profile** - Update admin profile
  - Fields: name, email, phone
  - Require admin role
  
- [ ] **PUT /owner/profile** - Update owner profile
  - Fields: name, email, phone, city, businessName
  - Require owner role

### 🟠 Phase 3.2: Statistics Endpoints
- [ ] **GET /admin/stats**
  - Return: { totalUsers, activeUsers, totalOwners, approvedOwners, totalCourts, activeCourts, totalBookings, todayRevenue, monthRevenue }
  
- [ ] **GET /owner/stats**
  - Return: { totalCourts, todayBookings, todayEarnings, totalEarnings, activeSlots }
  
- [ ] **GET /owner/bookings** (NEW - Separate from user bookings)
  - Return bookings for owner's courts
  - Query params: ?courtId=X&date=YYYY-MM-DD

### 🟠 Phase 3.3: Contact Form Endpoint
- [ ] **POST /contact**
  - Fields: name, email, message
  - Insert into contact_messages table
  - Optional: Send email notification

### 🟠 Phase 3.4: Change Password Endpoint
- [ ] **POST /change-password**
  - Fields: oldPassword, newPassword, confirmPassword
  - Verify old password first
  - Update password

### 🟠 Phase 3.5: User Management Endpoints
- [ ] **PUT /admin/users/:id/toggleStatus**
  - Toggle is_active field
  - Log action in admin_activity_logs

- [ ] **DELETE /admin/users/:id**
  - Only soft delete (set is_active=false)
  - Log action

---

## PHASE 4: COMPONENT IMPLEMENTATIONS (Do Next - 8 hours)

### 🟡 Phase 4.1: Fix Admin Dashboard
- [ ] **AdminDashboard/Homepage/Home.js**
  - Add useEffect to fetch stats from /admin/stats
  - Replace hardcoded values with state
  
- [ ] **AdminDashboard/Users/Users.js**
  - Add onClick handlers to View and Block buttons
  - Implement user detail modal
  - Add toggle status functionality
  
- [ ] **AdminDashboard/Owners/Owners.js**
  - Fix filter search to work in real-time
  - Add onChange to handleFilter
  
- [ ] **AdminDashboard/Requests/Requests.js**
  - Add onChange handler to search input
  - Implement search functionality
  
- [ ] **AdminDashboard/Profile/Profile.js**
  - Implement handleSave() to call PUT /admin/profile
  - Add success/error notifications

- [ ] **Admin Navbar**
  - Add logout button

### 🟡 Phase 4.2: Fix Court Owner Dashboard
- [ ] **Owner/MyCourts/MyCourts.js**
  - Complete modal with proper close buttons
  - Add styles from CSS file
  - Finish price input validation
  
- [ ] **Owner/Bookings/Bookings.js**
  - Create separate endpoint for owner bookings
  - Or filter backend response
  - Complete table rendering
  
- [ ] **Owner/Earnings/Earnings.js**
  - Fix incomplete table rendering
  - Fetch real earnings data from backend
  
- [ ] **Owner/HomePage/Stats.js**
  - Fetch from /owner/stats endpoint
  - Replace hardcoded values
  
- [ ] **Owner/HomePage/Bookings.js**
  - Fetch real bookings from backend
  - Remove hardcoded data
  
- [ ] **Owner/Profile/Profile.js**
  - Implement handleSave() to call PUT /owner/profile
  - Add success notifications

### 🟡 Phase 4.3: Fix User Dashboard
- [ ] **User/userdashboard/Home/Search.js**
  - Complete modal implementation
  - Add proper close handlers
  - Fix return statement cutoff
  
- [ ] **User/userdashboard/Home/Upcoming.js**
  - Fix return statement cutoff
  - Verify date logic works correctly
  
- [ ] **User/userdashboard/profile/Profile.js**
  - Replace dummy alert with actual API call
  - Call PUT /profile with updated data
  - Add success notification

### 🟡 Phase 4.4: Fix Landing Pages
- [ ] **HomePage/Hero.js**
  - Add onClick to "Book a court" → navigate to /login or /user if logged in
  - Add onClick to "Explore Sports" → scroll to sports section
  
- [ ] **HomePage/SearchBar.js**
  - Add onClick handler to search button
  - Redirect to /login if not authenticated
  - Redirect to /user for search if authenticated
  
- [ ] **Contact/Contact.js**
  - Add onChange handlers to form fields
  - Implement submit handler
  - Call POST /contact
  - Show success/error message

---

## PHASE 5: FORM VALIDATION (Do Next - 3 hours)

### 🟡 Phase 5.1: Add Form Validator Library
- [ ] Install: `npm install validator`
  
- [ ] **Login.js Validation**
  - Phone format: 10 digits
  - Password: not empty
  - Role: required
  
- [ ] **Register.js Validation**
  - Name: min 3 characters
  - Phone: exactly 10 digits
  - Password: min 8 chars, 1 uppercase, 1 number
  - Passwords match
  
- [ ] **MyCourts Modal Validation**
  - Court name: 1-50 chars
  - Price: 50-10000
  - Location: not empty
  - Sport: required
  
- [ ] **Search Form Validation**
  - Date: must be today or future
  - At least one filter: location OR sport

---

## PHASE 6: STATE MANAGEMENT & ERROR HANDLING (Do Next - 4 hours)

### 🟡 Phase 6.1: Create Global API Client
- [ ] **Create `frontend/src/utils/api.js`**
  ```js
  import axios from 'axios';
  
  const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: { 'Content-Type': 'application/json' }
  });
  
  API.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  
  API.interceptors.response.use(
    res => res,
    err => {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(err);
    }
  );
  
  export default API;
  ```

- [ ] **Update All Components**
  - Replace all `axios.post/get/put/delete` with `API.post/get/put/delete`
  - Use `process.env.REACT_APP_API_URL` instead of hardcoded URLs

### 🟡 Phase 6.2: Add Error Handling Context
- [ ] **Create `frontend/src/context/ErrorContext.js`**
  - Provide global error state
  - Show error toast automatically
  
- [ ] **Add Error Toast Component**
  - Install: `npm install react-toastify`
  - Wrap App in ToastContainer
  - Use in API interceptor

### 🟡 Phase 6.3: Add Loading States
- [ ] **Create Loading HOC or Hook**
  - Wrap async operations with loading state
  - Show spinner during data fetch
  
- [ ] **Update Components**
  - Add loading indicator to all data-fetching components

---

## PHASE 7: MISCELLANEOUS FIXES (Do Next - 2 hours)

### 🟢 Phase 7.1: CSS & Assets
- [ ] **Add Missing Modal Styles**
  - Create/update styles for modal overlay and modal card
  - Add animations
  
- [ ] **Add Logo Asset**
  - Place `Logo.png` in `frontend/public/`
  - Or update NavBar image path
  
- [ ] **Verify All Custom CSS Classes**
  - Check all Bootstrap utility classes exist
  - Verify custom classes are defined

### 🟢 Phase 7.2: Minor Improvements
- [ ] **Logout Button in Main NavBar**
  - Add if user is logged in
  
- [ ] **Redirect Logged-in Users**
  - If logged in and visiting /login or /register
  - Redirect to appropriate dashboard
  
- [ ] **Fix Broken Button Navigation**
  - Ensure all buttons navigate properly

---

## PHASE 8: OPTIONAL ENHANCEMENTS (If Time Permits)

### 💡 Email Service Integration
- [ ] Install: `npm install nodemailer`
- [ ] Add email notifications for:
  - Owner approval/rejection
  - Booking confirmations
  - Password reset

### 💡 Real-Time Updates
- [ ] Implement WebSocket for:
  - Live booking updates
  - Availability changes
  
### 💡 Advanced Filtering
- [ ] Add more search filters:
  - Price range
  - Rating
  - Availability

### 💡 Payment Integration
- [ ] Integrate Razorpay or Stripe
- [ ] Process payments on booking
- [ ] Track revenue

### 💡 Analytics
- [ ] Add Google Analytics
- [ ] Track user behavior
- [ ] Monitor bookings

---

## TESTING CHECKLIST

### Integration Testing
- [ ] User Registration Flow
- [ ] User Login Flow
- [ ] Admin Approval of Owners
- [ ] Owner Adding Court
- [ ] User Searching Courts
- [ ] User Booking Court
- [ ] User Cancelling Booking
- [ ] Owner Viewing Earnings
- [ ] Admin Viewing Statistics
- [ ] User Profile Update
- [ ] Owner Profile Update
- [ ] Contact Form Submission

### Error Handling Testing
- [ ] Invalid login credentials
- [ ] Network errors
- [ ] API timeouts
- [ ] 401 unauthorized (logout & redirect)
- [ ] 403 forbidden (permission denied)
- [ ] 500 server errors

### Security Testing
- [ ] XSS prevention
- [ ] CSRF tokens (if needed)
- [ ] SQL injection prevention
- [ ] Rate limiting
- [ ] Token expiration handling

---

## DEPLOYMENT CHECKLIST

- [ ] Set NODE_ENV=production in backend .env
- [ ] Update REACT_APP_API_URL to production API
- [ ] Update database credentials
- [ ] Update JWT_SECRET to random secure value
- [ ] Enable HTTPS
- [ ] Configure CORS with frontend domain
- [ ] Setup proper logging
- [ ] Setup error tracking (Sentry, etc.)
- [ ] Setup database backups
- [ ] Setup CDN for static assets
- [ ] Configure environment variables in deployment

---

## ESTIMATED TIMELINE

| Phase | Tasks | Hours | Status |
|-------|-------|-------|--------|
| Phase 1 | Critical Setup | 4 | ⏳ |
| Phase 2 | Auth & Authorization | 4 | ⏳ |
| Phase 3 | Missing Endpoints | 6 | ⏳ |
| Phase 4 | Component Fixes | 8 | ⏳ |
| Phase 5 | Form Validation | 3 | ⏳ |
| Phase 6 | State Management | 4 | ⏳ |
| Phase 7 | Misc Fixes | 2 | ⏳ |
| Phase 8 | Optional | 6+ | ⏳ |
| Testing | QA | 4 | ⏳ |
| **TOTAL** | **All** | **~41 hours** | - |

---

## Notes & Best Practices

1. **Commit Frequently** - Don't wait until everything is done
2. **Test Each Phase** - Verify before moving to next phase
3. **Use .env Files** - Never commit sensitive data
4. **Follow REST Standards** - Consistent API design
5. **Error Messages** - User-friendly and specific
6. **Code Comments** - Document complex logic
7. **Consistent Naming** - Follow conventions
8. **DRY Principle** - Don't repeat code

---

**Good Luck! 🚀**
