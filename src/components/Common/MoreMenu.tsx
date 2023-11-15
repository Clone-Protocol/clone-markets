import { Typography, Box, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Image from 'next/image'
import HomeIcon from 'public/images/more/home.svg'
import TwitterIcon from 'public/images/more/twitter.svg'
import DiscordIcon from 'public/images/more/discord.svg'
import HomeHoverIcon from 'public/images/more/home-hover.svg'
import TwitterHoverIcon from 'public/images/more/twitter-hover.svg'
import DiscordHoverIcon from 'public/images/more/discord-hover.svg'
import { useState } from 'react'
import { CAREER_URL, DISCORD_URL, DOCS_URL, LIQUIDITY_APP, OFFICIAL_WEB, TWITTER_URL } from '~/data/social'

interface Props {
  anchorEl: null | HTMLElement
  onShowTokenFaucet: () => void
  onClose?: () => void
}

const MenuIcon = ({ srcImage, hoverImage, alt }: { srcImage: string, hoverImage: string, alt: string }) => {
  const [isHovering, setIsHovering] = useState(false)

  return <Box sx={{ cursor: 'pointer' }}><Image src={isHovering ? hoverImage : srcImage} alt={alt} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)} /></Box>
}
const MoreMenu: React.FC<Props> = ({ anchorEl, onShowTokenFaucet, onClose }) => {
  const open = Boolean(anchorEl);

  return <Menu
    anchorEl={anchorEl}
    id="account-menu"
    open={open}
    onClose={onClose}
    onClick={onClose}
    transitionDuration={0}
    PaperProps={{
      elevation: 0,
      sx: {
        overflow: 'visible',
        mt: 1.5,
        transition: 'none',
        transitionDuration: 0,
        background: '#080018',
        color: '#fff',
        border: '1px solid #414166',
        borderRadius: '10px'
      },
    }}
    MenuListProps={{ sx: { pt: 0, pb: '15px' } }}
    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
  >
    <StyledMenuItem onClick={onShowTokenFaucet}>
      <HoverStack direction='row' alignItems='center'>
        <Box width='144px'>
          <Box><Typography variant='p'>Token Faucet</Typography></Box>
          <Box><Typography variant='p_sm' color='#8988a3'>Get started on Solana devnet</Typography></Box>
        </Box>
      </HoverStack>
    </StyledMenuItem>
    <a href={DOCS_URL} target='_blank' rel="noreferrer">
      <StyledMenuItem>
        <HoverStack direction='row' alignItems='center'>
          <Box width='144px'>
            <Stack direction='row' justifyContent='space-between' alignItems='center'><Typography variant='p'>Docs</Typography></Stack>
            <Box><Typography variant='p_sm' color='#8988a3'>Learn about Clone Markets</Typography></Box>
          </Box>
        </HoverStack>
      </StyledMenuItem>
    </a>
    <a href={LIQUIDITY_APP} target='_blank' rel="noreferrer">
      <StyledMenuItem>
        <HoverStack direction='row' alignItems='center'>
          <Box width='144px'>
            <Stack direction='row' justifyContent='space-between' alignItems='center'><Typography variant='p'>Clone Liquidity</Typography></Stack>
            <Box><Typography variant='p_sm' color='#8988a3'>Provide Liquidity on Clone Protocol</Typography></Box>
          </Box>
        </HoverStack>
      </StyledMenuItem>
    </a>
    <a href={CAREER_URL} target='_blank' rel="noreferrer">
      <StyledMenuItem>
        <HoverStack direction='row' alignItems='center'>
          <Box width='144px'>
            <Stack direction='row' justifyContent='space-between' alignItems='center'><Typography variant='p'>Opportunities</Typography></Stack>
            <Box><Typography variant='p_sm' color='#8988a3'>Wanna be a pioneer of Defi?</Typography></Box>
          </Box>
        </HoverStack>
      </StyledMenuItem>
    </a>
    <Stack direction='row' gap={2} justifyContent='center' mt='15px'>
      <a href={OFFICIAL_WEB} target="_blank" rel="noreferrer"><MenuIcon srcImage={HomeIcon} hoverImage={HomeHoverIcon} alt="home" /></a>
      <a href={TWITTER_URL} target="_blank" rel="noreferrer"><MenuIcon srcImage={TwitterIcon} hoverImage={TwitterHoverIcon} alt="twitter" /></a>
      <a href={DISCORD_URL} target="_blank" rel="noreferrer"><MenuIcon srcImage={DiscordIcon} hoverImage={DiscordHoverIcon} alt="discord" /></a>
    </Stack>
  </Menu>
}

const StyledMenuItem = styled(MenuItem)`
  display: flex;
  width: 210px;
  height: 35px;
  line-height: 12px;
  color: #fff;
  margin-bottom: 10px;
  padding: 0 !important;
`
const HoverStack = styled(Stack)`
  width: 100%;
  height: 40px;
  padding: 8px 12px 6px 12px;
  line-height: 0.7;
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`

export default MoreMenu;