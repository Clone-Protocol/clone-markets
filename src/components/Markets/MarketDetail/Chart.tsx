import React, { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { TimeTabs, TimeTab, FilterTimeMap, FilterTime } from '~/components/Charts/TimeTabs'
import LineChartAlt from '~/components/Charts/LineChartAlt'
import { useTotalPriceQuery } from '~/features/Chart/Prices.query'
import Image from 'next/image'
import ArrowUpward from 'public/images/arrow-up-green.svg'

const Chart = ({ price }: { price: number }) => {
  const [filterTime, setFilterTime] = useState<FilterTime>('24h')
  const [chartHover, setChartHover] = useState<number | undefined>()
  const { data: totalPrices } = useTotalPriceQuery({
    timeframe: filterTime,
    currentPrice: price,
    refetchOnMount: "always",
    enabled: true
  })
  const handleFilterChange = (event: React.SyntheticEvent, newValue: FilterTime) => {
    setFilterTime(newValue)
  }

  useEffect(() => {
    if (totalPrices) {
      setChartHover(totalPrices?.chartData[totalPrices?.chartData.length - 1].value)
    }
  }, [totalPrices])


  useEffect(() => {
    if (chartHover === undefined && totalPrices) {
      setChartHover(totalPrices?.chartData[totalPrices?.chartData.length - 1].value)
    }
  }, [chartHover, totalPrices])


  return (
    <>
      <LineChartAlt
        data={totalPrices?.chartData}
        value={chartHover}
        setValue={setChartHover}
        maxY={totalPrices?.maxValue}
        topLeft={
          <Box mb='25px'>
            <Box display='flex' alignItems='baseline'>
              <Typography variant='h1' fontWeight={500}>${chartHover?.toLocaleString()}</Typography>
              <Typography variant='p_xlg' ml='8px'>onUSD</Typography>
            </Box>
            <Box color='#00ff99' display='flex' alignItems='center' gap={1}>
              <Typography variant='p_xlg'>+3.47%</Typography>
              <Image src={ArrowUpward} />
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
    </>
  )
}


export default Chart
