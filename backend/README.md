# Autoria Backend API

A comprehensive REST API for the Autoria Car Rental Platform built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with user roles (user/admin)
- **Car Management**: Complete CRUD operations for car inventory
- **Booking System**: Full booking lifecycle management
- **Admin Dashboard**: Comprehensive admin controls and analytics
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Database**: MongoDB with Mongoose ODM
- **Error Handling**: Comprehensive error handling middleware
- **API Documentation**: Auto-generated endpoints documentation

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Development**: Nodemon for hot reloading

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
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
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/autoria
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   EMAIL_FROM=noreply@autoria.com
   CLIENT_URL=http://localhost:5173
   ```

4. **Start MongoDB**
   ```bash
   # Using MongoDB Community Edition
   mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

## 🗄 Database Setup

### Seed Sample Data
```bash
# Import sample data
npm run seed -- --import

# Delete all data
npm run seed -- --delete
```

Sample accounts created:
- **User**: `john.doe@example.com` / `password123`
- **User**: `jane.smith@example.com` / `password123`
- **Admin**: `admin@autoria.com` / `admin123`

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 5000).

## 🔗 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password
- `POST /api/auth/forgotpassword` - Forgot password
- `PUT /api/auth/resetpassword/:resettoken` - Reset password
- `POST /api/auth/refresh` - Refresh token

### Cars (`/api/cars`)
- `GET /api/cars` - Get all cars (with filters)
- `GET /api/cars/available` - Get available cars for dates
- `GET /api/cars/:id` - Get single car
- `POST /api/cars` - Create car (Admin only)
- `PUT /api/cars/:id` - Update car (Admin only)
- `DELETE /api/cars/:id` - Delete car (Admin only)
- `PUT /api/cars/:id/availability` - Toggle availability (Admin only)

### Bookings (`/api/bookings`)
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get single booking
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `GET /api/bookings` - Get all bookings (Admin only)
- `PUT /api/bookings/:id/status` - Update booking status (Admin only)
- `GET /api/bookings/admin/stats` - Get booking statistics (Admin only)

### Admin (`/api/admin`)
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/health` - System health check
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get single user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/users/stats/overview` - User statistics

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Token Structure
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "role": "user"
  }
}
```

## 📊 Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": {
    // response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### Paginated Response
```json
{
  "success": true,
  "count": 10,
  "total": 100,
  "pagination": {
    "page": 1,
    "limit": 12,
    "totalPages": 9,
    "hasNextPage": true,
    "hasPrevPage": false,
    "nextPage": 2,
    "prevPage": null
  },
  "data": [...]
}
```

## 🔍 Query Parameters

### Car Filtering
- `search` - Text search (brand, model, location)
- `category` - Car category filter
- `location` - Location filter
- `fuelType` - Fuel type filter
- `transmission` - Transmission type filter
- `priceMin` - Minimum price per day
- `priceMax` - Maximum price per day
- `year` - Minimum year
- `seatingCapacity` - Minimum seating capacity
- `features` - Comma-separated features
- `sort` - Sort field (price, year, rating, createdAt)
- `order` - Sort order (asc, desc)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)

### Booking Filtering
- `status` - Booking status filter
- `startDate` - Filter by start date
- `endDate` - Filter by end date
- `userId` - Filter by user ID
- `carId` - Filter by car ID

## 🛡 Security Features

1. **Rate Limiting**: 100 requests per 15 minutes per IP
2. **CORS**: Configured for frontend domain
3. **Helmet**: Security headers middleware
4. **Input Validation**: All inputs validated with express-validator
5. **Password Hashing**: bcrypt with salt rounds
6. **JWT Security**: Secure token generation and validation

## 🏗 Project Structure

```
backend/
├── configs/
│   └── database.js          # Database connection
├── controllers/
│   ├── adminController.js   # Admin functionality
│   ├── authController.js    # Authentication
│   ├── bookingController.js # Booking management
│   └── carController.js     # Car management
├── middleware/
│   ├── auth.js             # Authentication middleware
│   └── errorHandler.js     # Error handling
├── models/
│   ├── Booking.js          # Booking model
│   ├── Car.js              # Car model
│   └── User.js             # User model
├── routes/
│   ├── admin.js            # Admin routes
│   ├── auth.js             # Auth routes
│   ├── bookings.js         # Booking routes
│   └── cars.js             # Car routes
├── scripts/
│   └── seedData.js         # Database seeding
├── utils/
│   └── pagination.js       # Pagination utilities
├── .env                    # Environment variables
├── .env.example            # Environment template
├── package.json            # Dependencies
└── server.js               # Main server file
```

## 📈 Database Models

### User Model
- Authentication data
- Profile information
- Role-based access (user/admin)
- Driver's license information
- Address and contact details

### Car Model
- Vehicle specifications
- Pricing information
- Features and amenities
- Images and descriptions
- Availability status
- Location data

### Booking Model
- Booking details and dates
- Pricing calculations
- Payment information
- Driver information
- Status tracking
- Cancellation policies

## 🧪 Testing

### Health Check
```bash
curl http://localhost:5000/health
```

### API Documentation
```bash
curl http://localhost:5000/api
```

### Test Authentication
```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | development |
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | Database connection string | mongodb://localhost:27017/autoria |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRE` | Token expiration | 30d |
| `CLIENT_URL` | Frontend URL | http://localhost:5173 |
| `EMAIL_HOST` | SMTP host | smtp.gmail.com |
| `EMAIL_PORT` | SMTP port | 587 |
| `EMAIL_USER` | Email username | - |
| `EMAIL_PASS` | Email password | - |

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the connection string in `.env`

2. **JWT Token Issues**
   - Verify `JWT_SECRET` is set
   - Check token expiration

3. **CORS Errors**
   - Update `CLIENT_URL` in `.env`
   - Check browser console for specific errors

4. **Port Already in Use**
   - Change `PORT` in `.env`
   - Kill process using the port: `lsof -ti:5000 | xargs kill`

### Logging

The application uses Morgan for logging:
- Development: Detailed console logging
- Production: Combined log format

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support, email support@autoria.com or create an issue in the repository.