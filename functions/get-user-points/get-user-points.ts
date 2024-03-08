import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'
import path from 'path';
import { promises as fs } from 'fs';
import { PythObj } from '~/pages/api/points_pythlist';

export const handler: Handler = async (event, context) => {
  const params = event.queryStringParameters!
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const rpcCall = params.userAddress ? supabase.from(
    "user_points_view"
  ).select().eq('user_address', params.userAddress) : supabase.from(
    "user_points_view"
  ).select();

  let { data, error } = await rpcCall;

  let newData = data

  //check if the address is included in pythResult
  if (params.userAddress) {
    console.log('p', params.userAddress)
    //pyth points
    const jsonDirectory = path.join(process.cwd(), 'public/data');
    const fileContents = await fs.readFile(jsonDirectory + '/pythSnapshot.json', 'utf8');
    const pythResult: PythObj[] = JSON.parse(fileContents)

    const pythUser = pythResult.find((pythUser) => {
      return pythUser.address === params.userAddress
    })
    newData[0].hasPythPoint = pythUser !== undefined ? true : false
    newData[0].pythPointTier = pythUser !== undefined ? pythUser.tier : -1
    console.log('new', newData)
  }

  if (error !== null) {
    console.log(error)
    return { statusCode: 500, body: JSON.stringify(error) }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(newData),
    headers: {
      'Cache-Control': 'public, max-age=300',
      'Content-Type': 'application/json',
    }
  }
}
