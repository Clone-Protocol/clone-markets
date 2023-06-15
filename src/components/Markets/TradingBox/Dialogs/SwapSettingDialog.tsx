import { Box, styled, Dialog, DialogContent, FormControl, Stack, Typography } from '@mui/material'
import { FadeTransition } from '~/components/Common/Dialog'
import useLocalStorage from '~/hooks/useLocalStorage'
import { StyledTabs, StyledTab } from './OrderSettingSlippage'
import InfoTooltip from '~/components/Common/InfoTooltip'
import { useEffect, useState } from 'react'

const SwapSettingDialog = ({ open, onHide }: { open: boolean, onHide: () => void }) => {
  const [customSlippage, setCustomSlippage] = useState(NaN)
  const [slippage, setSlippage] = useState(0.5)
  const [localSlippage, setLocalSlippage] = useLocalStorage("slippage", 0.5)

  useEffect(() => {
    if (localSlippage === 0.1 || localSlippage === 0.5 || localSlippage === 1) {
      setSlippage(localSlippage)
    } else {
      setCustomSlippage(localSlippage)
    }
  }, [localSlippage])

  const handleSlippageChange = (event: React.SyntheticEvent, newValue: number) => {
    setSlippage(newValue)
    setCustomSlippage(NaN)
  }

  const onChangeCustom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newData = parseFloat(e.currentTarget.value)
    if (isNaN(newData)) {
      setCustomSlippage(NaN)
    } else if (newData <= 100) {
      setCustomSlippage(parseFloat(newData.toFixed(2)))
    }
  }

  const onSave = () => {
    if (customSlippage > 0) {
      setLocalSlippage(customSlippage)
    } else {
      setLocalSlippage(slippage)
    }
    onHide()
  }

  return (
    <>
      <Dialog open={open} onClose={onSave} TransitionComponent={FadeTransition}>
        <DialogContent sx={{ backgroundColor: '#080018', border: '1px solid #414166', borderRadius: '20px', width: '375px' }}>
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
                  <InputAmount id="ip-amount" type="number" step=".1" placeholder="0.0%" sx={!isNaN(customSlippage) ? { color: '#fff' } : { color: '#adadad' }} value={Number(customSlippage).toString()} onChange={onChangeCustom} />
                </FormStack>
              </FormControl>
            </SlippageStack>
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
  color: ${(props) => props.theme.basis.textRaven};
`

export default SwapSettingDialog