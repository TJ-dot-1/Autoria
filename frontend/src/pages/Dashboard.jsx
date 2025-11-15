import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI } from '../utils/api'

const Dashboard = () => {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const dummyDashboardData = {
    recentBookings: [
      {
        _id: '1',
        car: {
          brand: 'Toyota',
          model: 'Camry',
          image: '/banner_car_image.png'
        },
        pickupDate: new Date().toISOString(),
        status: 'confirmed',
        price: 120
      },
      {
        _id: '2',
        car: {
          brand: 'Honda',
          model: 'Civic',
          image: '/banner_car_image.png'
        },
        pickupDate: new Date().toISOString(),
        status: 'pending',
        price: 100
      }
    ]
  }

  const assets = {
    dashboardIcon: '/auto.png'
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getDashboardStats()
      // Transform backend data to frontend format
      const transformedStats = [
        {
          title: 'Total Cars',
          value: response.cars || 0,
          change: '+12%',
          changeType: 'positive',
          icon: 'car',
          color: 'bg-blue-500'
        },
        {
          title: 'Total Bookings',
          value: response.bookings || 0,
          change: '+8%',
          changeType: 'positive',
          icon: 'calendar',
          color: 'bg-green-500'
        },
        {
          title: 'Pending Bookings',
          value: response.pendingBookings || 0,
          change: '-3%',
          changeType: 'negative',
          icon: 'warning',
          color: 'bg-yellow-500'
        },
        {
          title: 'Monthly Revenue',
          value: `$${response.revenue || 0}`,
          change: '+24%',
          changeType: 'positive',
          icon: 'dashboard',
          color: 'bg-purple-500'
        }
      ]
      setStats(transformedStats)
      setError(null)
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard stats')
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: 'Add New Car',
      description: 'Register a new vehicle to the fleet',
      icon: 'car',
      link: '/admin/add-car',
      color: 'bg-blue-500'
    },
    {
      title: 'Manage Bookings',
      description: 'View and manage all bookings',
      icon: 'calendar',
      link: '/admin/bookings',
      color: 'bg-green-500'
    },
    {
      title: 'User Management',
      description: 'Manage registered users',
      icon: 'users',
      link: '/admin/users',
      color: 'bg-purple-500'
    },
    {
      title: 'View Reports',
      description: 'Analytics and detailed reports',
      icon: 'dashboard',
      link: '/admin/reports',
      color: 'bg-orange-500'
    }
  ]

  const getIcon = (iconType) => {
    switch (iconType) {
      case 'car':
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16v6a2 2 0 002 2h4a2 2 0 002-2v-6M8 12l4 4 4-4M8 8l4-4 4 4" />
          </svg>
        )
      case 'calendar':
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      case 'warning':
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )
      case 'dashboard':
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        )
      case 'users':
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        )
      default:
        return (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to Autoria Dashboard</h1>
        <p className="text-blue-100">Manage your car rental business from one place</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                {getIcon(stat.icon)}
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                stat.changeType === 'positive'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {stat.change}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="flex items-center p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
              >
                <div className={`p-3 rounded-xl ${action.color} mr-4`}>
                  {getIcon(action.icon)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
            <Link 
              to="/admin/bookings" 
              className="text-primary hover:text-primary-dark font-medium text-sm transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {dummyDashboardData.recentBookings.map((booking) => (
              <div key={booking._id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                <div className="flex items-center">
                  <img 
                    src={booking.car.image} 
                    alt={booking.car.brand}
                    className="w-12 h-12 rounded-lg object-cover mr-3"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {booking.car.brand} {booking.car.model}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.pickupDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status}
                  </span>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    ${booking.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Overview</h2>
        <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <img src={assets.dashboardIcon} alt="Chart" className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-gray-600">Chart visualization would go here</p>
            <p className="text-sm text-gray-500">Showing booking trends, revenue, and growth metrics</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard