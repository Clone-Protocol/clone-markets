import { Box, FormControl, Input, InputAdornment, InputLabel, Slider, styled } from '@mui/material'

interface Props {
  value: number,
  onChange?: (event: Event, newValue: number | number[]) => void
}

const ConvertSlider: React.FC<Props> = ({ value, onChange }) => {
  
  const valueLabelFormat = (value: number) => {
    return `${value}%`
  }

  return (
    <FormControl variant='standard'>
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
    </FormControl>
  )
}

export default ConvertSlider
