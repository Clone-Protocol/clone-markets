import { Box, Stack, Divider, Typography } from '@mui/material'
import { styled } from '@mui/system'
import Chart from '~/components/Markets/MarketDetail/Chart'
import Image from 'next/image'
import { useMarketDetailQuery } from '~/features/Markets/MarketDetail.query'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import { formatDollarAmount } from '~/utils/numbers'
import { useWallet } from '@solana/wallet-adapter-react'
import { useUserBalanceQuery } from '~/features/Portfolio/UserBalance.query'
import { useEffect, useState } from 'react'

const MarketDetail = ({ assetId }: { assetId: string }) => {
	const { publicKey } = useWallet()
	const { data: asset } = useMarketDetailQuery({
		index: parseInt(assetId),
		refetchOnMount: "always",
		enabled: true
	})
	const [myData, setMyData] = useState({
		balance: 0,
		value: 0,
		portfolioValue: 0
	})

	const { data: myAssets } = useUserBalanceQuery({
		userPubKey: publicKey,
		filter: 'all',
		refetchOnMount: 'always',
		enabled: publicKey != null
	})

	useEffect(() => {
		if (myAssets && myAssets.length > 0) {
			let foundItem = false
			myAssets.forEach((myAsset) => {
				if (myAsset.id === parseInt(assetId)) {
					setMyData({
						balance: myAsset.assetBalance,
						value: myAsset.onusdBalance,
						portfolioValue: myAsset.percentVal!
					})
					foundItem = true
					return;
				}
			})
			if (!foundItem) {
				setMyData({
					balance: 0,
					value: 0,
					portfolioValue: 0
				})
			}
		}
	}, [myAssets, assetId])

	return (
		<>
			{asset ? (
				<Stack mb={2} direction="column" paddingLeft={5} paddingY={1} maxWidth='750px'>
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

					<Chart pythSymbol={asset.pythSymbol} price={asset.price} />

					<OverviewWrapper>
						<Typography variant='h3' fontWeight={500}>Market Overview</Typography>
						<Stack direction="row" justifyContent="flex-start" spacing={9} mt='25px'>
							<Box width='160px'>
								<Box><Typography variant='p' color='#8988a3'>Volume (24h)</Typography></Box>
								<Box mt='8px'>
									<Typography variant='h3' fontWeight={500}>${asset.volume.toLocaleString()} onUSD</Typography>
								</Box>
							</Box>
							<Box width='160px'>
								<Box><Typography variant='p' color='#8988a3'>Current Liquidity (24h)</Typography></Box>
								<Box mt='8px'>
									<Typography variant='h3' fontWeight={500} whiteSpace='nowrap'>{formatDollarAmount(asset.avgLiquidity, 3)} onUSD</Typography>
								</Box>
							</Box>
							<Box width='160px'>
								<Box><Typography variant='p' color='#8988a3'>Current Premium (24h)</Typography></Box>
								<Box mt='8px'>
									<Typography variant='h3' fontWeight={500}>{asset.avgPremium.toFixed(3)}%</Typography>
								</Box>
							</Box>
						</Stack>
					</OverviewWrapper>

					{publicKey &&
						<Box>
							<StyledDivider />

							<Box padding='10px'>
								<Typography variant='h3' fontWeight={500}>My {asset.tickerSymbol}</Typography>
								<Stack direction="row" justifyContent="flex-start" spacing={9} mt='25px'>
									<Box width='160px'>
										<Box><Typography variant='p' color='#8988a3'>Balance</Typography></Box>
										<Box mt='8px'>
											<Typography variant='h3' fontWeight={500}>{myData.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })} {asset.tickerSymbol}</Typography>
										</Box>
									</Box>
									<Box width='160px'>
										<Box><Typography variant='p' color='#8988a3'>Value</Typography></Box>
										<Box mt='8px'>
											<Typography variant='h3' fontWeight={500}>${myData.value.toLocaleString()} onUSD</Typography>
										</Box>
									</Box>
									<Box width='160px'>
										<Box><Typography variant='p' color='#8988a3'>Portfolio %</Typography></Box>
										<Box mt='8px'>
											<Typography variant='h3' fontWeight={500}>{myData.portfolioValue.toFixed(2)}%</Typography>
										</Box>
									</Box>
								</Stack>
							</Box>
						</Box>
					}

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
