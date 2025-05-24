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
          res.setHeader('Set-Cookie', `${name}=${value}; ${Object.entries(options || {}).map(([k, v]) => `${k}=${v}`).join('; ')}`)
        },
        remove(name, options) {
          res.setHeader('Set-Cookie', `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; ${Object.entries(options || {}).map(([k, v]) => `${k}=${v}`).join('; ')}`)
        },
      },
    }
  )
}

export async function getAuthenticatedUser(req, res) {
  const supabase = createSupabaseServerClient(req, res)
  
  try {
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
