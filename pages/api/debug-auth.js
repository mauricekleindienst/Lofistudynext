import { createClient } from '../../utils/supabase/server'

export default async function handler(req, res) {
  console.log('=== AUTH DEBUG ===')
  console.log('Headers:', req.headers)
  console.log('Cookies:', req.cookies)
  
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    console.log('Auth result:', { user: user?.email, error: error?.message })
    
    if (user) {
      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          aud: user.aud
        },
        message: 'Authentication successful'
      })
    } else {
      return res.status(401).json({
        success: false,
        error: error?.message || 'Authentication failed',
        debug: {
          hasAuthHeader: !!req.headers.authorization,
          hasCookies: Object.keys(req.cookies).length > 0,
          cookieNames: Object.keys(req.cookies)
        }
      })
    }
  } catch (error) {
    console.error('Debug auth error:', error)
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    })
  }
}
