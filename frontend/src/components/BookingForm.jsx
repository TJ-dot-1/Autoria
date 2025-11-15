import React, { useState } from 'react';
import { bookingsAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { scrollToTop } from '../utils/scrollToTop';

const BookingForm = ({ car, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    pickupLocation: car?.location || '',
    returnLocation: car?.location || '',
    driver: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dateOfBirth: '',
      driversLicense: {
        number: '',
        state: '',
        expiryDate: ''
      },
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      isSameAsBooker: true
    },
    payment: {
      method: 'Credit Card'
    }
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    if (!formData.pickupLocation) newErrors.pickupLocation = 'Pickup location is required';
    if (!formData.returnLocation) newErrors.returnLocation = 'Return location is required';

    if (!formData.driver.firstName) newErrors.driverFirstName = 'Driver first name is required';
    if (!formData.driver.lastName) newErrors.driverLastName = 'Driver last name is required';
    if (!formData.driver.email) newErrors.driverEmail = 'Driver email is required';
    if (!formData.driver.phone) newErrors.driverPhone = 'Driver phone is required';
    if (!formData.driver.dateOfBirth) newErrors.driverDateOfBirth = 'Date of birth is required';
    if (formData.driver.dateOfBirth) {
      const birthDate = new Date(formData.driver.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 21) {
        newErrors.driverDateOfBirth = 'You must be at least 21 years old to rent a car';
      }
    }
    if (!formData.driver.driversLicense.number) newErrors.driverLicense = 'Driver license number is required';
    if (!formData.driver.driversLicense.expiryDate) newErrors.driverLicenseExpiry = 'License expiry date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e, section = null, field = null) => {
    const { name, value } = e.target;
    
    if (section && field) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDriverChange = (e, field = null) => {
    const { name, value } = e.target;

    if (field === 'driversLicense') {
      setFormData(prev => ({
        ...prev,
        driver: {
          ...prev.driver,
          driversLicense: {
            ...prev.driver.driversLicense,
            [name]: value
          }
        }
      }));

      // Clear license errors
      if (name === 'number' && errors.driverLicense) {
        setErrors(prev => ({ ...prev, driverLicense: '' }));
      }
      if (name === 'expiryDate' && errors.driverLicenseExpiry) {
        setErrors(prev => ({ ...prev, driverLicenseExpiry: '' }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        driver: {
          ...prev.driver,
          [name]: value
        }
      }));

      // Clear driver errors
      const errorKey = `driver${name.charAt(0).toUpperCase()}${name.slice(1)}`;
      if (errors[errorKey]) {
        setErrors(prev => ({ ...prev, [errorKey]: '' }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      // Calculate pricing
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      const dailyRate = car.pricePerDay;
      const subtotal = dailyRate * totalDays;
      const taxes = subtotal * 0.1; // 10% tax
      const totalAmount = subtotal + taxes;

      const bookingData = {
        car: car._id,
        bookingPeriod: {
          startDate: formData.startDate,
          endDate: formData.endDate
        },
        pickupLocation: formData.pickupLocation,
        returnLocation: formData.returnLocation,
        pricing: {
          dailyRate,
          totalDays,
          subtotal,
          taxes,
          totalAmount
        },
        driver: {
          firstName: formData.driver.firstName,
          lastName: formData.driver.lastName,
          email: formData.driver.email,
          phone: formData.driver.phone,
          dateOfBirth: formData.driver.dateOfBirth,
          driversLicense: {
            number: formData.driver.driversLicense.number,
            state: formData.driver.driversLicense.state,
            expiryDate: formData.driver.driversLicense.expiryDate
          },
          isSameAsBooker: user?.email === formData.driver.email
        },
        payment: formData.payment
      };

      const response = await bookingsAPI.create(bookingData);
      
      if (response.success) {
        onSuccess && onSuccess(response.data);
        onClose();
        scrollToTop();
        alert('Booking submitted successfully! You will receive a confirmation email shortly.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert(error.message || 'Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--bg-primary)] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[var(--border-color)]">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">Book {car.brand} {car.model}</h2>
              <p className="text-[var(--text-secondary)]">{car.year} • {car.location}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors text-[var(--text-primary)]"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Booking Details */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Booking Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-[var(--bg-primary)] text-[var(--text-primary)] ${
                        errors.startDate ? 'border-red-500' : 'border-[var(--border-color)]'
                      }`}
                    />
                    {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      min={formData.startDate || new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-[var(--bg-primary)] text-[var(--text-primary)] ${
                        errors.endDate ? 'border-red-500' : 'border-[var(--border-color)]'
                      }`}
                    />
                    {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Pickup Location *
                    </label>
                    <input
                      type="text"
                      name="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={handleInputChange}
                      placeholder="Enter pickup location"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] ${
                        errors.pickupLocation ? 'border-red-500' : 'border-[var(--border-color)]'
                      }`}
                    />
                    {errors.pickupLocation && <p className="text-red-500 text-sm mt-1">{errors.pickupLocation}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Return Location *
                    </label>
                    <input
                      type="text"
                      name="returnLocation"
                      value={formData.returnLocation}
                      onChange={handleInputChange}
                      placeholder="Enter return location"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] ${
                        errors.returnLocation ? 'border-red-500' : 'border-[var(--border-color)]'
                      }`}
                    />
                    {errors.returnLocation && <p className="text-red-500 text-sm mt-1">{errors.returnLocation}</p>}
                  </div>
                </div>

                <div className="bg-[var(--bg-secondary)] p-4 rounded-lg border border-[var(--border-color)]">
                  <h4 className="font-medium text-[var(--text-primary)] mb-2">Pricing</h4>
                  <div className="space-y-1 text-sm text-[var(--text-secondary)]">
                    <p>Daily Rate: KSh{car.pricePerDay}</p>
                    {formData.startDate && formData.endDate && (
                      <p>
                        Total Days: {Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24))}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Driver Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Driver Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.driver.firstName}
                      onChange={(e) => handleDriverChange(e)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] ${
                        errors.driverFirstName ? 'border-red-500' : 'border-[var(--border-color)]'
                      }`}
                    />
                    {errors.driverFirstName && <p className="text-red-500 text-sm mt-1">{errors.driverFirstName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.driver.lastName}
                      onChange={(e) => handleDriverChange(e)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] ${
                        errors.driverLastName ? 'border-red-500' : 'border-[var(--border-color)]'
                      }`}
                    />
                    {errors.driverLastName && <p className="text-red-500 text-sm mt-1">{errors.driverLastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.driver.email}
                    onChange={(e) => handleDriverChange(e)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] ${
                      errors.driverEmail ? 'border-red-500' : 'border-[var(--border-color)]'
                    }`}
                  />
                  {errors.driverEmail && <p className="text-red-500 text-sm mt-1">{errors.driverEmail}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.driver.phone}
                    onChange={(e) => handleDriverChange(e)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] ${
                      errors.driverPhone ? 'border-red-500' : 'border-[var(--border-color)]'
                    }`}
                  />
                  {errors.driverPhone && <p className="text-red-500 text-sm mt-1">{errors.driverPhone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.driver.dateOfBirth}
                    onChange={(e) => handleDriverChange(e)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-[var(--bg-primary)] text-[var(--text-primary)] ${
                      errors.driverDateOfBirth ? 'border-red-500' : 'border-[var(--border-color)]'
                    }`}
                  />
                  {errors.driverDateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.driverDateOfBirth}</p>}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-[var(--text-primary)]">Driver's License</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        License Number *
                      </label>
                      <input
                        type="text"
                        name="number"
                        value={formData.driver.driversLicense.number}
                        onChange={(e) => handleDriverChange(e, 'driversLicense')}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] ${
                          errors.driverLicense ? 'border-red-500' : 'border-[var(--border-color)]'
                        }`}
                      />
                      {errors.driverLicense && <p className="text-red-500 text-sm mt-1">{errors.driverLicense}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="date"
                        name="expiryDate"
                        value={formData.driver.driversLicense.expiryDate}
                        onChange={(e) => handleDriverChange(e, 'driversLicense')}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-[var(--bg-primary)] text-[var(--text-primary)] ${
                          errors.driverLicenseExpiry ? 'border-red-500' : 'border-[var(--border-color)]'
                        }`}
                      />
                      {errors.driverLicenseExpiry && <p className="text-red-500 text-sm mt-1">{errors.driverLicenseExpiry}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Payment Method</h3>
              <select
                name="method"
                value={formData.payment.method}
                onChange={(e) => handleInputChange(e, 'payment', 'method')}
                className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-[var(--bg-primary)] text-[var(--text-primary)]"
              >
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6 border-t border-[var(--border-color)]">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-[var(--border-color)] rounded-lg font-semibold text-[var(--text-primary)] hover:border-[var(--text-secondary)] transition-colors bg-[var(--bg-primary)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;