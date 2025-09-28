# Persona-Specific Data Model Architecture

## Overview

The redesigned data model ensures complete data isolation between personas while maintaining efficient user management. Each persona operates as an independent workspace with its own features, data, and preferences.

## Core Principles

1. **Persona Isolation**: All feature data is tied to a specific persona, not just the user
2. **Scalable Design**: Easy to add new personas without affecting existing data
3. **Data Integrity**: Complete cleanup when personas are removed
4. **User Management**: Simple user account with multiple persona identities

## Data Architecture

### 1. User Model (Core Account)
```javascript
// Located: /backend/models/common/User.js
{
  // Authentication & Identity
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  profilePicture: String,
  
  // Persona Management
  personas: [String], // ['student', 'creator', 'professional']
  currentPersona: String,
  
  // Account Status
  isVerified: Boolean,
  isActive: Boolean,
  
  // Global Preferences (not persona-specific)
  preferences: {
    theme: String,
    language: String,
    timezone: String
  }
}
```

### 2. PersonaProfile Model (Persona-Specific Profiles)
```javascript
// Located: /backend/models/common/PersonaProfile.js
{
  userId: ObjectId,
  persona: String (enum),
  
  // Common Profile Data
  bio: String,
  avatar: String,
  displayName: String,
  
  // Persona-Specific Data
  studentData: { institution, major, year, ... },
  creatorData: { niche, socialLinks, platforms, ... },
  professionalData: { company, position, skills, ... },
  entrepreneurData: { companyName, funding, stage, ... },
  researcherData: { institution, publications, grants, ... },
  
  // Persona-Specific Preferences
  preferences: {
    privacy: { profileVisibility, showEmail },
    notifications: { email, push, digest },
    features: { enableAI, enableCollaboration }
  },
  
  // Completion & Verification
  completionPercentage: Number,
  isVerified: Boolean,
  verificationBadges: [String]
}
```

### 3. Core Feature Models (All Persona-Specific)

All core models include `userId` + `persona` for complete data isolation:

#### Bookmarks
```javascript
// Located: /backend/models/core/Bookmark.js
{
  userId: ObjectId,
  persona: String (enum), // REQUIRED
  url: String,
  title: String,
  description: String,
  folderIds: [ObjectId],
  tagIds: [ObjectId],
  // ... other bookmark fields
}
```

#### Folders
```javascript
// Located: /backend/models/core/Folder.js
{
  userId: ObjectId,
  persona: String (enum), // REQUIRED
  name: String,
  color: String,
  parentFolderId: ObjectId,
  // ... other folder fields
}
```

#### Notes, Tags, Tasks
Similar structure with `userId` + `persona` combination.

### 4. Persona-Specific Feature Models

#### Student-Specific Features
```javascript
// Located: /backend/models/personas/StudentModels.js

// Assignments
StudentAssignment {
  userId: ObjectId,
  persona: 'student',
  courseId: ObjectId,
  title: String,
  dueDate: Date,
  status: enum,
  grade: Object,
  // ... assignment-specific fields
}

// Courses
StudentCourse {
  userId: ObjectId,
  persona: 'student',
  name: String,
  instructor: String,
  schedule: [Object],
  // ... course-specific fields
}

// Study Sessions
StudentStudySession {
  userId: ObjectId,
  persona: 'student',
  duration: Object,
  productivity: Number,
  // ... study session fields
}
```

#### Creator-Specific Features
```javascript
// Located: /backend/models/personas/CreatorModels.js

// Content Projects
CreatorProject {
  userId: ObjectId,
  persona: 'creator',
  title: String,
  platform: String,
  status: enum,
  analytics: Object,
  monetization: Object,
  // ... creator project fields
}

// Content Calendar
CreatorCalendar {
  userId: ObjectId,
  persona: 'creator',
  scheduledDate: Date,
  platform: String,
  // ... calendar fields
}

// Brand Partnerships
CreatorPartnership {
  userId: ObjectId,
  persona: 'creator',
  brandName: String,
  compensation: Object,
  deliverables: [Object],
  // ... partnership fields
}
```

#### Professional-Specific Features
```javascript
// Located: /backend/models/personas/ProfessionalModels.js

// Professional Projects
ProfessionalProject {
  userId: ObjectId,
  persona: 'professional',
  name: String,
  client: Object,
  budget: Object,
  timeline: Object,
  // ... project fields
}

// Network Contacts
ProfessionalContact {
  userId: ObjectId,
  persona: 'professional',
  firstName: String,
  company: String,
  relationship: String,
  interactions: [Object],
  // ... contact fields
}

// Skill Development
ProfessionalSkill {
  userId: ObjectId,
  persona: 'professional',
  skillName: String,
  currentLevel: enum,
  targetLevel: enum,
  progress: [Object],
  // ... skill fields
}
```

## Data Service Layer

### PersonaDataService
```javascript
// Located: /backend/services/PersonaDataService.js

class PersonaDataService {
  // User & Persona Management
  static async createUserWithPersona(userData, initialPersona)
  static async addPersonaToUser(userId, persona)
  static async removePersonaFromUser(userId, persona)
  
  // Data Retrieval
  static async getPersonaData(userId, persona, options)
  static async getPersonaAnalytics(userId, persona)
  
  // Data Management
  static async initializePersonaDefaults(userId, persona)
  static async cleanupPersonaData(userId, persona)
}
```

## Database Indexes

All collections use compound indexes for efficient persona-specific queries:

```javascript
// Primary indexes for persona data
{ userId: 1, persona: 1 }
{ userId: 1, persona: 1, createdAt: -1 }
{ userId: 1, persona: 1, status: 1 }

// PersonaProfile unique constraint
{ userId: 1, persona: 1 } // unique
```

## API Endpoints Structure

```
POST /api/auth/register         // Create user with initial persona
POST /api/auth/personas         // Add new persona to user
DELETE /api/auth/personas/:persona  // Remove persona (with data cleanup)
PUT /api/auth/personas/switch   // Switch current persona

// Persona-specific endpoints (all require current persona)
GET /api/student/folders        // Student folders only
GET /api/creator/projects       // Creator projects only  
GET /api/professional/contacts  // Professional contacts only

// Core endpoints (persona-aware)
GET /api/core/bookmarks         // Current persona's bookmarks
POST /api/core/bookmarks        // Create bookmark for current persona
```

## Migration Strategy

For existing users:

1. **User Model**: Remove embedded profile data, keep core auth fields
2. **Create PersonaProfiles**: Extract existing profile data into PersonaProfile documents
3. **Update Core Models**: Ensure all have `persona` field populated
4. **Data Migration Service**: Use `PersonaDataService.migrateUserToPersonaModel()`

## Benefits

### Complete Data Isolation
- Student bookmarks ≠ Professional bookmarks
- Each persona has independent folders, tags, notes
- No data leakage between personas

### Scalable Architecture
- Easy to add new personas (entrepreneur, researcher, etc.)
- Each persona can have unique features
- No changes needed to existing persona data

### Clean Data Management
- Removing a persona completely cleans up all related data
- No orphaned data or references
- Efficient storage and queries

### User Experience
- Simple persona switching
- Each persona feels like a separate application
- Personalized features per persona type

### Privacy & Security
- Persona-level privacy settings
- Data can be shared/hidden per persona
- Professional data separate from personal data

## Implementation Notes

1. **Authentication**: User logs in once, switches personas as needed
2. **Middleware**: `requireCurrentPersona()` validates persona access
3. **Services**: All business logic respects persona boundaries
4. **Frontend**: Persona context propagated through all components
5. **Analytics**: Separate analytics per persona for better insights

This architecture ensures that each persona operates as an independent workspace while maintaining efficient user management and data integrity.
