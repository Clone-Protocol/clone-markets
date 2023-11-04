import { usePathname } from 'next/navigation'
import { List, ListItemButton, Box, Fade, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Link from 'next/link'

const NaviMenu = () => {
  const pathname = usePathname()

  return (
    <Fade in timeout={1500}>
      <List component="nav" sx={{ display: 'flex', padding: 0 }}>
        <Link href="/">
          <StyledListItemButton className={pathname === '/' ? 'selected' : ''}>
            <Box><Typography variant='p_lg'>Home</Typography></Box>
          </StyledListItemButton>
        </Link>
        <Link href="/clportfolio">
          <StyledListItemButton className={pathname?.startsWith('/clportfolio') ? 'selected' : ''}>
            <Box><Typography variant='p_lg'>Portfolio</Typography></Box>
          </StyledListItemButton>
        </Link>
        <Link href="/trade/euro">
          <StyledListItemButton className={pathname?.startsWith('/trade') ? 'selected' : ''}>
            <Box><Typography variant='p_lg'>Trade</Typography></Box>
          </StyledListItemButton>
        </Link>
      </List>
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