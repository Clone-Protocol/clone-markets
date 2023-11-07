export enum FilterTypeMap {
	'all' = 'All',
	'stableCoin' = 'Stable Coin',
	'onCrypto' = 'clCrypto',
	'onCommodity' = 'clCommodity',
	'onFx' = 'clFX',
}
export type FilterType = keyof typeof FilterTypeMap

export enum FilterTypeColorMap {
	'all' = '#ffffff',
	'stableCoin' = '#6800ed',
	'onCrypto' = '#c4b5fd',
	'onCommodity' = '#fffc72',
	'onFx' = '#ff0084',
}

export interface PieItem {
	key: FilterType
	name: string
	value: number
	onusdAmount: number
}