# 🔐 Admin Registration - Quick Reference

## Default Registration Key

```
CHANGE_THIS_SECRET_KEY_IN_PRODUCTION
```

**⚠️ CHANGE THIS IMMEDIATELY IN PRODUCTION!**

---

## Setup Instructions

### 1. Configure Backend

```bash
cd backend
cp .env.example .env
# Edit .env and set ADMIN_REGISTRATION_KEY to a strong random value
```

### 2. Generate Strong Key (choose one)

```bash
# Node.js random hex
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# UUID
node -e "console.log(require('crypto').randomUUID())"

# OpenSSL
openssl rand -base64 32
```

### 3. Create First Admin

1. Start backend: `npm start` (in backend folder)
2. Go to: `http://localhost:3001/register`
3. Fill form + registration key
4. First admin = **Superadmin** role

---

## Frontend Registration Form

Required fields:

- ✅ Full Name
- ✅ Username
- ✅ Email
- ✅ Password (min 6 chars)
- ✅ Confirm Password
- ✅ **Registration Key** (from .env)

---

## Security Features

✅ Registration key required  
✅ First admin = superadmin  
✅ Subsequent admins = regular admin  
✅ Password hashing (bcrypt)  
✅ JWT authentication (30-day expiry)  
✅ Protected routes

---

## Production Checklist

- [ ] Change `ADMIN_REGISTRATION_KEY` in `.env`
- [ ] Change `JWT_SECRET` in `.env`
- [ ] Update `MONGODB_URI` with production DB
- [ ] Create first superadmin account
- [ ] Test admin login works
- [ ] **(Recommended)** Disable registration route after setup
- [ ] Store registration key in password manager
- [ ] Share key securely with authorized personnel only

---

## Disable Registration After Setup (Optional)

**Option 1: Comment out route**

```javascript
// backend/routes/authRoutes.js
// router.post('/admin/register', authController.registerAdmin);
```

**Option 2: Environment flag**

```javascript
// backend/routes/authRoutes.js
if (process.env.ALLOW_ADMIN_REGISTRATION === "true") {
  router.post("/admin/register", authController.registerAdmin);
}
```

Then set in `.env`:

```
ALLOW_ADMIN_REGISTRATION=false
```

---

## Error Messages

| Error                       | Meaning                |
| --------------------------- | ---------------------- |
| "Invalid registration key"  | Wrong key provided     |
| "Email already registered"  | Email exists           |
| "Username already exists"   | Username taken         |
| "Please fill in all fields" | Missing required field |
| "Passwords do not match"    | Confirmation mismatch  |

---

## API Endpoint

```http
POST /api/auth/admin/register
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@example.com",
  "password": "securepass123",
  "name": "Admin Name",
  "registrationKey": "your-secret-key"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Admin registration successful",
  "token": "eyJhbGc...",
  "admin": {
    "id": "...",
    "username": "admin",
    "name": "Admin Name",
    "email": "admin@example.com",
    "role": "superadmin"
  }
}
```

**Response (Invalid Key):**

```json
{
  "success": false,
  "message": "Invalid registration key. Contact system administrator for access."
}
```

---

## Admin Roles

| Role           | Permissions                                        |
| -------------- | -------------------------------------------------- |
| **superadmin** | Full system access, can manage everything          |
| **admin**      | Management access (courses, faculty, events, etc.) |

---

## Support

📖 Full documentation: `SECURITY.md`  
🔧 Environment example: `backend/.env.example`  
🐛 Issues: Check backend console logs
