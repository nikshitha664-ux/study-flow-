import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // In development / demo mode, if token is mock token allow mock user
      if (process.env.NODE_ENV === 'development') {
        req.user = { id: '00000000-0000-0000-0000-000000000000', email: 'demo@aiworkspace.com' };
        return next();
      }
      return res.status(401).json({ error: 'Unauthorized. Bearer token required.' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      if (process.env.NODE_ENV === 'development') {
        req.user = { id: '00000000-0000-0000-0000-000000000000', email: 'demo@aiworkspace.com' };
        return next();
      }
      return res.status(401).json({ error: 'Invalid or expired authentication token.' });
    }

    req.user = { id: user.id, email: user.email };
    next();
  } catch (err: any) {
    res.status(500).json({ error: 'Internal auth verification error.' });
  }
};
