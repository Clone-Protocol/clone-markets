import { usePathname } from 'next/navigation'
import { List, ListItemButton, Box, Fade, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import { IS_DEV } from '~/data/networks'
import { DEFAULT_ASSET_LINK } from '~/data/assets'
import pointsStarIcon from 'public/images/points-star.svg'
import pointsStarIconSelected from 'public/images/points-star-selected.svg'
import Image from 'next/image'

const CommonMenu = () => {
  const pathname = usePathname()
  // const router = useRouter()
  // router.prefetch(DEFAULT_ASSET_LINK)
  // router.prefetch('/clportfolio')

  return (
    <List component="nav" sx={{ display: 'flex', padding: 0 }}>
      <Link href="/">
        <StyledListItemButton className={pathname === '/' ? 'selected' : ''}>
          <Typography variant='p_lg'>Home</Typography>
        </StyledListItemButton>
      </Link>
      <Link href={DEFAULT_ASSET_LINK}>
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
          <StyledPointsItemButton className={pathname?.startsWith('/points') ? 'selected' : ''}>
            <Typography variant='p_lg' mr='2px'>Points</Typography>
            <Image src={pathname?.startsWith('/points') ? pointsStarIconSelected : pointsStarIcon} width={14} height={14} alt="clone" />
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
const StyledPointsItemButton = styled(StyledListItemButton)`
  color: #927e2f;
  &:hover {
    background-color: #181509;
  }
  &.selected {
    color: #fbdc5f;
  }
`

export default NaviMenu