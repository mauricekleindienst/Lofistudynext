import { supabase } from '../../lib/supabase-admin'
import { requireAuth } from '../../lib/auth-helpers'
import { executeWithRetry } from '../../lib/supabase-retry'

const handler = async (req, res) => {
  const { method } = req
  const user = req.user

  console.log(`Notes API ${method} request from user:`, user?.email || 'unauthenticated')

  try {
    switch (method) {
      case 'GET':
        await getNotesHandler(req, res, user)
        break
      case 'POST':
        await saveNoteHandler(req, res, user)
        break
      case 'PUT':
        await saveNoteHandler(req, res, user)
        break
      case 'DELETE':
        await deleteNoteHandler(req, res, user)
        break
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.error('Notes API error:', error)
    res.status(500).json({ error: 'Internal server error', details: error.message })
  }
}

export default requireAuth(handler)

const getNotesHandler = async (req, res, user) => {
  try {
    const result = await executeWithRetry(async () => {
      return await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
    }, { maxRetries: 2, retryDelay: 500 });

    if (result.error) throw result.error;

    res.status(200).json(result.data);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
}

const saveNoteHandler = async (req, res, user) => {
  const { title, content, id } = req.body

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" })
  }

  try {
    if (id) {
      // Update existing note
      const result = await executeWithRetry(async () => {
        return await supabase
          .from('notes')
          .update({
            title,
            content,
            updated_at: new Date()
          })
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single()
      }, { maxRetries: 2, retryDelay: 500 });

      if (result.error) throw result.error;

      res.status(200).json(result.data);
    } else {
      // Create new note
      const result = await executeWithRetry(async () => {
        return await supabase
          .from('notes')
          .insert({
            title,
            content,
            user_id: user.id,
            created_at: new Date(),
            updated_at: new Date()
          })
          .select()
          .single()
      }, { maxRetries: 2, retryDelay: 500 });

      if (result.error) throw result.error;      res.status(201).json(result.data);
    }
  } catch (error) {
    console.error("Error saving note:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
}

const deleteNoteHandler = async (req, res, user) => {
  const { id } = req.body

  if (!id) {
    return res.status(400).json({ error: "Note ID is required" })
  }

  try {
    const result = await executeWithRetry(async () => {
      return await supabase
        .from('notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)
    }, { maxRetries: 2, retryDelay: 500 });

    if (result.error) throw result.error;

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
}
