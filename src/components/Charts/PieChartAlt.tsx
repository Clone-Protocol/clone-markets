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
        <PieChart width={250} height={250}>
          {data.length > 0 ? (
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
                <Cell key={`cell-${index}`} fill={FilterTypeColorMap[entry.key]} strokeWidth={0} />
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
  top: 86px;
  left: calc(50% - 17px);
  cursor: pointer;
`

export default withCsrOnly(PieChartAlt)
