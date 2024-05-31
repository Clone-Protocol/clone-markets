import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  username: string
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const requestToken = req.query.code;
  let tokenResponse, userResponse;

  try {
    tokenResponse = await axios({
      method: 'post',
      url: `https://discord.com/api/oauth2/token`,
      data: {
        client_id: process.env.NEXT_PUBLIC_DISCORD_APP_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_DISCORD_APP_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: requestToken,
        redirect_uri: `${process.env.NEXT_PUBLIC_API_ROOT}/api/oauth/discord/redirect`,
        scope: 'identify',
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const accessToken = tokenResponse.data.access_token;

    userResponse = await axios.get('https://discordapp.com/api/users/@me', {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

  } catch (error) {
    console.error(`Error in getting token or user data from Discord API: ${error.message}`);
    // return res.status(500).send('Server Error');
    return res.redirect(process.env.NEXT_PUBLIC_API_ROOT!);
  }

  // This logs the user's data
  console.log(userResponse.data);
  const username = userResponse.data.username
  // Then redirect the user back to your react app
  res.redirect(`${process.env.NEXT_PUBLIC_API_ROOT}?discordUsername=${username}`);
  // res.status(200).json({ username: userResponse.data.username });
  // res.status(200).json({ message: 'Hello from Next.js!' })
}