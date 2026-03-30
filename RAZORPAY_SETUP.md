# Razorpay Payment Gateway Integration

## Overview
CourtEase now integrates **Razorpay** as the payment gateway for secure online transactions. This guide explains how to set up and use Razorpay in your CourtEase application.

## What's New?
✅ **Razorpay Payment Integration** - Secured payment processing
✅ **Real Payment Verification** - HMAC-SHA256 signature verification
✅ **Multiple Payment Methods** - Credit/Debit Cards, UPI, NetBanking, Wallets
✅ **Automatic Booking Creation** - Bookings created only after successful payment
✅ **Payment Records** - All transactions stored in database

## Setup Instructions

### Step 1: Get Razorpay API Keys

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Sign up / Log in to your account
3. Navigate to **Settings → API Keys**
4. Copy your **Key ID** (Public) and **Key Secret** (Private)
5. Make sure you're in **Test Mode** for development

### Step 2: Configure Backend

Update `backend/.env` with your Razorpay credentials:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_actual_key_id
RAZORPAY_KEY_SECRET=test_your_actual_secret
```

### Step 3: Configure Frontend

Update `frontend/.env` with your public key:

```env
REACT_APP_RAZORPAY_KEY_ID=rzp_test_your_actual_key_id
```

### Step 4: Restart Services

```bash
# Restart Backend
cd backend
npm start

# Restart Frontend (in another terminal)
cd frontend
npm start
```

## How It Works

### Booking Flow with Razorpay

```
User Search & Select Court
         ↓
      Select Time Slots
         ↓
    Proceed to Payment
         ↓
  Razorpay Payment Modal Opens
         ↓
User Enters Payment Details
(Card, UPI, NetBanking, etc.)
         ↓
Payment Processed by Razorpay
         ↓
Backend Verifies Signature
         ↓
✅ Booking Created in Database
✅ Payment Record Saved
✅ Confirmation Sent to User
```

## Test Credentials

### Test Card Numbers (for development):

```
Visa:
Card: 4111 1111 1111 1111
Expiry: Any future date (MM/YY)
CVV: Any 3 digits

Mastercard:
Card: 5555 5555 5555 4444
Expiry: Any future date (MM/YY)
CVV: Any 3 digits
```

### Test UPI IDs:
- `success@razorpay` - Payment will succeed
- `failure@razorpay` - Payment will fail

## API Endpoints

### 1. Create Razorpay Order
**POST** `/create-razorpay-order`

**Auth Required:** Yes (Bearer Token)

**Payload:**
```json
{
  "amount": 1000,
  "bookingDetails": {
    "court": "Elite Badminton Courts",
    "sport": "Badminton",
    "date": "2026-04-15",
    "timeRange": "06:00 - 07:00",
    "duration": 1
  }
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "order_2NE6d8vUmK7zW1",
  "amount": 1000,
  "currency": "INR"
}
```

### 2. Verify Razorpay Payment
**POST** `/verify-razorpay-payment`

**Auth Required:** Yes (Bearer Token)

**Payload:**
```json
{
  "orderId": "order_2NE6d8vUmK7zW1",
  "paymentId": "pay_2NE6d8vUmK7zW1",
  "signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d",
  "bookingData": {
    "courtId": 1,
    "slotIds": [1, 2],
    "bookingDate": "2026-04-15",
    "amount": 1000
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking confirmed",
  "bookings": [...]
}
```

## Frontend Components

### RazorpayGateway.js
Located: `frontend/src/dashboard/user/userdashboard/Home/RazorpayGateway.js`

Features:
- Displays booking summary
- Shows total amount to pay
- Handles Razorpay modal
- Verifies payment with backend
- Creates bookings on success

### Updated Search.js
- Now uses RazorpayGateway instead of dummy payment
- Includes courtId and slotIds in payment data
- Handles Razorpay payment success callback

## Backend Implementation

### New Endpoints in server.js

**1. POST /create-razorpay-order**
- Creates a Razorpay order
- Stores booking details in order notes
- Returns order ID and amount

**2. POST /verify-razorpay-payment**
- Verifies HMAC-SHA256 signature
- Creates booking record in database
- Saves payment transaction
- Returns created bookings

## Security Features

✅ **HMAC-SHA256 Signature Verification** - Ensures payment authenticity
✅ **JWT Authentication** - Required for payment endpoints
✅ **Encrypted Communication** - HTTPS/TLS for all transactions
✅ **PCI DSS Compliance** - Razorpay handles card data securely
✅ **Error Handling** - Proper error messages and logging

## Troubleshooting

### Issue: "Razorpay gateway not loaded"
**Solution:** Clear browser cache and reload. Check if:
- Razorpay CDN script loaded properly
- Network tab shows script loading
- No browser extensions blocking scripts

### Issue: "Payment verification failed"
**Solution:** Check:
- RAZORPAY_KEY_SECRET in backend/.env is correct
- Payment signature matches received signature
- Order ID and Payment ID are correct

### Issue: "Amount mismatch"
**Solution:** Ensure:
- Frontend calculation: slots × price_per_hour
- Backend receives correct amount in paise (multiply by 100)
- No decimal value issues

### Issue: "Booking not created after payment"
**Solution:** Check:
- Backend logs for error messages
- Database has all required tables
- JWT token is valid and not expired
- slotIds array is not empty

## Testing Checklist

- [ ] Razorpay keys configured in .env
- [ ] Backend server running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] Can search and select courts
- [ ] Can select time slots
- [ ] Razorpay modal opens on "Pay Now"
- [ ] Test payment with test card succeeds
- [ ] Booking created in database after payment
- [ ] Payment record saved
- [ ] User sees success message
- [ ] Owner can see booking in Earnings dashboard

## Production Checklist

Before going live:

- [ ] Replace test keys with production Razorpay keys
- [ ] Update environment variables in production servers
- [ ] Enable HTTPS/TLS
- [ ] Set `NODE_ENV=production` in backend
- [ ] Enable payment verification in all flows
- [ ] Test with real orders (small amounts)
- [ ] Set up error logging and monitoring
- [ ] Configure webhook endpoints for Razorpay events
- [ ] Test refund workflow
- [ ] Create business support email for disputes

## Next Steps

1. ✅ Get Razorpay API keys
2. ✅ Add to .env files
3. ✅ Test payment flow with test cards
4. ✅ Monitor payment logs
5.📋 Deploy to production
6. 📋 Set up Razorpay webhooks
7. 📋 Configure refund policy

## Support

For Razorpay support: https://razorpay.com/support
For CourtEase support: Contact development team

---

**Payment Gateway Status:** ✅ INTEGRATED
**Test Mode:** ✅ READY
**Production Mode:** ⚠️ PENDING REAL KEYS
