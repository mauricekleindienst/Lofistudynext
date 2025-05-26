import { supabaseAdmin } from '../../lib/supabase-admin'
import { requireAuth } from '../../lib/auth-helpers'

const handler = async (req, res) => {
  const { method } = req
  const user = req.user

  try {
    switch (method) {
      case 'GET':
        await getEventsHandler(req, res, user)
        break
      case 'POST':
        await addEventHandler(req, res, user)
        break
      case 'DELETE':
        await deleteEventHandler(req, res, user)
        break
      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.error('Calendar API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export default requireAuth(handler)

const addEventHandler = async (req, res, user) => {
  const { title, date } = req.body

  if (!title || !date) {
    return res.status(400).json({ error: "Title and date are required" })
  }

  try {
    const { data: newEvent, error } = await supabaseAdmin
      .from('events')
      .insert({
        email: user.email,
        title,
        date: new Date(date),
        user_id: user.id
      })
      .select()
      .single()

    if (error) throw error

    res.status(200).json({ 
      message: "Event added successfully", 
      id: newEvent.id 
    })
  } catch (error) {
    console.error("Error adding event:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

const getEventsHandler = async (req, res, user) => {
  try {
    const { data: events, error } = await supabaseAdmin
      .from('events')
      .select('id, title, date')
      .eq('user_id', user.id)
      .order('date', { ascending: true })

    if (error) throw error

    const formattedEvents = events.map((event) => ({
      ...event,
      start: event.date,
      end: event.date,
    }))

    res.status(200).json(formattedEvents)
  } catch (error) {
    console.error("Error fetching events:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

const deleteEventHandler = async (req, res, user) => {
  const { id } = req.body

  if (!id) {
    return res.status(400).json({ error: "Event ID is required" })
  }

  try {
    const { error } = await supabaseAdmin
      .from('events')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    res.status(200).json({ message: "Event deleted successfully" })
  } catch (error) {
    console.error("Error deleting event:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
