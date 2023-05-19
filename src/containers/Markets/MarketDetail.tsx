import { Box, Stack, Divider, styled, Typography } from '@mui/material'
import Chart from '~/components/Markets/MarketDetail/Chart'
import Image from 'next/image'
import { useMarketDetailQuery } from '~/features/Markets/MarketDetail.query'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import { formatDollarAmount } from '~/utils/numbers'

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
						<Box display="inline-flex" alignItems="center">
							<Image src={asset.tickerIcon} width="30px" height="30px" />
							<Box ml='8px'>
								<Typography variant="h3" fontWeight={500}>{asset.tickerName}</Typography>
							</Box>
							<Box ml='8px'>
								<Typography variant='h3' fontWeight={500} color='#8988a3'>{asset.tickerSymbol}</Typography>
							</Box>
						</Box>
					</Box>

					<Chart price={asset.price} />

					<OverviewWrapper>
						<Typography variant='h3' fontWeight={500}>Market Overview</Typography>
						<Stack direction="row" justifyContent="flex-start" spacing={9} mt='25px'>
							<Box width='150px'>
								<Box><Typography variant='p' color='#8988a3'>Volume (24h)</Typography></Box>
								<Box mt='8px'>
									<Typography variant='h3' fontWeight={500}>${asset.volume.toLocaleString()} onUSD</Typography>
								</Box>
							</Box>
							<Box width='150px'>
								<Box><Typography variant='p' color='#8988a3'>Avg Liquidity (24h)</Typography></Box>
								<Box mt='8px'>
									<Typography variant='h3' fontWeight={500}>{formatDollarAmount(asset.avgLiquidity, 3)} onUSD</Typography>
								</Box>
							</Box>
							<Box width='150px'>
								<Box><Typography variant='p' color='#8988a3'>Avg Premium (24h)</Typography></Box>
								<Box mt='8px'>
									<Typography variant='h3' fontWeight={500}>{asset.avgPremium.toFixed(3)}%</Typography>
								</Box>
							</Box>
						</Stack>
					</OverviewWrapper>

					<StyledDivider />

					<Box padding='10px'>
						<Typography variant='h3' fontWeight={500}>My {asset.tickerSymbol}</Typography>
						<Stack direction="row" justifyContent="flex-start" spacing={9} mt='25px'>
							<Box width='150px'>
								<Box><Typography variant='p' color='#8988a3'>Balance</Typography></Box>
								<Box mt='8px'>
									<Typography variant='h3' fontWeight={500}>{asset.myHolding.toLocaleString()} {asset.tickerSymbol}</Typography>
								</Box>
							</Box>
							<Box width='150px'>
								<Box><Typography variant='p' color='#8988a3'>Value</Typography></Box>
								<Box mt='8px'>
									<Typography variant='h3' fontWeight={500}>${asset.myNotionalVal.toLocaleString()} onUSD</Typography>
								</Box>
							</Box>
							<Box width='150px'>
								<Box><Typography variant='p' color='#8988a3'>Portfolio %</Typography></Box>
								<Box mt='8px'>
									<Typography variant='h3' fontWeight={500}>{asset.myPortfolioPercentage.toFixed(2)}%</Typography>
								</Box>
							</Box>
						</Stack>
					</Box>

					<StyledDivider />

					<Box marginBottom='40px' padding='10px'>
						<Typography variant='h3' fontWeight={500}>About {asset.tickerSymbol}</Typography>
						<Box lineHeight={1.14} mt='8px'><Typography variant='p_lg'>{asset.detailOverview}</Typography></Box>
						<Typography variant='p_lg' color='#c4b5fd'>...read more</Typography>
					</Box>
				</Stack>
			) : (
				<></>
			)}
		</>
	)
}

const OverviewWrapper = styled(Box)`
	margin-top: 15px; 
	margin-bottom: 15px; 
	padding: 10px;
`
const StyledDivider = styled(Divider)`
	background-color: rgba(195, 153, 248, 0.25);
	margin-bottom: 12px;
	margin-top: 12px;
	height: 1px;
`


export default withSuspense(MarketDetail, <LoadingProgress />)
