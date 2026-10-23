import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import Title from '../../components/Title'
import { carsAPI } from '../../utils/api'
import { convertImageToWebP } from '../../utils/imageHelpers'

// Enum-safe features list matching backend/models/Car.js
const ALLOWED_FEATURES = [
  { name: 'Apple CarPlay', category: 'Tech' },
  { name: 'Android Auto', category: 'Tech' },
  { name: 'GPS Navigation', category: 'Tech' },
  { name: 'Bluetooth', category: 'Tech' },
  { name: 'Wireless Charging', category: 'Tech' },
  { name: 'USB Port', category: 'Tech' },
  { name: 'WiFi Hotspot', category: 'Tech' },
  { name: 'Premium Audio', category: 'Tech' },
  { name: 'Premium Sound System', category: 'Tech' },
  { name: 'Rear Entertainment System', category: 'Tech' },
  { name: 'Leather Seats', category: 'Comfort' },
  { name: 'Heated Seats', category: 'Comfort' },
  { name: 'Cooled Seats', category: 'Comfort' },
  { name: 'Sunroof', category: 'Comfort' },
  { name: 'Air Conditioning', category: 'Comfort' },
  { name: 'Automatic Climate Control', category: 'Comfort' },
  { name: 'Keyless Entry', category: 'Comfort' },
  { name: 'Push Button Start', category: 'Comfort' },
  { name: 'Remote Start', category: 'Comfort' },
  { name: 'Backup Camera', category: 'Safety' },
  { name: 'Parking Sensors', category: 'Safety' },
  { name: 'Cruise Control', category: 'Safety' },
  { name: 'Blind Spot Monitoring', category: 'Safety' },
  { name: 'Lane Departure Warning', category: 'Safety' },
  { name: 'Collision Avoidance', category: 'Safety' },
]

const CAR_CONSTANTS = {
  fuelTypes: ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid', 'CNG', 'LPG'],
  transmissions: ['Automatic', 'Manual', 'CVT', 'Semi-Automatic'],
  types: ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Wagon', 'Van', 'Truck'],
  categories: [
    'Economy', 'Compact', 'Mid-size', 'Full-size', 'Luxury',
    'SUV', 'Compact SUV', 'Mid-size SUV', 'Full-size SUV',
    'Electric', 'Hybrid', 'Sports', 'Convertible', 'Van', 'Truck'
  ],
  colors: [
    { name: 'Midnight Black', hex: '#0a0a0a', value: 'Black' },
    { name: 'Pearl White', hex: '#f8fafc', value: 'White' },
    { name: 'Cyber Silver', hex: '#94a3b8', value: 'Silver' },
    { name: 'Titanium Gray', hex: '#475569', value: 'Gray' },
    { name: 'Deep Electric Blue', hex: '#2684FF', value: 'Blue' },
    { name: 'Flame Red', hex: '#ef4444', value: 'Red' },
    { name: 'Emerald Green', hex: '#10b981', value: 'Green' },
    { name: 'Champagne Gold', hex: '#eab308', value: 'Gold' },
    { name: 'Sunset Orange', hex: '#f97316', value: 'Orange' },
    { name: 'Imperial Purple', hex: '#a855f7', value: 'Purple' }
  ],
  interiorColors: ['Black', 'Beige', 'Red', 'Brown', 'White', 'Cognac'],
  engineTypes: ['Electric Motor', 'V6', 'V8', 'V4', 'V10', 'V12', 'Flat-4', 'Flat-6'],
  sampleImages: [
    { label: 'Electric Sports Car', url: '/hero_sports_car.jpg' },
    { label: 'Audi Luxury Sedan', url: '/audi_a6.jpg' },
    { label: 'Mercedes C-Class', url: '/mercedes_c_class.jpg' },
    { label: 'Executive Sedan', url: '/banner_sedan.jpg' }
  ]
}

const AddCar = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = !!id

  const [isLoading, setIsLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [activeFeatureTab, setActiveFeatureTab] = useState('All')
  const [showMobilePreview, setShowMobilePreview] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    // Basic Information
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    category: 'Luxury',
    type: 'Sedan',
    condition: 'Used',

    // Marketplace / Listing Type
    isForRent: true,
    isForSale: true,
    salePrice: '',
    pricePerDay: '',
    pricePerWeek: '',
    pricePerMonth: '',
    mileage: '',
    isAvailable: true,
    isPopular: false,

    // Powertrain & Specs
    fuelType: 'Electric',
    transmission: 'Automatic',
    seatingCapacity: 5,
    doors: 4,
    location: 'Nairobi',

    // Appearance
    exteriorColor: 'Blue',
    interiorColor: 'Black',

    // Technical Performance (AutoHub 4-spec tiles)
    zeroToSixty: '3.8',
    topSpeed: '250',
    power: '450',
    range: '520',
    engineType: 'Electric Motor',

    // Content & Media
    description: '',
    features: ['Apple CarPlay', 'GPS Navigation', 'Backup Camera', 'Bluetooth', 'Leather Seats', 'Keyless Entry'],
    image: '/hero_sports_car.jpg',
    imagePublicId: null,
    imageProvider: null,
    directImageUrl: ''
  })

  const [errors, setErrors] = useState({})

  // Load car data if editing
  useEffect(() => {
    if (isEditing) {
      const loadCarData = async () => {
        try {
          setIsLoading(true)
          const response = await carsAPI.getById(id)
          const car = response.data

          setFormData({
            brand: car.brand || '',
            model: car.model || '',
            year: car.year || new Date().getFullYear(),
            category: car.category || 'Luxury',
            type: car.type || 'Sedan',
            condition: car.condition || 'Used',
            isForRent: car.isForRent !== false,
            isForSale: car.isForSale || !!car.salePrice,
            salePrice: car.salePrice || '',
            pricePerDay: car.pricePerDay || '',
            pricePerWeek: car.pricePerWeek || '',
            pricePerMonth: car.pricePerMonth || '',
            mileage: car.mileage || '',
            isAvailable: car.isAvailable !== false,
            isPopular: car.isPopular || false,
            fuelType: car.fuelType || 'Gasoline',
            transmission: car.transmission || 'Automatic',
            seatingCapacity: car.seatingCapacity || 5,
            doors: car.doors || 4,
            location: car.location || '',
            exteriorColor: car.color?.exterior || 'Blue',
            interiorColor: car.color?.interior || 'Black',
            zeroToSixty: car.performance?.acceleration?.zeroToSixty || '4.0',
            topSpeed: car.performance?.topSpeed || '240',
            power: car.engine?.power || '350',
            range: car.performance?.fuelEconomy?.combined || '500',
            engineType: car.engine?.type || 'V6',
            description: car.description || '',
            features: car.features || [],
            image: car.images?.[0]?.url || car.image || '',
            imagePublicId: car.images?.[0]?.filename || null,
            imageProvider: car.images?.[0]?.provider || null,
            directImageUrl: car.images?.[0]?.url || car.image || ''
          })
        } catch (error) {
          setSubmitError('Failed to load car data: ' + error.message)
        } finally {
          setIsLoading(false)
        }
      }

      loadCarData()
    }
  }, [isEditing, id])

  const clearError = useCallback((fieldName) => {
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }))
    }
  }, [errors])

  // Input change handler
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    clearError(name)
  }, [clearError])

  const handleNumberInput = useCallback((name, value) => {
    if (value === '' || (!isNaN(Number(value)) && isFinite(Number(value)))) {
      const numValue = value === '' ? '' : Number(value)
      setFormData(prev => ({ ...prev, [name]: numValue }))
    }
    clearError(name)
  }, [clearError])

  // Feature toggle handler
  const toggleFeature = (featureName) => {
    setFormData(prev => {
      const exists = prev.features.includes(featureName)
      return {
        ...prev,
        features: exists
          ? prev.features.filter(f => f !== featureName)
          : [...prev.features, featureName]
      }
    })
  }

  const selectAllFeatures = () => {
    setFormData(prev => ({
      ...prev,
      features: ALLOWED_FEATURES.map(f => f.name)
    }))
  }

  const clearAllFeatures = () => {
    setFormData(prev => ({
      ...prev,
      features: []
    }))
  }

  // Image Upload handler
  const uploadImage = async (file) => {
    const uploadData = new FormData()
    uploadData.append('image', file)

    const token = localStorage.getItem('autoria_token')
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
    const response = await fetch(`${apiBase}/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: uploadData
    })

    if (!response.ok) {
      throw new Error('Failed to upload image to server')
    }

    return await response.json()
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }))
      return
    }

    if (file.size > 12 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image size must be less than 12MB' }))
      return
    }

    setImageUploading(true)
    clearError('image')

    try {
      // Automatically convert image to WebP format for fast loading
      const optimizedWebpFile = await convertImageToWebP(file, {
        quality: 0.85,
        maxWidth: 1920,
        maxHeight: 1200
      })

      const uploadResult = await uploadImage(optimizedWebpFile)
      let imageUrl = uploadResult.data.url

      if (!/^https?:\/\//i.test(imageUrl)) {
        const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '')
        imageUrl = `${baseUrl}${imageUrl}`
      }

      setFormData(prev => ({
        ...prev,
        image: imageUrl,
        directImageUrl: imageUrl,
        imagePublicId: uploadResult.data.filename || null,
        imageProvider: uploadResult.data.provider || null
      }))
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        image: 'Upload failed. You can also paste an image URL directly below.'
      }))
    } finally {
      setImageUploading(false)
    }
  }

  const handleApplyDirectImageUrl = () => {
    if (formData.directImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        image: prev.directImageUrl.trim()
      }))
      clearError('image')
    }
  }

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: '',
      directImageUrl: '',
      imagePublicId: null,
      imageProvider: null
    }))
  }

  // Form Validation
  const validateForm = () => {
    const newErrors = {}

    if (!formData.brand.trim()) newErrors.brand = 'Brand is required'
    if (!formData.model.trim()) newErrors.model = 'Model is required'
    if (!formData.year || formData.year < 1990 || formData.year > 2030) newErrors.year = 'Valid year between 1990 and 2030 is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.type) newErrors.type = 'Body type is required'
    if (!formData.location.trim()) newErrors.location = 'Location or city is required'
    if (!formData.pricePerDay || Number(formData.pricePerDay) <= 0) {
      newErrors.pricePerDay = 'Valid daily rental price is required'
    }

    if (formData.isForSale && (!formData.salePrice || Number(formData.salePrice) <= 0)) {
      newErrors.salePrice = 'Sale price is required when car is listed for sale'
    }

    if (!formData.exteriorColor) newErrors.exteriorColor = 'Exterior color is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Backend Payload Mapping
  const mapFormDataToBackend = () => {
    const imagesArray = formData.image
      ? [{ url: formData.image, isPrimary: true, caption: `${formData.brand} ${formData.model}` }]
      : [{ url: '/hero_sports_car.jpg', isPrimary: true }]

    return {
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      year: Number(formData.year),
      category: formData.category,
      type: formData.type,
      condition: formData.condition,
      isForRent: Boolean(formData.isForRent),
      isForSale: Boolean(formData.isForSale),
      pricePerDay: Number(formData.pricePerDay),
      ...(formData.salePrice ? { salePrice: Number(formData.salePrice) } : {}),
      ...(formData.pricePerWeek ? { pricePerWeek: Number(formData.pricePerWeek) } : {}),
      ...(formData.pricePerMonth ? { pricePerMonth: Number(formData.pricePerMonth) } : {}),
      ...(formData.mileage ? { mileage: Number(formData.mileage) } : {}),
      fuelType: formData.fuelType,
      transmission: formData.transmission,
      seatingCapacity: Number(formData.seatingCapacity),
      doors: Number(formData.doors),
      location: formData.location.trim(),
      description: formData.description.trim() || `Experience the pinnacle of automotive engineering with this ${formData.year} ${formData.brand} ${formData.model}.`,
      features: formData.features,
      isAvailable: Boolean(formData.isAvailable),
      isPopular: Boolean(formData.isPopular),
      color: {
        exterior: formData.exteriorColor,
        interior: formData.interiorColor
      },
      engine: {
        type: formData.engineType || 'V6',
        power: Number(formData.power) || 350
      },
      performance: {
        acceleration: {
          zeroToSixty: Number(formData.zeroToSixty) || 4.2
        },
        topSpeed: Number(formData.topSpeed) || 240,
        fuelEconomy: {
          combined: Number(formData.range) || 500
        }
      },
      images: imagesArray
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      setSubmitError('Please correct the highlighted fields before submitting.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setIsLoading(true)
    setSubmitError('')
    setSuccessMessage('')

    try {
      const payload = mapFormDataToBackend()

      if (isEditing) {
        await carsAPI.update(id, payload)
        setSuccessMessage('Vehicle successfully updated!')
      } else {
        await carsAPI.create(payload)
        setSuccessMessage('Vehicle successfully added to fleet!')
      }

      setTimeout(() => {
        navigate('/admin/manage-cars')
      }, 1000)
    } catch (err) {
      console.error('Error saving car:', err)
      setSubmitError(err.message || `Failed to ${isEditing ? 'update' : 'create'} car.`)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter features based on tab
  const filteredFeatures = ALLOWED_FEATURES.filter(f => 
    activeFeatureTab === 'All' ? true : f.category === activeFeatureTab
  )

  // Completion calculation for readiness score
  const completionPoints = [
    formData.brand && formData.model,
    formData.year && formData.category && formData.type,
    formData.pricePerDay && Number(formData.pricePerDay) > 0,
    formData.location,
    formData.image,
    formData.features.length > 0
  ]
  const completionPercent = Math.round((completionPoints.filter(Boolean).length / completionPoints.length) * 100)

  return (
    <div className="space-y-6 pb-24 lg:pb-12 max-w-7xl mx-auto">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#A8B7CC] mb-2 font-medium">
            <Link to="/admin/dashboard" className="hover:text-white transition-colors">Admin</Link>
            <span>/</span>
            <Link to="/admin/manage-cars" className="hover:text-white transition-colors">Fleet</Link>
            <span>/</span>
            <span className="text-[#6BCBFF]">{isEditing ? 'Edit Vehicle' : 'Add New Car'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            {isEditing ? `Edit ${formData.brand || 'Vehicle'}` : 'Register New Vehicle'}
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2684FF]/20 text-[#6BCBFF] border border-[#2684FF]/30">
              {isEditing ? 'Edit Mode' : 'New Listing'}
            </span>
          </h1>
          <p className="text-sm text-[#A8B7CC] mt-1">
            Configure vehicle identity, marketplace pricing, high-res media, and specs.
          </p>
        </div>

        {/* Top Action Buttons (Desktop) */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/admin/manage-cars"
            className="px-4 py-2.5 rounded-xl border border-white/10 text-white/80 hover:text-white hover:bg-white/[0.05] transition-all text-sm font-medium"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isLoading || imageUploading}
            className="px-6 py-2.5 bg-gradient-to-r from-[#2684FF] to-[#1255CC] text-white rounded-xl hover:from-[#3a93ff] hover:to-[#1a65e0] transition-all duration-300 shadow-[0_0_20px_rgba(38,132,255,0.4)] text-sm font-bold flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{isEditing ? 'Save Changes' : 'Publish Car'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {submitError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-3">
          <svg className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold">Validation Issue</h4>
            <p className="text-xs text-rose-300/90 mt-0.5">{submitError}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3">
          <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}

      {/* Main Grid: Form (Col 8) + Live Marketplace Preview (Col 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: The Form */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* CARD 1: Identity & Classification */}
            <div className="glass-panel rounded-2xl p-5 sm:p-7 border border-[var(--border-color)] space-y-5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#2684FF]/20 flex items-center justify-center text-[#6BCBFF]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Vehicle Identity</h3>
                    <p className="text-xs text-[#A8B7CC]">Brand, model, production year, and body configuration</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/[0.05] text-[#A8B7CC]">Step 1</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Brand */}
                <div>
                  <label className="block text-xs font-semibold text-[#A8B7CC] mb-1.5 uppercase tracking-wider">
                    Brand / Manufacturer <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="e.g. Porsche, Tesla, BMW, Audi"
                    className={`w-full px-3.5 py-2.5 bg-[#061426]/80 border ${
                      errors.brand ? 'border-rose-500' : 'border-white/10'
                    } rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#2684FF] focus:ring-1 focus:ring-[#2684FF] transition-all`}
                  />
                  {errors.brand && <p className="text-xs text-rose-400 mt-1">{errors.brand}</p>}
                </div>

                {/* Model */}
                <div>
                  <label className="block text-xs font-semibold text-[#A8B7CC] mb-1.5 uppercase tracking-wider">
                    Model Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder="e.g. Taycan Turbo S, Model 3, M4"
                    className={`w-full px-3.5 py-2.5 bg-[#061426]/80 border ${
                      errors.model ? 'border-rose-500' : 'border-white/10'
                    } rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#2684FF] focus:ring-1 focus:ring-[#2684FF] transition-all`}
                  />
                  {errors.model && <p className="text-xs text-rose-400 mt-1">{errors.model}</p>}
                </div>

                {/* Year */}
                <div>
                  <label className="block text-xs font-semibold text-[#A8B7CC] mb-1.5 uppercase tracking-wider">
                    Manufacturing Year <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={(e) => handleNumberInput('year', e.target.value)}
                    min={1990}
                    max={2030}
                    className={`w-full px-3.5 py-2.5 bg-[#061426]/80 border ${
                      errors.year ? 'border-rose-500' : 'border-white/10'
                    } rounded-xl text-white text-sm focus:outline-none focus:border-[#2684FF] focus:ring-1 focus:ring-[#2684FF] transition-all`}
                  />
                  {errors.year && <p className="text-xs text-rose-400 mt-1">{errors.year}</p>}
                </div>

                {/* Condition Pills (New / Used) */}
                <div>
                  <label className="block text-xs font-semibold text-[#A8B7CC] mb-1.5 uppercase tracking-wider">
                    Condition
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['New', 'Used'].map(c => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setFormData(prev => ({ ...prev, condition: c }))}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                          formData.condition === c
                            ? 'bg-[#2684FF] text-white shadow-[0_0_12px_rgba(38,132,255,0.4)]'
                            : 'bg-[#061426]/80 text-[#A8B7CC] border border-white/10 hover:text-white'
                        }`}
                      >
                        {c} Vehicle
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-[#A8B7CC] mb-1.5 uppercase tracking-wider">
                    Marketplace Category <span className="text-rose-400">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-[#061426]/90 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#2684FF] transition-all"
                  >
                    {CAR_CONSTANTS.categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Body Type */}
                <div>
                  <label className="block text-xs font-semibold text-[#A8B7CC] mb-1.5 uppercase tracking-wider">
                    Body Style <span className="text-rose-400">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-[#061426]/90 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#2684FF] transition-all"
                  >
                    {CAR_CONSTANTS.types.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* CARD 2: Pricing & Listing Strategy */}
            <div className="glass-panel rounded-2xl p-5 sm:p-7 border border-[var(--border-color)] space-y-5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Pricing & Marketplace Listing</h3>
                    <p className="text-xs text-[#A8B7CC]">Enable Buy Now sales, daily rentals, or both</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/[0.05] text-[#A8B7CC]">Step 2</span>
              </div>

              {/* Listing Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                  formData.isForSale
                    ? 'bg-[#2684FF]/10 border-[#2684FF]/40 text-white shadow-sm'
                    : 'bg-[#061426]/50 border-white/10 text-[#A8B7CC]'
                }`}>
                  <input
                    type="checkbox"
                    name="isForSale"
                    checked={formData.isForSale}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#2684FF] rounded focus:ring-0"
                  />
                  <div>
                    <span className="text-xs font-bold block">Available for Purchase</span>
                    <span className="text-[11px] text-[#A8B7CC]">Listed in Buy a Car inventory</span>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                  formData.isForRent
                    ? 'bg-[#2684FF]/10 border-[#2684FF]/40 text-white shadow-sm'
                    : 'bg-[#061426]/50 border-white/10 text-[#A8B7CC]'
                }`}>
                  <input
                    type="checkbox"
                    name="isForRent"
                    checked={formData.isForRent}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#2684FF] rounded focus:ring-0"
                  />
                  <div>
                    <span className="text-xs font-bold block">Available for Daily Rental</span>
                    <span className="text-[11px] text-[#A8B7CC]">Rent per day with instant booking</span>
                  </div>
                </label>
              </div>

              {/* Price Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Sale Price */}
                <div>
                  <label className="block text-xs font-semibold text-[#A8B7CC] mb-1.5 uppercase tracking-wider">
                    Full Purchase Price ($) {formData.isForSale && <span className="text-rose-400">*</span>}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#6BCBFF] font-bold text-sm">$</span>
                    <input
                      type="number"
                      name="salePrice"
                      value={formData.salePrice}
                      onChange={(e) => handleNumberInput('salePrice', e.target.value)}
                      placeholder="e.g. 58900"
                      min={1}
                      className={`w-full pl-8 pr-3.5 py-2.5 bg-[#061426]/80 border ${
                        errors.salePrice ? 'border-rose-500' : 'border-white/10'
                      } rounded-xl text-white text-sm focus:outline-none focus:border-[#2684FF] focus:ring-1 focus:ring-[#2684FF] transition-all`}
                    />
                  </div>
                  {errors.salePrice && <p className="text-xs text-rose-400 mt-1">{errors.salePrice}</p>}
                </div>

                {/* Daily Price */}
                <div>
                  <label className="block text-xs font-semibold text-[#A8B7CC] mb-1.5 uppercase tracking-wider">
                    Daily Rate ($ / Day) <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#6BCBFF] font-bold text-sm">$</span>
                    <input
                      type="number"
                      name="pricePerDay"
                      value={formData.pricePerDay}
                      onChange={(e) => handleNumberInput('pricePerDay', e.target.value)}
                      placeholder="e.g. 199"
                      min={1}
                      step="0.01"
                      className={`w-full pl-8 pr-3.5 py-2.5 bg-[#061426]/80 border ${
                        errors.pricePerDay ? 'border-rose-500' : 'border-white/10'
                      } rounded-xl text-white text-sm focus:outline-none focus:border-[#2684FF] focus:ring-1 focus:ring-[#2684FF] transition-all`}
                    />
                  </div>
                  {errors.pricePerDay && <p className="text-xs text-rose-400 mt-1">{errors.pricePerDay}</p>}
                </div>

                {/* Mileage */}
                <div>
                  <label className="block text-xs font-semibold text-[#A8B7CC] mb-1.5 uppercase tracking-wider">
                    Odometer Mileage (km / mi)
                  </label>
                  <input
                    type="number"
                    name="mileage"
                    value={formData.mileage}
                    onChange={(e) => handleNumberInput('mileage', e.target.value)}
                    placeholder="e.g. 14200"
                    min={0}
                    className="w-full px-3.5 py-2.5 bg-[#061426]/80 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#2684FF] transition-all"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-semibold text-[#A8B7CC] mb-1.5 uppercase tracking-wider">
                    Location / Showroom City <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Nairobi, Mombasa, Westlands"
                    className={`w-full px-3.5 py-2.5 bg-[#061426]/80 border ${
                      errors.location ? 'border-rose-500' : 'border-white/10'
                    } rounded-xl text-white text-sm focus:outline-none focus:border-[#2684FF] transition-all`}
                  />
                  {errors.location && <p className="text-xs text-rose-400 mt-1">{errors.location}</p>}
                </div>
              </div>

              {/* Marketplace Visibility Checkboxes */}
              <div className="pt-2 flex flex-col sm:flex-row gap-4 border-t border-white/[0.06]">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#A8B7CC] hover:text-white">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#2684FF] rounded"
                  />
                  <span>Active &amp; immediately bookable</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#A8B7CC] hover:text-white">
                  <input
                    type="checkbox"
                    name="isPopular"
                    checked={formData.isPopular}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#2684FF] rounded"
                  />
                  <span>Featured "Hot Deal" / Popular badge</span>
                </label>
              </div>
            </div>

            {/* CARD 3: Powertrain & Performance Specs */}
            <div className="glass-panel rounded-2xl p-5 sm:p-7 border border-[var(--border-color)] space-y-5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-[#6BCBFF]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Powertrain &amp; Specs</h3>
                    <p className="text-xs text-[#A8B7CC]">AutoHub 4-spec metrics displayed on car details</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/[0.05] text-[#A8B7CC]">Step 3</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {/* 0-100 km/h */}
                <div className="p-3 rounded-xl bg-[#061426]/70 border border-white/[0.06]">
                  <span className="text-[10px] uppercase font-bold text-[#6BCBFF] block mb-1">0-100 km/h</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      name="zeroToSixty"
                      value={formData.zeroToSixty}
                      onChange={handleInputChange}
                      placeholder="3.8"
                      className="w-full bg-transparent text-white font-bold text-base focus:outline-none"
                    />
                    <span className="text-xs text-[#A8B7CC]">sec</span>
                  </div>
                </div>

                {/* Top Speed */}
                <div className="p-3 rounded-xl bg-[#061426]/70 border border-white/[0.06]">
                  <span className="text-[10px] uppercase font-bold text-[#6BCBFF] block mb-1">Top Speed</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      name="topSpeed"
                      value={formData.topSpeed}
                      onChange={handleInputChange}
                      placeholder="260"
                      className="w-full bg-transparent text-white font-bold text-base focus:outline-none"
                    />
                    <span className="text-xs text-[#A8B7CC]">km/h</span>
                  </div>
                </div>

                {/* Power */}
                <div className="p-3 rounded-xl bg-[#061426]/70 border border-white/[0.06]">
                  <span className="text-[10px] uppercase font-bold text-[#6BCBFF] block mb-1">Power Output</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      name="power"
                      value={formData.power}
                      onChange={handleInputChange}
                      placeholder="450"
                      className="w-full bg-transparent text-white font-bold text-base focus:outline-none"
                    />
                    <span className="text-xs text-[#A8B7CC]">HP</span>
                  </div>
                </div>

                {/* Range / Fuel Econ */}
                <div className="p-3 rounded-xl bg-[#061426]/70 border border-white/[0.06]">
                  <span className="text-[10px] uppercase font-bold text-[#6BCBFF] block mb-1">Range / Economy</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      name="range"
                      value={formData.range}
                      onChange={handleInputChange}
                      placeholder="520"
                      className="w-full bg-transparent text-white font-bold text-base focus:outline-none"
                    />
                    <span className="text-xs text-[#A8B7CC]">km</span>
                  </div>
                </div>
              </div>

              {/* Transmission & Fuel Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#A8B7CC] mb-1.5 uppercase tracking-wider">
                    Fuel Type
                  </label>
                  <select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-[#061426]/90 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#2684FF]"
                  >
                    {CAR_CONSTANTS.fuelTypes.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A8B7CC] mb-1.5 uppercase tracking-wider">
                    Transmission
                  </label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-[#061426]/90 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#2684FF]"
                  >
                    {CAR_CONSTANTS.transmissions.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A8B7CC] mb-1.5 uppercase tracking-wider">
                    Seating Capacity
                  </label>
                  <input
                    type="number"
                    name="seatingCapacity"
                    value={formData.seatingCapacity}
                    onChange={(e) => handleNumberInput('seatingCapacity', e.target.value)}
                    min={1}
                    max={15}
                    className="w-full px-3 py-2.5 bg-[#061426]/80 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#2684FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A8B7CC] mb-1.5 uppercase tracking-wider">
                    Doors
                  </label>
                  <input
                    type="number"
                    name="doors"
                    value={formData.doors}
                    onChange={(e) => handleNumberInput('doors', e.target.value)}
                    min={2}
                    max={6}
                    className="w-full px-3 py-2.5 bg-[#061426]/80 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#2684FF]"
                  />
                </div>
              </div>
            </div>

            {/* CARD 4: Media, Visual Assets & Colors */}
            <div className="glass-panel rounded-2xl p-5 sm:p-7 border border-[var(--border-color)] space-y-5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Media &amp; Styling</h3>
                    <p className="text-xs text-[#A8B7CC]">Upload studio photography or select from preset assets</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/[0.05] text-[#A8B7CC]">Step 4</span>
              </div>

              {/* Upload Dropzone */}
              <div>
                <label className="block text-xs font-semibold text-[#A8B7CC] mb-2 uppercase tracking-wider">
                  Primary Vehicle Photography
                </label>

                {formData.image ? (
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 group bg-[#040d1a]">
                    <img
                      src={formData.image}
                      alt="Vehicle preview"
                      className="w-full h-56 sm:h-64 object-cover"
                      onError={(e) => { e.target.src = '/hero_sports_car.jpg' }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                      <label className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors backdrop-blur-md">
                        Change File
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="sr-only"
                          disabled={imageUploading}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="px-4 py-2 bg-rose-500/80 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        Remove Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-white/10 hover:border-[#2684FF]/50 rounded-2xl p-6 sm:p-8 text-center transition-all bg-[#061426]/50">
                    <div className="w-12 h-12 rounded-full bg-[#2684FF]/10 text-[#6BCBFF] flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <label className="cursor-pointer">
                      <span className="px-5 py-2.5 bg-gradient-to-r from-[#2684FF] to-[#1255CC] text-white rounded-xl text-xs font-bold inline-block hover:from-[#3a93ff] hover:to-[#1a65e0] transition-all shadow-[0_0_15px_rgba(38,132,255,0.3)]">
                        {imageUploading ? 'Uploading Image...' : 'Browse & Upload Photo'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                        disabled={imageUploading}
                      />
                    </label>
                    <p className="text-xs text-[#A8B7CC] mt-2">
                      PNG, JPG, WebP up to 12MB. Studio car photography recommended.
                    </p>
                  </div>
                )}

                {/* Direct URL input fallback */}
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={formData.directImageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, directImageUrl: e.target.value }))}
                    placeholder="Or paste direct image URL (https://... or /hero_sports_car.jpg)"
                    className="flex-1 px-3.5 py-2 bg-[#061426]/70 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#2684FF]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyDirectImageUrl}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors shrink-0"
                  >
                    Set URL
                  </button>
                </div>

                {/* Sample Presets */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-[#A8B7CC]">Quick Presets:</span>
                  {CAR_CONSTANTS.sampleImages.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: s.url, directImageUrl: s.url }))}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-[#2684FF]/20 border border-white/[0.08] text-[11px] text-[#A8B7CC] hover:text-[#6BCBFF] transition-all"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exterior Color Swatches */}
              <div>
                <label className="block text-xs font-semibold text-[#A8B7CC] mb-2 uppercase tracking-wider">
                  Exterior Color Finish
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {CAR_CONSTANTS.colors.map(col => (
                    <button
                      type="button"
                      key={col.value}
                      onClick={() => setFormData(prev => ({ ...prev, exteriorColor: col.value }))}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium transition-all ${
                        formData.exteriorColor === col.value
                          ? 'bg-[#2684FF]/20 border-[#2684FF] text-white shadow-[0_0_12px_rgba(38,132,255,0.3)]'
                          : 'bg-[#061426]/60 border-white/10 text-[#A8B7CC] hover:text-white'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/30 shrink-0"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span className="truncate">{col.value}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CARD 5: Features & Equipment (Enum Safe) */}
            <div className="glass-panel rounded-2xl p-5 sm:p-7 border border-[var(--border-color)] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Features &amp; Amenities</h3>
                    <p className="text-xs text-[#A8B7CC]">
                      {formData.features.length} selected of {ALLOWED_FEATURES.length} verified options
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={selectAllFeatures}
                    className="px-2.5 py-1 text-xs font-medium text-[#6BCBFF] hover:text-white transition-colors"
                  >
                    Select All
                  </button>
                  <span className="text-white/20">|</span>
                  <button
                    type="button"
                    onClick={clearAllFeatures}
                    className="px-2.5 py-1 text-xs font-medium text-[#A8B7CC] hover:text-rose-400 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {['All', 'Tech', 'Comfort', 'Safety'].map(cat => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setActiveFeatureTab(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      activeFeatureTab === cat
                        ? 'bg-[#2684FF] text-white shadow-sm'
                        : 'bg-[#061426]/80 text-[#A8B7CC] border border-white/10 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Feature Pills Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filteredFeatures.map(item => {
                  const isChecked = formData.features.includes(item.name)
                  return (
                    <button
                      type="button"
                      key={item.name}
                      onClick={() => toggleFeature(item.name)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all text-left ${
                        isChecked
                          ? 'bg-[#2684FF]/20 border-[#2684FF] text-white shadow-[0_0_12px_rgba(38,132,255,0.25)]'
                          : 'bg-[#061426]/60 border-white/[0.08] text-[#A8B7CC] hover:text-white hover:border-white/20'
                      }`}
                    >
                      <span className="truncate mr-2">{item.name}</span>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                        isChecked ? 'bg-[#2684FF] text-white' : 'border border-white/20'
                      }`}>
                        {isChecked && '✓'}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* CARD 6: Description */}
            <div className="glass-panel rounded-2xl p-5 sm:p-7 border border-[var(--border-color)] space-y-4">
              <div className="flex items-center gap-2.5 border-b border-white/[0.08] pb-3.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Vehicle Story &amp; Details</h3>
                  <p className="text-xs text-[#A8B7CC]">Highlight condition, maintenance history, and performance traits</p>
                </div>
              </div>

              <div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Describe vehicle condition, premium options, warranty status, and driving dynamics..."
                  className="w-full px-3.5 py-3 bg-[#061426]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#2684FF] transition-all"
                />
                <div className="flex justify-between text-[11px] text-[#A8B7CC] mt-1">
                  <span>Up to 1,000 characters</span>
                  <span>{formData.description.length} / 1000</span>
                </div>
              </div>
            </div>

            {/* Desktop Form Bottom Actions */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/[0.08]">
              <Link
                to="/admin/manage-cars"
                className="px-6 py-3 rounded-xl border border-white/10 text-[#A8B7CC] hover:text-white hover:bg-white/[0.05] transition-all font-semibold text-sm"
              >
                Cancel &amp; Return
              </Link>

              <button
                type="submit"
                disabled={isLoading || imageUploading}
                className="px-8 py-3 bg-gradient-to-r from-[#2684FF] to-[#1255CC] text-white rounded-xl hover:from-[#3a93ff] hover:to-[#1a65e0] transition-all duration-300 shadow-[0_0_25px_rgba(38,132,255,0.4)] font-bold text-sm flex items-center gap-2"
              >
                {isLoading ? 'Publishing Vehicle...' : isEditing ? 'Update Vehicle' : 'Register Vehicle to Fleet'}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Sticky Live AutoHub Marketplace Card Preview (Desktop) */}
        <div className="hidden lg:block lg:col-span-5 xl:col-span-4 sticky top-6 space-y-5">
          
          {/* Readiness Tracker */}
          <div className="glass-panel rounded-2xl p-4 border border-[var(--border-color)]">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-[#A8B7CC] font-semibold">Listing Readiness</span>
              <span className="font-extrabold text-[#6BCBFF]">{completionPercent}%</span>
            </div>
            <div className="w-full bg-[#061426] h-2 rounded-full overflow-hidden border border-white/[0.05]">
              <div 
                className="bg-gradient-to-r from-[#2684FF] to-[#6BCBFF] h-full transition-all duration-500 rounded-full"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>

          {/* Live AutoHub Card */}
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs uppercase tracking-wider font-extrabold text-[#6BCBFF]">
                Marketplace Preview
              </span>
              <span className="text-[11px] text-[#A8B7CC]">Live sync</span>
            </div>

            <div className="glass-panel-glow rounded-3xl overflow-hidden border border-[var(--border-color)] group transition-all duration-300">
              {/* Image banner */}
              <div className="relative h-48 bg-[#040d1a] overflow-hidden">
                <img
                  src={formData.image || '/hero_sports_car.jpg'}
                  alt="Car preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = '/hero_sports_car.jpg' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D33] via-transparent to-black/30 pointer-events-none" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#2684FF]/30 text-[#6BCBFF] border border-[#2684FF]/40 backdrop-blur-md">
                    {formData.condition}
                  </span>
                  {formData.isPopular && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/30 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                      Featured
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-black/60 text-white backdrop-blur-md border border-white/10">
                    {formData.category}
                  </span>
                </div>
              </div>

              {/* Details Body */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h4 className="text-lg font-bold text-white tracking-tight">
                      {formData.brand || 'Brand'} {formData.model || 'Model'}
                    </h4>
                    <p className="text-xs text-[#A8B7CC]">
                      {formData.year} • {formData.location || 'Showroom'}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    {formData.isForSale && formData.salePrice ? (
                      <>
                        <p className="text-xl font-extrabold text-[#6BCBFF]">
                          ${Number(formData.salePrice || 0).toLocaleString()}
                        </p>
                        <p className="text-[10px] text-[#A8B7CC]">Purchase</p>
                      </>
                    ) : (
                      <>
                        <p className="text-xl font-extrabold text-[#6BCBFF]">
                          ${formData.pricePerDay || '0'}
                        </p>
                        <p className="text-[10px] text-[#A8B7CC]">per day</p>
                      </>
                    )}
                  </div>
                </div>

                {/* 4 AutoHub Specs Strip */}
                <div className="grid grid-cols-4 gap-1.5 py-2 px-2.5 bg-[#061426]/70 rounded-xl border border-white/[0.06] text-center my-3">
                  <div>
                    <span className="text-[9px] text-[#A8B7CC] block uppercase">0-100</span>
                    <span className="text-xs font-extrabold text-white">{formData.zeroToSixty || '3.8'}s</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#A8B7CC] block uppercase">Speed</span>
                    <span className="text-xs font-extrabold text-white">{formData.topSpeed || '240'}k</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#A8B7CC] block uppercase">Power</span>
                    <span className="text-xs font-extrabold text-white">{formData.power || '400'}hp</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#A8B7CC] block uppercase">Fuel</span>
                    <span className="text-xs font-extrabold text-white truncate block">{formData.fuelType}</span>
                  </div>
                </div>

                {/* Selected Features Preview */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formData.features.slice(0, 4).map((f, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-white/[0.05] text-[10px] text-[#A8B7CC]">
                      {f}
                    </span>
                  ))}
                  {formData.features.length > 4 && (
                    <span className="px-2 py-0.5 rounded-md bg-[#2684FF]/20 text-[10px] text-[#6BCBFF] font-bold">
                      +{formData.features.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM ACTION BAR (Touch-friendly for iOS/Android) */}
      <div className="fixed lg:hidden bottom-0 inset-x-0 bg-[#061426]/95 backdrop-blur-xl border-t border-white/10 p-3.5 z-40 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setShowMobilePreview(true)}
          className="flex-1 py-3 px-4 rounded-xl border border-white/15 bg-white/[0.05] text-white text-xs font-bold transition-all text-center"
        >
          Preview Card
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || imageUploading}
          className="flex-2 py-3 px-6 bg-gradient-to-r from-[#2684FF] to-[#1255CC] text-white rounded-xl text-xs font-bold transition-all shadow-[0_0_20px_rgba(38,132,255,0.4)] flex items-center justify-center gap-2"
        >
          {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Publish Car'}
        </button>
      </div>

      {/* MOBILE PREVIEW MODAL */}
      {showMobilePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0B1D33] border border-[var(--border-color)] rounded-3xl p-5 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Marketplace Card Preview</h3>
              <button
                type="button"
                onClick={() => setShowMobilePreview(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#061426]">
              <img
                src={formData.image || '/hero_sports_car.jpg'}
                alt="Preview"
                className="w-full h-44 object-cover"
                onError={(e) => { e.target.src = '/hero_sports_car.jpg' }}
              />
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-white text-base">{formData.brand || 'Brand'} {formData.model || 'Model'}</p>
                    <p className="text-xs text-[#A8B7CC]">{formData.year} • {formData.location}</p>
                  </div>
                  <p className="font-extrabold text-[#6BCBFF] text-lg">
                    ${formData.salePrice || formData.pricePerDay || '0'}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowMobilePreview(false)}
              className="w-full py-2.5 rounded-xl bg-white/10 text-white font-semibold text-xs"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddCar