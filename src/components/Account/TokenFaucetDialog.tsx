import { Box, styled, Dialog, DialogContent, Stack, Typography } from '@mui/material'
import { FadeTransition } from '~/components/Common/Dialog'
import Image from 'next/image'
import ConnectWalletIcon from 'public/images/icons-connect-wallet.svg'
import WalletIcon from 'public/images/wallet-icon.svg'
import ArrowOutwardIcon from 'public/images/arrow-outward-icon.svg'
import infoOutlineIcon from 'public/images/info-outline.svg'

const TokenFaucetDialog = ({ open, isConnect, connectWallet, onGetUsdiClick, onHide }: { open: boolean, isConnect: boolean, connectWallet: () => void, onGetUsdiClick: () => void, onHide: () => void }) => {

  return (
    <>
      <Dialog open={open} onClose={onHide} TransitionComponent={FadeTransition}>
        <DialogContent sx={{ backgroundColor: '#080018', border: '1px solid #414166', borderRadius: '20px' }}>
          <BoxWrapper>
            <Box mb="21px"><Typography variant='h3' fontWeight={500}>Devnet Token Faucet</Typography></Box>
            <a href="https://solfaucet.com/" target="_blank" rel="noreferrer">
              <LinkBox>
                <Stack direction='row' justifyContent='space-between' alignItems='center' width='100%'>
                  <Stack direction='row' spacing={2} alignItems='center'>
                    <Image src={'/images/assets/solana.png'} width="27px" height="27px" />
                    <Typography variant='p_lg'>Devnet SOL</Typography>
                  </Stack>
                  <Image src={ArrowOutwardIcon} />
                </Stack>
              </LinkBox>
            </a>
            <LinkBox mt="11px" mb="17px" onClick={onGetUsdiClick}>
              <Stack direction='row' justifyContent='space-between' alignItems='center' width='100%'>
                <Stack direction='row' spacing={2} alignItems='center'>
                  <Image src={'/images/assets/USDi.png'} width="27px" height="27px" />
                  <Typography variant='p_lg' color={isConnect ? '#fff' : '#8988a3'}>Devnet onUSD ($100)</Typography>
                </Stack>
                <Box>
                  {
                    isConnect ? (
                      <Stack direction='row' alignItems='center'>
                        <Image src={WalletIcon} alt="wallet" />
                      </Stack>
                    ) : (
                      <Stack direction='row' alignItems='center' onClick={connectWallet} sx={{ cursor: 'pointer' }}>
                        <Image src={ConnectWalletIcon} alt="wallet" />
                        <Box width='44px' lineHeight={0.7} ml='5px'><Typography variant='p_sm' color='#fffc72'>Connect Wallet</Typography></Box>
                      </Stack>
                    )
                  }
                </Box>
              </Stack>
            </LinkBox>
            <InfoBox mb="8px">
              <Image src={infoOutlineIcon} alt="info" width='18px' />
              <Typography variant='p' ml='12px' maxWidth='278px'>
                You need Devnet SOL in your wallet before you can claim Devnet onUSD.
              </Typography>
            </InfoBox>
            <InfoBox>
              <Image src={infoOutlineIcon} alt="info" width='18px' />
              <Typography variant='p' ml='12px' maxWidth='278px'>
                The Solana Devnet is a safe playground for developers, users, and validators to test applications at no risk. Click this box to learn more.
              </Typography>
            </InfoBox>
          </BoxWrapper>
        </DialogContent>
      </Dialog>
    </>
  )
}

const BoxWrapper = styled(Box)`
  padding: 1px; 
  color: #fff;
  width: 347px;
  overflow-x: hidden;
`
const LinkBox = styled(Box)`
  display: flex;
  align-items: center; 
  width: 100%;
  height: 54px;
  padding: 10px 20px;
  border-radius: 10px;
  border: solid 1px ${(props) => props.theme.basis.portGore};
  background: ${(props) => props.theme.basis.royalPurple};
  color: #fff;
  cursor: pointer;
  &:hover {
    border-color: #fff;
  }
`
const InfoBox = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  line-height: 1.33;
  border-radius: 10px;
  border: solid 1px ${(props) => props.theme.basis.portGore};
  color: ${(props) => props.theme.basis.textRaven};
`

export default TokenFaucetDialog