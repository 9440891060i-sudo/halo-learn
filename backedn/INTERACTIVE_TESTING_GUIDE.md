# 🧪 Interactive API Testing Guide

**Run these commands in PowerShell or Terminal**

---

## ⚡ Quick Test (2 minutes)

```powershell
# Test 1: Email Service
curl.exe -X GET http://localhost:5000/api/payments/test-email

# Test 2: ShipRocket Config
curl.exe -X GET http://localhost:5000/api/payments/shiprocket-config

# Test 3: Check Pincode
curl.exe -X POST http://localhost:5000/api/payments/check-pincode `
  -H "Content-Type: application/json" `
  -d '{\"pincode\": \"560001\"}'
```

---

## 📦 Complete Online Payment Test (5 minutes)

### Step 1: Create Order
```powershell
$createOrderResponse = curl.exe -X POST http://localhost:5000/api/payments/create-order `
  -H "Content-Type: application/json" `
  -d '{
    "name": "Surya Charan",
    "email": "psaisuryacharan@gmail.com",
    "mobile": "8328166638",
    "address": "Street 1, Visalakshi Nagar",
    "city": "Bangalore",
    "pincode": "560001",
    "state": "Karnataka",
    "productId": "tricher",
    "originalPrice": 499,
    "coupon": null,
    "paymentMethod": "online"
  }' | ConvertFrom-Json

$orderId = $createOrderResponse.orderId
$razorpayOrderId = $createOrderResponse.razorpayOrder.id

Write-Host "✅ Order Created!"
Write-Host "Order ID: $orderId"
Write-Host "Razorpay Order ID: $razorpayOrderId"
```

**Expected Output:**
```json
{
  "razorpayOrder": {
    "id": "order_IluGWxBm9U8zJ8",
    "amount": 49900,
    "currency": "INR",
    "receipt": "rcpt_xxx",
    "status": "created"
  },
  "orderId": "507f1f77bcf86cd799439011",
  "key": "rzp_live_RrMjRcp1jEcitU",
  "finalAmount": 499
}
```

---

### Step 2: Verify Payment
```powershell
# ⚠️ Replace with actual ORDER_ID from Step 1
$orderId = "507f1f77bcf86cd799439011"

$verifyResponse = curl.exe -X POST http://localhost:5000/api/payments/verify-payment `
  -H "Content-Type: application/json" `
  -d "{
    \"razorpay_order_id\": \"order_IluGWxBm9U8zJ8\",
    \"razorpay_payment_id\": \"pay_IluGW00sSvDd9m\",
    \"razorpay_signature\": \"9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d\",
    \"orderId\": \"$orderId\"
  }" | ConvertFrom-Json

Write-Host "✅ Payment Verified!"
Write-Host "AWB: $($verifyResponse.trackingInfo.awb)"
Write-Host "Tracking URL: $($verifyResponse.trackingInfo.trackingUrl)"
```

**Expected Output:**
```json
{
  "ok": true,
  "trackingInfo": {
    "awb": "321055706540",
    "trackingUrl": "https://track.shiprocket.in/321055706540"
  }
}
```

---

### Step 3: Check Email Received
```powershell
Write-Host "📧 Check your email inbox:"
Write-Host "   To: psaisuryacharan@gmail.com"
Write-Host "   Subject: 🚚 Your Tricher Order #xxxxx is Ready to Ship!"
Write-Host "   Contains AWB: 321055706540"
```

---

### Step 4: Track Order
```powershell
$orderId = "507f1f77bcf86cd799439011"

$trackResponse = curl.exe -X GET "http://localhost:5000/api/payments/track-order/$orderId" | ConvertFrom-Json

Write-Host "✅ Order Tracking:"
Write-Host "Status: $($trackResponse.status)"
Write-Host "Shipment Status: $($trackResponse.shipmentStatus)"
Write-Host "AWB: $($trackResponse.tracking.awb)"
Write-Host "Tracking URL: $($trackResponse.tracking.trackingUrl)"
Write-Host "Current Location: $($trackResponse.tracking.liveStatus.current_location)"
Write-Host "ETD: $($trackResponse.tracking.liveStatus.etd)"
```

**Expected Output:**
```json
{
  "orderId": "507f1f77bcf86cd799439011",
  "status": "active",
  "shipmentStatus": "shipped",
  "amount": 499,
  "paymentMethod": "online",
  "tracking": {
    "awb": "321055706540",
    "trackingUrl": "https://track.shiprocket.in/321055706540",
    "liveStatus": {
      "status": "in_transit",
      "current_location": "Bangalore, Karnataka",
      "etd": "2026-02-05"
    }
  }
}
```

---

### Step 5: Resend Tracking Email
```powershell
$orderId = "507f1f77bcf86cd799439011"

$resendResponse = curl.exe -X POST "http://localhost:5000/api/payments/resend-tracking-email/$orderId" | ConvertFrom-Json

Write-Host "✅ Email Resent!"
Write-Host "AWB: $($resendResponse.awb)"
Write-Host "Tracking URL: $($resendResponse.trackingUrl)"
```

**Expected Output:**
```json
{
  "ok": true,
  "message": "Tracking email sent successfully",
  "awb": "321055706540",
  "trackingUrl": "https://track.shiprocket.in/321055706540"
}
```

---

## 💰 Complete COD Payment Test (5 minutes)

### Step 1: Create COD Order
```powershell
$createCODResponse = curl.exe -X POST http://localhost:5000/api/payments/create-order `
  -H "Content-Type: application/json" `
  -d '{
    "name": "Test COD User",
    "email": "testcod@example.com",
    "mobile": "9999999999",
    "address": "Test Address, Apt 101",
    "city": "Mumbai",
    "pincode": "400001",
    "state": "Maharashtra",
    "productId": "tricher",
    "originalPrice": 999,
    "coupon": null,
    "paymentMethod": "cod"
  }' | ConvertFrom-Json

$codOrderId = $createCODResponse.orderId

Write-Host "✅ COD Order Created!"
Write-Host "Order ID: $codOrderId"
Write-Host "Amount: ₹999"
```

---

### Step 2: Confirm COD Order
```powershell
# ⚠️ Replace with actual COD_ORDER_ID from Step 1
$codOrderId = "507f1f77bcf86cd799439012"

$confirmResponse = curl.exe -X POST http://localhost:5000/api/payments/confirm-cod-order `
  -H "Content-Type: application/json" `
  -d "{\"orderId\": \"$codOrderId\"}" | ConvertFrom-Json

Write-Host "✅ COD Order Confirmed!"
Write-Host "AWB: $($confirmResponse.trackingInfo.awb)"
Write-Host "Tracking URL: $($confirmResponse.trackingInfo.trackingUrl)"
```

**Expected Output:**
```json
{
  "ok": true,
  "trackingInfo": {
    "awb": "321055706541",
    "trackingUrl": "https://track.shiprocket.in/321055706541"
  }
}
```

---

### Step 3: Check COD Email
```powershell
Write-Host "📧 Check your email inbox:"
Write-Host "   To: testcod@example.com"
Write-Host "   Subject: 🚚 COD Order Confirmed #xxxxx"
Write-Host "   Contains: 💰 Payment on Delivery: ₹999"
Write-Host "   Contains AWB: 321055706541"
```

---

### Step 4: Track COD Order
```powershell
$codOrderId = "507f1f77bcf86cd799439012"

$trackCODResponse = curl.exe -X GET "http://localhost:5000/api/payments/track-order/$codOrderId" | ConvertFrom-Json

Write-Host "✅ COD Order Tracking:"
Write-Host "Status: $($trackCODResponse.status)"
Write-Host "Payment Method: $($trackCODResponse.paymentMethod)"
Write-Host "Amount: ₹$($trackCODResponse.amount)"
Write-Host "AWB: $($trackCODResponse.tracking.awb)"
```

---

## 🔧 Advanced Tests

### Test with Coupon
```powershell
# First, check if coupon is valid
$couponResponse = curl.exe -X POST http://localhost:5000/api/payments/apply-coupon `
  -H "Content-Type: application/json" `
  -d '{
    "coupon": "SAVE10",
    "originalPrice": 999
  }' | ConvertFrom-Json

Write-Host "Coupon Info:"
Write-Host "Original: ₹$($couponResponse.original)"
Write-Host "Discount: ₹$($couponResponse.discount)"
Write-Host "Final: ₹$($couponResponse.final)"

# Create order with discount
$discountOrderResponse = curl.exe -X POST http://localhost:5000/api/payments/create-order `
  -H "Content-Type: application/json" `
  -d '{
    "name": "Discount Buyer",
    "email": "discount@example.com",
    "mobile": "9876543210",
    "address": "Discount Address",
    "city": "Hyderabad",
    "pincode": "500001",
    "productId": "tricher",
    "originalPrice": 999,
    "coupon": "SAVE10",
    "paymentMethod": "online"
  }' | ConvertFrom-Json

Write-Host "✅ Order with Coupon Created!"
Write-Host "Original Price: ₹999"
Write-Host "Final Amount: ₹$($discountOrderResponse.finalAmount)"
```

---

### Test Error: Invalid Signature
```powershell
$errorResponse = curl.exe -X POST http://localhost:5000/api/payments/verify-payment `
  -H "Content-Type: application/json" `
  -d '{
    "razorpay_order_id": "order_IluGWxBm9U8zJ8",
    "razorpay_payment_id": "pay_IluGW00sSvDd9m",
    "razorpay_signature": "INVALID_SIGNATURE_123456",
    "orderId": "507f1f77bcf86cd799439011"
  }' | ConvertFrom-Json

Write-Host "❌ Expected Error:"
Write-Host "Error: $($errorResponse.error)"
```

**Expected Output:**
```json
{
  "error": "Invalid signature"
}
```

---

### Test Error: Missing Address
```powershell
$noAddressResponse = curl.exe -X POST http://localhost:5000/api/payments/create-order `
  -H "Content-Type: application/json" `
  -d '{
    "name": "No Address User",
    "email": "noaddress@example.com",
    "mobile": "9999999999",
    "pincode": "560001",
    "productId": "tricher",
    "originalPrice": 499,
    "paymentMethod": "online"
  }' | ConvertFrom-Json

$noAddrOrderId = $noAddressResponse.orderId

Write-Host "✅ Order Created (No Address)"
Write-Host "Order ID: $noAddrOrderId"

# Verify payment
$verifyNoAddr = curl.exe -X POST http://localhost:5000/api/payments/verify-payment `
  -H "Content-Type: application/json" `
  -d "{
    \"razorpay_order_id\": \"order_xxx\",
    \"razorpay_payment_id\": \"pay_xxx\",
    \"razorpay_signature\": \"valid_sig\",
    \"orderId\": \"$noAddrOrderId\"
  }" | ConvertFrom-Json

# Check order - ShipRocket order should NOT be created
$checkOrder = curl.exe -X GET "http://localhost:5000/api/payments/track-order/$noAddrOrderId" | ConvertFrom-Json

Write-Host "Payment Status: $($verifyNoAddr.ok)"
Write-Host "Shipment Status: $($checkOrder.shipmentStatus)"
Write-Host "⚠️ Note: shipmentStatus should be 'pending' (no address)"
```

---

## 📊 Batch Testing Script

```powershell
# Save as: test-all.ps1
# Run with: .\test-all.ps1

Write-Host "╔════════════════════════════════════════════════════════╗"
Write-Host "║   ShipRocket + Razorpay Integration - Full Test Suite  ║"
Write-Host "╚════════════════════════════════════════════════════════╝"
Write-Host ""

# Test 1
Write-Host "Test 1/9: Email Service" -ForegroundColor Cyan
$test1 = curl.exe -X GET http://localhost:5000/api/payments/test-email | ConvertFrom-Json
if ($test1.success) { Write-Host "✅ PASS" -ForegroundColor Green } else { Write-Host "❌ FAIL" -ForegroundColor Red }
Write-Host ""

# Test 2
Write-Host "Test 2/9: ShipRocket Config" -ForegroundColor Cyan
$test2 = curl.exe -X GET http://localhost:5000/api/payments/shiprocket-config | ConvertFrom-Json
if ($test2.configured) { Write-Host "✅ PASS" -ForegroundColor Green } else { Write-Host "❌ FAIL" -ForegroundColor Red }
Write-Host ""

# Test 3
Write-Host "Test 3/9: Pincode Serviceability" -ForegroundColor Cyan
$test3 = curl.exe -X POST http://localhost:5000/api/payments/check-pincode `
  -H "Content-Type: application/json" `
  -d '{\"pincode\": \"560001\"}' | ConvertFrom-Json
if ($test3.serviceable) { Write-Host "✅ PASS" -ForegroundColor Green } else { Write-Host "❌ FAIL" -ForegroundColor Red }
Write-Host ""

# Test 4
Write-Host "Test 4/9: Create Online Order" -ForegroundColor Cyan
$test4 = curl.exe -X POST http://localhost:5000/api/payments/create-order `
  -H "Content-Type: application/json" `
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "mobile": "9999999999",
    "address": "Test Address",
    "city": "Bangalore",
    "pincode": "560001",
    "productId": "tricher",
    "originalPrice": 499,
    "paymentMethod": "online"
  }' | ConvertFrom-Json
$orderId = $test4.orderId
if ($orderId) { Write-Host "✅ PASS (Order ID: $orderId)" -ForegroundColor Green } else { Write-Host "❌ FAIL" -ForegroundColor Red }
Write-Host ""

# Test 5
Write-Host "Test 5/9: Verify Payment" -ForegroundColor Cyan
$test5 = curl.exe -X POST http://localhost:5000/api/payments/verify-payment `
  -H "Content-Type: application/json" `
  -d "{
    \"razorpay_order_id\": \"order_test\",
    \"razorpay_payment_id\": \"pay_test\",
    \"razorpay_signature\": \"test_sig\",
    \"orderId\": \"$orderId\"
  }" | ConvertFrom-Json
if ($test5.ok) { Write-Host "✅ PASS (AWB: $($test5.trackingInfo.awb))" -ForegroundColor Green } else { Write-Host "❌ FAIL" -ForegroundColor Red }
Write-Host ""

# Test 6
Write-Host "Test 6/9: Track Order" -ForegroundColor Cyan
$test6 = curl.exe -X GET "http://localhost:5000/api/payments/track-order/$orderId" | ConvertFrom-Json
if ($test6.orderId) { Write-Host "✅ PASS" -ForegroundColor Green } else { Write-Host "❌ FAIL" -ForegroundColor Red }
Write-Host ""

# Test 7
Write-Host "Test 7/9: Create COD Order" -ForegroundColor Cyan
$test7 = curl.exe -X POST http://localhost:5000/api/payments/create-order `
  -H "Content-Type: application/json" `
  -d '{
    "name": "COD User",
    "email": "cod@example.com",
    "mobile": "9999999999",
    "address": "COD Address",
    "city": "Mumbai",
    "pincode": "400001",
    "productId": "tricher",
    "originalPrice": 999,
    "paymentMethod": "cod"
  }' | ConvertFrom-Json
$codOrderId = $test7.orderId
if ($codOrderId) { Write-Host "✅ PASS" -ForegroundColor Green } else { Write-Host "❌ FAIL" -ForegroundColor Red }
Write-Host ""

# Test 8
Write-Host "Test 8/9: Confirm COD Order" -ForegroundColor Cyan
$test8 = curl.exe -X POST http://localhost:5000/api/payments/confirm-cod-order `
  -H "Content-Type: application/json" `
  -d "{\"orderId\": \"$codOrderId\"}" | ConvertFrom-Json
if ($test8.ok) { Write-Host "✅ PASS" -ForegroundColor Green } else { Write-Host "❌ FAIL" -ForegroundColor Red }
Write-Host ""

# Test 9
Write-Host "Test 9/9: Resend Tracking Email" -ForegroundColor Cyan
$test9 = curl.exe -X POST "http://localhost:5000/api/payments/resend-tracking-email/$orderId" | ConvertFrom-Json
if ($test9.ok) { Write-Host "✅ PASS" -ForegroundColor Green } else { Write-Host "❌ FAIL" -ForegroundColor Red }
Write-Host ""

Write-Host "╔════════════════════════════════════════════════════════╗"
Write-Host "║                   All Tests Completed!                 ║"
Write-Host "╚════════════════════════════════════════════════════════╝"
```

---

## 🧠 Important Notes

### Order IDs
- Save the `orderId` from create-order response
- Use it in subsequent calls for verify, track, resend

### Razorpay Signature
- Test signature: `9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d`
- For production: Use actual Razorpay payment details

### Email Verification
- Check inbox for confirmation emails
- Subject will contain order tracking details
- AWB number will be in email body

### Response Headers
All responses include:
- `Content-Type: application/json`
- Status codes: 200 (success), 400 (error)

---

## 🎯 Expected Results Summary

| Test | Expected | Actual | Status |
|------|----------|--------|--------|
| Email Service | success: true | | |
| ShipRocket Config | configured: true | | |
| Pincode Check | serviceable: true | | |
| Create Order | orderId returned | | |
| Verify Payment | ok: true + AWB | | |
| Track Order | shipmentStatus: shipped | | |
| Create COD | orderId returned | | |
| Confirm COD | ok: true + AWB | | |
| Resend Email | ok: true | | |

---

**Run these tests in order and mark progress above!**
