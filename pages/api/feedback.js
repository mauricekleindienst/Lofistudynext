import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getSession({ req });
    const { email, message, status } = req.body;

    // Validate required fields
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Create feedback entry
    const feedback = await prisma.feedback.create({
      data: {
        email: email || 'anonymous',
        message,
        status: status || 'pending'
      }
    });

    return res.status(201).json(feedback);
  } catch (error) {
    console.error('Error creating feedback:', error);
    return res.status(500).json({ message: 'Error creating feedback' });
  } finally {
    await prisma.$disconnect();
  }
} 