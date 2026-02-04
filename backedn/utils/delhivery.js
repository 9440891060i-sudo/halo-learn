const axios = require('axios');

// Delhivery API Configuration
const API_KEY = process.env.DELHIVERY_API_KEY || '';
const DELHIVERY_BASE_URL = process.env.DELHIVERY_BASE_URL || 'https://track.delhivery.com/api';
const DELHIVERY_STAGING_URL = 'https://staging-express.delhivery.com/api';
const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

// Use staging for testing, production for live
const API_URL = process.env.DELHIVERY_ENV === 'production' ? DELHIVERY_BASE_URL : DELHIVERY_STAGING_URL;

// Log configuration on module load
console.log('📦 DELHIVERY CONFIG:', {
  API_KEY_SET: !!API_KEY,
  ENV: process.env.DELHIVERY_ENV || 'staging',
  API_URL: API_URL,
  CONFIGURED: !!API_KEY && !!process.env.RETURN_PINCODE,
});

/**
 * Check pincode serviceability
 * @param {string} pincode - Pincode to check
 * @returns {Promise<Object>} Serviceability data
 */
async function checkPincodeServiceability(pincode) {
  // Check if API key is configured
  if (!API_KEY) {
    console.warn('⚠️ Delhivery API key not configured');
    throw new Error('Delhivery API key not configured');
  }

  try {
    const apiUrl = `${API_URL}/pin-codes/json/`;
    
    console.log(`🔍 Checking pincode ${pincode}...`);
    
    const response = await axios.post(
      apiUrl,
      { filter_codes: [pincode] },
      {
        headers: {
          'Authorization': `Token ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Delhivery Pincode Response:', response.data);

    if (response.data?.data?.[pincode]) {
      const pinData = response.data.data[pincode];
      return {
        serviceable: pinData.status === 'Serviceable',
        cod: pinData.cod === 'Yes',
        prepaid: pinData.prepaid === 'Yes',
        message: `Pincode ${pincode} serviceable`
      };
    }

    return { serviceable: false };
  } catch (error) {
    console.error('❌ Delhivery Pincode Check Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });
    
    // Don't throw - return false so order can still proceed
    return { serviceable: false, cod: false, prepaid: false };
  }
}

/**
 * Create shipment order in Delhivery
 * @param {Object} orderData - Order details
 * @returns {Promise<Object>} Shipment creation response
 */
async function createShipment(orderData) {
  // Check if Delhivery is configured
  if (!API_KEY) {
    console.warn('⚠️ API_KEY not configured. Skipping shipment creation.');
    throw new Error('Delhivery API key not configured. Add DELHIVERY_API_KEY to .env file');
  }

  // Test mode - skip actual API call and return mock data
  if (process.env.DELHIVERY_SKIP_CREATION === 'true') {
    console.log('🧪 TEST MODE: Skipping Delhivery API call, returning mock tracking data');
    const mockWaybill = `TEST${Date.now().toString().slice(-10)}`;
    return {
      success: true,
      waybill: mockWaybill,
      orderId: orderData.orderId,
      trackingUrl: `https://www.delhivery.com/track/package/${mockWaybill}`,
      message: 'Test shipment created (mock data)',
    };
  }

  try {
    const {
      waybill, // Optional: if not provided, Delhivery will generate
      name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      orderAmount,
      paymentMode, // 'Prepaid' or 'COD'
      productName,
      quantity = 1,
      weight = 500, // in grams
      orderId,
    } = orderData;

    const shipmentData = {
      shipments: [
        {
          waybill: waybill || '', // Leave empty for auto-generation
          name: name,
          add: address,
          pin: pincode,
          city: city,
          state: state,
          country: 'India',
          phone: phone,
          order: orderId || `ORD${Date.now()}`,
          payment_mode: paymentMode,
          return_pin: process.env.RETURN_PINCODE || '110001', // Your warehouse pincode
          return_city: process.env.RETURN_CITY || 'Delhi',
          return_phone: process.env.RETURN_PHONE || '9876543210',
          return_add: process.env.RETURN_ADDRESS || 'Your Warehouse Address',
          return_state: process.env.RETURN_STATE || 'Delhi',
          return_country: 'India',
          products_desc: productName || 'Tricher AI Glasses',
          hsn_code: '90041000', // HSN code for spectacles/glasses
          cod_amount: paymentMode === 'COD' ? orderAmount : 0,
          order_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
          total_amount: orderAmount,
          seller_add: process.env.SELLER_ADDRESS || 'Your Business Address',
          seller_name: process.env.SELLER_NAME || 'Tricher',
          seller_inv: orderId || `INV${Date.now()}`,
          quantity: quantity,
          waybill: waybill || '',
          shipment_width: 20,
          shipment_height: 10,
          weight: weight, // in grams
          seller_gst_tin: process.env.SELLER_GST || '',
          shipping_mode: 'Surface',
          address_type: 'home',
        },
      ],
      pickup_location: {
        name: process.env.PICKUP_LOCATION_NAME || 'Warehouse',
      },
    };

    const response = await axios.post(
      `${API_URL}/cmu/create.json`,
      `format=json&data=${JSON.stringify(shipmentData)}`,
      {
        headers: {
          'Authorization': `Token ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('📦 Delhivery API Response:', JSON.stringify(response.data, null, 2));

    if (response.data.success) {
      const waybillNumber = response.data.waybill || response.data.packages?.[0]?.waybill;
      return {
        success: true,
        waybill: waybillNumber,
        orderId: response.data.rmk || orderId,
        trackingUrl: `https://www.delhivery.com/track/package/${waybillNumber}`,
        message: 'Shipment created successfully',
      };
    } else {
      console.error('❌ Delhivery Response Error:', response.data);
      throw new Error(response.data.remark || response.data.error || 'Failed to create shipment');
    }
  } catch (error) {
    console.error('❌ Delhivery Shipment Creation Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    
    const errorMessage = error.response?.data?.remark 
      || error.response?.data?.error 
      || error.response?.data?.message
      || error.message;
    
    throw new Error(`Delhivery Error: ${errorMessage}`);
  }
}

/**
 * Track shipment by waybill number
 * @param {string} waybill - Waybill/tracking number
 * @returns {Promise<Object>} Tracking information
 */
async function trackShipment(waybill) {
  try {
    const response = await axios.get(`${API_URL}/v1/packages/json/`, {
      headers: {
        'Authorization': `Token ${API_KEY}`,
      },
      params: {
        waybill: waybill,
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('❌ Delhivery Tracking Error:', error.response?.data || error.message);
    throw new Error('Failed to track shipment');
  }
}

module.exports = {
  checkPincodeServiceability,
  createShipment,
  trackShipment,
};
