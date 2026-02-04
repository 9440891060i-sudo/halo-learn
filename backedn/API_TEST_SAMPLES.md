# Delhivery API Testing Samples

## Thunder Client / Postman Test Cases

### 1. Check Pincode Serviceability ✅

**Endpoint:** `POST http://localhost:5000/api/check-pincode`

**Request Body:**

```json
{
  "pincode": "110001"
}
```

**Expected Response (Success):**

```json
{
  "serviceable": true,
  "cod": true,
  "prepaid": true,
  "city": "Delhi",
  "state": "DL",
  "district": "Central Delhi"
}
```

**Expected Response (Not Serviceable):**

```json
{
  "serviceable": false
}
```

---

### 2. Create Order (Prerequisite for testing)

**Endpoint:** `POST http://localhost:5000/api/create-order`

**Request Body:**

```json
{
  "email": "test@example.com",
  "name": "John Doe",
  "mobile": "9876543210",
  "address": "123 Main Street, Gandhi Nagar",
  "city": "Delhi",
  "pincode": "110001",
  "amount": 3999,
  "productId": "tricher",
  "paymentMethod": "cod"
}
```

**Expected Response:**

```json
{
  "razorpayOrder": {
    "id": "order_xxxxxxxxxxxxx",
    "entity": "order",
    "amount": 399900,
    "currency": "INR",
    "receipt": "rcpt_1706600000000",
    "status": "created"
  },
  "orderId": "507f1f77bcf86cd799439011",
  "key": "rzp_live_RrMjRcp1jEcitU",
  "finalAmount": 3999
}
```

---

### 3. Confirm COD Order (Creates Delhivery Shipment)

**Endpoint:** `POST http://localhost:5000/api/confirm-cod-order`

**Request Body:**

```json
{
  "orderId": "507f1f77bcf86cd799439011"
}
```

**Expected Response (With Delhivery):**

```json
{
  "ok": true,
  "trackingInfo": {
    "waybill": "1234567890123",
    "trackingUrl": "https://www.delhivery.com/track/package/1234567890123"
  }
}
```

**Expected Response (Without Delhivery Configured):**

```json
{
  "ok": true,
  "trackingInfo": null
}
```

---

### 4. Verify Online Payment (After Razorpay)

**Endpoint:** `POST http://localhost:5000/api/verify-payment`

**Request Body:**

```json
{
  "razorpay_order_id": "order_xxxxxxxxxxxxx",
  "razorpay_payment_id": "pay_xxxxxxxxxxxxx",
  "razorpay_signature": "generated_signature_hash",
  "orderId": "507f1f77bcf86cd799439011"
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

---

### 5. Track Order

**Endpoint:** `GET http://localhost:5000/api/track-order/507f1f77bcf86cd799439011`

**No Request Body**

**Expected Response (With Tracking):**

```json
{
  "orderId": "507f1f77bcf86cd799439011",
  "status": "active",
  "shipmentStatus": "shipped",
  "amount": 3999,
  "paymentMethod": "cod",
  "createdAt": "2026-01-30T10:30:00.000Z",
  "tracking": {
    "waybill": "1234567890123",
    "trackingUrl": "https://www.delhivery.com/track/package/1234567890123",
    "liveStatus": {
      "ShipmentData": [
        {
          "Status": {
            "Status": "Dispatched"
          }
        }
      ]
    }
  },
  "plan": {
    "name": "tricher",
    "description": "Tricher Glasses one-time purchase"
  }
}
```

**Expected Response (Without Tracking):**

```json
{
  "orderId": "507f1f77bcf86cd799439011",
  "status": "active",
  "shipmentStatus": "pending",
  "amount": 3999,
  "paymentMethod": "cod",
  "createdAt": "2026-01-30T10:30:00.000Z",
  "tracking": {
    "waybill": null,
    "trackingUrl": null,
    "liveStatus": null
  },
  "plan": {
    "name": "tricher",
    "description": "Tricher Glasses one-time purchase"
  }
}
```

---

## Complete Test Flow (COD Order)

### Step 1: Check Pincode

```bash
POST http://localhost:5000/api/check-pincode
Body: { "pincode": "110001" }
```

### Step 2: Create Order

```bash
POST http://localhost:5000/api/create-order
Body: {
  "email": "test@example.com",
  "name": "Test User",
  "mobile": "9876543210",
  "address": "123 Test Street, Area Name",
  "city": "Delhi",
  "pincode": "110001",
  "amount": 3999,
  "productId": "tricher",
  "paymentMethod": "cod"
}

# Save the "orderId" from response
```

### Step 3: Confirm COD Order

```bash
POST http://localhost:5000/api/confirm-cod-order
Body: { "orderId": "PASTE_ORDER_ID_HERE" }
```

### Step 4: Track Order

```bash
GET http://localhost:5000/api/track-order/PASTE_ORDER_ID_HERE
```

---

## Why You're Not Getting Tracking ID

### Common Issues:

1. **Missing Delhivery API Key**
   - Check `.env` file has `DELHIVERY_API_KEY=your_token`

2. **Missing Warehouse Details**

   ```env
   RETURN_PINCODE=110001
   RETURN_CITY=Delhi
   RETURN_STATE=Delhi
   RETURN_ADDRESS=Your Address
   PICKUP_LOCATION_NAME=Warehouse
   ```

3. **API in Staging Mode**
   - Delhivery staging might not create real shipments
   - Check console logs for Delhivery errors

4. **User Missing Required Fields**
   - User needs: name, email, mobile, address, city, state, pincode
   - Check database if user has all fields

---

## Check Console Logs

When you call `/api/confirm-cod-order`, look for:

```
📦 Creating Delhivery COD shipment for order: 507f...
✅ Delhivery COD shipment created: 1234567890123
```

Or errors like:

```
❌ DELHIVERY SHIPMENT ERROR: Failed to create shipment
```

---

## Quick Debug Steps

1. **Check if Delhivery is configured:**

   ```javascript
   console.log(process.env.DELHIVERY_API_KEY); // Should show your key
   ```

2. **Check user data:**

   ```bash
   GET http://localhost:5000/api/users
   # Check if users have complete address with state
   ```

3. **Check order data:**
   ```bash
   GET http://localhost:5000/api/orders
   # Check if delhiveryWaybill is populated
   ```

---

## Sample cURL Commands

### Check Pincode

```bash
curl -X POST http://localhost:5000/api/check-pincode \
  -H "Content-Type: application/json" \
  -d '{"pincode":"110001"}'
```

### Confirm COD Order

```bash
curl -X POST http://localhost:5000/api/confirm-cod-order \
  -H "Content-Type: application/json" \
  -d '{"orderId":"YOUR_ORDER_ID"}'
```

### Track Order

```bash
curl http://localhost:5000/api/track-order/YOUR_ORDER_ID
```

---

## Email With Tracking

When Delhivery shipment is created successfully, email will include:

```html
📦 Shipment Tracking Tracking Number: 1234567890123 [Track Your Order] <-
Clickable button You can track your shipment anytime using the link above...
```

If shipment creation fails, email shows:

```
Your shipment will be processed soon. You will receive tracking details via email.
```

---

## Next Steps

1. Add Delhivery API credentials to `.env`
2. Configure warehouse address
3. Test with Thunder Client using samples above
4. Check console logs for errors
5. Verify database has tracking data
