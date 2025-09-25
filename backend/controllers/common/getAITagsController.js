import asyncHandler from 'express-async-handler';

// Helper function for rule-based tag generation
const generateRuleBasedTags = (content, existingTags = []) => {
  const text = content.toLowerCase();
  const tags = new Set(existingTags.map(tag => tag.toLowerCase()));

  // Technology related keywords
  const techKeywords = {
    'javascript': ['javascript', 'js', 'node', 'react', 'vue', 'angular'],
    'python': ['python', 'django', 'flask', 'pandas'],
    'technology': ['tech', 'software', 'programming', 'code', 'development'],
    'web': ['web', 'html', 'css', 'frontend', 'backend'],
    'database': ['database', 'sql', 'mysql', 'mongodb', 'postgres'],
    'ai': ['ai', 'artificial intelligence', 'machine learning', 'ml'],
    'tutorial': ['tutorial', 'guide', 'how to', 'learn'],
    'article': ['article', 'blog', 'post', 'news'],
    'reference': ['reference', 'documentation', 'docs', 'api']
  };

  // Check for keyword matches
  Object.entries(techKeywords).forEach(([tag, keywords]) => {
    if (keywords.some(keyword => text.includes(keyword))) {
      tags.add(tag);
    }
  });

  // Limit to 5 tags maximum
  return Array.from(tags).slice(0, 5);
};

// @desc    Generate AI tags for content
// @route   POST /api/ai-tags
// @access  Private
const generateAITags = asyncHandler(async (req, res) => {
  const { content, existingTags = [] } = req.body;

  if (!content) {
    res.status(400);
    throw new Error('Content is required');
  }

  try {
    // Simple rule-based tag generation as fallback
    const suggestedTags = generateRuleBasedTags(content, existingTags);
    
    res.json({
      success: true,
      data: {
        suggestedTags,
        confidence: 0.7, // Medium confidence for rule-based tags
        method: 'rule-based'
      }
    });
    
  } catch (error) {
    console.error('Error generating AI tags:', error);
    res.status(500);
    throw new Error('Failed to generate AI tags');
  }
});

// @desc    Generate AI tags for multiple contents
// @route   POST /api/ai-tags/batch
// @access  Private  
const generateBatchAITags = asyncHandler(async (req, res) => {
  const { contents } = req.body;

  if (!contents || !Array.isArray(contents)) {
    res.status(400);
    throw new Error('Contents array is required');
  }

  try {
    const results = contents.map(({ content, existingTags = [] }) => {
      const suggestedTags = generateRuleBasedTags(content, existingTags);
      return {
        suggestedTags,
        confidence: 0.7,
        method: 'rule-based'
      };
    });

    res.json({
      success: true,
      data: results
    });
    
  } catch (error) {
    console.error('Error generating batch AI tags:', error);
    res.status(500);
    throw new Error('Failed to generate batch AI tags');
  }
});

export {
  generateAITags,
  generateBatchAITags
};
