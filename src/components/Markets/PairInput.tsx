import { FormControl, Input, InputAdornment, InputLabel, styled } from '@mui/material'
import { withCsrOnly } from '~/hocs/CsrOnly'

interface Props {
  title: string | null,
  ticker: string | null,
  onChange: () => void
}

const PairInput: React.FC<Props> = ({ title, ticker, onChange }) => {
  
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
        onChange={onChange}
        />
    </FormControl>
  )
}

export default withCsrOnly(PairInput)
