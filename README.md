# Urlyn 2.0 - Multi-Persona SaaS Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-ES_Modules-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-blue?logo=tailwindcss)](https://tailwindcss.com/)

A production-ready, multi-persona SaaS platform built with Next.js and Node.js, designed for students, creators, professionals, entrepreneurs, and researchers.

## 🚀 Current Status: PRODUCTION READY ✅

The project has been thoroughly cleaned and optimized for production deployment.

### Quick Access URLs
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

---

## 🎯 About Urlyn 2.0

Urlyn 2.0 is a comprehensive platform that adapts to different user personas, providing tailored experiences and tools for various workflows. Users can seamlessly switch between personas and access persona-specific features while maintaining unified data management.

### 🌟 Key Features

- **🎭 Multi-Persona Support**: Student, Creator, Professional, Entrepreneur, Researcher
- **⚡ Real-time Chat**: Socket.io-powered messaging system
- **🤖 AI Integration**: AI-powered notes and content generation
- **📁 Smart Organization**: Folders, tags, and bookmarks system
- **🔐 Secure Authentication**: JWT-based auth with persona management
- **📱 Responsive Design**: Mobile-first responsive UI
- **🔄 Real-time Sync**: Live data updates across all devices
- **📊 Analytics**: Dashboard insights for each persona

---

## 🏗️ Architecture

### Frontend (Next.js 15.5.3)
- **Framework**: Next.js with App Router
- **Styling**: TailwindCSS 4.0 with custom components
- **UI Library**: Radix UI components
- **State Management**: React Context API
- **Icons**: Lucide React icons
- **Real-time**: Socket.io client

### Backend (Node.js with Express)
- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js with RESTful API
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt
- **Real-time**: Socket.io server
- **Security**: Helmet, CORS, rate limiting

---

## 🎭 Persona System

### Available Personas

| Persona | Features | Use Cases |
|---------|----------|-----------|
| 🎓 **Student** | Course management, AI notes, study tracking | Academic learning, research |
| 📷 **Creator** | Content planning, script writing, inspiration | Content creation, media |
| 💼 **Professional** | Project management, team collaboration | Business, corporate work |
| 🚀 **Entrepreneur** | Business ventures, investments, networking | Startups, business development |
| 🔬 **Researcher** | Research papers, citations, academic collaboration | Scientific research, academia |

---

## 📋 Prerequisites

- **Node.js** 16.0.0 or higher
- **MongoDB** 6.0 or higher
- **npm** 8.0.0 or higher

---

## 🛠️ Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/subhradip-me/Urlyn.git
cd Urlyn
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install
```

### 3. Environment Configuration

Create `.env` files in both root and backend directories:

**Root `.env`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Backend `.env`:**
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/urlyn
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3001
BYPASS_AUTH=true
```

### 4. Start MongoDB
```bash
# Local MongoDB
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7
```

---

## 🏃‍♂️ Running the Application

### Development Mode (Concurrent)
```bash
npm run dev:all
```

### Individual Services
```bash
# Frontend only
npm run dev

# Backend only
npm run dev:backend
```

### Production Mode
```bash
# Frontend
npm run build && npm start

# Backend
cd backend && npm run prod
```

---

## 📁 Project Structure

```
Urlyn/
├── src/                          # Frontend source code
│   ├── app/                      # Next.js App Router pages
│   │   ├── dashboard/           # Multi-persona dashboard
│   │   ├── student/             # Student persona pages
│   │   ├── login/               # Authentication pages
│   │   └── register/
│   ├── components/              # React components
│   │   ├── ui/                  # UI components (Radix)
│   │   ├── auth/                # Authentication components
│   │   └── dashboard-*.jsx      # Dashboard components
│   ├── contexts/                # React contexts
│   │   ├── AuthContext.js       # Authentication state
│   │   └── ChatContext.js       # Real-time chat
│   └── lib/                     # Utilities and services
│       ├── api-client.js        # API communication
│       └── services.js          # Business logic
├── backend/                      # Backend source code
│   ├── controllers/             # Route controllers
│   │   ├── auth/                # Authentication
│   │   ├── dashboard/           # Dashboard data
│   │   ├── student/             # Student features
│   │   └── common/              # Shared features
│   ├── models/                  # MongoDB models
│   │   ├── common/              # User, Notification
│   │   ├── core/                # Bookmark, Tag, Folder, Note
│   │   └── chat/                # Chat, Message
│   ├── routes/                  # Express routes
│   ├── services/                # Business logic layer
│   ├── middlewares/             # Express middlewares
│   └── utils/                   # Helper functions
├── public/                      # Static assets
└── package.json                 # Dependencies & scripts
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/personas` - Add new persona
- `PUT /api/auth/personas/switch` - Switch persona

### Core Features (Persona-Aware)
- `GET /api/core/bookmarks` - Get bookmarks
- `POST /api/core/bookmarks` - Create bookmark
- `GET /api/core/folders` - Get folders
- `GET /api/core/tags` - Get tags

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/quick-actions` - Quick actions

### Real-time Features
- `GET /api/chats` - Chat management
- WebSocket events for live updates

### Utilities
- `GET /health` - Server health check
- `POST /api/metadata` - URL metadata extraction
- `POST /api/ai-tags/generate` - AI tag generation

---

## 🔐 Authentication System

### Multi-Persona Authentication
- JWT-based authentication with 30-day expiration
- Users can have multiple personas simultaneously
- Secure persona switching without re-authentication
- Development bypass mode for testing

### Security Features
- Password hashing with bcrypt
- Request rate limiting
- CORS protection
- Input sanitization
- Secure headers with Helmet

---

## 💾 Database Schema

### User Model
```javascript
{
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  personas: [String], // Array of accessible personas
  currentPersona: String, // Active persona
  preferences: Object,
  createdAt: Date
}
```

### Core Models (Persona-Aware)
- **Bookmark**: URL bookmarks with metadata
- **Folder**: Organization system
- **Tag**: Content categorization
- **Note**: User-generated content
- **Chat**: Real-time messaging

---

## 🚀 Production Deployment

### Environment Setup
1. Set production environment variables
2. Configure MongoDB production instance
3. Set secure JWT secrets
4. Configure CORS for production domains

### Build Commands
```bash
# Frontend build
npm run build

# Backend is ready for production
cd backend && npm start
```

### Docker Deployment (Backend)
```bash
cd backend
docker build -t urlyn-backend .
docker run -p 5000:5000 urlyn-backend
```

---

## 🧪 Development Features

### Development Bypasses
- Authentication bypass for testing (`BYPASS_AUTH=true`)
- Mock user data for development
- Development-specific routes and logging

### Testing & Quality
- ESLint configuration
- Production-ready error handling
- Comprehensive logging system
- Clean, maintainable code structure

---

## 📊 Project Statistics

- **Frontend**: 30+ React components
- **Backend**: 50+ API endpoints
- **Database**: 8+ MongoDB collections
- **Features**: 5 complete persona systems
- **Authentication**: Full JWT implementation
- **Real-time**: Socket.io integration

---

## 🔧 Common Commands

```bash
# Development
npm run dev:all              # Start both frontend & backend
npm run dev                  # Frontend only
npm run dev:backend          # Backend only

# Production
npm run build               # Build frontend
npm run start               # Start production frontend
npm run start:backend       # Start production backend

# Backend specific
cd backend && npm run prod  # Production backend
cd backend && npm test      # Run tests
cd backend && npm run lint  # Lint code
```

---

## 🐛 Troubleshooting

### Common Issues & Solutions

1. **Port conflicts**: Frontend uses 3001, backend uses 5000
2. **MongoDB connection**: Ensure MongoDB is running on port 27017
3. **CORS issues**: Check FRONTEND_URL in backend .env
4. **Authentication**: Verify JWT_SECRET is set
5. **Development mode**: Use BYPASS_AUTH=true for testing

### Performance Optimizations
- Production build removes all debug code
- Optimized database queries
- Efficient state management
- Lazy loading for better performance

---

## 📄 License

This project is licensed under the ISC License.

---

## 🎉 Ready for Production!

✅ All debug code removed  
✅ Production optimizations applied  
✅ Clean, maintainable codebase  
✅ Comprehensive documentation  
✅ Multi-persona system fully functional  
✅ Real-time features operational  
✅ Security measures implemented

**Happy coding with Urlyn 2.0! 🚀**
