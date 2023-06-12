import { Box, styled, Dialog, DialogContent, Typography, Divider } from '@mui/material'
import { FadeTransition } from '~/components/Common/Dialog'
import { useCallback, useEffect, useState } from 'react'
import SearchInput from './SearchInput'
import GridAssets from './GridAssets'

const SearchAssetDialog = ({ open, onChooseAsset, onHide }: { open: boolean, onChooseAsset: (id: number) => void, onHide: () => void }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.currentTarget.value
    if (newVal) {
      setSearchTerm(newVal)
    } else {
      setSearchTerm('')
    }
  }, [searchTerm])

  return (
    <>
      <Dialog open={open} onClose={onHide} TransitionComponent={FadeTransition}>
        <DialogContent sx={{ backgroundColor: '#080018', border: '1px solid #414166', borderRadius: '20px', width: '375px' }}>
          <BoxWrapper>
            <Box mb="19px"><Typography variant='h3' fontWeight={500}>Search onAsset</Typography></Box>
            <Box mb='25px'>
              <SearchInput onChange={handleSearch} />
            </Box>
            <StyledDivider />
            <GridAssets onChoose={onChooseAsset} searchTerm={searchTerm} />
          </BoxWrapper>
        </DialogContent>
      </Dialog>
    </>
  )
}

const BoxWrapper = styled(Box)`
  padding: 1px; 
  color: #fff;
  width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
`
const StyledDivider = styled(Divider)`
  background-color: ${(props) => props.theme.basis.portGore};
  margin-bottom: 1px;
`


export default SearchAssetDialog