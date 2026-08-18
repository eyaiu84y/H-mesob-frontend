/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

// Constants extracted to separate exports to avoid react-refresh warnings
const DEMO_USERS = [
  { id: 1, name: "Super Admin",          email: "superadmin@mesobcenter.et", password: "super123",   role: "super_admin" },
  { id: 2, name: "MESOB Manager",        email: "manager@mesobcenter.et",    password: "manager123", role: "mesob_manager" },
  { id: 3, name: "Institution Manager",  email: "inst.manager@mesobcenter.et", password: "inst123",  role: "institution_manager" },
  { id: 4, name: "Abebe Kebede",         email: "employee@mesobcenter.et",   password: "emp123",     role: "employee" },
  { id: 5, name: "Technician",           email: "technician@mesobcenter.et", password: "ict123",     role: "technician"  },
  { id: 6, name: "Citizen",              email: "citizen@mesobcenter.et",    password: "citizen123", role: "citizen" },
];

const AuthContext = createContext(null);

// Valid roles that can be authenticated
const VALID_ROLES = ['super_admin', 'mesob_manager', 'institution_manager', 'employee', 'technician', 'citizen'];

// Validate stored session
function validateStoredSession(sessionData) {
  if (!sessionData) return null;
  
  // Check required fields
  if (!sessionData.id || !sessionData.name || !sessionData.email || !sessionData.role) {
    console.warn('Invalid session: missing required fields');
    return null;
  }
  
  // Check role is valid
  if (!VALID_ROLES.includes(sessionData.role)) {
    console.warn('Invalid session: unknown role', sessionData.role);
    return null;
  }
  
  // Session is valid
  return sessionData;
}

export function AuthProvider({ children }) {
  // Initialize user state from localStorage with validation
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('mesob_auth');
      if (!stored) return null;
      
      const parsed = JSON.parse(stored);
      const validated = validateStoredSession(parsed);
      
      if (!validated) {
        // Clear invalid session
        localStorage.removeItem('mesob_auth');
        return null;
      }
      
      return validated;
    } catch (error) {
      console.error('Failed to restore session:', error);
      localStorage.removeItem('mesob_auth');
      return null;
    }
  });

  function getUsers() {
    try {
      const stored = localStorage.getItem('mesob_users');
      if (!stored) {
        return [...DEMO_USERS];
      }
      
      const storedUsers = JSON.parse(stored);
      
      // Get demo user emails for comparison
      const demoEmails = DEMO_USERS.map(u => u.email.toLowerCase());
      
      // Filter out any stored versions of demo users (they might be outdated)
      const customUsers = storedUsers.filter(
        u => !demoEmails.includes(u.email.toLowerCase())
      );
      
      // Always use current DEMO_USERS (authoritative) + custom signup users
      return [...DEMO_USERS, ...customUsers];
    } catch {
      return [...DEMO_USERS];
    }
  }

  function saveUsers(users) {
    localStorage.setItem('mesob_users', JSON.stringify(users));
  }

  function login(email, password) {
    try {
      console.log('=== LOGIN ATTEMPT ===');
      console.log('Email:', email);
      console.log('Password:', password ? '***' : 'empty');
      
      const users = getUsers();
      console.log('Available users:', users.map(u => u.email));
      
      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      console.log('User found:', found ? found.email : 'NO');
      
      if (!found) {
        console.log('Login failed: Invalid credentials');
        return { success: false, message: "Invalid email or password. Please try again." };
      }
      
      // Validate role before creating session
      if (!VALID_ROLES.includes(found.role)) {
        console.error('Login failed: Invalid role', found.role);
        return { success: false, message: "Invalid user role. Please contact support." };
      }
      
      const sessionUser = { id: found.id, name: found.name, email: found.email, role: found.role };
      console.log('Session user created:', sessionUser);
      
      localStorage.setItem('mesob_auth', JSON.stringify(sessionUser));
      console.log('User saved to localStorage');
      
      setUser(sessionUser);
      console.log('State updated with user');
      
      return { success: true, message: "Login successful.", user: sessionUser };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: "An error occurred during login. Please try again." };
    }
  }

  function logout() {
    localStorage.removeItem('mesob_auth');
    setUser(null);
    window.location.href = '/';
  }

  function signup(name, email, password, role) {
    const users = getUsers();
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return { success: false, message: "Please enter a valid email address." };
    }
    
    // Validate role
    if (!VALID_ROLES.includes(role)) {
      return { success: false, message: "Invalid role selection." };
    }
    
    const exists = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (exists) {
      return { success: false, message: "An account with this email already exists." };
    }
    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
    };
    users.push(newUser);
    saveUsers(users);
    const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
    localStorage.setItem('mesob_auth', JSON.stringify(sessionUser));
    setUser(sessionUser);
    return { success: true, message: "Account created successfully.", user: sessionUser };
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

// Role configuration constants
export const ROLE_ROUTES = {
  super_admin:          "/dashboard/super-admin",
  mesob_manager:        "/dashboard/mesob-manager",
  institution_manager:  "/dashboard/institution-manager",
  employee:             "/dashboard/employee",
  technician:           "/dashboard/technician",
  citizen:              "/dashboard/citizen",
};

export const ROLE_LABELS = {
  super_admin:          "Super Admin",
  mesob_manager:        "MESOB Manager",
  institution_manager:  "Institution Manager",
  employee:             "Employee",
  technician:           "Technician",
  citizen:              "Citizen",
};

export const ROLE_BADGE = {
  super_admin:          "bg-purple-100 text-purple-800",
  mesob_manager:        "bg-red-100 text-red-800",
  institution_manager:  "bg-orange-100 text-orange-800",
  employee:             "bg-blue-100 text-blue-800",
  technician:           "bg-cyan-100 text-cyan-800",
  citizen:              "bg-green-100 text-green-800",
};
