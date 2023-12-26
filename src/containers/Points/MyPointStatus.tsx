'use client'
import { styled } from '@mui/material/styles'
import { Box, Button, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import InfoTooltip from '~/components/Common/InfoTooltip'
import { TooltipTexts } from '~/data/tooltipTexts'
import { RankIndexForStatus } from '~/components/Points/RankItems'
import { usePointStatusQuery } from '~/features/Points/PointStatus.query'
import { useWallet } from '@solana/wallet-adapter-react'
import { BlackDefault, OpaqueDefault } from '~/components/Common/OpaqueArea'
import { useWalletDialog } from '~/hooks/useWalletDialog'

const MyPointStatus = () => {
  const { publicKey } = useWallet()
  const { setOpen } = useWalletDialog()
  const isMobileOnSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  const { data: infos, refetch } = usePointStatusQuery({
    userPubKey: publicKey,
    refetchOnMount: "always",
    enabled: publicKey != null
  })

  return (
    <Wrapper sx={{ alignItems: { xs: 'flex-start', md: 'center' } }}>
      <Stack direction='row' gap={2}>
        <BorderBox width={isMobileOnSize ? '166px' : '176px'}>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Typography variant='p_lg'>Global Rank</Typography>
          </Box>
          <StatusValue>
            <RankIndexForStatus rank={infos?.myRank} />
          </StatusValue>
        </BorderBox>
        <BorderBox width={isMobileOnSize ? '166px' : '350px'} position='relative'>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Typography variant='p_lg'>Your Total Points</Typography>
            <InfoTooltip title={TooltipTexts.points.totalPoints} color='#66707e' />
          </Box>
          <StatusValue>
            <Typography variant='h3' fontWeight={500}>
              {infos ? infos.totalPoints.toLocaleString() : '0'}
            </Typography>
          </StatusValue>
        </BorderBox>
      </Stack>
      <Stack direction='row' gap={2} flexWrap={'wrap'} mt='18px'>
        <BorderBox width={isMobileOnSize ? '166px' : '250px'}>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Typography variant='p'>Your LP Points</Typography>
            <InfoTooltip title={TooltipTexts.points.lpPoints} color='#66707e' />
          </Box>
          <StatusValue>
            <Typography variant='p_xlg'>
              {infos ? infos.lpPoints.toLocaleString() : '0'}
            </Typography>
          </StatusValue>
        </BorderBox>
        <BorderBox width={isMobileOnSize ? '166px' : '250px'}>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Typography variant='p'>Your Trade Points</Typography>
            <InfoTooltip title={TooltipTexts.points.tradePoints} color='#66707e' />
          </Box>
          <StatusValue>
            <Typography variant='p_xlg'>
              {infos ? infos.tradePoints.toLocaleString() : '0'}
            </Typography>
          </StatusValue>
        </BorderBox>
        <BorderBox width={isMobileOnSize ? '166px' : '250px'}>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Typography variant='p'>Your Social Points</Typography>
            <InfoTooltip title={TooltipTexts.points.socialPoints} color='#66707e' />
          </Box>
          <StatusValue>
            <Typography variant='p_xlg'>
              {infos ? infos.socialPoints.toLocaleString() : '0'}
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
  margin-top: 22px;
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

export default MyPointStatus