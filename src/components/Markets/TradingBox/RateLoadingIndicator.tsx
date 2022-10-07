import React, { useState, useEffect } from 'react'
import { CircularProgress, styled, Box } from '@mui/material'
import { useDataLoading } from '~/hooks/useDataLoading'

export const REFETCH_CYCLE = 15000

const RateLoadingIndicator = () => {
  const { startTimer } = useDataLoading()
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: any = null
    if (startTimer) {
      console.log('start Timer')
      timer = setInterval(() => {
        setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
      }, 3000);
    } else {
      setProgress(0)
      clearInterval(timer)
    }

    return () => {
      clearInterval(timer)
    };
  }, [startTimer]);

	return (
    <Wrapper>
      <div style={{ marginRight: '8px'}}>Rate refreshes in</div>
      <CustomCircularProgress variant="determinate" color="primary" sx={{ color: '#fff' }} size={23}
        thickness={8} value={progress} />
    </Wrapper>
	)
}

export default RateLoadingIndicator

const CustomCircularProgress = styled(CircularProgress)`
  .MuiCircularProgress-root	{
    color: #525252;
  }
`

const Wrapper = styled(Box)`
  width: 159px;
  border-radius: 10px;
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 500;
  color: #868686;
`