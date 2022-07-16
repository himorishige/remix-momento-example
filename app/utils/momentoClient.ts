import { SimpleCacheClient } from '@gomomento/sdk';

// ユーザーのMomentoオーストークン
const authToken = process.env.MOMENTO_AUTH_TOKEN;

if (!authToken) {
  throw new Error('Missing required environment variable MOMENTO_AUTH_TOKEN');
}

// Momentoのクライアントを作成
const DEFAULT_TTL = 60; // デフォルトTTLは60秒
export const momento = new SimpleCacheClient(authToken, DEFAULT_TTL);
