import { Box, styled, Dialog, DialogContent, FormControl, Stack, Typography } from '@mui/material'
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
        <DialogContent sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid #414166', borderRadius: '20px', width: '375px' }}>
          <BoxWrapper>
            <Box mb="19px"><Typography variant='h3' fontWeight={500}>Search onAsset</Typography></Box>
            <SearchInput onChange={handleSearch} />
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
`


export default SearchAssetDialog