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
  const jsonDirectory = path.join(process.cwd(), 'public/data');
  const fileContents = await fs.readFile(jsonDirectory + '/pythSnapshot.json', 'utf8');
  res.status(200).json({ result: JSON.parse(fileContents) });
}

export const config = {
  api: {
    responseLimit: false,
  },
}