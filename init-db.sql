-- ============================================
-- COURTEASE DATABASE SCHEMA - CLEAN INSTALL
-- ============================================
-- PostgreSQL Database Schema for CourtEase Application
-- This script safely drops existing tables and creates fresh schema

-- ============================================
-- DROP EXISTING TABLES (CASCADE to handle dependencies)
-- ============================================
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS admin_activity_logs CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS court_slots CASCADE;
DROP TABLE IF EXISTS courts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
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
CREATE TABLE courts (
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
CREATE TABLE court_slots (
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
CREATE TABLE bookings (
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
CREATE TABLE payments (
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
CREATE TABLE admin_activity_logs (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
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
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'responded')),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at);

-- ============================================
-- INSERT DEFAULT ADMIN USER
-- ============================================
-- Password: admin123
-- Bcrypt Hash: $2b$10$nw6rBsEjMB.x8V6qwV8Weu1ceLLZyHuhZ4dIGmWYhLLHaR0aRHx.O
INSERT INTO users (name, email, phone, password, role, approval_status, is_active, city)
VALUES (
  'Admin User',
  'admin@courtease.com',
  '9999999999',
  '$2a$12$1Sgy8GIbRrSYffYRID3LfegYImrk.BQ2SKBrVbtCO4BnM60I8Hflu',
  'admin',
  'approved',
  true,
  'Admin City'
);

-- ============================================
-- INSERT DUMMY TEST USERS
-- ============================================
-- Password: Mani@9948 for all
-- Bcrypt Hash: $2b$12$cziamGQwNgmHiLMvC9qlCO6YyOBAof0gyaQQU4DikyaPyWZuZC1V6
INSERT INTO users (name, email, phone, password, role, approval_status, is_active, city, created_at)
VALUES 
  ('Raj Kumar', 'raj@test.com', '9876543210', '$2b$12$cziamGQwNgmHiLMvC9qlCO6YyOBAof0gyaQQU4DikyaPyWZuZC1V6', 'user', 'approved', true, 'Bangalore', NOW() - INTERVAL '60 days'),
  ('Priya Singh', 'priya@test.com', '7894561230', '$2b$12$cziamGQwNgmHiLMvC9qlCO6YyOBAof0gyaQQU4DikyaPyWZuZC1V6', 'user', 'approved', true, 'Bangalore', NOW() - INTERVAL '45 days'),
  ('Amit Patel', 'amit@test.com', '9014420594', '$2b$12$cziamGQwNgmHiLMvC9qlCO6YyOBAof0gyaQQU4DikyaPyWZuZC1V6', 'user', 'approved', true, 'Mumbai', NOW() - INTERVAL '30 days'),
  ('Neha Verma', 'neha@test.com', '9988776655', '$2b$12$cziamGQwNgmHiLMvC9qlCO6YyOBAof0gyaQQU4DikyaPyWZuZC1V6', 'user', 'approved', true, 'Delhi', NOW() - INTERVAL '20 days'),
  ('Vikram Sharma', 'vikram@test.com', '9234567890', '$2b$12$cziamGQwNgmHiLMvC9qlCO6YyOBAof0gyaQQU4DikyaPyWZuZC1V6', 'user', 'approved', true, 'Bangalore', NOW() - INTERVAL '15 days'),
  ('Anjali Goel', 'anjali@test.com', '8765432109', '$2b$12$cziamGQwNgmHiLMvC9qlCO6YyOBAof0gyaQQU4DikyaPyWZuZC1V6', 'user', 'approved', true, 'Pune', NOW() - INTERVAL '10 days'),
  ('Manish Kumar', 'manish@test.com', '9876501234', '$2b$12$cziamGQwNgmHiLMvC9qlCO6YyOBAof0gyaQQU4DikyaPyWZuZC1V6', 'user', 'approved', true, 'Chennai', NOW() - INTERVAL '5 days');

-- ============================================
-- INSERT DUMMY COURT OWNERS
-- ============================================
INSERT INTO users (name, email, phone, password, role, approval_status, is_active, city, created_at)
VALUES 
  ('Owner One', 'owner1@test.com', '9948654190', '$2b$12$cziamGQwNgmHiLMvC9qlCO6YyOBAof0gyaQQU4DikyaPyWZuZC1V6', 'owner', 'approved', true, 'Bangalore', NOW() - INTERVAL '50 days'),
  ('Owner Two', 'owner2@test.com', '9156782345', '$2b$12$cziamGQwNgmHiLMvC9qlCO6YyOBAof0gyaQQU4DikyaPyWZuZC1V6', 'owner', 'approved', true, 'Mumbai', NOW() - INTERVAL '40 days'),
  ('Owner Three', 'owner3@test.com', '6281779375', '$2b$12$cziamGQwNgmHiLMvC9qlCO6YyOBAof0gyaQQU4DikyaPyWZuZC1V6', 'owner', 'approved', true, 'Delhi', NOW() - INTERVAL '35 days'),
  ('Pending Owner', 'pendingowner@test.com', '9876545678', '$2b$12$cziamGQwNgmHiLMvC9qlCO6YyOBAof0gyaQQU4DikyaPyWZuZC1V6', 'owner', 'pending', true, 'Pune', NOW() - INTERVAL '2 days');

-- ============================================
-- INSERT DUMMY COURTS
-- ============================================
INSERT INTO courts (owner_id, name, sport, location, city, price_per_hour, description, amenities, capacity, is_active, created_at)
VALUES 
  (2, 'Elite Badminton Courts', 'Badminton', 'Koramangala', 'Bangalore', 500, 'Premium badminton courts with AC', '["AC", "Parking", "Cafe"]', 4, true, NOW() - INTERVAL '45 days'),
  (2, 'Thunder Tennis Complex', 'Tennis', 'Whitefield', 'Bangalore', 800, 'Professional tennis courts', '["Lights", "Parking", "Coaching"]', 3, true, NOW() - INTERVAL '40 days'),
  (3, 'Mumbai Badminton Hub', 'Badminton', 'Bandra', 'Mumbai', 600, 'Modern badminton facility', '["AC", "WiFi", "Lounge"]', 6, true, NOW() - INTERVAL '35 days'),
  (3, 'Cricket Academy', 'Cricket', 'Dadar', 'Mumbai', 1000, 'Full-size cricket pitch', '["Pitches", "Nets", "Coaching"]', 2, true, NOW() - INTERVAL '30 days'),
  (4, 'Delhi Sports Arena', 'Tennis', 'South Delhi', 'Delhi', 700, 'International standard tennis', '["Lights", "AC", "Parking"]', 4, true, NOW() - INTERVAL '25 days'),
  (4, 'Delhi Football Ground', 'Football', 'Dwarka', 'Delhi', 900, '5-a-side football courts', '["Turf", "Lights", "Parking"]', 5, true, NOW() - INTERVAL '20 days'),
  (2, 'Bangalore Cricket Nets', 'Cricket', 'Indiranagar', 'Bangalore', 1200, 'Premium cricket nets', '["Nets", "Coaching", "Parking"]', 8, true, NOW() - INTERVAL '15 days'),
  (3, 'Mumbai Football Club', 'Football', 'Malad', 'Mumbai', 1100, '7-a-side football ground', '["Ground", "Lights", "Cafe"]', 4, true, NOW() - INTERVAL '10 days');

-- ============================================
-- INSERT DUMMY COURT SLOTS
-- ============================================
-- Court 1 - Elite Badminton (8 slots per day)
INSERT INTO court_slots (court_id, slot_time, duration, is_available, created_at)
VALUES
  (1, '06:00:00', 60, true, NOW() - INTERVAL '40 days'),
  (1, '07:00:00', 60, true, NOW() - INTERVAL '40 days'),
  (1, '08:00:00', 60, true, NOW() - INTERVAL '40 days'),
  (1, '09:00:00', 60, true, NOW() - INTERVAL '40 days'),
  (1, '17:00:00', 60, true, NOW() - INTERVAL '40 days'),
  (1, '18:00:00', 60, true, NOW() - INTERVAL '40 days'),
  (1, '19:00:00', 60, true, NOW() - INTERVAL '40 days'),
  (1, '20:00:00', 60, true, NOW() - INTERVAL '40 days');

-- Court 2 - Thunder Tennis (8 slots)
INSERT INTO court_slots (court_id, slot_time, duration, is_available, created_at)
VALUES
  (2, '06:00:00', 60, true, NOW() - INTERVAL '35 days'),
  (2, '07:00:00', 60, true, NOW() - INTERVAL '35 days'),
  (2, '08:00:00', 60, true, NOW() - INTERVAL '35 days'),
  (2, '09:00:00', 60, true, NOW() - INTERVAL '35 days'),
  (2, '17:00:00', 60, true, NOW() - INTERVAL '35 days'),
  (2, '18:00:00', 60, true, NOW() - INTERVAL '35 days'),
  (2, '19:00:00', 60, true, NOW() - INTERVAL '35 days'),
  (2, '20:00:00', 60, true, NOW() - INTERVAL '35 days');

-- Court 3 - Mumbai Badminton (8 slots)
INSERT INTO court_slots (court_id, slot_time, duration, is_available, created_at)
VALUES
  (3, '06:00:00', 60, true, NOW() - INTERVAL '30 days'),
  (3, '07:00:00', 60, true, NOW() - INTERVAL '30 days'),
  (3, '08:00:00', 60, true, NOW() - INTERVAL '30 days'),
  (3, '09:00:00', 60, true, NOW() - INTERVAL '30 days'),
  (3, '17:00:00', 60, true, NOW() - INTERVAL '30 days'),
  (3, '18:00:00', 60, true, NOW() - INTERVAL '30 days'),
  (3, '19:00:00', 60, true, NOW() - INTERVAL '30 days'),
  (3, '20:00:00', 60, true, NOW() - INTERVAL '30 days');

-- Court 4 - Cricket Academy (4 slots)
INSERT INTO court_slots (court_id, slot_time, duration, is_available, created_at)
VALUES
  (4, '07:00:00', 60, true, NOW() - INTERVAL '25 days'),
  (4, '08:00:00', 60, true, NOW() - INTERVAL '25 days'),
  (4, '17:00:00', 60, true, NOW() - INTERVAL '25 days'),
  (4, '18:00:00', 60, true, NOW() - INTERVAL '25 days');

-- Court 5 & 6 (Delhi) - 8 slots each
INSERT INTO court_slots (court_id, slot_time, duration, is_available, created_at)
VALUES
  (5, '06:00:00', 60, true, NOW() - INTERVAL '20 days'),
  (5, '07:00:00', 60, true, NOW() - INTERVAL '20 days'),
  (5, '17:00:00', 60, true, NOW() - INTERVAL '20 days'),
  (5, '18:00:00', 60, true, NOW() - INTERVAL '20 days'),
  (6, '06:00:00', 60, true, NOW() - INTERVAL '20 days'),
  (6, '07:00:00', 60, true, NOW() - INTERVAL '20 days'),
  (6, '17:00:00', 60, true, NOW() - INTERVAL '20 days'),
  (6, '18:00:00', 60, true, NOW() - INTERVAL '20 days');

-- Court 7 & 8 - 8 slots each
INSERT INTO court_slots (court_id, slot_time, duration, is_available, created_at)
VALUES
  (7, '06:00:00', 60, true, NOW() - INTERVAL '10 days'),
  (7, '07:00:00', 60, true, NOW() - INTERVAL '10 days'),
  (7, '17:00:00', 60, true, NOW() - INTERVAL '10 days'),
  (7, '18:00:00', 60, true, NOW() - INTERVAL '10 days'),
  (8, '06:00:00', 60, true, NOW() - INTERVAL '5 days'),
  (8, '07:00:00', 60, true, NOW() - INTERVAL '5 days'),
  (8, '17:00:00', 60, true, NOW() - INTERVAL '5 days'),
  (8, '18:00:00', 60, true, NOW() - INTERVAL '5 days');

-- ============================================
-- INSERT DUMMY BOOKINGS (PAST, CURRENT, FUTURE)
-- ============================================
-- Past bookings (30+ days ago) - Completed
INSERT INTO bookings (user_id, court_id, slot_id, booking_date, amount, payment_status, booking_status, created_at)
VALUES 
  (1, 1, 1, CURRENT_DATE - INTERVAL '30 days', 500, 'completed', 'completed', NOW() - INTERVAL '30 days'),
  (2, 2, 9, CURRENT_DATE - INTERVAL '28 days', 800, 'completed', 'completed', NOW() - INTERVAL '28 days'),
  (3, 3, 17, CURRENT_DATE - INTERVAL '25 days', 600, 'completed', 'completed', NOW() - INTERVAL '25 days'),
  (4, 4, 21, CURRENT_DATE - INTERVAL '22 days', 1000, 'completed', 'completed', NOW() - INTERVAL '22 days'),
  (1, 1, 2, CURRENT_DATE - INTERVAL '20 days', 500, 'completed', 'completed', NOW() - INTERVAL '20 days'),
  (5, 5, 25, CURRENT_DATE - INTERVAL '18 days', 700, 'completed', 'completed', NOW() - INTERVAL '18 days'),
  (2, 2, 10, CURRENT_DATE - INTERVAL '15 days', 800, 'completed', 'completed', NOW() - INTERVAL '15 days'),
  (3, 3, 18, CURRENT_DATE - INTERVAL '12 days', 600, 'completed', 'completed', NOW() - INTERVAL '12 days'),
  (6, 6, 29, CURRENT_DATE - INTERVAL '10 days', 900, 'completed', 'completed', NOW() - INTERVAL '10 days'),
  (1, 7, 33, CURRENT_DATE - INTERVAL '8 days', 1200, 'completed', 'completed', NOW() - INTERVAL '8 days');

-- Recent bookings (5-15 days ago) - Completed
INSERT INTO bookings (user_id, court_id, slot_id, booking_date, amount, payment_status, booking_status, created_at)
VALUES 
  (2, 1, 3, CURRENT_DATE - INTERVAL '7 days', 500, 'completed', 'completed', NOW() - INTERVAL '7 days'),
  (4, 2, 11, CURRENT_DATE - INTERVAL '6 days', 800, 'completed', 'completed', NOW() - INTERVAL '6 days'),
  (5, 3, 19, CURRENT_DATE - INTERVAL '5 days', 600, 'completed', 'completed', NOW() - INTERVAL '5 days'),
  (7, 4, 22, CURRENT_DATE - INTERVAL '4 days', 1000, 'completed', 'completed', NOW() - INTERVAL '4 days'),
  (1, 5, 26, CURRENT_DATE - INTERVAL '3 days', 700, 'completed', 'completed', NOW() - INTERVAL '3 days'),
  (3, 6, 30, CURRENT_DATE - INTERVAL '2 days', 900, 'completed', 'completed', NOW() - INTERVAL '2 days');

-- Today's bookings - Completed
INSERT INTO bookings (user_id, court_id, slot_id, booking_date, amount, payment_status, booking_status, created_at)
VALUES 
  (2, 1, 4, CURRENT_DATE, 500, 'completed', 'confirmed', NOW() - INTERVAL '2 hours'),
  (4, 2, 12, CURRENT_DATE, 800, 'completed', 'confirmed', NOW() - INTERVAL '1 hours'),
  (6, 3, 20, CURRENT_DATE, 600, 'completed', 'confirmed', NOW() - INTERVAL '30 minutes');

-- Upcoming bookings (next 7 days)
INSERT INTO bookings (user_id, court_id, slot_id, booking_date, amount, payment_status, booking_status, created_at)
VALUES 
  (1, 1, 5, CURRENT_DATE + INTERVAL '1 days', 500, 'completed', 'confirmed', NOW()),
  (3, 2, 13, CURRENT_DATE + INTERVAL '2 days', 800, 'completed', 'confirmed', NOW()),
  (5, 3, 21, CURRENT_DATE + INTERVAL '3 days', 600, 'pending', 'confirmed', NOW()),
  (7, 4, 23, CURRENT_DATE + INTERVAL '4 days', 1000, 'completed', 'confirmed', NOW()),
  (2, 7, 34, CURRENT_DATE + INTERVAL '5 days', 1200, 'completed', 'confirmed', NOW());

-- ============================================
-- VERIFY DUMMY DATA CREATION
-- ============================================
-- Dummy data inserted successfully
-- Schema ready for analytics testing

-- ============================================
-- END OF SCHEMA WITH DUMMY DATA
-- ============================================
