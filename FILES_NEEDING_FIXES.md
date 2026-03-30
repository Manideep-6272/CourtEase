# Files Needing Fixes - Quick Reference Guide

## BACKEND FILES

### `backend/server.js` 
**Status:** 🟠 NEEDS FIXES - Incomplete implementation

| Line(s) | Issue | Severity | Fix |
|---------|-------|----------|-----|
| 12 | PORT not in .env | 🟡 | Add PORT=5000 to .env |
| 98 | Missing error parameter in catch | 🟠 | Change `catch {` to `catch (err) {` |
| 1-end | No error logging | 🟠 | Add console.error(err) in catch blocks |
| N/A | No owner bookings endpoint | 🟠 | Add `GET /owner/mybookings` endpoint |
| N/A | No user block/unblock endpoint | 🟠 | Add `PUT /admin/users/:id/toggleStatus` |
| N/A | No profile update endpoints | 🟠 | Add `PUT /profile`, `/admin/profile`, `/owner/profile` |
| N/A | No statistics endpoints | 🟠 | Add `GET /admin/stats`, `/owner/stats` |
| N/A | No contact endpoint | 🟠 | Add `POST /contact` |
| N/A | No change password endpoint | 🟠 | Add `POST /change-password` |

**Quick Fixes:**
```javascript
// Line 98: Fix error catch
catch (err) {
  console.error("Login error:", err);
  res.status(500).json({ message: "Server error" });
}
```

### `backend/db.js`
**Status:** ✅ OK - No fixes needed

### `backend/package.json`
**Status:** ✅ OK - Has all necessary dependencies

### `backend/.env`
**Status:** 🔴 CRITICAL - SECURITY ISSUE
- Remove from git history
- Change credentials
- Add PORT=5000
- Add NODE_ENV=development

---

## FRONTEND FILES - CRITICAL

### `frontend/public/index.html`
**Status:** 📁 Check existence - May not have Bootstrap loaded

### `frontend/src/index.js`
**Status:** 🟠 NEEDS FIXES - No protected routes

| Line(s) | Issue | Severity | Fix |
|---------|-------|----------|-----|
| 48-50 | No auth check on /admin | 🔴 | Wrap with ProtectedRoute |
| 51-52 | No auth check on /owner | 🔴 | Wrap with ProtectedRoute |
| 53-54 | No auth check on /user | 🔴 | Wrap with ProtectedRoute |

**Quick Fix:**
```jsx
<Route path="/admin/*" element={
  <ProtectedRoute requiredRole="admin">
    <AdminDash />
  </ProtectedRoute>
} />
```

---

## FRONTEND FILES - LANDING PAGE

### `frontend/src/landing_page/Signup/Login.js`
**Status:** 🟠 NEEDS FIXES

| Line(s) | Issue | Severity | Fix |
|---------|-------|----------|-----|
| 43 | Hardcoded API URL | 🟡 | Use env variable |
| N/A | No phone validation | 🟡 | Add regex validation |
| N/A | No password validation | 🟡 | Add length check |

**Missing Imports:**
```jsx
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

### `frontend/src/landing_page/Signup/Register.js`
**Status:** 🟠 NEEDS FIXES

| Line(s) | Issue | Severity | Fix |
|---------|-------|----------|-----|
| 35 | Hardcoded API URL | 🟡 | Use env variable |
| N/A | No form validation | 🟡 | Add validator library |
| N/A | Email not used anywhere | 🟡 | Remove email field or store |

### `frontend/src/landing_page/HomePage/Home.js`
**Status:** ✅ OK - Component composition is fine

### `frontend/src/landing_page/HomePage/Hero.js`
**Status:** 🟠 NEEDS FIXES

| Line(s) | Issue | Severity | Fix |
|---------|-------|----------|-----|
| 16 | "Book a court" button no onClick | 🟡 | Add navigate handler |
| 19 | "Explore Sports" button no onClick | 🟡 | Add scroll or navigate |

**Quick Fix:**
```jsx
const navigate = useNavigate();
<button onClick={() => navigate('/user')}>Book a court</button>
```

### `frontend/src/landing_page/HomePage/SearchBar.js`
**Status:** 🟠 NEEDS FIXES

| Line(s) | Issue | Severity | Fix |
|---------|-------|----------|-----|
| 27 | Search button no onClick | 🟡 | Add handler to redirect to /user |

### `frontend/src/landing_page/Contact/Contact.js`
**Status:** 🟠 NEEDS FIXES

| Line(s) | Issue | Severity | Fix |
|---------|-------|----------|-----|
| 43-66 | Form fields no onChange | 🟠 | Add state management |
| 73 | Send button not wired | 🟠 | Add submit handler |
| N/A | No API endpoint called | 🟠 | Call POST /contact |

### `frontend/src/landing_page/AboutPage/About.js`
**Status:** ✅ OK - Static content only

### `frontend/src/NavBar.js`
**Status:** 🟠 NEEDS FIXES

| Line(s) | Issue | Severity | Fix |
|---------|-------|----------|-----|
| 26 | Logo.png may not exist | 🟡 | Check if image in public folder |
| N/A | No logout option | 🟡 | Add logout button if logged in |

### `frontend/src/Footer.js`
**Status:** ✅ OK - Static content

---

## FRONTEND FILES - ADMIN DASHBOARD

### `frontend/src/dashboard/admin/AdminDash.js`
**Status:** ✅ OK - Routes structure fine

### `frontend/src/dashboard/admin/Navbar.js`
**Status:** 🟠 NEEDS FIXES

| Line(s) | Issue | Severity | Fix |
|---------|-------|----------|-----|
| N/A | No logout button | 🟡 | Add logout button |

### `frontend/src/dashboard/admin/AdminDashboard/Homepage/Home.js`
**Status:** 🟠 NEEDS FIXES - Hardcoded data

| Line(s) | Issue | Severity | Fix |
|---------|-------|----------|-----|
| 25+ | All stats hardcoded | 🟠 | Fetch from GET /admin/stats |
| N/A | No useEffect | 🟠 | Add useEffect to fetch stats |

**Needs:**
```jsx
const [stats, setStats] = useState({});
useEffect(() => {
  axios.get('/admin/stats', {headers: {Authorization: `Bearer ${token}`}})
    .then(res => setStats(res.data));
}, []);
```

### `frontend/src/dashboard/admin/AdminDashboard/Users/Users.js`
**Status:** 🟠 NEEDS FIXES

| Line(s) | Issue | Severity | Fix |
|---------|-------|----------|-----|
| 21 | Hardcoded API URL | 🟡 | Use env variable |
| 76 | "View" button no handler | 🟠 | Add onClick with modal |
| 78-82 | "Block/Unblock" button no handler | 🟠 | Call PUT /admin/users/:id/toggleStatus |
| N/A | Incomplete (cut off) | 🟠 | Complete component |

### `frontend/src/dashboard/admin/AdminDashboard/Owners/Owners.js`
**Status:** 🟠 NEEDS FIXES

| Line(s) | Issue | Severity | Fix |
|---------|-------|----------|-----|
| 24 | Hardcoded API URL | 🟡 | Use env variable |
| N/A | Search not real-time | 🟡 | Add onChange to handleFilter |

### `frontend/src/dashboard/admin/AdminDashboard/Requests/Requests.js`
**Status:** 🟠 NEEDS FIXES

| Line(s) | Issue | Severity | Fix |
|---------|-------|----------|-----|
| 7 | Hardcoded API URL | 🟡 | Use env variable |
| 30 | Search input has no onChange | 🟠 | Connect to search handler |
| N/A | Search not functional | 🟠 | Implement search filter |

### `frontend/src/dashboard/admin/AdminDashboard/Profile/Profile.js`
**Status:** 🟠 NEEDS FIXES

| Line(s) | Issue | Severity | Fix |
|---------|-------|----------|-----|
| 61 | Form still uses dummy state | 🟠 | Fetch from backend on load |
| 75 | "Change Password" button no handler | 🟡 | Add password modal |
| 79 | "Save Changes" button no handler | 🟠 | Call PUT /admin/profile |

---

## FRONTEND FILES - OWNER DASHBOARD

### `frontend/src/dashboard/courtowner/OwnerDash.js`
**Status:** ✅ OK - Routes fine

### `frontend/src/dashboard/courtowner/Navbar.js`
**Status:** ✅ OK - Has logout

### `frontend/src/dashboard/courtowner/Owner/MyCourts/MyCourts.js`
**Status:** 🟠 NEEDS FIXES - Incomplete modal

| Line(s) | Issue | Severity | Fix |
|---------|-------|----------|-----|
| 21 | Hardcoded API URL | 🟡 | Use env variable |
| 230+ | Modal incomplete | 🟠 | Complete form fields and close button |
| N/A | Modal styles missing | 🟠 | Verify CSS has modal-overlay, modal-card |
| N/A | No form validation | 🟡 | Add input validation |

**Missing in Modal:**
- Modal close button
- Submit button styles
- Price input completion
- Form validation

### `frontend/src/dashboard/courtowner/Owner/Bookings/Bookings.js`
**Status:** 🟠 NEEDS FIXES

| Line(s) | Issue | Severity | Fix |
|---------|-------|----------|-----|
| 17 | Calls /mybookings (user endpoint) | 🟠 | Create /owner/mybookings endpoint |
| N/A | Table incomplete | 🟠 | Complete table body rendering |
| N/A | Hardcoded API URL | 🟡 | Use env variable |

### `frontend/src/dashboard/courtowner/Owner/Earnings/Earnings.js`
**Status:** 🟠 NEEDS FIXES

| Line(s) | Issue | Severity | Fix |
|---------|-------|----------|-----|
| 120+ | Table incomplete | 🟠 | Complete table rendering |
| N/A | Hardcoded earnings data | 🟠 | Fetch from backend |
| N/A | No useEffect | 🟠 | Add to fetch earnings |

### `frontend/src/dashboard/courtowner/Owner/HomePage/Homepage.js`
**Status:** ✅ OK - Component composition fine

### `frontend/src/dashboard/courtowner/Owner/HomePage/Welcome.js`
**Status:** ✅ OK - Looks good

### `frontend/src/dashboard/courtowner/Owner/HomePage/Stats.js`
**Status:** 🟠 NEEDS FIXES - Hardcoded

| Line(s) | Issue | Severity | Fix |
|---------|-------|----------|-----|
| All | All stats hardcoded | 🟠 | Fetch from /owner/stats |

### `frontend/src/dashboard/courtowner/Owner/HomePage/Bookings.js`
**Status:** 🟠 NEEDS FIXES - Hardcoded

| Line(s) | Issue | Severity | Fix |
|---------|-------|----------|-----|
| 5-20 | Dummy booking data | 🟠 | Fetch from backend |

### `frontend/src/dashboard/courtowner/Owner/Profile/Profile.js`
**Status:** 🟠 NEEDS FIXES

| Line(s) | Issue | Severity | Fix |
|---------|-------|----------|-----|
| N/A | "Save Changes" button no handler | 🟠 | Call PUT /owner/profile |
| N/A | Incomplete (cut off) | 🟠 | Complete component |

---

## FRONTEND FILES - USER DASHBOARD

### `frontend/src/dashboard/user/UserDash.js`
**Status:** ✅ OK - Routes fine

### `frontend/src/dashboard/user/Navbar.js`
**Status:** ✅ OK - Has logout

### `frontend/src/dashboard/user/userdashboard/Home/Homepage.js`
**Status:** ✅ OK - Component composition fine

### `frontend/src/dashboard/user/userdashboard/Home/Hero.js`
**Status:** ✅ OK - Shows user greeting

### `frontend/src/dashboard/user/userdashboard/Home/Search.js`
**Status:** 🟠 NEEDS FIXES - Incomplete

| Line(s) | Issue | Severity | Fix |
|---------|-------|----------|-----|
| 37 | Hardcoded API URL | 🟡 | Use env variable |
| 176+ | Return statement incomplete | 🟠 | Complete component rendering |
| N/A | Modal may not close properly | 🟠 | Verify close handlers |

### `frontend/src/dashboard/user/userdashboard/Home/Upcoming.js`
**Status:** 🟠 NEEDS FIXES

| Line(s) | Issue | Severity | Fix |
|---------|-------|----------|-----|
| 42 | Hardcoded API URL | 🟡 | Use env variable |
| N/A | Return statement incomplete | 🟠 | Complete component rendering |
| N/A | Time sorting logic complex | 🟡 | Simplify or verify works |

### `frontend/src/dashboard/user/userdashboard/Mybookings/Mybooking.js`
**Status:** 🟠 NEEDS FIXES - Incomplete

| Line(s) | Issue | Severity | Fix |
|---------|-------|----------|-----|
| 13 | Hardcoded API URL | 🟡 | Use env variable |
| N/A | Missing time sort display | 🟡 | Simplify time range logic |

### `frontend/src/dashboard/user/userdashboard/profile/Profile.js`
**Status:** 🟠 NEEDS FIXES

| Line(s) | Issue | Severity | Fix |
|---------|-------|----------|-----|
| 26 | Dummy state only | 🟠 | Fetch from backend on load |
| 47 | "Save Changes" button calls alert | 🟠 | Call PUT /profile |
| N/A | Incomplete (cut off) | 🟠 | Complete component |

---

## CONFIGURATION FILES NEEDED

### `frontend/.env` - MISSING ❌
**Create with:**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

### `backend/.env` - EXISTS BUT NEEDS UPDATE
**Add:**
```env
PORT=5000
NODE_ENV=development
```

---

## DEPENDENCY INSTALLATIONS NEEDED

### Frontend
```bash
npm install validator          # Form validation
npm install react-toastify    # Toast notifications
npm install react-query       # Data fetching/caching (optional)
```

### Backend
```bash
# Already have most, may need:
npm install dotenv            # Already there
npm install pg                # Already there
# Good to add:
npm install winston           # Logging
```

---

## DATABASE SETUP NEEDED

1. Run SQL from `DATABASE_SCHEMA.md`
2. Seed default admin user
3. Verify tables created

---

## SUMMARY OF CHANGES BY FILE

**Critical Changes (Must Do):**
- [ ] backend/server.js - Fix error handling
- [ ] frontend/src/index.js - Add protected routes
- [ ] All hardcoded API URLs - Use env variables
- [ ] Admin/Owner/User dashboards - Implement statistics fetching

**High Priority Changes (Should Do Soon):**
- [ ] All profile pages - Implement save functionality
- [ ] Admin/Requests - Make search functional
- [ ] MyCourts - Complete modal implementation
- [ ] Contact form - Implement submission

**Medium Priority Changes (Nice to Do):**
- [ ] Form validation - Add proper validation
- [ ] Logo asset - Add image
- [ ] Loading states - Add spinners
- [ ] Error handling - Improve messages

**Low Priority Changes (Can Do Later):**
- [ ] Email notifications
- [ ] Payment integration
- [ ] Advanced analytics
- [ ] Real-time updates
