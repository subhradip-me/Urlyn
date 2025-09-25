const mongoose = require('mongoose');
const User = require('../models/common/User');
const Bookmark = require('../models/student/Bookmark');
const Tag = require('../models/student/Tag');
require('dotenv').config();

const sampleBookmarksWithTags = [
  {
    title: "React Official Documentation",
    url: "https://react.dev/",
    description: "Official React documentation with hooks, components, and best practices",
    tags: ["react", "javascript", "frontend", "documentation"],
    category: "tutorials",
    type: "link"
  },
  {
    title: "Node.js Complete Guide",
    url: "https://nodejs.org/en/docs/",
    description: "Complete guide to Node.js backend development",
    tags: ["nodejs", "javascript", "backend", "server"],
    category: "tutorials", 
    type: "link"
  },
  {
    title: "Python Machine Learning Tutorial",
    url: "https://scikit-learn.org/stable/tutorial/index.html",
    description: "Comprehensive machine learning tutorial using Python and scikit-learn",
    tags: ["python", "machine-learning", "ai", "tutorial"],
    category: "tutorials",
    type: "link"
  },
  {
    title: "MongoDB Database Design",
    url: "https://www.mongodb.com/docs/manual/",
    description: "MongoDB manual and database design principles",
    tags: ["database", "mongodb", "nosql", "backend"],
    category: "reference",
    type: "link"
  },
  {
    title: "CSS Grid Layout Guide",
    url: "https://css-tricks.com/snippets/css/complete-guide-grid/",
    description: "Complete guide to CSS Grid layout with examples",
    tags: ["css", "frontend", "layout", "web-design"],
    category: "tutorials",
    type: "link"
  },
  {
    title: "API Design Best Practices",
    url: "https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design",
    description: "Best practices for designing RESTful APIs",
    tags: ["api", "rest", "backend", "best-practices"],
    category: "reference",
    type: "link"
  },
  {
    title: "Git Version Control Tutorial",
    url: "https://git-scm.com/docs",
    description: "Official Git documentation and version control tutorials",
    tags: ["git", "version-control", "development", "tutorial"],
    category: "tutorials",
    type: "link"
  },
  {
    title: "JavaScript ES6+ Features",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    description: "Modern JavaScript features and ES6+ syntax guide",
    tags: ["javascript", "es6", "modern-js", "frontend"],
    category: "reference",
    type: "link"
  },
  {
    title: "Docker Containerization Guide",
    url: "https://docs.docker.com/get-started/",
    description: "Getting started with Docker containers and deployment",
    tags: ["docker", "containerization", "devops", "deployment"],
    category: "tutorials",
    type: "link"
  },
  {
    title: "TypeScript Handbook",
    url: "https://www.typescriptlang.org/docs/",
    description: "Official TypeScript handbook and type system guide",
    tags: ["typescript", "javascript", "types", "development"],
    category: "reference",
    type: "link"
  }
];

async function createSampleData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find a student user
    let student = await User.findOne({ currentPersona: 'student' });
    
    if (!student) {
      console.log('No student user found. Creating one...');
      student = await User.create({
        email: 'student@example.com',
        password: 'hashedpassword123',
        firstName: 'Sample',
        lastName: 'Student',
        personas: ['student'],
        currentPersona: 'student',
        studentProfile: {
          bookmarks: [],
          folders: [],
          notes: []
        }
      });
    }

    console.log(`Using student: ${student.email} (${student._id})`);

    // Clear existing sample bookmarks
    await Bookmark.deleteMany({ 
      student: student._id,
      title: { $in: sampleBookmarksWithTags.map(b => b.title) }
    });
    
    // Clear existing sample tags
    await Tag.deleteMany({ 
      userId: student._id,
      name: { $in: [...new Set(sampleBookmarksWithTags.flatMap(b => b.tags))] }
    });

    console.log('Cleared existing sample data');

    // Create bookmarks and tags
    for (const bookmarkData of sampleBookmarksWithTags) {
      // Create bookmark
      const bookmark = await Bookmark.create({
        student: student._id,
        title: bookmarkData.title,
        url: bookmarkData.url,
        description: bookmarkData.description,
        tags: bookmarkData.tags.map(tag => tag.toLowerCase()),
        category: bookmarkData.category,
        type: bookmarkData.type,
        metadata: {
          aiGenerated: false,
          dateAdded: new Date()
        }
      });

      // Create or update tags
      for (const tagName of bookmarkData.tags) {
        const normalizedName = tagName.toLowerCase();
        
        let tag = await Tag.findOne({
          userId: student._id,
          name: normalizedName
        });

        if (tag) {
          // Increment usage
          tag.usageCount += 1;
          tag.lastUsed = new Date();
          await tag.save();
        } else {
          // Create new tag
          const category = inferCategory(normalizedName);
          const emoji = getEmojiForTag(normalizedName);
          
          tag = await Tag.create({
            userId: student._id,
            name: normalizedName,
            category: category,
            color: getRandomColor(),
            emoji: emoji,
            usageCount: 1,
            lastUsed: new Date(),
            source: 'manual'
          });
        }
        
        console.log(`Created/Updated tag: ${tag.name} (${tag.usageCount} uses)`);
      }

      console.log(`Created bookmark: ${bookmark.title} with ${bookmarkData.tags.length} tags`);
    }

    // Create some AI-generated tags
    const aiTags = [
      { name: 'machine-learning', source: 'ai', category: 'technology' },
      { name: 'data-science', source: 'ai', category: 'technology' },
      { name: 'web-development', source: 'ai', category: 'technology' },
      { name: 'algorithms', source: 'ai', category: 'academic' },
      { name: 'programming-concepts', source: 'ai', category: 'technology' }
    ];

    for (const aiTagData of aiTags) {
      await Tag.create({
        userId: student._id,
        name: aiTagData.name,
        category: aiTagData.category,
        color: getRandomColor(),
        emoji: getEmojiForTag(aiTagData.name),
        usageCount: Math.floor(Math.random() * 5) + 1,
        lastUsed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        source: aiTagData.source,
        aiGenerated: true
      });
      console.log(`Created AI tag: ${aiTagData.name}`);
    }

    console.log('\n✅ Sample bookmarks and tags created successfully!');
    console.log(`📊 Total bookmarks: ${sampleBookmarksWithTags.length}`);
    console.log(`🏷️ Total unique tags: ${[...new Set(sampleBookmarksWithTags.flatMap(b => b.tags))].length + aiTags.length}`);

  } catch (error) {
    console.error('Error creating sample data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Helper functions
function inferCategory(tagName) {
  const academicKeywords = ['math', 'physics', 'chemistry', 'biology', 'science', 'research', 'paper', 'study', 'algorithms'];
  const techKeywords = ['programming', 'code', 'software', 'tech', 'javascript', 'python', 'ai', 'ml', 'web', 'frontend', 'backend'];
  const workKeywords = ['work', 'project', 'client', 'business', 'meeting', 'deadline'];
  
  const lowerTag = tagName.toLowerCase();
  
  if (academicKeywords.some(keyword => lowerTag.includes(keyword))) {
    return 'academic';
  }
  if (techKeywords.some(keyword => lowerTag.includes(keyword))) {
    return 'technology';
  }
  if (workKeywords.some(keyword => lowerTag.includes(keyword))) {
    return 'work';
  }
  
  return 'study';
}

function getRandomColor() {
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function getEmojiForTag(tagName) {
  const emojiMap = {
    'math': '📊', 'physics': '🔬', 'chemistry': '⚗️', 'biology': '🧬',
    'programming': '💻', 'javascript': '🟨', 'python': '🐍', 'ai': '🧠',
    'research': '🔍', 'tutorial': '🎓', 'video': '🎥', 'article': '📄',
    'book': '📚', 'notes': '📝', 'project': '🚀', 'work': '💼',
    'frontend': '🎨', 'backend': '⚙️', 'database': '🗄️', 'api': '🔌',
    'css': '🎨', 'html': '📄', 'nodejs': '🟢', 'react': '⚛️',
    'git': '📋', 'docker': '🐳', 'typescript': '🔵'
  };

  const lowerTag = tagName.toLowerCase();
  for (const [keyword, emoji] of Object.entries(emojiMap)) {
    if (lowerTag.includes(keyword)) {
      return emoji;
    }
  }
  
  return '🏷️';
}

// Run the script
createSampleData();
