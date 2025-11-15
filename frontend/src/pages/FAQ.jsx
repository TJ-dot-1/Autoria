import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  containerVariants,
  itemVariants,
  getButtonHoverProps
} from '../utils/animations';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I rent a car?",
      answer: "Simply browse our available cars, select your preferred vehicle, and click 'Rent Now'. You'll be redirected to WhatsApp to discuss booking details with our team. We'll guide you through the rental process and confirm availability."
    },
    {
      question: "What documents do I need to rent a car?",
      answer: "You'll need a valid driver's license, national ID or passport, and proof of residence. For international customers, a valid international driving permit is required along with your home country license."
    },
    {
      question: "What is the minimum age requirement?",
      answer: "The minimum age to rent a car is 21 years old. Drivers between 21-25 years may be subject to a young driver surcharge. Some premium vehicles require drivers to be at least 25 years old."
    },
    {
      question: "Is insurance included in the rental price?",
      answer: "Yes, basic insurance is included in all our rental prices. This covers third-party liability. We also offer additional insurance options including collision damage waiver (CDW) and theft protection for comprehensive coverage."
    },
    {
      question: "What is your cancellation policy?",
      answer: "You can cancel your reservation up to 24 hours before the pickup time for a full refund. Cancellations made less than 24 hours in advance may be subject to a cancellation fee of one day's rental charge."
    },
    {
      question: "Can I extend my rental period?",
      answer: "Yes, you can extend your rental period by contacting us at least 24 hours before your scheduled return time. Extension is subject to vehicle availability and may incur additional charges."
    },
    {
      question: "What happens if I return the car late?",
      answer: "Late returns are charged at an hourly rate for the first 3 hours, after which a full additional day rate applies. Please contact us if you expect to be late to discuss options."
    },
    {
      question: "Are there any additional fees I should know about?",
      answer: "Additional fees may include fuel charges (if returned with less fuel than received), cleaning fees for excessively dirty vehicles, parking tickets, tolls, and traffic violations incurred during your rental period."
    },
    {
      question: "What fuel policy do you follow?",
      answer: "Cars are provided with a full tank and should be returned with a full tank. If returned with less fuel, you'll be charged the current market price plus a refueling service fee."
    },
    {
      question: "Can I cross borders with the rental car?",
      answer: "Cross-border travel is allowed to neighboring countries with prior approval and additional insurance. A cross-border fee applies, and certain restrictions may apply depending on the destination country."
    },
    {
      question: "What if the car breaks down during my rental?",
      answer: "We provide 24/7 roadside assistance. Call us immediately at 0706667129, and we'll arrange for repairs or provide a replacement vehicle. Our roadside assistance service is included in your rental."
    },
    {
      question: "Can I add an additional driver?",
      answer: "Yes, additional drivers can be added for a daily fee. The additional driver must meet the same age and license requirements and must be present at pickup to sign the rental agreement."
    },
    {
      question: "Do you offer delivery and pickup services?",
      answer: "Yes, we offer vehicle delivery and pickup services within Nairobi for a small fee. Contact us to schedule delivery/pickup at your preferred location and time."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept cash, mobile money (M-Pesa), bank transfers, and major credit cards (Visa, Mastercard). Payment is required at the time of pickup or delivery."
    },
    {
      question: "Is there a security deposit required?",
      answer: "Yes, a security deposit is required at pickup and will be refunded upon safe return of the vehicle, provided there are no damages or outstanding charges. The deposit amount varies by vehicle type."
    }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Breadcrumb */}
      <motion.div
        className="bg-white border-b"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <motion.div
              whileHover={{ scale: 1.05 }}
            >
              <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors">Home</Link>
            </motion.div>
            <motion.span
              className="text-gray-400"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              /
            </motion.span>
            <motion.span
              className="text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              FAQ
            </motion.span>
          </nav>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our car rental services. 
            Can't find what you're looking for? Contact us directly!
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="max-w-2xl mx-auto mb-8"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white rounded-lg shadow-md mb-4 overflow-hidden"
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0"
                    >
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4">
                          <p className="text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">Try adjusting your search terms or contact us directly.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          className="bg-blue-50 rounded-2xl p-8 mt-12 text-center"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Our team is here to help! Contact us directly for personalized assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              {...getButtonHoverProps()}
              onClick={() => window.location.href = 'tel:0706667129'}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Call Us: 0706667129
            </motion.button>
            <motion.button
              {...getButtonHoverProps()}
              onClick={() => {
                const phoneNumber = '0706667129';
                const message = 'Hi! I have a question about your car rental services.';
                const whatsappUrl = `https://wa.me/${phoneNumber.replace(/^0/, '254')}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
              }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              WhatsApp Us
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FAQ;