import { Box, Slider, styled } from '@mui/material'

interface Props {
	value: number
	onChange?: (event: Event, newValue: number | number[]) => void
}

const StyledSlider = styled(Slider)(({ theme }) => ({
	color: '#FFF',
	height: 4,
	padding: '13px 0',
	marginTop: '13px',
	'& .MuiSlider-thumb': {
    zIndex: 30,
		height: 20,
		width: 20,
		backgroundColor: '#fff',
		border: '3px solid #809cff',
		'&:hover': {
			boxShadow: '0 0 0 8px rgba(58, 133, 137, 0.16)',
		},
	},
	'& .MuiSlider-track': {
    zIndex: 10,
		height: 3,
    border: 'none',
    background: 'linear-gradient(to left, #f00 -12%, #809cff 66%)'
	},
  '& .MuiSlider-valueLabel': {
    fontSize: '11px',
    fontWeight: '600',
    width: '51px',
    padding: '4px 8px 4px 8px',
    borderRadius: '10px',
    border: 'solid 1px #809cff',
    backgroundColor: '#000',
    '&:before': { display: 'none' },
  },
	'& .MuiSlider-rail': {
    zIndex: 10,
		color: '#444444',
		height: 3,
	},
}))

const ConvertSlider: React.FC<Props> = ({ value, onChange }) => {
	const valueLabelFormat = (value: number) => {
		return `${value}%`
	}

	return (
		<Box
			sx={{
				display: 'flex',
			}}>
			<ValueBox>{valueLabelFormat(value)}</ValueBox>
			<Box width="270px">
				<StyledSlider
          sx={{
            '& .MuiSlider-valueLabel': {
              border: `solid 1px #00ff66`,
            },
            '& .MuiSlider-thumb': {
              border: `2px solid #00ff66`,
            },
            '& .MuiSlider-track': {
              background: `#00ff66`
            }
          }}
					value={value}
					min={0}
					step={5}
					max={100}
					valueLabelFormat={valueLabelFormat}
					onChange={onChange}
					valueLabelDisplay="off"
				/>
			</Box>
		</Box>
	)
}

const ValueBox = styled(Box)`
	background: #282828;
	width: 55px;
	height: 30px;
  border-radius: 10px;
	line-height: 33px;
	font-size: 12px;
	font-weight: 500;
  color: #fff;
  margin-top: 12px;
`

export default ConvertSlider
