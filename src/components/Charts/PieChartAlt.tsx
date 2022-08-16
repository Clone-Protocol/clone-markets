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
  selectedIdx
}) => {
  const onPieEnter = () => {
    
  }

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const fill = '#60d9ff';
  
    return (
      <g>
        <Sector
          style={{
            // filter: `drop-shadow(0px 0px 2px ${fill})`
          }}
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke="#595959"
          strokeLinejoin='round'
          strokeOpacity="0.8"
          strokeWidth="3px"
          strokeDashoffset="-3px"
        />
      </g>
    );
  };
  
  return (
    <Wrapper>
      <PieChart width={250} height={250} onMouseEnter={onPieEnter}>
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
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
          ))}
        </Pie>
      </PieChart>
    </Wrapper>
  );
}

const Wrapper = styled(Box)`
  width: 100%;
  max-width: 229px;
`

export default withCsrOnly(PieChartAlt)
