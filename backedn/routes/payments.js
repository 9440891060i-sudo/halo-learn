const express = require('express');
const router = express.Router();

const Coupon = require('../models/Coupon');
const CouponUsage = require('../models/CouponUsage');
const User = require('../models/User');
const Plan = require('../models/Plan');
const Order = require('../models/Order');

const Razorpay = require('razorpay');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const shiprocket = require('../utils/shiprocket');

/* =========================
   ENV VARIABLES
========================= */
const SMTP_HOST = process.env.SMTP_HOST; // email-smtp.ap-south-1.amazonaws.com
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || 'support@tricher.app';

const RZP_KEY = process.env.RZP_KEY;
const RZP_SECRET = process.env.RZP_SECRET;

/* =========================
   STARTUP LOG (IMPORTANT)
========================= */
console.log('📧 SMTP CONFIG CHECK:', {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER_SET: !!SMTP_USER,
  SMTP_PASS_SET: !!SMTP_PASS,
  FROM_EMAIL,
});

/* =========================
   RAZORPAY INIT
========================= */
const razorpay = new Razorpay({
  key_id: RZP_KEY,
  key_secret: RZP_SECRET,
});

/* =========================
   MAIL TRANSPORTER (REUSABLE)
========================= */
const mailTransporter =
  SMTP_HOST && SMTP_USER && SMTP_PASS
    ? nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      })
    : null;

/* =========================
   PRICE + COUPON CALC
========================= */
async function calculateFinalAmount(originalPrice, couponCode) {
  if (!couponCode) {
    return { original: originalPrice, discount: 0, final: originalPrice };
  }

  const coupon = await Coupon.findOne({
    code: couponCode.toUpperCase(),
    active: true,
  });

  if (!coupon) return { valid: false };

  if (coupon.expires_at && coupon.expires_at < new Date()) return { valid: false };
  if (coupon.max_uses && coupon.used_count >= coupon.max_uses) return { valid: false };

  let discount = 0;
  // Normalize and validate discount type/value
  const discType = (coupon.discount_type || '').toString().toLowerCase();
  if (discType === 'flat') {
    discount = Number(coupon.discount_value) || 0;
  } else if (discType === 'percent' || discType === 'percentage') {
    let pct = Number(coupon.discount_value) || 0;
    if (pct < 0) pct = 0;
    if (pct > 100) pct = 100;
    discount = Math.floor((originalPrice * pct) / 100);
  } else {
    // Fallback: treat unknown type as flat amount
    discount = Number(coupon.discount_value) || 0;
  }

  const final = Math.max(0, originalPrice - discount);
  return { original: originalPrice, discount, final, valid: true };
}

/* =========================
   CHECK SHIPROCKET CONFIGURATION
========================= */
router.get('/shiprocket-config', async (req, res) => {
  try {
    const config = {
      configured: !!(process.env.SHIPROCKET_EMAIL && process.env.SHIPROCKET_PASSWORD),
      emailSet: !!process.env.SHIPROCKET_EMAIL,
      passwordSet: !!process.env.SHIPROCKET_PASSWORD,
      pickupLocationId: process.env.SHIPROCKET_PICKUP_LOCATION_ID || 'Not Set',
      sellerName: process.env.SELLER_NAME || 'Not Set',
    };

    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   CHECK PINCODE SERVICEABILITY
========================= */
router.post('/check-pincode', async (req, res) => {
  try {
    const { pincode } = req.body;
    
    if (!pincode) {
      return res.status(400).json({ error: 'Pincode is required' });
    }

    // Check if Shiprocket is configured
    if (!process.env.SHIPROCKET_EMAIL || !process.env.SHIPROCKET_PASSWORD) {
      // Return serviceable by default if Shiprocket not configured
      return res.json({
        serviceable: true,
        cod: true,
        prepaid: true,
        message: 'Shiprocket not configured - serviceability check skipped'
      });
    }

    const serviceability = await shiprocket.checkPincodeServiceability(pincode);
    
    res.json(serviceability);
  } catch (err) {
    console.error('❌ PINCODE CHECK ERROR:', err);
    // Return serviceable on error to not block orders
    res.json({
      serviceable: true,
      cod: true,
      prepaid: true,
      error: 'Could not verify pincode, proceeding with order'
    });
  }
});

/* =========================
   APPLY COUPON
========================= */
router.post('/apply-coupon', async (req, res) => {
  try {
    const { coupon, originalPrice } = req.body;
    const result = await calculateFinalAmount(originalPrice, coupon);

    if (!result.valid) {
      return res.status(400).json({ error: 'Invalid or expired coupon' });
    }

    res.json(result);
  } catch (err) {
    console.error('❌ APPLY COUPON ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   CREATE ORDER
========================= */
router.post('/create-order', async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      address,
      city,
      pincode,
      coupon,
      productId,
      originalPrice,
      amount, // Accept both amount and originalPrice
      paymentMethod,
    } = req.body;

    // Use amount if originalPrice not provided (backwards compatibility)
    const orderAmount = originalPrice || amount;

    if (!orderAmount || orderAmount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    const calc = await calculateFinalAmount(orderAmount, coupon);
    if (coupon && !calc.valid) {
      return res.status(400).json({ error: 'Invalid coupon' });
    }

    if (!name || !mobile) {
      return res.status(400).json({ error: 'Name and mobile are required' });
    }

    let user = await User.findOne({ email });
    if (!user) {
      const userData = { 
        email, 
        name: name || 'Customer',
        mobile: mobile || '9999999999'
      };
      if (address) userData.address = address;
      if (city) userData.city = city;
      if (pincode) userData.pincode = pincode;
      user = await User.create(userData);
    } else {
      // update only fields that are provided (do not overwrite with empty strings)
      if (name) user.name = name;
      if (mobile) user.mobile = mobile;
      if (address) user.address = address;
      if (city) user.city = city;
      if (pincode) user.pincode = pincode;
      await user.save();
    }

    let plan = await Plan.findOne({ name: productId || 'tricher' });
    if (!plan) {
      return res.status(400).json({ error: `Plan '${productId || 'tricher'}' not found` });
    }

    // Validate amount
    if (!calc.final || calc.final <= 0) {
      return res.status(400).json({ error: 'Invalid order amount' });
    }

    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(calc.final * 100), // Convert to paise and round
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    });

    const order = await Order.create({
      user: user._id,
      plan: plan?._id,
      paymentMethod: paymentMethod || 'online',
      amount: orderAmount,
      finalAmount: calc.final,
      address,
      status: 'created',
      razorpayOrderId: rzpOrder.id,
      couponCode: coupon?.toUpperCase(),
    });

    res.json({
      razorpayOrder: rzpOrder,
      orderId: order._id,
      key: RZP_KEY,
      finalAmount: calc.final,
    });
  } catch (err) {
    console.error('❌ CREATE ORDER ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});
/* =========================
   GET LOGGED-IN USER + PLAN
   GET /api/me?email=
========================= */
router.get('/me', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // get latest ACTIVE order
    const order = await Order.findOne({
      user: user._id,
      status: 'active',
    })
      .populate('plan')
      .sort({ createdAt: -1 });

    let plan = null;

    if (order && order.plan) {
      let expiresAt = null;

      if (order.plan.durationDays > 0) {
        expiresAt = new Date(order.createdAt);
        expiresAt.setDate(
          expiresAt.getDate() + order.plan.durationDays
        );
      }

      plan = {
        name: order.plan.name,
        description: order.plan.description,
        price: order.plan.price,
        expiresAt, // null = lifetime
      };
    }

    res.json({
      user: {
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
      plan,
    });
  } catch (err) {
    console.error('❌ /me ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   VERIFY PAYMENT + EMAIL
========================= */
router.post('/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    const hmac = crypto.createHmac('sha256', RZP_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const order = await Order.findOne({
      _id: orderId,
      razorpayOrderId: razorpay_order_id,
    }).populate('user').populate('plan');

    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = 'active';
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    await order.save();

    console.log('📦 ORDER VERIFIED:', order._id);

    if (order.couponCode) {
      await CouponUsage.create({
        coupon_code: order.couponCode,
        user_id: order.user,
        order_id: order._id,
        amount: order.finalAmount
      });

      await Coupon.findOneAndUpdate(
        { code: order.couponCode },
        { $inc: { used_count: 1 } }
      );
    }

    // Create Shiprocket Shipment
    let shiprocketShipment = null;
    try {
      const user = await User.findById(order.user);
      console.log('🔍 ShipRocket check for order:', order._id);
      console.log('   User pincode:', user?.pincode);
      console.log('   User address:', user?.address);
      console.log('   User city:', user?.city);
      
      if (user && user.pincode && user.address) {
        console.log('📦 Creating Shiprocket shipment for order:', order._id);
        
        const shipmentData = {
          name: user.name || 'Customer',
          email: user.email,
          phone: user.mobile || '9999999999',
          address: user.address,
          city: user.city || 'Unknown',
          state: user.state || 'Unknown',
          pincode: user.pincode,
          orderAmount: order.finalAmount,
          paymentMode: order.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
          productName: `Tricher ${order.plan?.name || 'Product'}`,
          quantity: 1,
          weight: 0.5, // 500 grams
          orderId: order._id.toString(),
        };

        shiprocketShipment = await shiprocket.createShipment(shipmentData);

        if (shiprocketShipment.success) {
          // Store shipment ID for later use
          order.shiprocketOrderId = shiprocketShipment.orderId;
          order.shiprocketShipmentId = shiprocketShipment.shipmentId;
          
          // Attempt to assign courier and get AWB
          const courierAssignment = await shiprocket.assignCourier(shiprocketShipment.shipmentId);
          
          if (courierAssignment.success) {
            order.shiprocketAwb = courierAssignment.awb;
            order.shiprocketTrackingUrl = courierAssignment.trackingUrl;
            order.shipmentStatus = 'shipped';
            
            console.log('✅ AWB assigned:', courierAssignment.awb);
            
            // Generate label and pickup asynchronously (don't wait for them)
            Promise.all([
              shiprocket.generateLabel(shiprocketShipment.shipmentId).catch(err => 
                console.warn('⚠️ Label generation failed:', err)
              ),
              shiprocket.generatePickup(shiprocketShipment.shipmentId).catch(err => 
                console.warn('⚠️ Pickup generation failed:', err)
              ),
            ]).catch(err => console.warn('⚠️ Post-shipment tasks failed:', err));
          } else {
            console.warn('⚠️ Courier assignment pending:', courierAssignment.error);
            order.shipmentStatus = 'awaiting_awb';
          }
          
          await order.save();
        } else {
          console.error('❌ Shiprocket shipment creation failed:', shiprocketShipment.error);
          order.shipmentStatus = 'failed';
          await order.save();
        }
      } else {
        console.warn('⚠️ Missing user shipping details, skipping Shiprocket shipment');
        order.shipmentStatus = 'pending';
        await order.save();
      }
    } catch (shiprocketErr) {
      console.error('❌ SHIPROCKET SHIPMENT ERROR:', shiprocketErr);
      // Don't fail the payment verification if shipment creation fails
      order.shipmentStatus = 'error';
      try {
        await order.save();
      } catch (saveErr) {
        console.error('Failed to save error status:', saveErr);
      }
    }

    // Send confirmation and tracking email
    try {
      const user = await User.findById(order.user);

      if (!user?.email) {
        console.warn('⚠️ No user email, skipping mail');
      } else if (!mailTransporter) {
        console.warn('⚠️ SMTP not ready, skipping mail');
      } else {
        console.log('📤 Sending order confirmation email to:', user.email);

        const trackingSection = order.shiprocketAwb
          ? `
            <div style="margin: 20px 0; padding: 15px; background-color: #dcfce7; border-left: 4px solid #16a34a; border-radius: 4px;">
              <h3 style="margin: 0 0 10px 0; color: #15803d; font-size: 16px;">✅ Shipment Ready for Pickup</h3>
              <p style="margin: 5px 0; font-size: 14px;"><strong>Tracking Number (AWB):</strong> <span style="font-family: monospace; font-weight: bold; color: #1f2937;">${order.shiprocketAwb}</span></p>
              <p style="margin: 10px 0 0 0; font-size: 14px;">
                <a href="${order.shiprocketTrackingUrl}" 
                   style="display: inline-block; padding: 10px 20px; background-color: #16a34a; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
                  📍 Track Your Shipment
                </a>
              </p>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #166534;">
                You can track your shipment status, delivery updates, and current location using the AWB number above.
              </p>
            </div>
          `
          : order.shipmentStatus === 'awaiting_awb'
          ? `
            <div style="margin: 20px 0; padding: 15px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
              <h3 style="margin: 0 0 10px 0; color: #92400e;">⏳ Shipment Processing</h3>
              <p style="margin: 5px 0; font-size: 14px;">Your order is being prepared. AWB tracking number will be sent to you shortly.</p>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #78350f;">
                Check back in a few hours or we'll send you an update email with the tracking number.
              </p>
            </div>
          `
          : `
            <div style="margin: 20px 0; padding: 15px; background-color: #f3f4f6; border-left: 4px solid #9ca3af; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Your shipment will be processed soon. Tracking details will be sent via email.</p>
            </div>
          `;

        const info = await mailTransporter.sendMail({
          from: FROM_EMAIL,
          to: user.email,
          subject: order.shiprocketAwb 
            ? `🚚 Your Tricher Order #${order._id.toString().slice(-6)} is Ready to Ship!`
            : `🎉 Order Confirmed - Tricher #${order._id.toString().slice(-6)}`,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #374151;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; color: white;">
                <h1 style="margin: 0; font-size: 28px;">🎉 Order Confirmed!</h1>
              </div>
              
              <div style="padding: 30px; background-color: white;">
                <p style="margin: 0 0 20px 0; font-size: 16px;">Hi <strong>${user.name || 'Customer'}</strong>,</p>
                <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6;">Your order has been successfully ${order.shiprocketAwb ? 'confirmed and is ready for shipment!' : 'confirmed! We are preparing it for dispatch.'}</p>
                
                <div style="margin: 20px 0; padding: 15px; background-color: #f9fafb; border-radius: 6px; border-left: 4px solid #667eea;">
                  <h3 style="margin: 0 0 12px 0; color: #374151; font-size: 14px;">📋 Order Details</h3>
                  <table style="width: 100%; font-size: 14px;">
                    <tr>
                      <td style="padding: 5px 0;"><strong>Order ID:</strong></td>
                      <td style="padding: 5px 0; text-align: right; font-family: monospace; color: #667eea;"><strong>#${order._id.toString().slice(-8)}</strong></td>
                    </tr>
                    <tr>
                      <td style="padding: 5px 0;"><strong>Product:</strong></td>
                      <td style="padding: 5px 0; text-align: right;">${order.plan?.description || 'Tricher Product'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 5px 0;"><strong>Amount Paid:</strong></td>
                      <td style="padding: 5px 0; text-align: right;"><strong style="color: #059669;">₹${order.finalAmount}</strong></td>
                    </tr>
                    <tr>
                      <td style="padding: 5px 0;"><strong>Payment Method:</strong></td>
                      <td style="padding: 5px 0; text-align: right;">${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Prepaid'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 5px 0;"><strong>Order Date:</strong></td>
                      <td style="padding: 5px 0; text-align: right;">${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    </tr>
                  </table>
                </div>

                ${trackingSection}

                <div style="margin: 20px 0; padding: 15px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px;">
                  <h3 style="margin: 0 0 8px 0; color: #92400e; font-size: 14px;">📍 Delivery Address</h3>
                  <p style="margin: 0; font-size: 13px; line-height: 1.6;">
                    ${user.address || 'N/A'}<br/>
                    ${user.city || ''} ${user.pincode || ''}
                  </p>
                </div>

                <div style="margin: 20px 0; padding: 15px; background-color: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 6px;">
                  <h3 style="margin: 0 0 8px 0; color: #1e40af; font-size: 14px;">❓ What's Next?</h3>
                  <ul style="margin: 0; padding-left: 20px; font-size: 13px;">
                    <li style="margin: 5px 0;">Courier will pick up your order within 24 hours</li>
                    <li style="margin: 5px 0;">You'll receive real-time delivery updates</li>
                    <li style="margin: 5px 0;">Expected delivery: 3-5 business days (may vary)</li>
                  </ul>
                </div>
              </div>

              <div style="padding: 20px; background-color: #f3f4f6; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #6b7280;">
                <p style="margin: 0 0 10px 0;">If you have any questions, feel free to contact our support team.</p>
                <p style="margin: 0; border-top: 1px solid #d1d5db; padding-top: 10px;">
                  © ${new Date().getFullYear()} Tricher. All rights reserved.
                </p>
              </div>
            </div>
          `,
        });

        console.log('✅ EMAIL SENT:', info.messageId);
      }
    } catch (mailErr) {
      console.error('❌ EMAIL ERROR:', mailErr);
    }

    res.json({ 
      ok: true,
      trackingInfo: shiprocketShipment?.success && order.shiprocketAwb ? {
        awb: order.shiprocketAwb,
        trackingUrl: order.shiprocketTrackingUrl,
      } : null,
    });
  } catch (err) {
    console.error('❌ VERIFY PAYMENT ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   CONFIRM COD ORDER
========================= */
router.post('/confirm-cod-order', async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID required' });
    }

    const order = await Order.findById(orderId).populate('user').populate('plan');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.paymentMethod !== 'cod') {
      return res.status(400).json({ error: 'This endpoint is only for COD orders' });
    }

    // Update order status
    order.status = 'active';
    await order.save();

    console.log('📦 COD ORDER CONFIRMED:', order._id);

    // Apply coupon if present
    if (order.couponCode) {
      await CouponUsage.create({
        coupon_code: order.couponCode,
        user_id: order.user,
        order_id: order._id,
        amount: order.finalAmount
      });

      await Coupon.findOneAndUpdate(
        { code: order.couponCode },
        { $inc: { used_count: 1 } }
      );
    }

    // Create Shiprocket Shipment for COD
    let shiprocketShipment = null;
    try {
      const user = await User.findById(order.user);
      console.log('🔍 COD: ShipRocket check for order:', order._id);
      console.log('   User pincode:', user?.pincode);
      console.log('   User address:', user?.address);
      console.log('   User city:', user?.city);
      
      if (user && user.pincode && user.address) {
        console.log('📦 Creating Shiprocket COD shipment for order:', order._id);
        
        const shipmentData = {
          name: user.name || 'Customer',
          email: user.email,
          phone: user.mobile || '9999999999',
          address: user.address,
          city: user.city || 'Unknown',
          state: user.state || 'Unknown',
          pincode: user.pincode,
          orderAmount: order.finalAmount,
          paymentMode: 'COD',
          productName: `Tricher ${order.plan?.name || 'Product'}`,
          quantity: 1,
          weight: 0.5,
          orderId: order._id.toString(),
        };

        shiprocketShipment = await shiprocket.createShipment(shipmentData);

        if (shiprocketShipment.success) {
          // Assign courier to shipment
          const courierAssignment = await shiprocket.assignCourier(shiprocketShipment.shipmentId);
          
          if (courierAssignment.success) {
            order.shiprocketOrderId = shiprocketShipment.orderId;
            order.shiprocketShipmentId = shiprocketShipment.shipmentId;
            order.shiprocketAwb = courierAssignment.awb;
            order.shiprocketTrackingUrl = courierAssignment.trackingUrl;
            order.shipmentStatus = 'shipped';
            
            // Generate label and pickup
            await Promise.all([
              shiprocket.generateLabel(shiprocketShipment.shipmentId),
              shiprocket.generatePickup(shiprocketShipment.shipmentId),
            ]);
          }
          
          await order.save();
          console.log('✅ Shiprocket COD shipment created with AWB:', courierAssignment?.awb || 'pending');
        }
      }
    } catch (shiprocketErr) {
      console.error('❌ SHIPROCKET SHIPMENT ERROR:', shiprocketErr);
    }

    // Send confirmation email
    try {
      const user = await User.findById(order.user);

      if (user?.email && mailTransporter) {
        console.log('📤 Sending COD order confirmation email to:', user.email);

        const trackingSection = order.shiprocketAwb
          ? `
            <div style="margin: 20px 0; padding: 15px; background-color: #dcfce7; border-left: 4px solid #16a34a; border-radius: 4px;">
              <h3 style="margin: 0 0 10px 0; color: #15803d; font-size: 16px;">✅ Shipment Ready for Pickup</h3>
              <p style="margin: 5px 0; font-size: 14px;"><strong>Tracking Number (AWB):</strong> <span style="font-family: monospace; font-weight: bold; color: #1f2937;">${order.shiprocketAwb}</span></p>
              <p style="margin: 10px 0 0 0; font-size: 14px;">
                <a href="${order.shiprocketTrackingUrl}" 
                   style="display: inline-block; padding: 10px 20px; background-color: #16a34a; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
                  📍 Track Your Shipment
                </a>
              </p>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #166534;">
                You can track your shipment status, delivery updates, and current location using the AWB number above.
              </p>
            </div>
          `
          : order.shipmentStatus === 'awaiting_awb'
          ? `
            <div style="margin: 20px 0; padding: 15px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
              <h3 style="margin: 0 0 10px 0; color: #92400e;">⏳ Shipment Processing</h3>
              <p style="margin: 5px 0; font-size: 14px;">Your order is being prepared. AWB tracking number will be sent to you shortly.</p>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #78350f;">
                Check back in a few hours or we'll send you an update email with the tracking number.
              </p>
            </div>
          `
          : `
            <div style="margin: 20px 0; padding: 15px; background-color: #f3f4f6; border-left: 4px solid #9ca3af; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Your shipment will be processed soon. Tracking details will be sent via email.</p>
            </div>
          `;

        await mailTransporter.sendMail({
          from: FROM_EMAIL,
          to: user.email,
          subject: `🚚 COD Order Confirmed #${order._id.toString().slice(-6)}`,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #374151;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; color: white;">
                <h1 style="margin: 0; font-size: 28px;">✅ COD Order Placed!</h1>
              </div>
              
              <div style="padding: 30px; background-color: white;">
                <p style="margin: 0 0 20px 0; font-size: 16px;">Hi <strong>${user.name || 'Customer'}</strong>,</p>
                <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6;">Your Cash on Delivery order has been confirmed and is ready for shipment!</p>
                
                <div style="margin: 20px 0; padding: 15px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px;">
                  <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 14px;">💰 Payment on Delivery</h3>
                  <p style="margin: 0; font-size: 14px;"><strong style="font-size: 18px; color: #78350f;">₹${order.finalAmount}</strong></p>
                  <p style="margin: 5px 0 0 0; font-size: 12px; color: #78350f;">
                    Please keep the exact amount ready for the delivery person.
                  </p>
                </div>

                <div style="margin: 20px 0; padding: 15px; background-color: #f9fafb; border-radius: 6px; border-left: 4px solid #667eea;">
                  <h3 style="margin: 0 0 12px 0; color: #374151; font-size: 14px;">📋 Order Details</h3>
                  <table style="width: 100%; font-size: 14px;">
                    <tr>
                      <td style="padding: 5px 0;"><strong>Order ID:</strong></td>
                      <td style="padding: 5px 0; text-align: right; font-family: monospace; color: #667eea;"><strong>#${order._id.toString().slice(-8)}</strong></td>
                    </tr>
                    <tr>
                      <td style="padding: 5px 0;"><strong>Product:</strong></td>
                      <td style="padding: 5px 0; text-align: right;">${order.plan?.description || 'Tricher Product'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 5px 0;"><strong>Payment Method:</strong></td>
                      <td style="padding: 5px 0; text-align: right;">Cash on Delivery</td>
                    </tr>
                    <tr>
                      <td style="padding: 5px 0;"><strong>Order Date:</strong></td>
                      <td style="padding: 5px 0; text-align: right;">${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    </tr>
                  </table>
                </div>

                ${trackingSection}

                <div style="margin: 20px 0; padding: 15px; background-color: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 6px;">
                  <h3 style="margin: 0 0 8px 0; color: #1e40af; font-size: 14px;">❓ What's Next?</h3>
                  <ul style="margin: 0; padding-left: 20px; font-size: 13px;">
                    <li style="margin: 5px 0;">Courier will pick up your order within 24 hours</li>
                    <li style="margin: 5px 0;">You'll receive real-time delivery updates</li>
                    <li style="margin: 5px 0;">Expected delivery: 3-5 business days</li>
                    <li style="margin: 5px 0;">Keep the exact amount ready for payment</li>
                  </ul>
                </div>

                <div style="margin: 20px 0; padding: 15px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px;">
                  <h3 style="margin: 0 0 8px 0; color: #92400e; font-size: 14px;">📍 Delivery Address</h3>
                  <p style="margin: 0; font-size: 13px; line-height: 1.6;">
                    ${user.address || 'N/A'}<br/>
                    ${user.city || ''} ${user.pincode || ''}
                  </p>
                </div>
              </div>

              <div style="padding: 20px; background-color: #f3f4f6; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #6b7280;">
                <p style="margin: 0 0 10px 0;">If you have any questions, feel free to contact our support team.</p>
                <p style="margin: 0; border-top: 1px solid #d1d5db; padding-top: 10px;">
                  © ${new Date().getFullYear()} Tricher. All rights reserved.
                </p>
              </div>
            </div>
          `,
        });

        console.log('✅ COD confirmation email sent');
      }
    } catch (mailErr) {
      console.error('❌ EMAIL ERROR:', mailErr);
    }

    res.json({ 
      ok: true,
      trackingInfo: shiprocketShipment?.success && order.shiprocketAwb ? {
        awb: order.shiprocketAwb,
        trackingUrl: order.shiprocketTrackingUrl,
      } : null,
    });
  } catch (err) {
    console.error('❌ CONFIRM COD ORDER ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   TEST EMAIL ENDPOINT
========================= */
router.get('/test-email', async (req, res) => {
  try {
    if (!mailTransporter) {
      return res.status(500).json({ error: 'SMTP not configured' });
    }

    const info = await mailTransporter.sendMail({
      from: FROM_EMAIL,
      to: 'psaisuryacharan@gmail.com', // CHANGE THIS
      subject: '✅ Tricher SES Test',
      text: 'If you received this, AWS SES + Nodemailer is working.',
    });

    console.log('✅ TEST EMAIL SENT:', info.messageId);

    res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error('❌ TEST EMAIL FAILED:', err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   GET ORDER TRACKING INFO
========================= */
router.get('/track-order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('user').populate('plan');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // If order has Shiprocket tracking, fetch latest status
    let trackingData = null;
    if (order.shiprocketAwb) {
      try {
        trackingData = await shiprocket.trackShipment(order.shiprocketAwb);
      } catch (trackErr) {
        console.error('❌ Tracking fetch error:', trackErr);
      }
    }

    res.json({
      orderId: order._id,
      status: order.status,
      shipmentStatus: order.shipmentStatus,
      amount: order.finalAmount,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      tracking: {
        awb: order.shiprocketAwb,
        trackingUrl: order.shiprocketTrackingUrl,
        liveStatus: trackingData?.data || null,
      },
      plan: {
        name: order.plan?.name,
        description: order.plan?.description,
      },
    });
  } catch (err) {
    console.error('❌ TRACK ORDER ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   RESEND TRACKING EMAIL (when AWB is assigned later)
========================= */
router.post('/resend-tracking-email/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('user').populate('plan');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (!order.shiprocketAwb) {
      return res.status(400).json({ error: 'No AWB assigned yet. Tracking not available.' });
    }

    const user = await User.findById(order.user);

    if (!user?.email) {
      return res.status(400).json({ error: 'User email not found' });
    }

    if (!mailTransporter) {
      return res.status(500).json({ error: 'Email service not configured' });
    }

    // Send tracking email
    const info = await mailTransporter.sendMail({
      from: FROM_EMAIL,
      to: user.email,
      subject: `🚚 Your Tricher Order Tracking Details #${order._id.toString().slice(-6)}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #374151;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; color: white;">
            <h1 style="margin: 0; font-size: 28px;">📦 Shipment Assigned!</h1>
          </div>
          
          <div style="padding: 30px; background-color: white;">
            <p style="margin: 0 0 20px 0; font-size: 16px;">Hi <strong>${user.name || 'Customer'}</strong>,</p>
            <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6;">Great news! Your shipment has been assigned a courier and is ready for pickup!</p>
            
            <div style="margin: 20px 0; padding: 15px; background-color: #dcfce7; border-left: 4px solid #16a34a; border-radius: 4px;">
              <h3 style="margin: 0 0 10px 0; color: #15803d; font-size: 16px;">✅ Shipment Ready</h3>
              <p style="margin: 5px 0; font-size: 14px;"><strong>Order ID:</strong> <span style="font-family: monospace; color: #667eea;">#${order._id.toString().slice(-8)}</span></p>
              <p style="margin: 5px 0; font-size: 14px;"><strong>Tracking Number (AWB):</strong> <span style="font-family: monospace; font-weight: bold; font-size: 16px; color: #1f2937;">${order.shiprocketAwb}</span></p>
            </div>

            <div style="margin: 20px 0; padding: 15px; background-color: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 4px;">
              <p style="margin: 0;">
                <a href="${order.shiprocketTrackingUrl}" 
                   style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px;">
                  📍 Track Your Shipment Live
                </a>
              </p>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #1e40af;">
                Click the link above to track your shipment in real-time. You'll see updates for pickup, in-transit, and delivery.
              </p>
            </div>

            <div style="margin: 20px 0; padding: 15px; background-color: #f9fafb; border-radius: 6px; border-left: 4px solid #667eea;">
              <h3 style="margin: 0 0 12px 0; color: #374151; font-size: 14px;">📦 Delivery Details</h3>
              <table style="width: 100%; font-size: 13px;">
                <tr>
                  <td style="padding: 5px 0;"><strong>Recipient:</strong></td>
                  <td style="padding: 5px 0; text-align: right;">${user.name || 'Customer'}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;"><strong>Address:</strong></td>
                  <td style="padding: 5px 0; text-align: right; word-break: break-word;">${user.address || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;"><strong>City/Pincode:</strong></td>
                  <td style="padding: 5px 0; text-align: right;">${user.city || ''} ${user.pincode || ''}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;"><strong>Expected Delivery:</strong></td>
                  <td style="padding: 5px 0; text-align: right;">3-5 business days</td>
                </tr>
              </table>
            </div>

            <div style="margin: 20px 0; padding: 15px; background-color: #f3f4f6; border-radius: 4px;">
              <p style="margin: 0; font-size: 12px; color: #6b7280;">
                <strong>Pro Tip:</strong> Bookmark this email or save the AWB number for quick reference. You can also track your shipment using just the AWB number on the carrier's website.
              </p>
            </div>
          </div>

          <div style="padding: 20px; background-color: #f3f4f6; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #6b7280;">
            <p style="margin: 0 0 10px 0;">For support, reply to this email or contact us at support@tricher.app</p>
            <p style="margin: 0; border-top: 1px solid #d1d5db; padding-top: 10px;">
              © ${new Date().getFullYear()} Tricher. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });

    console.log('✅ TRACKING EMAIL RESENT:', info.messageId);

    res.json({
      ok: true,
      message: 'Tracking email sent successfully',
      awb: order.shiprocketAwb,
      trackingUrl: order.shiprocketTrackingUrl,
    });
  } catch (err) {
    console.error('❌ RESEND TRACKING EMAIL ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

/* =========================
   OTP SERVICE
   - POST /send-otp { email }
   - POST /verify-otp { email, otp }
   Note: simple in-memory store with expiry for demo purposes.
========================= */


const otpStore = new Map(); // email -> { code, expiresAt }

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    // Check if user exists in database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Email not registered with Tricher. Please use the email you used to purchase your glasses.' });
    }

    const code = generateOtp();

    // Store with 5 minute expiry
    const expiresAt = Date.now() + 5 * 60 * 1000;
    otpStore.set(email, { code, expiresAt });

    // schedule removal
    setTimeout(() => {
      const entry = otpStore.get(email);
      if (entry && entry.expiresAt <= Date.now()) otpStore.delete(email);
    }, 5 * 60 * 1000 + 1000);

    // send mail if transporter available
    if (!mailTransporter) {
      console.warn('SMTP not configured, OTP will not be emailed. OTP:', code);
    } else {
      try {
        await mailTransporter.sendMail({
          from: FROM_EMAIL,
          to: email,
          subject: 'Your Tricher OTP',
          text: `Your OTP is ${code}. It will expire in 5 minutes.`,
        });
      } catch (mailErr) {
        console.error('OTP EMAIL ERROR:', mailErr);
      }
    }

    // Determine user status
    let userType = 'new';
    // find latest order for user
    const latestOrder = await Order.findOne({ user: user._id }).sort({ createdAt: -1 });
    if (latestOrder) {
      if (latestOrder.status === 'active') userType = 'active';
      else userType = 'expired';
    } else {
      userType = 'new';
    }

    res.json({ ok: true, userType });
  } catch (err) {
    console.error('SEND OTP ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP required' });

    const entry = otpStore.get(email);
    if (!entry) return res.status(400).json({ error: 'OTP expired or not sent' });
    if (entry.code !== otp) return res.status(400).json({ error: 'Invalid OTP' });

    // OTP valid; remove it
    otpStore.delete(email);

    // Determine user status as above
    const user = await User.findOne({ email });
    let userType = 'new';
    if (user) {
      const latestOrder = await Order.findOne({ user: user._id }).sort({ createdAt: -1 });
      if (latestOrder) {
        if (latestOrder.status === 'active') userType = 'active';
        else userType = 'expired';
      } else {
        userType = 'new';
      }
    }

    res.json({
      ok: true,
      userType,
      session: {
        isLoggedIn: !!user?.isLoggedIn,
        activeDeviceId: user?.activeDeviceId || null,
        activeSessionId: user?.activeSessionId || null,
      },
    });
  } catch (err) {
    console.error('VERIFY OTP ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   LOGIN/LOGOUT SESSION (SINGLE DEVICE)
   - POST /login-session { email, deviceId }
   - POST /logout-session { email, deviceId }
========================= */

router.post('/login-session', async (req, res) => {
  try {
    const { email, deviceId } = req.body;
    if (!email || !deviceId) {
      return res.status(400).json({ error: 'Email and deviceId are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isLoggedIn && user.activeDeviceId && user.activeDeviceId !== deviceId) {
      return res.status(409).json({
        error: 'Account already in use on another device',
        activeDeviceId: user.activeDeviceId,
      });
    }

    if (!user.activeSessionId) {
      user.activeSessionId = `sess_${crypto.randomBytes(12).toString('hex')}`;
    }

    user.isLoggedIn = true;
    user.activeDeviceId = deviceId;
    user.lastLoginAt = new Date();
    await user.save();

    res.json({
      ok: true,
      session: {
        activeSessionId: user.activeSessionId,
        activeDeviceId: user.activeDeviceId,
        isLoggedIn: user.isLoggedIn,
      },
    });
  } catch (err) {
    console.error('LOGIN SESSION ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/logout-session', async (req, res) => {
  try {
    const { email, deviceId } = req.body;
    if (!email || !deviceId) {
      return res.status(400).json({ error: 'Email and deviceId are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isLoggedIn && user.activeDeviceId && user.activeDeviceId !== deviceId) {
      return res.status(409).json({
        error: 'Cannot logout: session belongs to another device',
        activeDeviceId: user.activeDeviceId,
      });
    }

    user.isLoggedIn = false;
    user.activeDeviceId = null;
    user.activeSessionId = null;
    user.lastLogoutAt = new Date();
    await user.save();

    res.json({ ok: true, message: 'Logged out' });
  } catch (err) {
    console.error('LOGOUT SESSION ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});
/* =========================
   DEBUG: Test Shiprocket API
========================= */
router.get('/shiprocket-debug', async (req, res) => {
  try {
    if (!process.env.SHIPROCKET_EMAIL || !process.env.SHIPROCKET_PASSWORD) {
      return res.status(400).json({
        error: 'Shiprocket credentials not configured',
        required: ['SHIPROCKET_EMAIL', 'SHIPROCKET_PASSWORD'],
      });
    }

    // Test authentication
    console.log('🔍 TEST 1: Testing Shiprocket authentication...');
    const token = await shiprocket.getAuthToken();

    // Test pincode serviceability
    console.log('🔍 TEST 2: Testing pincode serviceability for 530043...');
    const serviceabilityTest = await shiprocket.checkPincodeServiceability('530043');

    res.json({
      status: 'debug',
      config: {
        email: process.env.SHIPROCKET_EMAIL,
        pickupLocationId: process.env.SHIPROCKET_PICKUP_LOCATION_ID || 'Not Set',
        tokenGenerated: !!token,
      },
      tests: {
        authentication: {
          status: 'success',
          message: 'Connected to Shiprocket API',
        },
        serviceability: serviceabilityTest,
      },
    });
  } catch (error) {
    console.error('❌ Debug Error:', error.message);
    res.status(500).json({
      error: error.message,
      details: error.response?.data,
    });
  }
});

module.exports = router;