/**
 * Utility functions for the Leave Management System
 * Contains helper functions that can be used across the application
 */

/**
 * Formats a date string to a more readable format
 * @param {string} dateString - The date string to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
  
  const date = new Date(dateString)
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid Date'
  }
  
  return date.toLocaleDateString('en-US', { ...defaultOptions, ...options })
}

/**
 * Calculates the number of days between two dates
 * @param {string} startDate - Start date string
 * @param {string} endDate - End date string
 * @returns {number} Number of days between dates
 */
export const calculateDaysBetween = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  // Calculate difference in milliseconds and convert to days
  const differenceInTime = end.getTime() - start.getTime()
  const differenceInDays = differenceInTime / (1000 * 3600 * 24)
  
  // Add 1 to include both start and end dates
  return Math.floor(differenceInDays) + 1
}

/**
 * Validates if a date is in the future
 * @param {string} dateString - The date string to validate
 * @returns {boolean} True if date is in the future
 */
export const isFutureDate = (dateString) => {
  const inputDate = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Reset time part for accurate comparison
  
  return inputDate >= today
}

/**
 * Validates if end date is after start date
 * @param {string} startDate - Start date string
 * @param {string} endDate - End date string
 * @returns {boolean} True if end date is after start date
 */
export const isValidDateRange = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  return end >= start
}

/**
 * Generates a random color for UI elements
 * @returns {string} Tailwind CSS color class
 */
export const getRandomColor = () => {
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
    'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}