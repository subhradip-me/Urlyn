# Urlyn 2.0 Backend API

A production-ready Node.js backend API for the Urlyn 2.0 multi-persona SaaS platform, built with Express.js and MongoDB using ES modules.

## 🚀 Features

- **Multi-Persona Support**: Student, Creator, and Professional personas
- **ES Modules**: Modern JavaScript module system
- **Production-Ready**: Docker support, logging, error handling
- **Security**: Helmet, rate limiting, CORS, input sanitization
- **Authentication**: JWT-based authentication with bcrypt
- **Database**: MongoDB with Mongoose ODM
- **Logging**: Structured logging with different levels
- **API Documentation**: RESTful API with standardized responses
- **Error Handling**: Comprehensive error handling and validation
- **Development Tools**: ESLint, Prettier, hot reloading with nodemon

## 📋 Prerequisites

- Node.js 16.0.0 or higher
- MongoDB 6.0 or higher
- npm 8.0.0 or higher

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd urlyn-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration values.

4. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:7
   ```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run prod
```

### Using Docker
```bash
# Development
docker-compose -f docker-compose.dev.yml up

# Production
docker-compose up
```

## 📁 Project Structure

```
backend/
├── config/
│   ├── database.js          # Database connection
│   └── environment.js       # Environment configuration
├── controllers/             # Route controllers
├── middlewares/            # Express middlewares
├── models/                 # Mongoose models
├── routes/                 # Express routes
├── services/               # Business logic layer
├── utils/                  # Utility functions
├── server.js               # Application entry point
├── Dockerfile              # Production Docker image
└── docker-compose.yml      # Production compose
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | No |
| `PORT` | Server port | `5001` | No |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/urlyn` | No |
| `JWT_SECRET` | JWT signing secret | - | Yes (Production) |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` | No |

## 🛡️ Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing protection
- **Rate Limiting**: Request rate limiting
- **Input Sanitization**: XSS and injection protection
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt password hashing

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Student Routes
- `GET /api/student/bookmarks` - Get bookmarks
- `POST /api/student/bookmarks` - Create bookmark
- `GET /api/student/tags` - Get tags
- `GET /api/student/folders` - Get folders

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /health` - Server health check

## 🚀 Deployment

### Docker Deployment
```bash
# Build production image
docker build -t urlyn-backend .

# Run with docker-compose
docker-compose up -d
```

### Production Checklist
- [ ] Environment variables configured
- [ ] MongoDB production database
- [ ] JWT secrets set
- [ ] CORS origins configured
- [ ] SSL certificates configured

## 📄 License

This project is licensed under the ISC License.
