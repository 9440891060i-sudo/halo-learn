# 🚀 Real Razorpay Payment Testing Guide

## ✅ Frontend-Backend Integration Status

**YES! Everything is connected and ready for real Razorpay payments!**

### ✨ What's Connected:

- ✅ Frontend (React) → Backend (Node.js) communication
- ✅ Razorpay payment gateway integration
- ✅ ShipRocket automatic order fulfillment
- ✅ Email notifications with tracking
- ✅ Both COD and Online payment flows

---

## 🎯 How the Payment Flow Works

```
Frontend (Checkout.tsx)
    ↓
1. User fills form + selects "Pay Online"
    ↓
2. Frontend calls: POST /api/create-order
    ↓
Backend (payments.js)
    ↓
3. Creates order in MongoDB
4. Creates Razorpay order via API
5. Returns Razorpay order ID + key
    ↓
Frontend
    ↓
6. Loads Razorpay SDK
7. Opens payment popup with user details
8. User enters card/UPI details
    ↓
Razorpay
    ↓
9. Processes payment
    ↓
Frontend
    ↓
10. Gets payment signature from Razorpay
11. Calls: POST /api/verify-payment
    ↓
Backend
    ↓
12. Validates signature (HMAC-SHA256)
13. Creates ShipRocket order
14. Assigns courier & gets AWB
15. Sends tracking email
16. Returns success with AWB
    ↓
Frontend
    ↓
17. Shows success message
18. Redirects to home
```

---

## 🛠️ Prerequisites

### Required Environment Variables (Already Set in .env)

```bash
RAZORPAY_KEY_ID=rzp_live_RrMjRcp1jEcitU
RAZORPAY_KEY_SECRET=tamSsTfjYZAFwpu4RmYeu3uN
SHIPROCKET_API_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ...
MONGO_URI=mongodb+srv://admin:admin@tricher.mjfm7er.mongodb.net/
```

### Check Backend Status

```bash
cd backedn
npm install  # If not already done
node server.js
# Should output: Connected to MongoDB, Server running on port 5000
```

### Check Frontend Status

```bash
cd halo-learn
npm run dev
# Should output: Local: http://localhost:5173/
```

---

## 💳 Step-by-Step Real Payment Testing

### Step 1: Start Backend Server

```bash
cd backedn
node server.js
```

**Expected Output:**

```
Connected to MongoDB
Server running on port 5000
```

---

### Step 2: Start Frontend Development Server

```bash
cd halo-learn
npm run dev
```

**Expected Output:**

```
Local: http://localhost:5173/
```

---

### Step 3: Open Checkout Page

Navigate to: `http://localhost:5173/checkout`

You should see:

- 📦 Order Summary section
- 💰 Price display
- 🎟️ Coupon code input
- 👤 Contact form (Name, Email, Mobile)
- 🏠 Shipping address form
- 💳 Payment method selection

---

### Step 4: Fill in Order Details

**Shipping Address Example:**

```
Name: Surya Charan
Email: psaisuryacharan@gmail.com
Mobile: 8328166638
Address: Street 1, Visalakshi Nagar
City: Bangalore
Pincode: 560001
State: Karnataka
```

**Important:**

- Use a valid email to receive order confirmation
- Use a real pincode (ShipRocket checks serviceability)
- Use your actual mobile number

---

### Step 5: Select Payment Method

Click **"Pay Online"** button

---

### Step 6: Razorpay Payment Popup Opens

You'll see Razorpay's payment modal with:

- ✅ Order amount (₹499 or your selected amount)
- ✅ Your prefilled email
- ✅ Your prefilled phone number
- 💳 Payment method options:
  - Debit/Credit Card
  - UPI
  - Netbanking
  - Wallet

**For Testing (Use Razorpay Test Cards):**

#### Test Card 1: Success Payment

```
Card Number: 4111 1111 1111 1111
Expiry: Any future date (MM/YY)
CVV: 123
Name: Any name
```

#### Test Card 2: Another Success

```
Card Number: 4012 8888 8888 1881
Expiry: Any future date
CVV: 123
```

#### Test Card 3: Declined Payment

```
Card Number: 4000 0000 0000 0002
Expiry: Any future date
CVV: 123
```

**For UPI Testing:**

```
UPI ID: success@razorpay
```

---

### Step 7: Complete Payment

1. Enter card details (or UPI)
2. Click **Pay** button
3. You might see OTP screen - click **Skip** (test mode)

---

### Step 8: Verify Success

After payment, you should see:

- ✅ Success toast message
- ✅ "Order confirmed"
- ✅ Redirect to homepage

**Check your email for:**

```
From: Tricher <noreply@tricher.in>
Subject: 🚚 Your Tricher Order #123456 is Ready to Ship!
Contains:
  - Order number
  - AWB tracking number
  - Tracking URL
  - Shipping details
```

---

## 🔍 Backend Logs to Watch

When payment is verified, backend will log:

```
📦 Creating ShipRocket order for orderId: 507f1f77bcf86cd799439011
✅ ShipRocket order created: shiprocketOrderId: 123456789
🎯 Assigning courier for shipmentId: 987654321
✅ Courier assigned, AWB: 321055706540
📤 Sending tracking email to: psaisuryacharan@gmail.com
✅ Email sent successfully
```

---

## 🧪 Test Different Scenarios

### Scenario 1: Full Online Payment Flow

**Steps:**

1. Fill form → Select Online → Pay Online
2. Use test card 4111 1111 1111 1111
3. Complete payment
4. **Expected:** Success message + Email

### Scenario 2: Cash on Delivery

**Steps:**

1. Fill form → Select COD
2. Click "Place Order"
3. **Expected:** "Order Placed, Pay on delivery" message

### Scenario 3: With Coupon

**Steps:**

1. Enter coupon code (e.g., "SAVE10")
2. Click Apply
3. See discount applied
4. Fill form → Pay Online
5. **Expected:** Lower final amount + Email

### Scenario 4: Different Product

**Steps:**

1. From pricing/plans page, select "Basic" or "Pro"
2. Should redirect to checkout with correct amount
3. For digital plans: Online only (no COD)
4. **Expected:** Different amount + no shipping address required

### Scenario 5: Multiple Orders (Different Email)

**Steps:**

1. First order: email1@example.com
2. Second order: email2@example.com
3. Each should get separate confirmation
4. **Expected:** 2 separate emails with unique order numbers

---

## 🚨 Troubleshooting

### Issue: Razorpay Modal Not Opening

**Solution:**

```javascript
// Check browser console (F12 → Console)
// Should see: Razorpay SDK loaded
// If error: Check VITE_RZP_KEY in .env
```

### Issue: Payment Verification Fails

**Backend logs:**

```
❌ Signature verification failed
```

**Solution:**

- Verify Razorpay key is correct
- Check payment signature is valid
- Ensure order ID matches

### Issue: Email Not Received

**Check:**

1. Spam/Junk folder
2. Verify email address is correct in form
3. Backend logs show "✅ Email sent successfully"?
4. AWS SES status is active

### Issue: ShipRocket Order Not Created

**Backend logs:**

```
❌ Failed to create ShipRocket order
```

**Check:**

1. Pincode is serviceable
2. Address is complete
3. ShipRocket API token is valid
4. API rate limit not exceeded

### Issue: "Port 5000 already in use"

```bash
# Kill existing process
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5000
kill -9 <PID>
```

---

## 📊 Monitoring Payment Flow

### Via Browser Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Make payment
4. Look for requests:
   - `POST /api/create-order` → Status 200
   - `POST /api/verify-payment` → Status 200
5. Check response bodies for order/tracking info

### Via Backend Console

```bash
# Terminal running backend server
# Should see logs like:
📦 Creating ShipRocket order...
✅ Courier assigned, AWB: 321055706540
📤 Sending email...
✅ Email sent successfully
```

### Via Database

```bash
# Check MongoDB collections
# 1. Orders collection should have new document
# 2. Fields should include:
#    - razorpayOrderId
#    - razorpayPaymentId
#    - shiprocketOrderId
#    - shiprocketAwb
#    - shipmentStatus: "shipped"
```

---

## 💡 Important Notes

### Real vs Test Keys

- **Current Setup:** Using LIVE keys
- **Keys in use:**
  - `rzp_live_RrMjRcp1jEcitU` (Public)
  - `tamSsTfjYZAFwpu4RmYeu3uN` (Secret)
- **Can use:** Test cards work with live keys

### Test Card Characteristics

- Test cards work on LIVE Razorpay accounts
- No actual money is charged
- Same signature validation as real cards
- Full webhook support

### Production Checklist

Before going to production:

- ✅ Test all payment scenarios
- ✅ Test error handling
- ✅ Verify email templates look good
- ✅ Check ShipRocket integration
- ✅ Monitor first few real payments
- ✅ Set up error alerts
- ✅ Enable HTTPS everywhere

---

## 🎯 Complete Test Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can access `http://localhost:5173/checkout`
- [ ] Form fields accept input
- [ ] COD payment method works
- [ ] Online payment method shows Razorpay
- [ ] Test card payment succeeds
- [ ] Success message appears
- [ ] Email received in inbox
- [ ] Email contains AWB number
- [ ] Can click tracking URL
- [ ] Backend logs show successful flow
- [ ] Can make multiple orders
- [ ] Coupon discount works

---

## 📞 Support

**For issues, check:**

1. Backend console for error logs
2. Browser console (F12 → Console)
3. Network tab for API responses
4. Email spam folder for confirmations

**Common Issues:**

- CORS error? → Check backend CORS configuration
- Razorpay error? → Verify API keys
- Email not received? → Check AWS SES limits
- ShipRocket fail? → Check pincode serviceability

---

**You're all set to test real Razorpay payments!** 🎉

Follow the steps above and let me know if you need any help.
