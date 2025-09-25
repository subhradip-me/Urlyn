import mongoose from 'mongoose';
import './config/database.js';

// Import both models
import CoreBookmark from './models/core/Bookmark.js';
import StudentBookmark from './models/student/Bookmark.js';

async function checkBookmarks() {
    try {
        console.log('🔍 Checking bookmark models and data...');
        
        // Check core bookmarks
        const coreBookmarks = await CoreBookmark.find().limit(3);
        console.log('\n📊 Core Bookmarks:');
        console.log('Count:', await CoreBookmark.countDocuments());
        if (coreBookmarks.length > 0) {
            console.log('Sample:', JSON.stringify(coreBookmarks[0], null, 2));
        }
        
        // Check student bookmarks  
        const studentBookmarks = await StudentBookmark.find().limit(3);
        console.log('\n🎓 Student Bookmarks:');
        console.log('Count:', await StudentBookmark.countDocuments());
        if (studentBookmarks.length > 0) {
            console.log('Sample:', JSON.stringify(studentBookmarks[0], null, 2));
        }
        
        // Check collections in database
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\n📁 Database Collections:');
        collections.forEach(col => {
            if (col.name.includes('bookmark')) {
                console.log(`- ${col.name}`);
            }
        });
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.disconnect();
    }
}

checkBookmarks();
