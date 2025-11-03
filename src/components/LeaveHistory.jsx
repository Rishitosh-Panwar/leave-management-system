import { useState, useEffect } from 'react'
import { LeaveService } from '../services/LeaveService'

/**
 * LeaveHistory component - displays leave application history
 * Shows a table with leave requests and their status
 * @param {Object} currentUser - The currently logged in user
 */
const LeaveHistory = ({ currentUser }) => {
  // State to store leave history data
  const [leaveHistory, setLeaveHistory] = useState([])
  // State to track loading status
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Fetches leave history when component mounts
   */
  useEffect(() => {
    const fetchLeaveHistory = async () => {
      try {
        setIsLoading(true)
        // If user is admin, get all leaves. Otherwise, get user-specific leaves
        const history = currentUser?.role === 'admin' 
          ? await LeaveService.getAllLeaves()
          : await LeaveService.getLeaveHistory(currentUser?.username)
        setLeaveHistory(history)
      } catch (error) {
        console.error('Error fetching leave history:', error)
        alert('Error loading leave history')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaveHistory()
  }, [currentUser])

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

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {currentUser?.role === 'admin' ? 'All Leave Applications' : 'Leave History'}
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-600">Loading leave history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {currentUser?.role === 'admin' ? 'All Leave Applications' : 'Your Leave History'}
      </h2>
      
      {leaveHistory.length === 0 ? (
        // Empty state
        <div className="text-center py-8">
          <p className="text-gray-600">No leave applications found.</p>
          <p className="text-sm text-gray-500 mt-2">
            {currentUser?.role === 'admin' 
              ? 'Leave applications will appear here once employees start applying.' 
              : 'Your leave applications will appear here once you apply.'
            }
          </p>
        </div>
      ) : (
        // Leave history table
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {currentUser?.role === 'admin' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leave Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaveHistory.map((leave) => (
                <tr key={leave.id} className="hover:bg-gray-50">
                  {currentUser?.role === 'admin' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {leave.applicant || 'Employee'}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {leave.leaveType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(leave.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(leave.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {leave.reason}
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
      )}
    </div>
  )
}

export default LeaveHistory