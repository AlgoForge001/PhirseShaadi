const axios = require('axios');

async function testLogin() {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      identifier: 'shaadi@gmail.com',
      password: 'phirseshaadi'
    });
    console.log('Response:', response.data);
  } catch (error) {
    if (error.response) {
      console.log('Error Response:', error.response.status, error.response.data);
    } else {
      console.log('Error Message:', error.message);
    }
  }
}

testLogin();
