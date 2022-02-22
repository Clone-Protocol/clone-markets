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
      display: 'flex',
    }}>
      <ValueBox>{valueLabelFormat(value)}</ValueBox>
      <Box width="270px">
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
    </Box>
  )
}

const ValueBox = styled(Box)`
  background: #ebedf2;
  width: 55px;
  height: 33px;
  line-height: 33px;
  font-size: 14px;
  font-weight: 600;
`

export default ConvertSlider
