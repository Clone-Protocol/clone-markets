'use client'
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import Container from '@mui/material/Container'
import MarketList from '~/containers/Markets/MarketList'
import GetUSDiBadge from '~/components/Markets/GetUSDiBadge'
import PortfolioBalance from '~/components/Markets/PortfolioBalance'
import { useWallet } from '@solana/wallet-adapter-react'
import { DEV_RPCs, IS_DEV, MAIN_RPCs } from '~/data/networks'
import { DehydratedState, HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { fetchAssets } from '~/features/Markets/Assets.query'
import { IS_NOT_LOCAL_DEVELOPMENT } from '~/utils/constants'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useSearchParams } from 'next/navigation'
import { fetchLinkReferralCode } from '~/utils/fetch_netlify'
import ReferralDialog from '~/components/Points/ReferralDialog'
import { useEffect, useState } from 'react'

//SSR
// export async function getServerSideProps({ req, res }) {
//   res.setHeader(
//     'Cache-Control',
//     'public, s-maxage=10, stale-while-revalidate=59'
//   )
// })
export const getStaticProps = (async () => {
  const queryClient = new QueryClient()

  if (IS_NOT_LOCAL_DEVELOPMENT) {
    console.log('prefetch')
    await queryClient.prefetchQuery({ queryKey: ['assets'], queryFn: () => fetchAssets({ setShowPythBanner: () => { }, mainCloneClient: null, networkEndpoint: IS_DEV ? DEV_RPCs[0].rpc_url : MAIN_RPCs[0].rpc_url }) })
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      //cached time
      revalidate: 12,
    },
  }
}) satisfies GetStaticProps<{
  dehydratedState: DehydratedState
}>

const Home = ({ dehydratedState }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { publicKey } = useWallet()

  //for referral 
  const params = useSearchParams()
  const refCode = params.get('referralCode')
  const [showReferralDialog, setShowReferralDialog] = useState(false)
  const [properReferred, setProperReferred] = useState(false)

  useEffect(() => {
    if (publicKey && refCode) {
      console.log('refCode', refCode)
      fetchLinkReferralCode(publicKey.toString(), parseInt(refCode).toString()).then((res) => {
        console.log('res', res)
        if (res[0] && res[0].total_points > 0) {
          setProperReferred(false)
        } else {
          setProperReferred(true)
        }
        setShowReferralDialog(true)
      })
    }
  }, [publicKey, refCode])

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
          <HydrationBoundary state={dehydratedState}>
            <MarketList />
          </HydrationBoundary>

          {showReferralDialog && <ReferralDialog isReferred={properReferred} onClose={() => setShowReferralDialog(false)} />}
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
		padding-top: 110px;
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

