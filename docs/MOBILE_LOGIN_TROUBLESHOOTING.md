# Mobile Login Troubleshooting Guide

## Problem

Login works on PC but fails on iPhone/iOS devices (Chrome or Safari).

## Important: Chrome vs Safari on iOS

**Key Difference:**

- **Safari**: Managed through iOS Settings app
- **Chrome**: Has its own separate cache/cookie storage - **must be cleared within Chrome app**

Both use WebKit engine, but Chrome on iOS:

- Has separate cookie storage
- Has its own privacy settings
- Needs to be cleared separately from Safari

## Common Causes & Solutions

### 1. Clear Chrome Cache & Cookies (iOS Chrome App) ⭐ START HERE IF USING CHROME

**Important:** This is different from Safari! Chrome has its own storage that won't be cleared by iOS Settings.

#### Steps to Clear Chrome on iPhone:

1. Open the **Chrome app** on your iPhone
2. Tap the **three dots (⋯)** in the bottom-right corner
3. Select **"Clear Browsing Data"** (or go to Settings → Privacy and Security → Clear Browsing Data)
4. Select:
   - ✅ **Cookies, Site Data**
   - ✅ **Cached Images and Files**
5. Choose time range: **"All Time"**
6. Tap **"Clear Browsing Data"**
7. **Close Chrome completely** (swipe up and close the app)
8. Reopen Chrome
9. Try logging in again

**Quick Path:** Chrome app → Three dots (⋯) → Clear Browsing Data → Select options → Clear

### 2. iOS Safari Privacy Settings

iOS Safari has strict privacy settings that can block OAuth cookies:

#### Fix: Disable Cross-Site Tracking Prevention

1. Go to **Settings** > **Safari**
2. Under **Privacy & Security**, toggle off **Prevent Cross-Site Tracking**
3. Try logging in again

**Why:** OAuth flow requires cookies to be shared between your domain and Google's OAuth domain. This setting blocks that.

#### Fix: Allow Cookies

1. Go to **Settings** > **Safari**
2. Under **Privacy & Security**, ensure **Block All Cookies** is turned **OFF**
3. Try logging in again

### 3. Clear Safari Cache & Cookies

**Note:** This only affects Safari, not Chrome. If using Chrome, follow Step 1 above.

Cached authentication data might be corrupted:

1. Go to **Settings** > **Safari**
2. Tap **Clear History and Website Data**
3. Confirm
4. Try logging in again

### 4. Disable Content Blockers (Chrome)

Chrome on iOS can have extensions that block cookies:

1. In Chrome app, tap **three dots (⋯)**
2. Go to **Settings** > **Privacy and Security**
3. Check **"Allow All Cookies"** is enabled
4. If you have extensions, disable them temporarily
5. Try logging in again

### 5. Disable Content Blockers (Safari)

Ad blockers or content blockers can interfere with OAuth:

1. Go to **Settings** > **Safari** > **Extensions**
2. Disable any active content blockers
3. Try logging in again

### 6. Check Network Connection

Sometimes network issues can cause OAuth redirects to fail:

1. Try switching between Wi-Fi and Cellular data
2. Try a different network
3. Ensure you have a stable internet connection

### 7. Try a Different Browser

Test if it's Safari-specific:

1. Download **Chrome** or **Firefox** from the App Store
2. Try logging in through the alternative browser
3. If it works, the issue is Safari-specific

### 8. Update Chrome App

Make sure Chrome is up to date:

1. Open **App Store**
2. Search for **"Chrome"**
3. If update available, tap **Update**
4. Try logging in again

### 9. Update iOS

Make sure you're running the latest iOS version:

1. Go to **Settings** > **General** > **Software Update**
2. Install any available updates
3. Try logging in again

## Technical Details

### What We Fixed

✅ **Cookie Configuration for Mobile**

- Set `sameSite: "lax"` - Works with iOS Safari
- Set `secure: true` in production - Required for HTTPS
- Simplified cookie names - Avoids iOS Safari issues with prefixed cookies

### Cookie Settings Applied

```typescript
cookies: {
  sessionToken: {
    name: `next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: "lax", // ✅ Works for iOS Safari
      path: "/",
      secure: process.env.NODE_ENV === "production", // ✅ HTTPS only
    },
  },
}
```

## Still Not Working?

If you've tried all the above and it still doesn't work:

1. **Check Browser Console:**

   - On iPhone: Use Safari's Web Inspector (connect iPhone to Mac)
   - Look for cookie-related errors
   - Look for redirect errors

2. **Check Production Logs:**

   ```bash
   npx wrangler tail
   ```

   Look for authentication errors or cookie-related issues

3. **Verify Google OAuth Settings:**

   - Ensure `https://omrijukin.com/api/auth/callback/google` is in authorized redirect URIs
   - Ensure `https://omrijukin.com` is in authorized JavaScript origins

4. **Test in Private/Incognito Mode:**
   - Sometimes extensions or cached data interfere
   - Try in Safari Private Browsing mode

## Expected Behavior

After fixes, when you click "Sign in with Google" on mobile:

1. ✅ Should redirect to Google OAuth page
2. ✅ Should show your email selection
3. ✅ Should redirect back to `https://omrijukin.com/[locale]/admin`
4. ✅ Should maintain session (stay logged in)

If any step fails, note which step and share with the developer.
