import { styled } from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Image from 'next/image'
import InfoIcon from 'public/images/more/info-icon.png'
import BookIcon from 'public/images/more/book-icon.png'
import DiscordIcon from 'public/images/more/discord-icon.png'
import LiquidIcon from 'public/images/more/liquid-icon.png'
import TwitterIcon from 'public/images/more/twitter-icon.png'

interface Props {
  anchorEl: null | HTMLElement
  onClose?: any 
}

const MoreMenu: React.FC<Props> = ({ anchorEl, onClose }) => {
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
        borderRadius: '8px',
        boxShadow: '0 0 5px 5px rgba(0, 0, 0, 0.2)',
        mt: 1.5,
      },
    }}
    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
  >
    <StyledMenuItem>
      <div>About</div>
      <Image src={InfoIcon} alt="about" />
    </StyledMenuItem>
    <StyledMenuItem>
      <div>Docs</div>
      <Image src={BookIcon} alt="docs" />
    </StyledMenuItem>
    <StyledMenuItem>
      <div>Discord</div> 
      <Image src={DiscordIcon} alt="discord" />
    </StyledMenuItem>
    <StyledMenuItem>
      <div>Twitter</div>
      <Image src={TwitterIcon} alt="twitter" />
    </StyledMenuItem>
    <StyledMenuItem>
      <div>Incept Liquidity</div>
      <Image src={LiquidIcon} alt="liquidity" />
    </StyledMenuItem>
  </Menu>
}

const StyledMenuItem = styled(MenuItem)`
  display: flex;
  justify-content: space-between;
  width: 219px;
  font-size: 12px;
  font-weight: 600;
  line-height: normal;
  letter-spacing: normal;
  color: #323232;
  padding-left: 30px;
  padding-right: 30px;
  padding-top: 8px;
  padding-bottom: 8px;
`

export default MoreMenu;