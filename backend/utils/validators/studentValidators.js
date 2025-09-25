class StudentValidators {
  static validateCourseFilters(query) {
    const { page, limit, category, level, search } = query;
    
    const filters = {
      page: Math.max(1, parseInt(page) || 1),
      limit: Math.min(50, Math.max(1, parseInt(limit) || 10)), // Max 50 items per page
      category: category && category !== 'all' ? category : undefined,
      level: level && level !== 'all' ? level : undefined,
      search: search ? search.trim() : undefined
    };

    // Remove undefined values
    return Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined)
    );
  }

  static validateNoteFilters(query) {
    const { page, limit, category, search } = query;
    
    const filters = {
      page: Math.max(1, parseInt(page) || 1),
      limit: Math.min(50, Math.max(1, parseInt(limit) || 10)),
      category: category && category !== 'all' ? category : undefined,
      search: search ? search.trim() : undefined
    };

    return Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined)
    );
  }

  static validateNoteData(data) {
    const { title, content, category, tags, course } = data;
    
    if (!title || title.trim().length === 0) {
      throw new Error('Note title is required');
    }
    
    if (!content || content.trim().length === 0) {
      throw new Error('Note content is required');
    }

    if (title.length > 200) {
      throw new Error('Note title must be less than 200 characters');
    }

    if (content.length > 10000) {
      throw new Error('Note content must be less than 10,000 characters');
    }

    return {
      title: title.trim(),
      content: content.trim(),
      category: category || 'general',
      tags: Array.isArray(tags) ? tags.filter(tag => tag.trim()).map(tag => tag.trim()) : [],
      course: course || null
    };
  }

  static validateAssignmentStatus(status) {
    const validStatuses = ['all', 'pending', 'submitted', 'overdue'];
    
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
    
    return status;
  }

  static validateSubmissionData(data) {
    const { content, attachments } = data;
    
    if (!content || content.trim().length === 0) {
      throw new Error('Submission content is required');
    }

    if (content.length > 5000) {
      throw new Error('Submission content must be less than 5,000 characters');
    }

    return {
      content: content.trim(),
      attachments: Array.isArray(attachments) ? attachments : []
    };
  }

  static validateBookmarkData(data) {
    const { url, title, description, category, tags, folder } = data;
    
    if (!url || url.trim().length === 0) {
      throw new Error('URL is required');
    }
    
    // Basic URL validation
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(url)) {
      throw new Error('Please provide a valid URL starting with http:// or https://');
    }
    
    if (title && title.length > 200) {
      throw new Error('Title must be less than 200 characters');
    }
    
    if (description && description.length > 500) {
      throw new Error('Description must be less than 500 characters');
    }
    
    if (category && !['academic', 'research', 'tools', 'tutorials', 'reference', 'news', 'entertainment', 'other'].includes(category)) {
      throw new Error('Invalid category');
    }
    
    if (tags && Array.isArray(tags)) {
      if (tags.length > 10) {
        throw new Error('Maximum 10 tags allowed');
      }
      
      tags.forEach(tag => {
        if (typeof tag !== 'string' || tag.length > 50) {
          throw new Error('Each tag must be a string with less than 50 characters');
        }
      });
    }
    
    if (folder && folder.length > 100) {
      throw new Error('Folder name must be less than 100 characters');
    }

    return {
      url: url.trim(),
      title: title ? title.trim() : undefined,
      description: description ? description.trim() : undefined,
      category: category || 'other',
      tags: tags || [],
      folder: folder ? folder.trim() : 'General'
    };
  }

  static validateBookmark(data) {
    return this.validateBookmarkData(data);
  }
}

module.exports = StudentValidators;
