import React, { useEffect, useMemo, useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import Image from 'next/image'
import logoIcon from '../../public/images/incept-logo.png'
import walletIcon from '../../public/images/wallet-icon.png'
import { IconButton, styled, Theme, useMediaQuery } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { GNB_ROUTES } from '~/routes'
import { useRouter } from 'next/router'
import CancelIcon from './Icons/CancelIcon'
import MenuIcon from './Icons/MenuIcon'
import { useScroll } from '~/hooks/useScroll'
import { withCsrOnly } from '~/hocs/CsrOnly'
import { useWallet, useAnchorWallet } from '@solana/wallet-adapter-react'
import { shortenAddress } from '~/utils/address'
import { useWalletDialog } from '~/hooks/useWalletDialog'
import { useIncept } from '~/hooks/useIncept'
import { PublicKey } from '@solana/web3.js'
//import { initProvider, incept } from '~/hooks/useIncept'

const GNB: React.FC = () => {
	const router = useRouter()
	const { pathname, push } = router
	const [path, setPath] = useState<string>('/')
	const [mobileNavToggle, setMobileNavToggle] = useState(false)
	const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

	const classes = useStyles()
	const { scrolled } = useScroll()

	const firstPathname = useMemo(() => {
		return pathname
			.split('/')
			.slice(0, 2)
			.join('/')
	}, [pathname])

	// const handleChange = (_: React.SyntheticEvent, path: string) => {
	// 	if (firstPathname === path) return
	// 	setPath(path)
	// 	push({ pathname: path })
	// }

	const handleMobileNavBtn = () => setMobileNavToggle((prev) => !prev)

	useEffect(() => {
		const path = GNB_ROUTES.find((route) => firstPathname === route.path)?.path
		if (path) setPath(path)
	}, [firstPathname])

	const navClassName = useMemo(() => {
		let className = mobileNavToggle ? 'mobile-on' : ''
		className += scrolled ? ' scrolled' : ''
		return className
	}, [mobileNavToggle, scrolled])

	return (
		<>
			<NavPlaceholder />
			<StyledAppBar className={navClassName} position="static">
				<Container maxWidth="xl">
					<Toolbar disableGutters sx={{ paddingLeft: '10px' }}>
						<Image src={logoIcon} alt="incept" />
						<Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}>
							{/* {isDesktop && (
								<StyledTabs
									TabIndicatorProps={{ children: <div /> }}
									classes={classes}
									value={path}
									onChange={handleChange}>
									{GNB_ROUTES.map((route) => (
										<Tab key={route.label} label={route.label} value={route.path} />
									))}
								</StyledTabs>
							)} */}
						</Box>
						<Box sx={{ flexGrow: 0, display: { xs: 'none', sm: 'inherit' } }}>
							<RightMenu />
						</Box>
						<Box sx={{ marginLeft: 'auto', display: { xs: 'flex', sm: 'none' } }}>
							<IconButton sx={{ color: 'white' }} onClick={handleMobileNavBtn}>
								{mobileNavToggle ? <CancelIcon color="info" /> : <MenuIcon />}
							</IconButton>
						</Box>
					</Toolbar>
				</Container>
			</StyledAppBar>
		</>
	)
}

export default withCsrOnly(GNB)

const RightMenu = () => {
	const { connect, connecting, connected, publicKey, disconnect } = useWallet()
	const wallet = useAnchorWallet()
	const { setOpen } = useWalletDialog()
  const { Program, setInceptApp } = useIncept()

	const inceptConstructor = () => {
		const inceptProgramID = new PublicKey('9MccekuZVBMDsz2ijjkYCBXyzfj8fZvgEu11zToXAnRR')
    setInceptApp(inceptProgramID)
	}

  useEffect(() => {
    if (Program) {
      console.log(Program.managerAddress[0].toString())
    }
  }, [Program])

	const handleWalletClick = () => {
		try {
			if (!connected) {
				if (!wallet) {
					setOpen(true)
				} else {
					connect()
				}
			} else {
				disconnect()
			}
		} catch (error) {
			console.log('Error connecting to the wallet: ', (error as any).message)
		}
	}

	return (
		<Box display="flex">
			<HeaderButton onClick={inceptConstructor} variant="outlined" sx={{ width: '86px', marginRight: '16px' }}>
        Get USDi
			</HeaderButton>

			<HeaderButton
				onClick={handleWalletClick}
				variant="outlined"
				sx={{ width: '163px' }}
				disabled={connecting}
				startIcon={<Image src={walletIcon} alt="wallet" />}
			>
				{!connected ? (
					<>Connect Wallet</>
				) : (
					<>
						Disconnect Wallet{' '}
						{publicKey ? (
							<Box sx={{ marginLeft: '10px', color: '#6c6c6c' }}>
								{shortenAddress(publicKey.toString())}
							</Box>
						) : (
							<></>
						)}
					</>
				)}
			</HeaderButton>

			{/* <Button variant="outlined">...</Button> */}
		</Box>
	)
}

const StyledAppBar = styled(AppBar)`
	z-index: 200;
	background-color: #fff;
	position: fixed;
	z-index: 300;
	top: 0px;
	left: 0px;
	.MuiContainer-root,
	.MuiTabs-flexContainer {
		${(props) => props.theme.breakpoints.up('md')} {
			height: 80px;
		}
		${(props) => props.theme.breakpoints.down('md')} {
			height: 65px;
		}
	}
	&.mobile-on .MuiContainer-root {
		background-color: #3a3a3a;
		border-radius: 0px 0px 20px 20px;
	}
	&.scrolled:not(.mobile-on) {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(20px);
		border-radius: 20px;
	}
	.MuiToolbar-root {
		height: 100%;
	}
`

const NavPlaceholder = styled('div')`
	${(props) => props.theme.breakpoints.up('md')} {
		height: 80px;
	}
	${(props) => props.theme.breakpoints.down('md')} {
		height: 65px;
	}
`

const HeaderButton = styled(Button)`
	padding: 14px 11px 12px 14px;
	border-radius: 8px;
	font-size: 12px;
	font-weight: 600;
	height: 41px;
`

const useStyles = makeStyles(({ palette }: Theme) => ({
	indicator: {
		display: 'flex',
		justifyContent: 'center',
		backgroundColor: 'transparent',
		height: '3px',
		'& > div': {
			maxWidth: '20%',
			width: '100%',
			marginLeft: '-3px',
			backgroundColor: palette.primary.main,
		},
	},
}))
