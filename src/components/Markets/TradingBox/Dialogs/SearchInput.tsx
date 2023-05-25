import { styled } from '@mui/material'
import { Box, Input } from '@mui/material'
import Image from 'next/image'
import SearchIcon from 'public/images/search-icon.svg'

interface Props {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}
const SearchInput: React.FC<Props> = ({ onChange }) => {
  return <StyledBox>
    <StyledInput placeholder="Search onAssets" disableUnderline onChange={onChange} />
    <Box sx={{ position: 'relative', right: '-10px', top: '0px' }}>
      <Image src={SearchIcon} />
    </Box>
  </StyledBox>
}

const StyledBox = styled(Box)`
  display: flex;
  width: 100%;
  height: 36px;
  color: #fff;
  padding: 14px 11px;
  border-radius: 10px;
  border: solid 1px ${(props) => props.theme.basis.portGore};
  background-color: rgba(255, 255, 255, 0.05);
  &:hover {
    border: solid 1px #809cff;
  }
`

const StyledInput = styled(Input)`
  & input {
    width: 206px;
    height: 30px;
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #fff;

    &::placeholder {
      color: #8988a3;
    }
  }
`

export default SearchInput
