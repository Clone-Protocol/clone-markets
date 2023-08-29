import React, { useMemo, useState } from 'react';
import { Box, Typography, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import { LoadingProgress } from '~/components/Common/Loading'
import { useBalanceQuery } from '~/features/Portfolio/Balance.query'
import { useWallet } from '@solana/wallet-adapter-react'
import { useSnackbar } from 'notistack'
import { useSetAtom } from 'jotai'
import { cloneClient } from '~/features/globalAtom'
import withSuspense from '~/hocs/withSuspense'
import { useRouter } from 'next/navigation'
import { shortenAddress } from '~/utils/address'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getSolInBalance } from '~/utils/address';
import { ON_USD } from '~/utils/constants';

const WalletSelectBox = ({ onHide }: { onHide: () => void }) => {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const { publicKey, disconnect } = useWallet()
  const setCloneClient = useSetAtom(cloneClient)
  const [solBalance, setSolBalance] = useState(0)

  const { data: balance } = useBalanceQuery({
    userPubKey: publicKey,
    refetchOnMount: 'always',
    enabled: publicKey != null
  })

  useMemo(() => {
    const getBalance = async () => {
      if (publicKey) {
        try {
          const balance = await getSolInBalance(publicKey)
          setSolBalance(balance)
        } catch (e) {
          console.error(e)
        }
      }
    }
    getBalance()
  }, [publicKey])

  const handleDisconnect = async () => {
    setCloneClient(null)
    await disconnect()
    onHide()
    // refresh page by force
    await setTimeout(() => {
      location.reload()
    }, 1000)
  }

  return balance ? (
    <WalletWrapper>
      <Stack direction='row' justifyContent='space-between' alignItems='center' padding='13px'>
        <Box lineHeight={1}>
          <Box><Typography variant='p' fontWeight={600} color='#fff'>{solBalance.toLocaleString()} SOL</Typography></Box>
          {publicKey && (
            <Box><Typography variant='p' color='#c5c7d9'>{shortenAddress(publicKey.toString())}</Typography></Box>
          )}
        </Box>
        <Stack direction='row' spacing={1}>
          <CopyToClipboard text={publicKey!!.toString()}
            onCopy={() => enqueueSnackbar('Copied address')}>
            <PopupButton><Typography variant='p_sm'>Copy</Typography></PopupButton>
          </CopyToClipboard>
          <PopupButton><Typography variant='p_sm' onClick={handleDisconnect}>Disconnect</Typography></PopupButton>
        </Stack>
      </Stack>
      <AssetBox>
        <Typography variant='h3'>${balance?.onusdVal.toLocaleString()}</Typography> <Typography variant='p_lg'>{ON_USD}</Typography>
      </AssetBox>
    </WalletWrapper>
  ) : <></>
}

export default withSuspense(WalletSelectBox, <LoadingProgress />)

const WalletWrapper = styled(Stack)`
	position: absolute;
	top: 70px;
	right: 0px;
	width: 282px;
	background-color: ${(props) => props.theme.boxes.darkBlack};
	border-radius: 10px;
  border: solid 1px ${(props) => props.theme.basis.portGore};
	z-index: 99;
`
const PopupButton = styled(Box)`
	font-size: 10px;
	font-weight: 600;
	color: ${(props) => props.theme.basis.melrose};
	padding: 2px 6px;
	border-radius: 100px;
  background-color: rgba(155, 121, 252, 0.3);
	cursor: pointer;
  &:hover {
		background-color: rgba(155, 121, 252, 0.3);
    box-shadow: 0 0 0 1px ${(props) => props.theme.basis.melrose} inset;
  }
`
const AssetBox = styled(Box)`
	width: 100%;
	height: 61px;
	padding: 17px;
	display: flex;
  align-items: center;
	gap: 10px;
	color: #fff;
	background-color: rgba(255, 255, 255, 0.05);
`