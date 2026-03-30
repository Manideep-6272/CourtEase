# Database Schema - Required Tables and Structure

## Database Initialization Script (PostgreSQL)

### Complete Database Schema

```sql
-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'owner', 'admin')),
    approval_status VARCHAR(50) DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    is_active BOOLEAN DEFAULT true,
    city VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_approval_status ON users(approval_status);


-- ============================================
-- COURTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS courts (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sport VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    price_per_hour DECIMAL(10, 2) NOT NULL,
    description TEXT,
    amenities JSON,
    capacity INTEGER,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_courts_owner_id ON courts(owner_id);
CREATE INDEX idx_courts_city_sport ON courts(city, sport);
CREATE INDEX idx_courts_is_active ON courts(is_active);


-- ============================================
-- COURT SLOTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS court_slots (
    id SERIAL PRIMARY KEY,
    court_id INTEGER NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
    slot_time TIME NOT NULL,
    duration INTEGER DEFAULT 60,
    start_time TIME,
    end_time TIME,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(court_id, slot_time)
);

CREATE INDEX idx_court_slots_court_id ON court_slots(court_id);
CREATE INDEX idx_court_slots_availability ON court_slots(is_available);


-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    court_id INTEGER NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
    slot_id INTEGER NOT NULL REFERENCES court_slots(id) ON DELETE CASCADE,
    booking_date DATE NOT NULL,
    amount DECIMAL(10, 2),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'refunded', 'failed')),
    payment_method VARCHAR(50),
    booking_status VARCHAR(50) DEFAULT 'confirmed' CHECK (booking_status IN ('confirmed', 'cancelled', 'completed')),
    cancellation_reason TEXT,
    refund_amount DECIMAL(10, 2),
    cancellation_timestamp TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_court_id ON bookings(court_id);
CREATE INDEX idx_bookings_booking_date ON bookings(booking_date);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);


-- ============================================
-- PAYMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(255) UNIQUE,
    payment_status VARCHAR(50) NOT NULL CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_payments_created_at ON payments(created_at);


-- ============================================
-- ADMIN ACTIVITY LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admin_activity_logs (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NOT NULL CHECK (target_type IN ('user', 'owner', 'court', 'booking', 'payment')),
    target_id INTEGER NOT NULL,
    details JSON,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_admin_logs_admin_id ON admin_activity_logs(admin_id);
CREATE INDEX idx_admin_logs_target ON admin_activity_logs(target_type, target_id);
CREATE INDEX idx_admin_logs_created_at ON admin_activity_logs(created_at);


-- ============================================
-- CONTACT MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'responded')),
    created_at TIMESTAMP DEFAULT NOW(),
    responded_at TIMESTAMP
);

CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at);


-- ============================================
-- REVIEWS/RATINGS TABLE (Optional but recommended)
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    court_id INTEGER NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reviews_court_id ON reviews(court_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);


-- ============================================
-- ADMIN SEEDING (Create Default Admin)
-- ============================================
INSERT INTO users (name, email, phone, password, role, approval_status, is_active)
VALUES (
    'Admin User',
    'admin@courtease.com',
    '9999999999',
    '$2b$10$K8.Jq0R0v0nK8QFt0L1m.OfLvUPu8YhGJBfEhqVJtQPvHxaFhNBNC', -- password: 'admin123' (use actual bcrypt hash)
    'admin',
    'approved',
    true
)
ON CONFLICT (phone) DO NOTHING;
```

## Important Notes:

1. **Table Relationships:**
   - users ← courts (owner_id)
   - users ← bookings (user_id)
   - courts ← bookings (court_id)
   - court_slots ← bookings (slot_id)
   - bookings ← payments (booking_id)
   - users ← admin_activity_logs (admin_id)

2. **Data Integrity:**
   - Cascading deletes for owner → courts → court_slots → bookings
   - Unique constraints on phone numbers
   - Check constraints for enum-like fields

3. **Performance:**
   - Indexes on frequently queried fields
   - Foreign key indexes for joins
   - Date indexes for time-range queries

4. **Default Admin:**
   - Phone: 9999999999
   - Role: admin
   - Status: approved
   - Password hash needs to be bcrypt hashed "admin123" or change accordingly

## Required Backend Environment Variables

```env
# Database
DB_HOST=db.fdqokyobujthyvbtocwh.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=PIBhGtgyqre1mHxA
DB_NAME=postgres

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=24h

# CORS
CORS_ORIGIN=http://localhost:3000

# Email (if implementing email notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your_app_password

# Payments (if implementing payment integration)
STRIPE_SECRET_KEY=sk_test_xxx
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx

# Logging
LOG_LEVEL=info
```

## Backend API Response Schema

### Success Response
```json
{
    "success": true,
    "message": "Operation successful",
    "data": { /* response data */ },
    "timestamp": "2026-03-25T10:30:00Z"
}
```

### Error Response
```json
{
    "success": false,
    "message": "Error message",
    "error": {
        "code": "ERROR_CODE",
        "details": "Additional details"
    },
    "timestamp": "2026-03-25T10:30:00Z"
}
```
