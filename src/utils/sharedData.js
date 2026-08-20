/**
 * Shared Data Management for Maintenance Reports, Tasks, and Announcements
 * Uses localStorage for frontend persistence until backend integration
 */

// ─── MAINTENANCE REPORTS ──────────────────────────────────────────
const MAINTENANCE_REPORTS_KEY = 'mesob_maintenance_reports';
const MAINTENANCE_TASKS_KEY = 'mesob_maintenance_tasks';
const ANNOUNCEMENTS_KEY = 'mesob_announcements';

// Initialize default data if not exists
function initializeData() {
  if (!localStorage.getItem(MAINTENANCE_REPORTS_KEY)) {
    localStorage.setItem(MAINTENANCE_REPORTS_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(MAINTENANCE_TASKS_KEY)) {
    localStorage.setItem(MAINTENANCE_TASKS_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(ANNOUNCEMENTS_KEY)) {
    const defaultAnnouncements = [
      { id: 1, title: 'Scheduled System Maintenance – Sat Aug 16', body: 'System maintenance is planned for Aug 16, 2026 from 8–11 PM. All staff should complete pending operations before the window.', date: 'Aug 14, 2026', read: false, author: 'System Admin', scope: 'system', institution: null },
      { id: 2, title: 'System Update v2.4.1 Released', body: 'System update v2.4.1 has been deployed. Changes include improved queue processing performance and security patches.', date: 'Aug 10, 2026', read: false, author: 'System Admin', scope: 'system', institution: null },
      { id: 3, title: 'New Institution Onboarding – Labor & Skills', body: 'Labor & Skills Bureau has been onboarded to Hawassa MESOB. Institution Manager has been assigned. Services are now active.', date: 'Aug 05, 2026', read: true, author: 'System Admin', scope: 'system', institution: null },
    ];
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(defaultAnnouncements));
  }
}

initializeData();

// ─── MAINTENANCE REPORTS API ──────────────────────────────────────
export function getMaintenanceReports(filters = {}) {
  try {
    const reports = JSON.parse(localStorage.getItem(MAINTENANCE_REPORTS_KEY) || '[]');
    
    let filtered = reports;
    
    if (filters.reportedBy) {
      filtered = filtered.filter(r => r.reportedBy === filters.reportedBy);
    }
    
    if (filters.institution) {
      filtered = filtered.filter(r => r.institution === filters.institution);
    }
    
    if (filters.status) {
      filtered = filtered.filter(r => r.status === filters.status);
    }
    
    return filtered.sort((a, b) => b.id - a.id);
  } catch {
    return [];
  }
}

export function createMaintenanceReport(report) {
  try {
    const reports = JSON.parse(localStorage.getItem(MAINTENANCE_REPORTS_KEY) || '[]');
    const newReport = {
      id: `MR-${Date.now().toString().slice(-6)}`,
      ...report,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Submitted',
      assignedTo: null,
      taskId: null,
      createdAt: Date.now(),
    };
    reports.push(newReport);
    localStorage.setItem(MAINTENANCE_REPORTS_KEY, JSON.stringify(reports));
    return { success: true, report: newReport };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export function updateMaintenanceReport(id, updates) {
  try {
    const reports = JSON.parse(localStorage.getItem(MAINTENANCE_REPORTS_KEY) || '[]');
    const index = reports.findIndex(r => r.id === id);
    if (index === -1) return { success: false, message: 'Report not found' };
    
    reports[index] = { ...reports[index], ...updates };
    localStorage.setItem(MAINTENANCE_REPORTS_KEY, JSON.stringify(reports));
    return { success: true, report: reports[index] };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// ─── MAINTENANCE TASKS API ────────────────────────────────────────
export function getMaintenanceTasks(filters = {}) {
  try {
    const tasks = JSON.parse(localStorage.getItem(MAINTENANCE_TASKS_KEY) || '[]');
    
    let filtered = tasks;
    
    if (filters.assignedTo) {
      filtered = filtered.filter(t => t.assignedTo === filters.assignedTo);
    }
    
    if (filters.institution) {
      filtered = filtered.filter(t => t.institution === filters.institution);
    }
    
    if (filters.status) {
      filtered = filtered.filter(t => t.status === filters.status);
    }
    
    return filtered.sort((a, b) => b.id - a.id);
  } catch {
    return [];
  }
}

export function createMaintenanceTask(task) {
  try {
    const tasks = JSON.parse(localStorage.getItem(MAINTENANCE_TASKS_KEY) || '[]');
    const newTask = {
      id: `TASK-${Date.now().toString().slice(-6)}`,
      ...task,
      assignedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Assigned',
      report: null,
      createdAt: Date.now(),
    };
    tasks.push(newTask);
    localStorage.setItem(MAINTENANCE_TASKS_KEY, JSON.stringify(tasks));
    
    // Update related maintenance report if exists
    if (task.reportId) {
      updateMaintenanceReport(task.reportId, {
        status: 'Assigned',
        assignedTo: task.assignedTo,
        taskId: newTask.id,
      });
    }
    
    return { success: true, task: newTask };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export function updateMaintenanceTask(id, updates) {
  try {
    const tasks = JSON.parse(localStorage.getItem(MAINTENANCE_TASKS_KEY) || '[]');
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return { success: false, message: 'Task not found' };
    
    tasks[index] = { ...tasks[index], ...updates };
    localStorage.setItem(MAINTENANCE_TASKS_KEY, JSON.stringify(tasks));
    
    // Update related maintenance report if exists
    if (tasks[index].reportId) {
      const statusMap = {
        'Assigned': 'Assigned',
        'In Progress': 'In Progress',
        'Completed': 'Completed',
      };
      updateMaintenanceReport(tasks[index].reportId, {
        status: statusMap[updates.status] || tasks[index].status,
      });
    }
    
    return { success: true, task: tasks[index] };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// ─── ANNOUNCEMENTS API ────────────────────────────────────────────
export function getAnnouncements(filters = {}) {
  try {
    const announcements = JSON.parse(localStorage.getItem(ANNOUNCEMENTS_KEY) || '[]');
    
    let filtered = announcements;
    
    if (filters.scope) {
      filtered = filtered.filter(a => {
        if (filters.scope === 'system') return a.scope === 'system';
        if (filters.scope === 'mesob') return a.scope === 'mesob';
        if (filters.scope === 'institution') {
          return a.scope === 'institution' && a.institution === filters.institution;
        }
        return true;
      });
    }
    
    if (filters.institution && filters.scope !== 'institution') {
      // Show system + mesob + institution-specific announcements
      filtered = filtered.filter(a => 
        a.scope === 'system' || 
        a.scope === 'mesob' || 
        (a.scope === 'institution' && a.institution === filters.institution)
      );
    }
    
    return filtered.sort((a, b) => b.id - a.id);
  } catch {
    return [];
  }
}

export function createAnnouncement(announcement) {
  try {
    const announcements = JSON.parse(localStorage.getItem(ANNOUNCEMENTS_KEY) || '[]');
    const newAnnouncement = {
      id: Date.now(),
      ...announcement,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      read: false,
      createdAt: Date.now(),
    };
    announcements.push(newAnnouncement);
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(announcements));
    return { success: true, announcement: newAnnouncement };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export function markAnnouncementRead(id) {
  try {
    const announcements = JSON.parse(localStorage.getItem(ANNOUNCEMENTS_KEY) || '[]');
    const index = announcements.findIndex(a => a.id === id);
    if (index !== -1) {
      announcements[index].read = true;
      localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(announcements));
    }
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
