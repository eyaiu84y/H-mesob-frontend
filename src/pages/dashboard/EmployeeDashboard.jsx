import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { organizationsData } from '../../data/organizations';
import { getMaintenanceReports, createMaintenanceReport, getAnnouncements } from '../../utils/sharedData';

// ─── Navigation sections ────────────────────────────────────────
const SECTIONS = [
  'Dashboard',
  'My Queue',
  'Search Applications',
  'Service Requirements',
  'Maintenance Report',
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

// Mock announcements removed - using shared data



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
  const [announcements] = useState(() => getAnnouncements({ institution: 'MESOB Center' }));
  const unreadCount = announcements.filter(a => !a.read).length;
  
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

// ─── SECTION: Maintenance Report ─────────────────────────────────
// PROBLEM TYPES - matching Telegram bot specification
const PROBLEM_TYPES = [
  'Computer / Hardware',
  'Network / Internet',
  'Software',
  'Printer / Scanner',
  'Electrical / Power',
  'Other',
];

function SectionMaintenanceReport({ user }) {
  const [reports, setReports] = useState([]);
  const [view, setView] = useState('list'); // 'list' | 'new' | 'detail'
  const [selectedReport, setSelectedReport] = useState(null);
  const [form, setForm] = useState({
    institution: user?.institution || '',
    employeeId: user?.employeeId || '',
    employeeName: user?.name || '',
    problemType: '',
    description: '',
    location: '',
    officeNumber: '',
    photo: null,
    photoPreview: null,
  });
  const [formError, setFormError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(null);

  // Load reports on mount and when user changes
  useEffect(() => {
    function loadReports() {
      const employeeReports = getMaintenanceReports({ reportedBy: user?.email });
      setReports(employeeReports);
    }
    loadReports();
  }, [user?.email]);

  function handlePhotoSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file is image
    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (JPEG, PNG, etc.).');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image file size must be less than 5MB.');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(f => ({
        ...f,
        photo: file.name,
        photoPreview: reader.result,
      }));
      setFormError('');
    };
    reader.readAsDataURL(file);
  }

  function removePhoto() {
    setForm(f => ({ ...f, photo: null, photoPreview: null }));
  }

  function validateForm() {
    if (!form.institution.trim()) return 'Institution is required.';
    if (!form.employeeId.trim()) return 'Employee ID is required.';
    if (!form.employeeName.trim()) return 'Employee name is required.';
    if (!form.problemType) return 'Problem type is required.';
    if (!form.description.trim()) return 'Problem description is required.';
    if (!form.location.trim()) return 'Location is required.';
    if (!form.officeNumber.trim()) return 'Office number is required.';
    if (!form.photo) return 'Problem photo is required.';
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      setFormError(error);
      return;
    }

    const result = createMaintenanceReport({
      institution: form.institution.trim(),
      employeeId: form.employeeId.trim(),
      employeeName: form.employeeName.trim(),
      problemType: form.problemType,
      description: form.description.trim(),
      location: form.location.trim(),
      officeNumber: form.officeNumber.trim(),
      photo: form.photo,
      photoPreview: form.photoPreview,
      reportedBy: user?.email,
      reportedByName: user?.name,
    });

    if (result.success) {
      setSubmitSuccess(result.report);
      setForm({
        institution: user?.institution || '',
        employeeId: user?.employeeId || '',
        employeeName: user?.name || '',
        problemType: '',
        description: '',
        location: '',
        officeNumber: '',
        photo: null,
        photoPreview: null,
      });
      setFormError('');
      
      // Reload reports after 3 seconds
      setTimeout(() => {
        const employeeReports = getMaintenanceReports({ reportedBy: user?.email });
        setReports(employeeReports);
        setSubmitSuccess(null);
        setView('list');
      }, 3000);
    } else {
      setFormError(result.message || 'Failed to submit report.');
    }
  }

  // Success message view
  if (submitSuccess) {
    return (
      <>
        <div className="mb-6">
          <button
            onClick={() => { setSubmitSuccess(null); setView('list'); }}
            className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Reports
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Maintenance Report Submitted Successfully</h2>
            <p className="text-sm text-gray-500">Your maintenance problem has been reported. The Institution Manager will review and assign a technician.</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Report ID:</span>
              <span className="font-semibold text-gray-900">{submitSuccess.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Submitted by:</span>
              <span className="font-medium text-gray-900">{submitSuccess.employeeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Employee ID:</span>
              <span className="font-medium text-gray-900">{submitSuccess.employeeId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Institution:</span>
              <span className="font-medium text-gray-900">{submitSuccess.institution}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Problem Type:</span>
              <span className="font-medium text-gray-900">{submitSuccess.problemType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Location:</span>
              <span className="font-medium text-gray-900">{submitSuccess.location}, Office {submitSuccess.officeNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status:</span>
              <span className="badge bg-green-100 text-green-800">Submitted</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Report detail view
  if (view === 'detail' && selectedReport) {
    const report = reports.find(r => r.id === selectedReport) || null;
    if (!report) {
      setView('list');
      return null;
    }

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

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 max-w-3xl">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-400 mb-1">{report.id}</p>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Maintenance Report Details</h2>
              <div className="flex gap-2">
                <StatusBadge status={report.status} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-sm">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-[#1e3a8a] uppercase tracking-wider mb-1">Reporter Information</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Employee Name:</span>
                    <span className="font-medium text-gray-900">{report.employeeName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Employee ID:</span>
                    <span className="font-medium text-gray-900">{report.employeeId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Institution:</span>
                    <span className="font-medium text-gray-900">{report.institution}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-[#1e3a8a] uppercase tracking-wider mb-1">Problem Information</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Problem Type:</span>
                    <span className="font-medium text-gray-900">{report.problemType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location:</span>
                    <span className="font-medium text-gray-900">{report.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Office Number:</span>
                    <span className="font-medium text-gray-900">{report.officeNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-[#1e3a8a] uppercase tracking-wider mb-1">Status Information</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Submitted:</span>
                    <span className="font-medium text-gray-900">{report.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <StatusBadge status={report.status} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Assigned To:</span>
                    <span className="font-medium text-gray-900">{report.assignedTo || <span className="text-gray-400">Not assigned yet</span>}</span>
                  </div>
                  {report.taskId && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Task ID:</span>
                      <span className="font-medium text-gray-900">{report.taskId}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-xs font-semibold text-[#1e3a8a] uppercase tracking-wider mb-2">Problem Description</p>
            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4">{report.description}</p>
          </div>

          {report.photoPreview && (
            <div>
              <p className="text-xs font-semibold text-[#1e3a8a] uppercase tracking-wider mb-2">Problem Photo</p>
              <img
                src={report.photoPreview}
                alt="Problem photo"
                className="max-w-md w-full rounded-xl border border-gray-200 shadow-sm"
              />
            </div>
          )}
        </div>

        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800 max-w-3xl">
          <strong>Report Status:</strong> You will be notified when the Institution Manager assigns a technician and when the problem is resolved.
        </div>
      </>
    );
  }

  // New report form view
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

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-3xl">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Report Maintenance Problem</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Institution Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Location Information</h3>
              
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Institution <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.institution}
                    onChange={e => setForm(f => ({ ...f, institution: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-sm bg-white"
                  >
                    <option value="">Select institution where problem occurred...</option>
                    {organizationsData.map(org => (
                      <option key={org.id} value={org.name_en}>{org.name_en}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Employee Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Reporter Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Employee ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.employeeId}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-400 mt-1">Auto-populated from your profile</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Employee Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.employeeName}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-400 mt-1">Auto-populated from your profile</p>
                </div>
              </div>
            </div>

            {/* Problem Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Problem Details</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Problem Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.problemType}
                    onChange={e => setForm(f => ({ ...f, problemType: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-sm bg-white"
                  >
                    <option value="">Select problem type...</option>
                    {PROBLEM_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Problem Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Describe the technical/maintenance problem clearly and in detail..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-sm resize-y"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.location}
                      onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                      placeholder="e.g. 2nd Floor, East Wing"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Office Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.officeNumber}
                      onChange={e => setForm(f => ({ ...f, officeNumber: e.target.value }))}
                      placeholder="e.g. 201, 305B"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Attach Photo of Problem</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Problem Photo <span className="text-red-500">*</span>
                </label>
                
                {!form.photoPreview ? (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Upload a clear photo showing the maintenance problem. Max file size: 5MB. Accepted formats: JPEG, PNG, GIF.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative inline-block">
                      <img
                        src={form.photoPreview}
                        alt="Problem preview"
                        className="max-w-sm w-full rounded-xl border border-gray-200 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition"
                        aria-label="Remove photo"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">Selected: {form.photo}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Error message */}
            {formError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                {formError}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="w-full px-6 py-3 bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold rounded-xl transition text-sm"
            >
              Submit Maintenance Report
            </button>
          </form>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800 max-w-3xl mt-6">
          <strong>Important:</strong> All fields marked with <span className="text-red-500">*</span> are required. Your report will be reviewed by the Institution Manager who will assign a technician to resolve the problem.
        </div>
      </>
    );
  }

  // Report list view (default)
  return (
    <>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Maintenance Report</h2>
          <p className="text-sm text-gray-500">Report technical or maintenance problems encountered during work.</p>
        </div>
        <button
          onClick={() => setView('new')}
          className="px-4 py-2 bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-sm font-semibold rounded-xl transition flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Report Maintenance Problem
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">My Maintenance Reports</h3>
          <span className="text-sm text-gray-500">{reports.length} report{reports.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="table-container border-0 rounded-none">
          <table className="data-table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Institution</th>
                <th>Problem Type</th>
                <th>Location</th>
                <th>Office</th>
                <th>Date</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center text-gray-400 py-6">
                    No maintenance reports submitted yet.
                  </td>
                </tr>
              ) : reports.map(r => (
                <tr key={r.id}>
                  <td className="font-medium">{r.id}</td>
                  <td>{r.institution}</td>
                  <td>{r.problemType}</td>
                  <td>{r.location}</td>
                  <td>{r.officeNumber}</td>
                  <td>{r.date}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>{r.assignedTo || <span className="text-gray-400">—</span>}</td>
                  <td>
                    <button
                      onClick={() => { setSelectedReport(r.id); setView('detail'); }}
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

      <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800">
        <strong>Maintenance Reporting:</strong> Report technical problems here. Your Institution Manager will review and assign a Technician. You cannot assign tasks yourself. Track your report status in the table above.
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
  const [announcements, setAnnouncements] = useState(() => getAnnouncements({ institution: 'MESOB Center' }));
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
        {announcements.length === 0 ? (
          <div className="text-center text-gray-400 py-12">No announcements available.</div>
        ) : announcements.map(ann => (
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
      case 'Maintenance Report':   return <SectionMaintenanceReport user={user} />;
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
