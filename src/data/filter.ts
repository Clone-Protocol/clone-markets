export enum FilterTypeMap {
	'all' = 'All',
	'icrypto' = 'iCrypto',
	'ifx' = 'iFX',
	'icommodities' = 'iCommodities',
  'istocks' = 'iStocks'
}
export type FilterType = keyof typeof FilterTypeMap

export interface PieItem {
	key: FilterType
	name: string
	value: number
	usdiAmount: number
}