export enum FilterTypeMap {
	'all' = 'All',
	'icrypto' = 'iCrypto',
	'ifx' = 'iFX',
	'icommodities' = 'iCommodities',
  'istocks' = 'iStocks'
}
export type FilterType = keyof typeof FilterTypeMap