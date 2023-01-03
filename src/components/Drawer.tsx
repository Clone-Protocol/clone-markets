import React from 'react'
import MuiDrawer from '@mui/material/Drawer'
import { styled, List, ListItemButton, ListItemIcon, Box, Stack, Fade } from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import menuPortfolioIcon from 'public/images/menu/portfolio-icon.svg'
import menuMarketIcon from 'public/images/menu/markets-icon.svg'
import { useRouter } from 'next/router'
import { withCsrOnly } from '~/hocs/CsrOnly'

const Drawer: React.FC = () => {
	const router = useRouter()

	return (
		<StyledDrawer variant="permanent" open={true}>
			<Fade in timeout={1500}>
				<List component="nav">
					<Link href="/">
						<StyledListItemButton className={router.asPath === '/' || router.asPath.startsWith('/markets') ? 'selected' : ''}>
							<ListItemIcon sx={{ marginLeft: '20px' }}>
								<Image src={menuMarketIcon} alt="markets" />
							</ListItemIcon>
							<StyledListItemText>Markets</StyledListItemText>
						</StyledListItemButton>
					</Link>
					<Link href="/iportfolio">
						<StyledListItemButton className={router.asPath.startsWith('/iportfolio') ? 'selected' : ''}>
							<ListItemIcon sx={{ marginLeft: '20px' }}>
								<Image src={menuPortfolioIcon} alt="portfolio" />
							</ListItemIcon>
							<StyledListItemText>iPortfolio</StyledListItemText>
						</StyledListItemButton>
					</Link>
				</List>
			</Fade>
			<BottomStack spacing={2}>
				<div><span style={{ fontSize: '10px' }}>V1:</span> Polaris Devnet</div>
				<Credit>© Incept 2022</Credit>
			</BottomStack>
		</StyledDrawer>
	)
}

export default withCsrOnly(Drawer)

const StyledDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
	'& .MuiDrawer-paper': {
		position: 'relative',
		background: 'rgba(20, 20, 20, 0.75)',
		color: '#fff',
		whiteSpace: 'nowrap',
		width: 241,
		marginTop: 64,
		paddingTop: 20,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
		borderRadius: '10px',
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

const StyledListItemButton = styled(ListItemButton)`
  border-radius: 10px;
  height: 41px;
  margin-left: 12px;
  margin-right: 11px;
  margin-bottom: 13px;
  &.selected {
    border: solid 1px #000;
    background-color: #2e2e2e; 
    transition: all 0.3s ease 0.2s;
  }
  &:not(.selected):hover {
    background-color: rgba(38, 38, 38, 0.5);
  }
`

const StyledListItemText = styled(Box)`
	font-size: 12px;
	font-weight: bold;
	height: 44px;
	line-height: 44px;
  margin-left: -15px;
`

const BottomStack = styled(Stack)`
	position: absolute;
	left: 65px;
	bottom: 100px;
	font-size: 13px;
	font-weight: 600;
	color: #9c9c9c;
	text-align: center;
`

const Credit = styled('div')`
	font-size: 12px; 
	font-weight: 500;
	color: #8c8c8c;
`