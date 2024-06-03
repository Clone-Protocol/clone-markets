import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

// If userAddress is passed into the params it will return the users tickets,
// otherwise returns the total number of tickets.
export const handler: Handler = async (event, context) => {
  const params = event.queryStringParameters!
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const signature = params.signature
  console.log('signature', signature)

  const resultObj = {
    successful: true
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ resultObj }),
  }
}