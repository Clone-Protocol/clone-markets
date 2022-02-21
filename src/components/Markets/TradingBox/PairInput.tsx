import { FormControl, Input, InputAdornment, InputLabel, styled } from '@mui/material'

interface Props {
  title: string | null,
  ticker: string | null,
  value?: number,
  onChange?: () => void
}

const PairInput: React.FC<Props> = ({ title, ticker, value, onChange }) => {
  
  return (
    <FormControl variant='standard'>
      <InputLabel htmlFor='ip-amount'>
        {title}
      </InputLabel>
      <Input
        id="ip-amount"
        startAdornment={
          <InputAdornment position="start">
            <>{ticker}</>
          </InputAdornment>
        }
        type='number'
        value={value}
        onChange={onChange}
        />
    </FormControl>
  )
}

export default PairInput
