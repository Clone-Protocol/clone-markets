import { usePathname } from 'next/navigation'
import { List, ListItemButton, Box, Fade, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Link from 'next/link'

const CommonMenu = ({ isMobile = false, onClick }: { isMobile?: boolean, onClick?: () => void }) => {
  const pathname = usePathname()

  return (
    <List component="nav" sx={{ display: isMobile ? 'block' : 'flex', padding: 0 }}>
      <Link href="/">
        <StyledListItemButton className={pathname === '/' ? 'selected' : ''} onClick={onClick}>
          <Box><Typography variant='p_lg'>Home</Typography></Box>
        </StyledListItemButton>
      </Link>
      <Link href="/clportfolio">
        <StyledListItemButton className={pathname?.startsWith('/clportfolio') ? 'selected' : ''} onClick={onClick}>
          <Box><Typography variant='p_lg'>Portfolio</Typography></Box>
        </StyledListItemButton>
      </Link>
      <Link href="/trade/euro">
        <StyledListItemButton className={pathname?.startsWith('/trade') ? 'selected' : ''} onClick={onClick}>
          <Box><Typography variant='p_lg'>Trade</Typography></Box>
        </StyledListItemButton>
      </Link>
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

export const MobileNaviMenu = ({ onClick }: { onClick: () => void }) => {
  return (
    <Fade in timeout={1500}>
      <Box>
        <CommonMenu isMobile={true} onClick={onClick} />
      </Box>
    </Fade>
  )
}

const StyledListItemButton = styled(ListItemButton)`
  height: 41px;
  margin-left: 8px;
  margin-right: 8px;
  border-radius: 5px;
  color: ${(props) => props.theme.basis.raven};
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