import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Title from '../../components/Title'
import { carsAPI } from '../../utils/api'
import { useAuth } from '../../contexts/AuthContext'

const ManageCars = () => {
  const { user, isAdmin } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async () => {
    try {
      setLoading(true)
      const response = isAdmin ? await carsAPI.getAll() : await carsAPI.getMyCars()
      setCars(response.data || [])
      setError(null)
      console.log('Cars set successfully:', (response.data || []).length, 'cars')
    } catch (err) {
      console.error('Error fetching cars:', err)
      setError(err.message || 'Failed to fetch cars')
      // Set empty array on error to prevent crashes
      setCars([])
    } finally {
      setLoading(false)
    }
  }

  // Filter and sort cars
  const filteredCars = cars
    .filter(car => {
      const matchesSearch = car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           car.location.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesFilter = filterStatus === 'all' ||
                           (filterStatus === 'available' && car.isAvaliable) ||
                           (filterStatus === 'unavailable' && !car.isAvaliable)
      
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`)
        case 'price-low':
          return a.pricePerDay - b.pricePerDay
        case 'price-high':
          return b.pricePerDay - a.pricePerDay
        case 'year':
          return b.year - a.year
        default:
          return 0
      }
    })

  const handleDeleteCar = async (carId) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await carsAPI.delete(carId)
        fetchCars() // Refresh the list
      } catch (err) {
        alert('Failed to delete car: ' + err.message)
      }
    }
  }

  const handleToggleAvailability = async (carId) => {
    try {
      await carsAPI.toggleAvailability(carId)
      fetchCars() // Refresh the list
    } catch (err) {
      alert('Failed to toggle availability: ' + err.message)
    }
  }

  return (
    <div className="space-y-6">
      <Title 
        title="Manage Cars" 
        subtitle="Review, filter, edit, and maintain your active vehicle fleet"
      />

      {/* Filters and Actions */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-[var(--border-color)]">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Search */}
          <div className="flex-1 w-full lg:max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by brand, model, or location..."
                className="block w-full pl-11 pr-4 py-2.5 bg-[#061426]/70 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#2684FF] focus:ring-1 focus:ring-[#2684FF] transition-all text-sm"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-[#061426]/80 border border-white/10 text-white rounded-xl text-sm focus:outline-none focus:border-[#2684FF]"
            >
              <option value="all">All Status</option>
              <option value="available">Available Only</option>
              <option value="unavailable">Unavailable</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-[#061426]/80 border border-white/10 text-white rounded-xl text-sm focus:outline-none focus:border-[#2684FF]"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="year">Year (Newest)</option>
            </select>

            <Link
              to="/admin/add-car"
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-[#2684FF] to-[#1255CC] text-white rounded-xl hover:from-[#3a93ff] hover:to-[#1a65e0] transition-all duration-300 shadow-[0_0_15px_rgba(38,132,255,0.3)] font-medium text-sm whitespace-nowrap"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Car
            </Link>
          </div>
        </div>
      </div>

      {/* Cars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCars.map((car) => {
          const carImg = car.images?.[0]?.url || car.image || '/hero_sports_car.jpg'
          const isAvail = car.isAvailable ?? car.isAvaliable ?? true
          return (
            <div
              key={car._id}
              className="glass-panel rounded-2xl border border-white/[0.08] hover:border-[#2684FF]/40 transition-all duration-300 overflow-hidden flex flex-col group shadow-lg"
            >
              {/* Car Image Banner */}
              <div className="relative h-48 bg-[#040d1a] overflow-hidden">
                <img 
                  src={carImg} 
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = '/hero_sports_car.jpg' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D33] via-transparent to-black/30 pointer-events-none" />

                <div className="absolute top-3 left-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-md ${
                    isAvail 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isAvail ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
                    {isAvail ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  {car.condition && (
                    <span className="inline-block px-2.5 py-1 bg-black/60 backdrop-blur-md text-[#6BCBFF] border border-[#6BCBFF]/20 rounded-full text-xs font-medium">
                      {car.condition}
                    </span>
                  )}
                  <span className="inline-block px-2.5 py-1 bg-black/60 backdrop-blur-md text-white rounded-full text-xs font-medium">
                    {car.category}
                  </span>
                </div>
              </div>

              {/* Car Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-[#6BCBFF] transition-colors leading-tight">
                        {car.brand} {car.model}
                      </h3>
                      <p className="text-xs text-[#A8B7CC] mt-0.5">
                        {car.year} • {car.location || 'Showroom'}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      {car.salePrice ? (
                        <>
                          <p className="text-lg font-extrabold text-[#6BCBFF]">
                            ${car.salePrice?.toLocaleString()}
                          </p>
                          <p className="text-[10px] text-[#A8B7CC]">Buy Now</p>
                        </>
                      ) : (
                        <>
                          <p className="text-lg font-extrabold text-[#6BCBFF]">
                            ${car.pricePerDay}
                          </p>
                          <p className="text-[10px] text-[#A8B7CC]">per day</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Car Specs */}
                  <div className="grid grid-cols-2 gap-2 py-3 px-3.5 my-3 bg-[#061426]/60 rounded-xl border border-white/[0.05] text-xs text-[#A8B7CC]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#6BCBFF]">⛽</span>
                      <span className="truncate">{car.fuelType || car.fuel_type || 'Gasoline'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#6BCBFF]">👥</span>
                      <span>{car.seatingCapacity || car.seating_capacity || 4} seats</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#6BCBFF]">⚙️</span>
                      <span className="truncate">{car.transmission || 'Automatic'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#6BCBFF]">📍</span>
                      <span className="truncate">{car.location || 'Nairobi'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/[0.06]">
                  <Link
                    to={`/cars/${car._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-2 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white rounded-lg transition-colors text-xs font-medium"
                    title="View public details"
                  >
                    <svg className="w-3.5 h-3.5 mr-1 text-[#6BCBFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </Link>

                  <Link
                    to={`/admin/edit-car/${car._id}`}
                    className="inline-flex items-center justify-center px-2 py-2 bg-[#2684FF]/10 hover:bg-[#2684FF]/20 border border-[#2684FF]/30 text-[#6BCBFF] rounded-lg transition-colors text-xs font-medium"
                    title="Edit car details"
                  >
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Link>

                  <button
                    onClick={() => handleToggleAvailability(car._id)}
                    className={`inline-flex items-center justify-center px-2 py-2 rounded-lg transition-colors text-xs font-medium ${
                      isAvail
                        ? 'border border-amber-500/30 text-amber-300 hover:bg-amber-500/10'
                        : 'border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10'
                    }`}
                  >
                    {isAvail ? 'Disable' : 'Enable'}
                  </button>

                  <button
                    onClick={() => handleDeleteCar(car._id)}
                    className="inline-flex items-center justify-center px-2 py-2 border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-xs"
                    title="Delete car"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredCars.length === 0 && !loading && (
        <div className="glass-panel rounded-2xl p-12 border border-[var(--border-color)] text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-[#6BCBFF]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">No vehicles found</h3>
          <p className="text-[#A8B7CC] mb-6 max-w-sm mx-auto text-sm">
            {searchQuery || filterStatus !== 'all'
              ? 'Try adjusting your search keywords or filter status'
              : 'Your marketplace fleet is empty. Register your first vehicle to get started.'
            }
          </p>
          <Link
            to="/admin/add-car"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#2684FF] to-[#1255CC] text-white rounded-xl hover:from-[#3a93ff] hover:to-[#1a65e0] transition-all duration-300 shadow-[0_0_20px_rgba(38,132,255,0.35)] text-sm font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Car
          </Link>
        </div>
      )}
    </div>
  )
}

export default ManageCars