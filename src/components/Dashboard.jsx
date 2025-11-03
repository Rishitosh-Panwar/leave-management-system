import { useState } from 'react'
import LeaveForm from './LeaveForm'
import LeaveHistory from './LeaveHistory'
import { LeaveService } from '../services/LeaveService'

/**
 * Dashboard component - main dashboard after login
 * Shows leave balance and navigation to other features
 * @param {Object} currentUser - The currently logged in user
 */
const Dashboard = ({ currentUser }) => {
  // State to track current view (dashboard, form, or history)
  const [currentView, setCurrentView] = useState('dashboard')
  // State to store user's leave balance
  const [leaveBalance, setLeaveBalance] = useState(18)

  /**
   * Handles applying for leave by switching to form view
   */
  const handleApplyLeave = () => {
    setCurrentView('form')
  }

  /**
   * Handles viewing leave history by switching to history view
   */
  const handleViewHistory = () => {
    setCurrentView('history')
  }

  /**
   * Handles going back to dashboard from other views
   */
  const handleBackToDashboard = () => {
    setCurrentView('dashboard')
  }

  /**
   * Handles form submission and updates leave balance
   * @param {Object} formData - The leave application data
   */
  const handleLeaveSubmit = async (formData) => {
    try {
      // Submit leave application with username
      await LeaveService.submitLeave(formData, currentUser.username)
      
      // Calculate days taken (simple calculation)
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      const daysTaken = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1
      
      setLeaveBalance(prev => prev - daysTaken)
      
      // Switch back to dashboard after submission
      setCurrentView('dashboard')
      alert('Leave application submitted successfully!')
    } catch (error) {
      alert('Error submitting leave application. Please try again.')
    }
  }

  // Render different views based on currentView state
  return (
    <div className="space-y-8">
      {/* Navigation buttons when not on dashboard */}
      {currentView !== 'dashboard' && (
        <button
          onClick={handleBackToDashboard}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
        >
          ← Back to Dashboard
        </button>
      )}

      {/* Dashboard View */}
      {currentView === 'dashboard' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {currentUser?.role === 'admin' ? 'Admin' : 'Employee'} Dashboard
          </h2>
          
          {/* Welcome message for admin */}
          {currentUser?.role === 'admin' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-800">Admin Access</h3>
              <p className="text-blue-600">
                You have administrator privileges. You can manage all leave applications in the Admin Panel.
              </p>
            </div>
          )}
          
          {/* Leave Balance Card (only for employees) */}
          {currentUser?.role !== 'admin' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-800">Leave Balance</h3>
              <p className="text-3xl font-bold text-blue-600">{leaveBalance} days</p>
              <p className="text-sm text-blue-600 mt-2">Remaining for this year</p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentUser?.role !== 'admin' && (
              <button
                onClick={handleApplyLeave}
                className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-colors text-center"
              >
                <span className="text-lg font-semibold">Apply for Leave</span>
                <p className="text-sm mt-2">Submit a new leave request</p>
              </button>
            )}

            <button
              onClick={handleViewHistory}
              className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600 transition-colors text-center"
            >
              <span className="text-lg font-semibold">
                {currentUser?.role === 'admin' ? 'View All Leaves' : 'View Leave History'}
              </span>
              <p className="text-sm mt-2">
                {currentUser?.role === 'admin' 
                  ? 'Check all leave applications' 
                  : 'Check your previous applications'
                }
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Leave Form View (only for employees) */}
      {currentView === 'form' && currentUser?.role !== 'admin' && (
        <LeaveForm onSubmit={handleLeaveSubmit} />
      )}

      {/* Leave History View */}
      {currentView === 'history' && (
        <LeaveHistory currentUser={currentUser} />
      )}
    </div>
  )
}

export default Dashboard