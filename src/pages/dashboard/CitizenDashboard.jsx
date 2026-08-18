import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const firstName = user?.name?.split(' ')[0] || 'Citizen';

  const navLinks = [
    { label: 'My Dashboard', section: 'dashboard' },
    { label: 'My Applications', section: 'applications' },
    { label: 'Apply for Service', section: 'apply' },
    { label: 'Announcements', section: 'announcements' },
    { label: 'Profile & Documents', section: 'profile' },
  ];

  return (
    <DashboardLayout
      title="My Account"
      navLinks={navLinks.map(link => ({
        label: link.label,
        href: '#',
        onClick: (e) => {
          e.preventDefault();
          setActiveSection(link.section);
        }
      }))}
      accentColor="green"
      letter="C"
      subtitle="Citizen Portal"
    >
      {/* My Dashboard Section */}
      {activeSection === 'dashboard' && (
        <>
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
              <h2 className="font-semibold text-gray-900">Recent Applications</h2>
              <button
                onClick={() => setActiveSection('applications')}
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                View All
              </button>
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
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick action cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setActiveSection('apply')}
              className="stat-card hover:border-blue-400 transition flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#1e3a8a] flex items-center justify-center text-xl font-bold">+</div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Apply for a Service</p>
                <p className="text-sm text-gray-500">Browse available services</p>
              </div>
            </button>
            <Link to="/" className="stat-card hover:border-blue-400 transition flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 text-green-700 flex items-center justify-center text-xl">?</div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Find Service Info</p>
                <p className="text-sm text-gray-500">Documents, fees &amp; time</p>
              </div>
            </Link>
          </div>

          {/* Info box */}
          <div className="p-4 bg-green-50 border border-green-100 rounded-xl text-sm text-green-800">
            <strong>Citizen:</strong> Submit applications, track application status, and view announcements. You cannot process other people&apos;s applications or access staff panels.
          </div>
        </>
      )}

      {/* My Applications Section */}
      {activeSection === 'applications' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">My Applications</h2>
            <button
              onClick={() => setActiveSection('apply')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              + New Application
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">All (7)</button>
            <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200">Pending (2)</button>
            <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200">In Review (0)</button>
            <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200">Completed (5)</button>
          </div>

          {/* Applications table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="table-container border-0 rounded-none">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Application ID</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th>Last Updated</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-medium">#APP-1024</td>
                    <td>National ID Registration</td>
                    <td><span className="badge bg-amber-100 text-amber-800">Pending</span></td>
                    <td>Aug 11, 2026</td>
                    <td>Aug 15, 2026</td>
                    <td><a href="#" className="text-blue-600 hover:underline text-sm">Track</a></td>
                  </tr>
                  <tr>
                    <td className="font-medium">#APP-0987</td>
                    <td>Business License</td>
                    <td><span className="badge bg-blue-100 text-blue-800">In Review</span></td>
                    <td>Aug 05, 2026</td>
                    <td>Aug 14, 2026</td>
                    <td><a href="#" className="text-blue-600 hover:underline text-sm">Track</a></td>
                  </tr>
                  <tr>
                    <td className="font-medium">#APP-0851</td>
                    <td>Tax Clearance</td>
                    <td><span className="badge bg-green-100 text-green-800">Completed</span></td>
                    <td>Jul 22, 2026</td>
                    <td>Aug 01, 2026</td>
                    <td><a href="#" className="text-blue-600 hover:underline text-sm">Download</a></td>
                  </tr>
                  <tr>
                    <td className="font-medium">#APP-0756</td>
                    <td>Passport Renewal</td>
                    <td><span className="badge bg-green-100 text-green-800">Completed</span></td>
                    <td>Jul 10, 2026</td>
                    <td>Jul 25, 2026</td>
                    <td><a href="#" className="text-blue-600 hover:underline text-sm">Download</a></td>
                  </tr>
                  <tr>
                    <td className="font-medium">#APP-0698</td>
                    <td>Work Permit</td>
                    <td><span className="badge bg-green-100 text-green-800">Completed</span></td>
                    <td>Jun 28, 2026</td>
                    <td>Jul 15, 2026</td>
                    <td><a href="#" className="text-blue-600 hover:underline text-sm">Download</a></td>
                  </tr>
                  <tr>
                    <td className="font-medium">#APP-0621</td>
                    <td>Birth Certificate</td>
                    <td><span className="badge bg-green-100 text-green-800">Completed</span></td>
                    <td>Jun 10, 2026</td>
                    <td>Jun 20, 2026</td>
                    <td><a href="#" className="text-blue-600 hover:underline text-sm">Download</a></td>
                  </tr>
                  <tr>
                    <td className="font-medium">#APP-0543</td>
                    <td>Driver License</td>
                    <td><span className="badge bg-green-100 text-green-800">Completed</span></td>
                    <td>May 15, 2026</td>
                    <td>Jun 01, 2026</td>
                    <td><a href="#" className="text-blue-600 hover:underline text-sm">Download</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Apply for Service Section */}
      {activeSection === 'apply' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Apply for a Service</h2>
            <p className="text-gray-600">Select a service category to view available services.</p>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search services..."
              className="w-full px-4 py-3 pl-11 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Service categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="stat-card hover:border-blue-400 transition cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Identity Documents</h3>
                  <p className="text-sm text-gray-600">National ID, Passport, Birth Certificate</p>
                  <p className="text-xs text-blue-600 mt-2 font-medium">5 services →</p>
                </div>
              </div>
            </div>

            <div className="stat-card hover:border-blue-400 transition cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Business Services</h3>
                  <p className="text-sm text-gray-600">Business License, Tax Registration</p>
                  <p className="text-xs text-blue-600 mt-2 font-medium">4 services →</p>
                </div>
              </div>
            </div>

            <div className="stat-card hover:border-blue-400 transition cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Property Services</h3>
                  <p className="text-sm text-gray-600">Land Title, Construction Permit</p>
                  <p className="text-xs text-blue-600 mt-2 font-medium">3 services →</p>
                </div>
              </div>
            </div>

            <div className="stat-card hover:border-blue-400 transition cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Education Services</h3>
                  <p className="text-sm text-gray-600">Certificate Verification, Transcript</p>
                  <p className="text-xs text-blue-600 mt-2 font-medium">3 services →</p>
                </div>
              </div>
            </div>

            <div className="stat-card hover:border-blue-400 transition cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Legal Services</h3>
                  <p className="text-sm text-gray-600">Court Documents, Legal Certificates</p>
                  <p className="text-xs text-blue-600 mt-2 font-medium">4 services →</p>
                </div>
              </div>
            </div>

            <div className="stat-card hover:border-blue-400 transition cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Utility Services</h3>
                  <p className="text-sm text-gray-600">Water, Electricity, Phone Connection</p>
                  <p className="text-xs text-blue-600 mt-2 font-medium">6 services →</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800">
            <strong>Tip:</strong> Click on a service category to view all available services. You can also browse the <Link to="/" className="underline font-medium">Service Catalogue</Link> for complete information.
          </div>
        </div>
      )}

      {/* Announcements Section */}
      {activeSection === 'announcements' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Announcements</h2>
            <p className="text-gray-600">Latest updates and notices from MESOB Center.</p>
          </div>

          {/* Announcements list */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">New National ID Application Process</h3>
                    <span className="badge bg-blue-100 text-blue-700 text-xs">New</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    The National ID application process has been updated. Applicants are now required to submit biometric data along with their application. Please visit the Identity Services section for more details.
                  </p>
                  <p className="text-xs text-gray-500">Posted: August 15, 2026</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">System Maintenance Notice</h3>
                    <span className="badge bg-amber-100 text-amber-700 text-xs">Important</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    MESOB Center online services will undergo scheduled maintenance on August 20, 2026, from 12:00 AM to 6:00 AM. Services may be temporarily unavailable during this time.
                  </p>
                  <p className="text-xs text-gray-500">Posted: August 12, 2026</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">Extended Service Hours</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    MESOB Center will now be open on Saturdays from 8:30 AM to 12:30 PM to better serve our citizens. All services will be available during these hours.
                  </p>
                  <p className="text-xs text-gray-500">Posted: August 8, 2026</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm opacity-60">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">Holiday Closure Notice</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    MESOB Center will be closed on August 19, 2026 (Ethiopian New Year). Regular services will resume on August 20, 2026.
                  </p>
                  <p className="text-xs text-gray-500">Posted: August 1, 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile & Documents Section */}
      {activeSection === 'profile' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile & Documents</h2>
            <p className="text-gray-600">Manage your personal information and uploaded documents.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        defaultValue={user?.name || 'Citizen'}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        defaultValue={user?.email || ''}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+251 91 234 5678"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      rows="2"
                      placeholder="Your address"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                      Save Changes
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

              {/* Change Password */}
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                    />
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                    Update Password
                  </button>
                </div>
              </div>
            </div>

            {/* Uploaded Documents */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Uploaded Documents</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">
                      PDF
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">National_ID.pdf</p>
                      <p className="text-xs text-gray-500">245 KB</p>
                    </div>
                    <button className="text-blue-600 hover:underline text-xs">View</button>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                      IMG
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">Photo.jpg</p>
                      <p className="text-xs text-gray-500">1.2 MB</p>
                    </div>
                    <button className="text-blue-600 hover:underline text-xs">View</button>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">
                      PDF
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">Birth_Certificate.pdf</p>
                      <p className="text-xs text-gray-500">189 KB</p>
                    </div>
                    <button className="text-blue-600 hover:underline text-xs">View</button>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-400 hover:text-blue-600 transition text-sm font-medium">
                  + Upload New Document
                </button>
              </div>

              {/* Account Stats */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Account Status</p>
                    <p className="text-xl font-bold">Active</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="opacity-90">Member Since:</span>
                    <span className="font-medium">May 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-90">Total Applications:</span>
                    <span className="font-medium">7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-90">Completed:</span>
                    <span className="font-medium">5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
