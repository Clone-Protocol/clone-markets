import { AssetTickers } from '~/data/assets'
import MarketPageContainer from '~/containers/Market/MarketPageContainer'

const AssetPage = ({ params }: { params: { assetTicker: string } }) => {
  const assetTicker = params.assetTicker || AssetTickers.euro

  return (
    <div>
      <MarketPageContainer assetTicker={assetTicker} />
    </div>
  )
}

export default AssetPage
