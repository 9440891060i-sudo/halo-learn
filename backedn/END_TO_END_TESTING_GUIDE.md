# End-to-End Testing Guide

## Pre-Testing Checklist

Before starting tests, verify:

- [ ] Backend is running (`npm start` or `node server.js`)
- [ ] MongoDB connection is active
- [ ] SMTP credentials are configured
- [ ] Razorpay test keys are set
- [ ] ShipRocket credentials are set
- [ ] Backend is on http://localhost:5000

---

## Test 1: Email Service Verification

**Purpose**: Ensure email service is working before testing orders

### Steps

1. Call test email endpoint
2. Check inbox for test email

### Command

```bash
curl http://localhost:5000/api/payments/test-email
```

### Expected Response

```json
{
  "success": true,
  "messageId": "<GENERATED_MESSAGE_ID>"
}
```

### Verification

- [ ] Receive email at configured test address
- [ ] Email subject: "✅ Tricher SES Test"
- [ ] Email contains test message
- [ ] Email formatted correctly

**Status**: ⏳ Pending / ✅ Pass / ❌ Fail

---

## Test 2: ShipRocket Configuration Check

**Purpose**: Verify ShipRocket credentials are configured

### Steps

1. Call shiprocket-config endpoint
2. Verify all fields are set

### Command

```bash
curl http://localhost:5000/api/payments/shiprocket-config
```

### Expected Response

```json
{
  "configured": true,
  "emailSet": true,
  "passwordSet": true,
  "pickupLocationId": "33751024",
  "sellerName": "Tricher"
}
```

### Verification

- [ ] `configured`: true
- [ ] `emailSet`: true
- [ ] `passwordSet`: true
- [ ] `pickupLocationId` is set
- [ ] `sellerName` shows "Tricher"

**Status**: ⏳ Pending / ✅ Pass / ❌ Fail

---

## Test 3: Pincode Serviceability Check

**Purpose**: Verify pincode is serviceable before order

### Steps

1. Check a serviceable pincode
2. Verify available couriers

### Command

```bash
curl -X POST http://localhost:5000/api/payments/check-pincode \
  -H "Content-Type: application/json" \
  -d '{"pincode": "560001"}'
```

### Expected Response

```json
{
  "serviceable": true,
  "cod": true,
  "prepaid": true,
  "couriers": [
    {
      "id": 10,
      "name": "Amazon Surface",
      "charges": 45,
      "days": 3
    }
  ]
}
```

### Verification

- [ ] `serviceable`: true
- [ ] `cod`: true
- [ ] `prepaid`: true
- [ ] `couriers` array has items
- [ ] Each courier has id, name, charges, days

**Status**: ⏳ Pending / ✅ Pass / ❌ Fail

---

## Test 4: Create Order (Online Payment)

**Purpose**: Initialize order and Razorpay payment

### Steps

1. Create order with valid customer data
2. Receive Razorpay order details
3. Verify order stored in database

### Command

```bash
curl -X POST http://localhost:5000/api/payments/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Surya Charan",
    "email": "psaisuryacharan@gmail.com",
    "mobile": "8328166638",
    "address": "Street 1, Visalakshi Nagar",
    "city": "Bangalore",
    "pincode": "560001",
    "productId": "tricher",
    "originalPrice": 499,
    "paymentMethod": "online"
  }'
```

### Expected Response

```json
{
  "razorpayOrder": {
    "id": "order_IluGWxBm9U8zJ8",
    "amount": 49900,
    "currency": "INR",
    "receipt": "rcpt_1707027222068",
    "status": "created"
  },
  "orderId": "507f1f77bcf86cd799439011",
  "key": "rzp_live_RrMjRcp1jEcitU",
  "finalAmount": 499
}
```

### Verification

- [ ] Response contains `razorpayOrder`
- [ ] Response contains `orderId`
- [ ] Response contains `key` (Razorpay key)
- [ ] Response contains `finalAmount`
- [ ] Amount is 49900 paise (499 INR)
- [ ] Order exists in MongoDB

**Database Check**:

```javascript
// In MongoDB
db.orders.findOne({ _id: ObjectId("507f1f77bcf86cd799439011") })

// Should show:
{
  status: "created",
  paymentMethod: "online",
  amount: 499,
  razorpayOrderId: "order_IluGWxBm9U8zJ8"
}
```

**Status**: ⏳ Pending / ✅ Pass / ❌ Fail

**Save for Next Test**:

- Order ID: ******\_\_\_\_******
- Razorpay Order ID: ******\_\_\_\_******

---

## Test 5: Verify Online Payment

**Purpose**: Complete Razorpay payment and trigger shipment creation

### Prerequisites

- Have orderId from Test 4
- Have valid Razorpay payment credentials
- Mock Razorpay signature (or use real test payment)

### Command

```bash
curl -X POST http://localhost:5000/api/payments/verify-payment \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id": "order_IluGWxBm9U8zJ8",
    "razorpay_payment_id": "pay_IluGW00sSvDd9m",
    "razorpay_signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d",
    "orderId": "507f1f77bcf86cd799439011"
  }'
```

**Note**: For testing, you need valid Razorpay credentials. Use:

- Razorpay test card: 4111 1111 1111 1111
- Any future expiry
- Any 3-digit CVV

### Expected Response

```json
{
  "ok": true,
  "trackingInfo": {
    "awb": "321055706540",
    "trackingUrl": "https://track.shiprocket.in/321055706540"
  }
}
```

### Verification

- [ ] Response contains `ok: true`
- [ ] Response contains `trackingInfo`
- [ ] `trackingInfo.awb` is populated
- [ ] `trackingInfo.trackingUrl` is valid

### Database Check

```javascript
// Order should now be:
db.orders.findOne({ _id: ObjectId("507f1f77bcf86cd799439011") })

// Should show:
{
  status: "active",              // Changed from "created"
  shipmentStatus: "shipped",     // Set to shipped if AWB assigned
  razorpayPaymentId: "pay_xxx",
  shiprocketOrderId: 1165922108,
  shiprocketShipmentId: 1162267199,
  shiprocketAwb: "321055706540",
  shiprocketTrackingUrl: "https://..."
}
```

### Email Check

- [ ] Email received at psaisuryacharan@gmail.com
- [ ] Subject contains order tracking info
- [ ] Email contains AWB number
- [ ] Email contains tracking link
- [ ] Tracking link is clickable
- [ ] All styles render correctly

### Console Logs Check

Look for these in backend logs:

```
📦 Creating Shiprocket shipment for order: 507f1f77bcf86cd799439011
✅ Shiprocket order created: 1165922108
🎯 Assigning courier to shipment: 1162267199
✅ Courier assigned, AWB: 321055706540
📤 Sending order confirmation email to: psaisuryacharan@gmail.com
✅ EMAIL SENT: <message-id>
```

**Status**: ⏳ Pending / ✅ Pass / ❌ Fail

**Save for Next Tests**:

- AWB: ******\_\_\_\_******
- Tracking URL: ******\_\_\_\_******

---

## Test 6: Track Order

**Purpose**: Retrieve order tracking information

### Command

```bash
curl http://localhost:5000/api/payments/track-order/507f1f77bcf86cd799439011
```

### Expected Response

```json
{
  "orderId": "507f1f77bcf86cd799439011",
  "status": "active",
  "shipmentStatus": "shipped",
  "amount": 499,
  "paymentMethod": "online",
  "createdAt": "2026-02-03T09:53:42.000Z",
  "tracking": {
    "awb": "321055706540",
    "trackingUrl": "https://track.shiprocket.in/321055706540",
    "liveStatus": {
      "shipment_id": 1162267199,
      "status": "in_transit",
      "current_location": "Bangalore, Karnataka",
      "etd": "2026-02-05"
    }
  },
  "plan": {
    "name": "tricher",
    "description": "Tricher Basic Plan"
  }
}
```

### Verification

- [ ] Response contains correct `orderId`
- [ ] `status` is "active"
- [ ] `shipmentStatus` is "shipped"
- [ ] `tracking.awb` matches expected value
- [ ] `tracking.trackingUrl` is valid
- [ ] `liveStatus` contains shipment info

**Status**: ⏳ Pending / ✅ Pass / ❌ Fail

---

## Test 7: Resend Tracking Email

**Purpose**: Resend tracking email on demand

### Command

```bash
curl -X POST http://localhost:5000/api/payments/resend-tracking-email/507f1f77bcf86cd799439011
```

### Expected Response

```json
{
  "ok": true,
  "message": "Tracking email sent successfully",
  "awb": "321055706540",
  "trackingUrl": "https://track.shiprocket.in/321055706540"
}
```

### Verification

- [ ] Response contains `ok: true`
- [ ] Response contains AWB
- [ ] Response contains tracking URL

### Email Check

- [ ] Receive second email with tracking
- [ ] Subject: "🚚 Your Tricher Order Tracking Details"
- [ ] Contains full tracking information
- [ ] Different content from first email
- [ ] Professional formatting

**Status**: ⏳ Pending / ✅ Pass / ❌ Fail

---

## Test 8: Create COD Order

**Purpose**: Test Cash on Delivery flow

### Command

```bash
curl -X POST http://localhost:5000/api/payments/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test COD User",
    "email": "testcod@example.com",
    "mobile": "9999999999",
    "address": "Test Address",
    "city": "Mumbai",
    "pincode": "400001",
    "productId": "tricher",
    "originalPrice": 999,
    "paymentMethod": "cod"
  }'
```

### Expected Response

```json
{
  "razorpayOrder": { ... },
  "orderId": "507f1f77bcf86cd799439012",
  "key": "rzp_live_xxx",
  "finalAmount": 999
}
```

### Verification

- [ ] Order created successfully
- [ ] Order ID returned
- [ ] Payment method is "cod"

**Save Order ID**: ******\_\_\_\_******

**Status**: ⏳ Pending / ✅ Pass / ❌ Fail

---

## Test 9: Confirm COD Order

**Purpose**: Complete COD order and trigger shipment

### Command

```bash
curl -X POST http://localhost:5000/api/payments/confirm-cod-order \
  -H "Content-Type: application/json" \
  -d '{"orderId": "507f1f77bcf86cd799439012"}'
```

### Expected Response

```json
{
  "ok": true,
  "trackingInfo": {
    "awb": "321055706541",
    "trackingUrl": "https://track.shiprocket.in/321055706541"
  }
}
```

### Verification

- [ ] Response contains `ok: true`
- [ ] `trackingInfo` present with AWB
- [ ] Order status set to "active"
- [ ] ShipRocket order created

### Database Check

```javascript
db.orders.findOne({ _id: ObjectId("507f1f77bcf86cd799439012") })

// Should show:
{
  status: "active",
  paymentMethod: "cod",
  shipmentStatus: "shipped",
  shiprocketAwb: "321055706541"
}
```

### Email Check

- [ ] Email received
- [ ] Subject contains "COD Order Confirmed"
- [ ] Contains payment on delivery notice
- [ ] Contains tracking information

**Status**: ⏳ Pending / ✅ Pass / ❌ Fail

---

## Test 10: Error Handling - Invalid Signature

**Purpose**: Verify invalid Razorpay signature is rejected

### Command

```bash
curl -X POST http://localhost:5000/api/payments/verify-payment \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id": "order_IluGWxBm9U8zJ8",
    "razorpay_payment_id": "pay_IluGW00sSvDd9m",
    "razorpay_signature": "invalid_signature_xxxxxxxxxxxxxxx",
    "orderId": "507f1f77bcf86cd799439011"
  }'
```

### Expected Response

```json
{
  "error": "Invalid signature"
}
```

### Verification

- [ ] Response is 400 status
- [ ] Error message is "Invalid signature"
- [ ] Order NOT updated to "active"
- [ ] No ShipRocket order created

**Status**: ⏳ Pending / ✅ Pass / ❌ Fail

---

## Test 11: Error Handling - Missing Address

**Purpose**: Verify graceful handling of missing delivery address

### Steps

1. Create order without address
2. Verify payment
3. Check handling

### Command (Create)

```bash
curl -X POST http://localhost:5000/api/payments/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "name": "No Address User",
    "email": "noaddress@example.com",
    "mobile": "9999999999",
    "pincode": "560001",
    "productId": "tricher",
    "originalPrice": 499,
    "paymentMethod": "online"
  }'
```

### Command (Verify)

```bash
# Use valid payment credentials
curl -X POST http://localhost:5000/api/payments/verify-payment \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id": "order_xxx",
    "razorpay_payment_id": "pay_xxx",
    "razorpay_signature": "valid_signature",
    "orderId": "order_id_from_above"
  }'
```

### Expected Behavior

- [ ] Payment verification succeeds (`ok: true`)
- [ ] Order marked as "active"
- [ ] ShipRocket order NOT created
- [ ] `shipmentStatus` set to "pending"
- [ ] Email sent without tracking info
- [ ] No error shown to user
- [ ] Backend logs warning about missing address

### Console Check

```
⚠️ Missing user shipping details, skipping Shiprocket shipment
```

**Status**: ⏳ Pending / ✅ Pass / ❌ Fail

---

## Test 12: Database Consistency

**Purpose**: Verify all orders are properly stored

### Command

```bash
# In MongoDB shell or MongoDB Compass
db.orders.find({}).pretty()
```

### Verification Checklist

- [ ] All test orders present
- [ ] Online order has Razorpay fields
- [ ] COD order has paymentMethod: "cod"
- [ ] Shipped orders have ShipRocket fields
- [ ] ShipRocket fields are null for failed orders
- [ ] Timestamps are correct
- [ ] No data corruption
- [ ] Indexes working properly

**Status**: ⏳ Pending / ✅ Pass / ❌ Fail

---

## Test 13: Concurrent Orders

**Purpose**: Test system under light load

### Steps

1. Create 5 orders simultaneously
2. Verify all orders created
3. Verify all shipments created

### Command (in parallel)

```bash
for i in {1..5}; do
  curl -X POST http://localhost:5000/api/payments/create-order \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"User $i\",
      \"email\": \"user$i@test.com\",
      \"mobile\": \"999999999$i\",
      \"address\": \"Address $i\",
      \"city\": \"Bangalore\",
      \"pincode\": \"560001\",
      \"originalPrice\": 499
    }" &
done
```

### Verification

- [ ] All 5 orders created
- [ ] No errors in console
- [ ] All orders in database
- [ ] No database lock issues
- [ ] Response times acceptable

**Status**: ⏳ Pending / ✅ Pass / ❌ Fail

---

## Test 14: Email Rate Limiting

**Purpose**: Verify email service can handle multiple sends

### Steps

1. Resend tracking email 3 times
2. Verify all emails delivered
3. Check for rate limiting issues

### Command

```bash
for i in {1..3}; do
  curl -X POST http://localhost:5000/api/payments/resend-tracking-email/507f1f77bcf86cd799439011
  sleep 2
done
```

### Verification

- [ ] All 3 emails sent
- [ ] No rate limiting errors
- [ ] All emails in inbox
- [ ] No SES errors in logs

**Status**: ⏳ Pending / ✅ Pass / ❌ Fail

---

## Test 15: Logging Audit

**Purpose**: Verify all important events are logged

### Steps

1. Review backend console logs
2. Verify log entries for all tests

### Expected Log Entries

- [x] Payment creation logs
- [x] ShipRocket order creation logs
- [x] Courier assignment logs
- [x] AWB generation logs
- [x] Email sending logs
- [x] Error handling logs
- [x] Token refresh logs

### Verification

All actions should have:

- [ ] Timestamp
- [ ] Action type (📦, ✅, ❌, etc.)
- [ ] Relevant details
- [ ] Success/failure status

**Status**: ⏳ Pending / ✅ Pass / ❌ Fail

---

## Summary Report

### Overall Status

- Total Tests: 15
- Passed: **\_**
- Failed: **\_**
- Pending: **\_**

### Critical Tests (Must Pass)

- [ ] Test 1: Email Service
- [ ] Test 2: ShipRocket Config
- [ ] Test 5: Online Payment & Shipment
- [ ] Test 9: COD Order & Shipment

### Nice-to-Have Tests

- [ ] Test 13: Concurrent Orders
- [ ] Test 14: Email Rate Limiting

### Issues Found

1. ***
2. ***
3. ***

### Recommended Actions

1. ***
2. ***

### Sign-Off

- **Tested By**: ********\_********
- **Date**: ********\_********
- **Status**: ⏳ In Progress / ✅ Complete / ❌ Failed

---

**Testing Completed**: ******\_\_\_******
**Ready for Deployment**: Yes / No / With Cautions

---
