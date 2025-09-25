// utils/aiHelper.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Length Guidelines
const lengthGuidelines = {
  short: "Keep it concise and under 300 words",
  medium: "Provide a comprehensive response of 400-800 words",
  long: "Create a detailed explanation of 800-1500 words",
};

// Prompt Templates
const promptTemplates = {
  explanation: (u, s, l) => `
You are an expert educator. Explain: "${u}" in context of ${s || "General"}.
- Overview
- Key concepts with headings
- Examples and analogies
- Practical applications
- Summary of key takeaways
${lengthGuidelines[l] || lengthGuidelines.medium}
Use markdown formatting.`,
  
  solution: (u, s, l) => `
You are a problem solver. Solve: "${u}" in context of ${s || "General"}.
- Problem Analysis
- Solution Strategy
- Step-by-Step Solution
- Verification
- Alternatives
${lengthGuidelines[l] || lengthGuidelines.medium}
Use markdown formatting and code blocks.`,
  
  breakdown: (u, s, l) => `
You are a systems analyst. Breakdown: "${u}" in context of ${s || "General"}.
- Component Overview
- Component Analysis
- Dependencies
- Process Flow
- Key Insights
${lengthGuidelines[l] || lengthGuidelines.medium}
Use markdown formatting with diagrams if useful.`,
  
  analysis: (u, s, l) => `
You are a research analyst. Analyze: "${u}" in context of ${s || "General"}.
- Executive Summary
- Detailed Analysis
- Strengths & Weaknesses
- Implications
- Recommendations
${lengthGuidelines[l] || lengthGuidelines.medium}
Use markdown formatting.`,
  
  summary: (u, s, l) => `
You are a content synthesizer. Summarize: "${u}" in context of ${s || "General"}.
- Quick Overview
- Key Information
- Takeaways
- Action Items
- Related Topics
${lengthGuidelines[l] || lengthGuidelines.medium}
Use markdown formatting.`,
};

// Generate mock AI content as fallback
const generateMockAIContent = (type, userPrompt) => {
  const baseContent = {
    explanation: `This is a comprehensive explanation of "${userPrompt}".\n\n## Overview\n\nThis topic is important because it helps us understand fundamental concepts that apply to many situations.\n\n## Key Points\n\n1. **Main Concept**: The core idea behind this topic\n2. **Applications**: How this applies in real-world scenarios\n3. **Best Practices**: Recommended approaches and methods\n\n## Summary\n\nUnderstanding this concept provides a solid foundation for further learning and practical application.`,
    
    solution: `Here's a step-by-step solution for "${userPrompt}":\n\n## Problem Analysis\n\nFirst, let's break down what we're trying to solve.\n\n## Solution Steps\n\n1. **Step 1**: Initial setup and preparation\n2. **Step 2**: Implementation of core logic\n3. **Step 3**: Testing and validation\n4. **Step 4**: Final optimization\n\n## Verification\n\nTo ensure this solution works correctly, consider these validation steps.\n\n## Alternative Approaches\n\nOther methods you might consider include...`,
    
    breakdown: `Breaking down "${userPrompt}" into its components:\n\n## Component Overview\n\nThis system consists of several interconnected parts.\n\n## Individual Components\n\n### Component 1\n- Function: Primary processing\n- Dependencies: Input validation\n\n### Component 2\n- Function: Data transformation\n- Dependencies: Component 1 output\n\n## Process Flow\n\n1. Input → Validation → Processing → Output\n2. Each step builds on the previous one\n\n## Key Insights\n\nThe most important aspects to understand are...`,
    
    analysis: `In-depth analysis of "${userPrompt}":\n\n## Executive Summary\n\nThis analysis examines the key aspects and implications.\n\n## Detailed Analysis\n\n### Strengths\n- Advantage 1: Clear benefits\n- Advantage 2: Practical value\n\n### Weaknesses\n- Challenge 1: Potential limitations\n- Challenge 2: Areas for improvement\n\n## Recommendations\n\nBased on this analysis, we recommend:\n1. Focus on strengths\n2. Address key weaknesses\n3. Monitor progress regularly`,
    
    summary: `Summary of "${userPrompt}":\n\n## Quick Overview\n\nThe main points to understand are...\n\n## Key Information\n\n- **Important Fact 1**: Critical detail\n- **Important Fact 2**: Supporting information\n- **Important Fact 3**: Contextual background\n\n## Takeaways\n\n1. Primary insight\n2. Secondary consideration\n3. Action item\n\n## Related Topics\n\nFor further exploration, consider looking into...`
  };

  return baseContent[type] || baseContent.explanation;
};

// Main AI Helper
const generateAIContent = async (type, userPrompt, subject, length) => {
  const template = promptTemplates[type] || promptTemplates.explanation;
  const prompt = template(userPrompt, subject, length);

  try {
    const startTime = Date.now();
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const processingTime = (Date.now() - startTime) / 1000;

    return {
      content: responseText,
      metadata: {
        model: "Gemini-1.5-Flash",
        type,
        confidence: 95, // placeholder (could parse safetyRatings)
        processingTime: `${processingTime}s`,
        subject: subject || "General",
        wordCount: responseText.split(/\s+/).length,
        readingTime: `${Math.ceil(responseText.split(/\s+/).length / 200)} min`,
      },
    };
  } catch (error) {
    console.error("AI generation failed, fallback used:", error);
    return {
      content: generateMockAIContent(type, userPrompt),
      metadata: {
        model: "Mock-AI",
        type,
        confidence: 70,
        processingTime: "N/A",
        subject: subject || "General",
        wordCount: 0,
        readingTime: "N/A",
      },
    };
  }
};

export {
  generateAIContent
};
