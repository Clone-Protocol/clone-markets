import { DEV_RPCs, IS_DEV, MAIN_RPCs } from '~/data/networks'
import dynamic from 'next/dynamic'
import MarketContainer from '~/containers/Markets/MarketContainer'
// import { getQueryClient } from '~/hocs/QueryClient'
import { fetchAssets } from '~/features/Markets/Assets.query'
import getQueryClient from '~/hocs/GetQueryClient'
import { Hydrate, dehydrate } from '@tanstack/react-query'

const Home = async () => {
  const InitEnterScreen = dynamic(() => import('~/components/Common/InitEnterScreen'), { ssr: true })

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(['assets'], () => fetchAssets({ mainCloneClient: null, networkEndpoint: IS_DEV ? DEV_RPCs[0].rpc_url : MAIN_RPCs[0].rpc_url }))
  const dehydratedState = dehydrate(queryClient)

  return (
    <div>
      <Hydrate state={dehydratedState}>
        <MarketContainer />
      </Hydrate>
      {IS_DEV && <InitEnterScreen />}
    </div>
  )
}

export default Home
