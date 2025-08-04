// src/services/resumeService.ts

import pdfParse from 'pdf-parse';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Ensure your GEMINI_API_KEY is correctly set in your .env file
// For example: GEMINI_API_KEY=YOUR_API_KEY_HERE
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const extractTextFromResume = async (buffer: Buffer): Promise<string> => {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from resume.');
  }
};

export const generateInterviewQuestions = async (
  resumeText: string,
  role: string
): Promise<string[]> => {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-pro', // Using gemini-2.5-pro as discussed
    });

    // --- UPDATED PROMPT START ---
  const prompt = `
You are a professional career advisor and interviewer. Based on the provided resume text and the job role "${role}", generate the following:

1.  **Personalized Interview Questions (Minimum 8 questions):**
    * In-depth questions about the projects mentioned in the resume, focusing on architecture, challenges, specific technologies used, and outcomes.
    * Questions related to the skills listed in the resume (e.g., specific programming languages, frameworks, databases, tools), assessing practical application, understanding, and problem-solving.
    * Behavioral or situational questions relevant to the role, drawing insights from their experiences.

2.  **Top 5 Companies to Target for this Role:**
    * **List these companies directly after this heading, for example: "Top Companies to Target for this Role:\n1. Company A\n2. Company B..."**
    * Suggest reputable companies that frequently hire for a "${role}" position, especially those known for a good tech culture or relevant projects.

3.  **General Most Asked Questions for this Role (Minimum 5 questions):**
    * List common, fundamental interview questions typically asked for a "${role}" position that are not directly personalized to the resume, covering core concepts, data structures, algorithms, or system design.

Resume:
${resumeText}

Format your output clearly with distinct, bolded headers for "Personalized Interview Questions", "Top 5 Companies to Target for this Role", and "General Most Asked Questions for this Role". Use numbered lists for all questions and for the company suggestions. Do not include any extra introductory or concluding text outside these structured sections.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && /^[\d\-\•*]/.test(line)); // Filter to ensure proper question format
  } catch (error) {
    console.error('Gemini error:', error);
    throw new Error('Failed to generate questions using Gemini. Please check API key and model availability.');
  }
};