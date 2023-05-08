import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import logoIcon from 'public/images/logo-markets.svg'
import walletIcon from 'public/images/wallet-icon.svg'
import { useSnackbar } from 'notistack'
import { Button, Toolbar, Container, Box, AppBar, IconButton, styled, Stack, Theme, useMediaQuery, Typography } from '@mui/material'
// import { GNB_ROUTES } from '~/routes'
import { useRouter } from 'next/router'
import { useScroll } from '~/hooks/useScroll'
import { withCsrOnly } from '~/hocs/CsrOnly'
import { useWallet, useAnchorWallet } from '@solana/wallet-adapter-react'
import { shortenAddress } from '~/utils/address'
import { useWalletDialog } from '~/hooks/useWalletDialog'
import { useIncept } from '~/hooks/useIncept'
import MoreMenu from '~/components/Common/MoreMenu';
import TokenFaucetDialog from './Account/TokenFaucetDialog'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getUSDiAccount } from '~/utils/token_accounts'
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '@solana/spl-token'
import { sendAndConfirm } from '~/utils/tx_helper'
import { useTransactionState } from '~/hooks/useTransactionState'
import NaviMenu from './NaviMenu'


const GNB: React.FC = () => {
	// const router = useRouter()
	// const { pathname } = router
	// const [path, setPath] = useState<string>('/')
	const [mobileNavToggle, setMobileNavToggle] = useState(false)
	// const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

	const { scrolled } = useScroll()

	// const firstPathname = useMemo(() => {
	// 	return pathname.split('/').slice(0, 2).join('/')
	// }, [pathname])

	const handleMobileNavBtn = () => setMobileNavToggle((prev) => !prev)

	// useEffect(() => {
	// 	const path = GNB_ROUTES.find((route) => firstPathname === route.path)?.path
	// 	if (path) setPath(path)
	// }, [firstPathname])

	const navClassName = useMemo(() => {
		let className = mobileNavToggle ? 'mobile-on' : ''
		className += scrolled ? ' scrolled' : ''
		return className
	}, [mobileNavToggle, scrolled])

	return (
		<>
			<NavPlaceholder />
			<StyledAppBar className={navClassName} position="static">
				<Container maxWidth={false}>
					<Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>

						<Image src={logoIcon} width={255} alt="incept" />
						<Box><NaviMenu /></Box>
						<RightMenu />

						{/* 
						<Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}></Box>
						<Box sx={{ flexGrow: 0, display: { xs: 'none', sm: 'inherit' } }}>
							<RightMenu />
						</Box>
						<Box sx={{ marginLeft: 'auto', display: { xs: 'flex', sm: 'none' } }}>
							<IconButton sx={{ color: 'white' }} onClick={handleMobileNavBtn}>
								{mobileNavToggle ? <CancelIcon color="info" /> : <MenuIcon />}
							</IconButton>
						</Box> */}
					</Toolbar>
				</Container>
			</StyledAppBar>
		</>
	)
}

export default withCsrOnly(GNB)

const RightMenu = () => {
	const router = useRouter()
	const { enqueueSnackbar } = useSnackbar()
	const { connecting, connected, publicKey, connect, disconnect } = useWallet()
	const wallet = useAnchorWallet()
	const { setOpen } = useWalletDialog()
	const { getInceptApp } = useIncept()
	const [openTokenFaucet, setOpenTokenFaucet] = useState(false)
	const [mintUsdi, setMintUsdi] = useState(false)
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [showWalletSelectPopup, setShowWalletSelectPopup] = useState(false)
	const { setTxState } = useTransactionState()

	useEffect(() => {
		async function userMintUsdi() {
			if (connected && publicKey && mintUsdi && wallet) {
				const program = getInceptApp(wallet)
				await program.loadManager()
				const usdiTokenAccount = await getUSDiAccount(program);
				const ata = await getAssociatedTokenAddress(program.incept!.usdiMint, publicKey);
				let ixnCalls = []
				try {
					if (usdiTokenAccount === undefined) {
						ixnCalls.push((async () => createAssociatedTokenAccountInstruction(publicKey, ata, publicKey, program.incept!.usdiMint))())
					}
					ixnCalls.push(program.hackathonMintUsdiInstruction(ata, 10000000000))
					let ixns = await Promise.all(ixnCalls)
					await sendAndConfirm(program.provider, ixns, setTxState)

				} finally {
					setMintUsdi(false)
				}
			}
		}
		userMintUsdi()
	}, [mintUsdi, connected, publicKey])

	const handleWalletClick = () => {
		try {
			if (!connected) {
				if (!wallet) {
					setOpen(true)
				} else {
					connect()
				}
				setShowWalletSelectPopup(false)
			} else {
				setShowWalletSelectPopup(!showWalletSelectPopup)
			}
		} catch (error) {
			console.log('Error connecting to the wallet: ', error)
		}
	}

	const handleGetUsdiClick = () => {
		setMintUsdi(true)
	}

	const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	}

	const handleChangeWallet = () => {
		disconnect()
		setShowWalletSelectPopup(false)
		setOpen(true)
	}

	const handleDisconnect = () => {
		disconnect()
		setShowWalletSelectPopup(false)
		router.replace('/')
	}

	return (
		<>
			<Box display="flex">
				<HeaderButton onClick={() => setOpenTokenFaucet(true)}>
					<Typography variant='p'>Devnet Faucet</Typography>
				</HeaderButton>
				<HeaderButton sx={{ fontSize: '15px', fontWeight: 'bold', paddingBottom: '20px' }} onClick={handleMoreClick}>...</HeaderButton>
				<MoreMenu anchorEl={anchorEl} onShowTokenFaucet={() => setOpenTokenFaucet(true)} onClose={() => setAnchorEl(null)} />
				<Box>
					<ConnectButton
						onClick={handleWalletClick}
						disabled={connecting}
						startIcon={!publicKey ? <Image src={walletIcon} alt="wallet" /> : <></>}>
						{!connected ? (
							<Typography variant='p'>Connect Wallet</Typography>
						) : (
							<>
								{publicKey && (
									<Typography variant='p'>{shortenAddress(publicKey.toString())}</Typography>
								)}
							</>
						)}
					</ConnectButton>
					{showWalletSelectPopup && <WalletSelectBox>
						<Stack direction='row' alignItems='center'>
							<WalletAddress onClick={handleChangeWallet}>
								{publicKey && (
									<Typography variant='p_lg'>{shortenAddress(publicKey.toString())}</Typography>
								)}
							</WalletAddress>
							<Stack direction='row' spacing={2}>
								<CopyToClipboard text={publicKey!!.toString()}
									onCopy={() => enqueueSnackbar('Copied address')}>
									<PopupButton><Typography variant='p_sm'>Copy</Typography></PopupButton>
								</CopyToClipboard>
								<PopupButton><Typography variant='p_sm' onClick={handleDisconnect}>Disconnect</Typography></PopupButton>
							</Stack>
						</Stack>
						<NetworkInfo><Typography variant='p_xsm'>Polaris Devnet - V1</Typography></NetworkInfo>
					</WalletSelectBox>}
				</Box>
			</Box>

			<TokenFaucetDialog
				open={openTokenFaucet}
				isConnect={connected}
				connectWallet={handleWalletClick}
				onGetUsdiClick={handleGetUsdiClick}
				onHide={() => setOpenTokenFaucet(false)}
			/>
		</>
	)
}

const StyledAppBar = styled(AppBar)`
	z-index: 900;
	background-color: #000;
	height: 60px;
	position: fixed;
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
	padding: 12px;
	margin-left: 16px;
	color: ${(props) => props.theme.palette.text.secondary};
	height: 35px;
	&:hover {
		background-color: ${(props) => props.theme.boxes.darkBlack};
	}
	&:active {
		background-color: ${(props) => props.theme.boxes.darkBlack};
	}
`
const ConnectButton = styled(Button)`
	background-color: ${(props) => props.theme.boxes.black};
	padding: 12px;
	margin-left: 16px;
	color: #fff;
	width: 140px;
	height: 36px;
	&:hover {
		background-color: ${(props) => props.theme.boxes.darkBlack};
	}
`
const WalletSelectBox = styled(Stack)`
	position: absolute;
	top: 60px;
	right: 0px;
	width: 282px;
	height: 86px;
	padding: 13px 16px;
	background-color: ${(props) => props.theme.boxes.darkBlack};
	z-index: 99;
`
const WalletAddress = styled(Box)`
  color: #fff;
	margin-right: 45px;
	cursor: pointer;
`
const PopupButton = styled(Box)`
	font-size: 10px;
	font-weight: 500;
	color: ${(props) => props.theme.palette.text.secondary};
	cursor: pointer;
`
const NetworkInfo = styled(Box)`
	text-align: center;
	line-height: 19px;
	width: 104px;
	border-style: solid;
	border-width: 0.5px;
	border-image-source: ${(props) => props.theme.gradients.light};
	border-image-slice: 1;
	color: #fff;
	margin: 0 auto;
	margin-top: 12px;
`