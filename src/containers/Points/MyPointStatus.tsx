import { styled } from '@mui/system'
import { Box, Button, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import InfoTooltip from '~/components/Common/InfoTooltip'
import { TooltipTexts } from '~/data/tooltipTexts'
import { RankIndexForStatus } from '~/components/Points/RankItems'
import { usePointStatusQuery } from '~/features/Points/PointStatus.query'
import { useWallet } from '@solana/wallet-adapter-react'
import { BlackDefault, OpaqueDefault } from '~/components/Common/OpaqueArea'
import { useWalletDialog } from '~/hooks/useWalletDialog'
import { formatLocaleAmount } from '~/utils/numbers'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import BoltIcon from '@mui/icons-material/Bolt';
import PromoteDialog from '~/components/Points/PromoteDialog'
import { useState } from 'react'

const MyPointStatus = () => {
  const { publicKey } = useWallet()
  const { setOpen } = useWalletDialog()
  const [showPromoteDialog, setShowPromoteDialog] = useState(true)
  const isMobileOnSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  const { data: infos } = usePointStatusQuery({
    userPubKey: publicKey,
    refetchOnMount: "always",
    enabled: publicKey != null
  })

  return (
    <Wrapper sx={{ alignItems: { xs: 'flex-start', md: 'center' } }}>
      <Stack direction='row' gap={2}>
        <BorderBox width={isMobileOnSize ? '140px' : '176px'}>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Typography variant='p_lg'>Global Rank</Typography>
          </Box>
          <StatusValue>
            <RankIndexForStatus rank={infos?.myRank} />
          </StatusValue>
        </BorderBox>
        <BorderBox width={isMobileOnSize ? '140px' : '350px'} position='relative'>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Typography variant='p_lg'>My Total Points</Typography>
            <InfoTooltip title={TooltipTexts.points.totalPoints} color='#66707e' />
          </Box>
          <StatusValue>
            <Typography variant='h3' fontWeight={500}>
              {infos?.totalPoints ? formatLocaleAmount(infos.totalPoints) : '0'}
            </Typography>
          </StatusValue>
        </BorderBox>
      </Stack>
      <Stack direction='row' gap={2} flexWrap={'wrap'} mt='18px'>
        <BorderBox width={isMobileOnSize ? '140px' : '250px'} position='relative'>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Typography variant='p'>My Liquidity Points</Typography>
            <InfoTooltip title={TooltipTexts.points.lpPoints} color='#66707e' />
          </Box>
          <StatusValue>
            <Typography variant='p_xlg'>
              {infos?.lpPoints ? formatLocaleAmount(infos.lpPoints) : '0'}
            </Typography>
          </StatusValue>
          <PromoteBox onClick={() => setShowPromoteDialog(true)}>
            <BoltIcon sx={{ fontSize: '16px', color: '#fbdc5f' }} />
            <ColoredText><Typography variant='p_sm'>2x Multiplier</Typography></ColoredText>
          </PromoteBox>
        </BorderBox>
        <BorderBox width={isMobileOnSize ? '140px' : '250px'}>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Typography variant='p'>My Trade Points</Typography>
            <InfoTooltip title={TooltipTexts.points.tradePoints} color='#66707e' />
          </Box>
          <StatusValue>
            <Typography variant='p_xlg'>
              {infos?.tradePoints ? formatLocaleAmount(infos.tradePoints) : '0'}
            </Typography>
          </StatusValue>
        </BorderBox>
        <BorderBox width={isMobileOnSize ? '140px' : '250px'}>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Typography variant='p'>My Social Points</Typography>
            <InfoTooltip title={TooltipTexts.points.socialPoints} color='#66707e' />
          </Box>
          <StatusValue>
            <Typography variant='p_xlg'>
              {infos?.socialPoints ? formatLocaleAmount(infos.socialPoints) : '0'}
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
      {showPromoteDialog && <PromoteDialog onClose={() => setShowPromoteDialog(false)} />}
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
  margin-top: 22px;
`
const BorderBox = styled(Box)`
  border-radius: 10px;
  border: solid 1px rgba(255, 255, 255, 0.1);
  padding-top: 14px;
  padding-bottom: 22px;
`
const PromoteBox = styled(Box)`
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 110px;
  height: 24px;
  cursor: pointer;
  border-top-left-radius: 10px;
  border-bottom-right-radius: 8px;
  background-color: rgba(255, 255, 255, 0.07);
`
const ColoredText = styled('div')`
  text-shadow: 0 0 5px rgba(252, 220, 95, 0.42);
  background-image: linear-gradient(to right, #fbdc5f 45%, #3dddff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 3px;
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

export default withSuspense(MyPointStatus, <LoadingProgress />)