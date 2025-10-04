import { createRemoteJWKSet, jwtVerify, JWTPayload, errors as JoseErrors } from 'jose';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/?$/, '') ?? '';
const SUPABASE_AUTH_ISSUER = SUPABASE_URL ? `${SUPABASE_URL}/auth/v1` : '';

const jwksUrl = SUPABASE_AUTH_ISSUER ? `${SUPABASE_AUTH_ISSUER}/.well-known/jwks.json` : '';
const remoteJwks = jwksUrl ? createRemoteJWKSet(new URL(jwksUrl)) : null;

export interface SupabaseJWTVerifyOptions {
  audience?: string | string[];
}

export interface SupabaseJWTVerifyResult {
  payload: JWTPayload;
}

export class SupabaseJWTError extends Error {
  recoverable: boolean;

  constructor(message: string, options: { recoverable?: boolean } = {}, cause?: unknown) {
    super(message);
    this.name = 'SupabaseJWTError';
    this.recoverable = options.recoverable ?? false;
    if (cause !== undefined) {
      (this as any).cause = cause;
    }
  }
}

/**
 * 验证 Supabase 发布的访问令牌。
 *
 * 当项目启用非对称 JWT 时，会使用远程 JWKS 进行校验；
 * 如果当前配置缺失或签名不匹配，会抛出 SupabaseJWTError（recoverable=true），
 * 调用方可以选择回退到 supabase.auth.getUser()。
 */
export async function verifySupabaseAccessToken(
  token: string,
  options: SupabaseJWTVerifyOptions = {}
): Promise<SupabaseJWTVerifyResult> {
  if (!token) {
    throw new SupabaseJWTError('访问令牌缺失');
  }

  if (!remoteJwks || !SUPABASE_AUTH_ISSUER) {
    throw new SupabaseJWTError('Supabase JWT 配置缺失', { recoverable: true });
  }

  try {
    const { payload } = await jwtVerify(token, remoteJwks, {
      issuer: SUPABASE_AUTH_ISSUER,
      audience: options.audience,
    });

    return { payload };
  } catch (error) {
    const recoverable =
      error instanceof JoseErrors.JWSSignatureVerificationFailed ||
      error instanceof JoseErrors.JWKSNoMatchingKey ||
      error instanceof JoseErrors.JWKSMultipleMatchingKeys ||
      error instanceof JoseErrors.JWKSInvalid ||
      error instanceof TypeError;

    throw new SupabaseJWTError('Supabase JWT 验证失败', { recoverable }, error);
  }
}
