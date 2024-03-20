import { styled } from '@mui/system'
import { Box, Button, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import { useWallet } from '@solana/wallet-adapter-react'
import { BlackDefault, OpaqueDefault } from '~/components/Common/OpaqueArea'
import { useWalletDialog } from '~/hooks/useWalletDialog'
import { formatLocaleAmount } from '~/utils/numbers'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import { useGiveawayStatusQuery } from '~/features/Giveaway/GiveawayStatus.query'

const MyGiveawayStatus = () => {
  const { publicKey } = useWallet()
  const { setOpen } = useWalletDialog()
  const isMobileOnSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  const { data: infos } = useGiveawayStatusQuery({
    userPubKey: publicKey,
    refetchOnMount: true,
    enabled: publicKey != null
  })

  return (
    <Wrapper sx={{ alignItems: { xs: 'flex-start', md: 'center' } }}>
      <Stack direction='row' gap='12px' flexWrap={'wrap'} mt='18px'>
        <BorderBox width={'150px'} height='92px' position='relative'>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Typography variant='p'>Grand Prize</Typography>
          </Box>
          <StatusValue1>
            <Typography variant='p_xlg'>
              {infos?.lpPoints ? formatLocaleAmount(infos.lpPoints) : '0'}
            </Typography>
          </StatusValue1>
        </BorderBox>
        <BorderBox width={'150px'} height='92px' position='relative'>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Typography variant='p'>Draw #2</Typography>
          </Box>
          <StatusValue2>
            <Typography variant='p_xlg'>
              {infos?.tradePoints ? formatLocaleAmount(infos.tradePoints) : '0'}
            </Typography>
          </StatusValue2>
        </BorderBox>
        <BorderBox width={'150px'} height='92px'>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Typography variant='p'>Draw #3</Typography>
          </Box>
          <StatusValue3>
            <Typography variant='p_xlg'>
              {infos?.socialPoints ? formatLocaleAmount(infos.socialPoints) : '0'}
            </Typography>
          </StatusValue3>
        </BorderBox>
      </Stack>
      <Stack direction='row' gap={2} mt='23px'>
        <BorderBox width='474px' height='104px' position='relative'>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Typography variant='p_lg'>Your Tickets</Typography>
          </Box>
          <StatusValue>
            <Typography variant='p_lg' fontWeight={500}>
              {infos?.totalPoints ? formatLocaleAmount(infos.totalPoints) : '0'}
            </Typography>
          </StatusValue>
        </BorderBox>
      </Stack>
      {!publicKey && <>
        {isMobileOnSize ? <BlackDefault /> : <OpaqueDefault />}
        <Box position='absolute' top='20px' marginY='55px' left="0px" right="0px" marginX='auto'>
          <Box display='flex' justifyContent='center' mb='7px'><Typography variant='p_lg'>To see your points: </Typography></Box>
          <Box display='flex' justifyContent='center'>
            <ConnectWallet onClick={() => setOpen(true)}><Typography variant='p_xlg'>Connect Wallet</Typography></ConnectWallet>
          </Box>
        </Box>
      </>}
    </Wrapper>
  )

}

const Wrapper = styled(Box)`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 28px;
  padding: 12px 28px;
`
const StatusValue = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  margin-top: 22px;
`
const StatusValue1 = styled(StatusValue)`
  background-image: linear-gradient(147deg, #ffc700 5%, #ffe99b 28%, #ffeaa1 65%, #ffd600 89%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`
const StatusValue2 = styled(StatusValue)`
  background-image: linear-gradient(150deg, #999 1%, #fff 41%, #cbcbcb 67%, #8d8d8d 93%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`
const StatusValue3 = styled(StatusValue)`
  background-image: linear-gradient(150deg, #ff974b -1%, #ffbf85 18%, #ffd4ab 39%, #fff0e2 67%, #ffb571 94%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`
const BorderBox = styled(Box)`
  border-radius: 10px;
  border: solid 1px rgba(255, 255, 255, 0.1);
  padding-top: 14px;
  padding-bottom: 22px;
`
const ConnectWallet = styled(Button)`
  width: 236px;
  height: 52px;
  object-fit: contain;
  border-radius: 10px;
  border: solid 1px ${(props) => props.theme.basis.melrose};
  box-shadow: 0 0 15px 0 #005874;
  background-color: #000;
  color: #fff;
  &:hover {
    background-color: #000;
    border-color: ${(props) => props.theme.basis.lightSlateBlue}};
  }
`

export default withSuspense(MyGiveawayStatus, <LoadingProgress />)