import type { NextApiRequest, NextApiResponse } from 'next'

import path from 'path';
import { promises as fs } from 'fs';

export type PythObj = {
  address: string
  tier: number
}
export type PythResponseData = {
  result: PythObj[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PythResponseData>
) {
  const dirRelativeToPublicFolder = 'data'
  const dir = path.resolve('./public', dirRelativeToPublicFolder);
  const fileContents = await fs.readFile(dir + '/pythSnapshot.json', 'utf8');
  res.status(200).json({ result: JSON.parse(fileContents) });
}

export const config = {
  api: {
    responseLimit: false,
  },
}