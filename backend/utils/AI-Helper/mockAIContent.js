// utils/mockAIContent.js
export const generateMockAIContent = (type, prompt) => {
  const baseContent = {
    explanation: `## Explanation of "${prompt}"\n\n**Overview**: Key ideas simplified.\n\n- Main concept\n- Applications\n- Best practices\n\n**Summary**: This gives a clear base understanding of ${prompt}.`,
    solution: `## Solution for "${prompt}"\n\n1. Problem Analysis\n2. Solution Steps\n3. Verification\n\n**Alt approaches** also possible.`,
    breakdown: `## Breakdown of "${prompt}"\n\n- Components\n- Dependencies\n- Flow\n\n**Key Insight**: ${prompt} is structured and systematic.`,
    analysis: `## Analysis of "${prompt}"\n\n- Strengths\n- Weaknesses\n- Implications\n- Recommendations`,
    summary: `## Summary of "${prompt}"\n\n- Key facts\n- Important takeaways\n- Next steps`,
  };
  return baseContent[type] || baseContent.explanation;
};
