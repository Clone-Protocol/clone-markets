import React, { useEffect, useMemo, useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import Image from 'next/image'
import logoIcon from 'public/images/incept-logo.svg'
import walletIcon from 'public/images/wallet-icon.svg'
import { useSnackbar } from 'notistack'
import { IconButton, styled, Stack, Theme, useMediaQuery } from '@mui/material'
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
// import DataLoadingIndicator from '~/components/Common/DataLoadingIndicator'
import MoreMenu from '~/components/Common/MoreMenu';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import "@fontsource/almarai";

const GNB: React.FC = () => {
	const router = useRouter()
	const { pathname, push } = router
	const [path, setPath] = useState<string>('/')
	const [mobileNavToggle, setMobileNavToggle] = useState(false)
	const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

	const { scrolled } = useScroll()

	const firstPathname = useMemo(() => {
		return pathname.split('/').slice(0, 2).join('/')
	}, [pathname])

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
				<Container maxWidth={false}>
					<Toolbar disableGutters sx={{ paddingLeft: '10px' }}>
						<Image src={logoIcon} alt="incept" />
            <MarketTitle>Markets</MarketTitle>
						<Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}></Box>
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
  const { enqueueSnackbar } = useSnackbar()
	const { connecting, connected, publicKey, connect, disconnect } = useWallet()
	const wallet = useAnchorWallet()
	const { setOpen } = useWalletDialog()
	const { getInceptApp } = useIncept()
	const [mintUsdi, setMintUsdi] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showWalletSelectPopup, setShowWalletSelectPopup] = useState(false)

	useEffect(() => {
		async function getAccount() {
			if (connected && publicKey && wallet) {
				const program = getInceptApp()
				await program.loadManager()

				if (!program.provider.wallet) {
					return
				}

				try {
					const userAccount = await program.getUserAccount()
				} catch (error) {
					const response = await program.initializeUser()
				}
			}
		}
		// getAccount()
	}, [connected, publicKey])

	useEffect(() => {
		async function userMintUsdi() {
			if (connected && publicKey && mintUsdi) {
				const program = getInceptApp()
				await program.loadManager()

				try {
					const usdiAccount = await program.getOrCreateUsdiAssociatedTokenAccount()
					await program.hackathonMintUsdi(usdiAccount.address, 10000000000)
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
				// disconnect()
			}
		} catch (error) {
			console.log('Error connecting to the wallet: ', (error as any).message)
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
  }

	return (
		<Box display="flex">
      {/* <DataLoadingIndicator /> */}
			<HeaderButton onClick={handleGetUsdiClick} variant="outlined" sx={{ width: '86px' }}>
				Get USDi
			</HeaderButton>

      <Box>
        <ConnectButton
          onClick={handleWalletClick}
          variant="outlined"
          sx={{ width: '163px' }}
          disabled={connecting}
          startIcon={!publicKey ? <Image src={walletIcon} alt="wallet" /> : <></>}>
          {!connected ? (
            <>Connect Wallet</>
          ) : (
            <>
              <div style={{ width: '15px', height: '15px', backgroundImage: 'radial-gradient(circle at 0 0, #0f6, #fff)', borderRadius: '99px' }} />
              {publicKey ? (
                <Box sx={{ marginLeft: '10px', color: '#fff', fontSize: '11px', fontWeight: '600' }}>
                  {shortenAddress(publicKey.toString())}
                </Box>
              ) : (
                <></>
              )}
            </>
          )}
        </ConnectButton>
        { showWalletSelectPopup && <WalletSelectBox spacing={2}>
          <CopyToClipboard text={publicKey!!.toString()}
            onCopy={() => enqueueSnackbar('Copied address')}>
            <PopupButton>Copy Address</PopupButton>
          </CopyToClipboard>
          <PopupButton onClick={handleChangeWallet}>Change Wallet</PopupButton>
          <PopupButton onClick={handleDisconnect}>Disconnect</PopupButton>
        </WalletSelectBox> }
      </Box>

			<HeaderButton sx={{ fontSize: '15px', fontWeight: 'bold', paddingBottom: '20px' }} variant="outlined" onClick={handleMoreClick}>...</HeaderButton>
      <MoreMenu anchorEl={anchorEl} onClose={() => setAnchorEl(null)} />
		</Box>
	)
}

const MarketTitle = styled('div')`
	font-family: 'Almarai';
  font-size: 22px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #fff;
  margin: 3px 0 0 7px;
`

const StyledAppBar = styled(AppBar)`
	z-index: 200;
	background-color: #000;
	height: 60px;
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
  border: 1px solid #404040;
  padding: 12px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  margin-left: 12px;
  color: #fff;
  min-width: 40px;
  height: 35px;
  &:hover {
    border: 1px solid #404040;
    background-color: #2e2e2e;
  }
`

const ConnectButton = styled(Button)`
  border: solid 1px #aaa;
  background-color: #171717;
	padding: 12px 12px 10px 13px;
	border-radius: 10px;
	font-size: 11px;
	font-weight: 600;
  margin-left: 16px;
	color: #fff;
	height: 35px;
  &:hover {
    background-color: #2e2e2e;
		border: solid 1px #aaa;
  }
`

const WalletSelectBox = styled(Stack)`
  position: absolute;
  top: 60px;
  right: 59px;
  width: 163px;
  height: 139px;
  padding: 14px 17px 16px;
  border-radius: 10px;
  border: solid 1px #fff;
  background-color: #181818;
  z-index: 99;
`

const PopupButton = styled(Button)`
  width: 129px;
  height: 25px;
  padding: 6px 27px 7px 26px;
  border-radius: 10px;
  border: solid 1px #fff;
  background-color: #282828;
  font-size: 10px;
  font-weight: 500;
  color: #fff;
`
