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

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2684FF]/10 text-[#6BCBFF] text-xs font-semibold border border-[#2684FF]/30 mb-3">
            <span>Help Center &amp; Guidance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6BCBFF] to-[#2684FF]">Questions</span>
          </h1>
          <p className="text-sm text-[#A8B7CC] max-w-xl mx-auto">
            Find answers to common questions about buying, selling, and inspecting vehicles on Autoria.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="max-w-xl mx-auto mb-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search FAQ questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-full text-xs sm:text-sm bg-[#0B1D33]/90 text-white placeholder-[#A8B7CC]/60 border border-[rgba(107,203,255,0.2)] focus:border-[#2684FF] focus:shadow-[0_0_15px_rgba(38,132,255,0.3)] transition-all"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6BCBFF]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-3">
          <AnimatePresence>
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-2xl overflow-hidden bg-[#0B1D33]/70 border border-[rgba(107,203,255,0.15)] shadow-md transition-all"
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-white/5 transition-colors"
                  >
                    <h3 className="text-sm sm:text-base font-bold text-white pr-4">
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0 text-[#6BCBFF]"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 pt-1 border-t border-[rgba(107,203,255,0.08)]">
                          <p className="text-xs sm:text-sm text-[#A8B7CC] leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            ) : (
              <div className="text-center py-12 p-8 rounded-3xl bg-[#0B1D33]/60 border border-[rgba(107,203,255,0.15)]">
                <h3 className="text-base font-bold text-white mb-1">No matching questions found</h3>
                <p className="text-xs text-[#A8B7CC]">Try searching with a different keyword or contact our support team.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Contact Support Section */}
        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-[#0B1D33] via-[#0E2644] to-[#0B1D33] border border-[rgba(107,203,255,0.2)] text-center shadow-2xl">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Still Have Questions?
          </h3>
          <p className="text-xs sm:text-sm text-[#A8B7CC] mb-6 max-w-lg mx-auto">
            Our automotive marketplace support team is available 24/7 to assist with inquiries, financing, and paperwork.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:0706667129"
              className="px-6 py-3 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#2684FF] to-[#1255CC] shadow-[0_0_20px_rgba(38,132,255,0.4)]"
            >
              Call Specialist: 0706667129
            </a>
            <a
              href="https://wa.me/254706667129?text=Hi!%20I%20have%20a%20question%20about%20Autoria"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full text-xs font-semibold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all"
            >
              WhatsApp Support
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FAQ;