# Data Cleanup & Management Guide

## Overview
This guide explains how to manage demo accounts, clean up unnecessary data, and handle localStorage in the Hawassa MESOB application.

---

## ✅ COMPLETED: Removed Citizen Demo Account (Sara Hailu)

The Citizen demo account has been removed from the system.

### Files Modified:
1. ✅ `src/context/AuthContext.jsx` - Removed from DEMO_USERS
2. ✅ `src/pages/dashboard/LoginPage.jsx` - Removed from DEMO_ACCOUNTS  
3. ✅ `src/pages/dashboard/SuperAdminDashboard.jsx` - Removed from user list

### Current Demo Accounts (5 total):
| Role | Name | Email | Password |
|------|------|-------|----------|
| Super Admin | Super Admin | superadmin@mesobcenter.et | super123 |
| MESOB Manager | MESOB Manager | manager@mesobcenter.et | manager123 |
| Institution Manager | Institution Manager | inst.manager@mesobcenter.et | inst123 |
| Employee | Abebe Kebede | employee@mesobcenter.et | emp123 |
| Technician | Technician | technician@mesobcenter.et | ict123 |

---

## 🗂️ Data Storage Locations

### 1. **Code-Level Data (Authoritative)**
**Location:** `src/context/AuthContext.jsx`

```javascript
const DEMO_USERS = [
  { id: 1, name: "Super Admin", email: "superadmin@mesobcenter.et", password: "super123", role: "super_admin" },
  // ... more users
];
```

**What it contains:**
- Built-in demo accounts
- These are the authoritative source
- Always used first (overrides localStorage cache)

### 2. **localStorage Data (Browser Storage)**

#### `mesob_auth` - Current Session
```javascript
// Stores currently logged-in user
{
  "id": 1,
  "name": "Super Admin",
  "email": "superadmin@mesobcenter.et",
  "role": "super_admin"
}
```

**When it's created:** User logs in  
**When it's removed:** User logs out  
**Purpose:** Track current session

#### `mesob_users` - User Database
```javascript
// Stores ALL users (demo + custom signups)
[
  { id: 1, name: "Super Admin", email: "superadmin@mesobcenter.et", password: "super123", role: "super_admin" },
  { id: 1234567890, name: "John Doe", email: "john@example.com", password: "custom123", role: "citizen" },
  // ... more users
]
```

**When it's created:** First signup occurs  
**What it contains:** Demo users + custom signup users  
**Note:** Demo users in localStorage are automatically filtered and replaced with current code versions

---

## 🧹 How to Clean Up Data

### Method 1: Clear Specific Data (Browser Console)

**Open Browser DevTools (F12) → Console:**

```javascript
// Clear current session only
localStorage.removeItem('mesob_auth');

// Clear user database only
localStorage.removeItem('mesob_users');

// Clear all MESOB data
localStorage.removeItem('mesob_auth');
localStorage.removeItem('mesob_users');

// Refresh page
location.reload();
```

### Method 2: Clear All Browser Data

**For complete reset:**
```javascript
localStorage.clear();
location.reload();
```

### Method 3: Browser Settings

**Chrome/Edge:**
1. Press `F12` → Application tab
2. Storage → Local Storage → http://localhost:5173
3. Right-click → Clear
4. Refresh page

**Firefox:**
1. Press `F12` → Storage tab
2. Local Storage → http://localhost:5173
3. Right-click → Delete All
4. Refresh page

---

## 📝 When to Clean Up Data

### Scenario 1: Testing Fresh Login
**Problem:** Already logged in, can't see login page  
**Solution:**
```javascript
localStorage.removeItem('mesob_auth');
location.reload();
```

### Scenario 2: Old Demo Users Cached
**Problem:** Updated demo account in code but old version still used  
**Solution:** Not needed! The system automatically uses current code versions

### Scenario 3: Remove All Custom Signups
**Problem:** Want to reset to only demo accounts  
**Solution:**
```javascript
localStorage.removeItem('mesob_users');
location.reload();
```

### Scenario 4: Complete System Reset
**Problem:** Want to start completely fresh  
**Solution:**
```javascript
localStorage.clear();
location.reload();
```

---

## 🔧 How to Add/Remove Demo Accounts

### Remove a Demo Account

**Example: Remove Technician account**

1. **Edit `src/context/AuthContext.jsx`:**
   ```javascript
   const DEMO_USERS = [
     { id: 1, name: "Super Admin", ... },
     { id: 2, name: "MESOB Manager", ... },
     // Remove Technician line
     { id: 4, name: "Abebe Kebede", ... },
   ];
   ```

2. **Edit `src/pages/dashboard/LoginPage.jsx`:**
   ```javascript
   const DEMO_ACCOUNTS = [
     { label: 'Super Admin', ... },
     { label: 'MESOB Manager', ... },
     // Remove Technician line
     { label: 'Employee', ... },
   ];
   ```

3. **Edit `src/pages/dashboard/SuperAdminDashboard.jsx`:**
   Remove from the hardcoded user list

4. **Build:**
   ```bash
   npm run build
   ```

### Add a New Demo Account

**Example: Add Auditor role**

1. **Add role to VALID_ROLES in `AuthContext.jsx`:**
   ```javascript
   const VALID_ROLES = ['super_admin', 'mesob_manager', 'institution_manager', 'employee', 'technician', 'auditor'];
   ```

2. **Add to DEMO_USERS:**
   ```javascript
   const DEMO_USERS = [
     // ... existing users
     { id: 7, name: "Auditor", email: "auditor@mesobcenter.et", password: "audit123", role: "auditor" },
   ];
   ```

3. **Add to ROLE_ROUTES:**
   ```javascript
   export const ROLE_ROUTES = {
     // ... existing routes
     auditor: "/dashboard/auditor",
   };
   ```

4. **Add to LoginPage DEMO_ACCOUNTS:**
   ```javascript
   { label: 'Auditor', email: 'auditor@mesobcenter.et', password: 'audit123', style: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-800' },
   ```

5. **Create dashboard:** `src/pages/dashboard/AuditorDashboard.jsx`

6. **Add route in `App.jsx`:**
   ```javascript
   <Route
     path="/dashboard/auditor"
     element={
       <RequireAuth allowedRoles={['auditor']}>
         <AuditorDashboard />
       </RequireAuth>
     }
   />
   ```

---

## 🛡️ Data Persistence Behavior

### What Persists Across Page Refresh:
✅ **Current session** (`mesob_auth`) - User stays logged in  
✅ **Custom signup users** (`mesob_users`) - Preserved  

### What Gets Reset:
❌ **Demo accounts in localStorage** - Automatically replaced with current code  
❌ **Invalid sessions** - Cleared automatically  

### How the System Works:

1. **On Login:**
   - Checks credentials against `getUsers()`
   - `getUsers()` returns: Current DEMO_USERS + custom signup users
   - Creates session in `mesob_auth`

2. **On Page Refresh:**
   - Reads `mesob_auth`
   - Validates session
   - If valid: Stays logged in
   - If invalid: Cleared, shows login page

3. **On Signup:**
   - Adds new user to `mesob_users`
   - Creates session in `mesob_auth`
   - Custom user preserved for future logins

---

## 🚨 Important Notes

### Demo Account Protection:
- **Demo emails are protected** - Users cannot signup with demo emails
- **Demo accounts always authoritative** - Code versions always used
- **No localStorage conflicts** - Outdated cached demo users automatically filtered

### Custom Users:
- **Preserved independently** - Stored in `mesob_users`
- **Not overridden by demos** - Kept separate from demo accounts
- **Persist across updates** - Code changes don't affect custom users

### When Updates Take Effect:
- **Code changes** - Immediate (next page load)
- **Demo account updates** - Immediate (no cache clearing needed)
- **Role changes** - Require code rebuild (`npm run build`)

---

## 📊 Current System State

### Active Demo Accounts: **5**
1. Super Admin
2. MESOB Manager  
3. Institution Manager
4. Employee
5. Technician

### Removed Demo Accounts: **1**
1. ~~Citizen (Sara Hailu)~~ ✅ Removed

### Active Roles: **5**
- `super_admin`
- `mesob_manager`
- `institution_manager`
- `employee`
- `technician`

### Citizen Role Status:
- ✅ Still available as a role option for signup
- ✅ Citizen dashboard still exists
- ✅ Users can signup as Citizens
- ❌ No pre-made Citizen demo account

---

## 🔄 Maintenance Checklist

### Regular Cleanup (Optional):
- [ ] Review custom signups in `mesob_users`
- [ ] Remove test accounts created during development
- [ ] Verify demo accounts match current requirements

### After Code Updates:
- [x] Demo accounts automatically use current code ✅
- [ ] Test login with each demo account
- [ ] Verify role-based routing
- [ ] Check dashboard access

### Before Production:
- [ ] Remove or change demo passwords
- [ ] Consider removing demo accounts entirely
- [ ] Add proper backend authentication
- [ ] Implement real user database

---

## 🎯 Summary

### ✅ What You Just Did:
- Removed Sara Hailu (Citizen) demo account
- Kept 5 essential demo accounts
- System still allows Citizen role via signup
- No localStorage manual clearing needed

### 📌 Remember:
- Demo accounts in code are always authoritative
- Custom signups are preserved separately  
- No need to manually clear cache after code updates
- The system handles data conflicts automatically

### 🚀 Next Steps (Optional):
1. Test all remaining demo logins work
2. Test signup with Citizen role still works
3. Consider which roles need demo accounts
4. Plan for production authentication system
