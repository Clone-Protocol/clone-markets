import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { TimeTabs, TimeTab, FilterTimeMap, FilterTime } from '~/components/Charts/TimeTabs'
import LineChartAlt from '~/components/Charts/LineChartAlt'
// import { useTotalPriceQuery } from '~/features/Chart/Prices.query'
import { formatDollarAmount } from '~/utils/numbers'
import Image from 'next/image'
import ArrowUpward from 'public/images/arrow-up-green.svg'
import ArrowDownward from 'public/images/arrow-down-red.svg'
import { usePriceHistoryQuery } from '~/features/Chart/PriceByAsset.query'

const Chart = ({ pythSymbol, price }: { pythSymbol: string, price: number }) => {
  const [filterTime, setFilterTime] = useState<FilterTime>('7d')
  const [chartHover, setChartHover] = useState<number | undefined>()
  const { data: priceHistory } = usePriceHistoryQuery({
    timeframe: filterTime,
    pythSymbol: pythSymbol,
    refetchOnMount: "always",
    enabled: pythSymbol != null
  })

  // const { data: totalPrices } = useTotalPriceQuery({
  //   timeframe: filterTime,
  //   currentPrice: price,
  //   refetchOnMount: "always",
  //   enabled: true
  // })
  const handleFilterChange = useCallback((event: React.SyntheticEvent, newValue: FilterTime) => {
    setFilterTime(newValue)
  }, [filterTime])

  useMemo(() => {
    if (priceHistory) {
      if (priceHistory?.chartData.length > 0) {
        setChartHover(priceHistory?.chartData[priceHistory?.chartData.length - 1].value)
      }
    }
  }, [priceHistory])

  useMemo(() => {
    if (chartHover === undefined && priceHistory && priceHistory?.chartData.length > 0) {
      setChartHover(priceHistory?.chartData[priceHistory?.chartData.length - 1].value)
    }
  }, [chartHover, priceHistory])


  return (
    priceHistory ?
      <>
        <LineChartAlt
          data={priceHistory.chartData}
          value={chartHover}
          setValue={setChartHover}
          maxY={priceHistory?.maxValue}
          minY={priceHistory?.minValue}
          topLeft={
            <Box mb='25px'>
              <Box display='flex' alignItems='baseline'>
                <Typography variant='h1' fontWeight={500}>{formatDollarAmount(chartHover, 3, true)}</Typography>
                <Typography variant='p_xlg' ml='8px'>onUSD</Typography>
              </Box>
              <Box color='#00ff99' display='flex' alignItems='center' gap={1}>
                {priceHistory.percentOfRate >= 0 ?
                  <Box color='#00ff99' display='flex' alignItems='center' gap={1}>
                    <Typography variant='p_xlg'>+{priceHistory.percentOfRate?.toFixed(2)}%</Typography>
                    <Image src={ArrowUpward} />
                  </Box>
                  : <Box color='#ff0084' display='flex' alignItems='center' gap={1}>
                    <Typography variant='p_xlg'>{priceHistory.percentOfRate?.toFixed(2)}%</Typography>
                    <Image src={ArrowDownward} />
                  </Box>
                }
              </Box>
            </Box>
          }
          topRight={
            <div style={{ marginTop: '25px', marginBottom: '30px' }}>
              <TimeTabs value={filterTime} onChange={handleFilterChange}>
                {Object.keys(FilterTimeMap).map((f) => (
                  <TimeTab key={f} value={f} label={FilterTimeMap[f as FilterTime]} />
                ))}
              </TimeTabs>
            </div>
          }
        />
      </> : <></>
  )
}

export default Chart
