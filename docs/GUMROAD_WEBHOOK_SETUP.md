# 🔗 Gumroad Webhook Setup - Complete Guide

## ✅ What's Already Built

Your license server **already has** a webhook handler that:
- ✅ Receives Gumroad purchase notifications
- ✅ Auto-generates unique license keys
- ✅ Saves license to database with customer email
- ✅ Logs all webhook events for debugging
- ✅ Returns license key to Gumroad
- ✅ Handles refunds (auto-revokes license)

**File:** `/routes/webhook.js` (already deployed!)

---

## 🎯 Step-by-Step Setup

### Step 1: Create Gumroad Product

1. Go to https://gumroad.com/products/new

2. **Basic Info:**
   - **Product Name:** TAFIL Pro - Project Command Center
   - **URL:** tafil (becomes: toseefahmad.gumroad.com/l/tafil)
   - **Price:** $49 USD
   - **Description:**
   ```
   TAFIL Pro - Your Project Command Center
   
   ✨ Manage all your Node.js projects in one place
   🚀 One-click project running with smart detection
   📝 Built-in notes, tasks, and diagrams (Excalidraw)
   🔧 Integrated terminal and code editor
   📊 Project insights and architecture visualization
   
   What's Included:
   • Lifetime license (one-time payment)
   • 3 device activations
   • macOS, Windows, and Linux support
   • All future updates included
   • Priority email support
   
   After purchase, you'll receive:
   1. Your unique license key via email
   2. Download links for all platforms
   3. Quick start guide
   
   System Requirements:
   • macOS 10.13+ / Windows 10+ / Ubuntu 18.04+
   • 4GB RAM minimum
   • 500MB disk space
   ```

3. **Product Type:** Select "Software/Digital Product"

4. **Enable License Keys:**
   - Scroll down to "License Keys"
   - Toggle ON "Generate unique license keys"
   - Select "One license per purchase"
   - **Important:** Leave format as default (Gumroad will use YOUR server's key)

5. **Add Content (Optional):**
   - You can upload a PDF quick start guide
   - Or just rely on the license key email

6. Click **Publish**

---

### Step 2: Configure Gumroad Ping (Webhook)

1. Go to your product page on Gumroad

2. Click **Edit Product**

3. Scroll to **Advanced Settings** or **Ping**

4. **Webhook URL:** Enter your server URL
   ```
   https://tafil-license-server.vercel.app/webhook/gumroad
   ```
   
   Or if you've set up custom domain:
   ```
   https://api.tafil.app/webhook/gumroad
   ```

5. **Events to Send:** 
   - ✅ Check "Sale" (when someone purchases)
   - ✅ Check "Refund" (if someone gets refunded)

6. **Test the Webhook:**
   - Click **"Ping"** or **"Send Test Ping"** button
   - You should see a success message
   - Check your Vercel logs to confirm receipt

7. Click **Save**

---

## 🔍 What Happens When Someone Buys

### The Flow:

```
1. Customer clicks "Buy TAFIL Pro" on tafil.app
   ↓
2. Redirected to Gumroad checkout
   ↓
3. Customer enters email & payment info
   ↓
4. Payment processed by Gumroad
   ↓
5. Gumroad sends HTTP POST to your webhook:
   POST https://api.tafil.app/webhook/gumroad
   {
     "sale_id": "ABC123",
     "email": "customer@example.com",
     "product_name": "TAFIL Pro",
     "price": 4900,  // in cents
     "full_name": "John Doe",
     ... other data
   }
   ↓
6. Your server receives webhook:
   - Generates license key: "A3F2-B9K4-X7L2-M5N8-P1Q3"
   - Saves to database with customer email
   - Returns license key in response
   ↓
7. Gumroad receives license key from your server
   ↓
8. Gumroad emails customer:
   
   Subject: "Your TAFIL Pro License"
   
   Thanks for purchasing TAFIL Pro!
   
   Your License Key: A3F2-B9K4-X7L2-M5N8-P1Q3
   
   Download TAFIL:
   https://download.tafil.app
   
   Installation Guide:
   1. Download TAFIL for your platform
   2. Install and launch
   3. Enter your license key
   4. Start managing your projects!
   
   Need help? Reply to this email.
   ↓
9. Customer receives email with license
   ↓
10. Customer downloads from download.tafil.app
   ↓
11. Customer enters license in TAFIL app
   ↓
12. TAFIL app calls your API:
    POST https://api.tafil.app/api/license/activate
    {
      "license_key": "A3F2-B9K4-X7L2-M5N8-P1Q3",
      "device_fingerprint": "...",
      "device_name": "MacBook Pro"
    }
   ↓
13. Server validates & activates license
   ↓
14. License activated! Customer can use TAFIL ✅
```

---

## 📧 Email Delivery Options

### Option 1: Gumroad Handles Email (Recommended - Easiest!)

**What Gumroad Does:**
- Automatically emails the license key to customer
- Includes product name and purchase details
- Customer gets email within seconds
- You don't need to do anything!

**How to Customize the Email:**

1. In Gumroad → Product Settings → **Email Settings**

2. **Email Template:** Customize the message:
   ```
   Hi {{customer_name}},
   
   Thank you for purchasing TAFIL Pro! 🎉
   
   YOUR LICENSE KEY:
   {{license_key}}
   
   NEXT STEPS:
   
   1. Download TAFIL:
      → https://download.tafil.app
   
   2. Install on your Mac/Windows/Linux
   
   3. Launch TAFIL and enter your license key
   
   4. Start managing your projects!
   
   WHAT'S INCLUDED:
   ✓ 3 device activations
   ✓ Lifetime updates
   ✓ All platforms (Mac, Windows, Linux)
   ✓ Priority support
   
   NEED HELP?
   Email: support@tafil.app
   Reply to this email
   
   Happy coding!
   The TAFIL Team
   ```

3. **From Name:** "TAFIL Support" or "Touseef from TAFIL"

4. **Subject:** "Your TAFIL Pro License - {{license_key}}"

**This is the easiest option and works automatically!**

---

### Option 2: Custom Email via Your Server (Advanced)

If you want to send emails yourself, add to the webhook handler:

**Update `/routes/webhook.js`:**

```javascript
// After creating license, send email
const nodemailer = require('nodemailer');

// Configure email (use SendGrid, AWS SES, or Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send email
await transporter.sendMail({
  from: 'TAFIL <support@tafil.app>',
  to: email,
  subject: `Your TAFIL Pro License - ${licenseKey}`,
  html: `
    <h2>Thank you for purchasing TAFIL Pro! 🎉</h2>
    
    <p>Your License Key:</p>
    <h3 style="background: #f0f0f0; padding: 15px; font-family: monospace;">
      ${licenseKey}
    </h3>
    
    <h3>Next Steps:</h3>
    <ol>
      <li>Download TAFIL: <a href="https://download.tafil.app">download.tafil.app</a></li>
      <li>Install on your computer</li>
      <li>Launch and enter your license key</li>
      <li>Start managing your projects!</li>
    </ol>
    
    <p>Need help? Reply to this email.</p>
    
    <p>Happy coding!<br>The TAFIL Team</p>
  `
});
```

**But honestly, Option 1 (Gumroad handles it) is much easier!**

---

## 🧪 Testing the Webhook

### Test 1: Use Gumroad Ping Test

1. Go to Product Settings → Ping
2. Click **"Ping"** or **"Send Test"**
3. Check Vercel logs:
   ```bash
   vercel logs tafil-license-server --follow
   ```
4. You should see:
   ```
   📥 Gumroad webhook received
   ✅ License created: XXXX-XXXX-XXXX-XXXX-XXXX
   📧 Email should be sent to test@example.com
   ```

### Test 2: Make a Real Purchase

1. Go to your Gumroad product page
2. Click "I'll buy this"
3. Use a real email (your own for testing)
4. Complete purchase
5. Check your email for license key
6. Check dashboard: https://dashboard.tafil.app
7. You should see the new license!

### Test 3: Verify in Dashboard

1. Go to https://dashboard.tafil.app
2. You should see your test purchase
3. Email matches the customer
4. License key is shown
5. Status is "active"
6. Devices: 0/3

---

## 🔧 Troubleshooting

### Webhook Not Receiving

**Problem:** Gumroad says webhook failed

**Solutions:**
1. Check URL is correct: `https://api.tafil.app/webhook/gumroad`
2. Ensure server is deployed: `vercel ls tafil-license-server`
3. Check Vercel logs: `vercel logs tafil-license-server --follow`
4. Test with Ping button in Gumroad

**Check Server Health:**
```bash
curl https://api.tafil.app/health
# Should return: {"status":"ok","timestamp":"..."}
```

---

### License Not Created

**Problem:** Webhook received but no license in database

**Solutions:**
1. Check Vercel logs for errors
2. Ensure Vercel Postgres is created
3. Check environment variables are set
4. Check webhook payload in logs

**Check Database:**
In Vercel Dashboard:
- Go to tafil-license-server → Storage
- Ensure Postgres database exists
- Check `POSTGRES_URL` environment variable is set

---

### Customer Didn't Receive Email

**Problem:** License created but customer didn't get email

**Solutions:**

**If using Gumroad email (Option 1):**
1. Check Gumroad email settings are configured
2. Check customer's spam folder
3. Verify email in Gumroad purchase record
4. Manually resend from Gumroad

**If using custom email (Option 2):**
1. Check email service credentials
2. Check Vercel logs for email errors
3. Verify sender email is verified
4. Check email service quota

---

### License Doesn't Activate

**Problem:** Customer enters key but activation fails

**Solutions:**
1. Check license key is correct (no typos)
2. Verify license exists in dashboard
3. Check license status is "active"
4. Test activation via API:
```bash
curl -X POST https://api.tafil.app/api/license/activate \
  -H "Content-Type: application/json" \
  -d '{
    "license_key": "XXXX-XXXX-XXXX-XXXX-XXXX",
    "device_fingerprint": "test-device-123",
    "device_name": "Test Device",
    "platform": "darwin",
    "app_version": "1.0.0"
  }'
```

---

## 📊 Monitoring Webhook Activity

### View Webhook Logs

**In Vercel Dashboard:**
1. Go to tafil-license-server project
2. Click "Deployments" → Latest deployment
3. Click "Logs"
4. Filter by "webhook"

**Via CLI:**
```bash
vercel logs tafil-license-server --follow
```

### Check Unprocessed Webhooks

**Via Dashboard:**
1. Go to https://dashboard.tafil.app
2. Look for any failed webhook events
3. Manually process if needed

**Via API:**
```bash
curl https://api.tafil.app/api/admin/webhooks/unprocessed \
  -H "X-API-Key: your-admin-api-key"
```

---

## 🎯 Gumroad Product URL

After setup, your product will be at:

```
https://toseefahmad.gumroad.com/l/tafil
```

Or custom domain (if you set it up in Gumroad):
```
https://tafil.app/buy
```

---

## 💡 Pro Tips

### 1. Add Download Links to Gumroad

In Gumroad product description, add:

```markdown
After purchase, download TAFIL here:
👉 https://download.tafil.app

Your license key will be sent to your email.
```

### 2. Set Up Product Variants (Optional)

If you want to offer different device limits:

**In Gumroad:**
1. Add variant: "Number of Devices"
2. Options: 
   - 3 devices (default) - $49
   - 5 devices - $79
   - 10 devices (team) - $149

**Your webhook already handles this!**
It reads `variants["Number of Devices"]` and sets `max_devices` accordingly.

### 3. Add Refund Policy

In product description:

```
REFUND POLICY:
30-day money-back guarantee. If TAFIL doesn't work for you,
email support@tafil.app for a full refund.
```

### 4. Enable Gumroad Discover (Optional)

This helps people find your product:
- Go to Product Settings → Gumroad Discover
- Enable it (small commission on sales)
- Gets your product featured

---

## ✅ Checklist

Before going live:

- [ ] Gumroad product created
- [ ] License keys enabled
- [ ] Webhook URL configured
- [ ] Webhook tested with Ping
- [ ] Email template customized
- [ ] Test purchase completed
- [ ] License received via email
- [ ] License activated in TAFIL app
- [ ] Refund policy added
- [ ] Download links in description
- [ ] Price verified ($49)

---

## 🎊 You're Ready!

Everything is set up:
- ✅ Server receives webhooks
- ✅ Auto-generates licenses
- ✅ Saves to database
- ✅ Customers get emailed
- ✅ Downloads available
- ✅ Activation works

**Start selling!** 💰

---

## 📞 Quick Reference

**Webhook URL:** `https://api.tafil.app/webhook/gumroad`

**Test Webhook:**
```bash
curl -X POST https://api.tafil.app/webhook/gumroad \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "sale_id=TEST123&email=test@example.com&product_name=TAFIL+Pro&price=4900"
```

**Check Logs:**
```bash
vercel logs tafil-license-server --follow
```

**View Licenses:**
https://dashboard.tafil.app

---

**Everything works automatically!** 🎉

