// src/controllers/resumeController.ts
import { Request, Response } from 'express';
import { extractTextFromResume, generateInterviewQuestions } from '../services/resumeService';

export const uploadResume = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }

  const role = req.body.role;
  if (!role) {
    res.status(400).json({ message: 'Role is required' });
    return;
  }

  try {
    const text = await extractTextFromResume(req.file.buffer);
    const questions = await generateInterviewQuestions(text, role);

    res.status(200).json({
      message: 'Resume processed successfully',
      questions,
    });
  } catch (error) {
    console.error('Error processing resume:', error);
    res.status(500).json({ message: 'Resume processing failed' });
  }
};
