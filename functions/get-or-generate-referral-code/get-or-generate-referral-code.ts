import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

// If userAddress is passed into the params it will return the users tickets,
// otherwise returns the total number of tickets.
export const handler: Handler = async (event, context) => {
  const params = event.queryStringParameters!
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const userAddress = params.userAddress

  let response = null;
  // Checks the users points
  let { data, error } = await supabase.from(
    "user_points_view_materialized"
  ).select().eq('user_address', userAddress).gt("total_points", 0)

  if (error === null && data) {
    if (data?.length > 0) {
      // Try to insert for new referral code, ok if it fails.
      await supabase.from(
        "user_referral_codes"
      ).insert([{ "user_address": userAddress }]);

      // Either it was inserted or already present.
      let { data } = await supabase.from(
        "user_referral_codes"
      ).select("referral_code").eq("user_address", userAddress);

      response = data
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(response),
    ////  NOTE: Uncomment this out after testing, otherwise it will cache.
    // headers: {
    //   'Cache-Control': 'public, max-age=300',
    //   'Content-Type': 'application/json',
    // }
  }
}