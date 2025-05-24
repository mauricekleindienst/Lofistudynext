import { supabase } from '../../lib/supabase-admin'
import { requireAuth } from '../../lib/auth-helpers'

const handler = async (req, res) => {
  const { method } = req
  const user = req.user

  try {
    switch (method) {
      case 'GET':
        await getNotesHandler(req, res, user)
        break
      case 'POST':
        await saveNoteHandler(req, res, user)
        break
      case 'DELETE':
        await deleteNoteHandler(req, res, user)
        break
      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.error('Notes API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export default requireAuth(handler)

const getNotesHandler = async (req, res, user) => {
  try {
    const { data: notes, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) throw error

    res.status(200).json(notes)
  } catch (error) {
    console.error("Error fetching notes:", error)
    res.status(500).json({ error: "Internal server error" })
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
      const { data: note, error } = await supabase
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

      if (error) throw error

      res.status(200).json({ message: "Note updated successfully", note })
    } else {
      // Create new note
      const { data: note, error } = await supabase
        .from('notes')
        .insert({
          email: user.email,
          title,
          content,
          user_id: user.id
        })
        .select()
        .single()

      if (error) throw error

      res.status(201).json({ message: "Note created successfully", note })
    }
  } catch (error) {
    console.error("Error saving note:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

const deleteNoteHandler = async (req, res, user) => {
  const { id } = req.body

  if (!id) {
    return res.status(400).json({ error: "Note ID is required" })
  }

  try {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    res.status(200).json({ message: "Note deleted successfully" })
  } catch (error) {
    console.error("Error deleting note:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
