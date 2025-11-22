# Security Guide - Admin Registration

## 🔐 How Admin Registration Works

### Security Measures Implemented:

1. **Registration Key Protection**

   - Every admin registration requires a secret key
   - The key must be set in the backend `.env` file
   - Default key: `CHANGE_THIS_SECRET_KEY_IN_PRODUCTION` (CHANGE THIS!)
   - Without the correct key, registration will fail with 403 error

2. **First Admin = Superadmin**

   - The first admin account created automatically becomes a "superadmin"
   - Subsequent admins are regular "admin" role
   - This ensures there's always a root administrator

3. **Role-Based Access Control**
   - Superadmin: Full system access
   - Admin: Limited management access
   - Student: Student portal only

---

## 🚀 Setting Up Admin Registration (Production)

### Step 1: Set Environment Variable

Create/edit `backend/.env` file:

```env
ADMIN_REGISTRATION_KEY=YourVerySecureRandomKey2024!@#
```

**Generate a strong key:**

```bash
# Option 1: Random string (Node.js)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: UUID
node -e "console.log(require('crypto').randomUUID())"

# Option 3: Base64 random
openssl rand -base64 32
```

### Step 2: Share Key Securely

- **Do NOT commit** the key to Git
- Share via secure channels only (encrypted email, password manager)
- Only give to trusted administrators
- Rotate the key periodically

### Step 3: Create First Admin

1. Start the backend server
2. Go to `https://yourdomain.com/admin/register`
3. Fill in the form including the registration key
4. First registration = Superadmin account

---

## 🛡️ Additional Security Recommendations

### For Production Deployment:

1. **Disable Registration After Setup**

   Option A: Comment out the registration route in `backend/routes/authRoutes.js`:

   ```javascript
   // router.post('/admin/register', authController.registerAdmin);
   ```

   Option B: Add environment flag:

   ```javascript
   // In authRoutes.js
   if (process.env.ALLOW_ADMIN_REGISTRATION === "true") {
     router.post("/admin/register", authController.registerAdmin);
   }
   ```

2. **IP Whitelist** (Advanced)

   - Restrict admin registration to specific IPs
   - Use middleware to check `req.ip`

3. **Rate Limiting**

   ```bash
   npm install express-rate-limit
   ```

   ```javascript
   const rateLimit = require("express-rate-limit");

   const registerLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 3, // limit each IP to 3 requests per windowMs
   });

   router.post(
     "/admin/register",
     registerLimiter,
     authController.registerAdmin
   );
   ```

4. **Email Verification**

   - Require email confirmation before activation
   - Send verification link with token

5. **Two-Factor Authentication (2FA)**

   - Implement TOTP using libraries like `speakeasy`
   - Require 2FA for all admin accounts

6. **Audit Logging**
   - Log all admin registration attempts
   - Track who created which admin account
   - Monitor failed registration attempts

---

## 📝 Managing Admins

### Create Additional Admins (After First Setup)

**Method 1: Via API (with registration key)**

```bash
curl -X POST http://localhost:5000/api/auth/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin2",
    "email": "admin2@example.com",
    "password": "securepass123",
    "name": "Second Admin",
    "registrationKey": "YourSecretKey"
  }'
```

**Method 2: Via Frontend**

- Navigate to `/admin/register`
- Provide the registration key
- New admin will be created with "admin" role (not superadmin)

**Method 3: Directly in Database (MongoDB)**

```javascript
// Use this only in emergency
const bcrypt = require("bcryptjs");

const hashedPassword = await bcrypt.hash("password123", 10);

db.admins.insertOne({
  username: "emergency_admin",
  email: "emergency@example.com",
  password: hashedPassword,
  name: "Emergency Admin",
  role: "superadmin",
  isActive: true,
  createdAt: new Date(),
});
```

---

## 🔄 Key Rotation

Rotate registration key every 3-6 months:

1. Generate new key
2. Update `.env` file
3. Restart backend server
4. Share new key with authorized personnel
5. Revoke old key

---

## ⚠️ What NOT to Do

- ❌ Don't hardcode the key in source code
- ❌ Don't commit `.env` to Git
- ❌ Don't share the key in plain text emails
- ❌ Don't use weak keys like "admin123"
- ❌ Don't leave registration open without a key
- ❌ Don't give the key to untrusted users

---

## 🆘 Emergency Access

If you lose the registration key and need admin access:

1. **Reset via Database:**

   - Connect to MongoDB directly
   - Update/create admin account manually (see Method 3 above)

2. **Change Registration Key:**

   - Update `ADMIN_REGISTRATION_KEY` in `.env`
   - Restart server
   - Create new admin with new key

3. **Temporary Override:**
   - Temporarily disable key check in `authController.js`
   - Create admin account
   - Re-enable key check immediately
   - Change registration key

---

## 📊 Monitoring

Monitor these events in production:

- Number of admin registration attempts
- Failed registration attempts (wrong key)
- Time of admin creation
- IP addresses of registration attempts
- Admin role assignments

---

## 🎯 Quick Setup Checklist

- [ ] Created `.env` file in backend folder
- [ ] Set strong `ADMIN_REGISTRATION_KEY`
- [ ] Set secure `JWT_SECRET`
- [ ] Added `.env` to `.gitignore`
- [ ] Created first admin (superadmin) account
- [ ] Tested admin login
- [ ] Stored registration key in password manager
- [ ] (Optional) Disabled registration route after setup
- [ ] (Optional) Implemented rate limiting
- [ ] (Optional) Set up audit logging

---

## 📧 Support

For security concerns or questions:

- Review backend logs: `backend/logs/`
- Check MongoDB admin collection
- Contact system administrator
