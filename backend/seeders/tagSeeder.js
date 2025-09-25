const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tag = require('../models/student/Tag');
const connectDB = require('../config/database');

dotenv.config();

const sampleTags = [
  // Academic Tags
  {
    name: 'mathematics',
    category: 'academic',
    color: '#3B82F6',
    emoji: '📊',
    description: 'Mathematics and calculus concepts'
  },
  {
    name: 'physics',
    category: 'academic',
    color: '#8B5CF6',
    emoji: '🔬',
    description: 'Physics theories and experiments'
  },
  {
    name: 'chemistry',
    category: 'academic',
    color: '#10B981',
    emoji: '⚗️',
    description: 'Chemical reactions and compounds'
  },
  {
    name: 'biology',
    category: 'academic',
    color: '#059669',
    emoji: '🧬',
    description: 'Life sciences and biological processes'
  },
  {
    name: 'research',
    category: 'academic',
    color: '#F59E0B',
    emoji: '🔍',
    description: 'Research papers and academic articles'
  },

  // Study Tags
  {
    name: 'exam prep',
    category: 'study',
    color: '#EF4444',
    emoji: '📝',
    description: 'Examination preparation materials'
  },
  {
    name: 'tutorials',
    category: 'study',
    color: '#6366F1',
    emoji: '🎓',
    description: 'Learning tutorials and guides'
  },
  {
    name: 'notes',
    category: 'study',
    color: '#06B6D4',
    emoji: '📋',
    description: 'Personal study notes'
  },
  {
    name: 'flashcards',
    category: 'study',
    color: '#84CC16',
    emoji: '🗂️',
    description: 'Memory flashcards and quick review'
  },
  {
    name: 'practice problems',
    category: 'study',
    color: '#F97316',
    emoji: '🧮',
    description: 'Practice exercises and problem sets'
  },

  // Technology Tags
  {
    name: 'programming',
    category: 'technology',
    color: '#1F2937',
    emoji: '💻',
    description: 'Programming languages and coding'
  },
  {
    name: 'javascript',
    category: 'technology',
    color: '#F7DF1E',
    emoji: '🟨',
    description: 'JavaScript programming'
  },
  {
    name: 'python',
    category: 'technology',
    color: '#3776AB',
    emoji: '🐍',
    description: 'Python programming language'
  },
  {
    name: 'artificial intelligence',
    category: 'technology',
    color: '#7C3AED',
    emoji: '🧠',
    description: 'AI and machine learning concepts'
  },
  {
    name: 'web development',
    category: 'technology',
    color: '#059669',
    emoji: '🌐',
    description: 'Web development and design'
  },

  // Work Tags
  {
    name: 'project management',
    category: 'work',
    color: '#7C2D12',
    emoji: '📊',
    description: 'Project planning and management'
  },
  {
    name: 'client work',
    category: 'work',
    color: '#B91C1C',
    emoji: '💼',
    description: 'Client projects and deliverables'
  },
  {
    name: 'meetings',
    category: 'work',
    color: '#7E22CE',
    emoji: '🤝',
    description: 'Meeting notes and action items'
  },

  // Personal Tags
  {
    name: 'personal projects',
    category: 'personal',
    color: '#EC4899',
    emoji: '🚀',
    description: 'Personal side projects'
  },
  {
    name: 'hobbies',
    category: 'personal',
    color: '#F59E0B',
    emoji: '🎨',
    description: 'Personal interests and hobbies'
  },
  {
    name: 'career development',
    category: 'personal',
    color: '#0891B2',
    emoji: '📈',
    description: 'Career growth and development'
  }
];

const seedTags = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Starting tag seeding...');
    
    // Clear existing tags (optional - comment out if you want to keep existing data)
    // await Tag.deleteMany({});
    // console.log('🗑️ Cleared existing tags');
    
    // Insert sample tags
    const insertedTags = await Tag.insertMany(sampleTags.map(tag => ({
      ...tag,
      student: new mongoose.Types.ObjectId(), // This would be a real student ID in production
      usageCount: Math.floor(Math.random() * 20), // Random usage count for demo
      metadata: {
        aiGenerated: Math.random() > 0.5, // Random AI generated flag
        lastUsed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random last used within 30 days
      }
    })));
    
    console.log(`✅ Inserted ${insertedTags.length} sample tags`);
    
    // Display summary
    const categoryCount = await Tag.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);
    
    console.log('\n📊 Tag Categories:');
    categoryCount.forEach(cat => {
      console.log(`   ${cat._id}: ${cat.count} tags`);
    });
    
    console.log('\n🎉 Tag seeding completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding tags:', error);
    process.exit(1);
  }
};

// Run the seeder
if (require.main === module) {
  seedTags();
}

module.exports = { seedTags, sampleTags };
