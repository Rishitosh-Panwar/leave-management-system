import { useState, useEffect } from 'react'
import LoginPage from './pages/LoginPage'
import Dashboard from './components/Dashboard'
import AdminPage from './pages/AdminPage'

/**
 * Main App component that handles routing between login, dashboard, and admin
 * This is the root component of our application
 */
function App() {
  // State to track if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  // State to store current user info
  const [currentUser, setCurrentUser] = useState(null)
  // State to track current view
  const [currentView, setCurrentView] = useState('dashboard')

  // Check if user was already logged in (from localStorage)
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
      setIsLoggedIn(true)
    }
  }, [])

  /**
   * Handles user login
   * @param {string} username - The username entered
   * @param {string} password - The password entered
   * @param {string} role - The user role (admin/employee)
   * @param {string} email - The user email (for signup)
   */
  const handleLogin = (username, password, role = 'employee', email = '') => {
    // Simple mock authentication - in real app, this would call an API
    if (username && password) {
      const user = { 
        username, 
        role: role || (username.toLowerCase().includes('admin') ? 'admin' : 'employee'),
        email
      }
      setCurrentUser(user)
      setIsLoggedIn(true)
      setCurrentView('dashboard')
      localStorage.setItem('currentUser', JSON.stringify(user))
    }
  }

  /**
   * Handles user logout
   */
  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser(null)
    setCurrentView('dashboard')
    localStorage.removeItem('currentUser')
  }

  /**
   * Handles navigation between views
   * @param {string} view - The view to navigate to
   */
  const handleNavigation = (view) => {
    setCurrentView(view)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with navigation when logged in */}
      {isLoggedIn && (
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-800">Leave Management System</h1>
              <div className="flex items-center gap-4">
                {/* Navigation */}
                <nav className="flex gap-2">
                  <button
                    onClick={() => handleNavigation('dashboard')}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      currentView === 'dashboard' 
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Dashboard
                  </button>
                  {currentUser?.role === 'admin' && (
                    <button
                      onClick={() => handleNavigation('admin')}
                      className={`px-4 py-2 rounded-md transition-colors ${
                        currentView === 'admin' 
                          ? 'bg-blue-500 text-white' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Admin Panel
                    </button>
                  )}
                </nav>
                
                {/* User info and logout */}
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">
                    Welcome, {currentUser?.username} 
                    {currentUser?.role === 'admin' && ' (Admin)'}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main content area */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!isLoggedIn ? (
          <LoginPage onLogin={handleLogin} />
        ) : currentView === 'admin' && currentUser?.role === 'admin' ? (
          <AdminPage />
        ) : (
          <Dashboard currentUser={currentUser} />
        )}
      </main>
    </div>
  )
}

export default App