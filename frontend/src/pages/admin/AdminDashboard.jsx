import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI } from '../../utils/api'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: { total: 0, active: 0 },
    cars: { total: 0, available: 0, unavailable: 0 },
    bookings: { total: 0, active: 0, completed: 0, pending: 0 },
    revenue: { total: 0, average: 0 },
    recentBookings: []
  })
  const [performanceData, setPerformanceData] = useState({
    timeSeries: [],
    topCars: [],
    bookingStatus: { completed: 0, active: 0, pending: 0, cancelled: 0 }
  })
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')

  // SVG Icons as React components
  const CarIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  )

  const CalendarIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )

  const AlertIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  )

  const RevenueIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

  const ArrowIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )

  const RefreshIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )

  useEffect(() => {
    fetchDashboardData()
  }, [timeRange])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      console.log('Fetching dashboard data...')

      // Fetch dashboard stats and performance data in parallel
      const [dashboardResponse, performanceResponse] = await Promise.all([
        adminAPI.getDashboardStats(timeRange),
        adminAPI.getPerformanceData(timeRange)
      ])

      console.log('Dashboard response:', dashboardResponse)
      console.log('Performance response:', performanceResponse)

      if (dashboardResponse.success) {
        setStats(dashboardResponse.data || {
          users: { total: 0, active: 0 },
          cars: { total: 0, available: 0, unavailable: 0 },
          bookings: { total: 0, active: 0, completed: 0, pending: 0 },
          revenue: { total: 0, average: 0 },
          recentBookings: []
        })
      }

      if (performanceResponse.success) {
        setPerformanceData(performanceResponse.data || {
          timeSeries: [],
          topCars: [],
          bookingStatus: { completed: 0, active: 0, pending: 0, cancelled: 0 }
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const statsCards = [
    {
      title: 'Total Cars',
      value: stats.cars.total,
      subtitle: `${stats.cars.available} available, ${stats.cars.unavailable} unavailable`,
      change: '+12%',
      changeType: 'positive',
      icon: CarIcon,
      color: 'bg-blue-500',
      trend: 'up'
    },
    {
      title: 'Active Bookings',
      value: stats.bookings.active,
      subtitle: `${stats.bookings.total} total bookings`,
      change: '+8%',
      changeType: 'positive',
      icon: CalendarIcon,
      color: 'bg-green-500',
      trend: 'up'
    },
    {
      title: 'Pending Bookings',
      value: stats.bookings.pending,
      subtitle: `${stats.bookings.completed} completed`,
      change: stats.bookings.pending > 0 ? '-3%' : '0%',
      changeType: stats.bookings.pending > 0 ? 'negative' : 'neutral',
      icon: AlertIcon,
      color: 'bg-yellow-500',
      trend: stats.bookings.pending > 0 ? 'down' : 'stable'
    },
    {
      title: 'Monthly Revenue',
      value: formatCurrency(stats.revenue.total),
      subtitle: 'This month',
      change: '+24%',
      changeType: 'positive',
      icon: RevenueIcon,
      color: 'bg-purple-500',
      trend: 'up'
    }
  ]

  const quickActions = [
    {
      title: 'Add New Car',
      description: 'Register a new vehicle to the fleet',
      icon: AddIcon,
      link: '/admin/add-car',
      color: 'bg-blue-500'
    },
    {
      title: 'Manage Bookings',
      description: 'View and manage all bookings',
      icon: ListIcon,
      link: '/admin/bookings',
      color: 'bg-green-500'
    },
    {
      title: 'User Management',
      description: 'Manage registered users',
      icon: UsersIcon,
      link: '/admin/users',
      color: 'bg-purple-500'
    },
    {
      title: 'View Reports',
      description: 'Analytics and detailed reports',
      icon: ChartIcon,
      link: '/admin/reports',
      color: 'bg-orange-500'
    }
  ]

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{getGreeting()}!</h1>
              <p className="text-blue-100 text-lg mb-4">Manage your car rental business from one centralized location</p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center bg-white/20 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <span>System Online</span>
                </div>
                <div className="text-blue-200">•</div>
                <div>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <button
                onClick={fetchDashboardData}
                disabled={isLoading}
                className="bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg p-2 text-white transition-colors disabled:opacity-50"
                title="Refresh Data"
              >
                <RefreshIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-[var(--bg-primary)] rounded-2xl shadow-sm p-6 border border-[var(--border-color)] hover:border-blue-200 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color} shadow-lg text-white`}>
                <stat.icon />
              </div>
              <span className={`text-sm font-medium px-3 py-1 rounded-full transition-all duration-200 ${
                stat.changeType === 'positive'
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : stat.changeType === 'negative'
                  ? 'bg-red-100 text-red-800 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}>
                {stat.change}
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-2">{stat.value}</h3>
              <p className="text-[var(--text-primary)] text-sm font-semibold mb-1">{stat.title}</p>
              {stat.subtitle && (
                <p className="text-[var(--text-secondary)] text-xs">{stat.subtitle}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-[var(--bg-primary)] rounded-2xl shadow-sm border border-[var(--border-color)] overflow-hidden">
          <div className="p-6 border-b border-[var(--border-color)]">
            <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></div>
              Quick Actions
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 gap-3">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="flex items-center p-4 rounded-xl border border-[var(--border-color)] hover:border-primary hover:bg-primary/5 transition-all duration-200 group relative"
                >
                  <div className={`p-3 rounded-xl ${action.color} mr-4 shadow-md text-white`}>
                    <action.icon />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[var(--text-primary)] group-hover:text-primary transition-colors mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">{action.description}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1 text-primary">
                    <ArrowIcon />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-[var(--bg-primary)] rounded-2xl shadow-sm border border-[var(--border-color)] overflow-hidden">
          <div className="p-6 border-b border-[var(--border-color)]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center">
                <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-blue-500 rounded-full mr-3"></div>
                Recent Bookings
              </h2>
              <Link
                to="/admin/bookings"
                className="text-primary hover:text-primary-dark font-medium text-sm transition-colors flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowIcon />
              </Link>
            </div>
          </div>
          <div className="p-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-[var(--text-secondary)] mt-3">Loading recent bookings...</p>
              </div>
            ) : !stats.recentBookings || stats.recentBookings.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-3 opacity-50 text-[var(--text-secondary)]">
                  <CalendarIcon />
                </div>
                <p className="text-[var(--text-secondary)] font-medium">No recent bookings found</p>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Bookings will appear here when customers make requests</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentBookings.slice(0, 5).map((booking) => (
                  <div key={booking._id} className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] transition-colors duration-200">
                    <div className="flex items-center">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mr-4 shadow-sm">
                          <CarIcon />
                        </div>
                        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${
                          booking.status === 'Confirmed'
                            ? 'bg-green-400'
                            : booking.status === 'Pending'
                            ? 'bg-yellow-400'
                            : 'bg-gray-400'
                        } border-2 border-[var(--bg-primary)]`}></div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[var(--text-primary)]">
                          {booking.car?.brand || 'Unknown'} {booking.car?.model || 'Model'}
                        </h4>
                        <p className="text-sm text-[var(--text-secondary)] mb-1">
                          {new Date(booking.bookingPeriod?.startDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-[var(--border-color)] rounded-full mr-2"></div>
                          <p className="text-xs text-[var(--text-secondary)]">
                            {booking.user?.firstName} {booking.user?.lastName}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'Confirmed'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                      <p className="text-sm font-bold text-[var(--text-primary)] mt-1">
                        {formatCurrency(booking.pricing?.totalAmount || 0)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-[var(--bg-primary)] rounded-2xl shadow-sm border border-[var(--border-color)] overflow-hidden">
        <div className="p-6 border-b border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3"></div>
              Performance Overview
            </h2>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-[var(--text-secondary)]">Last updated: </span>
              <span className="font-medium">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue & Bookings Trend */}
            <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Revenue & Bookings Trend</h3>
              <div className="h-64">
                {performanceData.timeSeries.length > 0 ? (
                  <Line
                    data={{
                      labels: performanceData.timeSeries.map(item =>
                        new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      ),
                      datasets: [
                        {
                          label: 'Revenue (KES)',
                          data: performanceData.timeSeries.map(item => item.revenue),
                          borderColor: 'rgb(147, 51, 234)',
                          backgroundColor: 'rgba(147, 51, 234, 0.1)',
                          yAxisID: 'y',
                          tension: 0.4,
                          fill: true
                        },
                        {
                          label: 'Bookings',
                          data: performanceData.timeSeries.map(item => item.bookings),
                          borderColor: 'rgb(34, 197, 94)',
                          backgroundColor: 'rgba(34, 197, 94, 0.1)',
                          yAxisID: 'y1',
                          tension: 0.4
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      interaction: {
                        mode: 'index',
                        intersect: false,
                      },
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              if (context.datasetIndex === 0) {
                                return `Revenue: ${formatCurrency(context.parsed.y)}`;
                              }
                              return `Bookings: ${context.parsed.y}`;
                            }
                          }
                        }
                      },
                      scales: {
                        x: {
                          display: true,
                          title: {
                            display: true,
                            text: 'Date'
                          }
                        },
                        y: {
                          type: 'linear',
                          display: true,
                          position: 'left',
                          title: {
                            display: true,
                            text: 'Revenue (KES)'
                          },
                          ticks: {
                            callback: function(value) {
                              return formatCurrency(value);
                            }
                          }
                        },
                        y1: {
                          type: 'linear',
                          display: true,
                          position: 'right',
                          title: {
                            display: true,
                            text: 'Bookings'
                          },
                          grid: {
                            drawOnChartArea: false,
                          },
                        }
                      }
                    }}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-[var(--text-secondary)]">
                    <div className="text-center">
                      <ChartIcon />
                      <p className="mt-2">No data available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Status Distribution */}
            <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Booking Status Distribution</h3>
              <div className="h-64 flex items-center justify-center">
                <Doughnut
                  data={{
                    labels: ['Completed', 'Active', 'Pending', 'Cancelled'],
                    datasets: [{
                      data: [
                        performanceData.bookingStatus.completed,
                        performanceData.bookingStatus.active,
                        performanceData.bookingStatus.pending,
                        performanceData.bookingStatus.cancelled
                      ],
                      backgroundColor: [
                        'rgba(34, 197, 94, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)'
                      ],
                      borderColor: [
                        'rgb(34, 197, 94)',
                        'rgb(59, 130, 246)',
                        'rgb(245, 158, 11)',
                        'rgb(239, 68, 68)'
                      ],
                      borderWidth: 2
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          padding: 20,
                          usePointStyle: true
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Top Performing Cars */}
          <div className="mt-6 bg-[var(--bg-secondary)] rounded-xl p-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Top Performing Cars</h3>
            <div className="h-64">
              {performanceData.topCars.length > 0 ? (
                <Bar
                  data={{
                    labels: performanceData.topCars.map(car => car.car),
                    datasets: [{
                      label: 'Revenue (KES)',
                      data: performanceData.topCars.map(car => car.revenue),
                      backgroundColor: 'rgba(147, 51, 234, 0.8)',
                      borderColor: 'rgb(147, 51, 234)',
                      borderWidth: 1,
                      borderRadius: 4,
                      borderSkipped: false
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `Revenue: ${formatCurrency(context.parsed.y)}`;
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            return formatCurrency(value);
                          }
                        }
                      },
                      x: {
                        ticks: {
                          maxRotation: 45,
                          minRotation: 45
                        }
                      }
                    }
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-[var(--text-secondary)]">
                  <div className="text-center">
                    <CarIcon />
                    <p className="mt-2">No car performance data available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard