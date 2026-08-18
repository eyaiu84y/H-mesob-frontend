/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

// Constants extracted to separate exports to avoid react-refresh warnings
const DEMO_USERS = [
  { id: 1, name: "Super Admin",          email: "superadmin@mesobcenter.et", password: "super123",   role: "super_admin" },
  { id: 2, name: "MESOB Manager",        email: "manager@mesobcenter.et",    password: "manager123", role: "mesob_manager" },
  { id: 3, name: "Institution Manager",  email: "inst.manager@mesobcenter.et", password: "inst123",  role: "institution_manager" },
  { id: 4, name: "Abebe Kebede",         email: "employee@mesobcenter.et",   password: "emp123",     role: "employee" },
  { id: 5, name: "Technician",         email: "ict@mesobcenter.et",        password: "ict123",     role: "technician"  },
  { id: 6, name: "Sara Hailu",           email: "citizen@example.com",       password: "citizen123", role: "citizen" },
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialize user state from localStorage directly
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('mesob_auth');
      return stored ? JSON.parse(stored) : null;
    } catch {
      localStorage.removeItem('mesob_auth');
      return null;
    }
  });

  function getUsers() {
    try {
      const stored = localStorage.getItem('mesob_users');
      return stored ? JSON.parse(stored) : [...DEMO_USERS];
    } catch {
      return [...DEMO_USERS];
    }
  }

  function saveUsers(users) {
    localStorage.setItem('mesob_users', JSON.stringify(users));
  }

  function login(email, password) {
    const users = getUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) {
      return { success: false, message: "Invalid email or password. Please try again." };
    }
    const sessionUser = { id: found.id, name: found.name, email: found.email, role: found.role };
    localStorage.setItem('mesob_auth', JSON.stringify(sessionUser));
    setUser(sessionUser);
    return { success: true, message: "Login successful.", user: sessionUser };
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
