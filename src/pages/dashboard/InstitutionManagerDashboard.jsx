import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

// ─── Navigation sections ──────────────────────────────────────────
const SECTIONS = [
  'Dashboard',
  'Queue Management',
  'Applications',
  'Maintenance',
  'Task Assignment',
  'Reports',
  'Announcements',
  'My Profile',
];

// ─── Institution assignment (mock — will come from backend/profile) ─
// In production this comes from the logged-in manager's account record.
const MANAGER_INSTITUTION = 'National ID Program';

// ─── Mock static data ─────────────────────────────────────────────

const mockQueue = [
  { id: '#Q-8841', citizen: 'Meron Tadesse',  service: 'National ID Registration',          priority: 'High',   status: 'Waiting',     employee: 'Abebe K.' },
  { id: '#Q-8840', citizen: 'Kebede Worku',   service: 'ID Card Replacement',                priority: 'Medium', status: 'Processing',  employee: 'Meron T.' },
  { id: '#Q-8839', citizen: 'Selamawit A.',   service: 'Fayda Demographic Data Update',      priority: 'Normal', status: 'Waiting',     employee: 'Unassigned' },
  { id: '#Q-8835', citizen: 'Tigist Alemu',   service: 'National ID Registration',          priority: 'Normal', status: 'Completed',   employee: 'Abebe K.' },
  { id: '#Q-8831', citizen: 'Dawit Bekele',   service: 'ID Card Replacement',                priority: 'High',   status: 'Waiting',     employee: 'Unassigned' },
];

const mockApplications = [
  { id: '#APP-1024', citizen: 'Meron Tadesse',  service: 'National ID Registration',    submitted: 'Aug 11, 2026', status: 'Pending',    assignedTo: 'Abebe K.' },
  { id: '#APP-1020', citizen: 'Dawit Bekele',   service: 'ID Card Replacement',          submitted: 'Aug 10, 2026', status: 'Waiting',    assignedTo: 'Unassigned' },
  { id: '#APP-1015', citizen: 'Hanna M.',        service: 'National ID Registration',    submitted: 'Aug 08, 2026', status: 'In Progress',assignedTo: 'Meron T.' },
  { id: '#APP-1009', citizen: 'Solomon G.',      service: 'Fayda Data Update',           submitted: 'Aug 07, 2026', status: 'Completed',  assignedTo: 'Abebe K.' },
  { id: '#APP-1003', citizen: 'Aziza W.',        service: 'National ID Registration',    submitted: 'Aug 05, 2026', status: 'Completed',  assignedTo: 'Meron T.' },
];

const mockMaintenanceTasks = [
  { id: '#TASK-101', title: 'Replace faulty network switch – Room 3B', priority: 'High',   assignedTo: 'Technician', assignedDate: 'Aug 13, 2026', status: 'In Progress', report: null },
  { id: '#TASK-098', title: 'Inspect UPS units – Server room',         priority: 'Medium', assignedTo: 'Technician', assignedDate: 'Aug 12, 2026', status: 'Completed',   report: '#RPT-055' },
  { id: '#TASK-094', title: 'Fix printer connectivity – Counter 2',    priority: 'Normal', assignedTo: 'Unassigned',  assignedDate: 'Aug 10, 2026', status: 'Assigned',    report: null },
];

const mockMaintenanceReports = [
  { id: '#RPT-055', taskId: '#TASK-098', technician: 'Technician', title: 'UPS Inspection – Server room', date: 'Aug 13, 2026', status: 'Submitted', issue: 'Routine UPS inspection required.', action: 'Inspected all UPS units. One unit battery replaced.', result: 'All units operational.' },
];

const mockAnnouncements = [
  { id: 1, title: 'System Maintenance – Sat Aug 16',                  body: 'A scheduled system maintenance window is planned for Saturday, Aug 16, 2026 from 8 PM to 11 PM. Ensure all pending queue items are processed before the window.', date: 'Aug 14, 2026', read: false },
  { id: 2, title: 'Updated National ID Service Requirements',          body: 'The National ID Program has updated the required documents for ID registration. Please ensure staff are informed and service counters have the updated checklist.', date: 'Aug 12, 2026', read: false },
  { id: 3, title: 'Monthly Operations Report – July 2026 Due',        body: 'Institution Managers are reminded to submit the July 2026 Monthly Operations Report by August 20, 2026. Templates are available from the MESOB Manager.', date: 'Aug 09, 2026', read: true },
];

const mockEmployees = [
  { id: 'E-04', name: 'Abebe Kebede',  email: 'employee@mesobcenter.et', role: 'Employee',  status: 'Active' },
  { id: 'E-07', name: 'Meron Tadesse', email: 'meron.t@mesobcenter.et', role: 'Employee',  status: 'Active' },
  { id: 'T-05', name: 'Technician',   email: 'ict@mesobcenter.et',      role: 'Technician', status: 'Active' },
];

// ─── Badge helpers ────────────────────────────────────────────────
function PriorityBadge({ priority }) {
  const cls = { High: 'badge bg-red-100 text-red-800', Medium: 'badge bg-amber-100 text-amber-800', Normal: 'badge bg-gray-100 text-gray-700' }[priority] || 'badge bg-gray-100 text-gray-700';
  return <span className={cls}>{priority}</span>;
}

function StatusBadge({ status }) {
  const cls = {
    Pending: 'badge bg-amber-100 text-amber-800',
    Waiting: 'badge bg-amber-100 text-amber-800',
    Assigned: 'badge bg-amber-100 text-amber-800',
    'In Progress': 'badge bg-blue-100 text-blue-800',
    Processing: 'badge bg-blue-100 text-blue-800',
    Completed: 'badge bg-green-100 text-green-800',
    Submitted: 'badge bg-green-100 text-green-800',
    Active: 'badge bg-green-100 text-green-800',
  }[status] || 'badge bg-gray-100 text-gray-700';
  return <span className={cls}>{status}</span>;
}

// ─── SECTION: Dashboard Overview ─────────────────────────────────
function SectionDashboard({ setActiveSection }) {
  const activeQueue  = mockQueue.filter(q => q.status !== 'Completed').length;
  const activeApps   = mockApplications.filter(a => a.status !== 'Completed').length;
  const openMaint    = mockMaintenanceTasks.filter(t => t.status !== 'Completed').length;
  const unread       = mockAnnouncements.filter(a => !a.read).length;

  return (
    <>
      {/* Institution banner */}
      <div className="mb-6 p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">I</div>
        <div>
          <p className="text-xs text-orange-600 font-semibold uppercase tracking-wide">Assigned Institution</p>
          <p className="text-sm font-semibold text-orange-900">{MANAGER_INSTITUTION}</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <p className="text-sm text-gray-500 mb-1">Queue Status</p>
          <p className="text-2xl font-bold">{activeQueue}</p>
          <p className="text-xs text-amber-600 mt-1">Active tickets</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500 mb-1">Applications</p>
          <p className="text-2xl font-bold">{activeApps}</p>
          <p className="text-xs text-gray-500 mt-1">Pending / in progress</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500 mb-1">Maintenance</p>
          <p className="text-2xl font-bold">{openMaint}</p>
          <p className="text-xs text-gray-500 mt-1">Open tasks</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500 mb-1">Announcements</p>
          <p className="text-2xl font-bold">{unread}</p>
          <p className="text-xs text-gray-500 mt-1">Unread</p>
        </div>
      </div>

      {/* Queue overview */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Queue Overview</h2>
          <button onClick={() => setActiveSection('Queue Management')} className="text-sm text-blue-600 hover:underline font-medium">View all</button>
        </div>
        <div className="table-container border-0 rounded-none">
          <table className="data-table">
            <thead>
              <tr><th>Ticket</th><th>Citizen</th><th>Service</th><th>Priority</th><th>Status</th><th>Assigned To</th></tr>
            </thead>
            <tbody>
              {mockQueue.filter(q => q.status !== 'Completed').slice(0, 3).map(q => (
                <tr key={q.id}>
                  <td className="font-medium">{q.id}</td>
                  <td>{q.citizen}</td>
                  <td>{q.service}</td>
                  <td><PriorityBadge priority={q.priority} /></td>
                  <td><StatusBadge status={q.status} /></td>
                  <td>{q.employee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Applications overview */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Applications Overview</h2>
          <button onClick={() => setActiveSection('Applications')} className="text-sm text-blue-600 hover:underline font-medium">View all</button>
        </div>
        <div className="table-container border-0 rounded-none">
          <table className="data-table">
            <thead>
              <tr><th>App ID</th><th>Citizen</th><th>Service</th><th>Submitted</th><th>Status</th><th>Assigned To</th></tr>
            </thead>
            <tbody>
              {mockApplications.filter(a => a.status !== 'Completed').slice(0, 3).map(a => (
                <tr key={a.id}>
                  <td className="font-medium">{a.id}</td>
                  <td>{a.citizen}</td>
                  <td>{a.service}</td>
                  <td>{a.submitted}</td>
                  <td><StatusBadge status={a.status} /></td>
                  <td>{a.assignedTo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-sm text-orange-800">
        <strong>Institution Manager:</strong> Monitor your institution's queue, applications, maintenance, and task assignments. You manage {MANAGER_INSTITUTION} only.
      </div>
    </>
  );
}

// ─── SECTION: Queue Management ────────────────────────────────────
function SectionQueueManagement() {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Queue Management</h2>
        <p className="text-sm text-gray-500">Monitor the service queue for {MANAGER_INSTITUTION}.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Waiting</p><p className="text-2xl font-bold">{mockQueue.filter(q => q.status === 'Waiting').length}</p></div>
        <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Processing</p><p className="text-2xl font-bold">{mockQueue.filter(q => q.status === 'Processing').length}</p></div>
        <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Completed Today</p><p className="text-2xl font-bold text-green-600">{mockQueue.filter(q => q.status === 'Completed').length}</p></div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Queue — {MANAGER_INSTITUTION}</h3>
          <span className="text-sm text-gray-500">{mockQueue.filter(q => q.status !== 'Completed').length} active</span>
        </div>
        <div className="table-container border-0 rounded-none">
          <table className="data-table">
            <thead>
              <tr><th>Ticket</th><th>Citizen</th><th>Service</th><th>Priority</th><th>Status</th><th>Assigned To</th></tr>
            </thead>
            <tbody>
              {mockQueue.map(q => (
                <tr key={q.id}>
                  <td className="font-medium">{q.id}</td>
                  <td>{q.citizen}</td>
                  <td>{q.service}</td>
                  <td><PriorityBadge priority={q.priority} /></td>
                  <td><StatusBadge status={q.status} /></td>
                  <td>{q.employee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-sm text-orange-800">
        <strong>Queue Management:</strong> Monitor queue status for your institution. Queue items are processed by assigned Employees.
      </div>
    </>
  );
}

// ─── SECTION: Applications ────────────────────────────────────────
function SectionApplications() {
  const [query, setQuery] = useState('');
  const filtered = mockApplications.filter(a => {
    const q = query.toLowerCase();
    return !q || a.id.toLowerCase().includes(q) || a.citizen.toLowerCase().includes(q) || a.service.toLowerCase().includes(q) || a.status.toLowerCase().includes(q);
  });

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Applications</h2>
        <p className="text-sm text-gray-500">Monitor applications for {MANAGER_INSTITUTION}.</p>
      </div>
      <div className="mb-5 relative max-w-md">
        <input type="text" value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search by ID, citizen, service, or status..."
          className="w-full px-4 py-2.5 pl-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition text-sm" />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Institution Applications</h3>
          <span className="text-sm text-gray-500">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="table-container border-0 rounded-none">
          <table className="data-table">
            <thead>
              <tr><th>App ID</th><th>Citizen</th><th>Service</th><th>Submitted</th><th>Status</th><th>Assigned To</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-gray-400 py-6">No matching applications.</td></tr>
              ) : filtered.map(a => (
                <tr key={a.id}>
                  <td className="font-medium">{a.id}</td>
                  <td>{a.citizen}</td>
                  <td>{a.service}</td>
                  <td>{a.submitted}</td>
                  <td><StatusBadge status={a.status} /></td>
                  <td>{a.assignedTo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ─── SECTION: Maintenance ─────────────────────────────────────────
function SectionMaintenance() {
  const [selected, setSelected] = useState(null);

  if (selected) {
    const task = mockMaintenanceTasks.find(t => t.id === selected);
    const report = task?.report ? mockMaintenanceReports.find(r => r.id === task.report) : null;
    return (
      <>
        <div className="mb-6">
          <button onClick={() => setSelected(null)} className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            Back to Maintenance
          </button>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-400 mb-1">{task.id}</p>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h2>
              <div className="flex gap-2"><PriorityBadge priority={task.priority} /><StatusBadge status={task.status} /></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
            <div className="flex justify-between"><span className="text-gray-500">Assigned To</span><span className="font-medium">{task.assignedTo}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Assigned Date</span><span className="font-medium">{task.assignedDate}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Report</span><span className="font-medium">{task.report || 'Not yet submitted'}</span></div>
          </div>
          {report && (
            <div className="border-t border-gray-100 pt-5">
              <p className="text-xs font-semibold text-[#1e3a8a] uppercase tracking-wider mb-3">Maintenance Report</p>
              <div className="space-y-3 text-sm">
                <div><p className="text-gray-500 mb-0.5">Issue</p><p className="text-gray-700">{report.issue}</p></div>
                <div><p className="text-gray-500 mb-0.5">Action Taken</p><p className="text-gray-700">{report.action}</p></div>
                <div><p className="text-gray-500 mb-0.5">Result</p><p className="text-gray-700">{report.result}</p></div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Maintenance</h2>
        <p className="text-sm text-gray-500">Monitor maintenance tasks assigned to Technicians for {MANAGER_INSTITUTION}.</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Maintenance Tasks</h3>
          <span className="text-sm text-gray-500">{mockMaintenanceTasks.filter(t => t.status !== 'Completed').length} open</span>
        </div>
        <div className="table-container border-0 rounded-none">
          <table className="data-table">
            <thead>
              <tr><th>Task ID</th><th>Task</th><th>Priority</th><th>Assigned To</th><th>Date</th><th>Status</th><th>Report</th><th>Action</th></tr>
            </thead>
            <tbody>
              {mockMaintenanceTasks.map(t => (
                <tr key={t.id}>
                  <td className="font-medium">{t.id}</td>
                  <td>{t.title}</td>
                  <td><PriorityBadge priority={t.priority} /></td>
                  <td>{t.assignedTo}</td>
                  <td>{t.assignedDate}</td>
                  <td><StatusBadge status={t.status} /></td>
                  <td>{t.report ? <span className="text-green-600 text-sm font-medium">Submitted</span> : <span className="text-gray-400 text-sm">—</span>}</td>
                  <td><button onClick={() => setSelected(t.id)} className="text-blue-600 hover:underline text-sm font-medium">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-sm text-orange-800">
        <strong>Maintenance:</strong> Monitor technical maintenance tasks and reports submitted by Technicians for your institution.
      </div>
    </>
  );
}

// ─── SECTION: Task Assignment ─────────────────────────────────────
function SectionTaskAssignment() {
  const [tasks, setTasks] = useState(mockMaintenanceTasks.map(t => ({ ...t })));
  const [view, setView] = useState('list'); // 'list' | 'new'
  const [form, setForm] = useState({ title: '', assignedTo: '', priority: 'Normal', description: '' });
  const [formError, setFormError] = useState('');

  // Only Technicians can be assigned maintenance tasks
  const technicianList = mockEmployees.filter(e => e.role === 'Technician');

  function submitTask(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.assignedTo) { setFormError('Title and Assigned To are required.'); return; }
    const newTask = {
      id: `#TASK-${Date.now().toString().slice(-3)}`,
      title: form.title.trim(),
      priority: form.priority,
      assignedTo: form.assignedTo,
      assignedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Assigned',
      report: null,
    };
    setTasks(prev => [newTask, ...prev]);
    setForm({ title: '', assignedTo: '', priority: 'Normal', description: '' });
    setFormError('');
    setView('list');
  }

  if (view === 'new') {
    return (
      <>
        <div className="mb-6">
          <button onClick={() => { setView('list'); setFormError(''); }} className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            Cancel
          </button>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Assign New Technical Task</h2>
          <form onSubmit={submitTask} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Task Title <span className="text-red-500">*</span></label>
              <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Brief description of technical task"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition text-sm" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Assign To <span className="text-red-500">*</span></label>
                <select value={form.assignedTo} onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition text-sm bg-white">
                  <option value="">Select Technician...</option>
                  {technicianList.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
                <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition text-sm bg-white">
                  <option>High</option><option>Medium</option><option>Normal</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Additional details about the technical task"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition text-sm resize-y" />
            </div>
            {formError && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">{formError}</div>}
            <button type="submit" className="px-6 py-3 bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold rounded-xl transition text-sm">
              Assign Task
            </button>
          </form>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Task Assignment</h2>
          <p className="text-sm text-gray-500">Assign and monitor technical tasks for Technicians in {MANAGER_INSTITUTION}.</p>
        </div>
        <button onClick={() => setView('new')} className="px-4 py-2 bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-sm font-semibold rounded-xl transition">
          + Assign Task
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="table-container border-0 rounded-none">
          <table className="data-table">
            <thead>
              <tr><th>Task ID</th><th>Task</th><th>Priority</th><th>Assigned To</th><th>Date</th><th>Status</th></tr>
            </thead>
            <tbody>
              {tasks.map(t => (
                <tr key={t.id}>
                  <td className="font-medium">{t.id}</td>
                  <td>{t.title}</td>
                  <td><PriorityBadge priority={t.priority} /></td>
                  <td>{t.assignedTo}</td>
                  <td>{t.assignedDate}</td>
                  <td><StatusBadge status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-sm text-orange-800">
        <strong>Task Assignment:</strong> Assign technical maintenance tasks to Technicians in your institution. Tasks assigned here will be visible in the Technician dashboard.
      </div>
    </>
  );
}

// ─── SECTION: Reports ─────────────────────────────────────────────
function SectionReports() {
  const completed = mockApplications.filter(a => a.status === 'Completed').length;
  const pending   = mockApplications.filter(a => a.status === 'Pending' || a.status === 'Waiting').length;
  const inProg    = mockApplications.filter(a => a.status === 'In Progress').length;
  const qCompleted = mockQueue.filter(q => q.status === 'Completed').length;
  const maintDone  = mockMaintenanceTasks.filter(t => t.status === 'Completed').length;

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Reports</h2>
        <p className="text-sm text-gray-500">Operational summary for {MANAGER_INSTITUTION}.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Queue Completed Today</p><p className="text-2xl font-bold text-green-600">{qCompleted}</p></div>
        <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Active Queue</p><p className="text-2xl font-bold">{mockQueue.filter(q => q.status !== 'Completed').length}</p></div>
        <div className="stat-card"><p className="text-sm text-gray-500 mb-1">Maintenance Completed</p><p className="text-2xl font-bold text-green-600">{maintDone}</p></div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Application Status Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100"><span className="badge bg-green-100 text-green-800">Completed</span><span className="text-2xl font-bold text-gray-900">{completed}</span></div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100"><span className="badge bg-amber-100 text-amber-800">Pending</span><span className="text-2xl font-bold text-gray-900">{pending}</span></div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100"><span className="badge bg-blue-100 text-blue-800">In Progress</span><span className="text-2xl font-bold text-gray-900">{inProg}</span></div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100"><h3 className="font-semibold text-gray-900">Maintenance Task Summary</h3></div>
        <div className="table-container border-0 rounded-none">
          <table className="data-table">
            <thead><tr><th>Task ID</th><th>Task</th><th>Priority</th><th>Assigned To</th><th>Status</th><th>Report</th></tr></thead>
            <tbody>
              {mockMaintenanceTasks.map(t => (
                <tr key={t.id}>
                  <td className="font-medium">{t.id}</td>
                  <td>{t.title}</td>
                  <td><PriorityBadge priority={t.priority} /></td>
                  <td>{t.assignedTo}</td>
                  <td><StatusBadge status={t.status} /></td>
                  <td>{t.report ? <span className="text-green-600 font-medium text-sm">Submitted</span> : <span className="text-gray-400 text-sm">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-sm text-orange-800">
        <strong>Note:</strong> Reports reflect {MANAGER_INSTITUTION} operational data only. MESOB-wide analytics are available to the MESOB Manager.
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
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
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
        <p className="text-sm text-gray-500">Operational announcements and notifications.</p>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
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
          <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
            {user?.name?.charAt(0) || 'I'}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="badge bg-orange-100 text-orange-800 mt-1">Institution Manager</span>
          </div>
        </div>
        <div className="space-y-4 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Full Name</span><span className="font-medium text-gray-900">{user?.name}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-medium text-gray-900">{user?.email}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Role</span><span className="font-medium text-gray-900">Institution Manager</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Institution</span><span className="font-medium text-gray-900">{MANAGER_INSTITUTION}</span></div>
        </div>
      </div>
      <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-sm text-orange-800">
        <strong>Note:</strong> To update your profile or change your password, contact MESOB administration.
      </div>
    </>
  );
}

// ─── Main InstitutionManagerDashboard ─────────────────────────────
export default function InstitutionManagerDashboard() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function navigate(section) {
    setActiveSection(section);
    setSidebarOpen(false);
  }

  function renderSection() {
    switch (activeSection) {
      case 'Dashboard':        return <SectionDashboard setActiveSection={navigate} />;
      case 'Queue Management': return <SectionQueueManagement />;
      case 'Applications':     return <SectionApplications />;
      case 'Maintenance':      return <SectionMaintenance />;
      case 'Task Assignment':  return <SectionTaskAssignment />;
      case 'Reports':          return <SectionReports />;
      case 'Announcements':    return <SectionAnnouncements />;
      case 'My Profile':       return <SectionMyProfile user={user} />;
      default:                 return <SectionDashboard setActiveSection={navigate} />;
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex min-h-screen">

        {/* ── Sidebar ── */}
        <aside className={`db-sidebar fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200${sidebarOpen ? ' open' : ''}`}>
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-lg">I</div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">MESOB Center</p>
                <p className="text-xs text-gray-500">Institution Manager</p>
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
                {activeSection === 'Dashboard' ? 'Institution Manager Dashboard' : activeSection}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="badge bg-orange-100 text-orange-800">Institution Manager</span>
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
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
