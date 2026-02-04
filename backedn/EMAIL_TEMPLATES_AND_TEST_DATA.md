# Email Template Examples & Test Data

## Test Credentials

### ShipRocket Account
- **Email**: atmosphereplatform@gmail.com
- **Company ID**: 9086586
- **Pickup Location ID**: 33751024
- **Valid Until**: February 13, 2026 (240 hours from generation)

### Sample Test Order Data

```json
{
  "name": "Surya Charan",
  "email": "psaisuryacharan@gmail.com",
  "mobile": "8328166638",
  "address": "Street 1, Visalakshi Nagar",
  "city": "Bangalore",
  "pincode": "560001",
  "state": "Karnataka",
  "country": "India",
  "productId": "tricher",
  "originalPrice": 499,
  "paymentMethod": "online"
}
```

## Email Templates Preview

### 1. Order Confirmation Email (Online Payment with AWB)

**Subject**: 🚚 Your Tricher Order #xxxxx is Ready to Ship!

```
┌─────────────────────────────────────────────────────────────┐
│ 🎉 ORDER CONFIRMED!                                         │
│ (Purple Gradient Header)                                    │
└─────────────────────────────────────────────────────────────┘

Hi Surya Charan,

Your order has been successfully confirmed and is ready for 
shipment!

┌─────────────────────────────────────────────────────────────┐
│ 📋 ORDER DETAILS                                            │
├─────────────────────────────────────────────────────────────┤
│ Order ID:        #62f7d8c0                                  │
│ Product:         Tricher Basic Plan                         │
│ Amount Paid:     ₹499                                       │
│ Payment Method:  Prepaid                                    │
│ Order Date:      3 Feb 2026                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ✅ SHIPMENT READY FOR PICKUP           (GREEN BOX)         │
│                                                              │
│ Tracking Number (AWB): 321055706540                         │
│                                                              │
│ [📍 TRACK YOUR SHIPMENT]  <-- Clickable Button              │
│                                                              │
│ You can track your shipment status, delivery updates, and   │
│ current location using the AWB number above.                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 📍 DELIVERY ADDRESS                    (YELLOW BOX)         │
├─────────────────────────────────────────────────────────────┤
│ Street 1, Visalakshi Nagar                                  │
│ Bangalore, 560001                                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ❓ WHAT'S NEXT?                        (BLUE BOX)           │
├─────────────────────────────────────────────────────────────┤
│ • Courier will pick up your order within 24 hours          │
│ • You'll receive real-time delivery updates                │
│ • Expected delivery: 3-5 business days                     │
└─────────────────────────────────────────────────────────────┘

If you have any questions, feel free to contact our support 
team.

© 2026 Tricher. All rights reserved.
```

### 2. COD Order Confirmation Email

**Subject**: 🚚 COD Order Confirmed #xxxxx

```
┌─────────────────────────────────────────────────────────────┐
│ ✅ COD ORDER PLACED!                                        │
│ (Purple Gradient Header)                                    │
└─────────────────────────────────────────────────────────────┘

Hi Surya Charan,

Your Cash on Delivery order has been confirmed and is ready 
for shipment!

┌─────────────────────────────────────────────────────────────┐
│ 💰 PAYMENT ON DELIVERY              (YELLOW BOX)           │
│                                                              │
│ ₹499                                                         │
│                                                              │
│ Please keep the exact amount ready for the delivery person. │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ✅ SHIPMENT READY FOR PICKUP           (GREEN BOX)         │
│                                                              │
│ Tracking Number (AWB): 321055706540                         │
│                                                              │
│ [📍 TRACK YOUR SHIPMENT]  <-- Clickable Button              │
│                                                              │
│ You can track your shipment status, delivery updates, and   │
│ current location.                                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ❓ WHAT'S NEXT?                        (BLUE BOX)           │
├─────────────────────────────────────────────────────────────┤
│ • Courier will pick up your order within 24 hours          │
│ • You'll receive real-time delivery updates                │
│ • Expected delivery: 3-5 business days                     │
│ • Keep the exact amount ready for payment                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 📍 DELIVERY ADDRESS                    (YELLOW BOX)         │
├─────────────────────────────────────────────────────────────┤
│ Street 1, Visalakshi Nagar                                  │
│ Bangalore, 560001                                           │
└─────────────────────────────────────────────────────────────┘

If you have any questions, feel free to contact our support 
team.

© 2026 Tricher. All rights reserved.
```

### 3. Tracking Email (AWB Assigned Later)

**Subject**: 🚚 Your Tricher Order Tracking Details #xxxxx

```
┌─────────────────────────────────────────────────────────────┐
│ 📦 SHIPMENT ASSIGNED!                                       │
│ (Purple Gradient Header)                                    │
└─────────────────────────────────────────────────────────────┘

Hi Surya Charan,

Great news! Your shipment has been assigned a courier and is 
ready for pickup!

┌─────────────────────────────────────────────────────────────┐
│ ✅ SHIPMENT READY                      (GREEN BOX)         │
│                                                              │
│ Order ID: #62f7d8c0                                         │
│ Tracking Number (AWB): 321055706540                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ [📍 TRACK YOUR SHIPMENT LIVE]         (BLUE BOX)            │
│                                                              │
│ Click the link above to track your shipment in real-time.   │
│ You'll see updates for pickup, in-transit, and delivery.    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 📦 DELIVERY DETAILS                                         │
├─────────────────────────────────────────────────────────────┤
│ Recipient:       Surya Charan                               │
│ Address:         Street 1, Visalakshi Nagar                │
│ City/Pincode:    Bangalore 560001                           │
│ Expected:        3-5 business days                          │
└─────────────────────────────────────────────────────────────┘

Pro Tip: Bookmark this email or save the AWB number for quick 
reference. You can also track your shipment using just the AWB 
number on the carrier's website.

For support, reply to this email or contact us at 
support@tricher.app

© 2026 Tricher. All rights reserved.
```

## ShipRocket API Responses

### Create Order Response

```json
{
  "success": true,
  "data": {
    "order_id": 1165922108,
    "channel_order_id": "ORDER_1001",
    "shipment_id": 1162267199,
    "status": "NEW",
    "status_code": 1,
    "onboarding_completed_now": 0,
    "awb_code": "",
    "courier_company_id": "",
    "courier_name": "",
    "new_channel": false,
    "packaging_box_error": ""
  }
}
```

### Assign AWB Response

```json
{
  "success": true,
  "data": {
    "awb_assign_status": 1,
    "courier_company_id": 142,
    "awb_code": "321055706540",
    "cod": 0,
    "order_id": 281248157,
    "shipment_id": 16090281,
    "awb_code_status": 1,
    "assigned_date_time": {
      "date": "2026-02-03 10:15:42.123456",
      "timezone_type": 3,
      "timezone": "Asia/Kolkata"
    },
    "applied_weight": 0.5,
    "company_id": 25149,
    "courier_name": "Amazon Surface",
    "child_courier_name": null,
    "pickup_scheduled_date": "2026-02-03 14:00:00",
    "routing_code": "",
    "rto_routing_code": "",
    "invoice_no": "tricher_20260203_001",
    "transporter_id": "",
    "transporter_name": "",
    "shipped_by": {
      "shipper_company_name": "Tricher",
      "shipper_address_1": "Visalakshi Nagar",
      "shipper_address_2": "Visahakapatnam",
      "shipper_city": "Vishakapatnam",
      "shipper_state": "Andhra Pradesh",
      "shipper_country": "India",
      "shipper_postcode": "530043",
      "shipper_first_mile_activated": 0,
      "shipper_phone": "9999999999",
      "lat": "17.6869",
      "long": "83.2185",
      "shipper_email": "support@tricher.app",
      "rto_company_name": "Tricher RTO",
      "rto_address_1": "RTO Center",
      "rto_address_2": "Vishakapatnam",
      "rto_city": "Vishakapatnam",
      "rto_state": "Andhra Pradesh",
      "rto_country": "India",
      "rto_postcode": "530043",
      "rto_phone": "9999999999",
      "rto_email": "rto@tricher.app"
    }
  }
}
```

### Track Order Response

```json
{
  "orderId": "62f7d8c0e4b0f5c8a3d2e1f0",
  "status": "active",
  "shipmentStatus": "shipped",
  "amount": 499,
  "paymentMethod": "online",
  "createdAt": "2026-02-03T09:53:42.000Z",
  "tracking": {
    "awb": "321055706540",
    "trackingUrl": "https://track.shiprocket.in/321055706540",
    "liveStatus": {
      "shipment_id": 16090281,
      "order_id": 281248157,
      "awb": "321055706540",
      "status": "in_transit",
      "current_location": "Bangalore, Karnataka",
      "scans": [
        {
          "location": "Bangalore",
          "timestamp": "2026-02-03 10:20:00",
          "event": "SHIPMENT_PICKED",
          "remarks": "Shipment picked from warehouse"
        },
        {
          "location": "Bangalore Hub",
          "timestamp": "2026-02-03 14:30:00",
          "event": "IN_TRANSIT",
          "remarks": "Shipment in transit"
        }
      ],
      "etd": "2026-02-05"
    }
  },
  "plan": {
    "name": "tricher",
    "description": "Tricher Basic Plan"
  }
}
```

## Testing Payloads

### Test Create Order (with COD)

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "mobile": "9876543210",
  "address": "Test Address, Apt 123",
  "city": "Mumbai",
  "pincode": "400001",
  "productId": "tricher",
  "originalPrice": 999,
  "coupon": null,
  "paymentMethod": "cod"
}
```

### Test Verify Payment

```json
{
  "razorpay_order_id": "order_IluGWxBm9U8zJ8",
  "razorpay_payment_id": "pay_IluGW00sSvDd9m",
  "razorpay_signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d",
  "orderId": "507f1f77bcf86cd799439011"
}
```

### Test Check Pincode

```json
{
  "pincode": "560001"
}
```

**Response**:
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
    },
    {
      "id": 11,
      "name": "Ekart",
      "charges": 40,
      "days": 4
    }
  ]
}
```

## Shipment Status Flow

```
Payment Completed
        ↓
   pending
   ├─ Waiting for ShipRocket submission
   └─ Duration: Immediate
        ↓
  awaiting_awb
   ├─ Order in ShipRocket, no AWB yet
   └─ Duration: Minutes to hours
        ↓
   shipped
   ├─ AWB assigned, ready for pickup
   └─ Duration: Order lifetime
        ↓
   error/failed
   ├─ ShipRocket error occurred
   └─ Needs manual intervention
```

## Email Status Mapping

| Shipment Status | Email Content | Tracking Info | Button |
|---|---|---|---|
| `pending` | Generic confirmation | Not available | None |
| `awaiting_awb` | Processing message | "Coming soon" | None |
| `shipped` | Full tracking details | AWB + Link | Track Button |
| `error` | Basic confirmation | Error note | None |

---

**Last Updated**: February 3, 2026
**Valid Until**: February 13, 2026
