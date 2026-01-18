# ⚡ Quick Setup: koora.marocaine.org

## Your Situation
- Domain `marocaine.org` → **Other Hostinger account** (already in use)
- Subdomain `koora.marocaine.org` → **Current Hostinger account** (for this app)

---

## 🎯 Quick Steps

### 1️⃣ Get Current Hosting IP
**Current Hostinger account** → Advanced → IP Address
- Copy the IP address (e.g., `123.456.789.012`)

### 2️⃣ Create Subdomain in Domain's Account
**Other Hostinger account** (where marocaine.org is):
- Domains → Subdomains → Create `koora`
- Document root: `public_html/koora`

### 3️⃣ Point Subdomain to Current Hosting
**Other Hostinger account** → DNS Zone Editor:
- Add **A Record**:
  ```
  Name: koora
  Points to: [IP from step 1]
  ```

### 4️⃣ Add Domain in Current Account
**Current Hostinger account**:
- Domains → Add Domain → Enter `koora.marocaine.org`
- Document root: `public_html/koora`

### 5️⃣ Wait & Deploy
- ⏰ Wait 24-48 hours for DNS
- 📦 Build: `npm run build`
- 📤 Upload `build/` files to `public_html/koora/`
- 📄 Upload `.htaccess` to `public_html/koora/`

### 6️⃣ Test
- Visit: `https://koora.marocaine.org`

---

## ⚠️ Important Notes

1. **DNS Propagation**: Takes 24-48 hours globally
2. **Access Required**: You need access to BOTH Hostinger accounts
3. **IP Address**: Must be correct - double-check it!

---

## 🔍 Check DNS Status
Visit: https://www.whatsmydns.net/#A/koora.marocaine.org

---

**Full guide**: See `SUBDOMAIN_SETUP.md`

