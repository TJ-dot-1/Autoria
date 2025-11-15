# Autoria Frontend

A modern React-based frontend for the Autoria Car Rental Platform, built with Vite, Tailwind CSS, and Framer Motion. This application provides a seamless user experience for browsing cars, making bookings, and managing rentals.

## 🚀 Features

- **Responsive Design**: Mobile-first design with modern UI/UX
- **User Authentication**: Secure login/registration with JWT tokens
- **Car Browsing**: Advanced filtering and search functionality
- **Booking System**: Intuitive booking flow with date selection
- **Admin Dashboard**: Comprehensive admin panel for platform management
- **Real-time Updates**: Dynamic content loading and state management
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Toast Notifications**: User-friendly feedback with React Hot Toast
- **Theme Support**: Dark/light theme with context-based state management
- **Protected Routes**: Role-based access control for admin features

## 🛠 Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v7
- **Animations**: Framer Motion
- **State Management**: React Context API
- **HTTP Client**: Fetch API (via custom utils)
- **Notifications**: React Hot Toast
- **Icons**: Custom SVG icons and Tailwind classes

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Backend API running (see backend README)

## 🚀 Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```
The application will be available on http://localhost:5173

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## 📁 Project Structure

```
frontend/
├── public/
│   ├── auto.png
│   ├── banner_car_image.png
│   ├── banner.png
│   └── hero.png
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   └── AdminLayout.jsx
│   │   ├── Banner.jsx
│   │   ├── BookingForm.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── Loader.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── MicroInteractions.jsx
│   │   ├── MyBookings.jsx
│   │   ├── Navbar.jsx
│   │   ├── PageTransitions.jsx
│   │   ├── ScrollToTop.jsx
│   │   └── Title.jsx
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AddCar.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminSettings.jsx
│   │   │   ├── ManageBookings.jsx
│   │   │   ├── ManageCars.jsx
│   │   │   ├── ManageUsers.jsx
│   │   │   └── ReportsAnalytics.jsx
│   │   ├── legal/
│   │   │   ├── CookiePolicy.jsx
│   │   │   ├── LegalNotice.jsx
│   │   │   ├── PrivacyPolicy.jsx
│   │   │   └── TermsOfService.jsx
│   │   ├── services/
│   │   │   ├── AirportTransfer.jsx
│   │   │   ├── BusinessRental.jsx
│   │   │   ├── CarRental.jsx
│   │   │   └── LongTermLease.jsx
│   │   ├── support/
│   │   │   ├── ContactUs.jsx
│   │   │   ├── HelpCenter.jsx
│   │   │   └── InsuranceInfo.jsx
│   │   ├── About.jsx
│   │   ├── Blog.jsx
│   │   ├── CarCard.jsx
│   │   ├── CarDetails.jsx
│   │   ├── Careers.jsx
│   │   ├── Cars.jsx
│   │   ├── Contact.jsx
│   │   ├── Dashboard.jsx
│   │   ├── FAQ.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── MyBookings.jsx
│   │   ├── NewCars.jsx
│   │   ├── Press.jsx
│   │   └── Services.jsx
│   ├── styles/
│   │   └── admin-responsive.css
│   ├── utils/
│   │   ├── animations.js
│   │   ├── api.js
│   │   ├── imageHelpers.js
│   │   └── scrollToTop.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🔗 Key Components

### Authentication Context (`AuthContext.jsx`)
- Manages user authentication state
- Provides login, logout, and user data
- Handles JWT token storage and validation

### Theme Context (`ThemeContext.jsx`)
- Manages application theme (light/dark)
- Persists theme preference in localStorage

### API Utilities (`utils/api.js`)
- Centralized API calls
- Error handling and response formatting
- Authentication header management

### Protected Routes
- `ProtectedRoute` component for authenticated users
- Admin-only route protection
- Automatic redirects based on authentication status

## 🎨 Styling

The application uses Tailwind CSS for styling with custom design tokens:

- **Primary Color**: Blue (#3B82F6)
- **Secondary Colors**: Gray scale
- **Typography**: Inter font family
- **Spacing**: Consistent 4px grid system
- **Responsive Breakpoints**: Mobile-first approach

## 🔧 Configuration

### Vite Configuration
- React plugin for JSX support
- Tailwind CSS integration
- Development server settings

### ESLint Configuration
- React hooks rules
- React refresh plugin
- Custom linting rules

## 🧪 Development Guidelines

### Component Structure
- Use functional components with hooks
- Implement proper prop types
- Follow consistent naming conventions

### State Management
- Use Context API for global state
- Local state for component-specific data
- Avoid prop drilling with context

### API Integration
- Use the centralized API utility
- Handle loading states and errors
- Implement proper error boundaries

### Routing
- Protected routes for authenticated users
- Admin routes with role-based access
- Nested routing for complex layouts

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service (Netlify, Vercel, etc.)

3. **Environment Variables**
   - Set `VITE_API_URL` to your production API URL
   - Ensure CORS is configured on the backend

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Verify `VITE_API_URL` in `.env`
   - Check if backend is running
   - Ensure CORS is properly configured

2. **Authentication Issues**
   - Clear localStorage and cookies
   - Check JWT token expiration
   - Verify backend authentication endpoints

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies are installed

4. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check for CSS conflicts
   - Verify responsive breakpoints

## 🤝 Contributing

1. Follow the existing code structure and naming conventions
2. Use ESLint for code quality
3. Test components across different screen sizes
4. Ensure accessibility compliance
5. Add proper error handling

## 📝 License

This project is licensed under the MIT License.