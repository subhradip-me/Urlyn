# Modular Backend Architecture - Urlyn 2.0

## Overview

The backend has been completely restructured into a modular, persona-specific architecture that provides:
- **Complete data isolation** between personas
- **Scalable module system** for easy feature additions
- **Maintainable codebase** with clear separation of concerns
- **Type-safe persona management** with proper validation

## Architecture Structure

```
backend/
├── modules/
│   ├── auth/                    # Authentication & User Management
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── models/
│   │       ├── User.js
│   │       └── PersonaProfile.js
│   │
│   ├── core/                    # Core Features (Persona-Aware)
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── models/
│   │       ├── Bookmark.js
│   │       ├── Folder.js
│   │       ├── Note.js
│   │       ├── Tag.js
│   │       └── Task.js
│   │
│   ├── personas/               # Persona-Specific Modules
│   │   ├── student/
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── models/
│   │   │       └── StudentModels.js
│   │   │
│   │   ├── creator/
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── models/
│   │   │       └── CreatorModels.js
│   │   │
│   │   ├── professional/
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── models/
│   │   │       └── ProfessionalModels.js
│   │   │
│   │   ├── entrepreneur/
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── models/
│   │   │       └── EntrepreneurModels.js
│   │   │
│   │   └── researcher/
│   │       ├── controllers/
│   │       ├── routes/
│   │       ├── services/
│   │       └── models/
│   │           └── ResearcherModels.js
│   │
│   ├── shared/                 # Shared Utilities & Services
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── environment.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   ├── services/
│   │   │   ├── socketManager.js
│   │   │   └── PersonaDataService.js
│   │   └── utils/
│   │       ├── helpers.js
│   │       ├── logger.js
│   │       └── responseHelpers.js
│   │
│   └── ModuleManager.js        # Module Loading & Management
│
├── server-modular.js           # New Modular Entry Point
└── server.js                   # Legacy Entry Point (for compatibility)
```

## API Endpoints Structure

### New Modular Endpoints
```
/api/auth                       # Authentication & User Management
├── POST   /register            # Register new user
├── POST   /login               # User login
├── POST   /personas            # Add persona to user
├── PUT    /personas/switch     # Switch current persona
└── DELETE /personas/:persona   # Remove persona

/api/core                       # Core Features (Persona-Aware)
├── /bookmarks                  # Current persona's bookmarks
├── /folders                    # Current persona's folders
├── /tags                       # Current persona's tags
├── /notes                      # Current persona's notes
└── /tasks                      # Current persona's tasks

/api/personas/student           # Student-Specific Features
├── /assignments                # Student assignments
├── /courses                    # Student courses
├── /study-sessions             # Study sessions
├── /bookmarks                  # Student bookmarks
├── /folders                    # Student folders
└── /notes                      # Student notes

/api/personas/creator           # Creator-Specific Features
├── /projects                   # Content projects
├── /calendar                   # Content calendar
├── /partnerships               # Brand partnerships
├── /analytics                  # Content analytics
├── /bookmarks                  # Creator bookmarks
└── /folders                    # Creator folders

/api/personas/professional      # Professional-Specific Features
├── /projects                   # Client projects
├── /contacts                   # Professional contacts
├── /skills                     # Skill development
├── /network                    # Professional network
├── /bookmarks                  # Professional bookmarks
└── /folders                    # Professional folders

/api/personas/entrepreneur      # Entrepreneur-Specific Features
├── /startups                   # Startup projects
├── /investors                  # Investor relations
├── /business-plans             # Business plans
├── /funding                    # Funding tracker
├── /bookmarks                  # Entrepreneur bookmarks
└── /folders                    # Entrepreneur folders

/api/personas/researcher        # Researcher-Specific Features
├── /projects                   # Research projects
├── /publications               # Publications
├── /collaborations             # Research collaborations
├── /grants                     # Grant management
├── /bookmarks                  # Researcher bookmarks
└── /folders                    # Researcher folders
```

### Legacy Endpoints (Backward Compatibility)
```
/api/student                    # → /api/personas/student
/api/creator                    # → /api/personas/creator  
/api/professional               # → /api/personas/professional
```

## Data Models

### Core Models (All Persona-Specific)

#### User Model (Auth Module)
```javascript
{
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  personas: [String],           // ['student', 'creator', ...]
  currentPersona: String,       // Current active persona
  preferences: {                // Global preferences
    theme: String,
    language: String,
    timezone: String
  }
}
```

#### PersonaProfile Model (Auth Module)
```javascript
{
  userId: ObjectId,
  persona: String,              // 'student', 'creator', etc.
  
  // Common profile fields
  bio: String,
  avatar: String,
  displayName: String,
  
  // Persona-specific data
  studentData: { ... },
  creatorData: { ... },
  professionalData: { ... },
  entrepreneurData: { ... },
  researcherData: { ... },
  
  // Persona-specific preferences
  preferences: {
    privacy: { ... },
    notifications: { ... },
    features: { ... }
  }
}
```

#### Core Feature Models (Always Include userId + persona)
```javascript
// Bookmark, Folder, Note, Tag, Task
{
  userId: ObjectId,
  persona: String,              // REQUIRED - ensures data isolation
  // ... other fields specific to each model
}
```

### Persona-Specific Models

#### Student Models
- **StudentAssignment**: Academic assignments with due dates, grades
- **StudentCourse**: Course management with schedules, instructors
- **StudentStudySession**: Study session tracking with productivity metrics

#### Creator Models
- **CreatorProject**: Content projects with analytics and monetization
- **CreatorCalendar**: Content scheduling and publishing calendar
- **CreatorPartnership**: Brand partnerships and sponsorship management

#### Professional Models
- **ProfessionalProject**: Client projects with budgets and timelines
- **ProfessionalContact**: Professional networking and relationship management
- **ProfessionalSkill**: Skill development tracking and certification management

#### Entrepreneur Models
- **EntrepreneurStartup**: Startup projects with funding and metrics
- **EntrepreneurInvestor**: Investor relations and pitch tracking
- **EntrepreneurBusinessPlan**: Business plan management and sharing

#### Researcher Models
- **ResearcherProject**: Research projects with grants and collaborations
- **ResearcherPublication**: Publication tracking with citations and metrics
- **ResearcherCollaboration**: Research collaboration management

## Module System

### ModuleManager
Central system that handles:
- **Dynamic module loading**
- **Dependency resolution**
- **Module validation**
- **Health monitoring**
- **Statistics and reporting**

### Module Structure
Each module follows a consistent structure:
```javascript
module/
├── controllers/        # Business logic handlers
├── routes/            # API route definitions
├── services/          # Business logic services
├── models/            # Data models (if persona-specific)
└── index.js           # Module exports and routing
```

## Features by Persona

### 🎓 Student Persona
- **Academic Management**: Assignments, courses, schedules
- **Study Tracking**: Study sessions, productivity metrics
- **Resource Organization**: Academic bookmarks, research notes
- **Goal Setting**: Academic milestones, GPA tracking

### 🎨 Creator Persona
- **Content Management**: Project planning, content calendar
- **Monetization**: Brand partnerships, sponsorship tracking
- **Analytics**: Performance metrics, audience insights
- **Resource Library**: Creative inspiration, tools, references

### 💼 Professional Persona
- **Project Management**: Client projects, timelines, budgets
- **Networking**: Professional contacts, relationship management
- **Skill Development**: Learning paths, certification tracking
- **Career Growth**: Achievement tracking, portfolio management

### 🚀 Entrepreneur Persona
- **Startup Management**: Multiple venture tracking
- **Investor Relations**: Pitch management, funding rounds
- **Business Planning**: Strategic planning, financial projections
- **Market Research**: Competitive analysis, market insights

### 🔬 Researcher Persona
- **Research Projects**: Grant management, collaboration tracking
- **Publication Management**: Paper tracking, citation monitoring
- **Academic Networking**: Research collaborations, peer connections
- **Knowledge Management**: Literature reviews, research notes

## Security & Privacy

### Data Isolation
- **Persona-level isolation**: Each persona's data is completely separate
- **Access control**: Users can only access data for their current persona
- **Data cleanup**: Removing a persona removes ALL associated data

### Authentication & Authorization
- **JWT-based authentication**: Secure token-based auth
- **Persona validation**: Middleware ensures proper persona access
- **Role-based access**: Different permissions per persona type

## Performance Optimizations

### Database Indexes
```javascript
// All persona-specific collections use compound indexes
{ userId: 1, persona: 1 }
{ userId: 1, persona: 1, createdAt: -1 }
{ userId: 1, persona: 1, status: 1 }
```

### Caching Strategy
- **Module-level caching**: Frequently accessed persona data cached
- **User session caching**: Current persona context cached
- **Query optimization**: Persona-specific query patterns optimized

## Development & Deployment

### Running the Server
```bash
# New modular server
npm run start:modular

# Legacy server (for compatibility)
npm start
```

### Environment Variables
```bash
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/urlyn
JWT_SECRET=your-secret-key
```

### Module Development
1. Create module directory structure
2. Implement models with `userId + persona` pattern
3. Create controllers with persona validation
4. Define routes with proper middleware
5. Update ModuleManager configuration

## Migration Strategy

### From Legacy to Modular
1. **Phase 1**: Deploy both servers side-by-side
2. **Phase 2**: Migrate data to persona-specific format
3. **Phase 3**: Update frontend to use new endpoints
4. **Phase 4**: Deprecate legacy endpoints
5. **Phase 5**: Remove legacy code

### Data Migration
```javascript
// Example migration script
const migrateUserData = async (userId) => {
  // Extract profile data from User model
  // Create PersonaProfile documents
  // Update existing collections with persona field
  // Validate data integrity
};
```

## Testing Strategy

### Unit Tests
- **Model validation**: Ensure persona requirements
- **Service logic**: Business logic testing
- **Controller responses**: API response validation

### Integration Tests
- **Persona switching**: End-to-end persona flow
- **Data isolation**: Verify complete separation
- **Module loading**: ModuleManager functionality

### Performance Tests
- **Query performance**: Persona-specific query optimization
- **Memory usage**: Module loading efficiency
- **Concurrent users**: Multi-persona usage patterns

## Monitoring & Analytics

### Module Health
- **Load status**: Track module loading success/failure
- **Performance metrics**: Response times per module
- **Error tracking**: Module-specific error monitoring

### Usage Analytics
- **Persona adoption**: Track persona usage patterns
- **Feature utilization**: Most/least used features per persona
- **User engagement**: Cross-persona usage analysis

This modular architecture provides a solid foundation for scaling Urlyn 2.0 with complete persona-specific feature development while maintaining clean separation of concerns and data integrity.
