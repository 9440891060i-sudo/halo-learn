# Shiprocket Integration - Implementation Summary

## Files Created/Modified

### 1. **New File: `utils/shiprocket.js`**

- Complete Shiprocket API wrapper
- Functions:
  - `getAuthToken()` - Manages auth tokens with 240-hour expiry
  - `checkPincodeServiceability()` - Check if pincode is serviceable
  - `createShipment()` - Create order in Shiprocket
  - `assignCourier()` - Assign courier and get AWB
  - `trackShipment()` - Get live tracking info
  - `generateLabel()` - Generate shipping label (PDF)
  - `generatePickup()` - Schedule pickup from warehouse

### 2. **Modified: `routes/payments.js`**

- **Removed**: Delhivery integration
- **Added**: Shiprocket integration

**Key Changes**:

- Line 14: Import `shiprocket` instead of `delhivery`
- Line 127-141: New `/shiprocket-config` endpoint (replaced `/delhivery-config`)
- Line 148-175: Updated `/check-pincode` to use Shiprocket
- Line 309-349: **MAJOR** - `verify-payment` endpoint now:
  - Creates Shiprocket order
  - Assigns courier automatically
  - Generates label and schedules pickup
  - Sends tracking email with AWB and tracking URL
- Line 566-615: **MAJOR** - `confirm-cod-order` endpoint with same Shiprocket logic
- Line 701-730: Updated `/track-order` to fetch Shiprocket tracking data
- Line 738-765: New `/shiprocket-debug` endpoint for testing setup

**Email Enhancement**:

- Includes AWB number in tracking section
- Direct link to Shiprocket tracking portal
- Different templates for prepaid vs COD

### 3. **New File: `SHIPROCKET_SETUP.md`**

- Complete setup guide with 10 steps
- API credential configuration
- Testing procedures
- Troubleshooting guide
- Response structure documentation

---

## Order Payment Flow

### Before (Delhivery)

```
Payment → Order Created → Delhivery Shipment → Manual AWB assignment
```

### After (Shiprocket)

```
Payment → Order Created → Shiprocket Order → Courier Assigned → AWB Generated → Label Generated → Pickup Scheduled → Tracking Email
```

---

## New Environment Variables Required

```bash
SHIPROCKET_EMAIL=api-user@domain.com
SHIPROCKET_PASSWORD=your_password_here
SHIPROCKET_PICKUP_LOCATION_ID=12345
SELLER_NAME=Tricher
```

---

## Key Features Implemented

✅ **Automatic Order Creation**

- Creates order in Shiprocket immediately after payment verification
- Includes all customer and product details

✅ **Automatic Courier Assignment**

- Assigns best courier automatically
- Gets AWB (tracking number) immediately

✅ **Pickup Scheduling**

- Automatically schedules pickup from your warehouse
- Pickup location configured via env variable

✅ **Label & Manifest Generation**

- Generates shipping label (can be printed)
- Manifest can be printed for bulk shipping

✅ **Tracking Information**

- Sends tracking link to customer via email
- Tracking URL: `https://track.shiprocket.in/[AWB]`
- API endpoint for live tracking: `GET /api/payments/track-order/:orderId`

✅ **COD Support**

- Creates COD orders with collection amount
- Email alerts customer to keep amount ready

✅ **Error Handling**

- Gracefully handles API failures
- Doesn't block order if shipment creation fails
- Detailed error logging

---

## API Endpoints Summary

| Endpoint                | Method | Purpose                                           |
| ----------------------- | ------ | ------------------------------------------------- |
| `/shiprocket-config`    | GET    | Check Shiprocket configuration status             |
| `/check-pincode`        | POST   | Verify if pincode is serviceable                  |
| `/shiprocket-debug`     | GET    | Test Shiprocket API connection                    |
| `/verify-payment`       | POST   | Verify Razorpay payment + create Shiprocket order |
| `/confirm-cod-order`    | POST   | Create COD order in Shiprocket                    |
| `/track-order/:orderId` | GET    | Get live tracking information                     |

---

## Database Fields Added to Order Model

```javascript
shiprocketOrderId: String,      // "SR-12345"
shiprocketShipmentId: String,   // Shipment ID
shiprocketAwb: String,          // "DL123456789" (tracking number)
shiprocketTrackingUrl: String,  // "https://track.shiprocket.in/..."
shipmentStatus: String,         // "shipped", "in-transit", "delivered"
```

---

## Testing Checklist

Before going live:

- [ ] Set all `SHIPROCKET_*` environment variables
- [ ] Call `/shiprocket-debug` endpoint - should succeed
- [ ] Create test order with Razorpay test key
- [ ] Verify email received with tracking link
- [ ] Click tracking link - should show Shiprocket tracking page
- [ ] Test COD order creation
- [ ] Verify COD email mentions "Payment on Delivery"
- [ ] Call `/track-order` endpoint
- [ ] Verify pincode serviceability check works
- [ ] Test with real pincode (e.g., your delivery area)

---

## Important Notes

### Auth Token Management

- Token is automatically generated and cached
- Refreshed after 230 hours (10 days)
- No manual token refresh needed

### Pickup Location

- Must create pickup location in Shiprocket Dashboard
- Get the location ID and add to env variable
- Used for all order creation

### AWB Assignment

- Happens automatically after order creation
- AWB available immediately in response
- Tracking link active within 5-10 minutes

### Label Generation

- Optional but recommended
- Can be printed and attached to package
- PDF link returned in response

### Webhook Support

- Shiprocket can send webhooks for tracking updates
- Configure in Shiprocket Settings → Webhooks
- Current implementation uses polling via API calls

---

## Migration from Delhivery

If you had previous orders with Delhivery fields:

- Old fields (`delhiveryWaybill`, `delhiveryOrderId`, etc.) remain in database
- New orders will use Shiprocket fields
- Both can coexist for historical tracking

---

## Support & Documentation

- **Shiprocket API Docs**: https://apidocs.shiprocket.in/
- **Setup Guide**: See `SHIPROCKET_SETUP.md`
- **Troubleshooting**: Check server logs and use `/shiprocket-debug` endpoint

---

## Next Steps

1. **Obtain Shiprocket Account**: Sign up and create API user
2. **Configure Environment Variables**: Add SHIPROCKET\_\* vars to .env
3. **Run Debug Test**: Call `/shiprocket-debug` endpoint
4. **Deploy**: Push changes to production
5. **Monitor**: Check logs for any integration issues
