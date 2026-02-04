# Delhivery Integration Guide

## Overview

This application integrates with Delhivery API for shipment creation, tracking, and pincode serviceability checks.

## Setup

### 1. Get Delhivery API Credentials

- Sign up at [Delhivery Developer Portal](https://one.delhivery.com/developer-portal)
- Navigate to API section and generate your API token
- Copy the token to use in environment variables

### 2. Environment Variables

Add these variables to your `.env` file:

```env
# Delhivery API
DELHIVERY_API_KEY=your_delhivery_api_token
DELHIVERY_ENV=staging  # Use 'production' for live
DELHIVERY_BASE_URL=https://track.delhivery.com/api

# Your warehouse/return address
RETURN_PINCODE=110001
RETURN_CITY=Delhi
RETURN_STATE=Delhi
RETURN_PHONE=9876543210
RETURN_ADDRESS=Your Warehouse Address
PICKUP_LOCATION_NAME=Main Warehouse

# Seller details
SELLER_NAME=Tricher
SELLER_ADDRESS=Your Business Address
SELLER_GST=YOUR_GST_NUMBER
```

### 3. Install Dependencies

```bash
cd backedn
npm install
```

## API Endpoints

### 1. Check Pincode Serviceability

**POST** `/api/check-pincode`

Check if a pincode is serviceable for delivery.

**Request:**

```json
{
  "pincode": "110001"
}
```

**Response:**

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

### 2. Track Order

**GET** `/api/track-order/:orderId`

Get order and shipment tracking details.

**Response:**

```json
{
  "orderId": "507f1f77bcf86cd799439011",
  "status": "active",
  "shipmentStatus": "shipped",
  "amount": 3999,
  "paymentMethod": "online",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "tracking": {
    "waybill": "1234567890",
    "trackingUrl": "https://www.delhivery.com/track/package/1234567890",
    "liveStatus": {
      /* Delhivery tracking data */
    }
  },
  "plan": {
    "name": "tricher",
    "description": "Tricher Glasses"
  }
}
```

### 3. Confirm COD Order

**POST** `/api/confirm-cod-order`

Confirm a Cash on Delivery order and create shipment.

**Request:**

```json
{
  "orderId": "507f1f77bcf86cd799439011"
}
```

**Response:**

```json
{
  "ok": true,
  "trackingInfo": {
    "waybill": "1234567890",
    "trackingUrl": "https://www.delhivery.com/track/package/1234567890"
  }
}
```

## Workflow

### For Online Payments:

1. User completes payment through Razorpay
2. `/api/verify-payment` is called
3. System automatically:
   - Creates Delhivery shipment
   - Updates order with tracking details
   - Sends confirmation email with tracking link

### For COD Orders:

1. User selects Cash on Delivery
2. Order is created via `/api/create-order`
3. Call `/api/confirm-cod-order` to process shipment
4. System automatically:
   - Creates COD Delhivery shipment
   - Sends confirmation email with tracking link

## Email Template Features

The system sends automated emails with:

- Order confirmation details
- Delhivery tracking number
- Direct tracking link
- Delivery address
- Payment information

## Tracking

Users can track their orders in two ways:

1. Click the tracking link in the confirmation email
2. Use the tracking number on Delhivery's website
3. Call the `/api/track-order/:orderId` endpoint

## Testing

### Staging Environment

Use `DELHIVERY_ENV=staging` for testing without affecting live shipments.

### Test Pincode

Use test pincodes like `110001`, `400001`, etc. in staging mode.

## Important Notes

1. **Warehouse Setup**: Configure your pickup location in Delhivery dashboard before creating shipments
2. **GST**: Add your GST number for proper invoicing
3. **Weight**: Default weight is set to 500g, adjust in `delhivery.js` if needed
4. **HSN Code**: Currently set for spectacles/glasses (90041000)
5. **Error Handling**: Shipment creation errors won't fail payment verification

## Troubleshooting

### Shipment Creation Fails

- Verify API key is correct
- Check if pickup location is configured in Delhivery dashboard
- Ensure pincode is serviceable
- Validate all required fields are present

### Tracking Not Working

- Ensure waybill number is saved in order
- Check if shipment was actually created in Delhivery
- Verify API key has tracking permissions

## Support

For Delhivery API issues, contact their support or check [documentation](https://one.delhivery.com/developer-portal)
