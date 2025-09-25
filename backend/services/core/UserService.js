const User = require('../../models/core/User');
const StudentProfile = require('../../models/profiles/StudentProfile');
const CreatorProfile = require('../../models/profiles/CreatorProfile');
const WorkingProfile = require('../../models/profiles/WorkingProfile');

class UserService {
  // Get user with all profiles
  static async getUserWithProfiles(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Get all profile types for this user
      const [studentProfile, creatorProfile, workingProfile] = await Promise.all([
        StudentProfile.findOne({ userId }),
        CreatorProfile.findOne({ userId }),
        WorkingProfile.findOne({ userId })
      ]);

      return {
        user,
        profiles: {
          student: studentProfile,
          creator: creatorProfile,
          working: workingProfile
        },
        activeProfiles: [
          studentProfile && 'student',
          creatorProfile && 'creator', 
          workingProfile && 'working'
        ].filter(Boolean)
      };
    } catch (error) {
      throw new Error(`Failed to get user with profiles: ${error.message}`);
    }
  }

  // Create a new user
  static async createUser(userData) {
    try {
      const user = new User(userData);
      await user.save();
      return user;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('Email already exists');
      }
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  // Update user
  static async updateUser(userId, updateData) {
    try {
      const user = await User.findByIdAndUpdate(
        userId, 
        updateData, 
        { new: true, runValidators: true }
      );
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return user;
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  // Create profile for user
  static async createProfile(userId, profileType, profileData) {
    try {
      let profile;
      const baseData = { userId, ...profileData };

      switch (profileType) {
        case 'student':
          profile = new StudentProfile(baseData);
          break;
        case 'creator':
          profile = new CreatorProfile(baseData);
          break;
        case 'working':
          profile = new WorkingProfile(baseData);
          break;
        default:
          throw new Error('Invalid profile type');
      }

      await profile.save();
      return profile;
    } catch (error) {
      throw new Error(`Failed to create ${profileType} profile: ${error.message}`);
    }
  }

  // Update profile
  static async updateProfile(userId, profileType, updateData) {
    try {
      let ProfileModel;
      
      switch (profileType) {
        case 'student':
          ProfileModel = StudentProfile;
          break;
        case 'creator':
          ProfileModel = CreatorProfile;
          break;
        case 'working':
          ProfileModel = WorkingProfile;
          break;
        default:
          throw new Error('Invalid profile type');
      }

      const profile = await ProfileModel.findOneAndUpdate(
        { userId },
        updateData,
        { new: true, runValidators: true }
      );

      if (!profile) {
        throw new Error(`${profileType} profile not found`);
      }

      return profile;
    } catch (error) {
      throw new Error(`Failed to update ${profileType} profile: ${error.message}`);
    }
  }

  // Delete profile
  static async deleteProfile(userId, profileType) {
    try {
      let ProfileModel;
      
      switch (profileType) {
        case 'student':
          ProfileModel = StudentProfile;
          break;
        case 'creator':
          ProfileModel = CreatorProfile;
          break;
        case 'working':
          ProfileModel = WorkingProfile;
          break;
        default:
          throw new Error('Invalid profile type');
      }

      const result = await ProfileModel.findOneAndDelete({ userId });
      if (!result) {
        throw new Error(`${profileType} profile not found`);
      }

      return { message: `${profileType} profile deleted successfully` };
    } catch (error) {
      throw new Error(`Failed to delete ${profileType} profile: ${error.message}`);
    }
  }

  // Get specific profile
  static async getProfile(userId, profileType) {
    try {
      let ProfileModel;
      
      switch (profileType) {
        case 'student':
          ProfileModel = StudentProfile;
          break;
        case 'creator':
          ProfileModel = CreatorProfile;
          break;
        case 'working':
          ProfileModel = WorkingProfile;
          break;
        default:
          throw new Error('Invalid profile type');
      }

      const profile = await ProfileModel.findOne({ userId });
      return profile;
    } catch (error) {
      throw new Error(`Failed to get ${profileType} profile: ${error.message}`);
    }
  }
}

module.exports = UserService;
