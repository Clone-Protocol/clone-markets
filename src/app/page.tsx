'use client'
import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import Container from '@mui/material/Container'
import MarketList from '~/containers/Markets/MarketList'
import GetUSDiBadge from '~/components/Markets/GetUSDiBadge'
import PortfolioBalance from '~/components/Markets/PortfolioBalance'
import useLocalStorage from '~/hooks/useLocalStorage'
import { useWallet } from '@solana/wallet-adapter-react'
import { IS_DEV } from '~/data/networks'
import { IS_COMPLETE_INIT } from '~/data/localstorage'
import dynamic from 'next/dynamic'

const Home = () => {
  const { publicKey } = useWallet()
  const [isCompleteInit, _] = useLocalStorage(IS_COMPLETE_INIT, false)
  const [isOpenInit, setIsOpenInit] = useState(false)
  const InitEnterScreen = dynamic(() => import('~/components/Common/InitEnterScreen'), { ssr: false })

  useEffect(() => {
    if (!isCompleteInit) {
      setIsOpenInit(true)
    }
  }, [isCompleteInit])

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
      {IS_DEV && isOpenInit && <InitEnterScreen onClose={() => setIsOpenInit(false)} />}
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

export default Home
