# 🌐 Subdomain Setup Guide: koora.marocaine.org

## Situation
- **Domain**: `marocaine.org` (in another Hostinger account - already in use)
- **Subdomain needed**: `koora.marocaine.org` (for this React app)
- **Deployment target**: Current Hostinger account

---

## 📋 Step-by-Step Instructions

### Step 1: Get Your Current Hosting IP Address

In your **current Hostinger account** (where you want to deploy):

1. Log in to hPanel
2. Go to **Advanced** → **IP Address** (or **Account Information**)
3. Note down your **Shared IP Address** or **Dedicated IP**
   - It will look like: `123.456.789.012`
   - **Save this IP address** - you'll need it!

---

### Step 2: Create Subdomain in Domain's Hostinger Account

In the **other Hostinger account** (where `marocaine.org` is):

1. Log in to that Hostinger account's hPanel
2. Go to **Domains** → **Subdomains**
3. Click **Create Subdomain**
4. Enter subdomain name: `koora`
   - This will create: `koora.marocaine.org`
5. **Important**: Set document root to a folder (e.g., `public_html/koora`)
   - You won't use this folder, but you need to create the subdomain
6. Click **Create**

---

### Step 3: Point Subdomain to Current Hosting Account

Now you need to point `koora.marocaine.org` to your current hosting account.

#### Option A: Using DNS Records (Recommended)

In the **domain's Hostinger account** (where `marocaine.org` is):

1. Go to **Advanced** → **DNS Zone Editor** (or **Domains** → **DNS Zone**)
2. Find the DNS records for `marocaine.org`
3. Add a new **A Record**:
   ```
   Type: A
   Name: koora
   Points to: [Your current hosting IP from Step 1]
   TTL: 14400 (or default)
   ```
4. Click **Add Record** or **Save**

#### Option B: Using CNAME (Alternative)

If A record doesn't work, try CNAME:

1. In DNS Zone Editor, add a **CNAME Record**:
   ```
   Type: CNAME
   Name: koora
   Points to: [Your current hosting account's domain or IP]
   TTL: 14400
   ```

**Note**: You might need to get a hostname from your current hosting account (like `your-account.hostingersite.com`)

---

### Step 4: Add Domain in Current Hosting Account

In your **current Hostinger account** (where you want to deploy):

1. Go to **Domains** → **Add Domain** (or **Parked Domains**)
2. Enter: `koora.marocaine.org`
3. Choose **Parked Domain** or **Add Domain**
4. Set document root to: `public_html/koora` (or your preferred folder)
5. Click **Add**

**Note**: Since the domain is managed in another account, Hostinger might show a warning. That's okay - you're just adding it to point to your hosting.

---

### Step 5: Wait for DNS Propagation

- **Wait 24-48 hours** for DNS changes to propagate worldwide
- You can check propagation status at: https://www.whatsmydns.net
- Search for: `koora.marocaine.org`

---

### Step 6: Build and Deploy Your React App

Once DNS is propagated:

1. **Build your app**:
   ```bash
   npm run build
   ```

2. **Upload files** to your current Hostinger account:
   - Go to **File Manager** in current account
   - Navigate to `public_html/koora` (or your subdomain folder)
   - Upload ALL files from `build/` folder
   - Upload `.htaccess` file

3. **Test**: Visit `https://koora.marocaine.org`

---

## 🔧 Alternative: If DNS Setup is Complex

If you can't modify DNS in the other account, you have these options:

### Option 1: Use Addon Domain
- In your current account, add `koora.marocaine.org` as an **Addon Domain**
- Point it to a folder (e.g., `public_html/koora`)
- Then ask the domain owner to point the subdomain to your hosting IP

### Option 2: Use Hostinger's Temporary Domain
- Use Hostinger's provided subdomain temporarily
- Later, when you have access, point `koora.marocaine.org` to it

---

## ✅ Verification Checklist

- [ ] Got IP address from current hosting account
- [ ] Created subdomain `koora` in domain's account
- [ ] Added A record pointing `koora` to current hosting IP
- [ ] Added domain in current hosting account
- [ ] Waited 24-48 hours for DNS propagation
- [ ] Built React app (`npm run build`)
- [ ] Uploaded files to subdomain folder
- [ ] Uploaded `.htaccess` file
- [ ] Tested `https://koora.marocaine.org`

---

## 🆘 Troubleshooting

### Subdomain not resolving
- **Wait longer**: DNS can take up to 48 hours
- **Check DNS records**: Verify A record is correct
- **Check IP address**: Make sure you're using the correct IP

### 403 Forbidden or Access Denied
- **Check folder permissions**: Should be 755
- **Check file ownership**: Files should be owned by your account

### Domain not found in current account
- **Try Addon Domain** instead of Parked Domain
- **Contact Hostinger support** if domain won't add

---

## 📞 Need Help?

If you're stuck:
1. Check DNS propagation: https://www.whatsmydns.net/#A/koora.marocaine.org
2. Verify IP address is correct
3. Contact Hostinger support if DNS changes aren't working

---

**Important**: Make sure you have access to both Hostinger accounts, or coordinate with the person who manages the `marocaine.org` domain.

