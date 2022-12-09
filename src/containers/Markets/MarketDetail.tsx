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
						<Box display="inline-flex" alignItems="center" sx={{ height: '57px', background: '#141414', borderRadius: '10px', marginBottom: '17px', padding: '6px 12px' }}>
							<Image src={asset.tickerIcon} width="45px" height="45px" />
							<Box sx={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', marginRight: '15px', marginLeft: '10px' }}>
								{asset.tickerName}
							</Box>
							<Box sx={{ color: '#757a7f', fontSize: '18px', fontWeight: '500', lineHeight: '30px' }}>
								{asset.tickerSymbol}
							</Box>
						</Box>
					</Box>

					<Box>
						<Chart price={asset.price} />
					</Box>

					<Box sx={{ marginTop: '15px', marginBottom: '15px', padding: '10px' }}>
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

          <StyledDivider />

					<Box sx={{ padding: '10px' }}>
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
								<ContentHeader>iPortfolio Percentage</ContentHeader>
								<ContentValue>{asset.myPortfolioPercentage.toFixed(2)}%</ContentValue>
							</Box>
						</Stack>
					</Box>

          <StyledDivider />

          <Box sx={{ marginBottom: '40px', padding: '10px' }}>
						<SubTitle>About {asset.tickerSymbol}</SubTitle>
						<DetailDesc>{asset.detailOverview}</DetailDesc>
						<Box sx={{ color: '#cacaca', fontSize: '12px', fontWeight: '600', textDecoration: 'underline', marginTop: '8px' }}>
							Tell me more
						</Box>
					</Box>
				</Stack>
			) : (
				<></>
			)}
		</>
	)
}

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

export default withSuspense(MarketDetail, <LoadingProgress />)
