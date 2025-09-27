import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/common/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createTestUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find the target user ID that the frontend expects
    const targetId = '68d0e521d89923fb4cf80d54';
    let testUser = await User.findById(targetId);
    
    if (!testUser) {
      // Create user with the exact ID the frontend expects
      testUser = new User({
        _id: new mongoose.Types.ObjectId(targetId),
        firstName: 'Test',
        lastName: 'User',
        email: 'test-dev@example.com', // Use unique email
        password: 'password123',
        personas: ['student'],
        currentPersona: 'student'
      });
      
      await testUser.save();
      console.log('✅ Test user created with target ID:', testUser._id);
    } else {
      // Update existing user to ensure correct personas
      if (!testUser.personas || testUser.personas.length === 0) {
        testUser.personas = ['student'];
      }
      if (!testUser.currentPersona) {
        testUser.currentPersona = 'student';
      }
      
      await testUser.save();
      console.log('✅ Test user updated:', testUser._id);
    }
    
    console.log('Final user state:');
    console.log('- ID:', testUser._id);
    console.log('- Email:', testUser.email);
    console.log('- Name:', testUser.firstName, testUser.lastName);
    console.log('- Personas:', testUser.personas);
    console.log('- Current Persona:', testUser.currentPersona);

    // Test the addPersona method
    console.log('\n🧪 Testing addPersona method...');
    try {
      await testUser.addPersona('professional');
      console.log('✅ Successfully added professional persona');
      console.log('Updated personas:', testUser.personas);
    } catch (error) {
      console.error('❌ Error adding persona:', error.message);
    }

  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

createTestUser();
