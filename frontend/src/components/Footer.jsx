import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaGooglePlay, FaApple } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Social Media Icons
  const socialLinks = [
    { name: "Facebook", icon: <FaFacebookF className="w-5 h-5" />, url: "https://facebook.com" },
    { name: "Twitter", icon: <FaTwitter className="w-5 h-5" />, url: "https://twitter.com" },
    { name: "Instagram", icon: <FaInstagram className="w-5 h-5" />, url: "https://instagram.com" },
  ];

  // App Store Buttons (No assets, fully UI-based)
  const appStores = [
    { 
      name: "Google Play", 
      icon: <FaGooglePlay className="w-6 h-6" />,
      url: "https://play.google.com"
    },
    { 
      name: "App Store", 
      icon: <FaApple className="w-6 h-6" />,
      url: "https://apple.com/app-store"
    },
  ];

  // Footer Sections
  const footerSections = {
    company: {
      title: "Company",
      links: [
        { name: "Careers", path: "/careers" },
        { name: "Press", path: "/press" },
        { name: "Blog", path: "/blog" },
      ],
    },
    services: {
      title: "Services",
      links: [
        { name: "Buy a Car", path: "/services/buy-a-car" },
        { name: "Sell Your Car", path: "/services/sell-your-car" },
        { name: "Car Financing", path: "/services/car-financing" },
        { name: "Vehicle Inspection", path: "/services/vehicle-inspection" },
      ],
    },
    support: {
      title: "Support",
      links: [
        { name: "Help Center", path: "/support/help-center" },
        { name: "Contact Us", path: "/support/contact" },
        { name: "FAQ", path: "/faq" },
        { name: "Insurance Info", path: "/support/insurance-info" },
      ],
    },
    legal: {
      title: "Legal",
      links: [
        { name: "Terms of Service", path: "/legal/terms" },
        { name: "Privacy Policy", path: "/legal/privacy" },
        { name: "Cookie Policy", path: "/legal/cookies" },
        { name: "Legal Notice", path: "/legal/legal-notice" },
      ],
    },
  };

  return (
    <footer className="bg-[var(--bg-primary)] border-t border-[var(--border-color)]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center mb-6">
              <div className="h-8 w-8 rounded-lg border border-[var(--border-color)] bg-white shadow-sm">
                <img src="/auto.png" alt="Autoria Logo" className="h-full w-full rounded-lg object-contain p-1" />
              </div>
              <span className="ml-3 text-2xl font-bold text-[var(--text-primary)]">Autoria</span>
            </Link>

            <p className="text-[var(--text-secondary)] mb-6">
              Your trusted partner for buying and selling cars in Kenya. Discover quality vehicles, connect with verified sellers, and enjoy a seamless car buying experience.
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4 mb-6">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition shadow-sm text-[var(--text-primary)]"
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* App Store Buttons */}
            <div className="flex space-x-3">
              {appStores.map((store, i) => (
                <a
                  key={i}
                  href={store.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 border bg-[var(--bg-primary)] border-[var(--border-color)] px-3 py-2 rounded-lg hover:bg-primary hover:text-white transition shadow-sm text-[var(--text-primary)]"
                >
                  {store.icon}
                  <span className="text-sm font-medium">{store.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {Object.values(footerSections).map((section, i) => (
            <div key={i}>
              <h3 className="font-semibold text-lg mb-4 text-[var(--text-primary)]">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, index) => (
                  <li key={index}>
                    <Link className="text-[var(--text-secondary)] hover:text-primary" to={link.path}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-[var(--border-color)] mt-12 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">Stay Updated</h3>
              <p className="text-[var(--text-secondary)]">Subscribe to our newsletter for the latest car listings and market trends.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] focus:ring-primary text-[var(--text-primary)]"
              />
              <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark">Subscribe</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-[var(--text-secondary)] text-sm">© {currentYear} Autoria. All rights reserved.</div>

          <div className="flex items-center space-x-6 text-sm text-[var(--text-secondary)]">
            <span>Accepted Payment:</span>
            <div className="flex space-x-2">
              <span className="w-8 h-5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded flex items-center justify-center text-xs text-[var(--text-primary)]">Visa</span>
              <span className="w-8 h-5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded flex items-center justify-center text-xs text-[var(--text-primary)]">MC</span>
              <span className="w-8 h-5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded flex items-center justify-center text-xs text-[var(--text-primary)]">PP</span>
            </div>
          </div>

          <select className="border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] px-2 py-1 rounded text-sm">
            <option>English</option>
            <option>Kiswahili</option>
            <option>French</option>
            <option>German</option>
          </select>
        </div>
      </div>

      {/* Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark"
      >
        ↑
      </button>
    </footer>
  );
};

export default Footer;
