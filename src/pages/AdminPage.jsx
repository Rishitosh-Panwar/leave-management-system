import { useState, useEffect } from 'react'
import { LeaveService } from '../services/LeaveService'

/**
 * AdminPage component - for admins to manage leave applications
 * Shows all pending leaves and allows approval/rejection
 */
const AdminPage = () => {
  // State to store all leave applications
  const [allLeaves, setAllLeaves] = useState([])
  // State to track loading status
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Fetches all leave applications when component mounts
   */
  useEffect(() => {
    fetchAllLeaves()
  }, [])

  /**
   * Fetches all leave applications from the service
   */
  const fetchAllLeaves = async () => {
    try {
      setIsLoading(true)
      const leaves = await LeaveService.getAllLeaves()
      setAllLeaves(leaves)
    } catch (error) {
      console.error('Error fetching leaves:', error)
      alert('Error loading leave applications')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handles approving a leave application
   * @param {string} leaveId - The ID of the leave to approve
   */
  const handleApprove = async (leaveId) => {
    try {
      await LeaveService.updateLeaveStatus(leaveId, 'approved')
      alert('Leave application approved!')
      fetchAllLeaves() // Refresh the list
    } catch (error) {
      alert('Error approving leave application')
    }
  }

  /**
   * Handles rejecting a leave application
   * @param {string} leaveId - The ID of the leave to reject
   */
  const handleReject = async (leaveId) => {
    try {
      await LeaveService.updateLeaveStatus(leaveId, 'rejected')
      alert('Leave application rejected!')
      fetchAllLeaves() // Refresh the list
    } catch (error) {
      alert('Error rejecting leave application')
    }
  }

  /**
   * Returns appropriate styling based on leave status
   * @param {string} status - The status of the leave application
   * @returns {string} Tailwind CSS classes for styling
   */
  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Filter leaves by status for different tabs
  const pendingLeaves = allLeaves.filter(leave => leave.status === 'pending')
  const approvedLeaves = allLeaves.filter(leave => leave.status === 'approved')
  const rejectedLeaves = allLeaves.filter(leave => leave.status === 'rejected')

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
        <div className="text-center py-8">
          <p className="text-gray-600">Loading leave applications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800">Pending</h3>
            <p className="text-3xl font-bold text-blue-600">{pendingLeaves.length}</p>
            <p className="text-sm text-blue-600">Leave applications</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-800">Approved</h3>
            <p className="text-3xl font-bold text-green-600">{approvedLeaves.length}</p>
            <p className="text-sm text-green-600">Leave applications</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-800">Rejected</h3>
            <p className="text-3xl font-bold text-red-600">{rejectedLeaves.length}</p>
            <p className="text-sm text-red-600">Leave applications</p>
          </div>
        </div>

        {/* Pending Leaves Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Pending Leave Applications</h3>
          
          {pendingLeaves.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No pending leave applications.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Leave Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingLeaves.map((leave) => (
                    <tr key={leave.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {leave.applicant || 'Employee'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {leave.leaveType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="truncate" title={leave.reason}>
                          {leave.reason}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(leave.id)}
                            className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(leave.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* All Leaves Summary */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">All Leave Applications</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allLeaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {leave.applicant || 'Employee'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {leave.leaveType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(leave.status)}`}>
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage