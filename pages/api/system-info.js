import { createClient, createAdminClient } from '../../utils/supabase/server'

const handler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabaseAdmin = createAdminClient();

  try {
    // Get database connection info and basic stats
    const systemInfo = {
      timestamp: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        aud: user.aud
      },
      database: {
        connected: true,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'missing'
      }
    };

    // Try to get some basic counts from each table
    try {
      const [
        { count: pomodoroSessions },
        { count: todos },
        { count: notes },
        { count: events }      ] = await Promise.all([
        supabaseAdmin.from('pomodoro_sessions').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabaseAdmin.from('todos').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabaseAdmin.from('notes').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabaseAdmin.from('events').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
      ]);

      systemInfo.userStats = {
        pomodoroSessions: pomodoroSessions || 0,
        todos: todos || 0,
        notes: notes || 0,
        events: events || 0
      };
    } catch (error) {
      systemInfo.userStats = {
        error: 'Could not fetch user stats',
        message: error.message
      };
    }

    return res.status(200).json(systemInfo);
  } catch (error) {
    console.error('System info API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

export default handler;
