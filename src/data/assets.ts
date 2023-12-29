import { ON_USD } from "~/utils/constants"
import { IS_DEV } from "./networks"

export enum Collateral {
    onUSD,
    mockUSDC,
}

export enum AssetTickers {
    arbitrum = 0,
}

export enum Asset {
    Arbitrum,
}

export enum AssetType {
    Crypto,
    Fx,
    Commodities,
}

export const DEFAULT_ASSET_ID = AssetTickers.arbitrum
export const DEFAULT_ASSET_LINK = "/trade/arbitrum"

export const ASSETS = [
    {
        tickerName: 'Clone Arbitrum',
        tickerSymbol: 'clARB',
        tickerIcon: '/images/assets/on-arb.svg',
        ticker: 'arbitrum',
        pythSymbol: 'Crypto.ARB/USD'
    }
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
        case Asset.Arbitrum:
            tickerName = 'Clone Arbitrum'
            tickerSymbol = 'clARB'
            tickerIcon = '/images/assets/on-arb.svg'
            ticker = 'arbitrum'
            assetType = AssetType.Crypto
            pythSymbol = 'Crypto.ARB/USD'
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
            collateralName = IS_DEV ? 'Clone USD' : 'USD Coin'
            collateralType = Collateral.onUSD
            collateralSymbol = ON_USD
            collateralIcon = IS_DEV ? '/images/assets/on-usd.svg' : '/images/assets/usdc.svg'
            break
        case Collateral.mockUSDC:
            collateralName = 'USD Coin'
            collateralType = Collateral.mockUSDC
            collateralSymbol = 'USDC'
            collateralIcon = '/images/assets/usdc.svg'
            break
        default:
            throw new Error('Not supported')
    }

    return { collateralName, collateralSymbol, collateralIcon, collateralType }
}

export const ASSETS_DESC = [
    {
        ticker: 'arbitrum',
        desc: "clARB is a cloned version of Arbitrum (ARB) on Solana, a groundbreaking Layer 2 scaling solution for Ethereum. By enabling faster transactions and reduced costs, Arbitrum significantly elevates Ethereum's performance. Through clARB, traders on Solana can tap into the technological advancements and efficiencies of Arbitrum, one of Ethereum's most successful Layer 2 platforms. This cloned asset not only provides a unique opportunity to engage with Ethereum's evolving ecosystem but also offers the benefits of Solana's high-speed and low-cost blockchain infrastructure."
    },
]