import { Box, Button, Typography } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAtomValue } from 'jotai';
import React from 'react';
import { styled } from '@mui/material/styles'
import { discordUsername } from '~/features/globalAtom';
import DiscordIcon from 'public/images/more/discord.svg'
import DiscordHoverIcon from 'public/images/more/discord-hover.svg'
import { MenuIcon } from '../Common/MoreMenu';

const DiscordAuthButton = () => {
  const discordUsernameValue = useAtomValue(discordUsername)

  const discordLogin = async () => {
    const url = process.env.NEXT_PUBLIC_DISCORD_OAUTH_URL || '';

    window.location.href = url;

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      const data = {
        client_id: process.env.NEXT_PUBLIC_DISCORD_APP_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_DISCORD_APP_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: `${process.env.NEXT_PUBLIC_API_ROOT}/api/oauth/discord/redirect`,
        scope: 'identify',
      }

      const response = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const responseData = await response.json();

      console.log(responseData.access_token); // Here is your access token
    }
  };

  // 임시 스타일 정의
  const buttonStyle = {
    color: 'white',
    fontSize: '12px',
    padding: '4px',
    width: '180px',
    borderRadius: '5px',
    border: '1px solid white',
  };

  return !discordUsernameValue ?
    <LinkButton onClick={discordLogin} style={buttonStyle} >
      <Typography variant='p'>Link your Discord account</Typography>
      <MenuIcon srcImage={DiscordIcon} hoverImage={DiscordHoverIcon} alt="discord" />
    </LinkButton>
    : <Box><Typography variant='p'>Discord: {discordUsernameValue}</Typography></Box>
};

const LinkButton = styled(Button)`
  display: flex;
  gap: 5px;
  align-items: center;
  &:hover {
    background: #000;
  }
      `

export default DiscordAuthButton;