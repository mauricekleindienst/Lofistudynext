import { createServerClient } from '@supabase/ssr'

export function createSupabaseServerClient(req, res) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return req.cookies[name]
        },
        set(name, value, options) {
          if (!res.headersSent) {
            const cookieString = `${name}=${value}; ${Object.entries(options || {})
              .map(([k, v]) => {
                if (k === 'maxAge') return `Max-Age=${v}`
                if (k === 'httpOnly') return v ? 'HttpOnly' : ''
                if (k === 'secure') return v ? 'Secure' : ''
                if (k === 'sameSite') return `SameSite=${v}`
                if (k === 'path') return `Path=${v}`
                if (k === 'domain') return `Domain=${v}`
                return `${k}=${v}`
              })
              .filter(Boolean)
              .join('; ')}`
            
            const existingCookies = res.getHeader('Set-Cookie') || []
            const cookiesArray = Array.isArray(existingCookies) ? existingCookies : [existingCookies]
            res.setHeader('Set-Cookie', [...cookiesArray, cookieString])
          }
        },
        remove(name, options) {
          if (!res.headersSent) {
            const cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; ${Object.entries(options || {})
              .map(([k, v]) => {
                if (k === 'path') return `Path=${v}`
                if (k === 'domain') return `Domain=${v}`
                return `${k}=${v}`
              })
              .filter(Boolean)
              .join('; ')}`
            
            const existingCookies = res.getHeader('Set-Cookie') || []
            const cookiesArray = Array.isArray(existingCookies) ? existingCookies : [existingCookies]
            res.setHeader('Set-Cookie', [...cookiesArray, cookieString])
          }
        },
      },
    }
  )
}

export async function getAuthenticatedUser(req, res) {
  const supabase = createSupabaseServerClient(req, res)
  
  try {
    // Try to get user from Authorization header first
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const { data: { user }, error } = await supabase.auth.getUser(token)
      
      if (!error && user) {
        return { user, error: null }
      }
    }
    
    // Fallback to session-based auth
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return { user: null, error: error || new Error('No authenticated user') }
    }
    
    return { user, error: null }
  } catch (error) {
    return { user: null, error }
  }
}

export function requireAuth(handler) {
  return async (req, res) => {
    const { user, error } = await getAuthenticatedUser(req, res)
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        details: error?.message || 'No authenticated user'
      })
    }
    
    // Add user to request object
    req.user = user
    return handler(req, res)
  }
}
