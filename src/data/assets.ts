export enum Collateral {
	onUSD,
	mockUSDC,
}

export enum Asset {
	Euro,
	Gold,
	Solana,
	Ethereum,
	Bitcoin,
	Bnb,
	Avalanche,
	Tesla,
	Apple,
	Amazon,
}

export enum AssetType {
	Crypto,
	Stocks,
	Fx,
	Commodities,
}

export const ASSETS = [
	{
		tickerName: 'Clone Euro',
		tickerSymbol: 'onEUR',
		tickerIcon: '/images/assets/on-euro.svg',
	},
	{
		tickerName: 'Clone Gold',
		tickerSymbol: 'onGold',
		tickerIcon: '/images/assets/on-gold.svg',
	},
	{
		tickerName: 'Clone Solana',
		tickerSymbol: 'onSOL',
		tickerIcon: '/images/assets/on-sol.svg',
	},
	{
		tickerName: 'Clone Ethereum',
		tickerSymbol: 'onETH',
		tickerIcon: '/images/assets/on-eth.svg',
	},
	{
		tickerName: 'Clone Bitcoin',
		tickerSymbol: 'onBTC',
		tickerIcon: '/images/assets/on-btc.svg',
	},
	{
		tickerName: 'Clone BNB',
		tickerSymbol: 'onBNB',
		tickerIcon: '/images/assets/on-bnb.svg',
	},
	{
		tickerName: 'Clone Avalanche',
		tickerSymbol: 'onAVAX',
		tickerIcon: '/images/assets/on-avax.svg',
	},
	{
		tickerName: 'Clone Tesla',
		tickerSymbol: 'onTLSA',
		tickerIcon: '/images/assets/on-tsla.svg',
	},
	{
		tickerName: 'Clone Apple',
		tickerSymbol: 'onAAPL',
		tickerIcon: '/images/assets/on-aapl.svg',
	},
	{
		tickerName: 'Clone Amazon',
		tickerSymbol: 'onAMZN',
		tickerIcon: '/images/assets/on-amzn.svg',
	},
]

export const assetMapping = (index: number) => {
	let tickerName = ''
	let tickerSymbol = ''
	let tickerIcon = ''
	let assetType: number
	switch (index) {
		case Asset.Euro:
			tickerName = 'Clone Euro'
			tickerSymbol = 'onEUR'
			tickerIcon = '/images/assets/on-euro.svg'
			assetType = AssetType.Fx
			break
		case Asset.Gold:
			tickerName = 'Clone Gold'
			tickerSymbol = 'onGold'
			tickerIcon = '/images/assets/on-gold.svg'
			assetType = AssetType.Commodities
			break
		case Asset.Solana:
			tickerName = 'Clone Solana'
			tickerSymbol = 'onSOL'
			tickerIcon = '/images/assets/on-sol.svg'
			assetType = AssetType.Crypto
			break
		case Asset.Ethereum:
			tickerName = 'Clone Ethereum'
			tickerSymbol = 'onETH'
			tickerIcon = '/images/assets/on-eth.svg'
			assetType = AssetType.Crypto
			break
		case Asset.Bitcoin:
			tickerName = 'Clone Bitcoin'
			tickerSymbol = 'onBTC'
			tickerIcon = '/images/assets/on-btc.svg'
			assetType = AssetType.Crypto
			break
		case Asset.Bnb:
			tickerName = 'Clone BNB'
			tickerSymbol = 'onBNB'
			tickerIcon = '/images/assets/on-bnb.svg'
			assetType = AssetType.Crypto
			break
		case Asset.Avalanche:
			tickerName = 'Clone Avalanche'
			tickerSymbol = 'onAVAX'
			tickerIcon = '/images/assets/on-avax.svg'
			assetType = AssetType.Crypto
			break
		case Asset.Tesla:
			tickerName = 'Clone Tesla'
			tickerSymbol = 'onTLSA'
			tickerIcon = '/images/assets/on-tsla.svg'
			assetType = AssetType.Stocks
			break
		case Asset.Apple:
			tickerName = 'Clone Apple'
			tickerSymbol = 'onAAPL'
			tickerIcon = '/images/assets/on-aapl.svg'
			assetType = AssetType.Stocks
			break
		case Asset.Amazon:
			tickerName = 'Clone Amazon'
			tickerSymbol = 'onAMZN'
			tickerIcon = '/images/assets/on-amzn.svg'
			assetType = AssetType.Stocks
			break
		default:
			throw new Error('Not supported')
	}

	return { tickerName, tickerSymbol, tickerIcon, assetType }
}

export const collateralMapping = (index: number) => {
	let collateralName = ''
	let collateralSymbol = ''
	let collateralIcon = ''
	let collateralType: number
	switch (index) {
		case Collateral.onUSD:
			collateralName = 'Clone USD'
			collateralType = Collateral.onUSD
			collateralSymbol = 'onUSD'
			collateralIcon = '/images/assets/on-usd.svg'
			break
		case Collateral.mockUSDC:
			collateralName = 'USDC'
			collateralType = Collateral.mockUSDC
			collateralSymbol = 'USDC'
			collateralIcon = '/images/assets/on-usd.svg'
			break
		default:
			throw new Error('Not supported')
	}

	return { collateralName, collateralSymbol, collateralIcon, collateralType }
}