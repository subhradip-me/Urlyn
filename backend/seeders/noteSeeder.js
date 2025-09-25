const mongoose = require('mongoose');
const Note = require('../models/core/Note');
const User = require('../models/common/User');
const Tag = require('../models/core/Tag');

const sampleNotes = async () => {
  try {
    // Find a student user
    const student = await User.findOne({ currentPersona: 'student' }) || 
                   await User.findOne({ accountType: 'student' });
    
    if (!student) {
      console.log('No student user found. Please create a student user first.');
      return;
    }

    // Find some tags to associate with notes
    const tags = await Tag.find({ userId: student._id }).limit(5);
    const tagIds = tags.map(tag => tag._id);

    const notes = [
      {
        userId: student._id,
        title: "Calculus Study Notes",
        content: `# Calculus Study Notes

## Derivatives
The derivative of a function measures the rate at which the function's output changes with respect to its input.

### Basic Rules:
- Power Rule: d/dx(x^n) = nx^(n-1)
- Product Rule: d/dx(fg) = f'g + fg'
- Chain Rule: d/dx(f(g(x))) = f'(g(x)) * g'(x)

### Examples:
1. d/dx(3x²) = 6x
2. d/dx(sin(x)) = cos(x)
3. d/dx(e^x) = e^x

## Integration
Integration is the reverse process of differentiation.

### Fundamental Theorem of Calculus:
∫[a to b] f'(x) dx = f(b) - f(a)

### Common Integrals:
- ∫x^n dx = x^(n+1)/(n+1) + C
- ∫sin(x) dx = -cos(x) + C
- ∫e^x dx = e^x + C`,
        contentType: 'markdown',
        tagIds: tagIds.slice(0, 2),
        priority: 'high',
        isPublic: true
      },
      {
        userId: student._id,
        title: "Physics Lab Report - Pendulum Experiment",
        content: `# Simple Pendulum Experiment

## Objective
To determine the relationship between the period of a simple pendulum and its length.

## Hypothesis
The period of a pendulum is proportional to the square root of its length.

## Materials
- String (various lengths)
- Metal bob
- Stopwatch
- Ruler
- Protractor

## Procedure
1. Set up pendulum with 20cm string
2. Release from 15° angle
3. Time 10 complete oscillations
4. Calculate average period
5. Repeat for different lengths (30cm, 40cm, 50cm, 60cm)

## Results
| Length (cm) | Time for 10 oscillations (s) | Period (s) | Period² (s²) |
|-------------|------------------------------|------------|--------------|
| 20          | 8.94                        | 0.894      | 0.799        |
| 30          | 10.95                       | 1.095      | 1.199        |
| 40          | 12.65                       | 1.265      | 1.601        |
| 50          | 14.14                       | 1.414      | 2.000        |
| 60          | 15.49                       | 1.549      | 2.399        |

## Conclusion
The experimental data confirms that T² ∝ L, supporting the theoretical formula T = 2π√(L/g).`,
        contentType: 'markdown',
        tagIds: tagIds.slice(1, 3),
        priority: 'medium',
        isPublic: false
      },
      {
        userId: student._id,
        title: "AI-Generated: JavaScript Concepts Explanation",
        content: `AI-generated content based on: "JavaScript closures and scope"

This is a explanation for Computer Science.

## Explanation

Here's a detailed explanation of JavaScript closures and scope:

### Key Concepts: Understanding the fundamental principles

1. **Lexical Scope**: JavaScript uses lexical scoping, which means that functions have access to variables defined in their outer scope at the time they were defined.

2. **Closure**: A closure is created when a function is defined inside another function and has access to the outer function's variables even after the outer function has returned.

3. **Variable Lifetime**: Variables in closures maintain their values even after the outer function execution has completed.

### Applications: Real-world examples and use cases

\`\`\`javascript
// Example 1: Basic Closure
function outerFunction(x) {
  return function innerFunction(y) {
    return x + y; // Inner function has access to x
  };
}

const addFive = outerFunction(5);
console.log(addFive(3)); // 8

// Example 2: Counter using Closure
function createCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
\`\`\`

### Important Notes: Critical points to remember

- Closures can cause memory leaks if not handled properly
- They're commonly used in module patterns and event handlers
- Understanding closures is essential for mastering JavaScript

### Summary
This covers the essential aspects of JavaScript closures and scope in a comprehensive manner.`,
        contentType: 'markdown',
        tagIds: tagIds.slice(0, 1),
        priority: 'medium',
        isPublic: true
      },
      {
        userId: student._id,
        title: "History Essay Notes - World War I",
        content: `# World War I - Key Points

## Causes of WWI
### Long-term causes:
- Imperialism and colonial competition
- Alliance system (Triple Alliance vs Triple Entente)
- Nationalism in the Balkans
- Arms race and militarism

### Immediate cause:
- Assassination of Archduke Franz Ferdinand (June 28, 1914)

## Major Events
- **1914**: War begins, Battle of the Marne
- **1915**: Gallipoli Campaign, Lusitania sinking
- **1916**: Battle of Verdun, Battle of the Somme
- **1917**: Russian Revolution, US enters the war
- **1918**: German Spring Offensive, Armistice (November 11)

## Consequences
- ~17 million deaths
- Fall of four empires (German, Austrian, Russian, Ottoman)
- Treaty of Versailles
- Russian Revolution and rise of communism
- Economic devastation in Europe

## Key Figures
- Kaiser Wilhelm II (Germany)
- Tsar Nicholas II (Russia)
- President Woodrow Wilson (USA)
- General Ferdinand Foch (France)`,
        contentType: 'markdown',
        tagIds: tagIds.slice(2, 4),
        priority: 'low',
        isPublic: false
      },
      {
        userId: student._id,
        title: "Quick Notes - Chemistry Formulas",
        content: `Important Chemistry Formulas:

Ideal Gas Law: PV = nRT
Where: P = pressure, V = volume, n = moles, R = gas constant, T = temperature

Molarity: M = n/V
Where: M = molarity, n = moles of solute, V = volume of solution in liters

pH = -log[H+]
pOH = -log[OH-]
pH + pOH = 14 (at 25°C)

Rate Law: Rate = k[A]^m[B]^n
Where: k = rate constant, [A] and [B] = concentrations, m and n = reaction orders

Arrhenius Equation: k = Ae^(-Ea/RT)
Where: k = rate constant, A = pre-exponential factor, Ea = activation energy`,
        contentType: 'text',
        tagIds: tagIds.slice(1, 2),
        priority: 'medium',
        isPublic: true
      },
      {
        userId: student._id,
        title: "AI Summary: Database Normalization",
        content: `AI-generated content based on: "Database normalization forms"

This is a summary for Computer Science.

## Summary

**Topic**: Database normalization forms

**Key Points**:
- **First Normal Form (1NF)**: Eliminates repeating groups and ensures atomic values
- **Second Normal Form (2NF)**: Achieves 1NF and eliminates partial dependencies
- **Third Normal Form (3NF)**: Achieves 2NF and eliminates transitive dependencies

### Detailed Breakdown:

**1NF Requirements:**
- Each column contains atomic (indivisible) values
- Each row is unique
- No repeating groups

**2NF Requirements:**
- Must be in 1NF
- All non-key attributes must be fully functionally dependent on the primary key
- Eliminates partial dependencies

**3NF Requirements:**
- Must be in 2NF
- No transitive dependencies (non-key attributes should not depend on other non-key attributes)

**Conclusion**: Brief overview of the essential information - Database normalization reduces redundancy and improves data integrity by organizing data into well-structured tables following these normal forms.`,
        contentType: 'markdown',
        tagIds: tagIds.slice(0, 2),
        priority: 'high',
        isPublic: false
      }
    ];

    // Clear existing notes for this user
    await Note.deleteMany({ userId: student._id });

    // Insert new notes
    const createdNotes = await Note.insertMany(notes);

    console.log(`✅ Created ${createdNotes.length} sample notes for user: ${student.email}`);
    console.log('Sample notes:');
    createdNotes.forEach(note => {
      console.log(`- ${note.title} (${note.contentType}, ${note.priority} priority)`);
    });

  } catch (error) {
    console.error('Error creating sample notes:', error);
  }
};

module.exports = sampleNotes;

// Run if called directly
if (require.main === module) {
  const connectDB = require('../config/database');
  connectDB().then(() => {
    sampleNotes().then(() => {
      process.exit(0);
    });
  });
}
