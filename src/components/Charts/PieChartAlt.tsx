import React from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import { withCsrOnly } from '~/hocs/CsrOnly'
import { styled } from '@mui/system'
import { Box } from '@mui/material'

const defaultData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];
const COLORS = ['#FFF', '#adadad', '#767474', '#595959'];

export type ChartProps = {
  data: any[]

}

const PieChartAlt : React.FC<ChartProps> = ({
  data
}) => {
  const demoUrl = 'https://codesandbox.io/s/pie-chart-with-padding-angle-7ux0o';

  data = defaultData;

  const onPieEnter = () => {

  }
  
  return (
    <Wrapper>
      <PieChart width={200} height={200} onMouseEnter={onPieEnter}>
        <Pie
          data={data}
          cx={110}
          cy={80}
          innerRadius={65}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={0}
          dataKey="value"
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
