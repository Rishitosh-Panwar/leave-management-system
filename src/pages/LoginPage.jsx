import { useState } from 'react'

/**
 * LoginPage component - handles user authentication and signup
 * This is a simple mock login without backend
 * @param {Function} onLogin - Callback function when login is successful
 */
const LoginPage = ({ onLogin }) => {
  // useState to manage form inputs
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSignup, setIsSignup] = useState(false)

  /**
   * Handles form submission for both login and signup
   * @param {Event} e - The form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Validation based on login/signup mode
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password')
      return
    }

    if (isSignup) {
      // Signup validation
      if (password !== confirmPassword) {
        setError('Passwords do not match')
        return
      }
      if (!email.trim()) {
        setError('Please enter your email')
        return
      }
      // In a real app, you'd send this to backend
      alert('Signup successful! You can now login.')
      setIsSignup(false)
      setUsername('')
      setPassword('')
      setConfirmPassword('')
      setEmail('')
      return
    }

    // Mock login - any non-empty credentials work
    // For demo: if username contains 'admin', assign admin role
    const role = username.toLowerCase().includes('admin') ? 'admin' : 'employee'
    onLogin(username, password, role, email)
  }

  /**
   * Toggles between login and signup modes
   */
  const toggleMode = () => {
    setIsSignup(!isSignup)
    setError('')
    setUsername('')
    setPassword('')
    setConfirmPassword('')
    setEmail('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Leave Management System
        </h2>
        <p className="text-center text-gray-600 mb-8">
          {isSignup ? 'Create your account' : 'Sign in to your account'}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your username"
            />
          </div>

          {/* Email field (only for signup) */}
          {isSignup && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>
          )}

          {/* Password field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>

          {/* Confirm Password field (only for signup) */}
          {isSignup && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirm your password"
              />
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isSignup ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Toggle between login and signup */}
        <div className="mt-6 text-center">
          <button
            onClick={toggleMode}
            className="text-blue-500 hover:text-blue-600 text-sm"
          >
            {isSignup 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Sign up"}
          </button>
        </div>

        {/* Demo credentials hint */}
        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <p className="text-sm text-gray-600 text-center">
            Mock login page working:<br/>
            • Use any credentials to login as employee<br/>
            • Include "admin" in username to login as admin<br/>
            • Signup creates a mock account
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage