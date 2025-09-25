const Note = require('../models/core/Note');
const mongoose = require('mongoose');

// Demo user ID for development
const DEMO_USER_ID = '507f1f77bcf86cd799439011';

const aiNotesSampleData = [
  {
    title: "Calculus Derivatives Explained",
    content: `## Understanding Derivatives in Calculus

Derivatives are one of the fundamental concepts in calculus, representing the rate of change of a function with respect to its variable.

### Key Rules:

1. **Power Rule**: If f(x) = x^n, then f'(x) = nx^(n-1)
2. **Product Rule**: (fg)' = f'g + fg'
3. **Chain Rule**: (f(g(x)))' = f'(g(x)) · g'(x)

### Example:
Find the derivative of f(x) = 3x² + 2x - 5

Solution:
- f'(x) = 6x + 2

This shows how the rate of change varies with x.`,
    userId: DEMO_USER_ID,
    type: 'ai-generated',
    isPublic: true,
    aiMetadata: {
      model: 'GPT-4',
      prompt: 'Explain calculus derivatives with examples',
      confidence: 95,
      generationType: 'explanation'
    },
    tagIds: []
  },
  {
    title: "Physics Momentum Conservation Solution",
    content: `## Momentum Conservation Problem Solution

**Problem**: Two objects collide. Object A (mass = 2kg, velocity = 5m/s) hits Object B (mass = 3kg, at rest). Find velocities after elastic collision.

### Given:
- m₁ = 2 kg, v₁ᵢ = 5 m/s
- m₂ = 3 kg, v₂ᵢ = 0 m/s
- Elastic collision

### Solution:

For elastic collision, we use:
1. Conservation of momentum: m₁v₁ᵢ + m₂v₂ᵢ = m₁v₁f + m₂v₂f
2. Conservation of kinetic energy: ½m₁v₁ᵢ² + ½m₂v₂ᵢ² = ½m₁v₁f² + ½m₂v₂f²

### Calculations:
- Initial momentum: (2)(5) + (3)(0) = 10 kg·m/s
- v₁f = [(m₁-m₂)/(m₁+m₂)]v₁ᵢ = [(2-3)/(2+3)](5) = -1 m/s
- v₂f = [2m₁/(m₁+m₂)]v₁ᵢ = [2(2)/(2+3)](5) = 4 m/s

**Answer**: Object A: -1 m/s, Object B: 4 m/s`,
    userId: DEMO_USER_ID,
    type: 'ai-generated',
    isPublic: true,
    aiMetadata: {
      model: 'GPT-4',
      prompt: 'Solve this momentum conservation problem',
      confidence: 88,
      generationType: 'solution'
    },
    tagIds: []
  },
  {
    title: "Organic Chemistry Reaction Mechanisms",
    content: `## SN1 vs SN2 Reaction Mechanisms

### SN2 (Substitution Nucleophilic Bimolecular)

**Characteristics:**
- One-step mechanism
- Rate depends on both nucleophile and substrate
- Inversion of stereochemistry
- Works best with primary carbons

**Mechanism:**
Nu⁻ + R-X → Nu-R + X⁻

### SN1 (Substitution Nucleophilic Unimolecular)

**Characteristics:**
- Two-step mechanism
- Rate depends only on substrate
- Racemization occurs
- Works best with tertiary carbons

**Mechanism:**
Step 1: R-X → R⁺ + X⁻ (slow)
Step 2: R⁺ + Nu⁻ → Nu-R (fast)

### Key Differences:
- **Rate**: SN2 = k[RX][Nu], SN1 = k[RX]
- **Stereochemistry**: SN2 inverts, SN1 racemizes
- **Substrate**: SN2 prefers 1°, SN1 prefers 3°`,
    userId: DEMO_USER_ID,
    type: 'ai-generated',
    isPublic: true,
    aiMetadata: {
      model: 'Claude',
      prompt: 'Break down SN1 vs SN2 reactions',
      confidence: 92,
      generationType: 'breakdown'
    },
    tagIds: []
  }
];

const seedAiNotes = async () => {
  try {
    console.log('🌱 Starting AI notes seeding...');
    
    // Clear existing AI notes
    await Note.deleteMany({ type: 'ai-generated' });
    console.log('✅ Cleared existing AI notes');
    
    // Insert sample AI notes
    const insertedNotes = await Note.insertMany(aiNotesSampleData);
    console.log(`✅ Inserted ${insertedNotes.length} AI notes`);
    
    console.log('🎉 AI notes seeding completed successfully!');
    return insertedNotes;
  } catch (error) {
    console.error('❌ AI notes seeding failed:', error);
    throw error;
  }
};

module.exports = { seedAiNotes, aiNotesSampleData };
