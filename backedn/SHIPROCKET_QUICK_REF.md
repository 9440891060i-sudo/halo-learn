# Shiprocket Integration - Quick Reference

## Environment Variables (.env)

```bash
# Shiprocket API Credentials (REQUIRED)
SHIPROCKET_EMAIL=tricher-api@yourdomain.com
SHIPROCKET_PASSWORD=your_generated_password

# Shiprocket Configuration
SHIPROCKET_PICKUP_LOCATION_ID=12345
SELLER_NAME=Tricher
```

## How to Get Credentials

1. **Create Shiprocket Account**: https://app.shiprocket.in/register
2. **Create API User**: Settings → API → Add New API User
   - Use different email than main account
   - Note the password
3. **Get Pickup Location ID**: Settings → Pickup Addresses

## Testing Integration

```bash
# Test endpoint (GET)
GET /api/payments/shiprocket-debug

# Response should show:
# - Connection successful
# - Serviceability data for pincode 530043
```

## Order Lifecycle

### Online Payment (Razorpay)

```
Customer pays → Razorpay callback → verify-payment endpoint
  ↓
Create Shiprocket order (automatic)
  ↓
Assign courier (automatic) → Get AWB
  ↓
Generate label & pickup (automatic)
  ↓
Send email with tracking link
```

### Cash on Delivery (COD)

```
Customer confirms COD → confirm-cod-order endpoint
  ↓
Create COD order in Shiprocket (automatic)
  ↓
Assign courier → Get AWB
  ↓
Generate label & pickup (automatic)
  ↓
Send COD email ("Keep ₹X ready")
```

## API Endpoints

### Check Configuration

```
GET /api/payments/shiprocket-config
Returns: { configured, emailSet, passwordSet, pickupLocationId }
```

### Test Connection

```
GET /api/payments/shiprocket-debug
Returns: Auth status + serviceability test for pincode 530043
```

### Check Pincode Serviceability

```
POST /api/payments/check-pincode
Body: { "pincode": "530043" }
Returns: { serviceable, cod, prepaid, couriers[] }
```

### Track Order

```
GET /api/payments/track-order/:orderId
Returns: Order + tracking info + live shipment status
```

## Email to Customer

Includes:

- 🎉 Order confirmed
- 📦 AWB number (tracking number)
- 🔗 Tracking link: https://track.shiprocket.in/[AWB]
- 📍 Shipping address
- 💰 Amount paid
- ⏰ Order date

## Troubleshooting

| Problem                      | Solution                                                                |
| ---------------------------- | ----------------------------------------------------------------------- |
| "Credentials not configured" | Check `.env` file has SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD          |
| "Invalid credentials"        | Verify password is correct (case-sensitive) and API user was created    |
| "Pickup location not found"  | Verify SHIPROCKET_PICKUP_LOCATION_ID is correct in Shiprocket Dashboard |
| Tracking link doesn't work   | Wait 5-10 minutes for Shiprocket to activate tracking                   |
| Order created but no AWB     | Check logs - courier assignment might have failed                       |

## Key Points

✅ **Automatic**: Creates order, assigns courier, generates label, schedules pickup
✅ **Tracking**: Customer gets AWB number and tracking link via email
✅ **Error Handling**: Gracefully handles API failures, doesn't block payment
✅ **COD Support**: Special handling for Cash on Delivery orders
✅ **Multiple Couriers**: Automatically selects best available courier
✅ **Live Tracking**: API endpoint provides real-time shipment status

## Files Modified

- `routes/payments.js` - All payment & shipment logic
- `utils/shiprocket.js` - New Shiprocket API wrapper
- `SHIPROCKET_SETUP.md` - Detailed setup guide
- `SHIPROCKET_IMPLEMENTATION.md` - Technical implementation details

## Important Notes

- Auth token automatically refreshed every 10 days
- Pickup location ID required for all orders
- AWB available immediately after courier assignment
- Tracking portal updated within 5-10 minutes
- All timestamps in UTC

## Next Actions

1. ✅ Create Shiprocket API user
2. ✅ Add credentials to `.env`
3. ✅ Test with `/shiprocket-debug`
4. ✅ Deploy to production
5. ✅ Monitor first few orders in logs
