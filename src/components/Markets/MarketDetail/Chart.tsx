import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { styled } from '@mui/system'
import { TimeTabs, TimeTab, FilterTimeMap, FilterTime } from '~/components/Charts/TimeTabs'
import LineChartAlt from '~/components/Charts/LineChartAlt'
import { useTotalPriceQuery } from '~/features/Chart/Prices.query'

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
      setChartHover(totalPrices?.chartData[totalPrices?.chartData.length-1].value)
    }
  }, [totalPrices])


  useEffect(() => {
    if (chartHover === undefined && totalPrices) {
      setChartHover(totalPrices?.chartData[totalPrices?.chartData.length-1].value)
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
          <Box style={{ marginBottom: '25px' }}>
            <SelectValue>${chartHover?.toLocaleString()}</SelectValue>
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

const SelectValue = styled(Box)`
  font-size: 35px;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #fff;
`

export default Chart
