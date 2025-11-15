import React, { useState, useEffect } from 'react'
import { adminAPI, bookingsAPI, carsAPI } from '../../utils/api'

const ReportsAnalytics = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState('30d')
  const [activeTab, setActiveTab] = useState('overview')
  const [dashboardStats, setDashboardStats] = useState({
    users: { total: 0, active: 0 },
    cars: { total: 0, available: 0, unavailable: 0 },
    bookings: { total: 0, active: 0, completed: 0, pending: 0 },
    revenue: { total: 0, average: 0 }
  })
  const [bookingTrends, setBookingTrends] = useState([])
  const [revenueData, setRevenueData] = useState([])
  const [userGrowthData, setUserGrowthData] = useState([])
  const [carUtilizationData, setCarUtilizationData] = useState([])
  const [topPerformingCars, setTopPerformingCars] = useState([])
  const [recentBookings, setRecentBookings] = useState([])

  // SVG Icons as React components
  const RevenueIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )

  const BookingsIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )

  const CarIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )

  const UsersIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  )

  const DownloadIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )

  const FilterIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  )

  const RefreshIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeFilter])

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch dashboard stats
      const dashboardResponse = await adminAPI.getDashboardStats(timeFilter)
      if (dashboardResponse.success) {
        setDashboardStats(dashboardResponse.data)
      }

      // Fetch booking trends
      const bookingsResponse = await bookingsAPI.getAll({
        limit: 1000,
        sort: 'createdAt',
        order: 'desc'
      })
      
      if (bookingsResponse.success) {
        const bookings = bookingsResponse.data || []
        setRecentBookings(bookings.slice(0, 10))
        
        // Process booking trends
        const trends = processBookingTrends(bookings, timeFilter)
        setBookingTrends(trends)
        
        // Process revenue data
        const revenue = processRevenueData(bookings)
        setRevenueData(revenue)
      }

      // Fetch user data for growth analysis
      const usersResponse = await adminAPI.getUserStats(timeFilter)
      if (usersResponse.success) {
        const userGrowth = processUserGrowthData(usersResponse.data, timeFilter)
        setUserGrowthData(userGrowth)
      }

      // Fetch car data for utilization analysis
      const carsResponse = await carsAPI.getAll({ limit: 1000 })
      if (carsResponse.success) {
        const cars = carsResponse.data || []
        const utilization = processCarUtilizationData(cars, bookingsResponse.data || [])
        setCarUtilizationData(utilization)
        
        // Get top performing cars
        const topCars = processTopPerformingCars(cars, bookingsResponse.data || [])
        setTopPerformingCars(topCars)
      }
      
    } catch (error) {
      console.error('Error fetching analytics data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const processBookingTrends = (bookings, timeFilter) => {
    const days = timeFilter === '7d' ? 7 : timeFilter === '30d' ? 30 : 90
    const trends = []
    const now = new Date()

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.createdAt).toISOString().split('T')[0]
        return bookingDate === dateStr
      })

      trends.push({
        date: dateStr,
        bookings: dayBookings.length,
        revenue: dayBookings.reduce((sum, booking) => sum + (booking.pricing?.totalAmount || 0), 0)
      })
    }
    
    return trends
  }

  const processRevenueData = (bookings) => {
    const completedBookings = bookings.filter(booking => booking.status === 'Completed')
    return completedBookings.map(booking => ({
      date: new Date(booking.createdAt).toLocaleDateString(),
      amount: booking.pricing?.totalAmount || 0,
      status: booking.status
    }))
  }

  const processUserGrowthData = (userStats, timeFilter) => {
    // Mock data for demonstration - in real implementation, this would come from backend
    const days = timeFilter === '7d' ? 7 : timeFilter === '30d' ? 30 : 90
    const growthData = []
    const now = new Date()

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      
      growthData.push({
        date: date.toISOString().split('T')[0],
        newUsers: Math.floor(Math.random() * 10) + 1,
        totalUsers: userStats.total - (days - i - 1) * 2
      })
    }
    
    return growthData
  }

  const processCarUtilizationData = (cars, bookings) => {
    const utilization = cars.map(car => {
      const carBookings = bookings.filter(booking =>
        booking.car?._id === car._id && booking.status !== 'Cancelled'
      )
      
      const totalBookings = carBookings.length
      const completedBookings = carBookings.filter(b => b.status === 'Completed').length
      const utilizationRate = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0
      
      return {
        car: `${car.brand} ${car.model}`,
        totalBookings,
        completedBookings,
        utilizationRate: Math.round(utilizationRate),
        revenue: carBookings.reduce((sum, booking) => sum + (booking.pricing?.totalAmount || 0), 0)
      }
    })
    
    return utilization.sort((a, b) => b.revenue - a.revenue)
  }

  const processTopPerformingCars = (cars, bookings) => {
    const carPerformance = cars.map(car => {
      const carBookings = bookings.filter(booking => booking.car?._id === car._id)
      const totalRevenue = carBookings.reduce((sum, booking) => sum + (booking.pricing?.totalAmount || 0), 0)
      
      return {
        car: `${car.brand} ${car.model}`,
        bookings: carBookings.length,
        revenue: totalRevenue,
        image: car.primaryImage
      }
    })
    
    return carPerformance
      .filter(car => car.bookings > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value) => {
    return `${Math.round(value)}%`
  }

  const statsCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(dashboardStats.revenue.total),
      change: '+24%',
      changeType: 'positive',
      icon: RevenueIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Total Bookings',
      value: dashboardStats.bookings.total.toLocaleString(),
      change: '+12%',
      changeType: 'positive',
      icon: BookingsIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Car Utilization',
      value: `${Math.round((dashboardStats.bookings.completed / Math.max(dashboardStats.cars.total, 1)) * 100)}%`,
      change: '+8%',
      changeType: 'positive',
      icon: CarIcon,
      color: 'bg-purple-500'
    },
    {
      title: 'Active Users',
      value: dashboardStats.users.active.toLocaleString(),
      change: '+15%',
      changeType: 'positive',
      icon: UsersIcon,
      color: 'bg-orange-500'
    }
  ]

  const TabButton = ({ id, label, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
        isActive
          ? 'bg-primary text-white'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  )

  const handleExportData = () => {
    // Implement export functionality
    console.log('Exporting data...')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into your business performance</p>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleExportData}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <DownloadIcon />
            <span className="ml-2">Export</span>
          </button>
          
          <button
            onClick={fetchAnalyticsData}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshIcon />
            <span className="ml-2">Refresh</span>
          </button>
          
          {/* Time Filter */}
          <div className="flex items-center space-x-2">
            <FilterIcon />
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color} text-white`}>
                <stat.icon />
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
              <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex space-x-1">
            <TabButton id="overview" label="Overview" isActive={activeTab === 'overview'} onClick={setActiveTab} />
            <TabButton id="revenue" label="Revenue Analytics" isActive={activeTab === 'revenue'} onClick={setActiveTab} />
            <TabButton id="bookings" label="Booking Trends" isActive={activeTab === 'bookings'} onClick={setActiveTab} />
            <TabButton id="cars" label="Car Performance" isActive={activeTab === 'cars'} onClick={setActiveTab} />
            <TabButton id="users" label="User Analytics" isActive={activeTab === 'users'} onClick={setActiveTab} />
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
                <div className="space-y-3">
                  {recentBookings.map((booking) => (
                    <div key={booking._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <img 
                          src={booking.car?.primaryImage || '/placeholder-car.jpg'} 
                          alt={booking.car?.brand || 'Car'}
                          className="w-10 h-10 rounded-lg object-cover mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {booking.car?.brand} {booking.car?.model}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.driver?.firstName} {booking.driver?.lastName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatCurrency(booking.pricing?.totalAmount || 0)}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          booking.status === 'Completed' 
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'Active'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Metrics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Indicators</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-800 font-medium">Average Booking Value</span>
                      <span className="text-2xl font-bold text-blue-900">
                        {formatCurrency(dashboardStats.revenue.average)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-green-800 font-medium">Completion Rate</span>
                      <span className="text-2xl font-bold text-green-900">
                        {formatPercentage((dashboardStats.bookings.completed / Math.max(dashboardStats.bookings.total, 1)) * 100)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-purple-800 font-medium">Car Availability</span>
                      <span className="text-2xl font-bold text-purple-900">
                        {formatPercentage((dashboardStats.cars.available / Math.max(dashboardStats.cars.total, 1)) * 100)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'revenue' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Analytics</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-4">Revenue Breakdown</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Revenue</span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(dashboardStats.revenue.total)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average per Booking</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(dashboardStats.revenue.average)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Completed Bookings</span>
                      <span className="font-semibold text-gray-900">
                        {dashboardStats.bookings.completed}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-4">Revenue Trend</h4>
                  <div className="space-y-2">
                    {revenueData.slice(-7).map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">{item.date}</span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Trends</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookingTrends.slice(-10).map((trend, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(trend.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {trend.bookings}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(trend.revenue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            trend.bookings > 5 
                              ? 'bg-green-100 text-green-800'
                              : trend.bookings > 2
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {trend.bookings > 5 ? 'High' : trend.bookings > 2 ? 'Medium' : 'Low'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'cars' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Car Performance</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Top Performing Cars</h4>
                  <div className="space-y-3">
                    {topPerformingCars.map((car, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <img 
                            src={car.image || '/placeholder-car.jpg'} 
                            alt={car.car}
                            className="w-12 h-12 rounded-lg object-cover mr-3"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{car.car}</p>
                            <p className="text-sm text-gray-600">{car.bookings} bookings</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">
                            {formatCurrency(car.revenue)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Car Utilization</h4>
                  <div className="space-y-3">
                    {carUtilizationData.slice(0, 5).map((car, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-900">{car.car}</span>
                          <span className="text-sm text-gray-600">{car.utilizationRate}% utilized</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${car.utilizationRate}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mt-1">
                          <span>{car.completedBookings} completed</span>
                          <span>{formatCurrency(car.revenue)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Analytics</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-4">User Statistics</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Users</span>
                      <span className="font-bold text-gray-900">{dashboardStats.users.total}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Active Users</span>
                      <span className="font-bold text-green-600">{dashboardStats.users.active}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Growth Rate</span>
                      <span className="font-bold text-blue-600">+15%</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-4">User Growth Trends</h4>
                  <div className="space-y-2">
                    {userGrowthData.slice(-7).map((data, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">{new Date(data.date).toLocaleDateString()}</span>
                        <div className="text-right">
                          <span className="font-semibold text-gray-900 block">
                            {data.newUsers} new users
                          </span>
                          <span className="text-sm text-gray-600">
                            Total: {data.totalUsers}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReportsAnalytics