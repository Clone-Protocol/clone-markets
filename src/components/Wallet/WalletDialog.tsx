import { Close as CloseIcon, ExpandLess as CollapseIcon, ExpandMore as ExpandIcon } from '@mui/icons-material'
import {
  Box,
	Button,
	Collapse,
	Dialog,
	DialogContent,
	DialogProps,
	DialogTitle,
	IconButton,
	List,
	styled,
	Theme,
} from '@mui/material'
import { WalletName } from '@solana/wallet-adapter-base'
import { useWallet } from '@solana/wallet-adapter-react'
import React, { FC, ReactElement, SyntheticEvent, useCallback, useMemo, useState } from 'react'
import { useWalletDialog } from '~/hooks/useWalletDialog'
import { WalletListItem } from './WalletListItem'

const RootDialog = styled(Dialog)(({ theme }: { theme: Theme }) => ({
	'& .MuiDialog-paper': {
		width: 400,
		margin: 0,
		color: '#fff',
    background: '#10141f',
    boxShadow: '0 8px 20px rgb(0 0 0 / 60%)',
    borderRadius: '10px'
	},
	'& .MuiDialogTitle-root': {
		background: '#10141f',
		lineHeight: theme.spacing(5),
    textAlign: 'center',
		'& .MuiIconButton-root': {
			padding: theme.spacing(),
			marginRight: theme.spacing(-1),
			color: '#777',
      '&:hover': {
        color: '#fff'
      }
		},
	},
	'& .MuiDialogContent-root': {
    marginTop: 25,
		padding: 0,
		'& .MuiCollapse-root': {
			'& .MuiList-root': {
				background: '#10141f',
			},
		},
		'& .MuiList-root': {
			background: '#10141f',
			padding: 0,
		},
		'& .MuiListItem-root': {
			'&:hover': {
				background: '#2d3858'
			},
			padding: 0,
			'& .MuiButton-endIcon': {
				margin: 0,
			},
			'& .MuiButton-root': {
				background: '#10141f',
				color: '#f1f1f1',
				flexGrow: 1,
				justifyContent: 'space-between',
				padding: theme.spacing(1, 3),
				borderRadius: undefined,
				fontSize: '1rem',
				fontWeight: 400,

        '&:hover': {
          background: '#2d3858'
        },
			},
			'& .MuiSvgIcon-root': {
				color: theme.palette.grey[500],
			},
		},
	},
}))

export interface WalletDialogProps extends Omit<DialogProps, 'title' | 'open'> {
	featuredWallets?: number
	title?: ReactElement
}

export const WalletDialog: FC<WalletDialogProps> = ({
	title = 'Connect a wallet on Solana to continue',
	featuredWallets = 1,
	onClose,
	...props
}) => {
	const { wallets, select } = useWallet()
	const { open, setOpen } = useWalletDialog()
	const [expanded, setExpanded] = useState(false)

	const [featured, more] = useMemo(
		() => [wallets.slice(0, featuredWallets), wallets.slice(featuredWallets)],
		[wallets, featuredWallets]
	)

	const handleClose = useCallback(
		(event: SyntheticEvent, reason?: 'backdropClick' | 'escapeKeyDown') => {
			if (onClose) onClose(event, reason!)
			if (!event.defaultPrevented) setOpen(false)
		},
		[setOpen, onClose]
	)

	const handleWalletClick = useCallback(
		(event: SyntheticEvent, walletName: WalletName) => {
			select(walletName)
			handleClose(event)
		},
		[select, handleClose]
	)

	const handleExpandClick = useCallback(() => setExpanded(!expanded), [setExpanded, expanded])

	return (
		<RootDialog open={open} onClose={handleClose} {...props}>
			<DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end'}}>
          <IconButton onClick={handleClose} size="large">
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ margin: '0 auto', fontSize: '24px', fontWeight: 'bold', width: '250px' }}>
          {title}
        </Box>
			</DialogTitle>
			<DialogContent>
				<List>
					{featured.map((wallet) => (
						<WalletListItem
							key={wallet.adapter.name}
							onClick={(event) => handleWalletClick(event, wallet.adapter.name)}
							wallet={wallet}
						/>
					))}
					{more.length ? (
						<>
							<Collapse in={expanded} timeout="auto" unmountOnExit>
								<List>
									{more.map((wallet) => (
										<WalletListItem
											key={wallet.adapter.name}
											onClick={(event) => handleWalletClick(event, wallet.adapter.name)}
											wallet={wallet}
										/>
									))}
								</List>
							</Collapse>
							<Box sx={{ display: 'flex', justifyContent: 'end', marginTop: '15px', marginBottom: '15px' }}>
								<Button sx={{ color: '#fff', fontWeight: 'bold', background: '#10141f' }} onClick={handleExpandClick}>
									{expanded ? 'Less' : 'More'} options
									{expanded ? <CollapseIcon /> : <ExpandIcon />}
								</Button>
							</Box>
						</>
					) : null}
				</List>
			</DialogContent>
		</RootDialog>
	)
}
