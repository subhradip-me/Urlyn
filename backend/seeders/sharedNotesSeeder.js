const Note = require('../models/core/Note');
const mongoose = require('mongoose');

// Demo user IDs for development
const DEMO_USERS = [
  '507f1f77bcf86cd799439011',
  '507f1f77bcf86cd799439012', 
  '507f1f77bcf86cd799439013',
  '507f1f77bcf86cd799439014'
];

const sharedNotesSampleData = [
  {
    title: "Calculus Study Group Notes",
    content: `# Calculus Study Group - Week 3

## Topics Covered:
1. **Derivatives of Trigonometric Functions**
   - sin(x) → cos(x)
   - cos(x) → -sin(x)
   - tan(x) → sec²(x)

2. **Integration Techniques**
   - Substitution method
   - Integration by parts
   - Partial fractions

## Practice Problems:
- Find ∫(2x + 1)dx = x² + x + C
- Solve d/dx[sin(3x)] = 3cos(3x)

## Study Tips from Sarah:
- Practice derivative rules daily
- Use graphing to visualize functions
- Work through problems step by step

*Next meeting: Thursday 3PM in Library Room 204*`,
    userId: DEMO_USERS[0],
    type: 'shared',
    isPublic: true,
    metadata: {
      author: 'Sarah Chen',
      subject: 'Mathematics',
      wordCount: 850,
      readingTime: 4,
      priority: 'high'
    },
    tagIds: []
  },
  {
    title: "Physics Lab Report Template",
    content: `# Physics Lab Report Template

## 1. Title Page
- Experiment name
- Date performed
- Student name and ID
- Lab partner(s)

## 2. Objective
State the purpose of the experiment clearly and concisely.

## 3. Theory
Provide background information and relevant equations.

## 4. Procedure
### Equipment:
- List all apparatus used
- Include model numbers if applicable

### Steps:
1. Setup description
2. Measurement procedures  
3. Safety considerations

## 5. Data & Observations
- Include tables and graphs
- Raw data with units
- Observations during experiment

## 6. Calculations
- Show sample calculations
- Include error analysis
- Statistical analysis if applicable

## 7. Results
- Summarize findings
- Compare with theoretical values

## 8. Discussion
- Explain any discrepancies
- Suggest improvements
- Applications of results

## 9. Conclusion
Brief summary of what was learned.

## 10. References
- Textbook citations
- Additional sources

*Remember: Always include units and significant figures!*`,
    userId: DEMO_USERS[1],
    type: 'shared',
    isPublic: true,
    metadata: {
      author: 'Mike Johnson',
      subject: 'Physics',
      wordCount: 650,
      readingTime: 3,
      priority: 'medium'
    },
    tagIds: []
  },
  {
    title: "Computer Science Algorithm Solutions",
    content: `# CS Algorithm Study Guide

## Sorting Algorithms

### 1. Bubble Sort
\`\`\`python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr
\`\`\`
**Time Complexity**: O(n²)
**Space Complexity**: O(1)

### 2. Quick Sort
\`\`\`python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)
\`\`\`
**Time Complexity**: O(n log n) average, O(n²) worst
**Space Complexity**: O(log n)

## Data Structures

### Binary Search Tree
- Left subtree values < root
- Right subtree values > root  
- In-order traversal gives sorted sequence

### Hash Tables
- Average O(1) lookup time
- Handle collisions with chaining or open addressing

## Tips for Technical Interviews:
1. Always clarify the problem
2. Think out loud
3. Start with brute force, then optimize
4. Test with edge cases
5. Analyze time/space complexity

*Good luck with your coding interviews! - Alex*`,
    userId: DEMO_USERS[2],
    type: 'shared',
    isPublic: true,
    metadata: {
      author: 'Alex Wong',
      subject: 'Computer Science',
      wordCount: 1200,
      readingTime: 6,
      priority: 'high'
    },
    tagIds: []
  },
  {
    title: "History Essay Research - World War I",
    content: `# World War I Research Notes

## Timeline of Major Events

### 1914
- **June 28**: Assassination of Archduke Franz Ferdinand
- **July 28**: Austria-Hungary declares war on Serbia
- **August**: Germany invades Belgium, Britain declares war

### 1915
- **April**: Gallipoli Campaign begins
- **May 7**: Lusitania sunk by German U-boat
- **October**: Bulgaria joins Central Powers

### 1916
- **July-November**: Battle of the Somme
- **December**: Romania enters war

### 1917
- **April**: United States enters war
- **November**: Russian Revolution begins
- **December**: Russia signs armistice

### 1918
- **March**: Germany's Spring Offensive
- **November 11**: Armistice signed

## Key Battles
1. **Battle of Marne (1914)** - Stopped German advance
2. **Verdun (1916)** - Longest single battle
3. **Somme (1916)** - Massive casualties
4. **Passchendaele (1917)** - Mud and horror

## Causes of War
- **Imperialism**: Competition for colonies
- **Alliances**: Complex web of treaties
- **Militarism**: Arms race between nations
- **Nationalism**: Ethnic tensions in Balkans

## Consequences
- 16+ million deaths
- Fall of four empires
- Russian Revolution
- Treaty of Versailles
- League of Nations created

## Primary Sources
- Letters from soldiers
- Government documents
- Newspaper reports
- Propaganda posters

*Use for WWI essay due next week - Emma*`,
    userId: DEMO_USERS[3],
    type: 'shared',
    isPublic: true,
    metadata: {
      author: 'Emma Davis',
      subject: 'History',
      wordCount: 950,
      readingTime: 5,
      priority: 'low'
    },
    tagIds: []
  }
];

const seedSharedNotes = async () => {
  try {
    console.log('🌱 Starting shared notes seeding...');
    
    // Clear existing shared notes
    await Note.deleteMany({ type: 'shared' });
    console.log('✅ Cleared existing shared notes');
    
    // Insert sample shared notes
    const insertedNotes = await Note.insertMany(sharedNotesSampleData);
    console.log(`✅ Inserted ${insertedNotes.length} shared notes`);
    
    console.log('🎉 Shared notes seeding completed successfully!');
    return insertedNotes;
  } catch (error) {
    console.error('❌ Shared notes seeding failed:', error);
    throw error;
  }
};

module.exports = { seedSharedNotes, sharedNotesSampleData };
