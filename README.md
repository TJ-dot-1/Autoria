# Autoria - Car Rental Platform

<!-- Stars / Forks / Watchers -->
![GitHub stars](https://img.shields.io/github/stars/TJ-dot-1/Autoria?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/TJ-dot-1/Autoria?style=for-the-badge)
![Watchers](https://img.shields.io/github/watchers/TJ-dot-1/Autoria?style=for-the-badge)

<!-- Issues / PRs -->
![Open issues](https://img.shields.io/github/issues/TJ-dot-1/Autoria?style=for-the-badge)
![Pull requests](https://img.shields.io/github/issues-pr/TJ-dot-1/Autoria?style=for-the-badge)

<!-- License / Last commit / Repo size / Top language -->
![License](https://img.shields.io/github/license/TJ-dot-1/Autoria?style=for-the-badge)
![Last commit](https://img.shields.io/github/last-commit/TJ-dot-1/Autoria?style=for-the-badge)
![Repo size](https://img.shields.io/github/repo-size/TJ-dot-1/Autoria?style=for-the-badge)
![Top language](https://img.shields.io/github/languages/top/TJ-dot-1/Autoria?style=for-the-badge)

<!-- Releases -->
![GitHub release (latest by date)](https://img.shields.io/github/v/release/TJ-dot-1/Autoria?style=for-the-badge)


A modern, full-stack car rental platform built with React, Node.js, Express, and MongoDB. Autoria provides a seamless experience for users to browse, book, and manage car rentals, with comprehensive admin functionality.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication with role-based access (user/admin)
- **Car Inventory Management**: Complete CRUD operations for car listings with advanced filtering
- **Booking System**: Full booking lifecycle with date validation and availability checking
- **Admin Dashboard**: Comprehensive admin panel for managing users, cars, and bookings
- **Responsive Design**: Mobile-first design with modern UI/UX
- **Real-time Updates**: Dynamic booking status and availability tracking
- **Image Upload**: Cloudinary integration for car image management
- **Email Notifications**: Automated email confirmations and updates
- **Security**: Rate limiting, CORS, input validation, and secure password hashing

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer with Cloudinary
- **Email**: Nodemailer

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **State Management**: React Context API

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd autoria
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```

   Configure your `backend/.env` file:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/autoria
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   EMAIL_FROM=noreply@autoria.com
   CLIENT_URL=http://localhost:5173
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   ```

   Configure your `frontend/.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB (if using local installation)
   mongod

   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

## 🗄 Database Seeding

Import sample data for testing:
```bash
cd backend
npm run seed -- --import
```

Sample accounts created:
- **User**: `john.doe@example.com` / `password123`
- **User**: `jane.smith@example.com` / `password123`
- **Admin**: `admin@autoria.com` / `admin123`

## 🏃 Running the Application

1. **Start the Backend**
   ```bash
   cd backend
   npm run dev
   ```
   Server will start on http://localhost:5000

2. **Start the Frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   Application will be available on http://localhost:5173

## 📁 Project Structure

```
autoria/
├── backend/
│   ├── configs/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── utils/
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── README.md
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Cars
- `GET /api/cars` - Get all cars with filtering
- `GET /api/cars/:id` - Get single car
- `POST /api/cars` - Create car (Admin)
- `PUT /api/cars/:id` - Update car (Admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user's bookings
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - Manage users
- `GET /api/admin/bookings` - Manage bookings

## 🧪 Testing

### Health Check
```bash
curl http://localhost:5000/health
```

### API Documentation
Visit http://localhost:5000/api for auto-generated API documentation.

## 🔧 Development

### Available Scripts

**Backend:**
- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm run seed -- --import` - Import sample data
- `npm run seed -- --delete` - Delete all data

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check `MONGODB_URI` in backend/.env

2. **CORS Errors**
   - Verify `CLIENT_URL` in backend/.env matches frontend URL

3. **Port Conflicts**
   - Change ports in respective .env files if needed

4. **Environment Variables**
   - Ensure all required environment variables are set
   - Check for typos in variable names

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please contact support@autoria.com or create an issue in the repository.

---

Built with ❤️ for seamless car rental experiences.
