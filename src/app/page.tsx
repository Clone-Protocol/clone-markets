import { IS_DEV } from '~/data/networks'
import dynamic from 'next/dynamic'
import MarketContainer from '~/containers/Markets/MarketContainer'

const Home = () => {
  // const { publicKey } = useWallet()
  const InitEnterScreen = dynamic(() => import('~/components/Common/InitEnterScreen'), { ssr: true })

  return (
    <div>
      <MarketContainer />
      {IS_DEV && <InitEnterScreen />}
    </div>
  )
}

export default Home
