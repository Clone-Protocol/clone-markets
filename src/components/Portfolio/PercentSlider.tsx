import Slider, { SliderThumb } from '@mui/material/Slider'
import { Box } from '@mui/material'
import { styled } from '@mui/system'

interface Props {
	percent: number
}

const PercentSlider: React.FC<Props> = ({ percent }) => {
	
  const CustomSlider = styled(Slider)(({ theme }) => ({
    color: '#0038ff',
    width: 265,
    height: 8,
    '& .MuiSlider-track': {
      height: 8,
      border: 0,
      background: '#fff',
    },
    '& .MuiSlider-rail': {
      color: theme.palette.mode === 'dark' ? '#2c2c2c' : '#2c2c2c',
      opacity: theme.palette.mode === 'dark' ? undefined : 1,
      height: 8,
    },
    '& .MuiSlider-thumb[data-index="0"]': {
      display: 'none'
    }
  }))

	return (
		<Box>
			<CustomSlider
				min={0}
				max={100}
				step={1}
				disableSwap
				valueLabelDisplay="off"
				value={percent}
			/>
      <div style={{ color: '#a6a6a6', fontSize: '12px', fontWeight: '500', marginTop: '-14px' }}>{percent.toFixed(2)}%</div>
		</Box>
	)
}

export default PercentSlider