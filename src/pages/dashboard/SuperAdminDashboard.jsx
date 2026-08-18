import { useState } from 'react';
import { useAuth, ROLE_LABELS, ROLE_BADGE } from '../../context/AuthContext';
import { organizationsData } from '../../data/organizations';

// ─── Navigation sections ──────────────────────────────────────────
const SECTIONS = [
  'Dashboard',
  'User Management',
  'Institution Management',
  'Roles & Permissions',
  'System Settings',
  'Reports',
  'Analytics',
  'Announcements',
  'My Profile',
];

// ─── Role display helpers ─────────────────────────────────────────
const ROLE_COLORS = {
  super_admin:         'bg-purple-50 text-purple-800 border-purple-200',
  mesob_manager:       'bg-red-50 text-red-800 border-red-200',
  institution_manager: 'bg-orange-50 text-orange-800 border-orange-200',
  employee:            'bg-blue-50 text-blue-800 border-blue-200',
  technician:          'bg-cyan-50 text-cyan-800 border-cyan-200',
  citizen:             'bg-green-50 text-green-800 border-green-200',
};

// ─── Mock system data ─────────────────────────────────────────────
const mockAnnouncements = [
  { id: 1, title: 'Scheduled System Maintenance – Sat Aug 16',   body: 'System maintenance is planned for Aug 16, 2026 from 8–11 PM. All staff should complete pending operations before the window.', date: 'Aug 14, 2026', read: false, author: 'System Admin' },
  { id: 2, title: 'System Update v2.4.1 Released',               body: 'System update v2.4.1 has been deployed. Changes include improved queue processing performance and security patches. No action required from staff.', date: 'Aug 10, 2026', read: false, author: 'System Admin' },
  { id: 3, title: 'New Institution Onboarding – Labor & Skills', body: 'Labor & Skills Bureau has been onboarded to Hawassa MESOB. Institution Manager has been assigned. Services are now active.', date: 'Aug 05, 2026', read: true, author: 'System Admin' },
];

// System activity log - currently unused but available for future use
// const mockSystemActivity = [
//   { id: 1, event: 'User login',          user: 'manager@mesobcenter.et',    role: 'mesob_manager',  time: 'Aug 14, 2026  09:14' },
//   { id: 2, event: 'User login',          user: 'inst.manager@mesobcenter.et', role: 'institution_manager', time: 'Aug 14, 2026  09:02' },
//   { id: 3, event: 'New user registered', user: 'new.employee@mesobcenter.et', role: 'employee',      time: 'Aug 13, 2026  16:45' },
//   { id: 4, event: 'Role updated',        user: 'ict@mesobcenter.et',         role: 'technician',     time: 'Aug 12, 2026  11:30' },
//   { id: 5, event: 'User login',          user: 'citizen@example.com',        role: 'citizen',        time: 'Aug 12, 2026  10:05' },
// ];

// ─── Helpers ──────────────────────────────────────────────────────
function getStoredUsers() {
  try {
    const stored = localStorage.getItem('mesob_users');
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  // Fallback demo list — no passwords exposed
  return [
    { id: 1, name: 'Super Admin',         email: 'superadmin@mesobcenter.et', role: 'super_admin',         status: 'Active' },
    { id: 2, name: 'MESOB Manager',       email: 'manager@mesobcenter.et',    role: 'mesob_manager',       status: 'Active' },
    { id: 3, name: 'Institution Manager', email: 'inst.manager@mesobcenter.et', role: 'institution_manager', status: 'Active' },
    { id: 4, name: 'Abebe Kebede',        email: 'employee@mesobcenter.et',   role: 'employee',            status: 'Active' },
    { id: 5, name: 'Technician',          email: 'ict@mesobcenter.et',        role: 'technician',          status: 'Active' },
    { id: 6, name: 'Sara Hailu',          email: 'citizen@example.com',       role: 'citizen',             status: 'Active' },
  ];
}

function stripPassword(u) {
  // NEVER expose password — return only safe display fields
  return { id: u.id, name: u.name, email: u.email, role: u.role, status: u.status || 'Active' };
}

function RoleBadge({ role }) {
  const cls = ROLE_BADGE[role] || 'bg-gray-100 text-gray-700';
  return <span className={`badge ${cls}`}>{ROLE_LABELS[role] || role}</span>;
}

function StatusBadge({ status }) {
  const cls = status === 'Active' ? 'badge bg-green-100 text-green-800' : 'badge bg-gray-100 text-gray-600';
  return <span className={cls}>{status}</span>;
}

// ─── SECTION: Dashboard Overview ─────────────────────────────────
function SectionDashboard({ setActiveSection }) {
  const users = getStoredUsers().map(stripPassword);
  const unread = mockAnnouncements.filter(a => !a.read).length;

  return (
    <>
      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <p className="text-sm text-gray-500 mb-1">Total Users</p>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500 mb-1">Institutions</p>
          <p className="text-2xl font-bold">{organizationsData.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500 mb-1">Active Users</p>
          <p className="text-2xl font-bold text-green-600">{users.filter(u => u.status === 'Active').length}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500 mb-1">Announcements</p>
          <p className="text-2xl font-bold">{unread}</p>
          <p className="text-xs text-gray-500 mt-1">Unread</p>
        </div>
      </div>

      {/* User overview */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">User Overview</h2>
          <button onClick={() => setActiveSection('User Management')} className="text-sm text-blue-600 hover:underline font-medium">View all</button>
        </div>
        <div className="table-container border-0 rounded-none">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr></thead>
            <tbody>
              {users.slice(0, 5).map(u => (
                <tr key={u.id}>
                  <td className="font-medium">{u.name}</td>
                  <td>{u.email}</td>
                  <td><RoleBadge role={u.role} /></td>
                  <td><StatusBadge status={u.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Institution overview */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Institution Overview</h2>
          <button onClick={() => setActiveSection('Institution Management')} className="text-sm text-blue-600 hover:underline font-medium">View all</button>
        </div>
        <div className="table-container border-0 rounded-none">
          <table className="data-table">
            <thead><tr><th>Institution</th><th>Services</th><th>Status</th></tr></thead>
            <tbody>
              {organizationsData.slice(0, 5).map(org => (
                <tr key={org.id}>
                  <td className="font-medium">{org.name_en}</td>
                  <td>{org.services.length}</td>
                  <td><span className="badge bg-green-100 text-green-800">Active</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role overview cards */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Role Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          {Object.entries(ROLE_LABELS).map(([key, label]) => (
            <div key={key} className={`p-3 rounded-xl border ${ROLE_COLORS[key] || 'bg-gray-50 text-gray-800 border-gray-200'}`}>
              <strong>{label}</strong>
              <p className="text-xs mt-0.5 opacity-75">
                {users.filter(u => u.role === key).length} user{users.filter(u => u.role === key).length !== 1 ? 's' : ''}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl text-sm text-purple-900">
        <strong>System Admin:</strong> Full system access — user management, institution management, roles, settings, reports, and analytics.
      </div>
    </>
  );
}

// ─── SECTION: User Management ─────────────────────────────────────
function SectionUserManagement() {
  const [rawUsers, setRawUsers] = useState(() => getStoredUsers().map(stripPassword));
  const [query, setQuery] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [editUser, setEditUser] = useState(null); // { id, name, email, role, status }
  const [editError, setEditError] = useState('');

  const filtered = rawUsers.filter(u => {
    const q = query.toLowerCase();
    const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchR = !filterRole || u.role === filterRole;
    return matchQ && matchR;
  });

  function saveEdit(e) {
    e.preventDefault();
    if (!editUser.name.trim()) { setEditError('Name is required.'); return; }
    setRawUsers(prev => prev.map(u => u.id === editUser.id ? { ...editUser } : u));
    // Persist role change to localStorage (no password touched)
    try {
      const stored = localStorage.getItem('mesob_users');
      if (stored) {
        const all = JSON.parse(stored);
        const updated = all.map(u => u.id === editUser.id ? { ...u, name: editUser.name, role: editUser.role } : u);
        localStorage.setItem('mesob_users', JSON.stringify(updated));
      }
    } catch { /* ignore */ }
    setEditUser(null);
    setEditError('');
  }

  function toggleStatus(id) {
    setRawUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">User Management</h2>
        <p className="text-sm text-gray-500">Manage system users. Passwords are never displayed.</p>
      </div>

      {/* Edit modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="font-semibold text-gray-900 mb-5">Edit User</h3>
            <form onSubmit={saveEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input type="text" value={editUser.name} onChange={e => setEditUser(u => ({ ...u, name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none transition text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input type="email" value={editUser.email} disabled
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm cursor-not-allowed" />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed here.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                <select value={editUser.role} onChange={e => setEditUser(u => ({ ...u, role: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none transition text-sm bg-white">
                  {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              {editError && <p className="text-sm text-red-600">{editError}</p>}
              <div className="flex gap-3 pt-2">
                <button type="submit" className="px-5 py-2.5 bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-sm font-semibold rounded-xl transition">Save</button>
                <button type="button" onClick={() => { setEditUser(null); setEditError(''); }}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative max-w-xs flex-1">
          <input type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search name or email..."
            className="w-full px-4 py-2.5 pl-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none transition text-sm" />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none transition text-sm bg-white">
          <option value="">All Roles</option>
          {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">System Users</h3>
          <span className="text-sm text-gray-500">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="table-container border-0 rounded-none">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td className="font-medium">{u.name}</td>
                  <td>{u.email}</td>
                  <td><RoleBadge role={u.role} /></td>
                  <td><StatusBadge status={u.status} /></td>
                  <td>
                    <div className="flex gap-3">
                      <button onClick={() => setEditUser({ ...u })} className="text-blue-600 hover:underline text-sm font-medium">Edit</button>
                      <button onClick={() => toggleStatus(u.id)}
                        className={`text-sm font-medium ${u.status === 'Active' ? 'text-amber-600 hover:underline' : 'text-green-600 hover:underline'}`}>
                        {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl text-sm text-purple-900">
        <strong>Security:</strong> Passwords are never displayed or accessible through this interface.
      </div>
    </>
  );
}

// ─── SECTION: Institution Management ─────────────────────────────
function SectionInstitutionManagement() {
  // RBAC: Only super_admin may create/modify institutions.
  // This is enforced at route level (RequireAuth) AND here as a
  // defence-in-depth check so the Add Institution UI cannot be
  // reached even if the component were ever rendered in another context.
  const { user } = useAuth();
  const canCreate = user?.role === 'super_admin';
  const [institutions, setInstitutions] = useState(
    organizationsData.map(o => ({ ...o, status: 'Active' }))
  );
  const [form, setForm] = useState({ name_en: '', name_am: '', show: false });
  const [formError, setFormError] = useState('');

  function addInstitution(e) {
    e.preventDefault();
    if (!form.name_en.trim()) { setFormError('English name is required.'); return; }
    setInstitutions(prev => [...prev, {
      id: `custom-${Date.now()}`, name_en: form.name_en.trim(),
      name_am: form.name_am.trim() || form.name_en.trim(),
      image: '', services: [], status: 'Active',
    }]);
    setForm({ name_en: '', name_am: '', show: false });
    setFormError('');
  }

  function toggleStatus(id) {
    setInstitutions(prev => prev.map(o => o.id === id ? { ...o, status: o.status === 'Active' ? 'Inactive' : 'Active' } : o));
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Institution Management</h2>
          <p className="text-sm text-gray-500">Manage institutions registered in Hawassa MESOB.</p>
        </div>
        <button onClick={() => setForm(f => ({ ...f, show: !f.show }))}
          className="px-4 py-2 bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-sm font-semibold rounded-xl transition"
          style={{ display: canCreate ? 'block' : 'none' }}
          aria-hidden={!canCreate}
        >
          {form.show ? 'Cancel' : '+ Add Institution'}
        </button>
      </div>

      {form.show && canCreate && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 max-w-lg">
          <h3 className="font-semibold text-gray-900 mb-4">Add New Institution</h3>
          <form onSubmit={addInstitution} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">English Name <span className="text-red-500">*</span></label>
              <input type="text" value={form.name_en} onChange={e => setForm(f => ({ ...f, name_en: e.target.value }))}
                placeholder="e.g. Immigration Service"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none transition text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Amharic Name</label>
              <input type="text" value={form.name_am} onChange={e => setForm(f => ({ ...f, name_am: e.target.value }))}
                placeholder="e.g. የኢሚግሬሽን አገልግሎት"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none transition text-sm" />
            </div>
            {formError && <p className="text-sm text-red-600">{formError}</p>}
            <button type="submit" className="px-5 py-2.5 bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-sm font-semibold rounded-xl transition">
              Add Institution
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Registered Institutions</h3>
          <span className="text-sm text-gray-500">{institutions.length} total</span>
        </div>
        <div className="table-container border-0 rounded-none">
          <table className="data-table">
            <thead><tr><th>Institution</th><th>Amharic Name</th><th>Services</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {institutions.map(org => (
                <tr key={org.id}>
                  <td className="font-medium">{org.name_en}</td>
                  <td>{org.name_am}</td>
                  <td>{org.services.length}</td>
                  <td><StatusBadge status={org.status} /></td>
                  <td>
                    <button onClick={() => toggleStatus(org.id)}
                      className={`text-sm font-medium ${org.status === 'Active' ? 'text-amber-600 hover:underline' : 'text-green-600 hover:underline'}`}>
                      {org.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ─── SECTION: Roles & Permissions ────────────────────────────────
function SectionRolesPermissions() {
  const roleDefinitions = [
    { role: 'citizen',             label: 'Citizen',             color: ROLE_COLORS.citizen,             perms: ['View service requirements', 'Track own applications', 'View announcements', 'Submit contact forms'] },
    { role: 'employee',            label: 'Employee',            color: ROLE_COLORS.employee,            perms: ['Process assigned queue items', 'Search applications', 'View service requirements', 'View announcements'] },
    { role: 'technician',          label: 'Technician',          color: ROLE_COLORS.technician,          perms: ['View assigned technical tasks', 'Update task status', 'Submit maintenance reports', 'View announcements'] },
    { role: 'institution_manager', label: 'Institution Manager', color: ROLE_COLORS.institution_manager, perms: ['Monitor institution queue', 'Monitor applications', 'Assign tasks to Technicians', 'View maintenance', 'View institution reports', 'View announcements'] },
    { role: 'mesob_manager',       label: 'MESOB Manager',       color: ROLE_COLORS.mesob_manager,       perms: ['Monitor all institutions', 'Monitor MESOB-wide queue', 'Monitor applications', 'Monitor maintenance', 'View analytics', 'View reports', 'View announcements'] },
    { role: 'super_admin',         label: 'Super Admin',         color: ROLE_COLORS.super_admin,         perms: ['User Management', 'Institution Management', 'Roles & Permissions', 'System Settings', 'System Reports', 'System Analytics', 'Manage Announcements'] },
  ];

  const users = getStoredUsers().map(stripPassword);

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Roles & Permissions</h2>
        <p className="text-sm text-gray-500">Approved role structure for Hawassa MESOB.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {roleDefinitions.map(({ role, label, color, perms }) => (
          <div key={role} className={`rounded-2xl border p-5 ${color}`}>
            <div className="flex items-center justify-between mb-3">
              <strong className="text-sm">{label}</strong>
              <span className="text-xs opacity-70">{users.filter(u => u.role === role).length} user{users.filter(u => u.role === role).length !== 1 ? 's' : ''}</span>
            </div>
            <ul className="space-y-1">
              {perms.map((p, i) => (
                <li key={i} className="text-xs flex items-start gap-1.5">
                  <span className="mt-0.5">✔</span><span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl text-sm text-purple-900">
        <strong>Note:</strong> Role permissions are enforced by the system RBAC layer. Changes to role permissions require backend configuration.
      </div>
    </>
  );
}

// ─── SECTION: System Settings ─────────────────────────────────────
function SectionSystemSettings() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowSignup, setAllowSignup]         = useState(true);
  const [systemName, setSystemName]           = useState('Hawassa MESOB Public Service System');
  const [saved, setSaved]                     = useState(false);

  function handleSave(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">System Settings</h2>
        <p className="text-sm text-gray-500">System-level configuration for Hawassa MESOB.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-5">General Settings</h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">System Name</label>
              <input type="text" value={systemName} onChange={e => setSystemName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none transition text-sm" />
            </div>

            <div className="flex items-center justify-between py-3 border-t border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">Maintenance Mode</p>
                <p className="text-xs text-gray-500">When enabled, only Super Admin can access the system.</p>
              </div>
              <button type="button" onClick={() => setMaintenanceMode(m => !m)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${maintenanceMode ? 'bg-amber-500' : 'bg-gray-300'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">Allow New Registrations</p>
                <p className="text-xs text-gray-500">Allow new users to register accounts.</p>
              </div>
              <button type="button" onClick={() => setAllowSignup(v => !v)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${allowSignup ? 'bg-[#1e3a8a]' : 'bg-gray-300'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${allowSignup ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" className="px-6 py-3 bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold rounded-xl transition text-sm">
            Save Settings
          </button>
          {saved && <span className="text-sm text-green-600 font-medium">✓ Settings saved</span>}
        </div>
      </form>

      <div className="mt-6 p-4 bg-purple-50 border border-purple-100 rounded-xl text-sm text-purple-900">
        <strong>Security:</strong> Database credentials, API keys, and Telegram Bot tokens are never stored or displayed in the frontend.
      </div>
    </>
  );
}

// ─── SECTION: Reports ─────────────────────────────────────────────
function SectionReports() {
  const [activeTab, setActiveTab] = useState('users');
  const users = getStoredUsers().map(stripPassword);
  const tabs = [
    { key: 'users',        label: 'User Report'        },
    { key: 'institutions', label: 'Institution Report'  },
    { key: 'queue',        label: 'Queue Report'        },
    { key: 'maintenance',  label: 'Maintenance Report'  },
  ];

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Reports</h2>
        <p className="text-sm text-gray-500">System-wide administrative and operational reports.</p>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === t.key ? 'bg-[#1e3a8a] text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'users' && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Total Users</p><p className="text-2xl font-bold">{users.length}</p></div>
            <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Active</p><p className="text-2xl font-bold text-green-600">{users.filter(u => u.status === 'Active').length}</p></div>
            <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Roles in Use</p><p className="text-2xl font-bold">{new Set(users.map(u => u.role)).size}</p></div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100"><h3 className="font-semibold text-gray-900">User Report</h3></div>
            <div className="table-container border-0 rounded-none">
              <table className="data-table">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}><td className="font-medium">{u.name}</td><td>{u.email}</td><td><RoleBadge role={u.role} /></td><td><StatusBadge status={u.status} /></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'institutions' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Total Institutions</p><p className="text-2xl font-bold">{organizationsData.length}</p></div>
            <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Total Services</p><p className="text-2xl font-bold">{organizationsData.reduce((s, o) => s + o.services.length, 0)}</p></div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100"><h3 className="font-semibold text-gray-900">Institution Report</h3></div>
            <div className="table-container border-0 rounded-none">
              <table className="data-table">
                <thead><tr><th>Institution</th><th>Amharic Name</th><th>Services</th><th>Status</th></tr></thead>
                <tbody>
                  {organizationsData.map(org => (
                    <tr key={org.id}><td className="font-medium">{org.name_en}</td><td>{org.name_am}</td><td>{org.services.length}</td><td><span className="badge bg-green-100 text-green-800">Active</span></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'queue' && (
        <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm text-center text-gray-400">
          Queue report data will be available after backend integration. System-wide queue data is currently managed at the operational level.
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm text-center text-gray-400">
          Maintenance report data will be available after backend integration. Maintenance reports are managed by Technicians and Institution Managers.
        </div>
      )}

      <div className="mt-4 p-4 bg-purple-50 border border-purple-100 rounded-xl text-sm text-purple-900">
        <strong>Reports:</strong> System-wide reporting. Payment, appointment, and grievance reports are not part of the approved system scope.
      </div>
    </>
  );
}

// ─── SECTION: Analytics ───────────────────────────────────────────
function SectionAnalytics() {
  const users = getStoredUsers().map(stripPassword);
  const byRole = Object.entries(ROLE_LABELS).map(([k, v]) => ({ role: k, label: v, count: users.filter(u => u.role === k).length }));

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Analytics</h2>
        <p className="text-sm text-gray-500">System-wide overview using existing data.</p>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Total Users</p><p className="text-2xl font-bold">{users.length}</p></div>
        <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Institutions</p><p className="text-2xl font-bold">{organizationsData.length}</p></div>
        <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Total Services</p><p className="text-2xl font-bold">{organizationsData.reduce((s, o) => s + o.services.length, 0)}</p></div>
        <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Active Users</p><p className="text-2xl font-bold text-green-600">{users.filter(u => u.status === 'Active').length}</p></div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Users by Role</h3>
        <div className="space-y-3">
          {byRole.map(({ role, label, count }) => (
            <div key={role} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-40 flex-shrink-0">{label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div className="h-2.5 rounded-full bg-[#1e3a8a] transition-all duration-300"
                  style={{ width: users.length ? `${(count / users.length) * 100}%` : '0%' }} />
              </div>
              <span className="text-sm font-medium text-gray-900 w-6 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Services per Institution</h3>
        <div className="space-y-3">
          {organizationsData.map(org => (
            <div key={org.id} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-52 flex-shrink-0 truncate">{org.name_en}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div className="h-2.5 rounded-full bg-orange-400 transition-all duration-300"
                  style={{ width: `${(org.services.length / 4) * 100}%` }} />
              </div>
              <span className="text-sm font-medium text-gray-900 w-6 text-right">{org.services.length}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl text-sm text-purple-900">
        <strong>Analytics:</strong> System-level metrics. Financial, payment, and appointment analytics are not part of the approved system scope.
      </div>
    </>
  );
}

// ─── SECTION: Announcements ───────────────────────────────────────
function SectionAnnouncements() {
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [selected, setSelected] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ title: '', body: '' });
  const [formError, setFormError] = useState('');

  function markRead(id) {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  }

  function publishAnnouncement(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) { setFormError('Title and body are required.'); return; }
    const newAnn = {
      id: Date.now(),
      title: form.title.trim(),
      body: form.body.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      read: false,
      author: 'System Admin',
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    setForm({ title: '', body: '' });
    setFormError('');
    setShowNew(false);
  }

  if (selected) {
    const ann = announcements.find(a => a.id === selected);
    return (
      <>
        <div className="mb-6">
          <button onClick={() => setSelected(null)} className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            Back to Announcements
          </button>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{ann.title}</h2>
            {!ann.read && <span className="badge bg-blue-100 text-blue-800 flex-shrink-0">New</span>}
          </div>
          <p className="text-xs text-gray-500 mb-4">{ann.date} · {ann.author}</p>
          <p className="text-sm text-gray-700 leading-relaxed">{ann.body}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Announcements</h2>
          <p className="text-sm text-gray-500">System-level announcements and notifications.</p>
        </div>
        <button onClick={() => setShowNew(v => !v)}
          className="px-4 py-2 bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-sm font-semibold rounded-xl transition">
          {showNew ? 'Cancel' : '+ New Announcement'}
        </button>
      </div>

      {showNew && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 max-w-2xl">
          <h3 className="font-semibold text-gray-900 mb-4">Create Announcement</h3>
          <form onSubmit={publishAnnouncement} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Title <span className="text-red-500">*</span></label>
              <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Announcement title"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none transition text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Body <span className="text-red-500">*</span></label>
              <textarea rows={4} value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                placeholder="Announcement content..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none transition text-sm resize-y" />
            </div>
            {formError && <p className="text-sm text-red-600">{formError}</p>}
            <button type="submit" className="px-5 py-2.5 bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-sm font-semibold rounded-xl transition">
              Publish
            </button>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {announcements.map(ann => (
          <div key={ann.id} onClick={() => { setSelected(ann.id); markRead(ann.id); }}
            className={`bg-white rounded-2xl border shadow-sm p-5 cursor-pointer hover:shadow-md transition-all duration-200 ${ann.read ? 'border-gray-100' : 'border-blue-200 bg-blue-50/30'}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {!ann.read && <span className="inline-block w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />}
                  <h3 className="font-semibold text-sm text-gray-900 leading-snug">{ann.title}</h3>
                </div>
                <p className="text-xs text-gray-500">{ann.date} · {ann.author}</p>
              </div>
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── SECTION: My Profile ──────────────────────────────────────────
function SectionMyProfile({ user }) {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">My Profile</h2>
        <p className="text-sm text-gray-500">Your System Admin account information.</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 max-w-lg">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-14 h-14 rounded-2xl bg-purple-700 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
            {user?.name?.charAt(0) || 'S'}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="badge bg-purple-100 text-purple-800 mt-1">Super Admin</span>
          </div>
        </div>
        <div className="space-y-4 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Full Name</span><span className="font-medium text-gray-900">{user?.name}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-medium text-gray-900">{user?.email}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Role</span><span className="font-medium text-gray-900">Super Admin</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Access Level</span><span className="font-medium text-gray-900">System-wide</span></div>
        </div>
      </div>
      <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl text-sm text-purple-900">
        <strong>Security:</strong> Passwords and authentication secrets are never displayed. To change your password, use the authentication system.
      </div>
    </>
  );
}

// ─── Main SuperAdminDashboard ─────────────────────────────────────
export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function navigate(section) {
    setActiveSection(section);
    setSidebarOpen(false);
  }

  function renderSection() {
    switch (activeSection) {
      case 'Dashboard':             return <SectionDashboard setActiveSection={navigate} />;
      case 'User Management':       return <SectionUserManagement />;
      case 'Institution Management':return <SectionInstitutionManagement />;
      case 'Roles & Permissions':   return <SectionRolesPermissions />;
      case 'System Settings':       return <SectionSystemSettings />;
      case 'Reports':               return <SectionReports />;
      case 'Analytics':             return <SectionAnalytics />;
      case 'Announcements':         return <SectionAnnouncements />;
      case 'My Profile':            return <SectionMyProfile user={user} />;
      default:                      return <SectionDashboard setActiveSection={navigate} />;
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex min-h-screen">

        {/* ── Sidebar ── */}
        <aside className={`db-sidebar fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200${sidebarOpen ? ' open' : ''}`}>
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center font-bold text-lg">S</div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">MESOB Center</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {SECTIONS.map(section => (
              <button key={section} onClick={() => navigate(section)}
                className={`sidebar-link w-full text-left${activeSection === section ? ' active' : ''}`}>
                {section}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <button onClick={() => { localStorage.removeItem('mesob_auth'); window.location.href = '/'; }}
              className="sidebar-link w-full text-left text-red-600 hover:bg-red-50">
              Logout
            </button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setSidebarOpen(o => !o)} aria-label="Toggle sidebar">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>
                </svg>
              </button>
              <h1 className="text-lg font-semibold text-gray-900">
                {activeSection === 'Dashboard' ? 'System Admin Dashboard' : activeSection}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="badge bg-purple-100 text-purple-800">Super Admin</span>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 lg:p-8">
            {renderSection()}
          </main>
        </div>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
