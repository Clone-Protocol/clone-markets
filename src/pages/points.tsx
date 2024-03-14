'use client'
import { StyledSection } from '~/components/Layout'
import { Container, Box, Typography, Stack } from '@mui/material'
import Image from 'next/image'
import LearnMoreIcon from 'public/images/learn-more.svg'
import MyPointStatus from '~/containers/Points/MyPointStatus'
import RankingList from '~/containers/Points/RankingList'
// import { DehydratedState, Hydrate, QueryClient, dehydrate } from '@tanstack/react-query'
import { IS_NOT_LOCAL_DEVELOPMENT } from '~/utils/constants'
import { RankingList as RankingListType, fetchRanking } from '~/features/Points/Ranking.query'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { DehydratedState, HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'

//SSR
export const getStaticProps = (async () => {
  const queryClient = new QueryClient()

  if (IS_NOT_LOCAL_DEVELOPMENT) {
    console.log('prefetch')
    await queryClient.prefetchQuery({ queryKey: ['ranks'], queryFn: () => fetchRanking() })
  }

  // SSR : there's netlify issue
  /*
  //get pyth data
  let pythResult = { result: [] }
  try {
    const fetchData = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/data/pythSnapshot.json`)
    const fileContents = await fetchData.json()
    pythResult = {
      result: fileContents
    }
    // console.log('pythResult', pythResult)
  } catch (error) {
    console.error('err', error)
  }

  // get ranking
  let rankingList: RankingListType[] = []
  try {
    rankingList = await fetchRanking(pythResult)
  } catch (error) {
    console.error('err', error)
  }
  */

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      // rankingList,
      //cached time
      revalidate: 30,
    },
  }
}) satisfies GetStaticProps<{
  dehydratedState: DehydratedState,
  // rankingList: RankingListType[]
}>

const Points = ({ dehydratedState }: InferGetStaticPropsType<typeof getStaticProps>) => {

  return (
    <StyledSection sx={{ overflowX: 'hidden' }}>
      <Container>
        <Box sx={{ paddingX: { xs: '0px', md: '20px' } }}>
          <Box><Typography fontSize='20px' fontWeight={500}>Points: Season 1</Typography></Box>
          <Stack direction='row' alignItems='center' gap={1}>
            <Typography variant='p' color='#66707e'>Earn points by participating in Clone ecosystem.</Typography>
            <a href="https://docs.clone.so/clone-mainnet-guide/points-program/season-1" target='_blank'>
              <Box display='flex' color='#c4b5fd' sx={{ cursor: 'pointer', ':hover': { color: '#8070ad' }, whiteSpace: 'nowrap' }}>
                <Typography variant='p' mr='3px'>Learn more</Typography>
                <Image src={LearnMoreIcon} alt='learnMore' />
              </Box>
            </a>
          </Stack>
          <Box mt='10px'>
            <MyPointStatus />

            <HydrationBoundary state={dehydratedState}>
              <RankingList />
            </HydrationBoundary>
          </Box>
        </Box>
      </Container>
    </StyledSection>
  )
}

export default Points
