import { Box, Stack, Divider, styled } from '@mui/material'
import Chart from '~/components/Markets/MarketDetail/Chart'
import Image from 'next/image'
import { useMarketDetailQuery } from '~/features/Markets/MarketDetail.query'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'

const MarketDetail = ({ assetId }: { assetId: string }) => {
	const { data: asset } = useMarketDetailQuery({
		index: parseInt(assetId),
		refetchOnMount: true,
		enabled: !!assetId
	})

	return (
		<>
			{asset ? (
				<Stack mb={2} direction="column" padding={5} paddingY={1}>
					<Box>
						<TickerWrapper display="inline-flex" alignItems="center">
							<Image src={asset.tickerIcon} width="45px" height="45px" />
							<TickerName>
								{asset.tickerName}
							</TickerName>
							<TickerSymbol>
								{asset.tickerSymbol}
							</TickerSymbol>
						</TickerWrapper>
					</Box>

					<Chart price={asset.price} />

					<OverviewWrapper>
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
					</OverviewWrapper>

					<StyledDivider />

					<Box padding='10px'>
						<SubTitle>My {asset.tickerSymbol}</SubTitle>
						<Stack direction="row" justifyContent="flex-start" spacing={7}>
							<Box>
								<ContentHeader>Holding</ContentHeader>
								<ContentValue>
									{asset.myHolding.toLocaleString()} <SubValue>{asset.tickerSymbol}</SubValue>
								</ContentValue>
							</Box>
							<Box>
								<ContentHeader>Notional Value</ContentHeader>
								<ContentValue>${asset.myNotionalVal.toLocaleString()} <SubValue>USDi</SubValue></ContentValue>
							</Box>
							<Box>
								<ContentHeader>Portfolio Percentage</ContentHeader>
								<ContentValue>{asset.myPortfolioPercentage.toFixed(2)}%</ContentValue>
							</Box>
						</Stack>
					</Box>

					<StyledDivider />

					<Box marginBottom='40px' padding='10px'>
						<SubTitle>About {asset.tickerSymbol}</SubTitle>
						<DetailDesc>{asset.detailOverview}</DetailDesc>
						<MoreText>Tell me more</MoreText>
					</Box>
				</Stack>
			) : (
				<></>
			)}
		</>
	)
}

const TickerWrapper = styled(Box)`
	height: 57px; 
	background: #141414; 
	border-radius: 10px; 
	margin-bottom: 17px; 
	padding: 6px 12px;
`
const TickerName = styled(Box)`
	color: #ffffff; 
	font-size: 18px; 
	font-weight: 600; 
	margin-right: 15px; 
	margin-left: 10px;
`
const TickerSymbol = styled(Box)`
	color: #757a7f; 
	font-size: 18px; 
	font-weight: 500; 
	line-height: 30px;
`

const OverviewWrapper = styled(Box)`
	margin-top: 15px; 
	margin-bottom: 15px; 
	padding: 10px;
`

const StyledDivider = styled(Divider)`
	background-color: #535353;
	margin-bottom: 6px;
	margin-top: 6px;
	height: 1px;
`

const SubTitle = styled('div')`
	font-size: 16px;
	font-weight: 600;
  color: #fff;
	margin-top: 15px;
	margin-bottom: 20px;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
`

const ContentHeader = styled('div')`
	font-size: 10px;
	font-weight: 600;
	color: #818181;
`

const ContentValue = styled('div')`
	font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  margin-top: 5px;
  color: #cacaca;
`

const DetailDesc = styled(Box)`
  font-size: 12px;
  color: #cacaca;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
`

const SubValue = styled('span')`
  font-size: 10px;
  font-weight: 600;
`

const MoreText = styled(Box)`
	color: #cacaca; 
	font-size: 12px; 
	font-weight: 600; 
	text-decoration: underline; 
	margin-top: 8px;
`

export default withSuspense(MarketDetail, <LoadingProgress />)
