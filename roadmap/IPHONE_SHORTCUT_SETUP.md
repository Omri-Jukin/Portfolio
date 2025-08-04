# 📱 iPhone Shortcut Setup for Blog Publishing

## 🎯 Overview
This guide will help you create an iPhone shortcut that allows you to quickly publish blog posts to your portfolio website from anywhere.

## 🔑 API Configuration

### API Key
Your secure API key has been generated and is available in `backend/config/env.example`:
```
BLOG_API_KEY=d82276c37b7dc2425a914cb0a96e447942465e0d3e7bf45c51188b16e716097579423e81a7497c78dbec4ba45c303cff084b20bb4c163e82db91a7c6919136e5
```

**⚠️ Important**: Copy this key to your `.env` file and keep it secure!

### API Endpoint
- **URL**: `https://yourdomain.com/api/blog/publish`
- **Method**: `POST`
- **Authentication**: API Key in header

## 📱 iPhone Shortcut Setup

### Step 1: Create New Shortcut
1. Open **Shortcuts** app on your iPhone
2. Tap **+** to create a new shortcut
3. Name it "Publish Blog Post"

### Step 2: Add Actions

#### Action 1: Ask for Input
- Add **"Ask for Input"** action
- Set **Prompt** to "Blog Post Title"
- Set **Default Answer** to empty

#### Action 2: Ask for Input (Content)
- Add another **"Ask for Input"** action
- Set **Prompt** to "Blog Post Content"
- Set **Default Answer** to empty
- Enable **"Allow Multiple Lines"**

#### Action 3: Ask for Input (Excerpt)
- Add another **"Ask for Input"** action
- Set **Prompt** to "Blog Post Excerpt (optional)"
- Set **Default Answer** to empty

#### Action 4: Ask for Input (Tags)
- Add another **"Ask for Input"** action
- Set **Prompt** to "Tags (comma separated)"
- Set **Default Answer** to empty

#### Action 5: Get URL Contents
- Add **"Get URL Contents"** action
- Set **URL** to your API endpoint
- Set **Method** to **POST**
- Add **Request Headers**:
  - `Content-Type`: `application/json`
  - `x-api-key`: `d82276c37b7dc2425a914cb0a96e447942465e0d3e7bf45c51188b16e716097579423e81a7497c78dbec4ba45c303cff084b20bb4c163e82db91a7c6919136e5`

#### Action 6: Set Request Body
- In the **Get URL Contents** action, set **Request Body** to:
```json
{
  "title": "Shortcut Input",
  "content": "Shortcut Input 2",
  "excerpt": "Shortcut Input 3",
  "tags": "Shortcut Input 4"
}
```

#### Action 7: Show Result
- Add **"Show Result"** action
- Set **Input** to **"URL Contents"**

### Step 3: Advanced Setup (Optional)

#### For Better Tag Handling
Add a **"Text"** action before the API call to format tags:
- **Text**: `Split Text` with **"Shortcut Input 4"** by **","**
- **Replace Text** to clean up spaces

#### For Image Support
Add **"Select Photos"** action and upload to your image service first, then include the URL in the API call.

## 🔧 API Request Structure

### Required Fields
```json
{
  "title": "Your blog post title",
  "content": "Your blog post content (supports markdown)"
}
```

### Optional Fields
```json
{
  "excerpt": "Brief summary of the post",
  "tags": ["tag1", "tag2", "tag3"],
  "imageUrl": "https://example.com/image.jpg",
  "imageAlt": "Image description for accessibility"
}
```

### Response Format
```json
{
  "success": true,
  "post": {
    "id": "post-id",
    "title": "Post Title",
    "slug": "post-title",
    "status": "published",
    "publishedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Blog post published successfully!"
}
```

## 🚀 Testing

### Local Testing
1. Start your development server: `npm run dev`
2. Run the test script: `node test-blog-api.js`

### Production Testing
1. Deploy your site
2. Test the shortcut with a simple post
3. Check your blog to confirm the post appears

## 🔒 Security Notes

- **Keep your API key secure** - don't share it publicly
- **Consider rate limiting** - the API currently has no rate limits
- **Monitor usage** - check your logs for unusual activity
- **Rotate keys** - change the API key periodically

## 🎨 Content Tips

### Markdown Support
Your blog posts support markdown formatting:
- **Bold**: `**text**`
- *Italic*: `*text*`
- `Code`: `` `code` ``
- [Links](url): `[text](url)`
- Lists: `- item` or `1. item`

### Best Practices
- Write engaging titles
- Include excerpts for better SEO
- Use relevant tags
- Keep content concise for mobile writing

## 🆘 Troubleshooting

### Common Issues
1. **401 Unauthorized**: Check your API key
2. **400 Bad Request**: Ensure title and content are provided
3. **500 Server Error**: Check server logs

### Debug Steps
1. Test the API endpoint directly
2. Verify your domain is correct
3. Check network connectivity
4. Ensure the API key is copied correctly

## 📞 Support
If you encounter issues, check:
1. Server logs in Cloudflare dashboard
2. API endpoint status
3. Database connectivity
4. Environment variables configuration 