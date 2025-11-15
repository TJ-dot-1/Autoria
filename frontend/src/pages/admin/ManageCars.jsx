import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Title from '../../components/Title'
import { carsAPI } from '../../utils/api'

const ManageCars = () => {
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
      console.log('Fetching cars...')
      const response = await carsAPI.getAll()
      console.log('API Response:', response)
      console.log('Response data:', response.data)
      console.log('Cars array:', response.data || [])
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
        subtitle="Add, edit, and manage your car fleet"
      />

      {/* Filters and Actions */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cars..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4 items-center">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Cars</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="year">Year (Newest First)</option>
            </select>

            <Link
              to="/admin/add-car"
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Car
            </Link>
          </div>
        </div>
      </div>

      {/* Cars Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCars.map((car) => (
          <div key={car._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Car Image */}
            <div className="relative">
              <img 
                src={car.image} 
                alt={`${car.brand} ${car.model}`}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  car.isAvaliable 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {car.isAvaliable ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className="inline-block px-3 py-1 bg-black bg-opacity-50 text-white rounded-full text-xs font-medium">
                  {car.category}
                </span>
              </div>
            </div>

            {/* Car Details */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {car.year} • {car.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    ${car.pricePerDay}
                  </p>
                  <p className="text-sm text-gray-500">per day</p>
                </div>
              </div>

              {/* Car Specs */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="mr-2">⛽</span>
                  {car.fuel_type}
                </div>
                <div className="flex items-center">
                  <span className="mr-2">👥</span>
                  {car.seating_capacity} seats
                </div>
                <div className="flex items-center">
                  <span className="mr-2">⚙️</span>
                  {car.transmission}
                </div>
                <div className="flex items-center">
                  <span className="mr-2">📍</span>
                  {car.location}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Link
                  to={`/car/${car._id}`}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View
                </Link>
                <Link
                  to={`/admin/edit-car/${car._id}`}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </Link>
                <button
                  onClick={() => handleToggleAvailability(car._id)}
                  className={`flex-1 inline-flex items-center justify-center px-3 py-2 rounded-lg transition-colors ${
                    car.isAvaliable
                      ? 'border border-red-300 text-red-700 hover:bg-red-50'
                      : 'border border-green-300 text-green-700 hover:bg-green-50'
                  }`}
                >
                  {car.isAvaliable ? 'Disable' : 'Enable'}
                </button>
                <button
                  onClick={() => handleDeleteCar(car._id)}
                  className="px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCars.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-12 border border-gray-100 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No cars found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || filterStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first car'
            }
          </p>
          <Link
            to="/admin/add-car"
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
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