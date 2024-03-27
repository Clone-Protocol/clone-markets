import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

// If userAddress is passed into the params it will return the users tickets,
// otherwise returns the total number of tickets.
export const handler: Handler = async (event, context) => {
  const params = event.queryStringParameters!
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const userAddress = params.userAddress
  const referralCode = params.referralCode

// If we find this user in this query, they're not eligible to link to a referrer.
  let { data, error } = await supabase.from(
    "user_points_view"
  ).select().eq('user_address', userAddress).gt("total_points", 0)

  // This insert will fail if they already have a referral code
  if (error !== null && data?.length === 0) {
    let { error } = await supabase.from(
        "linked_referral_codes"
      ).insert([{ "user_address": userAddress, "referral_code": referralCode }]);
  }

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