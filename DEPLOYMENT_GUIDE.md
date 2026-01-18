# 🚀 Deployment Guide for Hostinger

This guide will help you deploy your React football app to Hostinger using your domain `koora.marocaine.org` with a subdomain.

## 📋 Prerequisites

- ✅ Hostinger hosting account
- ✅ Domain `koora.marocaine.org` (registered with another provider)
- ✅ Access to your domain registrar's DNS settings

---

## Step 1: Connect Your Domain to Hostinger

### 1.1 Verify Domain Ownership

1. In Hostinger hPanel, when you enter `koora.marocaine.org`, you'll see a verification step
2. Hostinger will provide you with verification options:
   - **DNS Record**: Add a TXT record to your domain's DNS
   - **HTML File**: Upload an HTML file to your domain
   - **Email Verification**: Verify via email

3. **Recommended: DNS Record Method**
   - Go to your domain registrar's DNS management panel
   - Add a TXT record with the value provided by Hostinger
   - Wait 5-10 minutes for DNS propagation
   - Click "Verify" in Hostinger

### 1.2 Update DNS Settings

After verification, Hostinger will provide you with:

**Option A: Nameservers (Recommended)**
- Go to your domain registrar
- Change nameservers to Hostinger's nameservers (provided by Hostinger)
- Usually looks like: `ns1.dns-parking.com` and `ns2.dns-parking.com`

**Option B: DNS Records**
- Add an A record pointing to Hostinger's IP address
- Add a CNAME record if needed

**Wait 24-48 hours** for DNS propagation to complete.

---

## Step 2: Create a Subdomain

1. Log in to Hostinger hPanel
2. Go to **Domains** → **Subdomains**
3. Click **Create Subdomain**
4. Enter subdomain name (e.g., `app` or `football`)
   - This will create: `app.koora.marocaine.org` or `football.koora.marocaine.org`
5. Set document root to: `public_html/app` (or your chosen folder name)
6. Click **Create**

---

## Step 3: Build Your React App

On your local machine, run:

```bash
# Navigate to your project
cd D:\Project\foot

# Install dependencies (if not already done)
npm install

# Build for production
npm run build
```

This creates a `build` folder with all production files.

---

## Step 4: Upload Files to Hostinger

### Method 1: File Manager (Easiest)

1. Log in to Hostinger hPanel
2. Go to **File Manager**
3. Navigate to `public_html` → your subdomain folder (e.g., `app`)
4. **Delete any default files** in this folder (if present)
5. Go to your local `build` folder
6. **Select ALL files and folders** inside `build`
7. Upload them to the subdomain folder
8. **IMPORTANT**: Also upload the `.htaccess` file from the project root to the subdomain folder

### Method 2: FTP (Alternative)

1. Get FTP credentials from Hostinger hPanel:
   - Go to **FTP Accounts** or **Advanced** → **FTP**
   - Note down: Host, Username, Password, Port (usually 21)

2. Use FTP client (FileZilla, WinSCP, etc.):
   ```
   Host: ftp.yourdomain.com (or IP provided)
   Username: your_ftp_username
   Password: your_ftp_password
   Port: 21
   ```

3. Connect and navigate to `public_html/your-subdomain-folder`
4. Upload all files from `build` folder
5. Upload `.htaccess` file to the same folder

---

## Step 5: Verify File Structure

Your subdomain folder should contain:
```
public_html/app/ (or your subdomain folder)
├── index.html
├── .htaccess
├── static/
│   ├── css/
│   ├── js/
│   └── media/
├── manifest.json
├── robots.txt
└── other assets...
```

---

## Step 6: Test Your Website

1. Visit your subdomain: `https://app.koora.marocaine.org` (or your chosen subdomain)
2. Open browser DevTools (F12) → **Console** tab
3. Check for errors:
   - ✅ No 404 errors
   - ✅ No CORS errors (if you see CORS errors, see troubleshooting below)
   - ✅ API calls working

---

## ⚠️ Important: API Configuration

Your app uses external APIs that may have CORS restrictions. Your `apiService.js` is already configured to use production API URLs directly.

### Current API Setup:
- **API-Football (RapidAPI)**: Uses direct API calls ✅
- **Football-Data.org**: Uses direct API calls in production ✅

### If You Encounter CORS Errors:

**Option 1: Use API-Football Only (Recommended)**
- API-Football (RapidAPI) usually allows CORS from any domain
- Your app already prioritizes this API

**Option 2: Create a Backend Proxy**
- Deploy a simple Node.js proxy server (Railway, Render, Vercel)
- Update your React app to call the proxy instead
- This requires additional setup

**Option 3: Contact API Providers**
- Request CORS access for your domain from API providers

---

## 🔧 Troubleshooting

### Issue: Website shows blank page
- **Solution**: Check browser console for errors
- Verify `.htaccess` file is uploaded
- Ensure `index.html` is in the root of subdomain folder

### Issue: 404 errors on page refresh
- **Solution**: Make sure `.htaccess` file is uploaded correctly
- Verify mod_rewrite is enabled on Hostinger (usually is by default)

### Issue: CORS errors in console
- **Solution**: See "API Configuration" section above
- Check if API keys are valid
- Try using API-Football only (it has better CORS support)

### Issue: API calls failing
- **Solution**: 
  - Check API keys in `apiService.js` are valid
  - Verify you haven't exceeded API rate limits
  - Check browser Network tab for specific error messages

### Issue: Domain not resolving
- **Solution**: 
  - Wait 24-48 hours for DNS propagation
  - Verify DNS settings at your domain registrar
  - Check nameservers are correctly set

---

## 📝 Quick Checklist

- [ ] Domain verified in Hostinger
- [ ] DNS settings updated (nameservers or A records)
- [ ] Subdomain created in Hostinger
- [ ] React app built (`npm run build`)
- [ ] All files uploaded to subdomain folder
- [ ] `.htaccess` file uploaded
- [ ] Website accessible via subdomain URL
- [ ] No console errors
- [ ] API calls working

---

## 🎉 Success!

Once everything is working, your app will be live at:
`https://app.koora.marocaine.org` (or your chosen subdomain)

---

## 📞 Need Help?

If you encounter issues:
1. Check browser console (F12) for errors
2. Check Hostinger error logs in hPanel
3. Verify DNS propagation using: https://www.whatsmydns.net
4. Test API endpoints directly to verify they're working

