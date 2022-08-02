import { Box, Stack, Divider, styled } from '@mui/material'
import Chart from '~/components/Markets/MarketDetail/Chart'
import Image from 'next/image'
import { useWallet } from '@solana/wallet-adapter-react'
import { useDetailQuery } from '~/features/Markets/Detail.query'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'

const MarketDetail = ({ assetId }: { assetId: string }) => {
	const { publicKey } = useWallet()

  const { data: asset } = useDetailQuery({
    userPubKey: publicKey,
	  index: parseInt(assetId),
	  refetchOnMount: true,
    enabled: publicKey != null && !!assetId
	})

	return (
		<>
			{asset ? (
				<Stack mb={2} direction="column" padding={4} paddingY={1}>
					<Box display="flex" alignItems="center" sx={{ width: '209px', height: '57px', background: '#141414', borderRadius: '10px', marginBottom: '17px', paddingLeft: '8px' }}>
						<Image src={asset.tickerIcon} width="45px" height="45px" />
						<Box sx={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', marginRight: '15px', marginLeft: '10px' }}>
							{asset.tickerName}
						</Box>
						<Box sx={{ color: '#757a7f', fontSize: '18px', fontWeight: '500', lineHeight: '30px' }}>
							({asset.tickerSymbol})
						</Box>
					</Box>

					<Box>
						<Chart />
					</Box>

					<Box sx={{ marginTop: '30px', marginBottom: '15px' }}>
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

          <StyledDivider />

          <Box sx={{ marginBottom: '40px' }}>
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
	margin-bottom: 15px;
	margin-top: 15px;
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
