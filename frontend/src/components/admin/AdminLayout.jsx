import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { getProfileImage, getFullName } from '../../utils/imageHelpers'
import '../../styles/admin-responsive.css'

// SVG Icon Components (moved outside to avoid render-time creation)
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

const CarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
)

const AddIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
)

const ListIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
)

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
)

const ChartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
)

const MenuIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const CloseIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const ExternalLinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
)

const ThemeToggleIcon = ({ isDark, className = "w-5 h-5" }) => (
  isDark ? (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ) : (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  )
)

const AdminLayout = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { toggleTheme, isDark } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setTimeout(() => {
        setSidebarOpen(false)
      }, 0)
    }
  }, [location.pathname, isMobile])

  const handleLogout = () => {
    navigate('/')
    logout()
  }

  const adminMenuLinks = [
    { 
      name: "Dashboard", 
      path: "/admin/dashboard", 
      icon: DashboardIcon
    },
    { 
      name: "Manage Cars", 
      path: "/admin/manage-cars", 
      icon: CarIcon
    },
    { 
      name: "Add Car", 
      path: "/admin/add-car", 
      icon: AddIcon
    },
    { 
      name: "Manage Bookings", 
      path: "/admin/bookings", 
      icon: ListIcon
    },
  ]

  const additionalMenuLinks = [
    {
      name: "User Management",
      path: "/admin/users",
      icon: UsersIcon
    },
    {
      name: "Reports & Analytics",
      path: "/admin/reports",
      icon: ChartIcon
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: SettingsIcon
    }
  ]

  return (
    <div className="admin-container flex h-screen bg-[var(--bg-secondary)]">
      {/* Sidebar */}
      <div className={`
        bg-[var(--bg-primary)]
        border-r
        border-[var(--border-color)]
        flex
        flex-col
        fixed
        lg:static
        inset-y-0
        left-0
        z-50
        transform
        transition-transform
        duration-300
        ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-64
        shrink-0
      `}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-[var(--border-color)]">
          <Link to="/" className="flex items-center group">
            <div className="w-10 h-10 rounded-lg border border-[var(--border-color)] bg-slate-100 dark:bg-slate-800 shadow-sm">
              <img
                src="/auto.png"
                alt="Autoria Logo"
                className="w-full h-full rounded-lg object-contain p-1"
              />
            </div>
            <span className="ml-3 text-xl font-bold text-[var(--text-primary)]">Autoria Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* User Profile */}
        <div className="px-4 py-3 border-b border-[var(--border-color)]">
          <div className="flex items-center">
            <div className="relative shrink-0">
              <img
                src={getProfileImage(user)}
                alt={getFullName(user)}
                className="h-10 w-10 rounded-full object-cover border-2 border-[var(--border-color)]"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getFullName(user))}&background=3B82F6&color=fff`;
                }}
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[var(--bg-primary)]"></div>
            </div>
            <div className="ml-3 min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                {getFullName(user)}
              </p>
              <p className="text-xs text-[var(--text-secondary)] capitalize">
                {user?.role === 'admin' ? 'Administrator' : user?.role || 'User'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto min-h-0">
          {/* Main Navigation */}
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
              Main
            </p>
            {adminMenuLinks.map((item, index) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`
                    flex
                    items-center
                    px-3
                    py-2.5
                    text-sm
                    font-medium
                    rounded-lg
                    transition-all
                    duration-200
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                    }
                  `}
                >
                  <div className={`
                    mr-3
                    transition-colors
                    ${isActive ? 'text-white' : 'text-[var(--text-secondary)]'}
                  `}>
                    <item.icon active={isActive} />
                  </div>
                  {item.name}
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Additional Admin Links */}
          <div className="pt-4 border-t border-[var(--border-color)] space-y-1">
            <p className="px-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
              Management
            </p>
            {additionalMenuLinks.map((item, index) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`
                    flex
                    items-center
                    px-3
                    py-2.5
                    text-sm
                    font-medium
                    rounded-lg
                    transition-all
                    duration-200
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                    }
                  `}
                >
                  <div className={`
                    mr-3
                    transition-colors
                    ${isActive ? 'text-white' : 'text-[var(--text-secondary)]'}
                  `}>
                    <item.icon active={isActive} />
                  </div>
                  {item.name}
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-[var(--border-color)]">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 group"
          >
            <div className="mr-3 text-red-500 group-hover:text-red-600">
              <LogoutIcon />
            </div>
            Logout
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              <ExternalLinkIcon />
            </div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Top Bar */}
        <div className="bg-[var(--bg-primary)] border-b border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors mr-4"
              >
                <MenuIcon />
              </button>

              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                  {adminMenuLinks.concat(additionalMenuLinks).find(item => item.path === location.pathname)?.name || 'Dashboard'}
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
               <div className="hidden md:block text-sm text-[var(--text-secondary)]">
                  {new Date().toLocaleDateString('en-KE', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all duration-200"
                  aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                >
                  <ThemeToggleIcon isDark={isDark} />
                </button>
                <Link
                  to="/"
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>View Site</span>
                  <ExternalLinkIcon />
                </Link>
              </div>
           </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-[var(--bg-secondary)]">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default AdminLayout