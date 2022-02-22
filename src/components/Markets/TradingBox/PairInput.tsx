import { FormControl, Input, InputAdornment, InputLabel, styled } from '@mui/material'
import Image from 'next/image'

interface Props {
  title: string | null,
  tickerIcon: string,
  ticker: string | null,
  value?: number,
  onChange?: () => void
}

const PairInput: React.FC<Props> = ({ title, tickerIcon, ticker, value, onChange }) => {
  
  return (
    <FormControl variant='standard'>
      <InputLabel htmlFor='ip-amount'>
        {title}
      </InputLabel>
      <Input
        id="ip-amount"
        startAdornment={
          <InputAdornment position="start">
            <><Image src={tickerIcon} width="26px" height="26px" /></>
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
