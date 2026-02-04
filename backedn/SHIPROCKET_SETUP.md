# Shiprocket Integration Setup Guide

This guide walks you through setting up Shiprocket for order fulfillment and shipping in your Tricher application.

## Overview

The integration includes:

- ✅ Order creation after Razorpay payment
- ✅ Courier assignment and AWB generation
- ✅ Pickup scheduling
- ✅ Label generation
- ✅ Tracking information sent to users
- ✅ Support for both Online Payments and Cash on Delivery (COD)

## Prerequisites

1. **Shiprocket Account**: Sign up at [https://app.shiprocket.in/register](https://app.shiprocket.in/register)
2. **API User Created**: Follow steps below
3. **Pickup Location**: Set up in Shiprocket Dashboard

---

## Step 1: Create Shiprocket API User

1. **Login** to your Shiprocket account
2. Navigate to: **Settings → API → Add New API User**
3. Click **"Create API User"**
4. Fill in the form:
   - **Email**: Use a DIFFERENT email (not your main Shiprocket login email)
   - **Example**: `tricher-api@yourdomain.com`
5. **Generate a password** and note it down
6. Under **Modules to Access**, select:
   - ✅ Create Order
   - ✅ Assign Courier
   - ✅ Generate Label
   - ✅ Generate Pickup
   - ✅ Track Shipment
7. Click **"Create User"**

**Important**: Password will be sent to the **API user email** (not your main email)

---

## Step 2: Get Your Pickup Location ID

1. **Login** to Shiprocket Dashboard
2. Navigate to: **Settings → Pickup Addresses**
3. Note your **Pickup Location Name** (e.g., "Tricher Warehouse")
4. You can find the ID by:
   - Calling `/shiprocket-debug` endpoint (see Step 4)
   - Or via Shiprocket's API: GET `/warehouse/` endpoint

---

## Step 3: Configure Environment Variables

Add these to your `.env` file:

```bash
# Shiprocket API Credentials
SHIPROCKET_EMAIL=tricher-api@yourdomain.com
SHIPROCKET_PASSWORD=your_generated_password_here

# Pickup Location ID from Shiprocket
SHIPROCKET_PICKUP_LOCATION_ID=12345

# Seller Information
SELLER_NAME=Tricher
```

### Example `.env`:

```bash
# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/tricher

# Razorpay
RZP_KEY=rzp_live_xxxxx
RZP_SECRET=rzp_live_xxxxx

# Email (SMTP)
SMTP_HOST=email-smtp.ap-south-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-user
SMTP_PASS=your-ses-password
FROM_EMAIL=support@tricher.app

# Shiprocket (NEW)
SHIPROCKET_EMAIL=tricher-api@yourdomain.com
SHIPROCKET_PASSWORD=your_password
SHIPROCKET_PICKUP_LOCATION_ID=12345
SELLER_NAME=Tricher
```

---

## Step 4: Test Your Setup

### Test Endpoint

Call the debug endpoint to verify your configuration:

```bash
GET /api/payments/shiprocket-debug
```

**Expected Response** (Success):

```json
{
  "status": "debug",
  "config": {
    "email": "tricher-api@yourdomain.com",
    "pickupLocationId": "12345",
    "tokenGenerated": true
  },
  "tests": {
    "authentication": {
      "status": "success",
      "message": "Connected to Shiprocket API"
    },
    "serviceability": {
      "serviceable": true,
      "cod": true,
      "prepaid": true,
      "couriers": [...]
    }
  }
}
```

### Troubleshooting Debug Errors

**Error: "Shiprocket credentials not configured"**

- Verify `SHIPROCKET_EMAIL` and `SHIPROCKET_PASSWORD` are set in `.env`

**Error: "Invalid credentials"**

- Double-check password is correct
- Verify API user was created successfully
- Password is case-sensitive

**Error: "Pickup location not found"**

- Verify `SHIPROCKET_PICKUP_LOCATION_ID` is correct
- Check Shiprocket Dashboard for correct ID

---

## Step 5: API Endpoints

### Check Shiprocket Configuration

```
GET /api/payments/shiprocket-config
```

Returns current Shiprocket setup status

### Check Pincode Serviceability

```
POST /api/payments/check-pincode
Body: { "pincode": "530043" }
```

Returns available couriers for a pincode

### Verify Payment (Online Payment)

```
POST /api/payments/verify-payment
```

- Creates order in Shiprocket
- Assigns courier
- Generates AWB/label/pickup
- Sends tracking email to customer

### Confirm COD Order

```
POST /api/payments/confirm-cod-order
Body: { "orderId": "..." }
```

- Creates COD order in Shiprocket
- Assigns courier
- Generates AWB/label/pickup
- Sends COD tracking email

### Track Order

```
GET /api/payments/track-order/:orderId
```

Returns live tracking information including:

- AWB Number
- Current shipment status
- Tracking URL
- Live tracking events

---

## Step 6: What Happens on Payment Success

### When Customer Pays Online (Razorpay)

1. **Payment Verified** → Order status = `active`
2. **Shiprocket Order Created** with:
   - Customer details (name, email, phone)
   - Shipping address
   - Product info (Tricher glasses)
   - Payment mode: `Prepaid`
3. **Courier Assigned** → Gets AWB (tracking number)
4. **Pickup Scheduled** → Driver picks up from your warehouse
5. **Label Generated** → Can be printed and attached to package
6. **Confirmation Email Sent** with:
   - AWB Number
   - Tracking Link (track.shiprocket.in)
   - Order details

### When Customer Pays on Delivery (COD)

1. **COD Order Confirmed** → Order status = `active`
2. **Same Steps as Above** but with:
   - Payment mode: `COD`
   - Amount collected: ₹[order amount]
3. **Email includes**: "Please keep ₹X amount ready for the delivery person"

---

## Step 7: Email Templates

### Prepaid Order Confirmation

Customer receives email with:

```
✅ Order Confirmed
📦 Tracking Number (AWB): DL123456789
🔗 Track Your Order: [tracking link]
Shipping Address: [address]
Amount Paid: ₹X
```

### COD Order Confirmation

Customer receives email with:

```
✅ Order Confirmed
⚠️ Payment on Delivery: ₹X
📦 Tracking Number (AWB): DL123456789
🔗 Track Your Order: [tracking link]
Please keep the exact amount ready for the delivery person.
```

---

## Step 8: Order Model Updates

The Order model now tracks:

```javascript
{
  // Shiprocket Fields
  shiprocketOrderId: String,      // Shiprocket's order ID
  shiprocketShipmentId: String,   // Shiprocket's shipment ID
  shiprocketAwb: String,          // Airway Bill (tracking number)
  shiprocketTrackingUrl: String,  // Direct tracking link
  shipmentStatus: String,         // 'shipped', 'in-transit', 'delivered'
}
```

---

## Step 9: API Flow Diagram

```
Customer Order
    ↓
[Razorpay/COD Payment]
    ↓
[Verify Payment / Confirm COD]
    ↓
[Create Order in Shiprocket] → Gets order_id, shipment_id
    ↓
[Assign Courier] → Gets AWB (tracking number)
    ↓
[Generate Label & Pickup]
    ↓
[Send Tracking Email]
    ↓
[Customer Can Track Order]
```

---

## Step 10: Response Structure

### Order Creation Response

```json
{
  "success": true,
  "orderId": "SR-12345",
  "shipmentId": "67890",
  "waybill": "DL123456789",
  "trackingUrl": "https://track.shiprocket.in/SR-12345"
}
```

### Tracking Response

```json
{
  "orderId": "64a1b2c3...",
  "status": "active",
  "shipmentStatus": "shipped",
  "tracking": {
    "awb": "DL123456789",
    "trackingUrl": "https://track.shiprocket.in/SR-12345",
    "liveStatus": {
      "status": "in-transit",
      "currentLocation": "Mumbai",
      "etd": "2026-02-05"
    }
  }
}
```

---

## Useful Links

- **Shiprocket API Docs**: https://apidocs.shiprocket.in/
- **Sign Up**: https://app.shiprocket.in/register
- **Help Sheet**: https://shiprocket.freshdesk.com/support/solutions/articles/43000337456-api-document-helpsheet
- **Tracking Portal**: https://track.shiprocket.in/

---

## Troubleshooting

### Orders Not Creating

- Check if `SHIPROCKET_PICKUP_LOCATION_ID` is valid
- Verify API credentials
- Check logs for specific error messages

### Tracking Link Not Working

- Ensure order was created successfully in Shiprocket
- Check if AWB was assigned
- AWB takes 5-10 minutes to be active in tracking system

### Email Not Sending

- Verify SMTP configuration is correct
- Check if `FROM_EMAIL` is whitelisted in SES
- Check error logs

### Pincode Not Serviceable

- Shiprocket returns `serviceable: false` if courier unavailable
- You can still proceed with order (defaults to serviceable if check fails)

---

## Support

For Shiprocket-specific issues:

- Email: integration@shiprocket.in
- Documentation: https://apidocs.shiprocket.in/
- Support: support@shiprocket.in

For application-specific issues:

- Check server logs for error messages
- Use `/shiprocket-debug` endpoint to verify setup
- Verify all environment variables are set correctly
