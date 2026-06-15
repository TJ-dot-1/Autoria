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
      question: "How do I buy a car on Autoria?",
      answer: "Browse our available listings, select a vehicle you're interested in, and click 'Make Inquiry'. You can send a message to the seller, make an offer, or contact them directly to schedule a viewing and test drive."
    },
    {
      question: "How do I sell my car on Autoria?",
      answer: "Contact our team to list your vehicle. You'll need to provide clear photos, accurate vehicle details (make, model, year, mileage, condition), your asking price, and contact information. We'll review and publish your listing."
    },
    {
      question: "What documents do I need to buy a car?",
      answer: "You'll need a valid national ID or passport and proof of funds (bank statement or loan approval). For financed purchases, you'll also need proof of income and employment details."
    },
    {
      question: "Do you offer financing options?",
      answer: "Yes! We partner with leading Kenyan banks to offer competitive car financing. Options include standard loans, premium loans with lower interest rates, and balloon payment plans. Visit our Car Financing page for details."
    },
    {
      question: "Can I get a vehicle inspection before purchasing?",
      answer: "Absolutely. We offer professional 200+ point vehicle inspections by certified mechanics. This covers engine, body, electronics, and safety systems. We highly recommend an inspection for all used vehicle purchases."
    },
    {
      question: "How do I know the car listing is legitimate?",
      answer: "All sellers on Autoria go through a verification process. We verify seller identities and vehicle registration documents. However, we always recommend viewing the car in person and getting an inspection before purchasing."
    },
    {
      question: "What is the process for transferring ownership?",
      answer: "After agreeing on a price, both buyer and seller visit the NTSA (National Transport and Safety Authority) to process the transfer. You'll need the logbook, KRA PIN certificates, and valid IDs. We can guide you through this process."
    },
    {
      question: "Can I negotiate the price?",
      answer: "Yes, you can make an offer through our inquiry form or contact the seller directly. The listed price is the seller's asking price, and negotiation is a normal part of the car buying process."
    },
    {
      question: "What payment methods are accepted?",
      answer: "Payment methods are arranged between buyer and seller. Common options include bank transfers, M-Pesa for deposits, and banker's cheques. We recommend using traceable payment methods for security."
    },
    {
      question: "Do you offer trade-in services?",
      answer: "Yes, you can indicate interest in trading in your current vehicle when making an inquiry. Our team will help assess your trade-in value and facilitate the exchange process."
    },
    {
      question: "What if I find a problem with the car after purchase?",
      answer: "We recommend a thorough inspection before purchase. For issues discovered after sale, your options depend on the terms agreed between buyer and seller. Some listings include a warranty period — check the listing details."
    },
    {
      question: "How long does it take to sell a car on Autoria?",
      answer: "Selling times vary based on the vehicle, price, and market demand. Well-priced cars with good photos and detailed descriptions typically sell within 2-4 weeks. Our team can advise on pricing strategy."
    },
    {
      question: "Is there a fee for listing my car?",
      answer: "Basic listings are free on Autoria. We also offer premium listing options with enhanced visibility, featured placement, and professional photography for a competitive fee."
    },
    {
      question: "Do you deliver cars to other locations?",
      answer: "Delivery services can be arranged for an additional fee depending on the distance. Contact our team to discuss delivery options for your specific location within Kenya."
    },
    {
      question: "How do I contact a seller?",
      answer: "You can contact sellers through our inquiry form on the car listing page, call them directly using the 'Contact Seller' button, or reach out via WhatsApp. Our team is also available to facilitate communication."
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
            Find answers to common questions about buying and selling cars on Autoria. 
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
                const message = 'Hi! I have a question about buying/selling a car on Autoria.';
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