# Quick Test Guide - Thunder Client

## 🔍 Step 1: Check Delhivery Configuration

**GET** `http://localhost:5000/api/delhivery-config`

**Expected Response:**

```json
{
  "configured": false,
  "apiKeySet": false,
  "environment": "staging",
  "warehouseConfigured": false,
  "pickupLocation": "Not Set",
  "sellerName": "Not Set",
  "returnPincode": "Not Set"
}
```

**What to do if not configured:**

1. Stop the server
2. Add to `.env` file:

```env
DELHIVERY_API_KEY=your_api_token_here
DELHIVERY_ENV=staging
RETURN_PINCODE=110001
RETURN_CITY=Delhi
RETURN_STATE=Delhi
RETURN_ADDRESS=Your Warehouse Address
PICKUP_LOCATION_NAME=Main Warehouse
SELLER_NAME=Tricher
```

3. Restart server: `npm start`
4. Test again - all should be `true`/set

---

## 📝 Step 2: Create a Test Order

**POST** `http://localhost:5000/api/create-order`

**Request Body:**

```json
{
  "email": "rambomannm@gmail.com",
  "name": "Test User",
  "mobile": "9876543210",
  "address": "123 Test Street, Gandhi Nagar",
  "city": "Delhi",
  "state": "Delhi",
  "pincode": "110001",
  "amount": 3999,
  "productId": "tricher",
  "paymentMethod": "cod"
}
```

**Copy the `orderId` from response!**

---

## 📦 Step 3: Confirm COD Order (Creates Shipment)

**POST** `http://localhost:5000/api/confirm-cod-order`

**Request Body:**

```json
{
  "orderId": "PASTE_YOUR_ORDER_ID_HERE"
}
```

**Expected Response (Success):**

```json
{
  "ok": true,
  "trackingInfo": {
    "waybill": "1234567890123",
    "trackingUrl": "https://www.delhivery.com/track/package/1234567890123"
  }
}
```

**Expected Response (If Delhivery not configured):**

```json
{
  "ok": true,
  "trackingInfo": null
}
```

---

## 📧 Check Your Email

You should receive an email with:

- ✅ Order confirmation
- ✅ Tracking number (if Delhivery configured)
- ✅ "Track Your Order" button
- ✅ COD amount to pay

---

## 🔍 Step 4: Track the Order

**GET** `http://localhost:5000/api/track-order/YOUR_ORDER_ID`

**Expected Response:**

```json
{
  "orderId": "67a1b2c3d4e5f6789",
  "status": "active",
  "shipmentStatus": "shipped",
  "tracking": {
    "waybill": "1234567890123",
    "trackingUrl": "https://www.delhivery.com/track/package/1234567890123"
  }
}
```

---

## ⚠️ Troubleshooting

### Email sent but no tracking ID?

**Check server console for:**

```
⚠️ DELHIVERY_API_KEY not configured. Skipping shipment creation.
```

**Or:**

```
❌ DELHIVERY SHIPMENT ERROR: ...
```

### Fix: Add Delhivery credentials to .env

### Still not working?

1. Test configuration endpoint: `/api/delhivery-config`
2. Make sure all fields show as configured
3. Restart server after adding .env variables
4. Check console logs when confirming order

---

## 🎯 Quick Test Without Delhivery

You can test the full flow **without** configuring Delhivery:

- Orders will be created ✅
- Emails will be sent ✅
- No tracking ID ❌ (will show "shipment will be processed soon")

To get tracking IDs, you **must**:

1. Sign up at Delhivery
2. Get API token
3. Add to .env
4. Configure warehouse details
