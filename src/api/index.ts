import { getVercelServer } from '@/vercel-app';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const server = await getVercelServer();
  return server(req, res);
}
