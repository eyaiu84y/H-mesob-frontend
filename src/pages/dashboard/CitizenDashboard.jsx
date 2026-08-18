import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { label: 'My Dashboard' },
  { label: 'My Applications' },
  { label: 'Apply for Service' },
  { label: 'Announcements' },
  { label: 'Profile & Documents' },
];

export default function CitizenDashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Citizen';

  return (
    <DashboardLayout
      title="My Account"
      navLinks={NAV_LINKS}
      accentColor="green"
      letter="C"
      subtitle="Citizen Portal"
    >
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] rounded-2xl p-6 text-white mb-8">
        <h2 className="text-xl font-semibold mb-1">Welcome back, {firstName}!</h2>
        <p className="text-blue-100 text-sm">Track your applications and apply for services at MESOB Center.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="stat-card">
          <p className="text-sm text-gray-500 mb-1">Active Applications</p>
          <p className="text-2xl font-bold">2</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500 mb-1">Completed</p>
          <p className="text-2xl font-bold">5</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-gray-500 mb-1">Announcements</p>
          <p className="text-2xl font-bold">3</p>
          <p className="text-xs text-gray-500 mt-1">Unread</p>
        </div>
      </div>

      {/* Applications table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">My Applications</h2>
          <a href="#" className="text-sm text-blue-600 hover:underline font-medium">+ New Application</a>
        </div>
        <div className="table-container border-0 rounded-none">
          <table className="data-table">
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Service</th>
                <th>Status</th>
                <th>Submitted</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium">#APP-1024</td>
                <td>National ID Registration</td>
                <td><span className="badge bg-amber-100 text-amber-800">Pending</span></td>
                <td>Aug 11, 2026</td>
                <td><a href="#" className="text-blue-600 hover:underline text-sm">Track</a></td>
              </tr>
              <tr>
                <td className="font-medium">#APP-0987</td>
                <td>Business License</td>
                <td><span className="badge bg-blue-100 text-blue-800">In Review</span></td>
                <td>Aug 05, 2026</td>
                <td><a href="#" className="text-blue-600 hover:underline text-sm">Track</a></td>
              </tr>
              <tr>
                <td className="font-medium">#APP-0851</td>
                <td>Tax Clearance</td>
                <td><span className="badge bg-green-100 text-green-800">Completed</span></td>
                <td>Jul 22, 2026</td>
                <td><a href="#" className="text-blue-600 hover:underline text-sm">Download</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick action cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Link to="/" className="stat-card hover:border-blue-400 transition flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#1e3a8a] flex items-center justify-center text-xl font-bold">+</div>
          <div>
            <p className="font-medium text-gray-900">Apply for a Service</p>
            <p className="text-sm text-gray-500">Browse available services</p>
          </div>
        </Link>
        <Link to="/" className="stat-card hover:border-blue-400 transition flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 text-green-700 flex items-center justify-center text-xl">?</div>
          <div>
            <p className="font-medium text-gray-900">Find Service Info</p>
            <p className="text-sm text-gray-500">Documents, fees &amp; time</p>
          </div>
        </Link>
      </div>

      {/* Info box */}
      <div className="p-4 bg-green-50 border border-green-100 rounded-xl text-sm text-green-800">
        <strong>Citizen:</strong> Submit applications, track application status, and view announcements. You cannot process other people&apos;s applications or access staff panels.
      </div>
    </DashboardLayout>
  );
}
