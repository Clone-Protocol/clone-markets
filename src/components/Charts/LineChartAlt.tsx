import React, { Dispatch, SetStateAction, ReactNode } from 'react';
import { Card, Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ResponsiveContainer, YAxis, Tooltip, AreaChart, Area } from 'recharts'
import { withCsrOnly } from '~/hocs/CsrOnly'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { darken } from 'polished'
dayjs.extend(utc)

interface ChartElem {
  time: string
  value: number
}

export type LineChartProps = {
  data: ChartElem[]
  color?: string | undefined
  height?: number | undefined
  minHeight?: number
  setValue?: Dispatch<SetStateAction<number | undefined>> // used for value on hover
  setLabel?: Dispatch<SetStateAction<string | undefined>> // used for label of valye
  value?: number
  label?: string
  topLeft?: ReactNode | undefined
  topRight?: ReactNode | undefined
  bottomLeft?: ReactNode | undefined
  bottomRight?: ReactNode | undefined
  maxY: number
  minY: number
} & React.HTMLAttributes<HTMLDivElement>



const LineChartAlt: React.FC<LineChartProps> = ({
  data,
  color = '#ff0ed8',
  value,
  label,
  setValue,
  setLabel,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  minHeight = 307,
  maxY,
  minY,
  ...rest
}) => {
  const parsedValue = value

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      if (setValue && parsedValue !== payload[0].value) {
        setValue(payload[0].value)
      }

      const formattedTime = dayjs(payload[0].payload.time).format('MMM D, h:mm A')
      // if (setLabel && label !== formattedTime) setLabel(formattedTime)
      return (
        <Box sx={{ fontSize: '12px', color: '#8988a3' }}>
          <p className="label">{`${formattedTime}`}</p>
        </Box>
      );
    }

    return null;
  };

  return (
    <Wrapper>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {topLeft ?? null}
        {topRight ?? null}
      </Box>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={709}
          height={300}
          data={data}
          margin={{
            top: 5,
            bottom: 5,
          }}
          onMouseLeave={() => {
            setLabel && setLabel(undefined)
            setValue && setValue(undefined)
          }}
        >
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={darken(0.36, color)} stopOpacity={0.5} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          {/* <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            color="#c9c9c9"
            fontSize="8px"
            tickFormatter={(time) => dayjs(time).format('DD')}
            minTickGap={10}
          /> */}
          <YAxis
            type="number"
            fontSize="10px"
            color="#9e9e9e"
            axisLine={false}
            domain={[minY, maxY]}
            hide
          />
          <Tooltip
            cursor={{ stroke: '#8988a3', strokeDasharray: '4 4' }}
            content={CustomTooltip}
            contentStyle={{ display: 'block', background: 'transparent' }}
          // formatter={(value: number, name: string, props: { payload: { time: string; value: number } }) => {
          //   if (setValue && parsedValue !== props.payload.value) {
          //     setValue(props.payload.value)
          //   }
          //   const formattedTime = dayjs(props.payload.time).format('MMM D, YYYY')
          //   console.log('formatter', formattedTime)
          //   if (setLabel && label !== formattedTime) setLabel(formattedTime)
          // }}
          />
          <Area dataKey="value" type="monotone" stroke="#ff0ed8" fill="url(#gradient)" strokeWidth={1} />
        </AreaChart>
      </ResponsiveContainer>
    </Wrapper>
  )
}

const Wrapper = styled(Card)`
  width: 100%;
  max-width: 729px;
  height: 297px;
  padding: 5px;
  padding-right: 1rem;
  display: flex;
  background-color: #000;
  flex-direction: column;
  > * {
    font-size: 1rem;
  }
`

export default withCsrOnly(LineChartAlt)
