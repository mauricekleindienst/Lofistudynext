import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getSession({ req });
  const { id } = req.query;
  
  // Check authentication and admin status
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Replace this array with your actual admin emails or a more robust system
  const admins = ['admin@lofi.study', 'your-admin-email@example.com', 'kleindiema@gmail.com'];
  
  if (!admins.includes(session.user.email)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // GET: Retrieve a specific feedback item
  if (req.method === 'GET') {
    try {
      const feedback = await prisma.feedback.findUnique({
        where: { id: parseInt(id, 10) },
      });
      
      if (!feedback) {
        return res.status(404).json({ error: 'Feedback not found' });
      }
      
      return res.status(200).json({ data: feedback });
    } catch (error) {
      console.error('Error retrieving feedback:', error);
      return res.status(500).json({ error: 'Failed to retrieve feedback' });
    }
  }
  
  // PATCH: Update a feedback status or add response
  if (req.method === 'PATCH') {
    try {
      const { status, response } = req.body;
      
      // Validate input
      if (!status && !response) {
        return res.status(400).json({ error: 'At least one field must be updated' });
      }
      
      // Build the update data
      const updateData = {};
      if (status) updateData.status = status;
      if (response) updateData.response = response;
      
      // Update the feedback
      const updatedFeedback = await prisma.feedback.update({
        where: { id: parseInt(id, 10) },
        data: updateData,
      });
      
      return res.status(200).json({ data: updatedFeedback });
    } catch (error) {
      console.error('Error updating feedback:', error);
      return res.status(500).json({ error: 'Failed to update feedback' });
    }
  }
  
  // DELETE: Remove a feedback item
  if (req.method === 'DELETE') {
    try {
      await prisma.feedback.delete({
        where: { id: parseInt(id, 10) },
      });
      
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting feedback:', error);
      return res.status(500).json({ error: 'Failed to delete feedback' });
    }
  }
  
  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
} 