import { styled, Typography, Box } from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Image from 'next/image'
import HomeIcon from 'public/images/more/home.svg'
import TwitterIcon from 'public/images/more/twitter.svg'
import DiscordIcon from 'public/images/more/discord.svg'
import { Stack } from '@mui/system';

interface Props {
  anchorEl: null | HTMLElement
  onShowTokenFaucet: () => void
  onClose?: () => void
}

const MoreMenu: React.FC<Props> = ({ anchorEl, onShowTokenFaucet, onClose }) => {
  const open = Boolean(anchorEl);

  return <Menu
    anchorEl={anchorEl}
    id="account-menu"
    open={open}
    onClose={onClose}
    onClick={onClose}
    PaperProps={{
      elevation: 0,
      sx: {
        overflow: 'visible',
        mt: 1.5,
        background: '#080018',
        color: '#fff',
        border: '1px solid #414166'
      },
    }}
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
    <StyledMenuItem>
      <HoverStack direction='row' alignItems='center'>
        <Box width='144px'>
          <Stack direction='row' justifyContent='space-between' alignItems='center'><Typography variant='p'>Docs</Typography></Stack>
          <Box><Typography variant='p_sm' color='#8988a3'>Learn about Clone Markets</Typography></Box>
        </Box>
      </HoverStack>
    </StyledMenuItem>
    <StyledMenuItem>
      <HoverStack direction='row' alignItems='center'>
        <Box width='144px'>
          <Stack direction='row' justifyContent='space-between' alignItems='center'><Typography variant='p'>Clone Liquidity</Typography></Stack>
          <Box><Typography variant='p_sm' color='#8988a3'>Provide Liquidity on Clone Protocol</Typography></Box>
        </Box>
      </HoverStack>
    </StyledMenuItem>
    <a href={`https://join-incept.super.site/`} target='_blank' rel="noreferrer">
      <StyledMenuItem>
        <HoverStack direction='row' alignItems='center'>
          <Box width='144px'>
            <Stack direction='row' justifyContent='space-between' alignItems='center'><Typography variant='p'>Opportunities</Typography></Stack>
            <Box><Typography variant='p_sm' color='#8988a3'>Wanna be a pioneer of Defi?</Typography></Box>
          </Box>
        </HoverStack>
      </StyledMenuItem>
    </a>
    <Stack direction='row' gap={1} justifyContent='center' mt='15px' mb='10px'>
      <Image src={HomeIcon} alt="home" />
      <Image src={TwitterIcon} alt="twitter" />
      <Image src={DiscordIcon} alt="discord" />
    </Stack>
  </Menu >
}

const StyledMenuItem = styled(MenuItem)`
  display: flex;
  width: 210px;
  height: 35px;
  line-height: 12px;
  color: #fff;
  margin-bottom: 10px;
  padding: 8px 12px;
`
const HoverStack = styled(Stack)`
  padding: 6px;
  &:hover {
    background-color: #2d2d2d;
  }
`

export default MoreMenu;