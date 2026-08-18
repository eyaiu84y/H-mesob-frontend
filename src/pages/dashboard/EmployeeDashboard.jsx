import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { organizationsData } from '../../data/organizations';

// ─── Navigation sections ────────────────────────────────────────
const SECTIONS = [
  'Dashboard',
  'My Queue',
  'Search Applications',
  'Service Requirements',
  'Reports',
  'Announcements',
  'My Profile',
];

// ─── Mock static data (structured for future API replacement) ───

const mockQueue = [
  { id: '#Q-8841', citizen: 'Meron Tadesse',  service: 'National ID Registration', priority: 'High',   status: 'Waiting' },
  { id: '#Q-8840', citizen: 'Kebede Worku',   service: 'Business License',          priority: 'Medium', status: 'Waiting' },
  { id: '#Q-8839', citizen: 'Selamawit A.',   service: 'Tax Clearance',             priority: 'Normal', status: 'Processing' },
  { id: '#Q-8835', citizen: 'Tigist Alemu',   service: 'SIM Card Registration',     priority: 'Normal', status: 'Waiting' },
];

const mockApplications = [
  { id: '#APP-1024', citizen: 'Meron Tadesse',  institution: 'National ID Program',  service: 'National ID Registration',     submitted: 'Aug 11, 2026', status: 'Pending' },
  { id: '#APP-0987', citizen: 'Kebede Worku',   institution: 'Trade & Market Bureau', service: 'Business License',             submitted: 'Aug 05, 2026', status: 'In Review' },
  { id: '#APP-0851', citizen: 'Selamawit A.',   institution: 'Ministry of Revenues', service: 'Tax Clearance',                submitted: 'Jul 22, 2026', status: 'Completed' },
  { id: '#APP-0790', citizen: 'Dawit Bekele',   institution: 'Ethio Telecom',        service: 'SIM Card Registration',        submitted: 'Jul 18, 2026', status: 'Pending' },
];

const mockAnnouncements = [
  { id: 1, title: 'System Maintenance – Saturday 8 PM',         body: 'The system will be under maintenance on Saturday, Aug 16, 2026 from 8 PM to 11 PM. Please complete pending queue items before that time.', date: 'Aug 14, 2026', read: false },
  { id: 2, title: 'Updated Service Requirements – National ID',  body: 'The National ID Program has updated required documents for ID registration. Please review the updated service requirements before processing related applications.', date: 'Aug 12, 2026', read: false },
  { id: 3, title: 'Queue Processing Guidelines Reminder',        body: 'All employees are reminded to update queue item status to "Completed" immediately after processing. Do not leave items in "Processing" status at end of shift.', date: 'Aug 10, 2026', read: true },
];



// ─── Priority badge helper ───────────────────────────────────────
function PriorityBadge({ priority }) {
  const cls = {
    High:   'badge bg-red-100 text-red-800',
    Medium: 'badge bg-amber-100 text-amber-800',
    Normal: 'badge bg-gray-100 text-gray-700',
  }[priority] || 'badge bg-gray-100 text-gray-700';
  return <span className={cls}>{priority}</span>;
}

// ─── Status badge helper ─────────────────────────────────────────
function StatusBadge({ status }) {
  const cls = {
    Pending:    'badge bg-amber-100 text-amber-800',
    'In Review':'badge bg-blue-100 text-blue-800',
    Completed:  'badge bg-green-100 text-green-800',
    Waiting:    'badge bg-amber-100 text-amber-800',
    Processing: 'badge bg-blue-100 text-blue-800',
    'In Progress':'badge bg-blue-100 text-blue-800',
  }[status] || 'badge bg-gray-100 text-gray-700';
  return <span className={cls}>{status}</span>;
}

// ─── SECTION: Dashboard Overview ────────────────────────────────
function SectionDashboard({ setActiveSection }) {
  const unreadCount = mockAnnouncements.filter(a => !a.read).length;
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="stat-card">
          <p className="text-sm text-gray-500 mb-1">In My Queue</p>
          <p className="text-2xl font-bold">14</p>
          <p className="text-xs text-amber-600 mt-1">3 high priority</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500 mb-1">Processed Today</p>
          <p className="text-2xl font-bold">27</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500 mb-1">Announcements</p>
          <p className="text-2xl font-bold">{unreadCount}</p>
          <p className="text-xs text-gray-500 mt-1">Unread</p>
        </div>
      </div>

      {/* Queue preview */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">My Processing Queue</h2>
          <button
            onClick={() => setActiveSection('My Queue')}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            View all
          </button>
        </div>
        <div className="table-container border-0 rounded-none">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Citizen</th>
                <th>Service</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {mockQueue.slice(0, 3).map(item => (
                <tr key={item.id}>
                  <td className="font-medium">{item.id}</td>
                  <td>{item.citizen}</td>
                  <td>{item.service}</td>
                  <td><PriorityBadge priority={item.priority} /></td>
                  <td><StatusBadge status={item.status} /></td>
                  <td>
                    <button className="text-blue-600 hover:underline text-sm font-medium">
                      Process
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800">
        <strong>Employee:</strong> Process assigned applications and manage the assigned service queue. You cannot manage users, institutions, or system settings.
      </div>
    </>
  );
}

// ─── SECTION: My Queue ───────────────────────────────────────────
function SectionMyQueue() {
  const [queue, setQueue] = useState(mockQueue);

  function handleProcess(id) {
    setQueue(prev => prev.map(item =>
      item.id === id
        ? { ...item, status: item.status === 'Waiting' ? 'Processing' : 'Completed' }
        : item
    ));
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">My Queue</h2>
        <p className="text-sm text-gray-500">Queue items assigned to you for processing.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Queue Management</h3>
          <span className="text-sm text-gray-500">{queue.filter(q => q.status !== 'Completed').length} active items</span>
        </div>
        <div className="table-container border-0 rounded-none">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Citizen</th>
                <th>Service</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {queue.map(item => (
                <tr key={item.id}>
                  <td className="font-medium">{item.id}</td>
                  <td>{item.citizen}</td>
                  <td>{item.service}</td>
                  <td><PriorityBadge priority={item.priority} /></td>
                  <td><StatusBadge status={item.status} /></td>
                  <td>
                    {item.status !== 'Completed' ? (
                      <button
                        onClick={() => handleProcess(item.id)}
                        className="text-blue-600 hover:underline text-sm font-medium"
                      >
                        {item.status === 'Waiting' ? 'Process' : 'Complete'}
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">Done</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800">
        <strong>Queue Status Flow:</strong> Waiting → Processing → Completed. Update status as you process each item.
      </div>
    </>
  );
}

// ─── SECTION: Search Applications ───────────────────────────────
function SectionSearchApplications() {
  const [query, setQuery] = useState('');

  const filtered = mockApplications.filter(app => {
    const q = query.toLowerCase();
    return (
      app.id.toLowerCase().includes(q) ||
      app.citizen.toLowerCase().includes(q) ||
      app.service.toLowerCase().includes(q) ||
      app.status.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Search Applications</h2>
        <p className="text-sm text-gray-500">Search by Application ID, citizen name, service, or status.</p>
      </div>

      {/* Search input */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search applications..."
            className="w-full px-4 py-2.5 pl-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-sm"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Application Tracking</h3>
          <span className="text-sm text-gray-500">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="table-container border-0 rounded-none">
          <table className="data-table">
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Citizen</th>
                <th>Institution</th>
                <th>Service</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-gray-400 py-6">
                    No applications match your search.
                  </td>
                </tr>
              ) : filtered.map(app => (
                <tr key={app.id}>
                  <td className="font-medium">{app.id}</td>
                  <td>{app.citizen}</td>
                  <td>{app.institution}</td>
                  <td>{app.service}</td>
                  <td>{app.submitted}</td>
                  <td><StatusBadge status={app.status} /></td>
                  <td>
                    <button className="text-blue-600 hover:underline text-sm font-medium">
                      View
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

// ─── SECTION: Service Requirements ──────────────────────────────
function SectionServiceRequirements() {
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [openSvc, setOpenSvc] = useState(null);

  if (selectedOrg) {
    const org = organizationsData.find(o => o.id === selectedOrg);
    return (
      <>
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => { setSelectedOrg(null); setOpenSvc(null); }}
            className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Institutions
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-sm font-semibold text-gray-900">{org.name_en}</span>
        </div>

        <div className="space-y-3">
          {org.services.map((svc, i) => (
            <div key={i} className={`svc-item${openSvc === i ? ' open' : ''}`}>
              <button
                type="button"
                className="svc-toggle"
                onClick={() => setOpenSvc(openSvc === i ? null : i)}
              >
                <span>{svc.title_en}</span>
                <svg className="svc-chevron" xmlns="http://www.w3.org/2000/svg"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="svc-panel">
                <div className="svc-meta">
                  <div><span>Processing Time</span><br /><strong>{svc.time}</strong></div>
                  <div><span>Service Fee</span><br /><strong>{svc.fee}</strong></div>
                </div>
                <div className="svc-docs-title">Documents Required</div>
                <ul className="svc-docs">
                  {svc.docs_en.map((doc, j) => <li key={j}>{doc}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Service Requirements</h2>
        <p className="text-sm text-gray-500">View required documents, fees, and processing time for each institution and service.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {organizationsData.map(org => (
          <button
            key={org.id}
            onClick={() => setSelectedOrg(org.id)}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-left hover:border-blue-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={org.image}
                alt={org.name_en}
                className="w-10 h-10 object-contain rounded-lg bg-gray-50 p-1"
                onError={e => { e.target.style.display = 'none'; }}
              />
              <span className="font-semibold text-sm text-gray-900 leading-snug">{org.name_en}</span>
            </div>
            <p className="text-xs text-gray-500">
              {org.services.length} service{org.services.length !== 1 ? 's' : ''}
            </p>
          </button>
        ))}
      </div>
    </>
  );
}

// ─── SECTION: Reports ────────────────────────────────────────────
function SectionReports() {
  const completed = mockApplications.filter(a => a.status === 'Completed').length;
  const pending   = mockApplications.filter(a => a.status === 'Pending').length;
  const inReview  = mockApplications.filter(a => a.status === 'In Review').length;

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Reports</h2>
        <p className="text-sm text-gray-500">Your operational activity summary.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="stat-card">
          <p className="text-sm text-gray-500 mb-1">Completed Today</p>
          <p className="text-2xl font-bold text-green-600">27</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500 mb-1">Processed This Week</p>
          <p className="text-2xl font-bold">134</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500 mb-1">Avg. Processing Time</p>
          <p className="text-2xl font-bold">1.4 days</p>
        </div>
      </div>

      {/* Application status breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Application Status Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
            <span className="badge bg-green-100 text-green-800">Completed</span>
            <span className="text-2xl font-bold text-gray-900">{completed}</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
            <span className="badge bg-amber-100 text-amber-800">Pending</span>
            <span className="text-2xl font-bold text-gray-900">{pending}</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
            <span className="badge bg-blue-100 text-blue-800">In Review</span>
            <span className="text-2xl font-bold text-gray-900">{inReview}</span>
          </div>
        </div>
      </div>

      {/* Queue activity */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Recent Queue Activity</h3>
        </div>
        <div className="table-container border-0 rounded-none">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Service</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockQueue.map(item => (
                <tr key={item.id}>
                  <td className="font-medium">{item.id}</td>
                  <td>{item.service}</td>
                  <td><PriorityBadge priority={item.priority} /></td>
                  <td><StatusBadge status={item.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800">
        <strong>Note:</strong> Reports reflect your personal operational scope. MESOB-wide analytics are available to MESOB Manager and Super Admin only.
      </div>
    </>
  );
}

// ─── SECTION: Announcements ──────────────────────────────────────
function SectionAnnouncements() {
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [selected, setSelected] = useState(null);

  function markRead(id) {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  }

  if (selected) {
    const ann = announcements.find(a => a.id === selected);
    return (
      <>
        <div className="mb-6">
          <button
            onClick={() => setSelected(null)}
            className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Announcements
          </button>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{ann.title}</h2>
            {!ann.read && (
              <span className="badge bg-blue-100 text-blue-800 flex-shrink-0">New</span>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-4">{ann.date}</p>
          <p className="text-sm text-gray-700 leading-relaxed">{ann.body}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Announcements</h2>
        <p className="text-sm text-gray-500">Operational announcements and notifications.</p>
      </div>

      <div className="space-y-3">
        {announcements.map(ann => (
          <div
            key={ann.id}
            onClick={() => { setSelected(ann.id); markRead(ann.id); }}
            className={`bg-white rounded-2xl border shadow-sm p-5 cursor-pointer hover:shadow-md transition-all duration-200 ${
              ann.read ? 'border-gray-100' : 'border-blue-200 bg-blue-50/30'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {!ann.read && (
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                  )}
                  <h3 className="font-semibold text-sm text-gray-900 leading-snug">{ann.title}</h3>
                </div>
                <p className="text-xs text-gray-500">{ann.date}</p>
              </div>
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── SECTION: My Profile ─────────────────────────────────────────
function SectionMyProfile({ user }) {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">My Profile</h2>
        <p className="text-sm text-gray-500">Your account information.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 max-w-lg">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
            {user?.name?.charAt(0) || 'E'}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="badge bg-blue-100 text-blue-800 mt-1">Employee</span>
          </div>
        </div>
        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Full Name</span>
            <span className="font-medium text-gray-900">{user?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Email</span>
            <span className="font-medium text-gray-900">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Role</span>
            <span className="font-medium text-gray-900">Employee</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Institution</span>
            <span className="font-medium text-gray-900">MESOB Center</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800">
        <strong>Note:</strong> To update your profile information or change your password, contact your Institution Manager or MESOB administration.
      </div>
    </>
  );
}

// ─── Main EmployeeDashboard ──────────────────────────────────────
export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function navigate(section) {
    setActiveSection(section);
    setSidebarOpen(false);
  }

  function renderSection() {
    switch (activeSection) {
      case 'Dashboard':            return <SectionDashboard setActiveSection={navigate} />;
      case 'My Queue':             return <SectionMyQueue />;
      case 'Search Applications':  return <SectionSearchApplications />;
      case 'Service Requirements': return <SectionServiceRequirements />;
      case 'Reports':              return <SectionReports />;
      case 'Announcements':        return <SectionAnnouncements />;
      case 'My Profile':           return <SectionMyProfile user={user} />;
      default:                     return <SectionDashboard setActiveSection={navigate} />;
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex min-h-screen">

        {/* ── Sidebar ── */}
        <aside className={`db-sidebar fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200${sidebarOpen ? ' open' : ''}`}>
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                E
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">MESOB Center</p>
                <p className="text-xs text-gray-500">Employee Portal</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {SECTIONS.map(section => (
              <button
                key={section}
                onClick={() => navigate(section)}
                className={`sidebar-link w-full text-left${activeSection === section ? ' active' : ''}`}
              >
                {section}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <button
              onClick={() => { localStorage.removeItem('mesob_auth'); window.location.href = '/'; }}
              className="sidebar-link w-full text-left text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-3">
              {/* Mobile hamburger */}
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setSidebarOpen(o => !o)}
                aria-label="Toggle sidebar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <line x1="4" x2="20" y1="6" y2="6"/>
                  <line x1="4" x2="20" y1="12" y2="12"/>
                  <line x1="4" x2="20" y1="18" y2="18"/>
                </svg>
              </button>
              <h1 className="text-lg font-semibold text-gray-900">
                {activeSection === 'Dashboard' ? 'Employee Dashboard' : activeSection}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="badge bg-blue-100 text-blue-800">Employee</span>
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

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
