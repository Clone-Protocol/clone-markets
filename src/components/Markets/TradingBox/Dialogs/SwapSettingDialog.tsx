import { Box, Dialog, DialogContent, FormControl, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { FadeTransition } from '~/components/Common/Dialog'
import useLocalStorage from '~/hooks/useLocalStorage'
import { StyledTabs, StyledTab } from './OrderSettingSlippage'
import InfoTooltip from '~/components/Common/InfoTooltip'
import { useEffect, useState } from 'react'
import { SLIPPAGE } from '~/data/localstorage'
import { CloseButton } from '~/components/Common/CommonButtons'

const SwapSettingDialog = ({ open, onSaveSetting }: { open: boolean, onSaveSetting: (slippage: number) => void }) => {
  const [customInputValue, setCustomInputValue] = useState('')
  const [customSlippage, setCustomSlippage] = useState(NaN)
  const [slippage, setSlippage] = useState(0.5)
  const [localSlippage, _] = useLocalStorage(SLIPPAGE, 0.5)

  useEffect(() => {
    if (localSlippage === 0.1 || localSlippage === 0.5 || localSlippage === 1) {
      setSlippage(localSlippage)
    } else {
      setCustomSlippage(localSlippage)
    }
  }, [localSlippage])

  const handleSlippageChange = (event: React.SyntheticEvent, newValue: number) => {
    setSlippage(newValue)
    setCustomInputValue('')
    setCustomSlippage(NaN)
  }

  const onChangeCustom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newData = parseFloat(e.currentTarget.value)
    console.log('n', e.currentTarget.value + "/" + newData)
    if (isNaN(newData)) {
      setCustomInputValue('')
      setCustomSlippage(NaN)
    } else if (newData <= 100) {
      console.log('nn', newData)
      setCustomInputValue(e.currentTarget.value)
      setCustomSlippage(parseFloat(newData.toFixed(2)))
    }
  }

  const onSave = () => {
    if (customSlippage > 0) {
      onSaveSetting(customSlippage)
    } else {
      onSaveSetting(slippage)
    }
  }

  return (
    <>
      <Dialog open={open} onClose={onSave} TransitionComponent={FadeTransition}>
        <DialogContent sx={{ backgroundColor: '#0f0f0f', border: '1px solid #676767', borderRadius: '20px', width: '375px' }}>
          <BoxWrapper>
            <Box mb="21px"><Typography variant='h3' fontWeight={500}>Swap Settings</Typography></Box>
            <Box><Typography variant='p_lg'>Slippage Tolerance</Typography> <InfoTooltip title="Slippage Tolerance is the pricing difference between the price at the confirmation time and the actual price of the transaction users are willing to accept when swapping on AMMs." /></Box>
            <SlippageStack direction="row" alignItems="center">
              <StyledTabs value={!isNaN(customSlippage) ? 0 : slippage} onChange={handleSlippageChange}>
                <StyledTab value={0.1} label="0.1%" />
                <StyledTab value={0.5} label="0.5%" />
                <StyledTab value={1} label="1%" />
              </StyledTabs>

              <FormControl variant="standard" sx={{ width: '132px' }}>
                <FormStack direction="row" justifyContent="space-between" alignItems="center" sx={!isNaN(customSlippage) ? { border: '1px solid #fff' } : {}}>
                  <CustomSlippagePlaceholder>
                    <Typography variant='p_lg'>Custom</Typography>
                  </CustomSlippagePlaceholder>
                  <InputAmount id="ip-amount" type="number" placeholder="0.0%" sx={!isNaN(customSlippage) ? { color: '#fff' } : { color: 'rgba(137, 136, 163, 0.8)' }} value={customInputValue} onChange={onChangeCustom} />
                </FormStack>
              </FormControl>
            </SlippageStack>

            <Box sx={{ position: 'absolute', right: '10px', top: '10px' }}>
              <CloseButton handleClose={onSave} />
            </Box>
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
const SlippageStack = styled(Stack)`
  background-color: rgba(255, 255, 255, 0.05);
  width: 328px;
  height: 56px;
  border-radius: 10px;
  margin-top: 10px;
`
const FormStack = styled(Stack)`
	display: flex;
	width: 120px;
	height: 56px;
	padding: 14px 17px 14px 6px;
  border-left: solid 1px ${(props) => props.theme.basis.portGore};
  color: ${(props) => props.theme.basis.textRaven};
`
const CustomSlippagePlaceholder = styled(Box)`
  width: 66px; 
  display: flex;
  justify-content: center;
  text-align: center;
`
const InputAmount = styled(`input`)`
	width: 66px;
	text-align: right;
  background-color: transparent;
	border: 0px;
	font-size: 14px;
  padding-right: 15px;
  color: ${(props) => props.theme.basis.textRaven};
`

export default SwapSettingDialog