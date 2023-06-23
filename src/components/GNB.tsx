import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import logoIcon from 'public/images/logo-markets.svg'
import walletIcon from 'public/images/gnb-wallet.svg'
import { Button, Toolbar, Container, Box, AppBar, Theme, useMediaQuery, Typography } from '@mui/material'
import { styled } from '@mui/system'
// import { GNB_ROUTES } from '~/routes'
import { useScroll } from '~/hooks/useScroll'
import { withCsrOnly } from '~/hocs/CsrOnly'
import { useWallet, useAnchorWallet } from '@solana/wallet-adapter-react'
import { shortenAddress } from '~/utils/address'
import { useWalletDialog } from '~/hooks/useWalletDialog'
import { useClone } from '~/hooks/useClone'
import MoreMenu from '~/components/Common/MoreMenu';
import TokenFaucetDialog from './Account/TokenFaucetDialog'
import { getOnUSDAccount, getTokenAccount } from '~/utils/token_accounts'
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { PublicKey } from '@solana/web3.js'
import { BN } from "@coral-xyz/anchor"
import { sendAndConfirm } from '~/utils/tx_helper'
import { useTransactionState } from '~/hooks/useTransactionState'
import { useRecoilState } from 'recoil'
import { PROGRAM_ADDRESS as JUPITER_PROGRAM_ADDRESS, createMintUsdcInstruction, Jupiter } from 'incept-protocol-sdk/sdk/generated/jupiter-agg-mock/index'
import NaviMenu from './NaviMenu'
import WalletSelectBox from './Common/WalletSelectBox'
import MobileWarningDialog from './Common/MobileWarningDialog'
import { mintUSDi } from '~/features/globalAtom'
import { DEVNET_TOKEN_SCALE } from 'incept-protocol-sdk/sdk/src/clone'

const GNB: React.FC = () => {
	// const router = useRouter()
	// const { pathname } = router
	// const [path, setPath] = useState<string>('/')
	const [mobileNavToggle, setMobileNavToggle] = useState(false)
	const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
	const { scrolled } = useScroll()

	// const firstPathname = useMemo(() => {
	// 	return pathname.split('/').slice(0, 2).join('/')
	// }, [pathname])

	// const handleMobileNavBtn = () => setMobileNavToggle((prev) => !prev)
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
				<MobileWarningDialog open={isMobile} handleClose={() => { return null }} />
			</StyledAppBar>
		</>
	)
}

export default withCsrOnly(GNB)

const RightMenu: React.FC = () => {
	const { connecting, connected, publicKey, connect } = useWallet()
	const wallet = useAnchorWallet()
	const { setOpen } = useWalletDialog()
	const { getCloneApp } = useClone()
	const [openTokenFaucet, setOpenTokenFaucet] = useState(false)
	const [mintUsdi, setMintUsdi] = useRecoilState(mintUSDi)
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [showWalletSelectPopup, setShowWalletSelectPopup] = useState(false)
	const { setTxState } = useTransactionState()

	useEffect(() => {
		async function userMintOnusd() {
			const onusdToMint = 100;
			if (connected && publicKey && mintUsdi && wallet) {
				const program = getCloneApp(wallet)
				await program.loadClone()
				const usdiTokenAccount = await getOnUSDAccount(program);
				const onusdAta = await getAssociatedTokenAddress(program.clone!.onusdMint, publicKey);

				let [jupiterAddress, nonce] = PublicKey.findProgramAddressSync(
					[Buffer.from("jupiter")],
					new PublicKey(JUPITER_PROGRAM_ADDRESS)
				  );
				let jupiterAccount = await Jupiter.fromAccountAddress(program.connection, jupiterAddress)
				const usdcTokenAccount = await getTokenAccount(jupiterAccount.usdcMint, publicKey, program.connection);
				const usdcAta = await getAssociatedTokenAddress(jupiterAccount.usdcMint, publicKey);

				let ixnCalls = []
				try {
					if (usdcTokenAccount === undefined) {
						ixnCalls.push((async () => createAssociatedTokenAccountInstruction(publicKey, usdcAta, publicKey, jupiterAccount.usdcMint))())
					}
					if (usdiTokenAccount === undefined) {
						ixnCalls.push((async () => createAssociatedTokenAccountInstruction(publicKey, onusdAta, publicKey, program.clone!.onusdMint))())
					}

					ixnCalls.push(
						createMintUsdcInstruction(
							{
								usdcMint: jupiterAccount.usdcMint,
								usdcTokenAccount: usdcAta,
								jupiterAccount: jupiterAddress,
								tokenProgram: TOKEN_PROGRAM_ID
							}, {
								nonce,
								amount: new BN(onusdToMint * Math.pow(10, 7))
							}
						)
					)

					ixnCalls.push(
						await program.mintOnusdInstruction(
							new BN(onusdToMint * Math.pow(10, DEVNET_TOKEN_SCALE)),
							onusdAta,
							usdcAta
						)
					)

					let ixns = await Promise.all(ixnCalls)
					await sendAndConfirm(program.provider, ixns, setTxState)

				} finally {
					setMintUsdi(false)
				}
			}
		}
		userMintOnusd()
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
					{showWalletSelectPopup && <WalletSelectBox onHide={() => setShowWalletSelectPopup(false)} />}
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
	padding: 8px;
	margin-left: 16px;
	color: ${(props) => props.theme.basis.ghost};
	height: 42px;
	border-radius: 10px;
	&:hover {
		border-radius: 10px;
  	background-color: rgba(196, 181, 253, 0.1);
	}
`
const ConnectButton = styled(Button)`
	padding: 9px;
	margin-left: 16px;
	color: #fff;
	width: 142px;
	height: 42px;
	border-radius: 10px;
	box-shadow: 0 0 10px 0 ${(props) => props.theme.basis.hansPurple};
	background: linear-gradient(to bottom, ${(props) => props.theme.basis.royalPurple}, ${(props) => props.theme.basis.royalPurple}), linear-gradient(to right, #ed25c1 0%, #a74fff 16%, #f096ff 34%, #fff 50%, #ff96e2 68%, #874fff 83%, #4d25ed, #4d25ed);
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
		&::before {
			background: linear-gradient(to right, #8e1674 0%, #642f99 16%, #905a99 34%, #999 50%, #995a88 68%, #512f99 83%, #2e168e) border-box;
		}
  }
`
const ConnectedButton = styled(Button)`
	width: 142px;
	height: 42px;
	padding: 9px;
	margin-left: 16px;
	color: #fff;
	border-radius: 10px;
	border: solid 1px ${(props) => props.theme.basis.portGore};
  background: ${(props) => props.theme.basis.royalPurple};
	&:hover {
		background: ${(props) => props.theme.basis.royalPurple};
    border: solid 1px ${(props) => props.theme.basis.melrose};
  }
`
