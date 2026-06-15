import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const InquiryForm = ({ car, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    message: '',
    offerAmount: '',
    financingInterested: false,
    preferredContact: 'Email',
    tradeIn: false,
  });
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      // Build inquiry data
      const inquiryData = {
        car: car._id,
        buyer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        message: formData.message,
        offerAmount: formData.offerAmount ? parseFloat(formData.offerAmount) : null,
        financingInterested: formData.financingInterested,
        preferredContact: formData.preferredContact,
        tradeIn: formData.tradeIn,
        status: 'Pending',
      };

      // For now, simulate submission (backend endpoint can be added later)
      console.log('Inquiry submitted:', inquiryData);
      
      setSubmitSuccess(true);
      setTimeout(() => {
        onSuccess && onSuccess(inquiryData);
        onClose();
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Inquiry error:', error);
      alert(error.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const currency = import.meta.env.VITE_CURRENCY || 'KSh';
  const salePrice = car.salePrice || car.pricePerDay || car.price;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--bg-primary)] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[var(--border-color)]">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">Inquire About This Car</h2>
              <p className="text-[var(--text-secondary)]">{car.year} {car.brand} {car.model} • {currency}{salePrice?.toLocaleString()}</p>
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

          {submitSuccess ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Inquiry Submitted!</h3>
              <p className="text-[var(--text-secondary)]">We'll connect you with the seller shortly. Check your email for updates.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Your Contact Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Your first name"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] ${
                        errors.firstName ? 'border-red-500' : 'border-[var(--border-color)]'
                      }`}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Your last name"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] ${
                        errors.lastName ? 'border-red-500' : 'border-[var(--border-color)]'
                      }`}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] ${
                        errors.email ? 'border-red-500' : 'border-[var(--border-color)]'
                      }`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+254 700 000 000"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] ${
                        errors.phone ? 'border-red-500' : 'border-[var(--border-color)]'
                      }`}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Preferred Contact Method
                  </label>
                  <select
                    name="preferredContact"
                    value={formData.preferredContact}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-[var(--bg-primary)] text-[var(--text-primary)]"
                  >
                    <option value="Email">Email</option>
                    <option value="Phone">Phone Call</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="SMS">SMS</option>
                  </select>
                </div>
              </div>

              {/* Purchase Interest */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Purchase Interest</h3>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Your Offer (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]">{currency}</span>
                    <input
                      type="number"
                      name="offerAmount"
                      value={formData.offerAmount}
                      onChange={handleInputChange}
                      placeholder="Enter your offer amount"
                      className="w-full pl-14 pr-4 py-3 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
                    />
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Listed price: {currency}{salePrice?.toLocaleString()}</p>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Message to Seller
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell the seller about your interest, any questions you have, or schedule a viewing..."
                    rows={4}
                    className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] resize-none"
                  />
                </div>

                <div className="flex flex-col gap-3 mt-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="financingInterested"
                      checked={formData.financingInterested}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm text-[var(--text-primary)]">I'm interested in financing options</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="tradeIn"
                      checked={formData.tradeIn}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm text-[var(--text-primary)]">I have a car to trade in</span>
                  </label>
                </div>
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
                  {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default InquiryForm;
