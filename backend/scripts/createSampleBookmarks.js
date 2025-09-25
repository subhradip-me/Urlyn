const mongoose = require('mongoose');
require('../config/database');
const Bookmark = require('../models/student/Bookmark');
const User = require('../models/common/User');

const sampleBookmarks = [
  // AI Folder bookmarks
  {
    title: 'OpenAI ChatGPT',
    url: 'https://chat.openai.com',
    description: 'Conversational AI assistant for various tasks',
    category: 'tools',
    folder: 'AI',
    tags: ['ai', 'chatbot', 'openai', 'gpt'],
    priority: 'high'
  },
  {
    title: 'Anthropic Claude',
    url: 'https://claude.ai',
    description: 'Advanced AI assistant for writing and analysis',
    category: 'tools',
    folder: 'AI',
    tags: ['ai', 'assistant', 'anthropic', 'claude'],
    priority: 'high'
  },
  {
    title: 'Hugging Face',
    url: 'https://huggingface.co',
    description: 'Machine learning models and datasets platform',
    category: 'tools',
    folder: 'AI',
    tags: ['ml', 'models', 'datasets', 'transformers'],
    priority: 'medium'
  },
  {
    title: 'Papers with Code',
    url: 'https://paperswithcode.com',
    description: 'Machine learning research papers with code implementations',
    category: 'research',
    folder: 'AI',
    tags: ['research', 'papers', 'ml', 'code'],
    priority: 'medium'
  },
  {
    title: 'Coursera AI Course',
    url: 'https://www.coursera.org/learn/machine-learning',
    description: 'Andrew Ng\'s Machine Learning Course',
    category: 'academic',
    folder: 'AI',
    tags: ['course', 'ml', 'andrew-ng', 'coursera'],
    priority: 'medium'
  },

  // Math Folder bookmarks
  {
    title: 'Khan Academy Math',
    url: 'https://www.khanacademy.org/math',
    description: 'Free math courses and practice exercises',
    category: 'academic',
    folder: 'Math',
    tags: ['math', 'courses', 'practice', 'free'],
    priority: 'high'
  },
  {
    title: 'Wolfram Alpha',
    url: 'https://www.wolframalpha.com',
    description: 'Computational knowledge engine for math problems',
    category: 'tools',
    folder: 'Math',
    tags: ['calculator', 'computation', 'wolfram', 'solver'],
    priority: 'high'
  },
  {
    title: 'Desmos Graphing Calculator',
    url: 'https://www.desmos.com/calculator',
    description: 'Online graphing calculator for functions and equations',
    category: 'tools',
    folder: 'Math',
    tags: ['graphing', 'calculator', 'functions', 'equations'],
    priority: 'high'
  },
  {
    title: 'MIT OpenCourseWare Math',
    url: 'https://ocw.mit.edu/courses/mathematics',
    description: 'Free MIT mathematics courses and materials',
    category: 'academic',
    folder: 'Math',
    tags: ['mit', 'courses', 'calculus', 'algebra'],
    priority: 'medium'
  },
  {
    title: 'Paul\'s Online Math Notes',
    url: 'https://tutorial.math.lamar.edu',
    description: 'Comprehensive math tutorials and notes',
    category: 'tutorials',
    folder: 'Math',
    tags: ['tutorials', 'calculus', 'algebra', 'notes'],
    priority: 'medium'
  },
  {
    title: 'GeoGebra',
    url: 'https://www.geogebra.org',
    description: 'Interactive math software for geometry and algebra',
    category: 'tools',
    folder: 'Math',
    tags: ['geometry', 'algebra', 'interactive', 'visualization'],
    priority: 'medium'
  },
  {
    title: 'Symbolab',
    url: 'https://www.symbolab.com',
    description: 'Step-by-step math solver and calculator',
    category: 'tools',
    folder: 'Math',
    tags: ['solver', 'calculator', 'step-by-step', 'equations'],
    priority: 'medium'
  },
  {
    title: 'Math Stack Exchange',
    url: 'https://math.stackexchange.com',
    description: 'Q&A community for mathematics problems',
    category: 'reference',
    folder: 'Math',
    tags: ['qa', 'community', 'problems', 'help'],
    priority: 'low'
  },

  // Exam Prep Folder bookmarks
  {
    title: 'Quizlet',
    url: 'https://quizlet.com',
    description: 'Flashcards and study tools for exam preparation',
    category: 'tools',
    folder: 'Exam Prep',
    tags: ['flashcards', 'study', 'memorization', 'quizzes'],
    priority: 'high'
  },
  {
    title: 'Anki',
    url: 'https://apps.ankiweb.net',
    description: 'Spaced repetition flashcard system',
    category: 'tools',
    folder: 'Exam Prep',
    tags: ['flashcards', 'spaced-repetition', 'memory', 'study'],
    priority: 'high'
  },
  {
    title: 'Pomodoro Timer',
    url: 'https://pomofocus.io',
    description: 'Time management tool for focused study sessions',
    category: 'tools',
    folder: 'Exam Prep',
    tags: ['productivity', 'timer', 'focus', 'study-technique'],
    priority: 'medium'
  },
  {
    title: 'StudyBlue',
    url: 'https://www.studyblue.com',
    description: 'Digital flashcards and study guides',
    category: 'tools',
    folder: 'Exam Prep',
    tags: ['flashcards', 'study-guides', 'collaboration', 'notes'],
    priority: 'medium'
  },
  {
    title: 'Coursera Exam Prep',
    url: 'https://www.coursera.org/browse/computer-science/software-development',
    description: 'Professional certificate courses for exam preparation',
    category: 'academic',
    folder: 'Exam Prep',
    tags: ['certificates', 'professional', 'courses', 'preparation'],
    priority: 'medium'
  },
  {
    title: 'Khan Academy Test Prep',
    url: 'https://www.khanacademy.org/test-prep',
    description: 'Free test preparation resources',
    category: 'academic',
    folder: 'Exam Prep',
    tags: ['test-prep', 'sat', 'act', 'free'],
    priority: 'medium'
  },
  {
    title: 'Notion Study Template',
    url: 'https://www.notion.so/templates/school',
    description: 'Study organization templates',
    category: 'tools',
    folder: 'Exam Prep',
    tags: ['organization', 'templates', 'notes', 'planning'],
    priority: 'low'
  },
  {
    title: 'Forest App',
    url: 'https://www.forestapp.cc',
    description: 'Focus app that helps you stay concentrated while studying',
    category: 'tools',
    folder: 'Exam Prep',
    tags: ['focus', 'productivity', 'concentration', 'app'],
    priority: 'low'
  },
  {
    title: 'Study.com',
    url: 'https://study.com',
    description: 'Online courses and test preparation',
    category: 'academic',
    folder: 'Exam Prep',
    tags: ['courses', 'test-prep', 'lessons', 'practice'],
    priority: 'medium'
  },
  {
    title: 'Magoosh',
    url: 'https://magoosh.com',
    description: 'Online test prep for standardized exams',
    category: 'academic',
    folder: 'Exam Prep',
    tags: ['test-prep', 'gre', 'gmat', 'standardized'],
    priority: 'medium'
  },
  {
    title: 'Cramly',
    url: 'https://cramly.com',
    description: 'AI-powered study assistant',
    category: 'tools',
    folder: 'Exam Prep',
    tags: ['ai', 'study-assistant', 'homework-help', 'tutoring'],
    priority: 'medium'
  },
  {
    title: 'SparkNotes',
    url: 'https://www.sparknotes.com',
    description: 'Study guides and literature summaries',
    category: 'reference',
    folder: 'Exam Prep',
    tags: ['study-guides', 'literature', 'summaries', 'reference'],
    priority: 'low'
  }
];

async function createSampleBookmarks() {
  try {
    console.log('🔄 Creating sample bookmarks...');
    
    // Find a student user (you might need to adjust this query)
    const user = await User.findOne({ persona: 'student' });
    if (!user) {
      console.error('❌ No student user found. Please create a student account first.');
      return;
    }

    console.log('👤 Found student user:', user.email);

    // Clear existing bookmarks for this user
    await Bookmark.deleteMany({ student: user._id });
    console.log('🗑️ Cleared existing bookmarks');

    // Create new bookmarks
    const bookmarksWithUser = sampleBookmarks.map(bookmark => ({
      ...bookmark,
      student: user._id
    }));

    const createdBookmarks = await Bookmark.insertMany(bookmarksWithUser);
    console.log(`✅ Created ${createdBookmarks.length} sample bookmarks`);

    // Show summary by folder
    const folderCounts = {};
    createdBookmarks.forEach(bookmark => {
      folderCounts[bookmark.folder] = (folderCounts[bookmark.folder] || 0) + 1;
    });

    console.log('\n📊 Bookmarks by folder:');
    Object.entries(folderCounts).forEach(([folder, count]) => {
      console.log(`   ${folder}: ${count} bookmarks`);
    });

    console.log('\n🎉 Sample bookmarks created successfully!');
    console.log('Now you can open folders and see their contents.');

  } catch (error) {
    console.error('❌ Error creating sample bookmarks:', error);
  } finally {
    mongoose.connection.close();
  }
}

createSampleBookmarks();
