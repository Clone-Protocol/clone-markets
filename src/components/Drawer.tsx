import MuiDrawer from '@mui/material/Drawer'
import { styled, List, ListItemButton, ListItemIcon, ListItemText, Box, Stack } from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import menuHomeIcon from '../../public/images/menu/home-icon.png'
import menuPortfolioIcon from '../../public/images/menu/portfolio-icon.png'
import menuMarketIcon from '../../public/images/menu/market-icon.png'
import menuSwapIcon from '../../public/images/menu/swap-icon.png'
import { withCsrOnly } from '~/hocs/CsrOnly'

const Drawer: React.FC = () => {
	return (
		<StyledDrawer variant="permanent" open={true}>
			<List component="nav">
				<Link href="/">
					<ListItemButton>
						<ListItemIcon sx={{ marginLeft: '20px' }}>
							<Image src={menuHomeIcon} alt="home" />
						</ListItemIcon>
						<StyledListItemText>Home</StyledListItemText>
					</ListItemButton>
				</Link>
				<Link href="/iportfolio">
					<ListItemButton>
						<ListItemIcon sx={{ marginLeft: '20px' }}>
							<Image src={menuPortfolioIcon} alt="portfolio" />
						</ListItemIcon>
						<StyledListItemText>iPortfolio</StyledListItemText>
					</ListItemButton>
				</Link>
				<Link href="/markets">
					<ListItemButton>
						<ListItemIcon sx={{ marginLeft: '20px' }}>
							<Image src={menuMarketIcon} alt="markets" />
						</ListItemIcon>
						<StyledListItemText>Markets</StyledListItemText>
					</ListItemButton>
				</Link>
				{/* <Link href="/swap">
					<ListItemButton>
						<ListItemIcon sx={{ marginLeft: '20px' }}>
							<Image src={menuSwapIcon} alt="swap" />
						</ListItemIcon>
						<StyledListItemText>Swap</StyledListItemText>
					</ListItemButton>
				</Link> */}
			</List>
			<Stack
				sx={{
					position: 'absolute',
					left: '35px',
					bottom: '15px',
					fontSize: '12px',
					color: '#6c6c6c',
					textAlign: 'center',
				}}
				spacing={2}>
				<div>V1: Polaris Devnet</div>
				<div>© Incept 2022</div>
			</Stack>
		</StyledDrawer>
	)
}

export default withCsrOnly(Drawer)

const StyledDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
	'& .MuiDrawer-paper': {
		position: 'relative',
		whiteSpace: 'nowrap',
		width: 206,
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
}))

const StyledListItemText = styled(Box)`
	font-size: 14px;
	font-weight: 600;
	height: 44px;
	line-height: 44px;
`
