const axios = require('axios');

const SR_BASE_URL = 'https://apiv2.shiprocket.in/v1/external';
const SR_TOKEN = process.env.SHIPROCKET_API_TOKEN; // Use static token from .env

/* =========================
   GET HEADERS WITH AUTH
========================= */
async function getHeaders() {
  if (!SR_TOKEN) {
    throw new Error('SHIPROCKET_API_TOKEN not configured in .env');
  }
  return {
    'Authorization': `Bearer ${SR_TOKEN}`,
    'Content-Type': 'application/json',
  };
}

/* =========================
   CHECK PINCODE SERVICEABILITY
========================= */
async function checkPincodeServiceability(pincode, weight = 0.5) {
  try {
    const headers = await getHeaders();
    const params = {
      pincode,
      cod: 1,
      weight,
    };

    const response = await axios.get(
      `${SR_BASE_URL}/courier/serviceability`,
      { headers, params }
    );

    const couriers = response.data.data?.available_couriers || [];
    
    return {
      serviceable: couriers.length > 0,
      cod: true,
      prepaid: couriers.some(c => c.prepaid),
      couriers: couriers.map(c => ({
        id: c.courier_id,
        name: c.courier_name,
        charges: c.rate,
        days: c.etd,
      })),
    };
  } catch (error) {
    console.error('❌ PINCODE SERVICEABILITY ERROR:', error.response?.data || error.message);
    // Default to serviceable if we can't check
    return {
      serviceable: true,
      cod: true,
      prepaid: true,
      couriers: [],
      error: 'Could not verify pincode',
    };
  }
}

/* =========================
   CREATE SHIPMENT/ORDER
========================= */
async function createShipment(orderData) {
  try {
    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      orderAmount,
      paymentMode = 'Prepaid', // 'COD' or 'Prepaid'
      productName,
      quantity = 1,
      weight = 0.3, // kg
      orderId,
    } = orderData;

    console.log('📦 Creating Shiprocket order for:', orderId);

    const headers = await getHeaders();

    const payload = {
      order_id: orderId, // Your reference order ID
      order_date: new Date().toISOString().split('T')[0],
      pickup_location_id: process.env.SHIPROCKET_PICKUP_LOCATION_ID,
      email,
      phone,
      customer_name: name,
      shipping_address: address,
      shipping_city: city,
      shipping_state: state,
      shipping_pincode: pincode,
      billing_address: address,
      billing_city: city,
      billing_state: state,
      billing_pincode: pincode,
      billing_country: 'India',
      billing_customer_name: name,
      billing_last_name: name.split(' ').slice(-1)[0] || name, // Use last word of name or full name
      billing_email: email,
      billing_phone: phone,
      shipping_is_billing: true,
      order_items: [
        {
          name: productName,
          sku: `TRICHER-${orderId}`,
          units: quantity,
          selling_price: orderAmount,
          discount: 0,
          tax: 0,
          hsn_code: '62099090', // HS code for clothing
        },
      ],
      payment_method: paymentMode === 'COD' ? 'cod' : 'prepaid',
      sub_total: orderAmount,
      length: 17,
      breadth: 6,
      height: 6,
      weight,
    };

    const response = await axios.post(
      `${SR_BASE_URL}/orders/create/adhoc`,
      payload,
      { headers }
    );

    if (response.data.order_id) {
      const data = response.data;
      console.log('✅ Shiprocket order created:', data.order_id);
      console.log('   Shipment ID:', data.shipment_id);
      console.log('   AWB:', data.awb_code || 'Pending');

      return {
        success: true,
        orderId: data.order_id,
        shipmentId: data.shipment_id,
        waybill: data.awb_code || null,
        trackingUrl: `https://track.shiprocket.in/${data.order_id}`,
        message: 'Order created successfully',
      };
    } else {
      console.error('❌ SHIPROCKET CREATE ORDER ERROR:', response.data.message);
      console.error('   Full response:', JSON.stringify(response.data, null, 2));
      return {
        success: false,
        error: response.data.message,
      };
    }
  } catch (error) {
    console.error('❌ SHIPROCKET CREATE SHIPMENT ERROR:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}

/* =========================
   ASSIGN COURIER & GET AWB
========================= */
async function assignCourier(shipmentId, courierId = null) {
  try {
    console.log('🎯 Assigning courier to shipment:', shipmentId);

    const headers = await getHeaders();

    const payload = {
      shipment_id: shipmentId,
    };

    // If courier ID is provided, assign specific courier
    if (courierId) {
      payload.courier_id = courierId;
    }

    const response = await axios.post(
      `${SR_BASE_URL}/courier/assign/awb`,
      payload,
      { headers }
    );

    if (response.data.success || response.data.awb_code) {
      const data = response.data.data || response.data;
      console.log('✅ Courier assigned, AWB:', data.awb_code);

      return {
        success: true,
        awb: data.awb_code,
        courierName: data.courier_name,
        courierCompanyId: data.courier_company_id,
        trackingUrl: `https://track.shiprocket.in/${data.awb_code}`,
        message: data.message || 'AWB assigned successfully',
      };
    } else {
      console.error('❌ ASSIGN COURIER ERROR:', response.data.message);
      return {
        success: false,
        error: response.data.message,
      };
    }
  } catch (error) {
    console.error('❌ SHIPROCKET ASSIGN COURIER ERROR:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}

/* =========================
   TRACK SHIPMENT
========================= */
async function trackShipment(awbCode) {
  try {
    const headers = await getHeaders();

    const response = await axios.get(
      `${SR_BASE_URL}/courier/track/awb/${awbCode}`,
      { headers }
    );

    if (response.data.success) {
      const tracking = response.data.data;
      return {
        success: true,
        awb: awbCode,
        status: tracking.shipment_status,
        currentLocation: tracking.current_location,
        events: tracking.scans || [],
        etd: tracking.etd,
      };
    } else {
      return {
        success: false,
        error: 'Tracking data not found',
      };
    }
  } catch (error) {
    console.error('❌ SHIPROCKET TRACK ERROR:', error.response?.data || error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

/* =========================
   GENERATE LABEL
========================= */
async function generateLabel(shipmentId) {
  try {
    console.log('🏷️ Generating label for shipment:', shipmentId);

    const headers = await getHeaders();

    const response = await axios.post(
      `${SR_BASE_URL}/courier/generate/label`,
      { shipment_id: shipmentId },
      { headers }
    );

    if (response.data.success) {
      const data = response.data.data;
      console.log('✅ Label generated');

      return {
        success: true,
        labelUrl: data.label_url,
        labelPdf: data.label_pdf,
      };
    } else {
      return {
        success: false,
        error: response.data.message,
      };
    }
  } catch (error) {
    console.error('❌ SHIPROCKET GENERATE LABEL ERROR:', error.response?.data || error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

/* =========================
   GENERATE PICKUP
========================= */
async function generatePickup(shipmentId) {
  try {
    console.log('📍 Generating pickup for shipment:', shipmentId);

    const headers = await getHeaders();

    const response = await axios.post(
      `${SR_BASE_URL}/courier/generate/pickup`,
      { shipment_id: shipmentId },
      { headers }
    );

    if (response.data.success) {
      console.log('✅ Pickup generated');
      return {
        success: true,
        message: 'Pickup scheduled successfully',
      };
    } else {
      console.warn('⚠️ PICKUP GENERATION WARNING:', response.data.message);
      return {
        success: false,
        error: response.data.message,
      };
    }
  } catch (error) {
    console.error('❌ SHIPROCKET GENERATE PICKUP ERROR:', error.response?.data || error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

module.exports = {
  checkPincodeServiceability,
  createShipment,
  assignCourier,
  trackShipment,
  generateLabel,
  generatePickup,
};
