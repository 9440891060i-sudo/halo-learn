# Delhivery Integration Setup Instructions

## Quick Start

1. **Install Dependencies**

   ```bash
   cd backedn
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Add your Delhivery API key from https://one.delhivery.com/developer-portal
   - Update warehouse/return address details
   - Set `DELHIVERY_ENV=staging` for testing

3. **Start the Server**
   ```bash
   npm run dev
   ```

## What's Been Integrated

### ✅ Backend Features:

1. **Pincode Serviceability Check** - `/api/check-pincode`
2. **Automatic Shipment Creation** - After payment verification
3. **COD Order Support** - `/api/confirm-cod-order`
4. **Order Tracking** - `/api/track-order/:orderId`
5. **Email Notifications** - With tracking links

### ✅ Database Updates:

- Order model now includes Delhivery tracking fields
- User model includes state field for addresses

### ✅ Files Created:

- `utils/delhivery.js` - Delhivery API service
- `DELHIVERY_INTEGRATION.md` - Complete documentation

## Testing the Integration

### Test Pincode Serviceability:

```bash
curl -X POST http://localhost:5000/api/check-pincode \
  -H "Content-Type: application/json" \
  -d '{"pincode": "110001"}'
```

### Test Order Flow:

1. Create order with valid user details (including state)
2. Complete payment (online or COD)
3. Check email for tracking link
4. Track order via `/api/track-order/:orderId`

## Important Configuration

### Delhivery Dashboard Setup:

1. Create pickup location in Delhivery dashboard
2. Note the pickup location name
3. Add to `PICKUP_LOCATION_NAME` in .env

### Required Environment Variables:

```
DELHIVERY_API_KEY=your_token_here
RETURN_PINCODE=your_warehouse_pincode
RETURN_CITY=your_city
RETURN_STATE=your_state
RETURN_ADDRESS=your_full_address
SELLER_NAME=Your Company Name
```

## Email Tracking Features

After payment/COD confirmation, users receive:

- ✅ Order confirmation
- ✅ Delhivery tracking number
- ✅ Direct tracking link
- ✅ Delivery address confirmation
- ✅ Payment details

## Next Steps

1. Get Delhivery API credentials
2. Update .env file
3. Test in staging mode
4. Switch to production when ready

For detailed API documentation, see `DELHIVERY_INTEGRATION.md`
