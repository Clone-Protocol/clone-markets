import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { styled } from '@mui/system'
import { TimeTabs, TimeTab, FilterTimeMap, FilterTime } from '~/components/Charts/TimeTabs'
import LineChartAlt from '~/components/Charts/LineChartAlt'
import { useTotalPriceQuery } from '~/features/Chart/Prices.query'
import { formatDollarAmount } from '~/utils/numbers'

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
        topLeft={
          <Box>
            <SelectValue>{formatDollarAmount(chartHover, 2, true)}</SelectValue>
          </Box>
        }
        topRight={
          <TimeTabs value={filterTime} onChange={handleFilterChange}>
            {Object.keys(FilterTimeMap).map((f) => (
              <TimeTab key={f} value={f} label={FilterTimeMap[f as FilterTime]} />
            ))}
          </TimeTabs>
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
  margin-left: 20px;
  margin-top: 17px;
`

export default Chart
