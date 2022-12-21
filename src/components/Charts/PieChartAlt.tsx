import React from 'react';
import { PieChart, Pie, Sector, Cell } from 'recharts';
import { withCsrOnly } from '~/hocs/CsrOnly'
import { styled } from '@mui/system'
import { Box } from '@mui/material'
import { PieItem } from '~/data/filter'

const COLORS = ['#FFF', '#adadad', '#767474', '#595959'];

export type ChartProps = {
  data: PieItem[]
  selectedIdx: number
  onSelect: (index: number) => void
}

const PieChartAlt : React.FC<ChartProps> = ({
  data,
  selectedIdx,
  onSelect
}) => {
  const onPieEnter = (_, index: number) => {
    onSelect(index)
  }

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle } = props;
    const fill = '#60d9ff';
  
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius - 8}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
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
