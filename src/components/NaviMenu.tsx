import { usePathname } from 'next/navigation'
import { List, ListItemButton, Box, Fade, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import { IS_DEV } from '~/data/networks'
import { PointsStarIconOff, PointsStarIconOn } from './Common/SvgIcons'

const CommonMenu = () => {
  const pathname = usePathname()
  // router.prefetch(DEFAULT_ASSET_LINK)
  // router.prefetch('/clportfolio')

  return (
    <List component="nav" sx={{ display: 'flex', padding: 0 }}>
      {/* <Link href="/">
        <StyledListItemButton className={pathname === '/' ? 'selected' : ''}>
          <Typography variant='p_lg'>Home</Typography>
        </StyledListItemButton>
      </Link> */}
      <Link href="/">
        <StyledListItemButton className={pathname === '/' || pathname?.startsWith('/trade') ? 'selected' : ''}>
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
          <StyledPointsItemButton className={pathname?.startsWith('/points') ? 'selected' : ''}>
            <ColoredText className={pathname?.startsWith('/points') ? 'selected' : ''}><Typography variant="p_lg" mr='3px'>Points</Typography></ColoredText>
            {pathname?.startsWith('/points') ? <PointsStarIconOn /> : <PointsStarIconOff />}
          </StyledPointsItemButton>
        </Link>
      }
    </List>
  )
}

const NaviMenu = () => {
  return (
    <CommonMenu />
  )
}

export const MobileNaviMenu = () => {
  return (
    <Fade in timeout={1500}>
      <Box display='flex' height='48px' mx='7px' justifyContent='center' bgcolor="#000" borderRadius='20px' border='solid 1px #343441' mb='10px'>
        <CommonMenu />
      </Box>
    </Fade>
  )
}

const StyledListItemButton = styled(ListItemButton)`
  height: 45px;
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
const StyledPointsItemButton = styled(StyledListItemButton)`
  &:hover {
    background-color: transparent;
    background-image: linear-gradient(to right, #1c1704 49%, #03181c 97%);
  }
`
const ColoredText = styled('div')`
  background-image: linear-gradient(to right, #a58e35 31%, #26869a 88%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  &:hover {
    background-image: linear-gradient(106deg, #fbdc5f 42%, #3dddff 89%);
  }
  &.selected {
    background-image: linear-gradient(106deg, #fbdc5f 42%, #3dddff 89%);
  }
`

export default NaviMenu