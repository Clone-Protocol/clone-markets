import { useRouter } from 'next/router'
import { styled, List, ListItemButton, Box, Fade } from '@mui/material'
import Link from 'next/link'

const NaviMenu = () => {
  const router = useRouter()

  return (
    <Fade in timeout={1500}>
      <List component="nav" sx={{ display: 'flex' }}>
        <Link href="/">
          <StyledListItemButton className={router.asPath === '/' || router.asPath.startsWith('/markets') ? 'selected' : ''}>
            <StyledListItemText>Markets</StyledListItemText>
          </StyledListItemButton>
        </Link>
        <Link href="/iportfolio">
          <StyledListItemButton className={router.asPath.startsWith('/iportfolio') ? 'selected' : ''}>
            <StyledListItemText>Portfolio</StyledListItemText>
          </StyledListItemButton>
        </Link>
        <Link href="/trade">
          <StyledListItemButton className={router.asPath.startsWith('/trade') ? 'selected' : ''}>
            <StyledListItemText>Trade</StyledListItemText>
          </StyledListItemButton>
        </Link>
      </List>
    </Fade>
  )
}

const StyledListItemButton = styled(ListItemButton)`
  height: 41px;
  margin-left: 11px;
  margin-right: 11px;
  margin-bottom: 13px;
  color: ${(props) => props.theme.basis.raven};
  &.selected {
    color: #fff;
    transition: all 0.3s ease 0.2s;
  }
`
const StyledListItemText = styled(Box)`
	font-size: 14px;
	font-weight: 500;
	height: 44px;
	line-height: 44px;
  margin-left: -15px;
`

export default NaviMenu