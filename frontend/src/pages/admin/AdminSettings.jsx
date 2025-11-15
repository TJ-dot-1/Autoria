import React, { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'
import { uploadAPI, adminAPI } from '../../utils/api'
import { getProfileImage } from '../../utils/imageHelpers'

const AdminSettings = () => {
  const { user, updateUser } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastSavedTab, setLastSavedTab] = useState(null)
  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    profileImage: '',
    bio: ''
  })
  
  const [settings, setSettings] = useState({
    general: {
      companyName: '',
      supportEmail: '',
      companyPhone: '',
      websiteUrl: '',
      companyAddress: '',
      timezone: 'Africa/Nairobi',
      currency: 'KES'
    },
    business: {
      operatingHours: {
        monday: { open: '08:00', close: '18:00', closed: false },
        tuesday: { open: '08:00', close: '18:00', closed: false },
        wednesday: { open: '08:00', close: '18:00', closed: false },
        thursday: { open: '08:00', close: '18:00', closed: false },
        friday: { open: '08:00', close: '18:00', closed: false },
        saturday: { open: '09:00', close: '16:00', closed: false },
        sunday: { open: '10:00', close: '14:00', closed: true }
      },
      minBookingDays: 1,
      maxBookingDays: 30,
      advanceBookingDays: 7,
      cancellationPolicy: 'Free cancellation up to 24 hours before pickup',
      lateFee: 50,
      gracePeriod: 30
    },
    notifications: {
      emailNotifications: {
        newBooking: true,
        bookingConfirmation: true,
        bookingCancellation: true,
        paymentReceived: true,
        systemAlerts: true,
        userRegistration: false
      },
      smsNotifications: {
        bookingReminders: true,
        paymentAlerts: true,
        systemUpdates: false
      },
      adminAlerts: {
        lowCarAvailability: true,
        paymentFailures: true,
        systemErrors: true,
        newUserRegistration: true
      }
    },
    security: {
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSymbols: true,
        expirationDays: 90
      },
      sessionManagement: {
        sessionTimeout: 60,
        maxConcurrentSessions: 3,
        requireTwoFactor: false
      },
      accessControl: {
        maxLoginAttempts: 5,
        lockoutDuration: 30,
        requireEmailVerification: true
      }
    },
    payments: {
      acceptedMethods: ['card', 'bank_transfer', 'mpesa', 'cash'],
      defaultPaymentMethod: 'card',
      depositRequired: true,
      depositPercentage: 25,
      autoRefund: true,
      processingFees: {
        card: 2.5,
        bank_transfer: 0,
        mpesa: 1.5,
        cash: 0
      }
    },
    booking: {
      autoConfirm: false,
      requireDriverLicense: true,
      requireInsurance: true,
      minDriverAge: 21,
      maxDriverAge: 75,
      allowOvernightBookings: true,
      bufferTime: 30
    }
  })
  const [isUploading, setIsUploading] = useState(false)

  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true)

      // Load settings from API
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('API timeout')), 5000)
        )
        const response = await Promise.race([
          adminAPI.getSettings(),
          timeoutPromise
        ])
        if (response && response.success && response.data) {
          setSettings(response.data)
          setIsLoading(false)
          return
        }
      } catch (apiError) {
        console.warn('API call failed:', apiError.message)
      }

      // If API fails, show error and keep default settings
      showNotification('Failed to load settings from server', 'error')

    } catch (error) {
      console.error('Error loading settings:', error)
      showNotification('Using default settings', 'info')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user) {
      // Only initialize if profile.firstName is still empty (initial state)
      setProfile(prev => {
        if (!prev.firstName) {
          console.log('Initializing profile from user:', user)
          return {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
            role: user.role || 'admin',
            profileImage: getProfileImage(user),
            bio: user.bio || ''
          }
        }
        return prev
      })
    }
  }, [user])

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  const saveSettings = async () => {
    try {
      setIsSubmitting(true)

      // Save to backend API
      const response = await adminAPI.updateSettings(settings)
      if (response.success) {
        // Also save to localStorage as backup
        localStorage.setItem('admin_settings', JSON.stringify(settings))
        showNotification('Settings saved successfully!')
        setLastSavedTab(activeTab)
        setTimeout(() => setLastSavedTab(null), 2000)
      } else {
        throw new Error(response.message || 'Failed to save settings')
      }

    } catch (error) {
      console.error('Error saving settings:', error)
      showNotification('Failed to save settings. Please try again.', 'error')

    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setIsSubmitting(true)
      console.log('Saving profile:', profile)

      // Prepare profile data, clean phone number
      const profileData = {
        ...profile,
        phone: profile.phone ? profile.phone.replace(/\s+/g, '') : profile.phone
      }

      // Update profile via admin API
      const response = await adminAPI.updateProfile(profileData)
      if (response.success) {
        console.log('Profile saved successfully:', response.data)
        updateUser(response.data)
        showNotification('Profile saved successfully!')
        setLastSavedTab('profile')
        setTimeout(() => setLastSavedTab(null), 2000)
      } else {
        throw new Error(response.message || 'Failed to save profile')
      }

    } catch (error) {
      console.error('Error saving profile:', error)
      showNotification('Error saving profile. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showNotification('Please select an image file', 'error')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotification('File size must be less than 5MB', 'error')
      return
    }

    try {
      setIsUploading(true)
      
      // Upload image to Cloudinary
      const uploadResponse = await uploadAPI.uploadImage(file)
      
      if (uploadResponse.success && uploadResponse.data) {
        // Get the Cloudinary URL (secure_url for HTTPS)
        const newImageUrl = uploadResponse.data.secure_url || uploadResponse.data.url
        
        // Update local profile state immediately
        setProfile(prev => ({
          ...prev,
          profileImage: newImageUrl
        }))
        
        // Save profile with new image to backend
        try {
          const profileUpdateResponse = await adminAPI.updateProfile({
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            phone: profile.phone,
            bio: profile.bio,
            profileImage: newImageUrl
          })
          
          if (profileUpdateResponse.success) {
            // Update auth context with new user data
            updateUser({
              ...user,
              profileImage: newImageUrl,
              ...profileUpdateResponse.data
            })
            showNotification('Profile image uploaded and saved successfully!')
          } else {
            showNotification('Image uploaded but profile save failed. Please save profile manually.', 'warning')
          }
        } catch (updateError) {
          console.warn('Profile update failed, but image was uploaded to Cloudinary:', updateError)
          showNotification('Image uploaded to Cloudinary. Profile update may need retry.', 'warning')
        }
      } else {
        throw new Error(uploadResponse.message || 'Upload failed')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      showNotification('Error uploading image. Please try again.', 'error')
    } finally {
      setIsUploading(false)
    }
  }

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  // Handle simple nested changes
  const handleNestedInputChange = (section, parentField, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parentField]: {
          ...prev[section][parentField],
          [field]: value
        }
      }
    }))
  }

  // Handle complex nested objects like operatingHours
  const handleComplexNestedInputChange = (section, parentField, day, newDayData) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parentField]: {
          ...prev[section][parentField],
          [day]: newDayData
        }
      }
    }))
  }

  const handleProfileChange = (field, value) => {
    console.log('handleProfileChange called:', field, value)
    setProfile(prev => {
      const updated = {
        ...prev,
        [field]: value
      }
      console.log('Profile state updated:', updated)
      return updated
    })
  }

  const showNotification = (message, type = 'success') => {
    if (type === 'success') {
      toast.success(message)
    } else if (type === 'warning') {
      toast(message, { icon: '⚠️' })
    } else if (type === 'error') {
      toast.error(message)
    } else {
      toast(message)
    }
  }

  const TabButton = ({ id, label, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 w-full ${
        isActive
          ? 'bg-blue-600 text-white shadow-md'
          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] border border-transparent'
      }`}
    >
      {label}
    </button>
  )

  const SettingField = ({ label, children, description }) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
        {label}
      </label>
      {children}
      {description && (
        <p className="text-xs text-[var(--text-secondary)] mt-1">{description}</p>
      )}
    </div>
  )

  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-[var(--text-primary)]">{label}</span>
        {description && (
          <span className="text-xs text-[var(--text-secondary)] mt-1">{description}</span>
        )}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-[var(--border-color)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--bg-primary)] after:border-[var(--border-color)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-[var(--bg-primary)] rounded-2xl shadow-sm p-6 border border-[var(--border-color)]">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">System Settings</h1>
          <p className="text-[var(--text-secondary)] mt-2">Configure your car rental business settings</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--bg-primary)] rounded-2xl shadow-sm border border-[var(--border-color)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border-color)]">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Settings Categories</h3>
            </div>
            <div className="p-4 space-y-2">
              <TabButton
                id="profile"
                label="My Profile"
                isActive={activeTab === 'profile'}
                onClick={setActiveTab}
              />
              <TabButton
                id="general"
                label="General"
                isActive={activeTab === 'general'}
                onClick={setActiveTab}
              />
              <TabButton
                id="business"
                label="Business"
                isActive={activeTab === 'business'}
                onClick={setActiveTab}
              />
              <TabButton
                id="notifications"
                label="Notifications"
                isActive={activeTab === 'notifications'}
                onClick={setActiveTab}
              />
              <TabButton
                id="security"
                label="Security"
                isActive={activeTab === 'security'}
                onClick={setActiveTab}
              />
              <TabButton
                id="payments"
                label="Payments"
                isActive={activeTab === 'payments'}
                onClick={setActiveTab}
              />
              <TabButton
                id="booking"
                label="Booking Rules"
                isActive={activeTab === 'booking'}
                onClick={setActiveTab}
              />
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-[var(--bg-primary)] rounded-2xl shadow-sm p-6 border border-[var(--border-color)]">
            {activeTab === 'profile' && (
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">My Profile</h3>
                
                {/* Profile Picture Section */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Profile Picture</h4>
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <img
                        src={getProfileImage(profile)}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-[var(--border-color)] shadow-sm"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.firstName || 'Admin')}+${encodeURIComponent(profile.lastName || 'User')}&background=3B82F6&color=fff`;
                        }}
                      />
                      {isUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block shadow-sm">
                        {isUploading ? 'Uploading...' : 'Change Photo'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={isUploading}
                        />
                      </label>
                      <p className="text-sm text-[var(--text-secondary)] mt-2">
                        JPG, PNG or GIF. Max size 5MB.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Profile Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SettingField label="First Name">
                    <input
                      type="text"
                      autoComplete="given-name"
                      placeholder="Enter your first name"
                      value={profile.firstName || ''}
                      onChange={(e) => handleProfileChange('firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                      style={{ pointerEvents: 'auto', cursor: 'text' }}
                    />
                  </SettingField>
                  
                  <SettingField label="Last Name">
                    <input
                      type="text"
                      autoComplete="family-name"
                      placeholder="Enter your last name"
                      value={profile.lastName || ''}
                      onChange={(e) => handleProfileChange('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                      style={{ pointerEvents: 'auto', cursor: 'text' }}
                    />
                  </SettingField>
                  
                  <SettingField label="Email">
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder="Enter your email address"
                      value={profile.email || ''}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                      style={{ pointerEvents: 'auto', cursor: 'text' }}
                    />
                  </SettingField>
                  
                  <SettingField label="Phone">
                    <input
                      type="tel"
                      autoComplete="tel"
                      placeholder="Enter your phone number"
                      value={profile.phone || ''}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-[var(--bg-primary)] text-[var(--text-primary)]"
                      style={{ pointerEvents: 'auto', cursor: 'text' }}
                    />
                  </SettingField>
                </div>
                
                <SettingField label="Bio">
                  <textarea
                    value={profile.bio || ''}
                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  />
                </SettingField>
                
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all shadow-sm"
                  >
                    {isSubmitting ? 'Saving...' : lastSavedTab === 'profile' ? '✓ Saved!' : 'Save Profile'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'general' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">General Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SettingField label="Company Name">
                    <input
                      type="text"
                      value={settings.general.companyName}
                      onChange={(e) => handleInputChange('general', 'companyName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </SettingField>
                  
                  <SettingField label="Support Email">
                    <input
                      type="email"
                      value={settings.general.supportEmail}
                      onChange={(e) => handleInputChange('general', 'supportEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </SettingField>
                  
                  <SettingField label="Phone Number">
                    <input
                      type="tel"
                      value={settings.general.companyPhone}
                      onChange={(e) => handleInputChange('general', 'companyPhone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </SettingField>
                  
                  <SettingField label="Website URL">
                    <input
                      type="url"
                      value={settings.general.websiteUrl}
                      onChange={(e) => handleInputChange('general', 'websiteUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </SettingField>
                </div>
                
                <SettingField label="Company Address">
                  <textarea
                    value={settings.general.companyAddress}
                    onChange={(e) => handleInputChange('general', 'companyAddress', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </SettingField>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SettingField label="Timezone">
                    <select
                      value={settings.general.timezone}
                      onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                      <option value="UTC">UTC</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                    </select>
                  </SettingField>
                  
                  <SettingField label="Default Currency">
                    <select
                      value={settings.general.currency}
                      onChange={(e) => handleInputChange('general', 'currency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="KES">Kenyan Shilling (KES)</option>
                      <option value="USD">US Dollar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                    </select>
                  </SettingField>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={saveSettings}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors shadow-sm"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'business' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Business Settings</h3>
                
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Operating Hours</h4>
                  <div className="space-y-4">
                    {Object.entries(settings.business.operatingHours).map(([day, hours]) => (
                      <div key={day} className="flex items-center space-x-4">
                        <div className="w-24">
                          <label className="text-sm font-medium text-gray-700 capitalize">{day}</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={!hours.closed}
                            onChange={(e) => handleComplexNestedInputChange('business', 'operatingHours', day, {
                              ...hours,
                              closed: !e.target.checked
                            })}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-600">Open</span>
                        </div>
                        {!hours.closed && (
                          <>
                            <input
                              type="time"
                              value={hours.open}
                              onChange={(e) => handleComplexNestedInputChange('business', 'operatingHours', day, {
                                ...hours,
                                open: e.target.value
                              })}
                              className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                            <span className="text-gray-500">to</span>
                            <input
                              type="time"
                              value={hours.close}
                              onChange={(e) => handleComplexNestedInputChange('business', 'operatingHours', day, {
                                ...hours,
                                close: e.target.value
                              })}
                              className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <SettingField
                    label="Minimum Booking Days"
                    description="Minimum number of days for a booking"
                  >
                    <input
                      type="number"
                      min="1"
                      value={settings.business.minBookingDays}
                      onChange={(e) => handleInputChange('business', 'minBookingDays', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </SettingField>

                  <SettingField
                    label="Maximum Booking Days"
                    description="Maximum number of days for a booking"
                  >
                    <input
                      type="number"
                      min="1"
                      value={settings.business.maxBookingDays}
                      onChange={(e) => handleInputChange('business', 'maxBookingDays', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </SettingField>

                  <SettingField
                    label="Advance Booking Days"
                    description="How many days in advance customers can book"
                  >
                    <input
                      type="number"
                      min="0"
                      value={settings.business.advanceBookingDays}
                      onChange={(e) => handleInputChange('business', 'advanceBookingDays', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </SettingField>

                  <SettingField
                    label="Late Fee (KES)"
                    description="Fee charged for late returns"
                  >
                    <input
                      type="number"
                      min="0"
                      value={settings.business.lateFee}
                      onChange={(e) => handleInputChange('business', 'lateFee', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </SettingField>

                  <SettingField
                    label="Grace Period (Minutes)"
                    description="Grace period before late fees apply"
                  >
                    <input
                      type="number"
                      min="0"
                      value={settings.business.gracePeriod}
                      onChange={(e) => handleInputChange('business', 'gracePeriod', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </SettingField>
                </div>
                
                <SettingField 
                  label="Cancellation Policy"
                  description="Cancellation policy displayed to customers"
                >
                  <textarea
                    value={settings.business.cancellationPolicy}
                    onChange={(e) => handleInputChange('business', 'cancellationPolicy', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </SettingField>
                
                <div className="flex justify-end">
                  <button
                    onClick={saveSettings}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all shadow-sm"
                  >
                    {isSubmitting ? 'Saving...' : lastSavedTab === 'business' ? '✓ Saved!' : 'Save Settings'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Notification Settings</h3>
                
                <div className="space-y-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h4>
                    <div className="space-y-2">
                      {Object.entries(settings.notifications.emailNotifications).map(([key, enabled]) => (
                        <ToggleSwitch
                          key={key}
                          checked={enabled}
                          onChange={(e) => handleNestedInputChange('notifications', 'emailNotifications', key, e.target.checked)}
                          label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">SMS Notifications</h4>
                    <div className="space-y-2">
                      {Object.entries(settings.notifications.smsNotifications).map(([key, enabled]) => (
                        <ToggleSwitch
                          key={key}
                          checked={enabled}
                          onChange={(e) => handleNestedInputChange('notifications', 'smsNotifications', key, e.target.checked)}
                          label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Admin Alerts</h4>
                    <div className="space-y-2">
                      {Object.entries(settings.notifications.adminAlerts).map(([key, enabled]) => (
                        <ToggleSwitch
                          key={key}
                          checked={enabled}
                          onChange={(e) => handleNestedInputChange('notifications', 'adminAlerts', key, e.target.checked)}
                          label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={saveSettings}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all shadow-sm"
                  >
                    {isSubmitting ? 'Saving...' : lastSavedTab === 'notifications' ? '✓ Saved!' : 'Save Settings'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h3>
                
                <div className="space-y-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Password Policy</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <SettingField label="Minimum Password Length">
                        <input
                          type="number"
                          min="6"
                          max="32"
                          value={settings.security.passwordPolicy.minLength}
                          onChange={(e) => handleNestedInputChange('security', 'passwordPolicy', 'minLength', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </SettingField>

                      <SettingField label="Password Expiration (Days)">
                        <input
                          type="number"
                          min="0"
                          value={settings.security.passwordPolicy.expirationDays}
                          onChange={(e) => handleNestedInputChange('security', 'passwordPolicy', 'expirationDays', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </SettingField>
                    </div>
                    
                    <div className="space-y-2">
                      {[
                        { key: 'requireUppercase', label: 'Require Uppercase Letters' },
                        { key: 'requireLowercase', label: 'Require Lowercase Letters' },
                        { key: 'requireNumbers', label: 'Require Numbers' },
                        { key: 'requireSymbols', label: 'Require Special Characters' }
                      ].map(({ key, label }) => (
                        <ToggleSwitch
                          key={key}
                          checked={settings.security.passwordPolicy[key]}
                          onChange={(e) => handleNestedInputChange('security', 'passwordPolicy', key, e.target.checked)}
                          label={label}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Session Management</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <SettingField label="Session Timeout (Minutes)">
                        <input
                          type="number"
                          min="5"
                          max="480"
                          value={settings.security.sessionManagement.sessionTimeout}
                          onChange={(e) => handleNestedInputChange('security', 'sessionManagement', 'sessionTimeout', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </SettingField>

                      <SettingField label="Max Concurrent Sessions">
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={settings.security.sessionManagement.maxConcurrentSessions}
                          onChange={(e) => handleNestedInputChange('security', 'sessionManagement', 'maxConcurrentSessions', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </SettingField>
                    </div>
                    
                    <ToggleSwitch
                      checked={settings.security.sessionManagement.requireTwoFactor}
                      onChange={(e) => handleNestedInputChange('security', 'sessionManagement', 'requireTwoFactor', e.target.checked)}
                      label="Require Two-Factor Authentication"
                      description="Add an extra layer of security to your account"
                    />
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Access Control</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <SettingField label="Max Login Attempts">
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={settings.security.accessControl.maxLoginAttempts}
                          onChange={(e) => handleNestedInputChange('security', 'accessControl', 'maxLoginAttempts', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </SettingField>

                      <SettingField label="Lockout Duration (Minutes)">
                        <input
                          type="number"
                          min="1"
                          max="1440"
                          value={settings.security.accessControl.lockoutDuration}
                          onChange={(e) => handleNestedInputChange('security', 'accessControl', 'lockoutDuration', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </SettingField>
                    </div>

                    <ToggleSwitch
                      checked={settings.security.accessControl.requireEmailVerification}
                      onChange={(e) => handleNestedInputChange('security', 'accessControl', 'requireEmailVerification', e.target.checked)}
                      label="Require Email Verification"
                      description="Users must verify their email before accessing the system"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={saveSettings}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all shadow-sm"
                  >
                    {isSubmitting ? 'Saving...' : lastSavedTab === 'security' ? '✓ Saved!' : 'Save Settings'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Settings</h3>
                
                <div className="space-y-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Accepted Payment Methods</h4>
                    <div className="space-y-2">
                      {settings.payments.acceptedMethods.map((method) => (
                        <ToggleSwitch
                          key={method}
                          checked={settings.payments.acceptedMethods.includes(method)}
                          onChange={(e) => {
                            const methods = e.target.checked
                              ? [...settings.payments.acceptedMethods, method]
                              : settings.payments.acceptedMethods.filter(m => m !== method)
                            handleInputChange('payments', 'acceptedMethods', methods)
                          }}
                          label={method.replace('_', ' ').toUpperCase()}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SettingField label="Default Payment Method">
                      <select
                        value={settings.payments.defaultPaymentMethod}
                        onChange={(e) => handleInputChange('payments', 'defaultPaymentMethod', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="card">Credit/Debit Card</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="mpesa">M-Pesa</option>
                        <option value="cash">Cash</option>
                      </select>
                    </SettingField>
                    
                    <SettingField label="Deposit Percentage (%)">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={settings.payments.depositPercentage}
                        onChange={(e) => handleInputChange('payments', 'depositPercentage', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </SettingField>
                  </div>

                  <div className="space-y-2">
                    <ToggleSwitch
                      checked={settings.payments.depositRequired}
                      onChange={(e) => handleInputChange('payments', 'depositRequired', e.target.checked)}
                      label="Require Deposit"
                      description="Require a deposit payment before booking confirmation"
                    />

                    <ToggleSwitch
                      checked={settings.payments.autoRefund}
                      onChange={(e) => handleInputChange('payments', 'autoRefund', e.target.checked)}
                      label="Auto Refund"
                      description="Automatically refund deposits when booking is completed successfully"
                    />
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Processing Fees (%)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(settings.payments.processingFees).map(([method, fee]) => (
                        <SettingField key={method} label={`${method.replace('_', ' ').toUpperCase()} Fee`}>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={fee}
                            onChange={(e) => handleNestedInputChange('payments', 'processingFees', method, e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          />
                        </SettingField>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={saveSettings}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all shadow-sm"
                  >
                    {isSubmitting ? 'Saving...' : lastSavedTab === 'payments' ? '✓ Saved!' : 'Save Settings'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'booking' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Booking Rules</h3>
                
                <div className="space-y-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Driver Requirements</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <SettingField label="Minimum Driver Age">
                        <input
                          type="number"
                          min="18"
                          max="100"
                          value={settings.booking.minDriverAge}
                          onChange={(e) => handleInputChange('booking', 'minDriverAge', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </SettingField>

                      <SettingField label="Maximum Driver Age">
                        <input
                          type="number"
                          min="18"
                          max="100"
                          value={settings.booking.maxDriverAge}
                          onChange={(e) => handleInputChange('booking', 'maxDriverAge', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </SettingField>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Booking Options</h4>
                    <div className="space-y-2">
                      <ToggleSwitch
                        checked={settings.booking.autoConfirm}
                        onChange={(e) => handleInputChange('booking', 'autoConfirm', e.target.checked)}
                        label="Auto-confirm bookings"
                        description="Automatically confirm bookings without manual review"
                      />
                      
                      <ToggleSwitch
                        checked={settings.booking.requireDriverLicense}
                        onChange={(e) => handleInputChange('booking', 'requireDriverLicense', e.target.checked)}
                        label="Require Driver's License"
                        description="Customers must provide driver's license number"
                      />
                      
                      <ToggleSwitch
                        checked={settings.booking.requireInsurance}
                        onChange={(e) => handleInputChange('booking', 'requireInsurance', e.target.checked)}
                        label="Require Insurance"
                        description="Insurance coverage required for all bookings"
                      />
                      
                      <ToggleSwitch
                        checked={settings.booking.allowOvernightBookings}
                        onChange={(e) => handleInputChange('booking', 'allowOvernightBookings', e.target.checked)}
                        label="Allow Overnight Bookings"
                        description="Enable 24-hour booking periods"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SettingField
                      label="Buffer Time (Minutes)"
                      description="Time between bookings for cleaning and maintenance"
                    >
                      <input
                        type="number"
                        min="0"
                        max="120"
                        value={settings.booking.bufferTime}
                        onChange={(e) => handleInputChange('booking', 'bufferTime', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </SettingField>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={saveSettings}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all shadow-sm"
                  >
                    {isSubmitting ? 'Saving...' : lastSavedTab === 'booking' ? '✓ Saved!' : 'Save Settings'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSettings