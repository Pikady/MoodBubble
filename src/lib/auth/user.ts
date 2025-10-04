import type { JWTPayload } from 'jose';
import type { NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { SupabaseJWTError, verifySupabaseAccessToken } from './jwt';

const ACCESS_TOKEN_COOKIE = 'sb-access-token';
const AUTHORIZATION_HEADER = 'authorization';

export interface SupabaseUser {
  id: string;
  email?: string;
  payload: JWTPayload;
}

type ServerSupabaseClient = Awaited<ReturnType<typeof createServerSupabaseClient>>;

export interface GetSupabaseUserOptions {
  supabase?: ServerSupabaseClient;
  /**
   * 控制在 JWT 校验失败时是否回退到 supabase.auth.getUser()
   * 默认 true，确保在尚未启用新 JWT 时仍可工作。
   */
  fallbackToAuthGetUser?: boolean;
}

function extractTokenFromRequest(request: NextRequest): string | null {
  const cookieToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  if (cookieToken) {
    return cookieToken;
  }

  const authorization = request.headers.get(AUTHORIZATION_HEADER);
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.slice('Bearer '.length).trim() || null;
  }

  return null;
}

export async function getSupabaseUserFromRequest(
  request: NextRequest,
  options: GetSupabaseUserOptions = {}
): Promise<SupabaseUser | null> {
  const { supabase, fallbackToAuthGetUser = true } = options;
  const supabaseClient = supabase ?? (await createServerSupabaseClient());

  try {
    const { data } = await supabaseClient.auth.getClaims();
    const claims = data?.claims as JWTPayload | undefined;
    const userId = typeof claims?.sub === 'string' ? claims.sub : undefined;

    if (userId) {
      const email = typeof claims?.email === 'string' ? claims.email : undefined;
      const payload = (claims ?? { sub: userId }) as JWTPayload;
      console.log('[auth] Resolved user via getClaims()', { userId, hasEmail: Boolean(email) });
      return {
        id: userId,
        email,
        payload,
      };
    }
  } catch (error) {
    console.warn('[auth] getClaims() failed, fallback to token verification', { error });
  }

  const accessToken = extractTokenFromRequest(request);

  if (accessToken) {
    try {
      const { payload } = await verifySupabaseAccessToken(accessToken);
      const userId = typeof payload.sub === 'string' ? payload.sub : undefined;

      if (!userId) {
        throw new SupabaseJWTError('访问令牌缺少用户标识');
      }

      const email = typeof payload.email === 'string' ? payload.email : undefined;
      console.log('[auth] Resolved user via JWT verification', { userId, hasEmail: Boolean(email) });

      return {
        id: userId,
        email,
        payload,
      };
    } catch (error) {
      if (error instanceof SupabaseJWTError) {
        if (!error.recoverable) {
          console.error('[auth] JWT verification failed (non-recoverable)', { message: error.message });
          throw error;
        }
        console.warn('[auth] JWT verification failed, fallback to supabase.auth.getUser()', { message: error.message });
      } else {
        throw error;
      }
    }
  } else {
    console.warn('[auth] No access token found, fallback to supabase.auth.getUser()');
  }

  if (!fallbackToAuthGetUser) {
    return null;
  }

  const { data: { user }, error } = await supabaseClient.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    return null;
  }

  console.log('[auth] Resolved user via supabase.auth.getUser()', { userId: user.id, hasEmail: Boolean(user.email) });

  return {
    id: user.id,
    email: user.email ?? undefined,
    payload: {
      sub: user.id,
      email: user.email ?? undefined,
    } satisfies JWTPayload,
  };
}
