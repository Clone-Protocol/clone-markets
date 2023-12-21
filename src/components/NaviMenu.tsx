import { usePathname } from 'next/navigation'
import { List, ListItemButton, Box, Fade, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import { IS_DEV } from '~/data/networks'

const CommonMenu = () => {
  const pathname = usePathname()

  return (
    <List component="nav" sx={{ display: 'flex', padding: 0 }}>
      <Link href="/">
        <StyledListItemButton className={pathname === '/' ? 'selected' : ''}>
          <Typography variant='p_lg'>Home</Typography>
        </StyledListItemButton>
      </Link>
      <Link href="/trade/gold">
        <StyledListItemButton className={pathname?.startsWith('/trade') ? 'selected' : ''}>
          <Typography variant='p_lg'>Trade</Typography>
        </StyledListItemButton>
      </Link>
      <Link href="/clportfolio">
        <StyledListItemButton className={pathname?.startsWith('/clportfolio') ? 'selected' : ''}>
          <Typography variant='p_lg'>Portfolio</Typography>
        </StyledListItemButton>
      </Link>
      {!IS_DEV &&
        <Link href="/points">
          <StyledListItemButton className={pathname?.startsWith('/points') ? 'selected' : ''}>
            <Typography variant='p_lg'>Points</Typography>
          </StyledListItemButton>
        </Link>
      }
    </List>
  )
}

const NaviMenu = () => {
  return (
    <Fade in timeout={1500}>
      <Box>
        <CommonMenu />
      </Box>
    </Fade>
  )
}

export const MobileNaviMenu = () => {
  return (
    <Fade in timeout={1500}>
      <Box display='flex' justifyContent='center' bgcolor="#040414" paddingBottom='15px'>
        <CommonMenu />
      </Box>
    </Fade>
  )
}

const StyledListItemButton = styled(ListItemButton)`
  height: 41px;
  margin-left: 8px;
  margin-right: 8px;
  border-radius: 5px;
  color: ${(props) => props.theme.basis.textRaven};
  &:hover {
    border-radius: 5px;
    background-color: rgba(196, 181, 253, 0.1);
  }
  &.selected {
    color: #fff;
    transition: all 0.3s ease 0.2s;
  }
`

export default NaviMenu