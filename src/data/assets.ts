import { ON_USD } from "~/utils/constants"

export enum Collateral {
    onUSD,
    mockUSDC,
}

export enum AssetTickers {
    euro = 0,
    gold = 1,
    solana = 2,
    ethereum = 3,
    bitcoin = 4,
    cosmos = 5,
    avalanche = 6,
    sui = 7,
    aptos = 8,
    cardano = 9,
}

export enum Asset {
    Euro,
    Gold,
    Solana,
    Ethereum,
    Bitcoin,
    Cosmos,
    Avalanche,
    Sui,
    Aptos,
    Cardano,
}

export enum AssetType {
    Crypto,
    Fx,
    Commodities,
}

export const ASSETS = [
    {
        tickerName: 'clEuro',
        tickerSymbol: 'clEUR',
        tickerIcon: '/images/assets/on-euro.svg',
        ticker: 'euro',
        pythSymbol: 'FX.EUR/USD'
    },
    {
        tickerName: 'clGold',
        tickerSymbol: 'clGOLD',
        tickerIcon: '/images/assets/on-gold.svg',
        ticker: 'gold',
        pythSymbol: 'Metal.XAU/USD'
    },
    {
        tickerName: 'clSolana',
        tickerSymbol: 'clSOL',
        tickerIcon: '/images/assets/on-sol.svg',
        ticker: 'solana',
        pythSymbol: 'Crypto.SOL/USD'
    },
    {
        tickerName: 'clEthereum',
        tickerSymbol: 'clETH',
        tickerIcon: '/images/assets/on-eth.svg',
        ticker: 'ethereum',
        pythSymbol: 'Crypto.ETH/USD'
    },
    {
        tickerName: 'clBitcoin',
        tickerSymbol: 'clBTC',
        tickerIcon: '/images/assets/on-btc.svg',
        ticker: 'bitcoin',
        pythSymbol: 'Crypto.BTC/USD'
    },
    {
        tickerName: 'clCosmos',
        tickerSymbol: 'clATOM',
        tickerIcon: '/images/assets/on-atom.svg',
        ticker: 'cosmos',
        pythSymbol: 'Crypto.ATOM/USD'
    },
    {
        tickerName: 'clAvalanche',
        tickerSymbol: 'clAVAX',
        tickerIcon: '/images/assets/on-avax.svg',
        ticker: 'avalanche',
        pythSymbol: 'Crypto.AVAX/USD'
    },
    {
        tickerName: 'clSui',
        tickerSymbol: 'clSUI',
        tickerIcon: '/images/assets/on-sui.svg',
        ticker: 'sui',
        pythSymbol: 'Crypto.SUI/USD'
    },
    {
        tickerName: 'clAptos',
        tickerSymbol: 'clAPT',
        tickerIcon: '/images/assets/on-apt.svg',
        ticker: 'aptos',
        pythSymbol: 'Crypto.APT/USD'
    },
    {
        tickerName: 'clCardano',
        tickerSymbol: 'clADA',
        tickerIcon: '/images/assets/on-ada.svg',
        ticker: 'cardano',
        pythSymbol: 'Crypto.ADA/USD'
    },
]

export const assetMapping = (index: number) => {
    let tickerName = ''
    let tickerSymbol = ''
    let tickerIcon = ''
    let ticker = ''
    let assetType: number
    let pythSymbol = ''
    let supabaseSymbol = ''
    switch (index) {
        case Asset.Euro:
            tickerName = 'clEuro'
            tickerSymbol = 'clEUR'
            tickerIcon = '/images/assets/on-euro.svg'
            ticker = 'euro'
            assetType = AssetType.Fx
            pythSymbol = 'FX.EUR/USD'
            supabaseSymbol = pythSymbol
            break
        case Asset.Gold:
            tickerName = 'clGold'
            tickerSymbol = 'clGOLD'
            tickerIcon = '/images/assets/on-gold.svg'
            ticker = 'gold'
            assetType = AssetType.Commodities
            pythSymbol = 'Metal.XAU/USD'
            supabaseSymbol = pythSymbol
            break
        case Asset.Solana:
            tickerName = 'clSolana'
            tickerSymbol = 'clSOL'
            tickerIcon = '/images/assets/on-sol.svg'
            ticker = 'solana'
            assetType = AssetType.Crypto
            pythSymbol = 'Crypto.SOL/USD'
            supabaseSymbol = pythSymbol
            break
        case Asset.Ethereum:
            tickerName = 'clEthereum'
            tickerSymbol = 'clETH'
            tickerIcon = '/images/assets/on-eth.svg'
            ticker = 'ethereum'
            assetType = AssetType.Crypto
            pythSymbol = 'Crypto.ETH/USD'
            supabaseSymbol = pythSymbol
            break
        case Asset.Bitcoin:
            tickerName = 'clBitcoin'
            tickerSymbol = 'clBTC'
            tickerIcon = '/images/assets/on-btc.svg'
            ticker = 'bitcoin'
            assetType = AssetType.Crypto
            pythSymbol = 'Crypto.BTC/USD'
            supabaseSymbol = pythSymbol
            break
        case Asset.Cosmos:
            tickerName = 'clCosmos'
            tickerSymbol = 'clATOM'
            tickerIcon = '/images/assets/on-atom.svg'
            ticker = 'cosmos'
            assetType = AssetType.Crypto
            pythSymbol = 'Crypto.ATOM/USD'
            supabaseSymbol = pythSymbol
            break
        case Asset.Avalanche:
            tickerName = 'clAvalanche'
            tickerSymbol = 'clAVAX'
            tickerIcon = '/images/assets/on-avax.svg'
            ticker = 'avalanche'
            assetType = AssetType.Crypto
            pythSymbol = 'Crypto.AVAX/USD'
            supabaseSymbol = pythSymbol
            break
        case Asset.Sui:
            tickerName = 'clSui'
            tickerSymbol = 'clSUI'
            tickerIcon = '/images/assets/on-sui.svg'
            ticker = 'sui'
            assetType = AssetType.Crypto
            pythSymbol = 'Crypto.SUI/USD'
            supabaseSymbol = pythSymbol
            break
        case Asset.Aptos:
            tickerName = 'clAptos'
            tickerSymbol = 'clAPT'
            tickerIcon = '/images/assets/on-apt.svg'
            ticker = 'aptos'
            assetType = AssetType.Crypto
            pythSymbol = 'Crypto.APT/USD'
            supabaseSymbol = pythSymbol
            break
        case Asset.Cardano:
            tickerName = 'clCardano'
            tickerSymbol = 'clADA'
            tickerIcon = '/images/assets/on-ada.svg'
            ticker = 'cardano'
            assetType = AssetType.Crypto
            pythSymbol = 'Crypto.ADA/USD'
            supabaseSymbol = pythSymbol
            break
        default:
            throw new Error('Not supported')
    }

    return { tickerName, tickerSymbol, tickerIcon, ticker, assetType, pythSymbol, supabaseSymbol }
}

export const collateralMapping = (index: number) => {
    let collateralName = ''
    let collateralSymbol = ''
    let collateralIcon = ''
    let collateralType: number
    switch (index) {
        case Collateral.onUSD:
            collateralName = 'Devnet USD'
            collateralType = Collateral.onUSD
            collateralSymbol = ON_USD
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
