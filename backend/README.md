# Urlyn Backend - Modular Architecture

Welcome to the Urlyn 2.0 backend - a completely modular, persona-specific architecture designed for scalability and maintainability.

## 🚀 Key Features

- **🏗️ Modular Architecture**: Complete module separation for easy maintenance
- **👥 5 Persona Support**: Student, Creator, Professional, Entrepreneur, Researcher
- **🔒 Data Isolation**: Complete persona-specific data separation
- **⚡ Performance**: Optimized queries with compound indexing
- **🛡️ Security**: JWT authentication with persona validation
- **📊 Monitoring**: Health checks and module performance metrics
- **🔄 Backward Compatibility**: Legacy endpoint support during migration
- **🧪 Type Safety**: Comprehensive validation and error handling
- **📡 Real-time**: Socket.io integration for live features
- **🐳 Docker Ready**: Production-ready containerization

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- MongoDB 6.0 or higher
- npm 9.0.0 or higher

## 🛠️ Quick Start

### Installation
```bash
cd backend
npm install
```

### Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Configure your environment variables
DATABASE_URL=mongodb://localhost:27017/urlyn
JWT_SECRET=your-super-secret-key
NODE_ENV=development
```

### Running the Server
```bash
# New modular server (recommended)
npm run start:modular

# Legacy server (backward compatibility)
npm start

# Development mode with auto-reload
npm run dev:modular
```

## �️ Architecture Overview

### Modular Structure
```
backend/
├── modules/                    # Modular architecture
│   ├── auth/                  # Authentication & user management
│   ├── core/                  # Core features (persona-aware)
│   ├── personas/              # Persona-specific modules
│   │   ├── student/           # 🎓 Student features
│   │   ├── creator/           # 🎨 Creator features
│   │   ├── professional/      # 💼 Professional features
│   │   ├── entrepreneur/      # 🚀 Entrepreneur features
│   │   └── researcher/        # 🔬 Researcher features
│   ├── shared/                # Shared utilities
│   └── ModuleManager.js       # Module coordination
├── server-modular.js          # New entry point
└── server.js                  # Legacy entry point
```

### Key Architecture Benefits
- ✅ **Complete data isolation** between personas
- ✅ **Scalable modular system** for easy feature additions
- ✅ **Type-safe persona management** with validation
- ✅ **Backward compatibility** with legacy endpoints
- ✅ **Health monitoring** and performance metrics

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

## � API Endpoints

### Core Authentication
```
POST   /api/auth/register       # Register new user
POST   /api/auth/login          # User login
POST   /api/auth/personas       # Add persona to user
PUT    /api/auth/personas/switch # Switch current persona
DELETE /api/auth/personas/:id   # Remove persona
GET    /api/auth/me             # Get current user info
```

### Core Features (Persona-Aware)
```
GET    /api/core/bookmarks      # Current persona's bookmarks
POST   /api/core/bookmarks      # Create bookmark for current persona
GET    /api/core/folders        # Current persona's folders
POST   /api/core/folders        # Create folder for current persona
GET    /api/core/tags           # Current persona's tags
GET    /api/core/notes          # Current persona's notes
GET    /api/core/tasks          # Current persona's tasks
```

### Persona-Specific Endpoints

#### 🎓 Student Features
```
GET    /api/personas/student/assignments    # Academic assignments
POST   /api/personas/student/assignments    # Create assignment
GET    /api/personas/student/courses        # Enrolled courses
GET    /api/personas/student/study-sessions # Study session tracking
```

#### 🎨 Creator Features
```
GET    /api/personas/creator/projects       # Content projects
POST   /api/personas/creator/projects       # Create project
GET    /api/personas/creator/calendar       # Content calendar
GET    /api/personas/creator/partnerships   # Brand partnerships
```

#### 💼 Professional Features
```
GET    /api/personas/professional/projects  # Client projects
POST   /api/personas/professional/projects  # Create project
GET    /api/personas/professional/contacts  # Professional contacts
GET    /api/personas/professional/skills    # Skill development
```

#### 🚀 Entrepreneur Features
```
GET    /api/personas/entrepreneur/startups     # Startup projects
POST   /api/personas/entrepreneur/startups     # Create startup
GET    /api/personas/entrepreneur/investors    # Investor relations
GET    /api/personas/entrepreneur/funding      # Funding tracker
```

#### 🔬 Researcher Features
```
GET    /api/personas/researcher/projects        # Research projects
POST   /api/personas/researcher/projects        # Create project
GET    /api/personas/researcher/publications    # Publications
GET    /api/personas/researcher/collaborations  # Research collaborations
```

### Legacy Endpoints (Backward Compatibility)
```
/api/student/*                  # → /api/personas/student/*
/api/creator/*                  # → /api/personas/creator/*
/api/professional/*             # → /api/personas/professional/*
```

### System Health
```
GET    /api/health             # Overall system health
GET    /api/health/modules     # Module-specific health status
GET    /api/stats/personas     # Persona adoption metrics
```

## �️ Data Models

### User Authentication
```javascript
// User model (simplified for auth only)
{
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  personas: [String],           // Active personas
  currentPersona: String,       // Current active persona
  preferences: Object           // Global preferences
}

// PersonaProfile model (persona-specific data)
{
  userId: ObjectId,
  persona: String,              // 'student', 'creator', etc.
  bio: String,
  avatar: String,
  displayName: String,
  // Persona-specific data sections...
}
```

### Core Features (All Require userId + persona)
```javascript
// All core models (Bookmark, Folder, Note, Tag, Task)
{
  userId: ObjectId,             // REQUIRED
  persona: String,              // REQUIRED - ensures data isolation
  // ... model-specific fields
}
```

## 🛡️ Security & Privacy

### Data Isolation Strategy
- **Complete separation**: Each persona's data is completely isolated
- **Compound indexing**: All queries use `{ userId, persona }` pattern
- **Access validation**: Middleware ensures users only access their current persona's data
- **Clean removal**: Deleting a persona removes ALL associated data

## 🔧 Development

### Module Development Guidelines
1. **Follow the pattern**: Each module has controllers/routes/services/models
2. **Data isolation**: Always include `userId` and `persona` in models
3. **Validation**: Use persona validation middleware
4. **Testing**: Write tests for data isolation

### Adding a New Persona
1. Create module directory: `modules/personas/new-persona/`
2. Add persona to enum in models
3. Create persona-specific models
4. Implement controllers and routes
5. Update ModuleManager configuration

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test suite
npm run test:personas
```

## 🚀 Deployment

### Production Setup
```bash
# Build for production
npm run build

# Start production server
npm run start:prod

# Using PM2 for process management
pm2 start ecosystem.config.js
```

### Docker Support
```bash
# Build Docker image
docker build -t urlyn-backend .

# Run with Docker Compose
docker-compose up -d
```

## 📚 Documentation

- **[Complete Architecture Guide](../MODULAR_BACKEND_ARCHITECTURE.md)** - Detailed technical documentation
- **[Migration Guide](./docs/migration.md)** - Moving from legacy to modular
- **[Development Guide](./docs/development.md)** - Development best practices

## 🤝 Contributing

1. **Follow the modular pattern** - Keep modules independent and focused
2. **Maintain data isolation** - Always use `userId + persona` pattern
3. **Write tests** - Include unit and integration tests
4. **Document changes** - Update relevant documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for the Urlyn community**
