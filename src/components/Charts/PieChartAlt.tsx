import React from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import { withCsrOnly } from '~/hocs/CsrOnly'
import { styled } from '@mui/system'
import { Box } from '@mui/material'

const COLORS = ['#FFF', '#adadad', '#767474', '#595959'];

export type ChartProps = {
  data: any[]
  selectedIdx: number
  onSelect: any
}

const PieChartAlt : React.FC<ChartProps> = ({
  data,
  selectedIdx,
  onSelect
}) => {
  const onPieEnter = (_, index) => {
    onSelect(index)
  }

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle } = props;
    const fill = '#60d9ff';
  
    return (
      <g>
        <Sector
          style={{
            // filter: `drop-shadow(0px 0px 2px ${fill})`
          }}
          cx={cx}
          cy={cy}
          innerRadius={innerRadius - 8}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke="#595959"
          strokeLinejoin='round'
          strokeOpacity="0.8"
          strokeWidth="2.5px"
          strokeDashoffset="-3px"
        />
      </g>
    );
  };
  
  return (
    <Wrapper>
      <PieChart width={250} height={250}>
        { data.length > 0 ? (
          <Pie
            data={data}
            cx={110}
            cy={100}
            innerRadius={65}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={0}
            dataKey="value"
            activeIndex={selectedIdx}
            activeShape={renderActiveShape}
            onMouseDown={onPieEnter}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
            ))}
          </Pie>
        ) : (
          <Pie
            data={[{ key: 'all', name: 'all', value: 100 }]}
            cx={110}
            cy={100}
            innerRadius={65}
            outerRadius={80}
            fill="#363636"
            paddingAngle={0}
            dataKey="value"
          >
            <Cell fill="#363636" strokeWidth={0} />
          </Pie>
        )}
      </PieChart>
    </Wrapper>
  );
}

const Wrapper = styled(Box)`
  width: 100%;
  max-width: 229px;
`

export default withCsrOnly(PieChartAlt)
