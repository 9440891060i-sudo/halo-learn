# Complete End-to-End Test Script

# ShipRocket + Razorpay + Email Flow

## BASE URL

BASE_URL="http://localhost:5000"

---

# ============================================================

# STEP 1: TEST EMAIL SERVICE (Pre-requisite Check)

# ============================================================

echo "=== TEST 1: Verify Email Service ==="
curl -X GET $BASE_URL/api/payments/test-email

# Expected Response:

# {

# "success": true,

# "messageId": "<AWS_SES_MESSAGE_ID>"

# }

---

# ============================================================

# STEP 2: CHECK SHIPROCKET CONFIGURATION

# ============================================================

echo "=== TEST 2: Check ShipRocket Config ==="
curl -X GET $BASE_URL/api/payments/shiprocket-config

# Expected Response:

# {

# "configured": true,

# "emailSet": true,

# "passwordSet": true,

# "pickupLocationId": "33751024",

# "sellerName": "Tricher"

# }

---

# ============================================================

# STEP 3: CHECK PINCODE SERVICEABILITY

# ============================================================

echo "=== TEST 3: Check Pincode Serviceability ==="
curl -X POST $BASE_URL/api/payments/check-pincode \
 -H "Content-Type: application/json" \
 -d '{
"pincode": "560001"
}'

# Expected Response:

# {

# "serviceable": true,

# "cod": true,

# "prepaid": true,

# "couriers": [

# {

# "id": 10,

# "name": "Amazon Surface",

# "charges": 45,

# "days": 3

# },

# {

# "id": 11,

# "name": "Ekart",

# "charges": 40,

# "days": 4

# }

# ]

# }

---

# ============================================================

# STEP 4: CREATE ORDER FOR RAZORPAY PAYMENT

# ============================================================

echo "=== TEST 4: Create Order (Online Payment) ==="
curl -X POST $BASE_URL/api/payments/create-order \
 -H "Content-Type: application/json" \
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
}'

# Expected Response:

# {

# "razorpayOrder": {

# "id": "order_IluGWxBm9U8zJ8",

# "entity": "order",

# "amount": 49900,

# "amount_paid": 0,

# "amount_due": 49900,

# "currency": "INR",

# "receipt": "rcpt_1707027222068",

# "offer_id": null,

# "status": "created",

# "attempts": 0,

# "notes": {},

# "created_at": 1707027222

# },

# "orderId": "507f1f77bcf86cd799439011",

# "key": "rzp_live_RrMjRcp1jEcitU",

# "finalAmount": 499

# }

# ⚠️ SAVE THESE VALUES FOR NEXT STEP:

# ORDER_ID = "507f1f77bcf86cd799439011"

# RAZORPAY_ORDER_ID = "order_IluGWxBm9U8zJ8"

---

# ============================================================

# STEP 5: SIMULATE RAZORPAY PAYMENT & VERIFY

# ============================================================

echo "=== TEST 5: Verify Razorpay Payment ==="

# ⚠️ In production, these values come from Razorpay:

# 1. User completes payment on Razorpay gateway

# 2. Razorpay returns payment_id and signature

# 3. Frontend passes these to backend

# For testing, use these test values (from test card: 4111 1111 1111 1111):

RAZORPAY_ORDER_ID="order_IluGWxBm9U8zJ8"
RAZORPAY_PAYMENT_ID="pay_IluGW00sSvDd9m"
RAZORPAY_SIGNATURE="9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
ORDER_ID="507f1f77bcf86cd799439011"

curl -X POST $BASE_URL/api/payments/verify-payment \
  -H "Content-Type: application/json" \
  -d "{
    \"razorpay_order_id\": \"$RAZORPAY_ORDER_ID\",
\"razorpay_payment_id\": \"$RAZORPAY_PAYMENT_ID\",
    \"razorpay_signature\": \"$RAZORPAY_SIGNATURE\",
\"orderId\": \"$ORDER_ID\"
}"

# Expected Response:

# {

# "ok": true,

# "trackingInfo": {

# "awb": "321055706540",

# "trackingUrl": "https://track.shiprocket.in/321055706540"

# }

# }

# ✅ At this point:

# - Order status changed to "active"

# - ShipRocket order created

# - Courier assigned

# - AWB generated

# - Tracking email sent to customer

# - User can now track shipment

---

# ============================================================

# STEP 6: VERIFY EMAIL WAS SENT

# ============================================================

echo "=== TEST 6: Check Email Received ==="

# Check your email inbox:

# 📧 To: psaisuryacharan@gmail.com

# 📧 Subject: 🚚 Your Tricher Order #xxxxx is Ready to Ship!

# 📧 Contains: AWB 321055706540 and tracking link

# Sample email content you should see:

# - Order confirmation

# - Amount paid: ₹499

# - Tracking number (AWB): 321055706540

# - Click "Track Your Shipment" button

# - Delivery address

# - Expected delivery timeline

---

# ============================================================

# STEP 7: TRACK ORDER

# ============================================================

echo "=== TEST 7: Track Order ==="
curl -X GET "$BASE_URL/api/payments/track-order/$ORDER_ID"

# Expected Response:

# {

# "orderId": "507f1f77bcf86cd799439011",

# "status": "active",

# "shipmentStatus": "shipped",

# "amount": 499,

# "paymentMethod": "online",

# "createdAt": "2026-02-03T09:53:42.000Z",

# "tracking": {

# "awb": "321055706540",

# "trackingUrl": "https://track.shiprocket.in/321055706540",

# "liveStatus": {

# "shipment_id": 1162267199,

# "order_id": 281248157,

# "awb": "321055706540",

# "status": "in_transit",

# "current_location": "Bangalore, Karnataka",

# "scans": [

# {

# "location": "Bangalore",

# "timestamp": "2026-02-03 10:20:00",

# "event": "SHIPMENT_PICKED",

# "remarks": "Shipment picked from warehouse"

# }

# ],

# "etd": "2026-02-05"

# }

# },

# "plan": {

# "name": "tricher",

# "description": "Tricher Basic Plan"

# }

# }

---

# ============================================================

# STEP 8: RESEND TRACKING EMAIL

# ============================================================

echo "=== TEST 8: Resend Tracking Email ==="
curl -X POST "$BASE_URL/api/payments/resend-tracking-email/$ORDER_ID"

# Expected Response:

# {

# "ok": true,

# "message": "Tracking email sent successfully",

# "awb": "321055706540",

# "trackingUrl": "https://track.shiprocket.in/321055706540"

# }

# ✅ User receives another email with tracking info

# This is useful if the first email was missed or deleted

---

# ============================================================

# STEP 9: CREATE COD ORDER

# ============================================================

echo "=== TEST 9: Create COD Order ==="
curl -X POST $BASE_URL/api/payments/create-order \
 -H "Content-Type: application/json" \
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
}'

# Expected Response:

# {

# "razorpayOrder": { ... },

# "orderId": "507f1f77bcf86cd799439012",

# "key": "rzp_live_RrMjRcp1jEcitU",

# "finalAmount": 999

# }

# ⚠️ SAVE:

# COD_ORDER_ID = "507f1f77bcf86cd799439012"

---

# ============================================================

# STEP 10: CONFIRM COD ORDER

# ============================================================

echo "=== TEST 10: Confirm COD Order ==="
COD_ORDER_ID="507f1f77bcf86cd799439012"

curl -X POST $BASE_URL/api/payments/confirm-cod-order \
  -H "Content-Type: application/json" \
  -d "{
    \"orderId\": \"$COD_ORDER_ID\"
}"

# Expected Response:

# {

# "ok": true,

# "trackingInfo": {

# "awb": "321055706541",

# "trackingUrl": "https://track.shiprocket.in/321055706541"

# }

# }

# ✅ At this point:

# - COD order status changed to "active"

# - ShipRocket order created (marked as COD)

# - Courier assigned

# - AWB generated

# - COD confirmation email sent

# - User receives email with payment on delivery notice

---

# ============================================================

# STEP 11: VERIFY COD EMAIL

# ============================================================

echo "=== TEST 11: Check COD Email Received ==="

# Check email inbox for:

# 📧 To: testcod@example.com

# 📧 Subject: 🚚 COD Order Confirmed #xxxxx

# 📧 Contains:

# - 💰 Payment on Delivery: ₹999

# - Keep exact amount ready notice

# - Tracking number

# - Tracking link

---

# ============================================================

# STEP 12: TRACK COD ORDER

# ============================================================

echo "=== TEST 12: Track COD Order ==="
curl -X GET "$BASE_URL/api/payments/track-order/$COD_ORDER_ID"

# Expected Response:

# {

# "orderId": "507f1f77bcf86cd799439012",

# "status": "active",

# "shipmentStatus": "shipped",

# "amount": 999,

# "paymentMethod": "cod",

# "createdAt": "2026-02-03T10:30:00.000Z",

# "tracking": {

# "awb": "321055706541",

# "trackingUrl": "https://track.shiprocket.in/321055706541",

# "liveStatus": { ... }

# }

# }

---

# ============================================================

# STEP 13: TEST WITH COUPON

# ============================================================

echo "=== TEST 13: Apply Coupon & Create Order ==="
curl -X POST $BASE_URL/api/payments/apply-coupon \
 -H "Content-Type: application/json" \
 -d '{
"coupon": "SAVE10",
"originalPrice": 999
}'

# Expected Response (if coupon valid):

# {

# "original": 999,

# "discount": 99,

# "final": 900,

# "valid": true

# }

# Then create order with coupon:

curl -X POST $BASE_URL/api/payments/create-order \
 -H "Content-Type: application/json" \
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
}'

# Expected Response:

# {

# "razorpayOrder": {

# "amount": 90000 // ⚠️ Note: 900 INR = 90000 paise

# },

# "orderId": "507f1f77bcf86cd799439013",

# "finalAmount": 900 // Discount applied

# }

---

# ============================================================

# STEP 14: TEST ERROR HANDLING - INVALID SIGNATURE

# ============================================================

echo "=== TEST 14: Error Handling - Invalid Signature ==="
curl -X POST $BASE_URL/api/payments/verify-payment \
 -H "Content-Type: application/json" \
 -d '{
"razorpay_order_id": "order_IluGWxBm9U8zJ8",
"razorpay_payment_id": "pay_IluGW00sSvDd9m",
"razorpay_signature": "INVALID_SIGNATURE_123456",
"orderId": "507f1f77bcf86cd799439011"
}'

# Expected Response:

# Status: 400

# {

# "error": "Invalid signature"

# }

# ✅ Order should NOT be marked as active

# ✅ No ShipRocket order created

# ✅ No email sent

---

# ============================================================

# STEP 15: TEST ERROR HANDLING - MISSING ADDRESS

# ============================================================

echo "=== TEST 15: Error Handling - Missing Address ==="
curl -X POST $BASE_URL/api/payments/create-order \
 -H "Content-Type: application/json" \
 -d '{
"name": "No Address User",
"email": "noaddress@example.com",
"mobile": "9999999999",
"pincode": "560001",
"productId": "tricher",
"originalPrice": 499,
"paymentMethod": "online"
}'

# Expected Response:

# {

# "razorpayOrder": { ... },

# "orderId": "507f1f77bcf86cd799439014",

# "key": "rzp_live_xxx",

# "finalAmount": 499

# }

# Then verify payment as normal...

# Expected behavior:

# ✅ Payment verification succeeds

# ✅ Order marked as "active"

# ❌ ShipRocket order NOT created (no address)

# ✅ Email sent WITHOUT tracking info

# ⚠️ Backend logs warning about missing address

---

# ============================================================

# COMPLETE TEST FLOW SUMMARY

# ============================================================

echo "
╔════════════════════════════════════════════════════════════╗
║ COMPLETE END-TO-END TEST FLOW SUMMARY ║
╚════════════════════════════════════════════════════════════╝

✅ PRE-REQUISITE CHECKS

1. Email service working
2. ShipRocket configured
3. Pincode serviceable

✅ ONLINE PAYMENT FLOW 4. Create order 5. Verify payment with Razorpay signature 6. Verify email received 7. Track order status 8. Resend tracking email

✅ COD PAYMENT FLOW 9. Create COD order 10. Confirm COD order 11. Verify email received 12. Track order status

✅ ADVANCED FEATURES 13. Apply coupon and discount 14. Error handling (invalid signature) 15. Error handling (missing data)

═══════════════════════════════════════════════════════════════

EXPECTED OUTCOMES:

Online Payment Order:
• Status: active ✅
• ShipRocket Order: Created ✅
• AWB: Generated ✅
• Email: Sent with tracking ✅
• User: Can track 24/7 ✅

COD Order:
• Status: active ✅
• ShipRocket Order: Created (COD) ✅
• AWB: Generated ✅
• Email: Sent with payment notice ✅
• Courier: Collects payment on delivery ✅

═══════════════════════════════════════════════════════════════
"

---

# ============================================================

# BASH SCRIPT VERSION (Save as test.sh)

# ============================================================

# #!/bin/bash

#

# BASE_URL="http://localhost:5000"

#

# echo "Starting End-to-End Tests..."

#

# # Test 1: Email

# echo "Test 1: Email Service"

# curl -X GET $BASE_URL/api/payments/test-email

# sleep 2

#

# # Test 2: ShipRocket Config

# echo "Test 2: ShipRocket Config"

# curl -X GET $BASE_URL/api/payments/shiprocket-config

# sleep 2

#

# # Test 3: Pincode

# echo "Test 3: Pincode Check"

# curl -X POST $BASE_URL/api/payments/check-pincode \

# -H "Content-Type: application/json" \

# -d '{"pincode": "560001"}'

# sleep 2

#

# # Test 4: Create Order

# echo "Test 4: Create Order"

# RESPONSE=$(curl -s -X POST $BASE_URL/api/payments/create-order \

# -H "Content-Type: application/json" \

# -d '{

# "name": "Surya Charan",

# "email": "psaisuryacharan@gmail.com",

# "mobile": "8328166638",

# "address": "Street 1",

# "city": "Bangalore",

# "pincode": "560001",

# "productId": "tricher",

# "originalPrice": 499,

# "paymentMethod": "online"

# }')

#

# ORDER_ID=$(echo $RESPONSE | grep -o '"orderId":"[^"]\*' | cut -d'"' -f4)

# echo "Order ID: $ORDER_ID"

# sleep 2

#

# # Test 5: Verify Payment

# echo "Test 5: Verify Payment"

# curl -X POST $BASE_URL/api/payments/verify-payment \

# -H "Content-Type: application/json" \

# -d "{

# \"razorpay_order_id\": \"order_IluGWxBm9U8zJ8\",

# \"razorpay_payment_id\": \"pay_IluGW00sSvDd9m\",

# \"razorpay_signature\": \"9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d\",

# \"orderId\": \"$ORDER_ID\"

# }"

# sleep 2

#

# # Test 6: Track Order

# echo "Test 6: Track Order"

# curl -X GET "$BASE_URL/api/payments/track-order/$ORDER_ID"

# sleep 2

#

# # Test 7: Resend Email

# echo "Test 7: Resend Tracking Email"

# curl -X POST "$BASE_URL/api/payments/resend-tracking-email/$ORDER_ID"

#

# echo "All tests completed!"

---

# ============================================================

# POSTMAN COLLECTION (Import to Postman)

# ============================================================

# {

# "info": {

# "name": "Tricher ShipRocket Integration",

# "description": "Complete E2E test collection",

# "version": "1.0"

# },

# "item": [

# {

# "name": "1. Test Email Service",

# "request": {

# "method": "GET",

# "url": "{{base_url}}/api/payments/test-email"

# }

# },

# {

# "name": "2. Check ShipRocket Config",

# "request": {

# "method": "GET",

# "url": "{{base_url}}/api/payments/shiprocket-config"

# }

# },

# {

# "name": "3. Check Pincode Serviceability",

# "request": {

# "method": "POST",

# "url": "{{base_url}}/api/payments/check-pincode",

# "header": {

# "Content-Type": "application/json"

# },

# "body": {

# "mode": "raw",

# "raw": "{\"pincode\": \"560001\"}"

# }

# }

# },

# {

# "name": "4. Create Order (Online)",

# "request": {

# "method": "POST",

# "url": "{{base_url}}/api/payments/create-order",

# "body": {

# "mode": "raw",

# "raw": "{\"name\": \"Surya Charan\", \"email\": \"psaisuryacharan@gmail.com\", \"mobile\": \"8328166638\", \"address\": \"Street 1\", \"city\": \"Bangalore\", \"pincode\": \"560001\", \"productId\": \"tricher\", \"originalPrice\": 499, \"paymentMethod\": \"online\"}"

# }

# }

# },

# {

# "name": "5. Verify Payment",

# "request": {

# "method": "POST",

# "url": "{{base_url}}/api/payments/verify-payment",

# "body": {

# "mode": "raw",

# "raw": "{\"razorpay_order_id\": \"order_xxx\", \"razorpay_payment_id\": \"pay_xxx\", \"razorpay_signature\": \"sig_xxx\", \"orderId\": \"{{order_id}}\"}"

# }

# }

# },

# {

# "name": "6. Track Order",

# "request": {

# "method": "GET",

# "url": "{{base_url}}/api/payments/track-order/{{order_id}}"

# }

# },

# {

# "name": "7. Create COD Order",

# "request": {

# "method": "POST",

# "url": "{{base_url}}/api/payments/create-order",

# "body": {

# "mode": "raw",

# "raw": "{\"name\": \"Test COD\", \"email\": \"testcod@example.com\", \"mobile\": \"9999999999\", \"address\": \"Test Address\", \"city\": \"Mumbai\", \"pincode\": \"400001\", \"productId\": \"tricher\", \"originalPrice\": 999, \"paymentMethod\": \"cod\"}"

# }

# }

# },

# {

# "name": "8. Confirm COD Order",

# "request": {

# "method": "POST",

# "url": "{{base_url}}/api/payments/confirm-cod-order",

# "body": {

# "mode": "raw",

# "raw": "{\"orderId\": \"{{cod_order_id}}\"}"

# }

# }

# },

# {

# "name": "9. Resend Tracking Email",

# "request": {

# "method": "POST",

# "url": "{{base_url}}/api/payments/resend-tracking-email/{{order_id}}"

# }

# }

# ],

# "variable": [

# {

# "key": "base_url",

# "value": "http://localhost:5000"

# },

# {

# "key": "order_id",

# "value": ""

# },

# {

# "key": "cod_order_id",

# "value": ""

# }

# ]

# }

---

# ============================================================

# COPY-PASTE READY TEST COMMANDS

# ============================================================

# Just copy these one by one into your terminal:

# 1️⃣ EMAIL TEST

curl -X GET http://localhost:5000/api/payments/test-email

# 2️⃣ SHIPROCKET CONFIG

curl -X GET http://localhost:5000/api/payments/shiprocket-config

# 3️⃣ CHECK PINCODE

curl -X POST http://localhost:5000/api/payments/check-pincode \
 -H "Content-Type: application/json" \
 -d '{"pincode": "560001"}'

# 4️⃣ CREATE ORDER

curl -X POST http://localhost:5000/api/payments/create-order \
 -H "Content-Type: application/json" \
 -d '{
"name": "Surya Charan",
"email": "psaisuryacharan@gmail.com",
"mobile": "8328166638",
"address": "Street 1, Visalakshi Nagar",
"city": "Bangalore",
"pincode": "560001",
"productId": "tricher",
"originalPrice": 499,
"paymentMethod": "online"
}'

# 5️⃣ VERIFY PAYMENT (Replace ORDER_ID with actual ID from step 4)

curl -X POST http://localhost:5000/api/payments/verify-payment \
 -H "Content-Type: application/json" \
 -d '{
"razorpay_order_id": "order_IluGWxBm9U8zJ8",
"razorpay_payment_id": "pay_IluGW00sSvDd9m",
"razorpay_signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d",
"orderId": "PASTE_ORDER_ID_HERE"
}'

# 6️⃣ TRACK ORDER (Replace ORDER_ID)

curl -X GET http://localhost:5000/api/payments/track-order/PASTE_ORDER_ID_HERE

# 7️⃣ RESEND TRACKING EMAIL (Replace ORDER_ID)

curl -X POST http://localhost:5000/api/payments/resend-tracking-email/PASTE_ORDER_ID_HERE

# 8️⃣ CREATE COD ORDER

curl -X POST http://localhost:5000/api/payments/create-order \
 -H "Content-Type: application/json" \
 -d '{
"name": "Test COD",
"email": "testcod@example.com",
"mobile": "9999999999",
"address": "Test Address",
"city": "Mumbai",
"pincode": "400001",
"productId": "tricher",
"originalPrice": 999,
"paymentMethod": "cod"
}'

# 9️⃣ CONFIRM COD (Replace COD_ORDER_ID)

curl -X POST http://localhost:5000/api/payments/confirm-cod-order \
 -H "Content-Type: application/json" \
 -d '{"orderId": "PASTE_COD_ORDER_ID_HERE"}'

# 🔟 ERROR TEST - INVALID SIGNATURE

curl -X POST http://localhost:5000/api/payments/verify-payment \
 -H "Content-Type: application/json" \
 -d '{
"razorpay_order_id": "order_IluGWxBm9U8zJ8",
"razorpay_payment_id": "pay_IluGW00sSvDd9m",
"razorpay_signature": "INVALID_SIGNATURE",
"orderId": "any_order_id"
}'
