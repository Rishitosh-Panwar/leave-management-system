/**
 * LeaveService - Mock service for handling leave-related operations
 * This simulates API calls using localStorage for data persistence
 */

// Key for storing leave data in localStorage
const LEAVE_STORAGE_KEY = 'leaveApplications'
const USERS_STORAGE_KEY = 'users'

/**
 * Generates a unique ID for new leave applications
 * @returns {string} A unique ID
 */
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

/**
 * Gets all leave applications from localStorage
 * @returns {Array} Array of leave applications
 */
const getStoredLeaves = () => {
  try {
    const stored = localStorage.getItem(LEAVE_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading leave data:', error)
    return []
  }
}

/**
 * Saves leave applications to localStorage
 * @param {Array} leaves - Array of leave applications to save
 */
const saveLeaves = (leaves) => {
  try {
    localStorage.setItem(LEAVE_STORAGE_KEY, JSON.stringify(leaves))
  } catch (error) {
    console.error('Error saving leave data:', error)
  }
}

/**
 * Mock service object for leave operations
 */
export const LeaveService = {
  /**
   * Submits a new leave application
   * @param {Object} leaveData - The leave application data
   * @param {string} username - The applicant's username
   * @returns {Promise<Object>} The saved leave application with ID and status
   */
  async submitLeave(leaveData, username = 'Employee') {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        const leaves = getStoredLeaves()
        
        const newLeave = {
          id: generateId(),
          ...leaveData,
          applicant: username,
          status: 'pending', // Default status
          appliedDate: new Date().toISOString()
        }
        
        leaves.push(newLeave)
        saveLeaves(leaves)
        
        resolve(newLeave)
      }, 500) // Simulate network delay
    })
  },

  /**
   * Gets leave history for the current user
   * @param {string} username - The username to filter by (optional)
   * @returns {Promise<Array>} Array of leave applications
   */
  async getLeaveHistory(username = null) {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        const leaves = getStoredLeaves()
        
        // If no leaves exist, create some sample data for demo
        if (leaves.length === 0) {
          const sampleLeaves = [
            {
              id: generateId(),
              leaveType: 'casual',
              startDate: '2023-10-15',
              endDate: '2023-10-16',
              reason: 'Family function',
              status: 'approved',
              applicant: 'john_doe',
              appliedDate: '2023-10-10T00:00:00.000Z'
            },
            {
              id: generateId(),
              leaveType: 'sick',
              startDate: '2023-10-20',
              endDate: '2023-10-21',
              reason: 'Fever and cold',
              status: 'approved',
              applicant: 'jane_smith',
              appliedDate: '2023-10-18T00:00:00.000Z'
            },
            {
              id: generateId(),
              leaveType: 'emergency',
              startDate: '2023-11-01',
              endDate: '2023-11-01',
              reason: 'Urgent personal work',
              status: 'pending',
              applicant: 'john_doe',
              appliedDate: '2023-10-30T00:00:00.000Z'
            }
          ]
          saveLeaves(sampleLeaves)
          resolve(username ? sampleLeaves.filter(leave => leave.applicant === username) : sampleLeaves)
        } else {
          const filteredLeaves = username 
            ? leaves.filter(leave => leave.applicant === username)
            : leaves
          resolve(filteredLeaves)
        }
      }, 300) // Simulate network delay
    })
  },

  /**
   * Gets all leave applications (for admin)
   * @returns {Promise<Array>} Array of all leave applications
   */
  async getAllLeaves() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const leaves = getStoredLeaves()
        
        if (leaves.length === 0) {
          // Return sample data if no leaves exist
          const sampleLeaves = [
            {
              id: generateId(),
              leaveType: 'casual',
              startDate: '2023-10-15',
              endDate: '2023-10-16',
              reason: 'Family function',
              status: 'approved',
              applicant: 'john_doe',
              appliedDate: '2023-10-10T00:00:00.000Z'
            },
            {
              id: generateId(),
              leaveType: 'sick',
              startDate: '2023-10-20',
              endDate: '2023-10-21',
              reason: 'Fever and cold',
              status: 'approved',
              applicant: 'jane_smith',
              appliedDate: '2023-10-18T00:00:00.000Z'
            },
            {
              id: generateId(),
              leaveType: 'emergency',
              startDate: '2023-11-01',
              endDate: '2023-11-01',
              reason: 'Urgent personal work',
              status: 'pending',
              applicant: 'robert_johnson',
              appliedDate: '2023-10-30T00:00:00.000Z'
            }
          ]
          saveLeaves(sampleLeaves)
          resolve(sampleLeaves)
        } else {
          resolve(leaves)
        }
      }, 300)
    })
  },

  /**
   * Updates the status of a leave application
   * @param {string} leaveId - The ID of the leave to update
   * @param {string} status - The new status ('approved', 'rejected', 'pending')
   * @returns {Promise<Object>} The updated leave application
   */
  async updateLeaveStatus(leaveId, status) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const leaves = getStoredLeaves()
        const leaveIndex = leaves.findIndex(leave => leave.id === leaveId)
        
        if (leaveIndex === -1) {
          reject(new Error('Leave application not found'))
          return
        }
        
        leaves[leaveIndex].status = status
        leaves[leaveIndex].processedDate = new Date().toISOString()
        saveLeaves(leaves)
        
        resolve(leaves[leaveIndex])
      }, 500)
    })
  }
}