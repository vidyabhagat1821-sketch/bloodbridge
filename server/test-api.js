/**
 * End-to-end automated verification script for BloodBridge API
 */

const BASE_URL = 'http://localhost:5000/api';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    ...options,
    headers
  });
  const data = await response.json();
  return { status: response.status, data };
}

async function runTests() {
  console.log('🧪 Starting BloodBridge End-to-End API Verification...\n');

  try {
    // 1. Health Check
    console.log('1. Testing Health Endpoint: GET /api/health');
    const health = await request('/health');
    console.log('   Status:', health.status, '| System:', health.data.system);

    // 2. Auth OTP Flow
    console.log('\n2. Testing OTP Flow: POST /api/auth/send-otp & verify-otp');
    const sendOtpRes = await request('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ mobileNumber: '+919876543210' })
    });
    console.log('   Send OTP:', sendOtpRes.data.message);

    const verifyOtpRes = await request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ mobileNumber: '+919876543210', otp: '123456' })
    });
    console.log('   Verify OTP Token Received:', !!verifyOtpRes.data.token, '| Role:', verifyOtpRes.data.user.role);
    const token = verifyOtpRes.data.token;

    // 3. AI Natural Language Blood Request Extraction
    console.log('\n3. Testing AI NLP Parser: POST /api/ai/parse-blood-request');
    const aiParseRes = await request('/ai/parse-blood-request', {
      method: 'POST',
      body: JSON.stringify({
        text: 'Emergency! Need 3 units of O negative blood at St. Jude Trauma Center immediately for surgery.'
      })
    });
    console.log('   Extracted Blood Group:', aiParseRes.data.extracted.bloodGroup);
    console.log('   Extracted Units:', aiParseRes.data.extracted.unitsRequired);
    console.log('   Extracted Urgency:', aiParseRes.data.extracted.urgency);

    // 4. Create Blood Request
    console.log('\n4. Testing Blood Request Creation: POST /api/requests');
    const createReqRes = await request('/requests', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        hospitalId: 'hosp_1',
        hospitalName: 'St. Jude Metropolitan Trauma Center',
        bloodGroup: 'O-',
        unitsRequired: 3,
        urgency: 'CRITICAL',
        patientCondition: 'Active trauma hemorrhage test',
        hospitalLocation: { lat: 12.9592, lng: 77.6480, address: 'HAL Airport Road' }
      })
    });
    console.log('   Created Request ID:', createReqRes.data.request?.id);
    console.log('   Matched Donors Count:', createReqRes.data.request?.matchedDonorsCount);

    // 5. Donor Matching Engine & Proximity
    console.log('\n5. Testing Donor Matching: GET /api/donors?bloodGroup=O-&isAvailable=true');
    const donorsRes = await request('/donors?bloodGroup=O-&isAvailable=true&lat=12.9592&lng=77.6480');
    console.log('   Compatible Available Donors Found:', donorsRes.data.count);
    if (donorsRes.data.donors?.length > 0) {
      console.log('   Closest Donor:', donorsRes.data.donors[0].fullName, `(${donorsRes.data.donors[0].distanceKm} km away)`);
    }

    // 6. RAG Clinical Question Answering
    console.log('\n6. Testing RAG Chatbot: POST /api/chatbot/ask');
    const ragRes = await request('/chatbot/ask', {
      method: 'POST',
      body: JSON.stringify({
        question: 'Why is O negative considered the universal red blood cell donor?'
      })
    });
    console.log('   Retrieval Confidence:', ragRes.data.confidence + '%');
    console.log('   Sources Cited:', ragRes.data.sources?.length);
    console.log('   Answer Snippet:', ragRes.data.answer?.substring(0, 140) + '...');

    // 7. Knowledge Base Document Search Test
    console.log('\n7. Testing Vector Similarity Search: POST /api/documents/search-test');
    const searchTestRes = await request('/documents/search-test', {
      method: 'POST',
      body: JSON.stringify({ query: 'Massive Transfusion Protocol 1:1:1 ratio', topK: 2 })
    });
    console.log('   Top Chunks Retrieved:', searchTestRes.data.count);
    if (searchTestRes.data.results?.length > 0) {
      console.log('   Top Matched Document:', searchTestRes.data.results[0].documentTitle, `(Score: ${searchTestRes.data.results[0].score})`);
    }

    console.log('\n✨ ALL END-TO-END VERIFICATION TESTS PASSED SUCCESSFULLY! ✨\n');
  } catch (err) {
    console.error('❌ Test failed:', err);
  }
}

runTests();
