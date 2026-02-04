# ShipRocket Integration - Quick Reference

## 🚀 Quick Start

### Prerequisites

✅ Node.js + Express backend running
✅ MongoDB connected
✅ SMTP/Email service configured
✅ ShipRocket account setup

### Environment Variables Required

```env
# ShipRocket
SHIPROCKET_EMAIL=rambomannm@gmail.com
SHIPROCKET_PASSWORD=!Jjr1fXQNb&F12C4jce&3UUJj3zU*RL
SHIPROCKET_PICKUP_LOCATION_ID=33751024
SHIPROCKET_API_TOKEN=eyJhbGc...

# Email
SMTP_HOST=email-smtp.ap-south-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=AKIASP2R5JP34AIKRL7L
SMTP_PASS=BKtvvOS...
FROM_EMAIL=support@tricher.app

# Razorpay
RZP_KEY=rzp_live_RrMjRcp1jEcitU
RZP_SECRET=tamSsTfjYZAFwpu4RmYeu3uN
```

## 📋 API Endpoints

### Orders

| Method | Endpoint                                  | Purpose                                   |
| ------ | ----------------------------------------- | ----------------------------------------- |
| POST   | `/api/payments/create-order`              | Create order & initialize payment         |
| POST   | `/api/payments/verify-payment`            | Verify Razorpay payment & create shipment |
| POST   | `/api/payments/confirm-cod-order`         | Confirm COD order & create shipment       |
| GET    | `/api/payments/track-order/:id`           | Track order and shipment                  |
| POST   | `/api/payments/resend-tracking-email/:id` | Resend tracking email                     |

### Utilities

| Method | Endpoint                          | Purpose                         |
| ------ | --------------------------------- | ------------------------------- |
| POST   | `/api/payments/check-pincode`     | Check if pincode is serviceable |
| POST   | `/api/payments/apply-coupon`      | Apply coupon to order           |
| GET    | `/api/payments/shiprocket-config` | Check ShipRocket config status  |
| GET    | `/api/payments/test-email`        | Send test email                 |

## 🔧 Database Schema

### Order Model

```javascript
{
  _id: ObjectId,

  // User & Plan
  user: ObjectId,
  plan: ObjectId,

  // Order Details
  paymentMethod: String,      // 'online' or 'cod'
  amount: Number,             // Original amount
  finalAmount: Number,        // After discount
  address: String,
  status: String,             // 'pending', 'created', 'active'
  couponCode: String,

  // Razorpay Fields
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,

  // ShipRocket Fields
  shiprocketOrderId: String,
  shiprocketShipmentId: String,
  shiprocketAwb: String,              // ⭐ Tracking Number
  shiprocketTrackingUrl: String,      // ⭐ Tracking Link
  shipmentStatus: String,             // pending, awaiting_awb, shipped, error

  // Legacy Fields
  delhiveryWaybill: String,
  delhiveryOrderId: String,
  delhiveryTrackingUrl: String,

  createdAt: Date
}
```

## 🔄 Order Processing Flow

```
1. User Checkout
   ↓
2. POST /create-order
   └─ Returns Razorpay Order ID + Order ID
   ↓
3a. ONLINE PAYMENT          3b. COD
    Razorpay Payment        Direct Confirmation
    ↓                       ↓
4. POST /verify-payment     POST /confirm-cod-order
   ↓                        ↓
5. Create ShipRocket Order
   ├─ Validate address
   ├─ Create order in SR
   ├─ Store Order ID & Shipment ID
   ↓
6. Assign Courier & AWB
   ├─ Get default courier
   ├─ Generate AWB
   ├─ Store AWB & Tracking URL
   ↓
7. Background Tasks (Async)
   ├─ Generate label
   ├─ Schedule pickup
   └─ Continue even if fails
   ↓
8. Send Email
   ├─ With AWB (if assigned)
   ├─ With Tracking Link
   ├─ Professional template
   ↓
9. User Receives Tracking
   └─ Can track anytime via email link
```

## 💡 Key Features

### ✅ Automatic Shipment Creation

Orders are automatically created in ShipRocket after payment verification.

```javascript
// Happens automatically in /verify-payment and /confirm-cod-order
const shipmentData = {
  name: user.name,
  email: user.email,
  phone: user.mobile,
  address: user.address,
  city: user.city,
  state: user.state,
  pincode: user.pincode,
  orderAmount: order.finalAmount,
  paymentMode: order.paymentMethod === "cod" ? "COD" : "Prepaid",
  productName: `Tricher ${order.plan?.name}`,
  quantity: 1,
  weight: 0.5,
  orderId: order._id.toString(),
};

const result = await shiprocket.createShipment(shipmentData);
```

### ✅ AWB Assignment

Courier is automatically assigned and AWB is generated.

```javascript
const courierAssignment = await shiprocket.assignCourier(shipmentId);

// Returns:
{
  success: true,
  awb: "321055706540",
  courierName: "Amazon Surface",
  trackingUrl: "https://track.shiprocket.in/321055706540"
}
```

### ✅ Error Handling

Graceful degradation if ShipRocket fails.

```javascript
// Even if shipment creation fails:
// ✅ Payment verification succeeds
// ✅ Order is marked as 'active'
// ✅ User can retry shipment creation manually
// ✅ shipmentStatus shows 'failed' for debugging
```

### ✅ Email Notifications

Professional HTML emails with tracking info.

```javascript
// Conditions:
if (order.shiprocketAwb) {
  // Green success box with AWB and tracking link
} else if (shipmentStatus === "awaiting_awb") {
  // Yellow warning: AWB coming soon
} else {
  // Gray placeholder: Processing
}
```

## 🧪 Testing

### Test Online Payment Flow

```bash
# 1. Create order
curl -X POST http://localhost:5000/api/payments/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "mobile": "9999999999",
    "address": "Test St",
    "city": "Bangalore",
    "pincode": "560001",
    "originalPrice": 499
  }'

# Response contains: razorpayOrder, orderId, key, finalAmount
# Store the orderId for next step

# 2. Complete payment in Razorpay
# (Use test card: 4111 1111 1111 1111)

# 3. Verify payment
curl -X POST http://localhost:5000/api/payments/verify-payment \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id": "order_xxx",
    "razorpay_payment_id": "pay_xxx",
    "razorpay_signature": "sig_xxx",
    "orderId": "62f7d8c0e4b0f5c8a3d2e1f0"
  }'

# Response contains: ok: true, trackingInfo with AWB
```

### Test COD Flow

```bash
# 1. Create order (same as above)
# 2. Confirm COD order
curl -X POST http://localhost:5000/api/payments/confirm-cod-order \
  -H "Content-Type: application/json" \
  -d '{"orderId": "62f7d8c0e4b0f5c8a3d2e1f0"}'

# Response contains: ok: true, trackingInfo
```

### Test Tracking

```bash
# Get full order details with tracking
curl http://localhost:5000/api/payments/track-order/62f7d8c0e4b0f5c8a3d2e1f0

# Response includes: AWB, tracking URL, live shipment status
```

### Test Email Resend

```bash
# Resend tracking email
curl -X POST http://localhost:5000/api/payments/resend-tracking-email/62f7d8c0e4b0f5c8a3d2e1f0

# Useful if email failed first time or user lost email
```

## 📊 Shipment Status Codes

| Status         | Meaning                         | Action      |
| -------------- | ------------------------------- | ----------- |
| `pending`      | Created, awaiting SR submission | Automatic   |
| `awaiting_awb` | In SR, waiting for AWB          | Automatic   |
| `shipped`      | AWB assigned, ready             | ✅ Complete |
| `error`        | ShipRocket error                | 🔧 Debug    |
| `failed`       | Creation failed                 | 🔧 Retry    |

## 🐛 Debugging

### Check ShipRocket Config

```bash
curl http://localhost:5000/api/payments/shiprocket-config

# Response:
{
  "configured": true,
  "emailSet": true,
  "passwordSet": true,
  "pickupLocationId": "33751024",
  "sellerName": "Tricher"
}
```

### Test Email Service

```bash
curl http://localhost:5000/api/payments/test-email

# Should receive test email at support email
```

### Check Pincode Serviceability

```bash
curl -X POST http://localhost:5000/api/payments/check-pincode \
  -H "Content-Type: application/json" \
  -d '{"pincode": "560001"}'

# Returns: serviceable, available couriers, rates
```

### View Backend Logs

```bash
# Check for ShipRocket integration logs
tail -f logs/payments.log

# Look for:
# 📦 Creating Shiprocket shipment for order
# ✅ Shiprocket order created
# 🎯 Assigning courier to shipment
# ✅ Courier assigned, AWB: xxx
# 📤 Sending order confirmation email
# ✅ EMAIL SENT
```

## ⚙️ Configuration

### ShipRocket Account

- **Email**: rambomannm@gmail.com
- **Company ID**: 9086586
- **Pickup Location**: 33751024 (Tricher ai, Vishakapatnam)
- **Token Valid**: 240 hours from generation
- **Expires**: February 13, 2026

### Email Service

- **Provider**: AWS SES
- **Region**: ap-south-1
- **From Email**: support@tricher.app
- **SMTP**: email-smtp.ap-south-1.amazonaws.com:587

## 🔐 Security Notes

- ✅ ShipRocket credentials stored in `.env`
- ✅ API token refreshes automatically every 230 hours
- ✅ Razorpay signature verified on every payment
- ✅ User data validated before ShipRocket submission
- ⚠️ Email addresses trimmed and validated
- ⚠️ Phone numbers sanitized

## 📱 Webhook Ready

Structure prepared for ShipRocket webhooks:

- Order status updates
- Shipment tracking updates
- Delivery confirmations
- Return/RTO notifications

_Webhook implementation coming soon_

## 🤝 Support Contacts

**ShipRocket Support**

- Website: https://shiprocket.in/
- Email: support@shiprocket.in
- API Docs: https://shipapi.docs.apiary.io/

**Tricher Support**

- Email: support@tricher.app
- Team: Development

## 📚 Additional Resources

- [SHIPROCKET_INTEGRATION_GUIDE.md](./SHIPROCKET_INTEGRATION_GUIDE.md) - Detailed guide
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - What changed
- [EMAIL_TEMPLATES_AND_TEST_DATA.md](./EMAIL_TEMPLATES_AND_TEST_DATA.md) - Email previews
- [SHIPROCKET_QUICK_REF.md](./SHIPROCKET_QUICK_REF.md) - Original reference

---

**Version**: 1.0  
**Last Updated**: February 3, 2026  
**Status**: ✅ Production Ready
