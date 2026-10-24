import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiBox,
  FiDollarSign,
  FiUsers,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiPlusCircle,
  FiRefreshCw,
  FiExternalLink,
  FiServer,
  FiDatabase,
  FiCpu,
  FiActivity,
  FiSearch,
  FiFilter,
  FiChevronRight,
  FiTag,
  FiShield,
  FiSliders,
  FiCalendar,
  FiCompass,
  FiEye,
  FiX,
  FiLayers
} from 'react-icons/fi'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'
import { toast } from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'
import { adminAPI, carsAPI } from '../../utils/api'

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend,
  ArcElement,
  Filler
)

const AdminDashboard = () => {
  const { user } = useAuth()

  // State Management (Car Selling Marketplace Focus)
  const [stats, setStats] = useState({
    users: { total: 0, active: 0 },
    cars: { total: 0, available: 0, unavailable: 0 },
    sales: { totalDeals: 0, activeNegotiations: 0, inquiriesCount: 0, totalVolume: 0, averagePrice: 0 },
    revenue: { total: 0, average: 0 },
    recentActivities: []
  })

  const [performanceData, setPerformanceData] = useState({
    timeSeries: [],
    topCars: [],
    inventoryCondition: { brandNew: 0, foreignUsed: 0, used: 0 }
  })

  const [systemHealth, setSystemHealth] = useState(null)
  const [fleetCars, setFleetCars] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [timeRange, setTimeRange] = useState('30d')
  const [lastRefreshed, setLastRefreshed] = useState(new Date())

  // Tabs: 'overview' | 'activity' | 'inventory' | 'diagnostics'
  const [activeTab, setActiveTab] = useState('overview')

  // Activity Feed Sub-filters
  const [activitySearch, setActivitySearch] = useState('')
  const [activityTypeFilter, setActivityTypeFilter] = useState('all')

  // Inventory Sub-filters
  const [inventorySearch, setInventorySearch] = useState('')
  const [inventoryStatusFilter, setInventoryStatusFilter] = useState('all')
  const [togglingCarId, setTogglingCarId] = useState(null)

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
            sales: { totalDeals: 0, activeNegotiations: 0, inquiriesCount: 0, totalVolume: 0, averagePrice: 0 },
            revenue: { total: 0, average: 0 },
            recentActivities: []
          }
        )
      }

      // 2. Performance & Charts
      if (perfRes.status === 'fulfilled' && perfRes.value?.success) {
        setPerformanceData(
          perfRes.value.data || {
            timeSeries: [],
            topCars: [],
            inventoryCondition: { brandNew: 0, foreignUsed: 0, used: 0 }
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
      if (isManual) toast.success('Marketplace data synchronized')
    } catch (error) {
      console.error('Error fetching admin marketplace data:', error)
      toast.error('Failed to refresh some marketplace data')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [timeRange])

  // Toggle Car Availability (Available for sale vs Reserved/Sold)
  const handleToggleAvailability = async (carId, currentStatus) => {
    try {
      setTogglingCarId(carId)
      const res = await carsAPI.toggleAvailability(carId)
      if (res.success || res.data) {
        toast.success(`Vehicle marked as ${!currentStatus ? 'Available for Sale' : 'Reserved / Sold'}`)
        setFleetCars((prev) =>
          prev.map((c) => (c._id === carId ? { ...c, isAvailable: !currentStatus } : c))
        )
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
      toast.error(err.message || 'Failed to update vehicle status')
    } finally {
      setTogglingCarId(null)
    }
  }

  // Derive Marketplace Activities Feed (combining backend activities with showroom cars fallback)
  const displayActivities = useMemo(() => {
    if (stats.recentActivities && stats.recentActivities.length > 0) {
      return stats.recentActivities
    }
    return fleetCars.slice(0, 15).map((car) => {
      const isAvail = car.isAvailable !== false
      const price = car.salePrice || (car.pricePerDay ? car.pricePerDay * 30 : 0)
      return {
        id: `car-${car._id}`,
        type: isAvail ? 'car_listed' : 'car_sold',
        action: isAvail ? 'Vehicle Listed for Sale' : 'Vehicle Marked as Sold',
        title: `${car.year ? `${car.year} ` : ''}${car.brand} ${car.model}`,
        description: isAvail ? `Showroom stock at ${formatCurrency(price)}` : 'Closed transaction / Sold',
        time: car.createdAt || new Date().toISOString(),
        badge: car.condition || (isAvail ? 'Available' : 'Sold'),
        badgeColor: isAvail ? 'emerald' : 'blue',
        image: getCarImage(car),
        carId: car._id,
        price: price,
        seller: car.addedBy?.firstName ? `${car.addedBy.firstName} ${car.addedBy.lastName || ''}` : 'Showroom'
      }
    })
  }, [stats.recentActivities, fleetCars])

  // Filtered Activities
  const filteredActivities = useMemo(() => {
    return displayActivities.filter((act) => {
      const matchesSearch =
        !activitySearch ||
        act.title?.toLowerCase().includes(activitySearch.toLowerCase()) ||
        act.description?.toLowerCase().includes(activitySearch.toLowerCase()) ||
        act.action?.toLowerCase().includes(activitySearch.toLowerCase())

      const matchesType =
        activityTypeFilter === 'all' ||
        (activityTypeFilter === 'listings' && act.type === 'car_listed') ||
        (activityTypeFilter === 'sales' && act.type === 'car_sold') ||
        (activityTypeFilter === 'members' && act.type === 'user_joined')

      return matchesSearch && matchesType
    })
  }, [displayActivities, activitySearch, activityTypeFilter])

  // Filtered Showroom Inventory
  const filteredInventory = useMemo(() => {
    return fleetCars.filter((car) => {
      const isAvailable = car.isAvailable !== false
      const matchesSearch =
        !inventorySearch ||
        `${car.brand} ${car.model} ${car.year} ${car.location}`
          .toLowerCase()
          .includes(inventorySearch.toLowerCase())

      const matchesStatus =
        inventoryStatusFilter === 'all' ||
        (inventoryStatusFilter === 'available' && isAvailable) ||
        (inventoryStatusFilter === 'unavailable' && !isAvailable)

      return matchesSearch && matchesStatus
    })
  }, [fleetCars, inventorySearch, inventoryStatusFilter])

  // Calculated Inventory Condition Breakdown for Doughnut Chart
  const conditionCounts = useMemo(() => {
    let foreignUsed = performanceData.inventoryCondition?.foreignUsed || 0
    let brandNew = performanceData.inventoryCondition?.brandNew || 0
    let used = performanceData.inventoryCondition?.used || 0

    if (foreignUsed === 0 && brandNew === 0 && used === 0 && fleetCars.length > 0) {
      fleetCars.forEach((c) => {
        const cond = (c.condition || '').toLowerCase()
        if (cond.includes('new')) brandNew++
        else if (cond.includes('foreign') || cond.includes('import')) foreignUsed++
        else used++
      })
    }

    if (foreignUsed === 0 && brandNew === 0 && used === 0) {
      used = stats.cars.total || 1
    }

    return { foreignUsed, brandNew, used }
  }, [performanceData.inventoryCondition, fleetCars, stats.cars.total])

  // Key KPI Metrics Cards Configuration (Selling Car Marketplace Focus)
  const kpiCards = [
    {
      id: 'fleet',
      title: 'Listed Vehicles for Sale',
      value: stats.cars.total,
      subtitle: `${stats.cars.available} Available in Showroom • ${stats.cars.unavailable} Reserved/Sold`,
      badge: `${stats.cars.total > 0 ? Math.round((stats.cars.available / stats.cars.total) * 100) : 0}% In Stock`,
      badgeColor: 'text-[#6BCBFF] bg-[#2684FF]/20 border-[#2684FF]/30',
      icon: FiBox,
      iconGrad: 'from-[#2684FF] to-[#1255CC]',
      borderColor: 'border-[rgba(107,203,255,0.2)]',
      glow: 'shadow-[0_0_25px_rgba(38,132,255,0.25)]',
      actionTab: 'inventory'
    },
    {
      id: 'available-stock',
      title: 'Active Showroom Stock',
      value: stats.cars.available,
      subtitle: 'Vehicles ready for buyer viewing & purchase',
      badge: 'Ready for Sale',
      badgeColor: 'text-emerald-300 bg-emerald-500/20 border-emerald-500/30',
      icon: FiCheckCircle,
      iconGrad: 'from-emerald-500 to-teal-700',
      borderColor: 'border-emerald-500/30',
      glow: 'shadow-[0_0_25px_rgba(16,185,129,0.2)]',
      actionTab: 'inventory'
    },
    {
      id: 'cars-sold',
      title: 'Vehicles Sold / Closed Deals',
      value: stats.cars.unavailable || stats.sales?.totalDeals || 0,
      subtitle: 'Successfully transacted cars on marketplace',
      badge: 'Completed Sales',
      badgeColor: 'text-cyan-300 bg-cyan-500/20 border-cyan-500/30',
      icon: FiTag,
      iconGrad: 'from-cyan-500 to-blue-700',
      borderColor: 'border-cyan-500/30',
      glow: 'shadow-[0_0_25px_rgba(6,182,212,0.2)]',
      actionTab: 'activity'
    },
    {
      id: 'sales-volume',
      title: 'Gross Marketplace Sales Volume',
      value: formatCurrency(stats.revenue.total),
      subtitle: `Average Deal: ${formatCurrency(stats.revenue.average)} per vehicle`,
      badge: 'KES Volume',
      badgeColor: 'text-purple-300 bg-purple-500/20 border-purple-500/30',
      icon: FiDollarSign,
      iconGrad: 'from-purple-600 to-indigo-700',
      borderColor: 'border-purple-500/30',
      glow: 'shadow-[0_0_25px_rgba(147,51,234,0.25)]',
      actionTab: 'overview'
    },
    {
      id: 'avg-price',
      title: 'Average Vehicle Price',
      value: formatCurrency(stats.revenue.average || (stats.cars.total > 0 ? stats.revenue.total / stats.cars.total : 0)),
      subtitle: 'Current market average across listings',
      badge: 'Market Average',
      badgeColor: 'text-amber-300 bg-amber-500/20 border-amber-500/30',
      icon: FiActivity,
      iconGrad: 'from-amber-500 to-orange-600',
      borderColor: 'border-amber-500/30',
      glow: 'shadow-[0_0_25px_rgba(245,158,11,0.2)]',
      actionTab: 'overview'
    },
    {
      id: 'users',
      title: 'Registered Sellers & Dealerships',
      value: stats.users.total,
      subtitle: `${stats.users.active} Active Community Members`,
      badge: 'Autoria Network',
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
              return ` Sales Volume: ${formatCurrency(context.parsed.y)}`
            }
            return ` Deals / Activity: ${context.parsed.y}`
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
        ticks: { color: '#6BCBFF', stepSize: 1 }
      }
    }
  }

  if (isLoading && !stats.cars.total) {
    return (
      <div className="min-h-screen bg-[#061426] text-white flex flex-col items-center justify-center p-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-[#2684FF]/20 border-t-[#6BCBFF] animate-spin" />
          <FiBox className="w-6 h-6 text-[#6BCBFF] absolute inset-0 m-auto animate-pulse" />
        </div>
        <p className="mt-4 text-sm font-bold text-[#A8B7CC] tracking-wide">
          Loading Car Marketplace Console...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#061426] text-[#F5F8FF] p-4 sm:p-6 lg:p-8 space-y-8 font-sans">
      {/* 1. Header Command Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[rgba(107,203,255,0.15)]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#2684FF]/20 text-[#6BCBFF] border border-[#2684FF]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6BCBFF] mr-1.5 animate-pulse" />
              Automotive Marketplace Admin
            </span>
            <span className="text-xs text-[#6B7D96] hidden sm:inline">
              Kenya Premier Car Sales Platform
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Marketplace Executive Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#A8B7CC] mt-0.5">
            Live inventory overview, sales performance, and vehicle trading activity
          </p>
        </div>

        {/* Global Controls & Time Range Filter */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Time Range Selector */}
          <div className="flex items-center rounded-xl bg-[#0B1D33] p-1 border border-[rgba(107,203,255,0.15)]">
            {[
              { id: '7d', label: '7D' },
              { id: '30d', label: '30D' },
              { id: '90d', label: '90D' },
              { id: '365d', label: '1Y' }
            ].map((period) => (
              <button
                key={period.id}
                onClick={() => setTimeRange(period.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  timeRange === period.id
                    ? 'bg-gradient-to-r from-[#2684FF] to-[#1255CC] text-white shadow-[0_0_12px_rgba(38,132,255,0.4)]'
                    : 'text-[#A8B7CC] hover:text-white hover:bg-white/5'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>

          {/* Sync Button */}
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#0B1D33] border border-[rgba(107,203,255,0.2)] hover:border-[#6BCBFF] hover:bg-[#0E243E] transition-all disabled:opacity-50"
            title="Synchronize live marketplace data"
          >
            <FiRefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#6BCBFF]' : ''}`} />
            <span className="hidden sm:inline">Sync</span>
          </button>

          {/* Post New Car Button */}
          <Link
            to="/admin/add-car"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#2684FF] to-[#1255CC] hover:from-[#3B92FF] hover:to-[#1F63D6] shadow-[0_0_20px_rgba(38,132,255,0.35)] transition-all"
          >
            <FiPlusCircle className="w-4 h-4" />
            <span>List a Vehicle</span>
          </Link>
        </div>
      </div>

      {/* 2. Key Marketplace Metrics Grid (6 KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.id}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              onClick={() => setActiveTab(card.actionTab)}
              className={`p-4 rounded-2xl bg-[#0B1D33]/85 backdrop-blur-md border ${card.borderColor} ${card.glow} cursor-pointer transition-all flex flex-col justify-between group`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.iconGrad} flex items-center justify-center text-white shadow-md`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${card.badgeColor}`}
                >
                  {card.badge}
                </span>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1 group-hover:text-[#6BCBFF] transition-colors truncate">
                  {card.value}
                </div>
                <p className="text-xs font-bold text-[#F5F8FF] truncate">{card.title}</p>
                <p className="text-[11px] text-[#A8B7CC] mt-0.5 line-clamp-1">{card.subtitle}</p>
              </div>

              <div className="mt-3 flex items-center text-[11px] font-semibold text-[#6BCBFF] opacity-0 group-hover:opacity-100 transition-opacity">
                <span>View</span>
                <FiChevronRight className="w-3 h-3 ml-0.5" />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* 3. Multi-View Dashboard Tabs */}
      <div className="flex items-center gap-2 border-b border-[rgba(107,203,255,0.15)] pb-1 overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: 'Executive Sales Overview', icon: FiCompass },
          {
            id: 'activity',
            label: `Live Marketplace Activity (${displayActivities.length})`,
            icon: FiActivity
          },
          {
            id: 'inventory',
            label: `Showroom Inventory (${fleetCars.length})`,
            icon: FiBox
          },
          { id: 'diagnostics', label: 'System Telemetry & Health', icon: FiServer }
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

      {/* 4. TAB CONTENT PANELS */}
      <AnimatePresence mode="wait">
        {/* TAB 1: EXECUTIVE SALES OVERVIEW */}
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
              {/* Sales Volume & Inventory Trajectory */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0B1D33]/80 border border-[rgba(107,203,255,0.16)] shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <FiTrendingUp className="text-[#6BCBFF]" />
                      <span>Marketplace Sales Volume (KES) &amp; Transactions</span>
                    </h3>
                    <p className="text-xs text-[#A8B7CC]">
                      Gross completed deal volume (KES) and vehicle trading activity over {timeRange}
                    </p>
                  </div>
                  <div className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#2684FF]/20 text-[#6BCBFF] border border-[#2684FF]/30">
                    {timeRange === '7d' ? 'Last 7 Days' : timeRange === '90d' ? 'Last 90 Days' : timeRange === '365d' ? 'Last 1 Year' : 'Last 30 Days'}
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
                            label: 'Sales Volume (KES)',
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
                            label: 'Marketplace Deals & Inquiries',
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
                        <p className="text-sm">No sales trajectory data recorded yet for this timeframe</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Showroom Inventory Condition Breakdown */}
              <div className="p-6 rounded-2xl bg-[#0B1D33]/80 border border-[rgba(107,203,255,0.16)] shadow-lg flex flex-col justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 mb-1">
                    <FiLayers className="text-emerald-400" />
                    <span>Showroom Inventory Breakdown</span>
                  </h3>
                  <p className="text-xs text-[#A8B7CC] mb-4">Stock distribution by vehicle condition and origin</p>

                  <div className="h-52 relative flex items-center justify-center">
                    <Doughnut
                      data={{
                        labels: ['Foreign Used (Imports)', 'Brand New Showroom', 'Local Pre-Owned'],
                        datasets: [
                          {
                            data: [
                              conditionCounts.foreignUsed,
                              conditionCounts.brandNew,
                              conditionCounts.used
                            ],
                            backgroundColor: [
                              'rgba(38, 132, 255, 0.85)',
                              'rgba(34, 197, 94, 0.85)',
                              'rgba(168, 85, 247, 0.85)'
                            ],
                            borderColor: ['#2684FF', '#22c55e', '#a855f7'],
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
                      <span className="text-2xl font-black text-white">{stats.cars.total}</span>
                      <span className="text-[11px] text-[#A8B7CC] uppercase tracking-wider">Total Cars</span>
                    </div>
                  </div>
                </div>

                {/* Legend badges */}
                <div className="space-y-2 mt-4 pt-4 border-t border-[rgba(107,203,255,0.12)]">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2684FF]" />
                    <span className="text-[#A8B7CC]">Foreign Used (Imports):</span>
                    <span className="font-bold text-white ml-auto">{conditionCounts.foreignUsed}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-[#A8B7CC]">Brand New Showroom:</span>
                    <span className="font-bold text-white ml-auto">{conditionCounts.brandNew}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    <span className="text-[#A8B7CC]">Local Pre-Owned:</span>
                    <span className="font-bold text-white ml-auto">{conditionCounts.used}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top In-Demand Vehicle Models & Marketplace Operations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top Models Leaderboard */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0B1D33]/80 border border-[rgba(107,203,255,0.16)] shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <FiBox className="text-purple-400" />
                      <span>Top In-Demand Vehicle Models</span>
                    </h3>
                    <p className="text-xs text-[#A8B7CC]">Highest transaction volume and inventory presence on Autoria</p>
                  </div>
                  <Link
                    to="/admin/manage-cars"
                    className="text-xs font-bold text-[#6BCBFF] hover:underline flex items-center gap-1"
                  >
                    <span>Full Inventory</span>
                    <FiChevronRight className="w-3.5 h-3.5" />
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
                              src={
                                carItem.image
                                  ? carItem.image.startsWith('http')
                                    ? carItem.image
                                    : `${API_HOST}${carItem.image.startsWith('/') ? carItem.image : `/${carItem.image}`}`
                                  : '/hero_sports_car.jpg'
                              }
                              alt={carItem.car}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = '/hero_sports_car.jpg'
                              }}
                            />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">{carItem.car}</h4>
                            <p className="text-xs text-[#A8B7CC]">Marketplace Verified Listing</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-black text-emerald-400">{formatCurrency(carItem.revenue)}</div>
                          <span className="text-[10px] text-[#A8B7CC]">Asking / Transaction Price</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-[#A8B7CC]">
                    <FiBox className="w-8 h-8 mx-auto text-[#6B7D96] mb-2" />
                    <p className="text-sm">No vehicle performance metrics recorded yet for this period</p>
                  </div>
                )}
              </div>

              {/* Quick Marketplace Operations */}
              <div className="p-6 rounded-2xl bg-[#0B1D33]/80 border border-[rgba(107,203,255,0.16)] shadow-lg flex flex-col justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 mb-1">
                    <FiSliders className="text-[#6BCBFF]" />
                    <span>Marketplace Operations</span>
                  </h3>
                  <p className="text-xs text-[#A8B7CC] mb-4">Direct shortcuts to sales &amp; inventory management</p>

                  <div className="space-y-2.5">
                    {[
                      {
                        title: 'List a Vehicle for Sale',
                        desc: 'Post new or pre-owned car with photos & price',
                        link: '/admin/add-car',
                        icon: FiPlusCircle,
                        color: 'from-[#2684FF] to-[#1255CC]'
                      },
                      {
                        title: 'Vehicle Inventory Listings',
                        desc: 'Manage all listed cars & prices in KES',
                        link: '/admin/manage-cars',
                        icon: FiBox,
                        color: 'from-purple-600 to-indigo-700'
                      },
                      {
                        title: 'Seller & Dealership Accounts',
                        desc: 'Registered members & verification',
                        link: '/admin/users',
                        icon: FiUsers,
                        color: 'from-blue-600 to-cyan-600'
                      },
                      {
                        title: 'Sales Analytics & Reports',
                        desc: 'Deal revenue & marketplace trends',
                        link: '/admin/reports',
                        icon: FiTrendingUp,
                        color: 'from-amber-500 to-orange-600'
                      },
                      {
                        title: 'Marketplace Settings',
                        desc: 'Platform fees, currency & portal config',
                        link: '/admin/settings',
                        icon: FiSliders,
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

        {/* TAB 2: LIVE MARKETPLACE ACTIVITY FEED */}
        {activeTab === 'activity' && (
          <motion.div
            key="tab-activity"
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
                  value={activitySearch}
                  onChange={(e) => setActivitySearch(e.target.value)}
                  placeholder="Search marketplace activities by vehicle model, action, seller..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#061426] border border-[rgba(107,203,255,0.2)] text-white placeholder-[#6B7D96] text-xs sm:text-sm focus:outline-none focus:border-[#6BCBFF] transition-all"
                />
              </div>

              {/* Activity Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                {[
                  { id: 'all', label: 'All Activities' },
                  { id: 'listings', label: 'Vehicle Listings' },
                  { id: 'sales', label: 'Cars Sold' },
                  { id: 'members', label: 'New Members' }
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setActivityTypeFilter(st.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                      activityTypeFilter === st.id
                        ? 'bg-gradient-to-r from-[#2684FF] to-[#1255CC] text-white border-transparent shadow-[0_0_12px_rgba(38,132,255,0.4)]'
                        : 'bg-[#061426] text-[#A8B7CC] border-[rgba(107,203,255,0.15)] hover:text-white'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Activity Stream Cards */}
            {filteredActivities.length > 0 ? (
              <div className="space-y-3">
                {filteredActivities.map((act) => {
                  const isCar = act.type === 'car_listed' || act.type === 'car_sold'
                  const isSold = act.type === 'car_sold'

                  return (
                    <div
                      key={act.id}
                      className="p-4 sm:p-5 rounded-2xl bg-[#0B1D33]/85 border border-[rgba(107,203,255,0.16)] hover:border-[#6BCBFF]/40 shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                    >
                      {/* Left: Thumbnail & Details */}
                      <div className="flex items-center gap-4">
                        {isCar && (
                          <div className="w-16 h-14 sm:w-20 sm:h-16 rounded-xl overflow-hidden bg-slate-900 border border-white/10 shrink-0">
                            <img
                              src={act.image || '/hero_sports_car.jpg'}
                              alt={act.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.target.src = '/hero_sports_car.jpg'
                              }}
                            />
                          </div>
                        )}

                        {!isCar && (
                          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center shrink-0">
                            <FiUsers className="w-6 h-6" />
                          </div>
                        )}

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                isSold
                                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                  : act.type === 'car_listed'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                  : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                              }`}
                            >
                              {act.action}
                            </span>
                            <span className="text-xs text-[#6B7D96]">
                              {formatDate(act.time, true)}
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-white">{act.title}</h4>
                          <p className="text-xs text-[#A8B7CC] mt-0.5">{act.description}</p>
                        </div>
                      </div>

                      {/* Right: Price & Quick Action */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5">
                        {act.price && (
                          <div className="text-left sm:text-right">
                            <div className="text-sm font-black text-emerald-400">
                              {formatCurrency(act.price)}
                            </div>
                            <span className="text-[10px] text-[#A8B7CC]">
                              {isSold ? 'Sold Price' : 'Asking Price'}
                            </span>
                          </div>
                        )}

                        {act.carId && (
                          <Link
                            to={`/cars/${act.carId}`}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#6BCBFF] bg-[#2684FF]/20 hover:bg-[#2684FF]/30 border border-[#2684FF]/30 transition-all"
                          >
                            <span>View Listing</span>
                            <FiExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="py-16 text-center rounded-2xl bg-[#0B1D33]/60 border border-[rgba(107,203,255,0.12)]">
                <FiActivity className="w-10 h-10 mx-auto text-[#6B7D96] mb-3" />
                <h4 className="text-base font-bold text-white">No marketplace activities found</h4>
                <p className="text-xs text-[#A8B7CC] mt-1">Adjust search filters or list a new vehicle for sale.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 3: SHOWROOM INVENTORY MANAGER */}
        {activeTab === 'inventory' && (
          <motion.div
            key="tab-inventory"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Filter Bar */}
            <div className="p-4 rounded-2xl bg-[#0B1D33]/90 border border-[rgba(107,203,255,0.16)] shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7D96] w-4 h-4" />
                <input
                  type="text"
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  placeholder="Filter showroom inventory by brand, model, location, or year..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#061426] border border-[rgba(107,203,255,0.2)] text-white placeholder-[#6B7D96] text-xs sm:text-sm focus:outline-none focus:border-[#6BCBFF]"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={inventoryStatusFilter}
                  onChange={(e) => setInventoryStatusFilter(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-[#061426] border border-[rgba(107,203,255,0.2)] text-white text-xs font-bold focus:outline-none focus:border-[#6BCBFF]"
                >
                  <option value="all">All Vehicles ({fleetCars.length})</option>
                  <option value="available">Available in Showroom</option>
                  <option value="unavailable">Reserved / Sold</option>
                </select>

                <Link
                  to="/admin/add-car"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#2684FF] to-[#1255CC] hover:from-[#3B92FF] hover:to-[#1F63D6] shadow-[0_0_15px_rgba(38,132,255,0.3)] transition-all whitespace-nowrap"
                >
                  <FiPlusCircle className="w-3.5 h-3.5" />
                  <span>List Vehicle</span>
                </Link>
              </div>
            </div>

            {/* Vehicle Sales Cards with Real-time Status Switch */}
            {filteredInventory.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredInventory.map((car) => {
                  const isAvailable = car.isAvailable !== false
                  const isToggling = togglingCarId === car._id
                  const salePrice = car.salePrice || (car.pricePerDay ? car.pricePerDay * 30 : 0)

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

                        {/* Availability Status Badge */}
                        <div className="absolute top-3 left-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${
                              isAvailable
                                ? 'bg-emerald-500/80 border-emerald-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                                : 'bg-rose-500/80 border-rose-400 text-white shadow-[0_0_10px_rgba(244,63,94,0.5)]'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            <span>{isAvailable ? 'Available for Sale' : 'Reserved / Sold'}</span>
                          </span>
                        </div>

                        {/* Condition Badge */}
                        <div className="absolute top-3 right-3 text-[11px] font-bold text-white bg-black/60 px-2.5 py-0.5 rounded-full border border-white/20 backdrop-blur-sm">
                          {car.condition || 'Used'} • {car.year}
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-xs font-bold text-[#6BCBFF] uppercase tracking-wider">
                              {car.category || car.type || 'Sedan'}
                            </span>
                            {car.location && (
                              <span className="text-xs text-[#A8B7CC]">{car.location}</span>
                            )}
                          </div>

                          <h4 className="text-base font-bold text-white mb-2">
                            {car.brand} {car.model}
                          </h4>

                          <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-lg font-black text-emerald-400">
                              {formatCurrency(salePrice)}
                            </span>
                            <span className="text-xs text-[#A8B7CC]">asking price</span>
                          </div>
                        </div>

                        {/* Controls Bottom Bar */}
                        <div className="pt-3 border-t border-[rgba(107,203,255,0.12)] flex items-center justify-between gap-2">
                          {/* Live Availability Toggle Switch */}
                          <button
                            onClick={() => handleToggleAvailability(car._id, isAvailable)}
                            disabled={isToggling}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                              isAvailable
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                                : 'bg-slate-700/50 text-[#A8B7CC] border-slate-600 hover:text-white'
                            }`}
                            title="Toggle whether car is currently listed for sale"
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'
                              }`}
                            />
                            <span>{isToggling ? 'Updating...' : isAvailable ? 'Active Listing' : 'Marked Sold'}</span>
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
                              title="View Public Sales Listing"
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
                <h4 className="text-base font-bold text-white">No vehicles found in showroom</h4>
                <p className="text-xs text-[#A8B7CC] mt-1">Adjust search filters or list a new vehicle for sale.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 4: SYSTEM TELEMETRY & DIAGNOSTICS */}
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
                  Database:{' '}
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
                  {systemHealth?.memory?.used ? `${Math.round(systemHealth.memory.used)} MB` : '128 MB'}
                </div>
                <p className="text-xs text-[#A8B7CC]">
                  Total Allocated:{' '}
                  {systemHealth?.memory?.total ? `${Math.round(systemHealth.memory.total)} MB` : '256 MB'}
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
                <div className="text-xl font-black text-white mb-0.5">Autoria Marketplace API</div>
                <p className="text-xs text-[#A8B7CC]">Express + Mongoose ODM</p>
              </div>
            </div>

            {/* Diagnostics Detail Box */}
            <div className="p-6 rounded-2xl bg-[#0B1D33]/80 border border-[rgba(107,203,255,0.16)] shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FiServer className="text-[#6BCBFF]" />
                    <span>Live Telemetry &amp; Gateway Connection</span>
                  </h3>
                  <p className="text-xs text-[#A8B7CC]">Backend services and cloud infrastructure status</p>
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
    </div>
  )
}

export default AdminDashboard