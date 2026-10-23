import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaGooglePlay, FaApple } from "react-icons/fa";
import { FiArrowUpRight, FiShield } from "react-icons/fi";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "Facebook", icon: <FaFacebookF className="w-4 h-4" />, url: "https://facebook.com" },
    { name: "Twitter", icon: <FaTwitter className="w-4 h-4" />, url: "https://twitter.com" },
    { name: "Instagram", icon: <FaInstagram className="w-4 h-4" />, url: "https://instagram.com" },
  ];

  const appStores = [
    { 
      name: "Google Play", 
      icon: <FaGooglePlay className="w-5 h-5" />,
      url: "https://play.google.com"
    },
    { 
      name: "App Store", 
      icon: <FaApple className="w-5 h-5" />,
      url: "https://apple.com/app-store"
    },
  ];

  const footerSections = {
    company: {
      title: "Company",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Careers", path: "/careers" },
        { name: "Press & Media", path: "/press" },
        { name: "Automotive Blog", path: "/blog" },
      ],
    },
    marketplace: {
      title: "Marketplace",
      links: [
        { name: "Browse Inventory", path: "/cars" },
        { name: "Sell Your Vehicle", path: "/services/sell-your-car" },
        { name: "Financing Plans", path: "/services/car-financing" },
        { name: "Vehicle Inspection", path: "/services/vehicle-inspection" },
      ],
    },
    support: {
      title: "Customer Support",
      links: [
        { name: "Help Center", path: "/support/help-center" },
        { name: "Contact Dealers", path: "/contact" },
        { name: "FAQ", path: "/faq" },
        { name: "Insurance Coverage", path: "/support/insurance-info" },
      ],
    },
    legal: {
      title: "Legal & Trust",
      links: [
        { name: "Terms of Service", path: "/legal/terms" },
        { name: "Privacy Policy", path: "/legal/privacy" },
        { name: "Cookie Policy", path: "/legal/cookies" },
        { name: "Legal Notice", path: "/legal/legal-notice" },
      ],
    },
  };

  return (
    <footer className="bg-[#040E1B] border-t border-[rgba(107,203,255,0.12)] text-[#A8B7CC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-10">
          
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2684FF]/25 to-[#6BCBFF]/10 border border-[#2684FF]/40 p-2 flex items-center justify-center shadow-[0_0_15px_rgba(38,132,255,0.3)]">
                <img src="/auto.png" alt="Autoria Logo" className="w-full h-full object-contain filter drop-shadow" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white tracking-tight group-hover:text-[#6BCBFF] transition-colors">
                  Autoria
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#6BCBFF]/80 font-bold -mt-1">
                  Motors
                </span>
              </div>
            </Link>

            <p className="text-xs text-[#A8B7CC] leading-relaxed max-w-sm">
              The premier cinematic automotive marketplace. Connecting passionate buyers and verified dealerships with total transparency, verified paperwork, and effortless financing.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-[#0B1D33] hover:bg-[#2684FF] text-[#A8B7CC] hover:text-white border border-[rgba(107,203,255,0.15)] hover:border-[#6BCBFF] flex items-center justify-center transition-all duration-300 shadow"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerSections).map(([key, section]) => (
            <div key={key} className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                {section.title}
              </h4>
              <ul className="space-y-2 text-xs">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-[#A8B7CC] hover:text-[#6BCBFF] transition-colors flex items-center gap-1 group"
                    >
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[rgba(107,203,255,0.08)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7D96]">
          <p>© {currentYear} Autoria Motors Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#6BCBFF]">
              <FiShield className="w-3.5 h-3.5" />
              Verified Automotive Platform
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
