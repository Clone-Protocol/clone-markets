'use client'
import { Box, Container } from '@mui/material'
import { styled } from '@mui/material/styles'
import GetUSDiBadge from '~/components/Markets/GetUSDiBadge'
import PortfolioBalance from '~/components/Markets/PortfolioBalance'
import MarketList from '~/containers/Markets/MarketList'
import { useWallet } from '@solana/wallet-adapter-react'
import { IS_DEV } from '~/data/networks'

const MarketContainer = () => {
  const { publicKey } = useWallet()

  return (
    <div>
      <StyledSection>
        <Container>
          {publicKey &&
            <Box>
              <PortfolioBalance />

              <Divider />
              {IS_DEV &&
                <Box mb='30px'>
                  <GetUSDiBadge />
                </Box>
              }
            </Box>
          }
          <MarketList />
        </Container>
      </StyledSection>
    </div>
  )
}

export const StyledSection = styled('section')`
	max-width: 1085px;
	margin: 0 auto;
  padding-bottom: 20px;
	${(props) => props.theme.breakpoints.up('md')} {
		padding-top: 100px;
	}
	${(props) => props.theme.breakpoints.down('md')} {
		padding: 110px 0px;
	}
`
const Divider = styled('div')`
  width: 100%;
  height: 1px;
  margin-top: 30px;
  margin-bottom: 30px;
  background-color: ${(props) => props.theme.basis.melrose};
`

export default MarketContainer