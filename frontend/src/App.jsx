import React from 'react'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import CarDetails from './pages/CarDetails'
import MyBookings from './pages/MyBookings'
import Footer from './components/Footer'
import Cars from './pages/Cars'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import FAQ from './pages/FAQ'
import { useAuth } from './contexts/AuthContext.jsx'

// About Us pages
import Careers from './pages/Careers'
import Press from './pages/Press'
import Blog from './pages/Blog'
import About from './pages/About'
import Services from './pages/Services'
import Contact from './pages/Contact'

// Services pages
import BuyACar from './pages/services/BuyACar'
import SellYourCar from './pages/services/SellYourCar'
import CarFinancing from './pages/services/CarFinancing'
import VehicleInspection from './pages/services/VehicleInspection'

// Support pages
import HelpCenter from './pages/support/HelpCenter'
import ContactUs from './pages/support/ContactUs'
import InsuranceInfo from './pages/support/InsuranceInfo'

// Legal pages
import TermsOfService from './pages/legal/TermsOfService'
import PrivacyPolicy from './pages/legal/PrivacyPolicy'
import CookiePolicy from './pages/legal/CookiePolicy'
import LegalNotice from './pages/legal/LegalNotice'

// Admin components
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageCars from './pages/admin/ManageCars'
import AddCar from './pages/admin/AddCar'
import ManageBookings from './pages/admin/ManageBookings'
import ManageUsers from './pages/admin/ManageUsers'
import ReportsAnalytics from './pages/admin/ReportsAnalytics'
import AdminSettings from './pages/admin/AdminSettings'

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const navigate = useNavigate()
  const { isAuthenticated, isAdmin, isLoading } = useAuth()

  React.useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login')
      } else if (adminOnly && !isAdmin) {
        navigate('/dashboard')
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, adminOnly, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || (adminOnly && !isAdmin)) {
    return null
  }

  return children
}

const App = () => {
  return (
    <div>
      <ScrollToTop />
      <Routes>
        {/* Auth routes without footer */}
        <Route path="/login" element={<Login />} />

        {/* Public routes with navbar and footer */}
        <Route path="/*" element={
          <div>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cars/:id" element={<CarDetails />} />
              <Route path="/my-inquiries" element={<MyBookings />} />
              <Route path="/cars" element={<Cars />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />

              {/* About Us Routes */}
              <Route path="/careers" element={<Careers />} />
              <Route path="/press" element={<Press />} />
              <Route path="/blog" element={<Blog />} />
              
              {/* Services Routes */}
              <Route path="/services/buy-a-car" element={<BuyACar />} />
              <Route path="/services/sell-your-car" element={<SellYourCar />} />
              <Route path="/services/car-financing" element={<CarFinancing />} />
              <Route path="/services/vehicle-inspection" element={<VehicleInspection />} />
              
              {/* Support Routes */}
              <Route path="/support/help-center" element={<HelpCenter />} />
              <Route path="/support/contact" element={<ContactUs />} />
              <Route path="/support/insurance-info" element={<InsuranceInfo />} />
              
              {/* Legal Routes */}
              <Route path="/legal/terms" element={<TermsOfService />} />
              <Route path="/legal/privacy" element={<PrivacyPolicy />} />
              <Route path="/legal/cookies" element={<CookiePolicy />} />
              <Route path="/legal/legal-notice" element={<LegalNotice />} />
            </Routes>
            <Footer />
          </div>
        } />

        {/* Admin routes with admin layout */}
        <Route path="/admin/*" element={
          <ProtectedRoute adminOnly>
            <AdminLayout>
              <Routes>
                <Route path="" element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="manage-cars" element={<ManageCars />} />
                <Route path="add-car" element={<AddCar />} />
                <Route path="edit-car/:id" element={<AddCar />} />
                <Route path="bookings" element={<ManageBookings />} />
                <Route path="users" element={<ManageUsers />} />
                <Route path="reports" element={<ReportsAnalytics />} />
                <Route path="settings" element={<AdminSettings />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        } />

        {/* Owner routes (using admin layout) */}
        <Route path="/owner/*" element={
          <ProtectedRoute adminOnly>
            <AdminLayout>
              <Routes>
                <Route path="" element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="manage-cars" element={<ManageCars />} />
                <Route path="add-car" element={<AddCar />} />
                <Route path="edit-car/:id" element={<AddCar />} />
                <Route path="manage-bookings" element={<ManageBookings />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default App