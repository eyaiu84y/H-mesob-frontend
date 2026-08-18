import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { organizationsData } from '../../data/organizations';

// ─── Navigation sections ──────────────────────────────────────────
const SECTIONS = [
  'Dashboard',
  'Institution Monitoring',
  'Queue Monitoring',
  'Application Monitoring',
  'Maintenance Oversight',
  'Reports',
  'Analytics',
  'Announcements',
  'My Profile',
];

// ─── Mock MESOB-wide operational data ────────────────────────────
// Structured per institution — keyed by organizationsData id
const mockInstitutionStats = {
  justice:      { queue: 6,  applications: 11, maintenance: 1, status: 'Normal' },
  fayda:        { queue: 24, applications: 31, maintenance: 2, status: 'Busy'   },
  revenue:      { queue: 9,  applications: 18, maintenance: 0, status: 'Normal' },
  land:         { queue: 4,  applications: 7,  maintenance: 1, status: 'Normal' },
  labor:        { queue: 7,  applications: 12, maintenance: 0, status: 'Normal' },
  cbe:          { queue: 15, applications: 22, maintenance: 1, status: 'Busy'   },
  'sidama-bank':{ queue: 5,  applications: 8,  maintenance: 0, status: 'Normal' },
  ethiotel:     { queue: 19, applications: 29, maintenance: 3, status: 'Busy'   },
  trade:        { queue: 8,  applications: 14, maintenance: 1, status: 'Normal' },
  ethiopost:    { queue: 3,  applications: 5,  maintenance: 0, status: 'Normal' },
  electric:     { queue: 11, applications: 16, maintenance: 2, status: 'Normal' },
  urban:        { queue: 6,  applications: 10, maintenance: 1, status: 'Normal' },
};

const mockQueueItems = [
  { id: '#Q-8841', institution: 'National ID Program',    citizen: 'Meron Tadesse', service: 'National ID Registration', priority: 'High',   status: 'Waiting'    },
  { id: '#Q-8840', institution: 'National ID Program',    citizen: 'Kebede Worku',  service: 'ID Card Replacement',      priority: 'Medium', status: 'Processing' },
  { id: '#Q-8839', institution: 'Commercial Bank of Ethiopia', citizen: 'Selamawit A.', service: 'Account Opening',     priority: 'Normal', status: 'Waiting'    },
  { id: '#Q-8835', institution: 'Ethio Telecom',          citizen: 'Tigist Alemu',  service: 'SIM Card Registration',    priority: 'Normal', status: 'Waiting'    },
  { id: '#Q-8831', institution: 'Ministry of Revenues',   citizen: 'Dawit Bekele',  service: 'TIN Registration',         priority: 'High',   status: 'Waiting'    },
  { id: '#Q-8828', institution: 'Ethio Telecom',          citizen: 'Aziza W.',      service: 'Enterprise Service',       priority: 'Medium', status: 'Processing' },
  { id: '#Q-8820', institution: 'National ID Program',    citizen: 'Solomon G.',    service: 'Fayda Data Update',        priority: 'Normal', status: 'Completed'  },
];

const mockApplications = [
  { id: '#APP-1024', institution: 'National ID Program',        service: 'National ID Registration', submitted: 'Aug 11, 2026', status: 'Pending'     },
  { id: '#APP-1020', institution: 'National ID Program',        service: 'ID Card Replacement',      submitted: 'Aug 10, 2026', status: 'Waiting'     },
  { id: '#APP-1015', institution: 'National ID Program',        service: 'National ID Registration', submitted: 'Aug 08, 2026', status: 'In Progress' },
  { id: '#APP-1010', institution: 'Commercial Bank of Ethiopia', service: 'Account Opening',         submitted: 'Aug 07, 2026', status: 'Completed'   },
  { id: '#APP-1005', institution: 'Ethio Telecom',              service: 'SIM Card Registration',    submitted: 'Aug 06, 2026', status: 'Completed'   },
  { id: '#APP-0998', institution: 'Ministry of Revenues',       service: 'VAT Registration',         submitted: 'Aug 05, 2026', status: 'Pending'     },
  { id: '#APP-0990', institution: 'Ethio Telecom',              service: 'Enterprise Service',        submitted: 'Aug 03, 2026', status: 'In Progress' },
];

const mockMaintenanceItems = [
  { id: '#TASK-101', institution: 'National ID Program',    title: 'Replace network switch – Room 3B', priority: 'High',   technician: 'Technician', status: 'In Progress', report: null          },
  { id: '#TASK-098', institution: 'National ID Program',    title: 'Inspect UPS units – Server room',  priority: 'Medium', technician: 'Technician', status: 'Completed',   report: '#RPT-055'    },
  { id: '#TASK-094', institution: 'Ethio Telecom',          title: 'Fix printer – Counter 2',          priority: 'Normal', technician: 'Unassigned',  status: 'Assigned',    report: null          },
  { id: '#TASK-091', institution: 'Commercial Bank of Ethiopia', title: 'Network cable replacement',  priority: 'Medium', technician: 'Technician', status: 'In Progress', report: null          },
  { id: '#TASK-087', institution: 'Ministry of Revenues',   title: 'OS update – Admin workstations',   priority: 'Normal', technician: 'Technician', status: 'Completed',   report: '#RPT-051'    },
];

const mockAnnouncements = [
  { id: 1, title: 'Scheduled System Maintenance – Sat Aug 16',  body: 'A system maintenance window is planned for Saturday, Aug 16, 2026 from 8 PM to 11 PM. All Institution Managers must ensure pending operations are completed before that time. Technicians should be on standby.', date: 'Aug 14, 2026', read: false },
  { id: 2, title: 'Q3 Operational Performance Review',           body: 'The Q3 2026 operational performance review is scheduled for August 20, 2026. All MESOB operations data for July–August must be compiled and submitted to the MESOB Manager by August 18.', date: 'Aug 12, 2026', read: false },
  { id: 3, title: 'Updated Service Requirements – National ID', body: 'The National ID Program has updated required documents for ID registration services. Institution Managers should ensure staff are informed. The updated requirements are visible in the Service Requirements section.', date: 'Aug 10, 2026', read: true  },
  { id: 4, title: 'Citizen Satisfaction Rate – July 2026',      body: 'The MESOB Center achieved a 98.7% citizen satisfaction rate in July 2026. Congratulations to all Institution Managers and their teams. Continue maintaining high service standards.', date: 'Aug 05, 2026', read: true  },
];

// ─── Badge helpers ────────────────────────────────────────────────
function PriorityBadge({ priority }) {
  const cls = { High: 'badge bg-red-100 text-red-800', Medium: 'badge bg-amber-100 text-amber-800', Normal: 'badge bg-gray-100 text-gray-700' }[priority] || 'badge bg-gray-100 text-gray-700';
  return <span className={cls}>{priority}</span>;
}

function StatusBadge({ status }) {
  const cls = {
    Normal: 'badge bg-green-100 text-green-800',
    Busy:   'badge bg-amber-100 text-amber-800',
    Pending: 'badge bg-amber-100 text-amber-800',
    Waiting: 'badge bg-amber-100 text-amber-800',
    Assigned: 'badge bg-amber-100 text-amber-800',
    'In Progress': 'badge bg-blue-100 text-blue-800',
    Processing: 'badge bg-blue-100 text-blue-800',
    Completed: 'badge bg-green-100 text-green-800',
    Submitted: 'badge bg-green-100 text-green-800',
  }[status] || 'badge bg-gray-100 text-gray-700';
  return <span className={cls}>{status}</span>;
}

// ─── SECTION: Dashboard Overview ─────────────────────────────────
function SectionDashboard({ setActiveSection }) {
  const totalInstitutions = organizationsData.length;
  const totalQueue        = Object.values(mockInstitutionStats).reduce((s, i) => s + i.queue, 0);
  const totalApps         = Object.values(mockInstitutionStats).reduce((s, i) => s + i.applications, 0);
  const totalMaint        = Object.values(mockInstitutionStats).reduce((s, i) => s + i.maintenance, 0);

  return (
    <>
      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <p className="text-sm text-gray-500 mb-1">Institutions</p>
          <p className="text-2xl font-bold">{totalInstitutions}</p>
          <p className="text-xs text-gray-500 mt-1">Active under MESOB</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500 mb-1">Queue Status</p>
          <p className="text-2xl font-bold">{totalQueue}</p>
          <p className="text-xs text-amber-600 mt-1">Active tickets</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500 mb-1">Applications</p>
          <p className="text-2xl font-bold">{totalApps}</p>
          <p className="text-xs text-gray-500 mt-1">MESOB-wide</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500 mb-1">Maintenance</p>
          <p className="text-2xl font-bold">{totalMaint}</p>
          <p className="text-xs text-gray-500 mt-1">Open tasks</p>
        </div>
      </div>

      {/* Institution overview table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Institution Overview</h2>
          <button onClick={() => setActiveSection('Institution Monitoring')} className="text-sm text-blue-600 hover:underline font-medium">View all</button>
        </div>
        <div className="table-container border-0 rounded-none">
          <table className="data-table">
            <thead>
              <tr><th>Institution</th><th>Queue</th><th>Applications</th><th>Maintenance</th><th>Status</th></tr>
            </thead>
            <tbody>
              {organizationsData.slice(0, 6).map(org => {
                const s = mockInstitutionStats[org.id] || { queue: 0, applications: 0, maintenance: 0, status: 'Normal' };
                return (
                  <tr key={org.id}>
                    <td className="font-medium">{org.name_en}</td>
                    <td>{s.queue}</td>
                    <td>{s.applications}</td>
                    <td>{s.maintenance}</td>
                    <td><StatusBadge status={s.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Queue + Maintenance row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Queue snapshot */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Queue Snapshot</h2>
            <button onClick={() => setActiveSection('Queue Monitoring')} className="text-sm text-blue-600 hover:underline font-medium">View all</button>
          </div>
          <div className="table-container border-0 rounded-none">
            <table className="data-table">
              <thead><tr><th>Ticket</th><th>Institution</th><th>Priority</th><th>Status</th></tr></thead>
              <tbody>
                {mockQueueItems.filter(q => q.status !== 'Completed').slice(0, 4).map(q => (
                  <tr key={q.id}>
                    <td className="font-medium">{q.id}</td>
                    <td>{q.institution}</td>
                    <td><PriorityBadge priority={q.priority} /></td>
                    <td><StatusBadge status={q.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Maintenance snapshot */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Maintenance Snapshot</h2>
            <button onClick={() => setActiveSection('Maintenance Oversight')} className="text-sm text-blue-600 hover:underline font-medium">View all</button>
          </div>
          <div className="table-container border-0 rounded-none">
            <table className="data-table">
              <thead><tr><th>Task ID</th><th>Institution</th><th>Priority</th><th>Status</th></tr></thead>
              <tbody>
                {mockMaintenanceItems.filter(t => t.status !== 'Completed').slice(0, 4).map(t => (
                  <tr key={t.id}>
                    <td className="font-medium">{t.id}</td>
                    <td>{t.institution}</td>
                    <td><PriorityBadge priority={t.priority} /></td>
                    <td><StatusBadge status={t.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-800">
        <strong>MESOB Manager:</strong> Monitor institution operations, queue conditions, applications, and maintenance across Hawassa MESOB. System administration belongs to Super Admin.
      </div>
    </>
  );
}

// ─── SECTION: Institution Monitoring ─────────────────────────────
function SectionInstitutionMonitoring() {
  const [selected, setSelected] = useState(null);

  if (selected) {
    const org = organizationsData.find(o => o.id === selected);
    const s   = mockInstitutionStats[selected] || { queue: 0, applications: 0, maintenance: 0, status: 'Normal' };
    return (
      <>
        <div className="mb-6">
          <button onClick={() => setSelected(null)} className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            Back to Institutions
          </button>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <img src={org.image} alt={org.name_en} className="w-14 h-14 object-contain rounded-xl bg-gray-50 p-1" onError={e => { e.target.style.display = 'none'; }} />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{org.name_en}</h2>
              <p className="text-sm text-gray-500">{org.name_am}</p>
              <StatusBadge status={s.status} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Active Queue</p><p className="text-2xl font-bold">{s.queue}</p></div>
            <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Applications</p><p className="text-2xl font-bold">{s.applications}</p></div>
            <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Maintenance Tasks</p><p className="text-2xl font-bold">{s.maintenance}</p></div>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#1e3a8a] uppercase tracking-wider mb-3">Services Offered</p>
            <div className="space-y-2">
              {org.services.map((svc, i) => (
                <div key={i} className="flex items-start justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm">
                  <span className="font-medium text-gray-900">{svc.title_en}</span>
                  <span className="text-gray-500 ml-4 flex-shrink-0">{svc.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Institution Monitoring</h2>
        <p className="text-sm text-gray-500">Monitor all institutions operating under Hawassa MESOB.</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="table-container border-0 rounded-none">
          <table className="data-table">
            <thead><tr><th>Institution</th><th>Queue</th><th>Applications</th><th>Maintenance</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {organizationsData.map(org => {
                const s = mockInstitutionStats[org.id] || { queue: 0, applications: 0, maintenance: 0, status: 'Normal' };
                return (
                  <tr key={org.id}>
                    <td className="font-medium">{org.name_en}</td>
                    <td>{s.queue}</td>
                    <td>{s.applications}</td>
                    <td>{s.maintenance}</td>
                    <td><StatusBadge status={s.status} /></td>
                    <td><button onClick={() => setSelected(org.id)} className="text-blue-600 hover:underline text-sm font-medium">View</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-800">
        <strong>Institution Monitoring:</strong> View operational metrics for each institution. Institution creation and configuration belong to Super Admin.
      </div>
    </>
  );
}

// ─── SECTION: Queue Monitoring ────────────────────────────────────
function SectionQueueMonitoring() {
  const [filterInst, setFilterInst] = useState('');
  const institutions = [...new Set(mockQueueItems.map(q => q.institution))];
  const filtered = filterInst ? mockQueueItems.filter(q => q.institution === filterInst) : mockQueueItems;
  const waiting   = filtered.filter(q => q.status === 'Waiting').length;
  const processing= filtered.filter(q => q.status === 'Processing').length;
  const completed = filtered.filter(q => q.status === 'Completed').length;

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Queue Monitoring</h2>
        <p className="text-sm text-gray-500">Monitor queue conditions across MESOB institutions.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Waiting</p><p className="text-2xl font-bold">{waiting}</p></div>
        <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Processing</p><p className="text-2xl font-bold">{processing}</p></div>
        <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Completed</p><p className="text-2xl font-bold text-green-600">{completed}</p></div>
      </div>
      <div className="mb-5 flex items-center gap-3">
        <select value={filterInst} onChange={e => setFilterInst(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition text-sm bg-white">
          <option value="">All Institutions</option>
          {institutions.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
        {filterInst && <button onClick={() => setFilterInst('')} className="text-sm text-blue-600 hover:underline">Clear filter</button>}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Queue Items</h3>
          <span className="text-sm text-gray-500">{filtered.length} items</span>
        </div>
        <div className="table-container border-0 rounded-none">
          <table className="data-table">
            <thead><tr><th>Ticket</th><th>Institution</th><th>Citizen</th><th>Service</th><th>Priority</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map(q => (
                <tr key={q.id}>
                  <td className="font-medium">{q.id}</td>
                  <td>{q.institution}</td>
                  <td>{q.citizen}</td>
                  <td>{q.service}</td>
                  <td><PriorityBadge priority={q.priority} /></td>
                  <td><StatusBadge status={q.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ─── SECTION: Application Monitoring ─────────────────────────────
function SectionApplicationMonitoring() {
  const [filterInst, setFilterInst] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const institutions = [...new Set(mockApplications.map(a => a.institution))];
  const statuses     = [...new Set(mockApplications.map(a => a.status))];

  const filtered = mockApplications.filter(a => {
    const instMatch   = !filterInst   || a.institution === filterInst;
    const statusMatch = !filterStatus || a.status === filterStatus;
    return instMatch && statusMatch;
  });

  const pending  = mockApplications.filter(a => a.status === 'Pending' || a.status === 'Waiting').length;
  const inProg   = mockApplications.filter(a => a.status === 'In Progress').length;
  const done     = mockApplications.filter(a => a.status === 'Completed').length;

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Application Monitoring</h2>
        <p className="text-sm text-gray-500">Monitor application workload across MESOB institutions.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Pending / Waiting</p><p className="text-2xl font-bold">{pending}</p></div>
        <div className="stat-card"><p className="text-sm text-gray-500 mb-1">In Progress</p><p className="text-2xl font-bold">{inProg}</p></div>
        <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Completed</p><p className="text-2xl font-bold text-green-600">{done}</p></div>
      </div>
      <div className="mb-5 flex flex-wrap gap-3">
        <select value={filterInst} onChange={e => setFilterInst(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-400 outline-none transition text-sm bg-white">
          <option value="">All Institutions</option>
          {institutions.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-400 outline-none transition text-sm bg-white">
          <option value="">All Statuses</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {(filterInst || filterStatus) && <button onClick={() => { setFilterInst(''); setFilterStatus(''); }} className="text-sm text-blue-600 hover:underline">Clear</button>}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Applications</h3>
          <span className="text-sm text-gray-500">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="table-container border-0 rounded-none">
          <table className="data-table">
            <thead><tr><th>App ID</th><th>Institution</th><th>Service</th><th>Submitted</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={5} className="text-center text-gray-400 py-6">No matching applications.</td></tr>
                : filtered.map(a => (
                  <tr key={a.id}>
                    <td className="font-medium">{a.id}</td>
                    <td>{a.institution}</td>
                    <td>{a.service}</td>
                    <td>{a.submitted}</td>
                    <td><StatusBadge status={a.status} /></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ─── SECTION: Maintenance Oversight ──────────────────────────────
function SectionMaintenanceOversight() {
  const open      = mockMaintenanceItems.filter(t => t.status !== 'Completed').length;
  const completed = mockMaintenanceItems.filter(t => t.status === 'Completed').length;
  const highPri   = mockMaintenanceItems.filter(t => t.priority === 'High' && t.status !== 'Completed').length;

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Maintenance Oversight</h2>
        <p className="text-sm text-gray-500">Monitor technical maintenance across MESOB institutions.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Open Tasks</p><p className="text-2xl font-bold">{open}</p>{highPri > 0 && <p className="text-xs text-red-600 mt-1">{highPri} high priority</p>}</div>
        <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Completed</p><p className="text-2xl font-bold text-green-600">{completed}</p></div>
        <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Reports Submitted</p><p className="text-2xl font-bold">{mockMaintenanceItems.filter(t => t.report).length}</p></div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100"><h3 className="font-semibold text-gray-900">Maintenance Tasks – MESOB-wide</h3></div>
        <div className="table-container border-0 rounded-none">
          <table className="data-table">
            <thead><tr><th>Task ID</th><th>Institution</th><th>Task</th><th>Priority</th><th>Technician</th><th>Status</th><th>Report</th></tr></thead>
            <tbody>
              {mockMaintenanceItems.map(t => (
                <tr key={t.id}>
                  <td className="font-medium">{t.id}</td>
                  <td>{t.institution}</td>
                  <td>{t.title}</td>
                  <td><PriorityBadge priority={t.priority} /></td>
                  <td>{t.technician}</td>
                  <td><StatusBadge status={t.status} /></td>
                  <td>{t.report ? <span className="text-green-600 font-medium text-sm">Submitted</span> : <span className="text-gray-400 text-sm">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-800">
        <strong>Maintenance Oversight:</strong> Monitor technical tasks and reports across all MESOB institutions. Task assignment is performed by Institution Managers.
      </div>
    </>
  );
}

// ─── SECTION: Reports ────────────────────────────────────────────
function SectionReports() {
  const [activeReport, setActiveReport] = useState('queue');

  const qWaiting    = mockQueueItems.filter(q => q.status === 'Waiting').length;
  const qProcessing = mockQueueItems.filter(q => q.status === 'Processing').length;
  const qCompleted  = mockQueueItems.filter(q => q.status === 'Completed').length;

  const appPending  = mockApplications.filter(a => a.status === 'Pending' || a.status === 'Waiting').length;
  const appInProg   = mockApplications.filter(a => a.status === 'In Progress').length;
  const appDone     = mockApplications.filter(a => a.status === 'Completed').length;

  const maintOpen   = mockMaintenanceItems.filter(t => t.status !== 'Completed').length;
  const maintDone   = mockMaintenanceItems.filter(t => t.status === 'Completed').length;
  const maintReport = mockMaintenanceItems.filter(t => t.report).length;

  const tabs = [
    { key: 'queue',       label: 'Queue Report'       },
    { key: 'application', label: 'Application Report' },
    { key: 'maintenance', label: 'Maintenance Report' },
    { key: 'institution', label: 'Institution Report' },
  ];

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Reports</h2>
        <p className="text-sm text-gray-500">MESOB-wide operational reports based on existing system data.</p>
      </div>

      {/* Report type tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveReport(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
              activeReport === tab.key
                ? 'bg-[#1e3a8a] text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Queue Report ── */}
      {activeReport === 'queue' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Waiting</p><p className="text-2xl font-bold">{qWaiting}</p></div>
            <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Processing</p><p className="text-2xl font-bold">{qProcessing}</p></div>
            <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Completed</p><p className="text-2xl font-bold text-green-600">{qCompleted}</p></div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100"><h3 className="font-semibold text-gray-900">Queue Activity – MESOB-wide</h3></div>
            <div className="table-container border-0 rounded-none">
              <table className="data-table">
                <thead><tr><th>Ticket</th><th>Institution</th><th>Service</th><th>Priority</th><th>Status</th></tr></thead>
                <tbody>
                  {mockQueueItems.map(q => (
                    <tr key={q.id}>
                      <td className="font-medium">{q.id}</td>
                      <td>{q.institution}</td>
                      <td>{q.service}</td>
                      <td><PriorityBadge priority={q.priority} /></td>
                      <td><StatusBadge status={q.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── Application Report ── */}
      {activeReport === 'application' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Pending / Waiting</p><p className="text-2xl font-bold">{appPending}</p></div>
            <div className="stat-card"><p className="text-sm text-gray-500 mb-1">In Progress</p><p className="text-2xl font-bold">{appInProg}</p></div>
            <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Completed</p><p className="text-2xl font-bold text-green-600">{appDone}</p></div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100"><h3 className="font-semibold text-gray-900">Application Report – MESOB-wide</h3></div>
            <div className="table-container border-0 rounded-none">
              <table className="data-table">
                <thead><tr><th>App ID</th><th>Institution</th><th>Service</th><th>Submitted</th><th>Status</th></tr></thead>
                <tbody>
                  {mockApplications.map(a => (
                    <tr key={a.id}>
                      <td className="font-medium">{a.id}</td>
                      <td>{a.institution}</td>
                      <td>{a.service}</td>
                      <td>{a.submitted}</td>
                      <td><StatusBadge status={a.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── Maintenance Report ── */}
      {activeReport === 'maintenance' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Open Tasks</p><p className="text-2xl font-bold">{maintOpen}</p></div>
            <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Completed</p><p className="text-2xl font-bold text-green-600">{maintDone}</p></div>
            <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Reports Submitted</p><p className="text-2xl font-bold">{maintReport}</p></div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100"><h3 className="font-semibold text-gray-900">Maintenance Report – MESOB-wide</h3></div>
            <div className="table-container border-0 rounded-none">
              <table className="data-table">
                <thead><tr><th>Task ID</th><th>Institution</th><th>Task</th><th>Priority</th><th>Technician</th><th>Status</th><th>Report</th></tr></thead>
                <tbody>
                  {mockMaintenanceItems.map(t => (
                    <tr key={t.id}>
                      <td className="font-medium">{t.id}</td>
                      <td>{t.institution}</td>
                      <td>{t.title}</td>
                      <td><PriorityBadge priority={t.priority} /></td>
                      <td>{t.technician}</td>
                      <td><StatusBadge status={t.status} /></td>
                      <td>{t.report ? <span className="text-green-600 font-medium text-sm">Submitted</span> : <span className="text-gray-400 text-sm">—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── Institution Report ── */}
      {activeReport === 'institution' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Total Institutions</p><p className="text-2xl font-bold">{organizationsData.length}</p></div>
            <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Busy</p><p className="text-2xl font-bold text-amber-600">{Object.values(mockInstitutionStats).filter(s => s.status === 'Busy').length}</p></div>
            <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Normal</p><p className="text-2xl font-bold text-green-600">{Object.values(mockInstitutionStats).filter(s => s.status === 'Normal').length}</p></div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100"><h3 className="font-semibold text-gray-900">Institution Report – MESOB-wide</h3></div>
            <div className="table-container border-0 rounded-none">
              <table className="data-table">
                <thead><tr><th>Institution</th><th>Queue</th><th>Applications</th><th>Maintenance</th><th>Status</th></tr></thead>
                <tbody>
                  {organizationsData.map(org => {
                    const s = mockInstitutionStats[org.id] || { queue: 0, applications: 0, maintenance: 0, status: 'Normal' };
                    return (
                      <tr key={org.id}>
                        <td className="font-medium">{org.name_en}</td>
                        <td>{s.queue}</td>
                        <td>{s.applications}</td>
                        <td>{s.maintenance}</td>
                        <td><StatusBadge status={s.status} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-800">
        <strong>Reports:</strong> MESOB-wide operational reporting. Payment, appointment, and grievance reports are not part of the approved system scope.
      </div>
    </>
  );
}

// ─── SECTION: Analytics ───────────────────────────────────────────
function SectionAnalytics() {
  const [filterInst, setFilterInst] = useState('');
  const institutions = organizationsData;

  const displayInsts = filterInst
    ? institutions.filter(o => o.id === filterInst)
    : institutions;

  const totalQueue = displayInsts.reduce((s, o) => s + (mockInstitutionStats[o.id]?.queue || 0), 0);
  const totalApps  = displayInsts.reduce((s, o) => s + (mockInstitutionStats[o.id]?.applications || 0), 0);
  const totalMaint = displayInsts.reduce((s, o) => s + (mockInstitutionStats[o.id]?.maintenance || 0), 0);
  const busyCount  = displayInsts.filter(o => (mockInstitutionStats[o.id]?.status || 'Normal') === 'Busy').length;

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Analytics</h2>
        <p className="text-sm text-gray-500">Operational performance metrics across Hawassa MESOB.</p>
      </div>

      {/* Filter */}
      <div className="mb-6 flex items-center gap-3">
        <select value={filterInst} onChange={e => setFilterInst(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-400 outline-none transition text-sm bg-white">
          <option value="">All Institutions</option>
          {institutions.map(o => <option key={o.id} value={o.id}>{o.name_en}</option>)}
        </select>
        {filterInst && <button onClick={() => setFilterInst('')} className="text-sm text-blue-600 hover:underline">Show all</button>}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Active Queue</p><p className="text-2xl font-bold">{totalQueue}</p></div>
        <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Applications</p><p className="text-2xl font-bold">{totalApps}</p></div>
        <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Open Maintenance</p><p className="text-2xl font-bold">{totalMaint}</p></div>
        <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Busy Institutions</p><p className={`text-2xl font-bold ${busyCount > 0 ? 'text-amber-600' : 'text-green-600'}`}>{busyCount}</p></div>
      </div>

      {/* Per-institution breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Institution Performance Breakdown</h3>
        </div>
        <div className="table-container border-0 rounded-none">
          <table className="data-table">
            <thead><tr><th>Institution</th><th>Queue</th><th>Applications</th><th>Maintenance</th><th>Status</th></tr></thead>
            <tbody>
              {displayInsts.map(org => {
                const s = mockInstitutionStats[org.id] || { queue: 0, applications: 0, maintenance: 0, status: 'Normal' };
                return (
                  <tr key={org.id}>
                    <td className="font-medium">{org.name_en}</td>
                    <td>{s.queue}</td>
                    <td>{s.applications}</td>
                    <td>{s.maintenance}</td>
                    <td><StatusBadge status={s.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-800">
        <strong>Analytics:</strong> Operational metrics for monitoring purposes. Financial and payment analytics are not part of the approved system scope.
      </div>
    </>
  );
}

// ─── SECTION: Announcements ───────────────────────────────────────
function SectionAnnouncements() {
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [selected, setSelected] = useState(null);

  function markRead(id) { setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, read: true } : a)); }

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
        <p className="text-sm text-gray-500">MESOB-wide operational announcements and notifications.</p>
      </div>
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
                <p className="text-xs text-gray-500">{ann.date}</p>
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
        <p className="text-sm text-gray-500">Your account information.</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 max-w-lg">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
            {user?.name?.charAt(0) || 'M'}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="badge bg-red-100 text-red-800 mt-1">MESOB Manager</span>
          </div>
        </div>
        <div className="space-y-4 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Full Name</span><span className="font-medium text-gray-900">{user?.name}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-medium text-gray-900">{user?.email}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Role</span><span className="font-medium text-gray-900">MESOB Manager</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Scope</span><span className="font-medium text-gray-900">Hawassa MESOB</span></div>
        </div>
      </div>
      <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-800">
        <strong>Note:</strong> To update your profile or change your password, contact the Super Admin.
      </div>
    </>
  );
}

// ─── Main MesobManagerDashboard ───────────────────────────────────
export default function MesobManagerDashboard() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function navigate(section) {
    setActiveSection(section);
    setSidebarOpen(false);
  }

  function renderSection() {
    switch (activeSection) {
      case 'Dashboard':              return <SectionDashboard setActiveSection={navigate} />;
      case 'Institution Monitoring': return <SectionInstitutionMonitoring />;
      case 'Queue Monitoring':       return <SectionQueueMonitoring />;
      case 'Application Monitoring': return <SectionApplicationMonitoring />;
      case 'Maintenance Oversight':  return <SectionMaintenanceOversight />;
      case 'Reports':                return <SectionReports />;
      case 'Analytics':              return <SectionAnalytics />;
      case 'Announcements':          return <SectionAnnouncements />;
      case 'My Profile':             return <SectionMyProfile user={user} />;
      default:                       return <SectionDashboard setActiveSection={navigate} />;
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex min-h-screen">

        {/* ── Sidebar ── */}
        <aside className={`db-sidebar fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200${sidebarOpen ? ' open' : ''}`}>
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-lg">M</div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">MESOB Center</p>
                <p className="text-xs text-gray-500">MESOB Manager</p>
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
                {activeSection === 'Dashboard' ? 'MESOB Manager Dashboard' : activeSection}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="badge bg-red-100 text-red-800">MESOB Manager</span>
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
