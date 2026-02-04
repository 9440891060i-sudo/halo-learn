# ShipRocket Integration Guide

## Overview

This guide explains how ShipRocket is integrated into the Tricher application for order fulfillment and shipment tracking.

## Architecture

### Order Flow

```
1. User Places Order
   ↓
2. Payment Processing (Razorpay)
   ├─ Online Payment: /verify-payment
   └─ COD: /confirm-cod-order
   ↓
3. ShipRocket Order Creation
   └─ Creates shipment in ShipRocket system
   ↓
4. AWB Assignment
   └─ Courier assigned → AWB generated
   ↓
5. Tracking Email Sent
   └─ User receives tracking number & link
   ↓
6. Label & Pickup Generation
   └─ Shipping label created
   └─ Pickup scheduled
```

## API Endpoints

### 1. Create Order (Initialize Payment)

**POST** `/api/payments/create-order`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "8328166638",
  "address": "Street 1",
  "city": "Bangalore",
  "pincode": "560001",
  "productId": "tricher",
  "originalPrice": 499,
  "coupon": null,
  "paymentMethod": "online"
}
```

**Response:**

```json
{
  "razorpayOrder": { "id": "order_xxx", "amount": 49900, ... },
  "orderId": "62f7d8c0e4b0f5c8a3d2e1f0",
  "key": "rzp_live_xxx",
  "finalAmount": 499
}
```

### 2. Verify Payment (After Razorpay Success)

**POST** `/api/payments/verify-payment`

```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx",
  "orderId": "62f7d8c0e4b0f5c8a3d2e1f0"
}
```

**Response:**

```json
{
  "ok": true,
  "trackingInfo": {
    "awb": "321055706540",
    "trackingUrl": "https://track.shiprocket.in/321055706540"
  }
}
```

### 3. Confirm COD Order

**POST** `/api/payments/confirm-cod-order`

```json
{
  "orderId": "62f7d8c0e4b0f5c8a3d2e1f0"
}
```

**Response:**

```json
{
  "ok": true,
  "trackingInfo": {
    "awb": "321055706540",
    "trackingUrl": "https://track.shiprocket.in/321055706540"
  }
}
```

### 4. Track Order

**GET** `/api/payments/track-order/:orderId`

**Response:**

```json
{
  "orderId": "62f7d8c0e4b0f5c8a3d2e1f0",
  "status": "active",
  "shipmentStatus": "shipped",
  "amount": 499,
  "paymentMethod": "online",
  "tracking": {
    "awb": "321055706540",
    "trackingUrl": "https://track.shiprocket.in/321055706540",
    "liveStatus": { ... }
  }
}
```

### 5. Resend Tracking Email

**POST** `/api/payments/resend-tracking-email/:orderId`

**Response:**

```json
{
  "ok": true,
  "message": "Tracking email sent successfully",
  "awb": "321055706540",
  "trackingUrl": "https://track.shiprocket.in/321055706540"
}
```

## Database Schema Updates

### Order Model

New fields added to track ShipRocket integration:

```javascript
{
  // ... existing fields ...

  // ShipRocket Integration
  shiprocketOrderId: String,        // Order ID in ShipRocket
  shiprocketShipmentId: String,     // Shipment ID
  shiprocketAwb: String,            // Air Waybill number (tracking)
  shiprocketTrackingUrl: String,    // Direct tracking link
  shipmentStatus: String,           // pending, awaiting_awb, shipped, error
}
```

## Environment Variables

Add these to your `.env` file:

```env
# ShipRocket Credentials
SHIPROCKET_EMAIL=your-email@gmail.com
SHIPROCKET_PASSWORD=your-password
SHIPROCKET_PICKUP_LOCATION_ID=33751024
SHIPROCKET_API_TOKEN=your-jwt-token

# Email Configuration
SMTP_HOST=email-smtp.ap-south-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-user
SMTP_PASS=your-ses-password
FROM_EMAIL=support@tricher.app
```

## Email Templates

### Order Confirmation Email (with Tracking)

When an order is placed and AWB is assigned:

- **Header**: Order confirmation message
- **Order Details**: Order ID, Product, Amount, Payment Method, Order Date
- **Tracking Section**: AWB number + Tracking Link (if available)
- **Delivery Address**: Full shipping address
- **What's Next**: Expected timeline and next steps
- **Support**: Contact information

### Tracking Email (Resend)

Sent when AWB is assigned:

- **Header**: "Shipment Assigned!" notification
- **Order & AWB Details**: Order ID and tracking number
- **Tracking Link**: Direct link to live tracking
- **Delivery Details**: Recipient, address, expected delivery
- **Pro Tips**: How to track and use AWB

## Shipment Status Values

| Status         | Meaning                                             |
| -------------- | --------------------------------------------------- |
| `pending`      | Order created, awaiting ShipRocket submission       |
| `awaiting_awb` | Submitted to ShipRocket, waiting for AWB assignment |
| `shipped`      | AWB assigned, label generated, ready/shipped        |
| `error`        | ShipRocket submission failed                        |
| `failed`       | Order creation in ShipRocket failed                 |

## Error Handling

### ShipRocket Order Creation Fails

- Order is still marked as `active` (payment success)
- `shipmentStatus` set to `failed`
- User receives basic order confirmation email
- Admin should retry shipment creation manually

### AWB Assignment Fails

- `shipmentStatus` set to `awaiting_awb`
- User receives email without tracking info
- System can retry using `/resend-tracking-email` endpoint

### Email Service Unavailable

- ShipRocket shipment still created
- Payment is verified successfully
- User receives response with AWB (if available)
- Admin can manually send tracking email

## Testing

### Test Endpoints

1. **Create Order**

   ```bash
   curl -X POST http://localhost:5000/api/payments/create-order \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@test.com","pincode":"560001","originalPrice":499}'
   ```

2. **Send Test Email**

   ```bash
   curl http://localhost:5000/api/payments/test-email
   ```

3. **Check Pincode Serviceability**
   ```bash
   curl -X POST http://localhost:5000/api/payments/check-pincode \
     -H "Content-Type: application/json" \
     -d '{"pincode":"560001"}'
   ```

## Common Issues & Solutions

### Issue: "Failed to authenticate with Shiprocket"

**Solution**: Check `SHIPROCKET_EMAIL` and `SHIPROCKET_PASSWORD` in .env

### Issue: "AWB assignment failed"

**Solution**:

- Verify pincode is serviceable
- Check if courier is available in that region
- Try reassigning with specific courier ID

### Issue: Tracking email not sent

**Solution**: Check SMTP configuration and verify user has valid email

### Issue: Order created but no shipment in ShipRocket

**Solution**: Check if `SHIPROCKET_PICKUP_LOCATION_ID` is valid

## Best Practices

1. **Always validate pincode** before showing order page
2. **Store ShipRocket responses** for troubleshooting
3. **Set up error notifications** for failed shipments
4. **Use order status tracking** to identify stuck orders
5. **Test email templates** with different name lengths
6. **Monitor ShipRocket API** rate limits (typically 100 req/min)
7. **Implement retry logic** for transient failures
8. **Keep backup contact details** in case shipment fails

## Troubleshooting

### View Order with Tracking

```bash
curl http://localhost:5000/api/payments/track-order/:orderId
```

### Resend Tracking Email

```bash
curl -X POST http://localhost:5000/api/payments/resend-tracking-email/:orderId
```

## References

- [ShipRocket API Documentation](https://shipapi.docs.apiary.io/)
- [ShipRocket Order Creation](https://shipapi.docs.apiary.io/#reference/orders/create-order)
- [ShipRocket AWB Assignment](https://shipapi.docs.apiary.io/#reference/shipments/assign-courier)
- [ShipRocket Tracking](https://track.shiprocket.in/)

## Support

For issues with ShipRocket integration:

1. Check backend logs: `backedn/logs/`
2. Verify ShipRocket credentials
3. Test endpoints manually
4. Contact ShipRocket support: support@shiprocket.in

---

**Last Updated**: February 3, 2026
**Maintained By**: Development Team
