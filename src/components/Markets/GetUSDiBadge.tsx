import { Typography, Stack, Box, Button } from '@mui/material'
import { styled } from '@mui/system'
import Image from 'next/image'
import PrimaryIcon from 'public/images/icons-badge.svg'
// import { useSetRecoilState } from 'recoil'
import { useSetAtom } from 'jotai'
import { mintUSDi } from '~/features/globalAtom'

const GetUSDiBadge: React.FC = () => {
  const setMintUsdi = useSetAtom(mintUSDi)
  return <StyledStack direction='row' justifyContent='center' alignItems='center' spacing={2}>
    <Image src={PrimaryIcon} />
    <Box>
      <Typography variant='p_lg'>Get onUSD from the faucet to start trading on Devnet. On mainnet, you can acquire onUSD through 1:1 swap with USDC.</Typography>
    </Box>
    <GetButton onClick={() => setMintUsdi(true)}><Typography variant='p'>Get Devnet onUSD</Typography></GetButton>
  </StyledStack>
}

const StyledStack = styled(Stack)`
  width: 100%;
  height: 74px;
  color: ${(props) => props.theme.basis.lightSlateBlue};
  border-radius: 10px;
  background-color: rgba(170, 63, 255, 0.12);
`

const GetButton = styled(Button)`
  width: 125px;
  height: 39px;
  flex-grow: 0;
  padding: 8px 4px 8px 5px;
  border-radius: 100px;
  color: #fff;
  background-color: rgba(196, 181, 253, 0.1);

  &:hover {
		background-color: rgba(155, 121, 252, 0.15);

		&::before {
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			border-radius: 100px;
			border: 1px solid transparent;
			background: ${(props) => props.theme.gradients.light} border-box;
			-webkit-mask:
				linear-gradient(#fff 0 0) padding-box, 
				linear-gradient(#fff 0 0);
			-webkit-mask-composite: destination-out;
			mask-composite: exclude;
		}
	}
`

export default GetUSDiBadge
