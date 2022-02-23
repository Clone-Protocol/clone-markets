import MuiDrawer from '@mui/material/Drawer';
import { styled } from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import menuHomeIcon from '../../public/images/menu/home-icon.png'
import menuPortfolioIcon from '../../public/images/menu/portfolio-icon.png'
import menuMarketIcon from '../../public/images/menu/market-icon.png'
import menuSwapIcon from '../../public/images/menu/swap-icon.png'
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { withCsrOnly } from '~/hocs/CsrOnly'

const Drawer: React.FC = () => {

  return (
    <StyledDrawer variant="permanent" open={true}>
      <List component="nav">
        <Link href="/">
          <ListItemButton>
            <ListItemIcon>
              <Image src={menuHomeIcon} alt="home" />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </Link>
        <Link href="/iportfolio">
          <ListItemButton>
            <ListItemIcon>
              <Image src={menuPortfolioIcon} alt="portfolio" />
            </ListItemIcon>
            <ListItemText primary="iPortfolio" />
          </ListItemButton>
        </Link>
        <Link href="/markets">
          <ListItemButton>
            <ListItemIcon>
              <Image src={menuMarketIcon} alt="markets" />
            </ListItemIcon>
            <ListItemText primary="Markets" />
          </ListItemButton>
        </Link>
        <Link href="/swap">
          <ListItemButton>
            <ListItemIcon>
              <Image src={menuSwapIcon} alt="swap" />
            </ListItemIcon>
            <ListItemText primary="Swap" />
          </ListItemButton>
        </Link>
      </List>
    </StyledDrawer>
  )
}

export default withCsrOnly(Drawer)

const StyledDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: 240,
      marginTop: 100,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
)