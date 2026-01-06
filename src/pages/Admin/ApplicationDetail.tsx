import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, FileText, Calendar, User, Mail, Phone, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Attachment {
  id: number;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  uploaded_at: string;
}

interface Note {
  id: number;
  content: string;
  note_type: string;
  created_by: string;
  created_at: string;
}

interface StatusHistory {
  id: number;
  old_status: string;
  new_status: string;
  changed_by: string;
  changed_at: string;
  notes: string | null;
}

interface Application {
  id: number;
  application_id: string;
  full_name: string;
  email: string;
  phone: string;
  course: string;
  status: string;
  message: string | null;
  language_preference: string;
  created_at: string;
  updated_at: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  attachments: Attachment[];
  notes: Note[];
  statusHistory: StatusHistory[];
}

const ApplicationDetail = () => {
  const navigate = (path: string) => {
    window.location.href = path;
  };

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdate, setStatusUpdate] = useState({
    status: '',
    notes: ''
  });
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  const applicationId = window.location.pathname.split('/').pop();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchApplication = async () => {
    try {
      const response = await fetch(`/api/admin/applications/${applicationId}`, {
        headers: getAuthHeaders()
      });

      if (response.status === 401) {
        navigate('/admin/login');
        return;
      }

      const data = await response.json();
      if (data.success) {
        setApplication(data.application);
        setStatusUpdate({ status: data.application.status, notes: '' });
      }
    } catch (error) {
      console.error('Error fetching application:', error);
      setError('Failed to load application');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [applicationId]);

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/applications/${applicationId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status: statusUpdate.status,
          reviewerNotes: statusUpdate.notes || undefined
        })
      });

      if (response.status === 401) {
        navigate('/admin/login');
        return;
      }

      const data = await response.json();
      if (data.success) {
        setStatusUpdate({ ...statusUpdate, notes: '' });
        alert('Status updated successfully');
        // Navigate back to dashboard after successful update
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleDownloadAttachment = async (attachmentId: number, fileName: string) => {
    try {
      const response = await fetch(`/api/admin/applications/${applicationId}/attachments/${attachmentId}`, {
        headers: getAuthHeaders()
      });

      if (response.status === 401) {
        navigate('/admin/login');
        return;
      }

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || 'Failed to download file');
        return;
      }

      // Get the blob data
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading attachment:', error);
      alert('Failed to download file');
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
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Application not found</p>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Application Details</h1>
                <p className="text-sm text-gray-500">{application.application_id}</p>
              </div>
            </div>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(application.status)}`}>
              {application.status.replace('_', ' ')}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Application Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Application Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <User className="h-4 w-4 mr-2" />
                    Full Name
                  </div>
                  <p className="text-gray-900 font-medium">{application.full_name}</p>
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </div>
                  <p className="text-gray-900 font-medium">{application.email}</p>
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Phone
                  </div>
                  <p className="text-gray-900 font-medium">{application.phone}</p>
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Course
                  </div>
                  <p className="text-gray-900 font-medium capitalize">{application.course}</p>
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Submitted
                  </div>
                  <p className="text-gray-900 font-medium">{formatDate(application.created_at)}</p>
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Language
                  </div>
                  <p className="text-gray-900 font-medium uppercase">{application.language_preference}</p>
                </div>
              </div>

              {application.message && (
                <div className="mt-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900 whitespace-pre-wrap">{application.message}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Attachments */}
            {application.attachments && application.attachments.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Attachments ({application.attachments.length})</h2>
                <div className="space-y-3">
                  {application.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-gray-900 font-medium">{attachment.file_name}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(attachment.file_size)} • {formatDate(attachment.uploaded_at)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownloadAttachment(attachment.id, attachment.file_name)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status History */}
            {application.statusHistory && application.statusHistory.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Status History</h2>
                <div className="space-y-4">
                  {application.statusHistory.map((history) => (
                    <div key={history.id} className="flex items-start space-x-4 pb-4 border-b border-gray-200 last:border-0">
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          history.new_status === 'accepted' ? 'bg-green-100' :
                          history.new_status === 'rejected' ? 'bg-red-100' :
                          history.new_status === 'under_review' ? 'bg-yellow-100' :
                          'bg-gray-100'
                        }`}>
                          {history.new_status === 'accepted' ? <CheckCircle className="h-5 w-5 text-green-600" /> :
                           history.new_status === 'rejected' ? <XCircle className="h-5 w-5 text-red-600" /> :
                           <Clock className="h-5 w-5 text-yellow-600" />}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-gray-900 font-medium">
                            Changed from <span className="text-gray-500">{history.old_status}</span> to{' '}
                            <span className={`font-semibold ${getStatusBadge(history.new_status)} px-2 py-1 rounded`}>
                              {history.new_status}
                            </span>
                          </p>
                          <p className="text-sm text-gray-500">{formatDate(history.changed_at)}</p>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">By {history.changed_by}</p>
                        {history.notes && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">{history.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {application.notes && application.notes.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Notes ({application.notes.length})</h2>
                <div className="space-y-4">
                  {application.notes.map((note) => (
                    <div key={note.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-900">{note.created_by}</p>
                        <p className="text-sm text-gray-500">{formatDate(note.created_at)}</p>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Status Update */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Update Status</h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <form onSubmit={handleStatusUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={statusUpdate.status}
                    onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="under_review">Under Review</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                    <option value="waitlisted">Waitlisted</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={statusUpdate.notes}
                    onChange={(e) => setStatusUpdate({ ...statusUpdate, notes: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Add notes about this status change..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
