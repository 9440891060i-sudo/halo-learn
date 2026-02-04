# Shiprocket Integration - Data Flow & API Reference

## Complete Order Processing Flow

### 1. Online Payment Flow (Razorpay)

```
┌─────────────────────────────────────────────────────────────────┐
│                     Customer Checkout                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    POST /create-order
                    {
                      name, email, mobile, address,
                      city, pincode, productId,
                      originalPrice, paymentMethod: 'online'
                    }
                             │
                             ▼
         ┌────────────────────────────────────────┐
         │  Create Order Document in MongoDB      │
         │  - Set status = 'created'              │
         │  - Store all customer details          │
         │  - Create Razorpay order              │
         └────────────────────────────────────────┘
                             │
                             ▼
         ┌────────────────────────────────────────┐
         │  Return to Frontend                    │
         │  {                                     │
         │    razorpayOrder: {...},              │
         │    orderId: "507f1f77...",            │
         │    key: RZP_KEY,                      │
         │    finalAmount: 599                   │
         │  }                                     │
         └────────────────────────────────────────┘
                             │
                             ▼
              Razorpay Checkout Modal Opens
                             │
                             ▼
         ┌────────────────────────────────────────┐
         │     Customer Completes Payment         │
         └────────────────────────────────────────┘
                             │
                             ▼
         POST /verify-payment
         {
           razorpay_order_id,
           razorpay_payment_id,
           razorpay_signature,
           orderId
         }
                             │
         ┌───────────────────┴───────────────────┐
         │                                       │
         ▼                                       ▼
   Signature Valid?                        Invalid → 400 error
         │
         ▼
  Order status = 'active'
  Order marked as verified
         │
         ▼
  ┌──────────────────────────────────────────────┐
  │  CREATE SHIPROCKET ORDER (Automatic)         │
  │  POST https://apiv2.shiprocket.in/...        │
  │  {                                           │
  │    order_id: "64a1b2c3...",                 │
  │    order_date: "2026-02-02",                │
  │    pickup_location_id: 12345,               │
  │    customer_name: "John Doe",               │
  │    email: "john@example.com",               │
  │    phone: "9876543210",                     │
  │    shipping_address: "...",                 │
  │    shipping_city: "Hyderabad",              │
  │    shipping_state: "Telangana",             │
  │    shipping_pincode: "530043",              │
  │    billing_*: same as shipping,             │
  │    order_items: [                           │
  │      {                                      │
  │        name: "Tricher AI Glasses",          │
  │        sku: "TRICHER-64a1b2c3...",         │
  │        units: 1,                            │
  │        selling_price: 599                   │
  │      }                                      │
  │    ],                                       │
  │    payment_method: "prepaid",               │
  │    length: 15,                              │
  │    breadth: 15,                             │
  │    height: 5,                               │
  │    weight: 0.5                              │
  │  }                                          │
  └──────────────────────────────────────────────┘
         │
         ▼ Response:
    {
      success: true,
      data: {
        order_id: "123456",     ← Shiprocket Order ID
        shipment_id: "789012",  ← Shiprocket Shipment ID
        awb: null              ← AWB not assigned yet
      }
    }
         │
         ▼
  ┌──────────────────────────────────────────────┐
  │  ASSIGN COURIER (Automatic)                  │
  │  POST .../courier/assign/awb                 │
  │  {                                           │
  │    shipment_id: "789012"                    │
  │  }                                          │
  └──────────────────────────────────────────────┘
         │
         ▼ Response:
    {
      success: true,
      data: {
        awb_code: "DL123456789",      ← Tracking Number!
        courier_name: "Delhivery",
        shipment_id: "789012"
      }
    }
         │
         ▼
  Save to Order:
  ├─ shiprocketOrderId: "123456"
  ├─ shiprocketShipmentId: "789012"
  ├─ shiprocketAwb: "DL123456789"
  └─ shiprocketTrackingUrl: "https://track.shiprocket.in/123456"
         │
         ▼
  ┌──────────────────────────────────────────────┐
  │  GENERATE LABEL & PICKUP (Parallel)          │
  │  - POST .../courier/generate/label           │
  │  - POST .../courier/generate/pickup          │
  └──────────────────────────────────────────────┘
         │
         ▼
  ┌──────────────────────────────────────────────┐
  │  SEND CONFIRMATION EMAIL                     │
  │                                              │
  │  Subject: 🎉 Order Confirmed - Track...     │
  │  To: john@example.com                        │
  │                                              │
  │  Body:                                       │
  │  ✅ Order #64a1b2c3... confirmed!           │
  │  📦 Tracking: DL123456789                    │
  │  🔗 Track: https://track.shiprocket.in/...  │
  │                                              │
  │  Amount: ₹599                                │
  │  Address: ...                                │
  │                                              │
  └──────────────────────────────────────────────┘
         │
         ▼
  Response to Frontend:
  {
    ok: true,
    trackingInfo: {
      awb: "DL123456789",
      trackingUrl: "https://track.shiprocket.in/..."
    }
  }
         │
         ▼
  ✅ ORDER COMPLETE
```

---

### 2. Cash on Delivery (COD) Flow

```
POST /confirm-cod-order
{
  orderId: "64a1b2c3..."
}
         │
         ▼
  Order status = 'active'
  shiprocketOrderId: null initially
         │
         ▼
  ┌──────────────────────────────────────────────┐
  │  CREATE SHIPROCKET COD ORDER (Automatic)     │
  │  Identical to prepaid but:                   │
  │  - payment_method: "cod"                    │
  │  - Email mentions "Payment on Delivery"     │
  └──────────────────────────────────────────────┘
         │
         ▼
  (Same courier assignment & label generation)
         │
         ▼
  EMAIL TO CUSTOMER:
  ⚠️ Payment on Delivery: ₹599
  Please keep the exact amount ready!
  📦 Tracking: DL123456789
  🔗 Track: https://track.shiprocket.in/...
```

---

## API Request/Response Examples

### POST /create-order

**Request**:

```javascript
{
  name: "John Doe",
  email: "john@example.com",
  mobile: "9876543210",
  address: "123 Main Street, Apt 4B",
  city: "Hyderabad",
  pincode: "530043",
  coupon: null,
  productId: "premium",
  originalPrice: 599,
  paymentMethod: "online"
}
```

**Response**:

```javascript
{
  razorpayOrder: {
    id: "order_NHfRf65cu6nz3Z",
    entity: "order",
    amount: 59900,  // in paise
    amount_paid: 0,
    amount_due: 59900,
    currency: "INR",
    receipt: "rcpt_1705139200000",
    status: "created",
    attempts: 0,
    notes: {},
    created_at: 1705139200
  },
  orderId: "64a1b2c3d4e5f6g7h8i9j0k1",
  key: "rzp_live_xxxxx",
  finalAmount: 599
}
```

### POST /verify-payment

**Request**:

```javascript
{
  razorpay_order_id: "order_NHfRf65cu6nz3Z",
  razorpay_payment_id: "pay_NHfRf65cu6nz3Z",
  razorpay_signature: "9ef4dffbfd84f1318f6739...",
  orderId: "64a1b2c3d4e5f6g7h8i9j0k1"
}
```

**Response**:

```javascript
{
  ok: true,
  trackingInfo: {
    awb: "DL123456789",
    trackingUrl: "https://track.shiprocket.in/123456"
  }
}
```

### GET /track-order/:orderId

**Request**:

```
GET /api/payments/track-order/64a1b2c3d4e5f6g7h8i9j0k1
```

**Response**:

```javascript
{
  orderId: "64a1b2c3d4e5f6g7h8i9j0k1",
  status: "active",
  shipmentStatus: "shipped",
  amount: 599,
  paymentMethod: "online",
  createdAt: "2026-02-02T10:30:00Z",
  tracking: {
    awb: "DL123456789",
    trackingUrl: "https://track.shiprocket.in/123456",
    liveStatus: {
      status: "in-transit",
      currentLocation: "Mumbai Distribution Center",
      etd: "2026-02-05T18:00:00Z",
      events: [
        {
          date: "2026-02-02T14:00:00Z",
          status: "X-UCI",
          activity: "Manifested - Manifest uploaded",
          location: "Hyderabad"
        },
        {
          date: "2026-02-02T18:30:00Z",
          status: "X-PPOM",
          activity: "In Transit - Shipment picked up",
          location: "Hyderabad"
        }
      ]
    }
  },
  plan: {
    name: "premium",
    description: "Tricher Premium Glass"
  }
}
```

### GET /shiprocket-debug

**Response**:

```javascript
{
  status: "debug",
  config: {
    email: "tricher-api@domain.com",
    pickupLocationId: "12345",
    tokenGenerated: true
  },
  tests: {
    authentication: {
      status: "success",
      message: "Connected to Shiprocket API"
    },
    serviceability: {
      serviceable: true,
      cod: true,
      prepaid: true,
      couriers: [
        {
          id: 12345,
          name: "Delhivery",
          charges: 85,
          days: 3
        },
        {
          id: 12346,
          name: "Bluedart",
          charges: 110,
          days: 1
        }
      ]
    }
  }
}
```

---

## Database Schema Changes

### Order Model Fields Added

```javascript
// Shiprocket Integration Fields
shiprocketOrderId: {
  type: String,
  description: "Shiprocket's order ID"
  // Example: "123456"
},

shiprocketShipmentId: {
  type: String,
  description: "Shiprocket's shipment ID"
  // Example: "789012"
},

shiprocketAwb: {
  type: String,
  description: "Airway Bill - Tracking number"
  // Example: "DL123456789"
},

shiprocketTrackingUrl: {
  type: String,
  description: "Direct link to track shipment"
  // Example: "https://track.shiprocket.in/123456"
},

shipmentStatus: {
  type: String,
  enum: ['pending', 'shipped', 'in-transit', 'delivered', 'returned', 'failed'],
  default: 'pending',
  description: "Current shipment status"
}
```

---

## Error Handling

### Order Creation Failure

If Shiprocket order creation fails:

- Order remains in 'active' status
- Customer payment is NOT refunded
- Error logged to console
- Email sent without tracking info
- Admin must manually follow up

### Courier Assignment Failure

If courier assignment fails:

- Order remains in Shiprocket (order_id exists)
- Can retry via API
- Manual assignment possible via Shiprocket Dashboard

### Email Failure

If email sending fails:

- Payment verification still succeeds
- Customer can access tracking via API
- Tracking info available at `/track-order` endpoint

---

## Shiprocket Tracking Portal

**Format**: `https://track.shiprocket.in/{ORDER_ID}`

Customer receives this link in:

1. Confirmation email
2. API response
3. Can share with others

Updates automatically as shipment moves through network

---

## File Structure

```
backedn/
├── routes/
│   └── payments.js                ← Modified (all Shiprocket logic)
├── utils/
│   └── shiprocket.js             ← New (Shiprocket API wrapper)
├── models/
│   └── Order.js                  ← New fields added
└── [docs]
    ├── SHIPROCKET_SETUP.md        ← Setup instructions
    ├── SHIPROCKET_IMPLEMENTATION.md ← Technical details
    └── SHIPROCKET_QUICK_REF.md     ← Quick reference
```

---

## Environment Variables

```bash
# Shiprocket Credentials
SHIPROCKET_EMAIL=api-user@domain.com
SHIPROCKET_PASSWORD=generated_password_here
SHIPROCKET_PICKUP_LOCATION_ID=12345

# Seller Info
SELLER_NAME=Tricher

# Existing (unchanged)
MONGODB_URI=...
RZP_KEY=...
RZP_SECRET=...
SMTP_HOST=...
```
