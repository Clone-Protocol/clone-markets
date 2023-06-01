import { useRouter } from 'next/router'
import { styled, List, ListItemButton, Box, Fade, Typography } from '@mui/material'
import Link from 'next/link'

const NaviMenu = () => {
  const router = useRouter()

  return (
    <Fade in timeout={1500}>
      <List component="nav" sx={{ display: 'flex' }}>
        <Link href="/">
          <StyledListItemButton className={router.asPath === '/' || router.asPath.startsWith('/markets') ? 'selected' : ''}>
            <Box><Typography variant='p_lg'>Home</Typography></Box>
          </StyledListItemButton>
        </Link>
        <Link href="/iportfolio">
          <StyledListItemButton className={router.asPath.startsWith('/iportfolio') ? 'selected' : ''}>
            <Box><Typography variant='p_lg'>Portfolio</Typography></Box>
          </StyledListItemButton>
        </Link>
        <Link href="/trade">
          <StyledListItemButton className={router.asPath.startsWith('/trade') ? 'selected' : ''}>
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
  margin-bottom: 13px;
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