import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Title from '../../components/Title'
import { carsAPI } from '../../utils/api'

const AddCar = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = !!id
  const [isLoading, setIsLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [formData, setFormData] = useState({
    // Basic Information
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    category: '',
    type: '',
    
    // Specifications
    seatingCapacity: 4,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    doors: 4,
    
    // Pricing & Location
    pricePerDay: '',
    location: '',
    
    // Appearance
    exteriorColor: 'White',
    
    // Description & Features
    description: '',
    features: [],
    featureInput: '',
    
    // Image
    image: null,
    imagePublicId: null,
    imageProvider: null,
    
    // Availability
    isAvailable: true
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

          // Map backend data to form data
          setFormData({
            brand: car.brand || '',
            model: car.model || '',
            year: car.year || new Date().getFullYear(),
            category: car.category || '',
            type: car.type || '',
            seatingCapacity: car.seatingCapacity || 4,
            fuelType: car.fuelType || 'Gasoline',
            transmission: car.transmission || 'Automatic',
            doors: car.doors || 4,
            pricePerDay: car.pricePerDay || '',
            location: car.location || '',
            description: car.description || '',
            features: car.features || [],
            featureInput: '',
            image: car.images?.[0]?.url || null,
            imagePublicId: car.images?.[0]?.filename || null,
            imageProvider: car.images?.[0]?.provider || null,
            exteriorColor: car.color?.exterior || 'White',
            isAvailable: car.isAvailable !== false
          })
        } catch (error) {
          setSubmitError('Failed to load car data')
          console.error('Error loading car:', error)
        } finally {
          setIsLoading(false)
        }
      }

      loadCarData()
    }
  }, [isEditing, id])

  // Constants
  const CAR_CONSTANTS = {
    fuelTypes: ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid', 'CNG', 'LPG'],
    transmissions: ['Manual', 'Automatic', 'Semi-Automatic'],
    types: ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Wagon', 'Van', 'Truck'],
    categories: [
      'Economy', 'Compact', 'Mid-size', 'Full-size', 'Luxury',
      'SUV', 'Compact SUV', 'Mid-size SUV', 'Full-size SUV',
      'Electric', 'Hybrid', 'Sports', 'Convertible', 'Van', 'Truck'
    ],
    colors: ['White', 'Black', 'Silver', 'Gray', 'Red', 'Blue', 'Green', 'Brown', 'Gold', 'Orange', 'Yellow', 'Purple'],
    seatingRange: { min: 1, max: 12 },
    doorsRange: { min: 2, max: 6 },
    yearRange: { min: 2000, max: new Date().getFullYear() + 2 },
    priceRange: { min: 1 }
  }

  const clearError = useCallback((fieldName) => {
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }))
    }
  }, [errors])

  // Input handlers
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    clearError(name)
  }, [clearError])

  const handleNumberInput = useCallback((name, value) => {
    // Allow empty string or valid numbers only
    if (value === '' || (!isNaN(Number(value)) && isFinite(Number(value)))) {
      const numValue = value === '' ? '' : Number(value)
      setFormData(prev => ({ ...prev, [name]: numValue }))
    }
    clearError(name)
  }, [clearError])

  // Features management
  const addFeature = () => {
    const trimmedInput = formData.featureInput.trim()
    if (trimmedInput) {
      // Split by comma and process each feature
      const newFeatures = trimmedInput.split(',')
        .map(feature => feature.trim())
        .filter(feature => feature && !formData.features.includes(feature))

      if (newFeatures.length > 0) {
        setFormData(prev => ({
          ...prev,
          features: [...prev.features, ...newFeatures],
          featureInput: ''
        }))
      }
    }
  }

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const handleFeatureKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addFeature()
    }
  }

  const handleKeyDown = (e) => {
    // Allow Enter in textarea and feature input, prevent in other inputs
    const isTextArea = e.target.tagName === 'TEXTAREA'
    const isFeatureInput = e.target.name === 'featureInput'

    if (e.key === 'Enter' && !isTextArea && !isFeatureInput) {
      e.preventDefault()
    }
  }

  // Image handling
  const uploadImage = async (file) => {
    const formData = new FormData()
    formData.append('image', file)
    
    const token = localStorage.getItem('autoria_token')
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    if (!response.ok) {
      throw new Error('Failed to upload image')
    }

    return await response.json()
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validation
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }))
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image size must be less than 10MB' }))
      return
    }

    setImageUploading(true)
    clearError('image')

    try {
      const uploadResult = await uploadImage(file)
      let imageUrl = uploadResult.data.url
      
      // Ensure absolute URL
      if (!/^https?:\/\//i.test(imageUrl)) {
        imageUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${imageUrl}`
      }

      setFormData(prev => ({
        ...prev,
        image: imageUrl,
        imagePublicId: uploadResult.data.filename || null,
        imageProvider: uploadResult.data.provider || null
      }))
    } catch {
      setErrors(prev => ({
        ...prev,
        image: 'Failed to upload image. Please try again.'
      }))
    } finally {
      setImageUploading(false)
    }
  }

  const removeImage = async () => {
    if (formData.image && formData.imagePublicId) {
      try {
        const token = localStorage.getItem('autoria_token')
        await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/upload/image/${formData.imagePublicId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      } catch (err) {
        console.error('Error deleting image:', err)
      }
    }
    
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePublicId: null,
      imageProvider: null
    }))
  }

  // Form validation
  const validateForm = () => {
    const newErrors = {}
    
    // Required fields validation
    const requiredFields = {
      brand: 'Brand is required',
      model: 'Model is required',
      category: 'Category is required',
      type: 'Car type is required',
      fuelType: 'Fuel type is required',
      transmission: 'Transmission is required',
      location: 'Location is required',
      description: 'Description is required',
      exteriorColor: 'Exterior color is required'
    }

    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!formData[field]?.toString().trim()) {
        newErrors[field] = message
      }
    })

    // Numeric fields validation
    if (!formData.pricePerDay || formData.pricePerDay <= 0) {
      newErrors.pricePerDay = 'Valid price is required'
    }

    if (!formData.doors || formData.doors < CAR_CONSTANTS.doorsRange.min) {
      newErrors.doors = 'Valid number of doors is required'
    }

    if (!formData.seatingCapacity || formData.seatingCapacity < CAR_CONSTANTS.seatingRange.min) {
      newErrors.seatingCapacity = 'Valid seating capacity is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Form submission
  const mapFormDataToBackend = () => {
    return {
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      year: Number(formData.year),
      category: formData.category,
      type: formData.type,
      pricePerDay: Number(formData.pricePerDay),
      fuelType: formData.fuelType,
      transmission: formData.transmission,
      seatingCapacity: Number(formData.seatingCapacity),
      doors: Number(formData.doors),
      location: formData.location.trim(),
      description: formData.description.trim(),
      features: formData.features,
      isAvailable: formData.isAvailable,
      color: {
        exterior: formData.exteriorColor,
        interior: 'Black' // Default interior color
      },
      images: formData.image ? [{
        url: formData.image,
        isPrimary: true
      }] : []
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setSubmitError('')

    try {
      const backendData = mapFormDataToBackend()

      if (isEditing) {
        await carsAPI.update(id, backendData)
      } else {
        await carsAPI.create(backendData)
      }

      // Reset form only for add mode
      if (!isEditing) {
        setFormData({
          brand: '',
          model: '',
          year: new Date().getFullYear(),
          category: '',
          type: '',
          seatingCapacity: 4,
          fuelType: 'Gasoline',
          transmission: 'Automatic',
          pricePerDay: '',
          location: '',
          description: '',
          features: [],
          featureInput: '',
          image: null,
          imagePublicId: null,
          imageProvider: null,
          doors: 4,
          exteriorColor: 'White',
          isAvailable: true
        })
      }
      setErrors({})

      navigate('/admin/manage-cars')
    } catch (error) {
      setSubmitError(error.message || `Failed to ${isEditing ? 'update' : 'create'} car. Please try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  // Reusable form field components
  const InputField = ({ label, name, type = 'text', value, onChange, error, placeholder, required = false, min, max, step }) => (
    <div>
      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
        {label} {required && '*'}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        className={`block w-full px-3 py-2 border ${
          error ? 'border-red-300' : 'border-[var(--border-color)]'
        } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors bg-[var(--bg-primary)] text-[var(--text-primary)]`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )

  const SelectField = ({ label, name, value, onChange, error, options, required = false }) => (
    <div>
      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
        {label} {required && '*'}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`block w-full px-3 py-2 border ${
          error ? 'border-red-300' : 'border-[var(--border-color)]'
        } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors bg-[var(--bg-primary)] text-[var(--text-primary)]`}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )

  const TextAreaField = ({ label, name, value, onChange, error, placeholder, required = false, rows = 4 }) => (
    <div>
      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
        {label} {required && '*'}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className={`block w-full px-3 py-2 border ${
          error ? 'border-red-300' : 'border-[var(--border-color)]'
        } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors bg-[var(--bg-primary)] text-[var(--text-primary)]`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )

  return (
    <div className="space-y-6">
      <Title
        title={isEditing ? "Edit Car" : "Add New Car"}
        subtitle={isEditing ? "Update vehicle information" : "Register a new vehicle to your fleet"}
      />

      <div className="bg-[var(--bg-primary)] rounded-2xl shadow-sm p-8 border border-[var(--border-color)]">
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} key={isEditing ? `edit-${id}` : 'add'} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <InputField
                    label="Brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    error={errors.brand}
                    placeholder="e.g., BMW, Toyota, Honda"
                    required
                  />

                  <InputField
                    label="Model"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    error={errors.model}
                    placeholder="e.g., X5, Camry, Civic"
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      label="Year"
                      name="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => handleNumberInput('year', e.target.value)}
                      min={CAR_CONSTANTS.yearRange.min}
                      max={CAR_CONSTANTS.yearRange.max}
                    />

                    <InputField
                      label="Seating Capacity"
                      name="seatingCapacity"
                      type="number"
                      value={formData.seatingCapacity}
                      onChange={(e) => handleNumberInput('seatingCapacity', e.target.value)}
                      error={errors.seatingCapacity}
                      min={CAR_CONSTANTS.seatingRange.min}
                      max={CAR_CONSTANTS.seatingRange.max}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Specifications</h3>
                <div className="space-y-4">
                  <SelectField
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    error={errors.category}
                    options={CAR_CONSTANTS.categories}
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <SelectField
                      label="Fuel Type"
                      name="fuelType"
                      value={formData.fuelType}
                      onChange={handleInputChange}
                      error={errors.fuelType}
                      options={CAR_CONSTANTS.fuelTypes}
                      required
                    />

                    <SelectField
                      label="Transmission"
                      name="transmission"
                      value={formData.transmission}
                      onChange={handleInputChange}
                      error={errors.transmission}
                      options={CAR_CONSTANTS.transmissions}
                      required
                    />
                  </div>

                  <SelectField
                    label="Car Type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    error={errors.type}
                    options={CAR_CONSTANTS.types}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Pricing & Location */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Pricing & Location</h3>
                <div className="space-y-4">
                  <InputField
                    label="Price Per Day ($)"
                    name="pricePerDay"
                    type="number"
                    value={formData.pricePerDay}
                    onChange={(e) => handleNumberInput('pricePerDay', e.target.value)}
                    error={errors.pricePerDay}
                    placeholder="e.g., 299.99"
                    min={CAR_CONSTANTS.priceRange.min}
                    step="0.01"
                    required
                  />

                  <InputField
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    error={errors.location}
                    placeholder="e.g., Nairobi, Mombasa"
                    required
                  />

                  <InputField
                    label="Number of Doors"
                    name="doors"
                    type="number"
                    value={formData.doors}
                    onChange={(e) => handleNumberInput('doors', e.target.value)}
                    error={errors.doors}
                    min={CAR_CONSTANTS.doorsRange.min}
                    max={CAR_CONSTANTS.doorsRange.max}
                    required
                  />
                </div>
              </div>

              {/* Color */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Color</h3>
                <SelectField
                  label="Exterior Color"
                  name="exteriorColor"
                  value={formData.exteriorColor}
                  onChange={handleInputChange}
                  error={errors.exteriorColor}
                  options={CAR_CONSTANTS.colors}
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Car Image</h3>
                <div className="border-2 border-dashed border-[var(--border-color)] rounded-lg p-6 text-center hover:border-primary transition-colors bg-[var(--bg-secondary)]">
                  {formData.image ? (
                    <div className="space-y-4">
                      <img
                        src={formData.image}
                        alt="Car preview"
                        className="w-full max-w-xs mx-auto rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                      >
                        Remove image
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <div>
                        <label className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-[var(--text-primary)]">
                            {imageUploading ? 'Uploading...' : 'Upload car image'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="sr-only"
                            disabled={imageUploading}
                          />
                        </label>
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">
                          PNG, JPG, GIF up to 10MB
                        </p>
                        {errors.image && (
                          <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <TextAreaField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                error={errors.description}
                placeholder="Describe the car's features, condition, and any special notes..."
                required
              />

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Features
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    name="featureInput"
                    value={formData.featureInput}
                    onChange={handleInputChange}
                    onKeyPress={handleFeatureKeyPress}
                    placeholder="e.g., Leather Seats, Sunroof, ABS, Power Steering (separate with commas)"
                    className="flex-1 px-3 py-2 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors bg-[var(--bg-primary)] text-[var(--text-primary)]"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
                  >
                    Add
                  </button>
                </div>
                {formData.features.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-blue-600 hover:text-blue-900 font-bold transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Availability */}
              <div className="flex items-center p-3 bg-[var(--bg-secondary)] rounded-lg">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-[var(--border-color)] rounded"
                />
                <span className="ml-2 text-sm text-[var(--text-primary)]">
                  Make car available for booking immediately
                </span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error Creating Car
                  </h3>
                  <p className="mt-1 text-sm text-red-700">{submitError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-[var(--border-color)]">
            <button
              type="button"
              onClick={() => navigate('/admin/manage-cars')}
              className="px-6 py-3 border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                isLoading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary-dark shadow-lg hover:shadow-xl transform hover:scale-105'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Car...
                </div>
              ) : (
                isEditing ? 'Update Car' : 'Add Car'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCar