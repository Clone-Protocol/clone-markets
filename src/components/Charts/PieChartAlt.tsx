import React from 'react';
import { PieChart, Pie, Sector, Cell } from 'recharts';
import { withCsrOnly } from '~/hocs/CsrOnly'
import { styled } from '@mui/system'
import { Box } from '@mui/material'
import { FilterTypeColorMap, PieItem } from '~/data/filter'
import { filterState } from '~/features/Portfolio/filterAtom'
import CloseIcon from '@mui/icons-material/Close';
import { useRecoilState } from 'recoil'

export type ChartProps = {
  data: PieItem[]
  selectedIdx: number
  onSelect: (index: number) => void
}

const PieChartAlt: React.FC<ChartProps> = ({
  data,
  selectedIdx,
  onSelect
}) => {
  const [_, setSelectedFilter] = useRecoilState(filterState)
  const onPieEnter = (_, index: number) => {
    onSelect(index)
  }

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

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
      <Box width='100%' maxWidth='229px'>
        <PieChart width={278} height={278}>
          {data.length > 0 ? (
            <Pie
              data={data}
              cx={110}
              cy={110}
              innerRadius={80}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={0}
              dataKey="value"
              activeIndex={selectedIdx}
              cursor="pointer"
              activeShape={renderActiveShape}
              onMouseDown={onPieEnter}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={FilterTypeColorMap[entry.key]} strokeWidth={0} style={{
                  filter: `drop-shadow(0px 0px 5px ${FilterTypeColorMap[entry.key]}`
                }} />
              ))}
            </Pie>
          ) : (
            <Pie
              data={[{ key: 'all', name: 'all', value: 100 }]}
              cx={110}
              cy={110}
              innerRadius={80}
              outerRadius={100}
              cursor="pointer"
              fill="rgba(255, 255, 255, 0.09)"
              paddingAngle={0}
              dataKey="value"
            >
              <Cell fill="#363636" strokeWidth={0} />
            </Pie>
          )}
        </PieChart>
      </Box>
      {selectedIdx >= 0 &&
        <CloseWrapper onClick={() => setSelectedFilter('all')}>
          <CloseIcon fontSize='large' sx={{ color: `${FilterTypeColorMap[data[selectedIdx].key]}` }} />
        </CloseWrapper>
      }
    </Wrapper>
  );
}

const Wrapper = styled(Box)`
  position: relative;
`
const CloseWrapper = styled(Box)`
  position: absolute;
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 76px;
  left: calc(50% - 38px);
  border-radius: 50%;
  cursor: pointer;
  background: rgba(196, 181, 253, 0.07);
  &:hover {
    background: rgba(196, 181, 253, 0.05);
  }
`

export default withCsrOnly(PieChartAlt)
