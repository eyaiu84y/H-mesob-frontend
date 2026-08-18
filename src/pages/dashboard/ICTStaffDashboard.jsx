import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

// ─── Navigation sections ─────────────────────────────────────────
const SECTIONS = [
  'Dashboard',
  'My Tasks',
  'Maintenance Reports',
  'Announcements',
  'My Profile',
];

// ─── Mock static data (structured for future API replacement) ────

const mockTasks = [
  { id: '#TASK-101', title: 'Replace faulty network switch – Room 3B',  institution: 'National ID Program',  priority: 'High',   assignedDate: 'Aug 13, 2026', status: 'Assigned',    description: 'The network switch in Room 3B is causing intermittent disconnections. Replace with the spare unit in the storage room.' },
  { id: '#TASK-098', title: 'Inspect UPS units – Server room',          institution: 'MESOB Center (Main)',  priority: 'Medium', assignedDate: 'Aug 12, 2026', status: 'In Progress', description: 'Routine inspection of all UPS units in the server room. Check battery health and log any units requiring replacement.' },
  { id: '#TASK-094', title: 'Fix printer connectivity – Counter 2',     institution: 'Ethio Telecom',        priority: 'Normal', assignedDate: 'Aug 10, 2026', status: 'Assigned',    description: 'Counter 2 printer is not connecting to the network. Check cable connections, driver installation, and network configuration.' },
  { id: '#TASK-087', title: 'Update workstation OS – Admin office',     institution: 'Ministry of Revenues', priority: 'Normal', assignedDate: 'Aug 07, 2026', status: 'Completed',   description: 'Apply pending security updates and OS patches to the 3 workstations in the admin office.' },
];

const mockReports = [
  { id: '#RPT-055', taskId: '#TASK-087', title: 'OS Update – Admin office workstations', institution: 'Ministry of Revenues', date: 'Aug 08, 2026', status: 'Submitted', issue: 'Workstations running outdated OS with pending security patches.', action: 'Applied all pending security and OS updates on 3 workstations. Rebooted and verified functionality.', result: 'All workstations updated and operational.' },
  { id: '#RPT-051', taskId: '#TASK-079', title: 'Cable replacement – Queue display', institution: 'National ID Program',  date: 'Aug 03, 2026', status: 'Submitted', issue: 'Queue display monitor had a damaged HDMI cable causing no display output.', action: 'Replaced HDMI cable and tested display output. No further issues found.', result: 'Display operational.' },
];

const mockAnnouncements = [
  { id: 1, title: 'Scheduled Maintenance Window – Sat Aug 16',       body: 'A scheduled maintenance window is planned for Saturday, Aug 16, 2026 from 8 PM to 11 PM. All ICT staff must complete their assigned tasks before the window begins and be available for support.', date: 'Aug 14, 2026', read: false },
  { id: 2, title: 'New Task Assignment Process – Institution Manager', body: 'Effective immediately, all technical task assignments will be issued through the Task Management system by the Institution Manager. Please ensure your task statuses are updated daily.', date: 'Aug 11, 2026', read: false },
  { id: 3, title: 'Updated Equipment Inventory – Storage Room',        body: 'The storage room equipment inventory has been updated. A list of available spare parts and equipment is now posted in the break room. Please log all equipment taken from storage in the maintenance logbook.', date: 'Aug 09, 2026', read: true },
];

// ─── Badge helpers ────────────────────────────────────────────────
function PriorityBadge({ priority }) {
  const cls = {
    High:   'badge bg-red-100 text-red-800',
    Medium: 'badge bg-amber-100 text-amber-800',
    Normal: 'badge bg-gray-100 text-gray-700',
  }[priority] || 'badge bg-gray-100 text-gray-700';
  return <span className={cls}>{priority}</span>;
}

function StatusBadge({ status }) {
  const cls = {
    Assigned:      'badge bg-amber-100 text-amber-800',
    'In Progress': 'badge bg-blue-100 text-blue-800',
    Completed:     'badge bg-green-100 text-green-800',
    Submitted:     'badge bg-green-100 text-green-800',
    Draft:         'badge bg-gray-100 text-gray-700',
  }[status] || 'badge bg-gray-100 text-gray-700';
  return <span className={cls}>{status}</span>;
}

// ─── SECTION: Dashboard Overview ─────────────────────────────────
function SectionDashboard({ setActiveSection }) {
  const pending    = mockTasks.filter(t => t.status !== 'Completed').length;
  const reportCount = mockReports.length;

  return (
    <>
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="stat-card">
          <p className="text-sm text-gray-500 mb-1">Assigned Tasks</p>
          <p className="text-2xl font-bold">{mockTasks.length}</p>
          <p className="text-xs text-amber-600 mt-1">
            {mockTasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length} high priority
          </p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500 mb-1">Pending Tasks</p>
          <p className="text-2xl font-bold">{pending}</p>
          <p className="text-xs text-gray-500 mt-1">Not yet completed</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500 mb-1">Maintenance Reports</p>
          <p className="text-2xl font-bold">{reportCount}</p>
          <p className="text-xs text-gray-500 mt-1">Submitted</p>
        </div>
      </div>

      {/* My Tasks preview */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">My Tasks</h2>
          <button
            onClick={() => setActiveSection('My Tasks')}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            View all
          </button>
        </div>
        <div className="table-container border-0 rounded-none">
          <table className="data-table">
            <thead>
              <tr>
                <th>Task ID</th>
                <th>Task</th>
                <th>Institution</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {mockTasks.filter(t => t.status !== 'Completed').slice(0, 3).map(task => (
                <tr key={task.id}>
                  <td className="font-medium">{task.id}</td>
                  <td>{task.title}</td>
                  <td>{task.institution}</td>
                  <td><PriorityBadge priority={task.priority} /></td>
                  <td><StatusBadge status={task.status} /></td>
                  <td>
                    <button
                      onClick={() => setActiveSection('My Tasks')}
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 bg-cyan-50 border border-cyan-100 rounded-xl text-sm text-cyan-900">
        <strong>Technician:</strong> Process assigned technical tasks, record maintenance work, and submit reports. You do not assign tasks to other staff or manage users and institutions.
      </div>
    </>
  );
}

// ─── SECTION: My Tasks ────────────────────────────────────────────
function SectionMyTasks() {
  const [tasks, setTasks] = useState(mockTasks);
  const [selectedTask, setSelectedTask] = useState(null);

  function advanceStatus(id) {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const next = { Assigned: 'In Progress', 'In Progress': 'Completed' }[t.status];
      return next ? { ...t, status: next } : t;
    }));
    // Keep selected task in sync
    setSelectedTask(prev => {
      if (!prev || prev.id !== id) return prev;
      const next = { Assigned: 'In Progress', 'In Progress': 'Completed' }[prev.status];
      return next ? { ...prev, status: next } : prev;
    });
  }

  function actionLabel(status) {
    return { Assigned: 'Start', 'In Progress': 'Complete' }[status] || null;
  }

  // ── Task detail view ──
  if (selectedTask) {
    const live = tasks.find(t => t.id === selectedTask.id) || selectedTask;
    return (
      <>
        <div className="mb-6">
          <button
            onClick={() => setSelectedTask(null)}
            className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to My Tasks
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          {/* Task header */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-400 mb-1">{live.id}</p>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{live.title}</h2>
              <div className="flex flex-wrap items-center gap-2">
                <PriorityBadge priority={live.priority} />
                <StatusBadge status={live.status} />
              </div>
            </div>
            {actionLabel(live.status) && (
              <button
                onClick={() => advanceStatus(live.id)}
                className="px-5 py-2.5 bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-sm font-semibold rounded-xl transition"
              >
                {actionLabel(live.status)} Task
              </button>
            )}
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Institution</span>
                <span className="font-medium text-gray-900">{live.institution}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Assigned Date</span>
                <span className="font-medium text-gray-900">{live.assignedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <StatusBadge status={live.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Priority</span>
                <PriorityBadge priority={live.priority} />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs font-semibold text-[#1e3a8a] uppercase tracking-wider mb-2">Task Description</p>
            <p className="text-sm text-gray-700 leading-relaxed">{live.description}</p>
          </div>
        </div>

        <div className="p-4 bg-cyan-50 border border-cyan-100 rounded-xl text-sm text-cyan-900">
          <strong>Status Flow:</strong> Assigned → In Progress → Completed. Use the action button to advance task status.
        </div>
      </>
    );
  }

  // ── Task list view ──
  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">My Tasks</h2>
        <p className="text-sm text-gray-500">Technical tasks assigned to you. Click a task to view details and update status.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Assigned Tasks</h3>
          <span className="text-sm text-gray-500">
            {tasks.filter(t => t.status !== 'Completed').length} pending
          </span>
        </div>
        <div className="table-container border-0 rounded-none">
          <table className="data-table">
            <thead>
              <tr>
                <th>Task ID</th>
                <th>Task</th>
                <th>Institution</th>
                <th>Priority</th>
                <th>Assigned</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id}>
                  <td className="font-medium">{task.id}</td>
                  <td>{task.title}</td>
                  <td>{task.institution}</td>
                  <td><PriorityBadge priority={task.priority} /></td>
                  <td>{task.assignedDate}</td>
                  <td><StatusBadge status={task.status} /></td>
                  <td>
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      {task.status === 'Completed' ? 'View' : 'Open'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 bg-cyan-50 border border-cyan-100 rounded-xl text-sm text-cyan-900">
        <strong>Task Assignment:</strong> Tasks are assigned to you by the Institution Manager. You cannot assign tasks to other staff.
      </div>
    </>
  );
}

// ─── SECTION: Maintenance Reports ────────────────────────────────
function SectionMaintenanceReports() {
  const [reports, setReports] = useState(mockReports);
  const [view, setView] = useState('list'); // 'list' | 'new' | 'detail'
  const [selectedReport, setSelectedReport] = useState(null);

  // New report form state
  const [form, setForm] = useState({
    taskId: '', title: '', issue: '', action: '', result: '',
  });
  const [formError, setFormError] = useState('');

  function submitReport(e) {
    e.preventDefault();
    if (!form.taskId.trim() || !form.title.trim() || !form.issue.trim() || !form.action.trim()) {
      setFormError('Please fill in all required fields.');
      return;
    }
    const newReport = {
      id: `#RPT-${Date.now().toString().slice(-3)}`,
      taskId: form.taskId.trim(),
      title: form.title.trim(),
      institution: 'MESOB Center',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Submitted',
      issue: form.issue.trim(),
      action: form.action.trim(),
      result: form.result.trim() || 'Pending assessment.',
    };
    setReports(prev => [newReport, ...prev]);
    setForm({ taskId: '', title: '', issue: '', action: '', result: '' });
    setFormError('');
    setView('list');
  }

  // Detail view
  if (view === 'detail' && selectedReport) {
    return (
      <>
        <div className="mb-6">
          <button
            onClick={() => { setView('list'); setSelectedReport(null); }}
            className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Reports
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-400 mb-1">{selectedReport.id} · {selectedReport.taskId}</p>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{selectedReport.title}</h2>
              <StatusBadge status={selectedReport.status} />
            </div>
            <p className="text-sm text-gray-500">{selectedReport.date}</p>
          </div>

          <div className="space-y-5 text-sm">
            <div>
              <p className="text-xs font-semibold text-[#1e3a8a] uppercase tracking-wider mb-1">Institution</p>
              <p className="text-gray-700">{selectedReport.institution}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1e3a8a] uppercase tracking-wider mb-1">Issue / Problem</p>
              <p className="text-gray-700 leading-relaxed">{selectedReport.issue}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1e3a8a] uppercase tracking-wider mb-1">Action Taken</p>
              <p className="text-gray-700 leading-relaxed">{selectedReport.action}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1e3a8a] uppercase tracking-wider mb-1">Result</p>
              <p className="text-gray-700 leading-relaxed">{selectedReport.result}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // New report form
  if (view === 'new') {
    return (
      <>
        <div className="mb-6">
          <button
            onClick={() => { setView('list'); setFormError(''); }}
            className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Cancel
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">New Maintenance Report</h2>
          <form onSubmit={submitReport} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Related Task ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.taskId}
                  onChange={e => setForm(f => ({ ...f, taskId: e.target.value }))}
                  placeholder="e.g. #TASK-101"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Report Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Brief description of work"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Issue / Problem <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={form.issue}
                onChange={e => setForm(f => ({ ...f, issue: e.target.value }))}
                placeholder="Describe the technical issue or problem found"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-sm resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Action Taken <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={form.action}
                onChange={e => setForm(f => ({ ...f, action: e.target.value }))}
                placeholder="Describe the maintenance work performed"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-sm resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Result</label>
              <textarea
                rows={2}
                value={form.result}
                onChange={e => setForm(f => ({ ...f, result: e.target.value }))}
                placeholder="Outcome / current status after maintenance"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-sm resize-y"
              />
            </div>

            {formError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                {formError}
              </div>
            )}

            <button
              type="submit"
              className="px-6 py-3 bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold rounded-xl transition text-sm"
            >
              Submit Report
            </button>
          </form>
        </div>
      </>
    );
  }

  // Report list view
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Maintenance Reports</h2>
          <p className="text-sm text-gray-500">Reports for completed maintenance tasks.</p>
        </div>
        <button
          onClick={() => setView('new')}
          className="px-4 py-2 bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-sm font-semibold rounded-xl transition"
        >
          + New Report
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="table-container border-0 rounded-none">
          <table className="data-table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Title</th>
                <th>Related Task</th>
                <th>Institution</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-gray-400 py-6">
                    No maintenance reports submitted yet.
                  </td>
                </tr>
              ) : reports.map(r => (
                <tr key={r.id}>
                  <td className="font-medium">{r.id}</td>
                  <td>{r.title}</td>
                  <td>{r.taskId}</td>
                  <td>{r.institution}</td>
                  <td>{r.date}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>
                    <button
                      onClick={() => { setSelectedReport(r); setView('detail'); }}
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 bg-cyan-50 border border-cyan-100 rounded-xl text-sm text-cyan-900">
        <strong>Maintenance Reports:</strong> Submit a report for each completed maintenance task. Reports are reviewed by the Institution Manager.
      </div>
    </>
  );
}

// ─── SECTION: Announcements ───────────────────────────────────────
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
          <div
            key={ann.id}
            onClick={() => { setSelected(ann.id); markRead(ann.id); }}
            className={`bg-white rounded-2xl border shadow-sm p-5 cursor-pointer hover:shadow-md transition-all duration-200 ${ann.read ? 'border-gray-100' : 'border-blue-200 bg-blue-50/30'}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {!ann.read && <span className="inline-block w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />}
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
          <div className="w-14 h-14 rounded-2xl bg-cyan-600 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
            {user?.name?.charAt(0) || 'T'}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="badge bg-cyan-100 text-cyan-800 mt-1">Technician</span>
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
            <span className="font-medium text-gray-900">Technician</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Department</span>
            <span className="font-medium text-gray-900">MESOB Center – ICT</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-cyan-50 border border-cyan-100 rounded-xl text-sm text-cyan-900">
        <strong>Note:</strong> To update your profile or change your password, contact the Institution Manager or MESOB administration.
      </div>
    </>
  );
}

// ─── Main ICTStaffDashboard ───────────────────────────────────────
export default function ICTStaffDashboard() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function navigate(section) {
    setActiveSection(section);
    setSidebarOpen(false);
  }

  function renderSection() {
    switch (activeSection) {
      case 'Dashboard':           return <SectionDashboard setActiveSection={navigate} />;
      case 'My Tasks':            return <SectionMyTasks />;
      case 'Maintenance Reports': return <SectionMaintenanceReports />;
      case 'Announcements':       return <SectionAnnouncements />;
      case 'My Profile':          return <SectionMyProfile user={user} />;
      default:                    return <SectionDashboard setActiveSection={navigate} />;
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex min-h-screen">

        {/* ── Sidebar ── */}
        <aside className={`db-sidebar fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200${sidebarOpen ? ' open' : ''}`}>
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-bold text-sm">
                ICT
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">MESOB Center</p>
                <p className="text-xs text-gray-500">Technician Portal</p>
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
                {activeSection === 'Dashboard' ? 'Technician Dashboard' : activeSection}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="badge bg-cyan-100 text-cyan-800">Technician</span>
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
