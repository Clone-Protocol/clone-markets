export enum FilterTypeMap {
	'all' = 'All',
	'stableCoin' = 'Stable Coin',
	'onCrypto' = 'onCrypto',
	'onCommodity' = 'onCommodity',
	'onStock' = 'onStock',
	'onFx' = 'onFX',
}
export type FilterType = keyof typeof FilterTypeMap

export enum FilterTypeColorMap {
	'all' = '#ffffff',
	'stableCoin' = '#6800ed',
	'onCrypto' = '#c4b5fd',
	'onCommodity' = '#fffc72',
	'onStock' = '#00ff99',
	'onFx' = '#ff0084',
}

export interface PieItem {
	key: FilterType
	name: string
	value: number
	usdiAmount: number
}