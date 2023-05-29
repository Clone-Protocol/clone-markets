import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import logoIcon from 'public/images/logo-markets.svg'
import walletIcon from 'public/images/gnb-wallet.svg'
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
import { useBalanceQuery } from '~/features/Portfolio/Balance.query'


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
					{!connected ?
						<ConnectButton
							onClick={handleWalletClick}
							disabled={connecting}
						>
							<Typography variant='p_lg'>Connect Wallet</Typography>
						</ConnectButton>
						:
						<ConnectedButton onClick={handleWalletClick} startIcon={publicKey ? <Image src={walletIcon} alt="wallet" /> : <></>}>
							<Typography variant='p'>{publicKey && shortenAddress(publicKey.toString())}</Typography>
						</ConnectedButton>
					}
					{showWalletSelectPopup && <WalletSelectBox>
						<Stack direction='row' justifyContent='space-between' alignItems='center' padding='13px'>
							<WalletAddress onClick={handleChangeWallet}>
								<Box><Typography variant='p' fontWeight={600} color='#fff'>13.56 SOL</Typography></Box>
								{publicKey && (
									<Box><Typography variant='p' color='#c5c7d9'>{shortenAddress(publicKey.toString())}</Typography></Box>
								)}
							</WalletAddress>
							<Stack direction='row' spacing={1}>
								<CopyToClipboard text={publicKey!!.toString()}
									onCopy={() => enqueueSnackbar('Copied address')}>
									<PopupButton><Typography variant='p_sm'>Copy</Typography></PopupButton>
								</CopyToClipboard>
								<PopupButton><Typography variant='p_sm' onClick={handleDisconnect}>Disconnect</Typography></PopupButton>
							</Stack>
						</Stack>
						<AssetBox>
							<Typography variant='h3'>$150,453</Typography> <Typography variant='p_lg'>onUSD</Typography>
						</AssetBox>
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
	color: ${(props) => props.theme.basis.ghost};
	height: 42px;
	&:hover {
		background-color: ${(props) => props.theme.boxes.darkBlack};
	}
	&:active {
		background-color: ${(props) => props.theme.boxes.darkBlack};
	}
`
const ConnectButton = styled(Button)`
	padding: 9px;
	margin-left: 16px;
	color: #fff;
	width: 142px;
	height: 42px;
	&::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 10px;
    border: 1px solid transparent;
    background: ${(props) => props.theme.gradients.light} border-box;
    -webkit-mask:
      linear-gradient(#fff 0 0) padding-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
  }
	&:hover {
    background-color: #2e2e2e;
  }
`
const ConnectedButton = styled(Button)`
	width: 142px;
	height: 42px;
	padding: 9px;
	color: #fff;
	border-radius: 10px;
	border: solid 1px ${(props) => props.theme.basis.portGore};
  background: ${(props) => props.theme.basis.royalPurple};
	&:hover {
    background-color: #2e2e2e;
  }
`
const WalletSelectBox = styled(Stack)`
	position: absolute;
	top: 70px;
	right: 0px;
	width: 282px;
	background-color: ${(props) => props.theme.boxes.darkBlack};
	border-radius: 10px;
  border: solid 1px ${(props) => props.theme.basis.portGore};
	z-index: 99;
`
const WalletAddress = styled(Box)`
	cursor: pointer;
	line-height: 1;
`
const PopupButton = styled(Box)`
	font-size: 10px;
	font-weight: 600;
	color: ${(props) => props.theme.basis.melrose};
	padding: 2px 6px;
	border-radius: 100px;
  background-color: rgba(155, 121, 252, 0.3);
	cursor: pointer;
`
const AssetBox = styled(Box)`
	width: 100%;
	height: 61px;
	padding: 17px;
	display: flex;
	gap: 10px;
	color: #fff;
	background-color: rgba(255, 255, 255, 0.05);
`