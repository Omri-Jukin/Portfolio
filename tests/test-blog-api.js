// Test script for the blog publish API
// Run this after deployment to test the endpoint

const API_KEY = 'd82276c37b7dc2425a914cb0a96e447942465e0d3e7bf45c51188b16e716097579423e81a7497c78dbec4ba45c303cff084b20bb4c163e82db91a7c6919136e5';

const testPost = {
  title: "Test Post from iPhone Shortcut",
  content: "This is a test post created via the API endpoint. It supports **markdown** formatting and should appear on your blog immediately.",
  excerpt: "A test post to verify the API is working correctly.",
  tags: ["test", "api", "shortcut"],
  imageUrl: null,
  imageAlt: null
};

async function testAPI() {
  try {
    console.log('Testing API with key:', API_KEY);
    const response = await fetch('http://localhost:3000/api/blog/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify(testPost)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ API Test Successful!');
      console.log('Response:', result);
    } else {
      console.log('❌ API Test Failed!');
      console.log('Status:', response.status);
      console.log('Error:', result);
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
  }
}

// Uncomment to run the test
// testAPI(); 