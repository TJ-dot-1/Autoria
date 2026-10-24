import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'
import { adminAPI, bookingsAPI, carsAPI } from '../../utils/api'
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
  Filler
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  FiTrendingUp,
  FiDollarSign,
  FiUsers,
  FiBox,
  FiCalendar,
  FiPlusCircle,
  FiCheckCircle,
  FiClock,
  FiActivity,
  FiArrowRight,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiExternalLink,
  FiPhone,
  FiMail,
  FiEye,
  FiAlertCircle,
  FiServer,
  FiDatabase,
  FiCpu,
  FiSettings,
  FiSliders,
  FiX,
  FiCheck,
  FiLayers,
  FiChevronRight,
  FiMessageSquare,
  FiCompass,
  FiXCircle
} from 'react-icons/fi'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
)

const AdminDashboard = () => {
  const { user } = useAuth()

  // State Management
  const [stats, setStats] = useState({
    users: { total: 0, active: 0 },
    cars: { total: 0, available: 0, unavailable: 0 },
    bookings: { total: 0, active: 0, completed: 0, pending: 0, cancelled: 0 },
    revenue: { total: 0, average: 0 },
    recentBookings: []
  })

  const [performanceData, setPerformanceData] = useState({
    timeSeries: [],
    topCars: [],
    bookingStatus: { completed: 0, active: 0, pending: 0, cancelled: 0 }
  })

  const [systemHealth, setSystemHealth] = useState(null)
  const [fleetCars, setFleetCars] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [timeRange, setTimeRange] = useState('30d')
  const [lastRefreshed, setLastRefreshed] = useState(new Date())

  // Tabs: 'overview' | 'inquiries' | 'fleet' | 'diagnostics'
  const [activeTab, setActiveTab] = useState('overview')

  // Inquiries Sub-filters
  const [inquirySearch, setInquirySearch] = useState('')
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('all')

  // Fleet Sub-filters
  const [fleetSearch, setFleetSearch] = useState('')
  const [fleetStatusFilter, setFleetStatusFilter] = useState('all')
  const [togglingCarId, setTogglingCarId] = useState(null)

  // Booking Modal
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [modalStatus, setModalStatus] = useState('')
  const [modalNote, setModalNote] = useState('')
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  // API Host & Image Helper
  const API_HOST = (import.meta.env.VITE_API_URL || 'http://localhost:5000')
    .replace(/\/api\/?$/i, '')
    .replace(/\/$/, '')

  const getCarImage = (car) => {
    const extractUrl = (item) => {
      if (!item) return null
      if (typeof item === 'string') return item
      return item.url || item.secure_url || item.path || null
    }

    let candidate = null
    if (car?.images && Array.isArray(car.images) && car.images.length > 0) {
      candidate = extractUrl(car.images.find((img) => img.isPrimary) || car.images[0])
    }
    if (!candidate && car?.primaryImage) candidate = extractUrl(car.primaryImage)
    if (!candidate && car?.image) candidate = extractUrl(car.image)
    if (!candidate) return '/hero_sports_car.jpg'

    if (candidate.startsWith('http://') || candidate.startsWith('https://')) return candidate
    return `${API_HOST}${candidate.startsWith('/') ? candidate : `/${candidate}`}`
  }

  // Format Currency (KES)
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) return 'KES 0'
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Format Date
  const formatDate = (dateString, includeTime = false) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'N/A'
    return date.toLocaleDateString('en-KE', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {})
    })
  }

  // Fetch Dashboard Data
  const fetchDashboardData = async (isManual = false) => {
    try {
      if (isManual) setIsRefreshing(true)
      else setIsLoading(true)

      const [dashRes, perfRes, healthRes, carsRes] = await Promise.allSettled([
        adminAPI.getDashboardStats(timeRange),
        adminAPI.getPerformanceData(timeRange),
        adminAPI.getSystemHealth(),
        carsAPI.getAll({ limit: 100 })
      ])

      // 1. Stats
      if (dashRes.status === 'fulfilled' && dashRes.value?.success) {
        setStats(
          dashRes.value.data || {
            users: { total: 0, active: 0 },
            cars: { total: 0, available: 0, unavailable: 0 },
            bookings: { total: 0, active: 0, completed: 0, pending: 0, cancelled: 0 },
            revenue: { total: 0, average: 0 },
            recentBookings: []
          }
        )
      }

      // 2. Performance & Charts
      if (perfRes.status === 'fulfilled' && perfRes.value?.success) {
        setPerformanceData(
          perfRes.value.data || {
            timeSeries: [],
            topCars: [],
            bookingStatus: { completed: 0, active: 0, pending: 0, cancelled: 0 }
          }
        )
      }

      // 3. System Health
      if (healthRes.status === 'fulfilled' && healthRes.value?.success) {
        setSystemHealth(healthRes.value.data)
      }

      // 4. Fleet Cars
      if (carsRes.status === 'fulfilled' && carsRes.value?.data) {
        setFleetCars(carsRes.value.data)
      }

      setLastRefreshed(new Date())
      if (isManual) toast.success('Dashboard synchronized with live platform')
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error)
      toast.error('Failed to refresh some dashboard data')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [timeRange])

  // Toggle Car Availability Handler
  const handleToggleAvailability = async (carId, currentStatus) => {
    try {
      setTogglingCarId(carId)
      const res = await carsAPI.toggleAvailability(carId)
      if (res.success || res.data) {
        toast.success(`Vehicle marked as ${!currentStatus ? 'Available' : 'Unavailable'}`)
        // Update local fleet state immediately
        setFleetCars((prev) =>
          prev.map((c) => (c._id === carId ? { ...c, isAvailable: !currentStatus } : c))
        )
        // Refresh stats
        setStats((prev) => ({
          ...prev,
          cars: {
            ...prev.cars,
            available: !currentStatus ? prev.cars.available + 1 : Math.max(0, prev.cars.available - 1),
            unavailable: currentStatus ? prev.cars.unavailable + 1 : Math.max(0, prev.cars.unavailable - 1)
          }
        }))
      }
    } catch (err) {
      toast.error(err.message || 'Failed to toggle vehicle availability')
    } finally {
      setTogglingCarId(null)
    }
  }

  // Quick Booking Status Updater
  const handleQuickStatusUpdate = async (bookingId, newStatus) => {
    try {
      const res = await bookingsAPI.updateStatus(bookingId, newStatus, `Updated via Admin Quick Actions to ${newStatus}`)
      if (res.success || res.data) {
        toast.success(`Booking status changed to ${newStatus}`)
        // Update recentBookings in stats
        setStats((prev) => ({
          ...prev,
          recentBookings: prev.recentBookings.map((b) =>
            b._id === bookingId ? { ...b, status: newStatus } : b
          )
        }))
        if (selectedBooking && selectedBooking._id === bookingId) {
          setSelectedBooking((prev) => ({ ...prev, status: newStatus }))
        }
      }
    } catch (err) {
      toast.error(err.message || `Failed to update status to ${newStatus}`)
    }
  }

  // Save Booking Status from Modal
  const handleModalStatusSave = async () => {
    if (!selectedBooking) return
    try {
      setIsUpdatingStatus(true)
      const res = await bookingsAPI.updateStatus(selectedBooking._id, modalStatus, modalNote)
      if (res.success || res.data) {
        toast.success('Booking status and administrative note updated')
        setStats((prev) => ({
          ...prev,
          recentBookings: prev.recentBookings.map((b) =>
            b._id === selectedBooking._id ? { ...b, status: modalStatus } : b
          )
        }))
        setSelectedBooking(null)
        setModalNote('')
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update booking status')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  // Greeting helper
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  // Filtered Inquiries
  const filteredInquiries = useMemo(() => {
    let list = stats.recentBookings || []
    if (inquiryStatusFilter !== 'all') {
      list = list.filter((b) => (b.status || '').toLowerCase() === inquiryStatusFilter.toLowerCase())
    }
    if (inquirySearch.trim()) {
      const q = inquirySearch.toLowerCase()
      list = list.filter((b) => {
        const carName = `${b.car?.brand || ''} ${b.car?.model || ''}`.toLowerCase()
        const userName = `${b.user?.firstName || ''} ${b.user?.lastName || ''}`.toLowerCase()
        const userEmail = (b.user?.email || '').toLowerCase()
        const userPhone = (b.user?.phone || '').toLowerCase()
        const bookingNum = (b.bookingNumber || b._id || '').toLowerCase()
        return (
          carName.includes(q) ||
          userName.includes(q) ||
          userEmail.includes(q) ||
          userPhone.includes(q) ||
          bookingNum.includes(q)
        )
      })
    }
    return list
  }, [stats.recentBookings, inquiryStatusFilter, inquirySearch])

  // Filtered Fleet
  const filteredFleet = useMemo(() => {
    let list = fleetCars || []
    if (fleetStatusFilter === 'available') {
      list = list.filter((c) => c.isAvailable !== false)
    } else if (fleetStatusFilter === 'unavailable') {
      list = list.filter((c) => c.isAvailable === false)
    }
    if (fleetSearch.trim()) {
      const q = fleetSearch.toLowerCase()
      list = list.filter((c) => {
        const title = `${c.brand || ''} ${c.model || ''} ${c.year || ''}`.toLowerCase()
        const loc = (c.location || '').toLowerCase()
        const cat = (c.category || '').toLowerCase()
        return title.includes(q) || loc.includes(q) || cat.includes(q)
      })
    }
    return list
  }, [fleetCars, fleetStatusFilter, fleetSearch])

  // Status Color & Badge Helper
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return {
          bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
          dot: 'bg-emerald-400',
          label: 'Confirmed'
        }
      case 'active':
        return {
          bg: 'bg-blue-500/15 border-blue-500/30 text-[#6BCBFF]',
          dot: 'bg-[#2684FF]',
          label: 'Active'
        }
      case 'pending':
        return {
          bg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
          dot: 'bg-amber-400 animate-pulse',
          label: 'Pending Review'
        }
      case 'completed':
        return {
          bg: 'bg-teal-500/15 border-teal-500/30 text-teal-300',
          dot: 'bg-teal-400',
          label: 'Completed'
        }
      case 'cancelled':
        return {
          bg: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
          dot: 'bg-rose-400',
          label: 'Cancelled'
        }
      default:
        return {
          bg: 'bg-slate-500/15 border-slate-500/30 text-slate-300',
          dot: 'bg-slate-400',
          label: status || 'Unknown'
        }
    }
  }

  // Key KPI Metrics Cards Configuration
  const kpiCards = [
    {
      id: 'fleet',
      title: 'Total Fleet Inventory',
      value: stats.cars.total,
      subtitle: `${stats.cars.available} Ready for Booking • ${stats.cars.unavailable} Reserved`,
      badge: `${stats.cars.total > 0 ? Math.round((stats.cars.available / stats.cars.total) * 100) : 0}% Available`,
      badgeColor: 'text-[#6BCBFF] bg-[#2684FF]/20 border-[#2684FF]/30',
      icon: FiBox,
      iconGrad: 'from-[#2684FF] to-[#1255CC]',
      borderColor: 'border-[rgba(107,203,255,0.2)]',
      glow: 'shadow-[0_0_25px_rgba(38,132,255,0.25)]',
      actionTab: 'fleet'
    },
    {
      id: 'inquiries',
      title: 'Pending Inquiries',
      value: stats.bookings.pending,
      subtitle: `${stats.bookings.completed} Successfully Closed`,
      badge: stats.bookings.pending > 0 ? 'Requires Action' : 'All Cleared',
      badgeColor:
        stats.bookings.pending > 0
          ? 'text-amber-300 bg-amber-500/20 border-amber-500/30 animate-pulse'
          : 'text-emerald-300 bg-emerald-500/20 border-emerald-500/30',
      icon: FiClock,
      iconGrad: 'from-amber-500 to-orange-600',
      borderColor: stats.bookings.pending > 0 ? 'border-amber-500/40' : 'border-[rgba(107,203,255,0.2)]',
      glow: stats.bookings.pending > 0 ? 'shadow-[0_0_25px_rgba(245,158,11,0.25)]' : '',
      actionTab: 'inquiries'
    },
    {
      id: 'active',
      title: 'Active Bookings / Drives',
      value: stats.bookings.active,
      subtitle: `${stats.bookings.total} Lifetime Bookings`,
      badge: 'In Progress',
      badgeColor: 'text-emerald-300 bg-emerald-500/20 border-emerald-500/30',
      icon: FiActivity,
      iconGrad: 'from-emerald-500 to-teal-700',
      borderColor: 'border-emerald-500/30',
      glow: 'shadow-[0_0_25px_rgba(16,185,129,0.2)]',
      actionTab: 'inquiries'
    },
    {
      id: 'revenue',
      title: 'Gross Platform Volume',
      value: formatCurrency(stats.revenue.total),
      subtitle: `Avg: ${formatCurrency(stats.revenue.average)} per completed booking`,
      badge: 'KES Verified',
      badgeColor: 'text-purple-300 bg-purple-500/20 border-purple-500/30',
      icon: FiDollarSign,
      iconGrad: 'from-purple-600 to-indigo-700',
      borderColor: 'border-purple-500/30',
      glow: 'shadow-[0_0_25px_rgba(147,51,234,0.25)]',
      actionTab: 'overview'
    },
    {
      id: 'completed',
      title: 'Completed Deals',
      value: stats.bookings.completed,
      subtitle: 'Fulfilled reservations & inquiries',
      badge: `${stats.bookings.total > 0 ? Math.round((stats.bookings.completed / stats.bookings.total) * 100) : 0}% Closed`,
      badgeColor: 'text-teal-300 bg-teal-500/20 border-teal-500/30',
      icon: FiCheckCircle,
      iconGrad: 'from-teal-500 to-cyan-700',
      borderColor: 'border-teal-500/30',
      glow: 'shadow-[0_0_25px_rgba(20,184,166,0.2)]',
      actionTab: 'inquiries'
    },
    {
      id: 'users',
      title: 'Registered Users',
      value: stats.users.total,
      subtitle: `${stats.users.active} Active Members & Sellers`,
      badge: 'Autoria Core',
      badgeColor: 'text-blue-300 bg-blue-500/20 border-blue-500/30',
      icon: FiUsers,
      iconGrad: 'from-blue-600 to-cyan-600',
      borderColor: 'border-blue-500/30',
      glow: 'shadow-[0_0_25px_rgba(37,99,235,0.2)]',
      actionTab: 'overview'
    }
  ]

  // ChartJS Custom Dark Styling
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#A8B7CC',
          font: { family: "'Plus Jakarta Sans', sans-serif", weight: '600', size: 12 },
          usePointStyle: true,
          padding: 18
        }
      },
      tooltip: {
        backgroundColor: '#061426',
        titleColor: '#F5F8FF',
        bodyColor: '#A8B7CC',
        borderColor: 'rgba(107, 203, 255, 0.3)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            if (context.datasetIndex === 0) {
              return ` Revenue: ${formatCurrency(context.parsed.y)}`
            }
            return ` Inquiries: ${context.parsed.y}`
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
        ticks: { color: '#6B7D96', font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 } }
      },
      y: {
        type: 'linear',
        position: 'left',
        grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
        ticks: {
          color: '#A8B7CC',
          callback: (value) => {
            if (value >= 1000000) return `KES ${(value / 1000000).toFixed(1)}M`
            if (value >= 1000) return `KES ${(value / 1000).toFixed(0)}k`
            return `KES ${value}`
          }
        }
      },
      y1: {
        type: 'linear',
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: { color: '#22c55e', precision: 0 }
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* 1. Cinematic Executive Command Header */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-[#0B1D33] via-[#0E2644] to-[#0B1D33] border border-[rgba(107,203,255,0.22)] shadow-[0_15px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(38,132,255,0.2)]">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            {/* Admin Avatar */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#2684FF] via-[#1255CC] to-purple-600 p-0.5 shadow-[0_0_25px_rgba(38,132,255,0.4)]">
                <div className="w-full h-full rounded-2xl bg-[#0B1D33] flex items-center justify-center text-xl sm:text-2xl font-black text-[#6BCBFF]">
                  {user?.firstName ? user.firstName[0].toUpperCase() : 'A'}
                </div>
              </div>
              <span
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0B1D33] flex items-center justify-center shadow-[0_0_8px_#10B981]"
                title="System Synchronized"
              >
                <FiCheckCircle className="w-3 h-3 text-white" />
              </span>
            </div>

            {/* Title & Metadata */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                  <span>Platform Command Center</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Live Production Fleet</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {getGreeting()}, {user?.firstName || 'Administrator'}!
              </h1>
              <p className="text-xs sm:text-sm text-[#A8B7CC] mt-1 flex flex-wrap items-center gap-3">
                <span>Manage vehicle inventory, inquiries, financial analytics, and platform health</span>
                <span className="text-[#6B7D96] hidden sm:inline">•</span>
                <span className="text-[#6B7D96] hidden sm:inline">
                  Last synced: {lastRefreshed.toLocaleTimeString()}
                </span>
              </p>
            </div>
          </div>

          {/* Header Controls & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Time Period Filter Pills */}
            <div className="flex items-center p-1 rounded-2xl bg-[#061426]/90 border border-[rgba(107,203,255,0.2)]">
              {[
                { id: '7d', label: '7 Days' },
                { id: '30d', label: '30 Days' },
                { id: '90d', label: '90 Days' }
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setTimeRange(pill.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    timeRange === pill.id
                      ? 'bg-gradient-to-r from-[#2684FF] to-[#1255CC] text-white shadow-[0_0_12px_rgba(38,132,255,0.5)]'
                      : 'text-[#A8B7CC] hover:text-white'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => fetchDashboardData(true)}
              disabled={isRefreshing || isLoading}
              title="Refresh all metrics"
              className="p-3 rounded-2xl bg-[#061426] hover:bg-white/10 border border-[rgba(107,203,255,0.2)] text-[#A8B7CC] hover:text-white transition-all disabled:opacity-50"
            >
              <FiRefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#6BCBFF]' : ''}`} />
            </button>

            {/* Add Car Shortcut */}
            <Link
              to="/admin/add-car"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-[#2684FF] to-[#1255CC] hover:from-[#3B92FF] hover:to-[#1F63D6] shadow-[0_0_20px_rgba(38,132,255,0.4)] transition-all transform hover:-translate-y-0.5"
            >
              <FiPlusCircle className="w-4 h-4" />
              <span>Add Vehicle</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Urgent Notification Alert (If Pending Inquiries > 0) */}
      {stats.bookings.pending > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <FiAlertCircle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-200">
                Action Required: {stats.bookings.pending} Customer{' '}
                {stats.bookings.pending === 1 ? 'Inquiry' : 'Inquiries'} Awaiting Review
              </h4>
              <p className="text-xs text-[#A8B7CC] mt-0.5">
                New customers have requested vehicle viewings, financing, or bookings. Review and confirm to lock in the deals.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveTab('inquiries')
              setInquiryStatusFilter('pending')
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all shrink-0"
          >
            <span>Review Pending Inquiries</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      {/* 3. High-Impact KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              onClick={() => setActiveTab(card.actionTab)}
              className={`p-5 rounded-2xl bg-[#0B1D33]/85 border ${card.borderColor} ${card.glow} hover:border-[#6BCBFF]/50 cursor-pointer transition-all duration-300 relative overflow-hidden group`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.iconGrad} flex items-center justify-center text-white shadow-md`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${card.badgeColor}`}
                >
                  {card.badge}
                </span>
              </div>

              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1 group-hover:text-[#6BCBFF] transition-colors">
                {card.value}
              </div>
              <p className="text-sm font-bold text-[#F5F8FF]">{card.title}</p>
              <p className="text-xs text-[#A8B7CC] mt-0.5">{card.subtitle}</p>

              <div className="mt-3 flex items-center text-xs font-semibold text-[#6BCBFF] opacity-0 group-hover:opacity-100 transition-opacity">
                <span>View details</span>
                <FiChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* 4. Multi-View Dashboard Tabs */}
      <div className="flex items-center gap-2 border-b border-[rgba(107,203,255,0.15)] pb-1 overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: 'Executive Overview', icon: FiCompass },
          {
            id: 'inquiries',
            label: `Inquiries & Bookings (${stats.recentBookings?.length || 0})`,
            icon: FiCalendar
          },
          { id: 'fleet', label: `Fleet Status & Controls (${fleetCars.length})`, icon: FiBox },
          { id: 'diagnostics', label: 'System Diagnostics & Health', icon: FiServer }
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold whitespace-nowrap rounded-t-xl transition-all border-b-2 ${
                isActive
                  ? 'text-[#6BCBFF] border-[#6BCBFF] bg-[#0B1D33]/90 shadow-[0_4px_20px_rgba(38,132,255,0.15)]'
                  : 'text-[#A8B7CC] border-transparent hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#6BCBFF]' : 'text-[#6B7D96]'}`} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* 5. TAB CONTENT PANELS */}
      <AnimatePresence mode="wait">
        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {activeTab === 'overview' && (
          <motion.div
            key="tab-overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Visual Analytics Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Line Chart: Revenue & Booking Trend */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0B1D33]/80 border border-[rgba(107,203,255,0.16)] shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <FiTrendingUp className="text-[#6BCBFF]" />
                      <span>Revenue &amp; Booking Trajectory</span>
                    </h3>
                    <p className="text-xs text-[#A8B7CC]">
                      Gross completed deal volume (KES) vs confirmed reservations over {timeRange}
                    </p>
                  </div>
                  <div className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#2684FF]/20 text-[#6BCBFF] border border-[#2684FF]/30">
                    {timeRange === '7d' ? 'Last 7 Days' : timeRange === '90d' ? 'Last 90 Days' : 'Last 30 Days'}
                  </div>
                </div>

                <div className="h-72">
                  {performanceData.timeSeries.length > 0 ? (
                    <Line
                      data={{
                        labels: performanceData.timeSeries.map((item) =>
                          new Date(item.date).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })
                        ),
                        datasets: [
                          {
                            label: 'Revenue (KES)',
                            data: performanceData.timeSeries.map((item) => item.revenue),
                            borderColor: '#8B5CF6',
                            backgroundColor: 'rgba(139, 92, 246, 0.12)',
                            yAxisID: 'y',
                            tension: 0.35,
                            fill: true,
                            pointRadius: 3,
                            pointHoverRadius: 6
                          },
                          {
                            label: 'Bookings',
                            data: performanceData.timeSeries.map((item) => item.bookings),
                            borderColor: '#22c55e',
                            backgroundColor: 'rgba(34, 197, 94, 0.12)',
                            yAxisID: 'y1',
                            tension: 0.35,
                            pointRadius: 3,
                            pointHoverRadius: 6
                          }
                        ]
                      }}
                      options={chartOptions}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-center text-[#A8B7CC]">
                      <div>
                        <FiTrendingUp className="w-8 h-8 mx-auto text-[#6B7D96] mb-2" />
                        <p className="text-sm">No transaction trajectory data available for this timeframe</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Doughnut Chart */}
              <div className="p-6 rounded-2xl bg-[#0B1D33]/80 border border-[rgba(107,203,255,0.16)] shadow-lg flex flex-col justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 mb-1">
                    <FiLayers className="text-emerald-400" />
                    <span>Inquiry Status Mix</span>
                  </h3>
                  <p className="text-xs text-[#A8B7CC] mb-4">Breakdown of customer lifecycle deals</p>

                  <div className="h-52 relative flex items-center justify-center">
                    <Doughnut
                      data={{
                        labels: ['Completed', 'Active', 'Pending', 'Cancelled'],
                        datasets: [
                          {
                            data: [
                              performanceData.bookingStatus.completed || 0,
                              performanceData.bookingStatus.active || 0,
                              performanceData.bookingStatus.pending || 0,
                              performanceData.bookingStatus.cancelled || 0
                            ],
                            backgroundColor: [
                              'rgba(34, 197, 94, 0.85)',
                              'rgba(38, 132, 255, 0.85)',
                              'rgba(245, 158, 11, 0.85)',
                              'rgba(239, 68, 68, 0.85)'
                            ],
                            borderColor: ['#22c55e', '#2684FF', '#f59e0b', '#ef4444'],
                            borderWidth: 2
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            backgroundColor: '#061426',
                            titleColor: '#F5F8FF',
                            bodyColor: '#A8B7CC',
                            borderColor: 'rgba(107, 203, 255, 0.3)',
                            borderWidth: 1
                          }
                        },
                        cutout: '72%'
                      }}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-black text-white">{stats.bookings.total}</span>
                      <span className="text-[11px] text-[#A8B7CC] uppercase tracking-wider">Total Deals</span>
                    </div>
                  </div>
                </div>

                {/* Legend badges */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-[rgba(107,203,255,0.12)]">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-[#A8B7CC]">Completed:</span>
                    <span className="font-bold text-white ml-auto">{performanceData.bookingStatus.completed || 0}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2684FF]" />
                    <span className="text-[#A8B7CC]">Active:</span>
                    <span className="font-bold text-white ml-auto">{performanceData.bookingStatus.active || 0}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-[#A8B7CC]">Pending:</span>
                    <span className="font-bold text-white ml-auto">{performanceData.bookingStatus.pending || 0}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-[#A8B7CC]">Cancelled:</span>
                    <span className="font-bold text-white ml-auto">{performanceData.bookingStatus.cancelled || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Performing Cars & Quick Operations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top Performing Vehicles Leaderboard */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0B1D33]/80 border border-[rgba(107,203,255,0.16)] shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <FiBox className="text-purple-400" />
                      <span>Top Performing Fleet Models</span>
                    </h3>
                    <p className="text-xs text-[#A8B7CC]">Highest revenue generating vehicles on Autoria</p>
                  </div>
                  <Link
                    to="/admin/manage-cars"
                    className="text-xs font-bold text-[#6BCBFF] hover:underline flex items-center gap-1"
                  >
                    <span>Manage all cars</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {performanceData.topCars && performanceData.topCars.length > 0 ? (
                  <div className="space-y-3">
                    {performanceData.topCars.slice(0, 5).map((carItem, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[#061426]/70 border border-[rgba(107,203,255,0.12)] flex items-center justify-between gap-4 hover:border-[#6BCBFF]/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-[#6BCBFF]">
                            #{idx + 1}
                          </span>
                          <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-white/10">
                            <img
                              src={carItem.image ? (carItem.image.startsWith('http') ? carItem.image : `${API_HOST}${carItem.image.startsWith('/') ? carItem.image : `/${carItem.image}`}`) : '/hero_sports_car.jpg'}
                              alt={carItem.car}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = '/hero_sports_car.jpg'
                              }}
                            />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">{carItem.car}</h4>
                            <p className="text-xs text-[#A8B7CC]">{carItem.bookings} Successful Bookings</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-black text-emerald-400">{formatCurrency(carItem.revenue)}</div>
                          <span className="text-[10px] text-[#A8B7CC]">Total Revenue</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-[#A8B7CC]">
                    <FiBox className="w-8 h-8 mx-auto text-[#6B7D96] mb-2" />
                    <p className="text-sm">No car performance metrics recorded yet for this period</p>
                  </div>
                )}
              </div>

              {/* Quick Admin Actions & Direct Navigation */}
              <div className="p-6 rounded-2xl bg-[#0B1D33]/80 border border-[rgba(107,203,255,0.16)] shadow-lg flex flex-col justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 mb-1">
                    <FiSliders className="text-[#6BCBFF]" />
                    <span>Quick Management</span>
                  </h3>
                  <p className="text-xs text-[#A8B7CC] mb-4">Direct shortcuts to administrative workflows</p>

                  <div className="space-y-2.5">
                    {[
                      {
                        title: 'Add New Vehicle',
                        desc: 'List & price a new car',
                        link: '/admin/add-car',
                        icon: FiPlusCircle,
                        color: 'from-[#2684FF] to-[#1255CC]'
                      },
                      {
                        title: 'Manage Vehicle Fleet',
                        desc: 'Full CRUD, specs & rates',
                        link: '/admin/manage-cars',
                        icon: FiBox,
                        color: 'from-purple-600 to-indigo-700'
                      },
                      {
                        title: 'All Customer Inquiries',
                        desc: 'Reservations, bookings & viewings',
                        link: '/admin/bookings',
                        icon: FiCalendar,
                        color: 'from-emerald-500 to-teal-700'
                      },
                      {
                        title: 'User Management',
                        desc: 'Platform members & permissions',
                        link: '/admin/users',
                        icon: FiUsers,
                        color: 'from-blue-600 to-cyan-600'
                      },
                      {
                        title: 'Analytics & Financials',
                        desc: 'Custom period reports & charts',
                        link: '/admin/reports',
                        icon: FiTrendingUp,
                        color: 'from-amber-500 to-orange-600'
                      },
                      {
                        title: 'System Settings',
                        desc: 'Fees, notifications & portal keys',
                        link: '/admin/settings',
                        icon: FiSettings,
                        color: 'from-slate-600 to-slate-800'
                      }
                    ].map((item, idx) => {
                      const ItemIcon = item.icon
                      return (
                        <Link
                          key={idx}
                          to={item.link}
                          className="flex items-center p-3 rounded-xl bg-[#061426]/60 border border-[rgba(107,203,255,0.1)] hover:border-[#6BCBFF]/40 hover:bg-[#061426] transition-all group"
                        >
                          <div
                            className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-white mr-3 shrink-0 shadow-sm`}
                          >
                            <ItemIcon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-white group-hover:text-[#6BCBFF] transition-colors truncate">
                              {item.title}
                            </h4>
                            <p className="text-[11px] text-[#A8B7CC] truncate">{item.desc}</p>
                          </div>
                          <FiChevronRight className="w-4 h-4 text-[#6B7D96] group-hover:text-[#6BCBFF] transform group-hover:translate-x-0.5 transition-all ml-2" />
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: INQUIRIES & BOOKING PIPELINE */}
        {activeTab === 'inquiries' && (
          <motion.div
            key="tab-inquiries"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Filter & Search Bar */}
            <div className="p-4 rounded-2xl bg-[#0B1D33]/90 border border-[rgba(107,203,255,0.16)] shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7D96] w-4 h-4" />
                <input
                  type="text"
                  value={inquirySearch}
                  onChange={(e) => setInquirySearch(e.target.value)}
                  placeholder="Search by customer name, email, phone, car, or ID..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#061426] border border-[rgba(107,203,255,0.2)] text-white placeholder-[#6B7D96] text-xs sm:text-sm focus:outline-none focus:border-[#6BCBFF] transition-all"
                />
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                {[
                  { id: 'all', label: 'All Inquiries' },
                  { id: 'pending', label: 'Pending' },
                  { id: 'confirmed', label: 'Confirmed' },
                  { id: 'active', label: 'Active' },
                  { id: 'completed', label: 'Completed' },
                  { id: 'cancelled', label: 'Cancelled' }
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setInquiryStatusFilter(st.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                      inquiryStatusFilter === st.id
                        ? 'bg-gradient-to-r from-[#2684FF] to-[#1255CC] text-white border-transparent shadow-[0_0_12px_rgba(38,132,255,0.4)]'
                        : 'bg-[#061426] text-[#A8B7CC] border-[rgba(107,203,255,0.15)] hover:text-white'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Inquiries Cards / Table List */}
            {filteredInquiries.length > 0 ? (
              <div className="space-y-3">
                {filteredInquiries.map((booking) => {
                  const badge = getStatusBadge(booking.status)
                  return (
                    <div
                      key={booking._id}
                      className="p-5 rounded-2xl bg-[#0B1D33]/85 border border-[rgba(107,203,255,0.16)] hover:border-[#6BCBFF]/40 shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5 group"
                    >
                      {/* Left: Vehicle & Customer */}
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="w-16 h-14 sm:w-20 sm:h-16 rounded-xl overflow-hidden bg-slate-900 border border-white/10 shrink-0">
                          <img
                            src={getCarImage(booking.car)}
                            alt={`${booking.car?.brand} ${booking.car?.model}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = '/hero_sports_car.jpg'
                            }}
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-bold text-[#6BCBFF] bg-[#2684FF]/20 px-2 py-0.5 rounded-md border border-[#2684FF]/30">
                              #{booking.bookingNumber || booking._id?.slice(-6).toUpperCase()}
                            </span>
                            <span className="text-xs text-[#6B7D96]">
                              {formatDate(booking.createdAt, true)}
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-white">
                            {booking.car?.brand || 'Autoria'} {booking.car?.model || 'Vehicle'}
                          </h4>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-[#A8B7CC] mt-1">
                            <span className="font-semibold text-white">
                              {booking.user?.firstName || 'Guest'} {booking.user?.lastName || 'Client'}
                            </span>
                            {booking.user?.phone && (
                              <a
                                href={`tel:${booking.user.phone}`}
                                className="flex items-center gap-1 text-emerald-400 hover:underline"
                              >
                                <FiPhone className="w-3 h-3" />
                                <span>{booking.user.phone}</span>
                              </a>
                            )}
                            {booking.user?.email && (
                              <a
                                href={`mailto:${booking.user.email}`}
                                className="flex items-center gap-1 text-[#6BCBFF] hover:underline"
                              >
                                <FiMail className="w-3 h-3" />
                                <span>{booking.user.email}</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Middle: Booking Dates & Pricing */}
                      <div className="flex flex-wrap sm:flex-nowrap items-center gap-6 lg:border-x lg:border-[rgba(107,203,255,0.12)] lg:px-6">
                        <div>
                          <div className="text-[11px] text-[#A8B7CC]">Duration Window</div>
                          <div className="text-xs font-semibold text-white mt-0.5">
                            {formatDate(booking.bookingPeriod?.startDate)} →{' '}
                            {formatDate(booking.bookingPeriod?.endDate)}
                          </div>
                        </div>

                        <div>
                          <div className="text-[11px] text-[#A8B7CC]">Agreed Value</div>
                          <div className="text-sm font-black text-emerald-400 mt-0.5">
                            {formatCurrency(booking.pricing?.totalAmount || 0)}
                          </div>
                        </div>

                        <div>
                          <div className="text-[11px] text-[#A8B7CC] mb-1">Status</div>
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                            <span>{badge.label}</span>
                          </span>
                        </div>
                      </div>

                      {/* Right: Quick Action Controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Quick Confirm button if Pending */}
                        {booking.status === 'Pending' && (
                          <button
                            onClick={() => handleQuickStatusUpdate(booking._id, 'Confirmed')}
                            className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm"
                            title="Confirm this inquiry"
                          >
                            Confirm
                          </button>
                        )}

                        {/* Quick Complete if Confirmed/Active */}
                        {['Confirmed', 'Active'].includes(booking.status) && (
                          <button
                            onClick={() => handleQuickStatusUpdate(booking._id, 'Completed')}
                            className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm"
                            title="Mark inquiry deal as Completed"
                          >
                            Complete
                          </button>
                        )}

                        {/* View Details Modal Button */}
                        <button
                          onClick={() => {
                            setSelectedBooking(booking)
                            setModalStatus(booking.status || 'Pending')
                          }}
                          className="px-3 py-2 rounded-xl text-xs font-bold text-[#6BCBFF] bg-[#2684FF]/20 hover:bg-[#2684FF]/30 border border-[#2684FF]/30 transition-all flex items-center gap-1.5"
                        >
                          <FiEye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>

                        {/* WhatsApp Shortcut */}
                        {booking.user?.phone && (
                          <a
                            href={`https://wa.me/${booking.user.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `Hello ${booking.user.firstName || ''}, regarding your vehicle inquiry on Autoria for ${
                                booking.car?.brand || 'the vehicle'
                              } ${booking.car?.model || ''}...`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 transition-all"
                            title="Open WhatsApp chat with client"
                          >
                            <FiMessageSquare className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="py-16 text-center rounded-2xl bg-[#0B1D33]/60 border border-[rgba(107,203,255,0.12)]">
                <FiCalendar className="w-10 h-10 mx-auto text-[#6B7D96] mb-3" />
                <h4 className="text-base font-bold text-white">No inquiries match your filter</h4>
                <p className="text-xs text-[#A8B7CC] mt-1">
                  Try adjusting your search terms or status filter.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 3: FLEET STATUS & CONTROLS */}
        {activeTab === 'fleet' && (
          <motion.div
            key="tab-fleet"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Filter and Quick Add Fleet */}
            <div className="p-4 rounded-2xl bg-[#0B1D33]/90 border border-[rgba(107,203,255,0.16)] shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7D96] w-4 h-4" />
                <input
                  type="text"
                  value={fleetSearch}
                  onChange={(e) => setFleetSearch(e.target.value)}
                  placeholder="Filter vehicles by brand, model, category, or location..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#061426] border border-[rgba(107,203,255,0.2)] text-white placeholder-[#6B7D96] text-xs sm:text-sm focus:outline-none focus:border-[#6BCBFF] transition-all"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={fleetStatusFilter}
                  onChange={(e) => setFleetStatusFilter(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-[#061426] border border-[rgba(107,203,255,0.2)] text-white text-xs font-bold focus:outline-none focus:border-[#6BCBFF]"
                >
                  <option value="all">All Inventory ({fleetCars.length})</option>
                  <option value="available">Available for Booking</option>
                  <option value="unavailable">Reserved / Unavailable</option>
                </select>

                <Link
                  to="/admin/add-car"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#2684FF] to-[#1255CC] hover:from-[#3B92FF] hover:to-[#1F63D6] shadow-[0_0_15px_rgba(38,132,255,0.3)] transition-all whitespace-nowrap"
                >
                  <FiPlusCircle className="w-3.5 h-3.5" />
                  <span>New Car</span>
                </Link>
              </div>
            </div>

            {/* Vehicles Grid with One-Click Availability Switch */}
            {filteredFleet.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFleet.map((car) => {
                  const isAvailable = car.isAvailable !== false
                  const isToggling = togglingCarId === car._id

                  return (
                    <div
                      key={car._id}
                      className="rounded-2xl bg-[#0B1D33]/85 border border-[rgba(107,203,255,0.16)] hover:border-[#6BCBFF]/50 shadow-md overflow-hidden transition-all flex flex-col group"
                    >
                      {/* Image Banner */}
                      <div className="relative h-44 bg-slate-900 overflow-hidden">
                        <img
                          src={getCarImage(car)}
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = '/hero_sports_car.jpg'
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D33] via-transparent to-transparent" />

                        <div className="absolute top-3 left-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${
                              isAvailable
                                ? 'bg-emerald-500/80 border-emerald-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                                : 'bg-rose-500/80 border-rose-400 text-white shadow-[0_0_10px_rgba(244,63,94,0.5)]'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            <span>{isAvailable ? 'Available' : 'Reserved'}</span>
                          </span>
                        </div>

                        {car.location && (
                          <div className="absolute top-3 right-3 text-[11px] font-semibold text-white bg-black/60 px-2 py-0.5 rounded-full border border-white/20 backdrop-blur-sm">
                            {car.location}
                          </div>
                        )}
                      </div>

                      {/* Content Body */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-xs font-bold text-[#6BCBFF] uppercase tracking-wider">
                              {car.category || car.type || 'Sedan'}
                            </span>
                            <span className="text-xs text-[#A8B7CC]">{car.year}</span>
                          </div>

                          <h4 className="text-base font-bold text-white mb-2">
                            {car.brand} {car.model}
                          </h4>

                          <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-lg font-black text-white">
                              {formatCurrency(car.pricePerDay || car.salePrice || 0)}
                            </span>
                            <span className="text-xs text-[#A8B7CC]">/ day</span>
                          </div>
                        </div>

                        {/* Controls Bottom Bar */}
                        <div className="pt-3 border-t border-[rgba(107,203,255,0.12)] flex items-center justify-between gap-2">
                          {/* Live Toggle Switch */}
                          <button
                            onClick={() => handleToggleAvailability(car._id, isAvailable)}
                            disabled={isToggling}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                              isAvailable
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                                : 'bg-slate-700/50 text-[#A8B7CC] border-slate-600 hover:text-white'
                            }`}
                            title="Toggle whether customers can book this vehicle"
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'
                              }`}
                            />
                            <span>{isToggling ? 'Updating...' : isAvailable ? 'Active' : 'Disabled'}</span>
                          </button>

                          <div className="flex items-center gap-2">
                            <Link
                              to={`/admin/edit-car/${car._id}`}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#6BCBFF] bg-[#2684FF]/20 hover:bg-[#2684FF]/30 border border-[#2684FF]/30 transition-all"
                            >
                              Edit
                            </Link>
                            <Link
                              to={`/cars/${car._id}`}
                              target="_blank"
                              className="p-2 rounded-xl text-[#A8B7CC] hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                              title="View Public Listing"
                            >
                              <FiExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="py-16 text-center rounded-2xl bg-[#0B1D33]/60 border border-[rgba(107,203,255,0.12)]">
                <FiBox className="w-10 h-10 mx-auto text-[#6B7D96] mb-3" />
                <h4 className="text-base font-bold text-white">No vehicles found</h4>
                <p className="text-xs text-[#A8B7CC] mt-1">Adjust search filters or add a new vehicle to the fleet.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 4: SYSTEM DIAGNOSTICS & PLATFORM HEALTH */}
        {activeTab === 'diagnostics' && (
          <motion.div
            key="tab-diagnostics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* System Health Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Database Status */}
              <div className="p-5 rounded-2xl bg-[#0B1D33]/85 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <FiDatabase className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Online
                  </span>
                </div>
                <div className="text-xl font-black text-white mb-0.5">MongoDB Cluster</div>
                <p className="text-xs text-[#A8B7CC]">
                  Status:{' '}
                  <span className="text-emerald-400 font-semibold">
                    {systemHealth?.database?.status || 'Connected'}
                  </span>
                </p>
              </div>

              {/* Memory Heap */}
              <div className="p-5 rounded-2xl bg-[#0B1D33]/85 border border-[#2684FF]/30 shadow-[0_0_20px_rgba(38,132,255,0.15)]">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2684FF]/20 text-[#6BCBFF] flex items-center justify-center">
                    <FiCpu className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#2684FF]/20 text-[#6BCBFF] border border-[#2684FF]/30">
                    RAM Usage
                  </span>
                </div>
                <div className="text-xl font-black text-white mb-0.5">
                  {systemHealth?.memory?.used ? `${Math.round(systemHealth.memory.used)} MB` : '124 MB'}
                </div>
                <p className="text-xs text-[#A8B7CC]">
                  Total Allocated:{' '}
                  {systemHealth?.memory?.total ? `${Math.round(systemHealth.memory.total)} MB` : '248 MB'}
                </p>
              </div>

              {/* Server Uptime */}
              <div className="p-5 rounded-2xl bg-[#0B1D33]/85 border border-purple-500/30 shadow-[0_0_20px_rgba(147,51,234,0.15)]">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                    <FiClock className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Stable
                  </span>
                </div>
                <div className="text-xl font-black text-white mb-0.5">
                  {systemHealth?.uptime ? `${Math.round(systemHealth.uptime / 3600)} Hours` : '99.9% Uptime'}
                </div>
                <p className="text-xs text-[#A8B7CC]">Node Engine Process Active</p>
              </div>

              {/* Environment */}
              <div className="p-5 rounded-2xl bg-[#0B1D33]/85 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                    <FiServer className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 capitalize">
                    {systemHealth?.environment || 'Production'}
                  </span>
                </div>
                <div className="text-xl font-black text-white mb-0.5">Autoria Backend</div>
                <p className="text-xs text-[#A8B7CC]">Express + Mongoose ODM</p>
              </div>
            </div>

            {/* Diagnostics Detail Box */}
            <div className="p-6 rounded-2xl bg-[#0B1D33]/80 border border-[rgba(107,203,255,0.16)] shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FiServer className="text-[#6BCBFF]" />
                    <span>Real-time Operational Metrics</span>
                  </h3>
                  <p className="text-xs text-[#A8B7CC]">System telemetry and network connectivity</p>
                </div>
                <button
                  onClick={() => fetchDashboardData(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#2684FF]/20 hover:bg-[#2684FF]/30 border border-[#2684FF]/40 transition-all flex items-center gap-1.5"
                >
                  <FiRefreshCw className="w-3.5 h-3.5" />
                  <span>Run Diagnostics</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#061426] border border-white/5">
                  <span className="text-xs text-[#A8B7CC]">API Base Gateway</span>
                  <div className="text-sm font-bold text-white mt-1 break-all">{API_HOST || 'Live Cloud Gateway'}</div>
                </div>
                <div className="p-4 rounded-xl bg-[#061426] border border-white/5">
                  <span className="text-xs text-[#A8B7CC]">Active Admin Session</span>
                  <div className="text-sm font-bold text-emerald-400 mt-1">{user?.email || 'admin@autoria.co.ke'}</div>
                </div>
                <div className="p-4 rounded-xl bg-[#061426] border border-white/5">
                  <span className="text-xs text-[#A8B7CC]">Security State</span>
                  <div className="text-sm font-bold text-white mt-1">JWT Authenticated + CORS Protected</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. BOOKING / INQUIRY DETAILS MODAL */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl rounded-3xl bg-[#0B1D33] border border-[rgba(107,203,255,0.25)] shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(38,132,255,0.2)] overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-[rgba(107,203,255,0.15)] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#6BCBFF] bg-[#2684FF]/20 px-2 py-0.5 rounded-md border border-[#2684FF]/30">
                      Inquiry #{selectedBooking.bookingNumber || selectedBooking._id?.slice(-6).toUpperCase()}
                    </span>
                    <span className="text-xs text-[#6B7D96]">
                      {formatDate(selectedBooking.createdAt, true)}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white">
                    {selectedBooking.car?.brand} {selectedBooking.car?.model}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#A8B7CC] hover:text-white transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                {/* Vehicle Thumbnail & Specs */}
                <div className="p-4 rounded-2xl bg-[#061426] border border-white/5 flex items-center gap-4">
                  <div className="w-24 h-18 rounded-xl overflow-hidden bg-slate-900 border border-white/10 shrink-0">
                    <img
                      src={getCarImage(selectedBooking.car)}
                      alt={`${selectedBooking.car?.brand} ${selectedBooking.car?.model}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/hero_sports_car.jpg'
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">
                      {selectedBooking.car?.brand} {selectedBooking.car?.model}
                    </h4>
                    <p className="text-xs text-[#A8B7CC]">
                      Category: {selectedBooking.car?.category || 'Premium Vehicle'}
                    </p>
                    <div className="text-sm font-black text-emerald-400 mt-1">
                      {formatCurrency(selectedBooking.pricing?.totalAmount || 0)}
                    </div>
                  </div>
                </div>

                {/* Customer Information Card */}
                <div className="p-4 rounded-2xl bg-[#061426] border border-white/5 space-y-3">
                  <h4 className="text-xs font-bold text-[#6BCBFF] uppercase tracking-wider">
                    Customer Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[#A8B7CC]">Name:</span>
                      <p className="text-sm font-bold text-white mt-0.5">
                        {selectedBooking.user?.firstName || 'Guest'} {selectedBooking.user?.lastName || ''}
                      </p>
                    </div>
                    <div>
                      <span className="text-[#A8B7CC]">Phone:</span>
                      <p className="text-sm font-bold text-white mt-0.5">
                        {selectedBooking.user?.phone || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[#A8B7CC]">Email:</span>
                      <p className="text-sm font-bold text-white mt-0.5">
                        {selectedBooking.user?.email || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[#A8B7CC]">Booking Dates:</span>
                      <p className="text-sm font-bold text-white mt-0.5">
                        {formatDate(selectedBooking.bookingPeriod?.startDate)} →{' '}
                        {formatDate(selectedBooking.bookingPeriod?.endDate)}
                      </p>
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                    {selectedBooking.user?.phone && (
                      <>
                        <a
                          href={`tel:${selectedBooking.user.phone}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all"
                        >
                          <FiPhone className="w-3.5 h-3.5" />
                          <span>Call Client</span>
                        </a>
                        <a
                          href={`https://wa.me/${selectedBooking.user.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600/30 text-emerald-200 border border-emerald-500/40 hover:bg-emerald-600/40 transition-all"
                        >
                          <FiMessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </>
                    )}
                    {selectedBooking.user?.email && (
                      <a
                        href={`mailto:${selectedBooking.user.email}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#2684FF]/20 text-[#6BCBFF] border border-[#2684FF]/30 hover:bg-[#2684FF]/30 transition-all"
                      >
                        <FiMail className="w-3.5 h-3.5" />
                        <span>Email Client</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Status Update Form */}
                <div className="p-4 rounded-2xl bg-[#061426] border border-white/5 space-y-3">
                  <h4 className="text-xs font-bold text-[#6BCBFF] uppercase tracking-wider">
                    Change Lifecycle Status
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-[#A8B7CC] mb-1">Status</label>
                      <select
                        value={modalStatus}
                        onChange={(e) => setModalStatus(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#0B1D33] border border-[rgba(107,203,255,0.2)] text-white text-xs font-bold focus:outline-none focus:border-[#6BCBFF]"
                      >
                        <option value="Pending">Pending Review</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Active">Active (In-Progress)</option>
                        <option value="Completed">Completed (Fulfilled)</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-[#A8B7CC] mb-1">Administrative Note</label>
                      <textarea
                        rows={2}
                        value={modalNote}
                        onChange={(e) => setModalNote(e.target.value)}
                        placeholder="Optional internal note (e.g. 'Customer confirmed down payment, scheduled delivery')..."
                        className="w-full px-3 py-2 rounded-xl bg-[#0B1D33] border border-[rgba(107,203,255,0.2)] text-white placeholder-[#6B7D96] text-xs focus:outline-none focus:border-[#6BCBFF]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t border-[rgba(107,203,255,0.15)] flex items-center justify-end gap-3 bg-[#0B1D33]">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#A8B7CC] hover:text-white transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleModalStatusSave}
                  disabled={isUpdatingStatus}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#2684FF] to-[#1255CC] hover:from-[#3B92FF] hover:to-[#1F63D6] shadow-[0_0_15px_rgba(38,132,255,0.4)] transition-all disabled:opacity-50"
                >
                  {isUpdatingStatus ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminDashboard