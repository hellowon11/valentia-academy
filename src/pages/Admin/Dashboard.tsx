import React, { useState, useEffect } from 'react';
import { 
  FileText, Users, Clock, CheckCircle, TrendingUp,
  Download, Search, Filter, Calendar, Trash2, Paperclip
} from 'lucide-react';

interface Application {
  id: number;
  application_id: string;
  full_name: string;
  email: string;
  phone: string;
  course: string;
  status: string;
  language_preference: string;
  created_at: string;
  attachment_count: number;
}

interface Stats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  pending: number;
  byCourse: Record<string, number>;
  byStatus: Record<string, number>;
}

const Dashboard = () => {
  const navigate = (path: string) => {
    window.location.href = path;
  };
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    course: 'all',
    status: 'all',
    language: 'all',
    search: '',
    dateFrom: '',
    dateTo: ''
  });
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchApplications = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...filters
      });

      const response = await fetch(`/api/admin/applications?${params}`, {
        headers: getAuthHeaders()
      });

      if (response.status === 401) {
        navigate('/admin/login');
        return;
      }

      const data = await response.json();
      if (data.success) {
        setApplications(data.applications);
        setPagination(data.pagination);
        // Do not clear selection to allow cross-page selection
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        headers: getAuthHeaders()
      });

      if (response.status === 401) {
        navigate('/admin/login');
        return;
      }

      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [page, filters]);

  const handleExport = async () => {
    try {
      console.log('Exporting with selectedIds:', selectedIds);
      let url = '/api/admin/applications/export/excel';
      
      if (selectedIds.length > 0) {
        // Export selected only
        const params = new URLSearchParams();
        params.append('ids', selectedIds.join(','));
        url += `?${params.toString()}`;
      } else {
        // Export all matching filters
        const params = new URLSearchParams(filters);
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `applications-export-${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Failed to export applications');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-gray-100 text-gray-800',
      under_review: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      waitlisted: 'bg-blue-100 text-blue-800'
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const handleDeleteApplication = async (appId: number, applicationId: string, fullName: string) => {
    if (!confirm(`Are you sure you want to delete application ${applicationId} (${fullName})? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/applications/${appId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.status === 401) {
        navigate('/admin/login');
        return;
      }

      const data = await response.json();
      if (data.success) {
        // Refresh applications list
        await fetchApplications();
        await fetchStats();
        // Remove from selection if present
        setSelectedIds(prev => prev.filter(id => id !== appId));
        alert('Application deleted successfully');
      } else {
        alert(data.message || 'Failed to delete application');
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Failed to delete application');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedIds.length} applications? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch('/api/admin/applications/bulk-delete', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ids: selectedIds })
      });

      if (response.status === 401) {
        navigate('/admin/login');
        return;
      }

      const data = await response.json();
      if (data.success) {
        setSelectedIds([]);
        await fetchApplications();
        await fetchStats();
        alert(data.message);
      } else {
        alert(data.message || 'Failed to delete applications');
      }
    } catch (error) {
      console.error('Error deleting applications:', error);
      alert('Failed to delete applications');
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      // Add all current page applications to selection (prevent duplicates)
      const newIds = applications.map(app => app.id);
      setSelectedIds(prev => Array.from(new Set([...prev, ...newIds])));
    } else {
      // Remove all current page applications from selection
      const currentPageIds = applications.map(app => app.id);
      setSelectedIds(prev => prev.filter(id => !currentPageIds.includes(id)));
    }
  };

  const handleSelectOne = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleQuickStatusUpdate = async (appId: number, newStatus: string) => {
    // Check if this item is selected and there are multiple items selected
    if (selectedIds.includes(appId) && selectedIds.length > 1) {
      // Bulk update silently without confirmation
      let successCount = 0;
      // Optimistically update UI could be done here, but refreshing is safer
      
      for (const id of selectedIds) {
        try {
          const response = await fetch(`/api/admin/applications/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status: newStatus })
          });
          if (response.ok) successCount++;
        } catch (err) {
          console.error(`Failed to update app ${id}`, err);
        }
      }
      
      if (successCount > 0) {
        await fetchApplications();
        await fetchStats();
      }
      return;
    }

    // Single update (fallback or if user cancelled bulk update)
    try {
      const response = await fetch(`/api/admin/applications/${appId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status: newStatus
        })
      });

      if (response.status === 401) {
        navigate('/admin/login');
        return;
      }

      const data = await response.json();
      if (data.success) {
        // Refresh applications list
        await fetchApplications();
        await fetchStats();
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center cursor-pointer" onClick={() => window.location.href = '/admin/dashboard'}>
              <img src="/images/valentia-logo.png" alt="Valentia Logo" className="h-10 w-auto mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Application Management</h1>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-1 lg:mt-2">{stats.total}</p>
                </div>
                <FileText className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-600">Today</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-1 lg:mt-2">{stats.today}</p>
                </div>
                <Calendar className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-1 lg:mt-2">{stats.thisWeek}</p>
                </div>
                <TrendingUp className="h-6 w-6 lg:h-8 lg:w-8 text-purple-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-1 lg:mt-2">{stats.thisMonth}</p>
                </div>
                <Clock className="h-6 w-6 lg:h-8 lg:w-8 text-orange-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 lg:p-6 col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-1 lg:mt-2">{stats.pending}</p>
                </div>
                <CheckCircle className="h-6 w-6 lg:h-8 lg:w-8 text-yellow-600" />
              </div>
            </div>
          </div>
        )}

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Search by name, email, phone..."
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
              <select
                value={filters.course}
                onChange={(e) => setFilters({ ...filters, course: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Courses</option>
                <option value="advanced">Advanced</option>
                <option value="english">English</option>
                <option value="basic">Basic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="waitlisted">Waitlisted</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={filters.language}
                onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Languages</option>
                <option value="en">English</option>
                <option value="zh">Chinese</option>
                <option value="ko">Korean</option>
                <option value="ja">Japanese</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 className="h-5 w-5 mr-2" />
                Delete Selected ({selectedIds.length})
              </button>
            )}
            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="h-5 w-5 mr-2" />
              Export to Excel
            </button>
          </div>
        </div>

        {/* Mobile View - Cards */}
        <div className="md:hidden space-y-4">
          {applications.map((app) => (
            <div key={app.id} className={`bg-white rounded-xl shadow p-4 ${selectedIds.includes(app.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
              <div className="flex justify-between items-start mb-3">
                <div 
                  className="flex items-center space-x-3 cursor-pointer p-3 -ml-3 -mt-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 flex-grow"
                  onClick={() => handleSelectOne(app.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(app.id)}
                    onChange={() => {}} // Handled by parent div
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5 pointer-events-none"
                  />
                  <div>
                    <span className="text-xs text-gray-500 block">{app.application_id}</span>
                    <h3 className="font-bold text-gray-900">{app.full_name}</h3>
                  </div>
                </div>
                <select
                  value={app.status}
                  onChange={(e) => handleQuickStatusUpdate(app.id, e.target.value)}
                  className={`text-xs font-semibold px-2 py-1 rounded-full border-0 ${getStatusBadge(app.status)}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="pending">Pending</option>
                  <option value="under_review">Review</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="waitlisted">Waitlist</option>
                </select>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="capitalize font-medium mr-2">{app.course}</span>
                  {app.attachment_count > 0 && (
                    <div className="flex items-center text-blue-600 bg-blue-50 rounded-full px-2 py-0.5 text-xs">
                      <Paperclip className="h-3 w-3 mr-1" />
                      {app.attachment_count}
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-500 truncate">{app.email}</div>
                <div className="text-xs text-gray-400">{formatDate(app.created_at)}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  onClick={() => navigate(`/admin/applications/${app.id}`)}
                  className="flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleDeleteApplication(app.id, app.application_id, app.full_name)}
                  className="flex items-center justify-center px-4 py-2.5 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 active:bg-red-300"
                >
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-8 py-3 text-left w-16 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={(e) => {
                      // Prevent triggering if clicking directly on the checkbox to avoid double toggle
                      if (e.target !== e.currentTarget.querySelector('input')) {
                        // Toggle logic manually if needed, or better, just simulate click on input
                        // But since we have state, let's just toggle state
                        const isAllSelected = applications.length > 0 && applications.every(app => selectedIds.includes(app.id));
                        const event = { target: { checked: !isAllSelected } } as React.ChangeEvent<HTMLInputElement>;
                        handleSelectAll(event);
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={applications.length > 0 && applications.every(app => selectedIds.includes(app.id))}
                      onChange={handleSelectAll}
                      onClick={(e) => e.stopPropagation()} // Stop propagation to th
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    <Paperclip className="h-4 w-4 mx-auto" />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50 z-10">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr key={app.id} className={`hover:bg-gray-50 ${selectedIds.includes(app.id) ? 'bg-blue-50' : ''}`}>
                    <td 
                      className="px-8 py-4 whitespace-nowrap cursor-pointer hover:bg-blue-50 transition-colors" 
                      onClick={() => handleSelectOne(app.id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(app.id)}
                        onChange={() => {}} // Handled by parent td
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5 pointer-events-none"
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {app.application_id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {app.full_name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                      {app.attachment_count > 0 ? (
                        <div className="flex items-center justify-center text-blue-600 font-medium bg-blue-50 rounded-full py-1 px-2 w-fit mx-auto">
                          <Paperclip className="h-3 w-3 mr-1" />
                          {app.attachment_count}
                        </div>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="max-w-xs truncate" title={app.email}>
                        {app.email}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {app.course}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <select
                        value={app.status}
                        onChange={(e) => handleQuickStatusUpdate(app.id, e.target.value)}
                        className={`px-2 py-1 text-xs font-semibold rounded-full border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer ${getStatusBadge(app.status)}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="pending">Pending</option>
                        <option value="under_review">Under Review</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                        <option value="waitlisted">Waitlisted</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(app.created_at)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium sticky right-0 bg-white z-10 hover:bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => navigate(`/admin/applications/${app.id}`)}
                          className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteApplication(app.id, app.application_id, app.full_name)}
                          className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {applications.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-lg shadow mt-4">
            <p className="text-gray-500">No applications found</p>
          </div>
        )}

        {/* Pagination - Visible on both Mobile and Desktop */}
        {pagination.totalPages > 1 && (
          <div className="bg-white rounded-lg shadow px-4 py-4 mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {pagination.totalPages > 0 ? page : 0} of {pagination.totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 active:bg-gray-100"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                disabled={page === pagination.totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 active:bg-gray-100"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
