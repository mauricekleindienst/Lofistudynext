import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getSession({ req });
  
  // GET: Retrieve feedback (admin only)
  if (req.method === 'GET') {
    // Make sure we have a session and the user is an admin
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      // Check if the user is an admin
      // Replace this array with your actual admin emails or a more robust system
      const admins = ['admin@lofi.study', 'your-admin-email@example.com', 'kleindiema@gmail.com'];
      
      if (!admins.includes(session.user.email)) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      // Get query parameters
      const { status, page = '1', limit = '10' } = req.query;
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const skip = (pageNum - 1) * limitNum;

      // Build the query
      const where = {};
      if (status) {
        where.status = status;
      }

      // Get feedback with pagination
      const [feedback, totalCount] = await Promise.all([
        prisma.feedback.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limitNum,
        }),
        prisma.feedback.count({ where }),
      ]);

      // Return feedback with pagination info
      return res.status(200).json({
        data: feedback,
        pagination: {
          total: totalCount,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(totalCount / limitNum),
        },
      });
    } catch (error) {
      console.error('Error retrieving feedback:', error);
      return res.status(500).json({ error: 'Failed to retrieve feedback' });
    }
  }

  // POST: Submit new feedback
  if (req.method === 'POST') {
    try {
      const { email, message } = req.body;

      // Validate input
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Use session email if available, otherwise use the provided email
      const userEmail = session?.user?.email || email || 'anonymous';

      // Create the feedback entry
      const feedback = await prisma.feedback.create({
        data: {
          email: userEmail,
          message,
          status: 'pending',
        },
      });

      return res.status(201).json({ success: true, data: feedback });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return res.status(500).json({ error: 'Failed to submit feedback' });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
} 