import { Box, Slider, styled } from '@mui/material'

interface Props {
  value: number,
  onChange?: (event: Event, newValue: number | number[]) => void
}

const ConvertSlider: React.FC<Props> = ({ value, onChange }) => {
  
  const valueLabelFormat = (value: number) => {
    return `${value}%`
  }

  return (
    <Box sx={{
      display: 'flex'
    }}>
      <Box>{valueLabelFormat(value)}</Box>
      <Slider
        value={value}
        min={0}
        step={5}
        max={100}
        valueLabelFormat={valueLabelFormat}
        onChange={onChange}
        valueLabelDisplay="auto"
      />
    </Box>
  )
}

export default ConvertSlider
