import { Box, Stack, Button, styled } from '@mui/material'
import Chart from '~/components/Markets/MarketDetail/Chart'
import Image from 'next/image'
import { useWallet } from '@solana/wallet-adapter-react'
// import { Asset, fetchAsset, fetchAssetDefault } from '~/web3/Markets/detail'
import { useDetailQuery } from '~/features/Markets/Detail.query'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'

const MarketDetail = ({ assetId }: { assetId: string }) => {
	const { publicKey } = useWallet()

  const { data: asset } = useDetailQuery({
    userPubKey: publicKey,
	  index: parseInt(assetId) - 1,
	  refetchOnMount: true,
    enabled: publicKey != null && !!assetId
	})

	return (
		<>
			{asset ? (
				<Stack mb={2} direction="column" padding={5}>
					<Box display="flex">
						<Image src={asset.tickerIcon} width="40px" height="40px" />
						<Box sx={{ fontSize: '28px', fontWeight: '600', marginRight: '15px', marginLeft: '10px' }}>
							{asset.tickerName}
						</Box>
						<Box sx={{ color: '#757a7f', fontSize: '24px', fontWeight: '600', lineHeight: '42px' }}>
							{asset.tickerSymbol}
						</Box>
					</Box>
					<Box>
						<PriceValue>${asset.price.toLocaleString()}</PriceValue>
					</Box>

					<Box>
						<Chart />
					</Box>

					<Box sx={{ marginBottom: '40px' }}>
						<SubTitle>Market Overview</SubTitle>
						<Stack direction="row" justifyContent="space-between">
							<Box>
								<ContentHeader>Volume (24h)</ContentHeader>
								<ContentValue>${asset.volume.toLocaleString()} <SubValue>USDi</SubValue></ContentValue>
							</Box>
							<Box>
								<ContentHeader>Avg Liquidity (24h)</ContentHeader>
								<ContentValue>${asset.avgLiquidity.toLocaleString()} <SubValue>USDi</SubValue></ContentValue>
							</Box>
							<Box>
								<ContentHeader>Maximum Order Size</ContentHeader>
								<ContentValue>
									{asset.maxOrderSize} <SubValue>{asset.tickerSymbol}</SubValue>
								</ContentValue>
							</Box>
							<Box>
								<ContentHeader>Avg Premium (24h)</ContentHeader>
								<ContentValue>{asset.avgPremium.toFixed(3)}%</ContentValue>
							</Box>
						</Stack>
					</Box>

					<Box sx={{ marginBottom: '40px' }}>
						<SubTitle>About {asset.tickerSymbol}</SubTitle>
						<DetailDesc>{asset.detailOverview}</DetailDesc>
						<Box sx={{ fontSize: '14px', fontWeight: '600', textDecoration: 'underline', marginTop: '8px' }}>
							Tell me more
						</Box>
					</Box>

					<Box>
						<SubTitle>My {asset.tickerSymbol}</SubTitle>
						<Stack direction="row" justifyContent="flex-start" spacing={7}>
							<Box>
								<ContentHeader>Holding</ContentHeader>
								<ContentValue>
									{asset.myHolding} <SubValue>{asset.tickerSymbol}</SubValue>
								</ContentValue>
							</Box>
							<Box>
								<ContentHeader>Notional Value</ContentHeader>
								<ContentValue>${asset.myNotionalVal} <SubValue>USDi</SubValue></ContentValue>
							</Box>
							<Box>
								<ContentHeader>iPortfolio Percentage</ContentHeader>
								<ContentValue>{asset.myPortfolioPercentage}%</ContentValue>
							</Box>
						</Stack>
					</Box>
				</Stack>
			) : (
				<></>
			)}
		</>
	)
}

const PriceValue = styled(Box)`
  font-size: 40px;
  margin-top: 10px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
`

const SubTitle = styled('div')`
	font-size: 24px;
	font-weight: 600;
	margin-top: 20px;
	margin-bottom: 20px;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
`

const ContentHeader = styled('div')`
	font-size: 12px;
	font-weight: 600;
	color: #5f5f5f;
`

const ContentValue = styled('div')`
	font-size: 23px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  margin-top: 10px;
`

const DetailDesc = styled(Box)`
  font-size: 14px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
`

const SubValue = styled('span')`
  font-size: 12px;
  font-weight: 600;
`

export default withSuspense(MarketDetail, <LoadingProgress />)
