import React, { useState, useEffect } from 'react'
import { CircularProgress, styled, Box } from '@mui/material'
import { useDataLoading } from '~/hooks/useDataLoading'

export const REFETCH_CYCLE = 30000

const RateLoadingIndicator = ({ restartTimer }: { restartTimer: boolean }) => {
  const { startTimer } = useDataLoading()
  const [progress, setProgress] = useState(0);
  let timer: any = null

  useEffect(() => {
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

  useEffect(() => {
    console.log('restartTimer', restartTimer)

    setProgress(0)
    clearInterval(timer)
    timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
    }, 3000);

    return () => {
      clearInterval(timer)
    };
  }, [restartTimer]);

  return (
    <Wrapper>
      <Box sx={{ position: 'relative' }}>
        <CircularProgress
          variant="determinate"
          sx={{
            color: 'rgba(66, 0, 255, 0.0)'
          }}
          size={12}
          thickness={2}
          value={100}
        />
        <CustomCircularProgress variant="determinate" color="primary" sx={{ color: '#ff6cdf', position: 'absolute', left: 0 }} size={12}
          thickness={5} value={progress} />
      </Box>
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
  display: flex;
  align-items: center;
  margin-right: 6px;
  margin-top: 6px;
  width: 12px;
  height: 12px;
  // -webkit-filter: blur(13px);
  // filter: blur(13px);
  // background-image: linear-gradient(141deg, #8a7ba4 20%, #4e1597 128%);
`