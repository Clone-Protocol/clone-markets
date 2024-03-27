import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

// If userAddress is passed into the params it will return the users tickets,
// otherwise returns the total number of tickets.
export const handler: Handler = async (event, context) => {
  const params = event.queryStringParameters!
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const userAddress = params.userAddress

  // This insert will fail if they already have a referral code
  let { error } = await supabase.from(
    "user_referral_codes"
  ).insert([{ "user_address": userAddress }]);

  // This will fetch the code which they should have now.
  let { data } = await supabase.from(
    "user_referral_codes"
  ).select("referral_code").eq("user_address", userAddress);

  return {
    statusCode: 200,
    body: JSON.stringify(data),
    ////  NOTE: Uncomment this out after testing, otherwise it will cache.
    // headers: {
    //   'Cache-Control': 'public, max-age=300',
    //   'Content-Type': 'application/json',
    // }
  }
}