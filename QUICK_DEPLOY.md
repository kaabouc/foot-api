# ⚡ Quick Deployment Checklist

## For Domain: `koora.marocaine.org` (External Domain)

### ✅ Step 1: Connect Domain to Hostinger
1. In Hostinger, enter `koora.marocaine.org`
2. Follow verification steps (DNS TXT record recommended)
3. Update nameservers at your domain registrar to Hostinger's nameservers
4. Wait 24-48 hours for DNS propagation

### ✅ Step 2: Create Subdomain
- Go to Hostinger → Domains → Subdomains
- Create: `app.koora.marocaine.org` (or `football.koora.marocaine.org`)
- Document root: `public_html/app`

### ✅ Step 3: Build & Upload
```bash
npm run build
```
- Upload ALL files from `build/` folder to `public_html/app/`
- Upload `.htaccess` file to `public_html/app/`

### ✅ Step 4: Test
- Visit: `https://app.koora.marocaine.org`
- Check browser console (F12) for errors

---

## 📁 Files to Upload

From `build/` folder:
- ✅ index.html
- ✅ static/ (entire folder)
- ✅ manifest.json
- ✅ robots.txt
- ✅ favicon.ico
- ✅ All other files

From project root:
- ✅ .htaccess (upload to subdomain folder)

---

## ⚠️ Important Notes

1. **API Keys**: Your API keys are hardcoded in `apiService.js`. They should work in production, but if you get 403 errors, you may need to update them.

2. **CORS**: If you see CORS errors, the APIs might not allow your domain. API-Football (RapidAPI) usually works fine.

3. **DNS**: Domain connection can take 24-48 hours. Be patient!

4. **File Structure**: Make sure `index.html` is directly in the subdomain folder, not in a subfolder.

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| Blank page | Check console, verify `.htaccess` uploaded |
| 404 on refresh | `.htaccess` file missing or incorrect |
| CORS errors | API may not allow your domain - try API-Football only |
| Domain not working | Wait for DNS propagation (24-48h) |

---

**Full guide**: See `DEPLOYMENT_GUIDE.md` for detailed instructions.

