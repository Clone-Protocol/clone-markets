import { createClient } from '@supabase/supabase-js'
import { Typography, Box, Alert, Stack } from '@mui/material'
import { styled } from '@mui/system'
import { useEffect, useState } from 'react';

const TempWarningMsg: React.FC = () => {
  const [isShowGeneralMsg, setIsShowGeneralMsg] = useState(false)
  const [isShowWarnMsg, setIsShowWarnMsg] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const getNoticeMsg = async () => {
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

      try {
        const { data, error } = await supabase
          .from('notices')
          .select()
          .eq('channel', 'markets')
          .eq('show', true)

        console.log('data', data)

        data?.forEach((item) => {
          if (item.is_general) {
            setIsShowGeneralMsg(true)
          } else {
            setIsShowWarnMsg(true)
          }
          setMessage(item.message)
        })
      } catch (e) {
        console.error(e)
      }
    }
    getNoticeMsg()
  }, [])

  return (
    <StackWrapper direction='column'>
      {isShowGeneralMsg &&
        <WarningStack severity="error">
          <Box ml='10px'><Typography variant='p'>{message}</Typography></Box>
        </WarningStack>
      }
      {isShowWarnMsg &&
        <WarningStack severity='warning'>
          <Box ml='10px'><Typography variant='p'>{message}</Typography></Box>
        </WarningStack>
      }
    </StackWrapper>
  )
}

const StackWrapper = styled(Stack)`
  position: fixed;
  top: 10px;
  left: calc(50% - 250px);
  z-index: 9999999;
`
const WarningStack = styled(Alert)`
  width: 350px;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
	line-height: 0.9;
	padding: 10px;
  background-color: ${(props) => props.theme.boxes.darkBlack};
	color: ${(props) => props.theme.palette.text.secondary};
  border: 1px solid ${(props) => props.theme.palette.error.main};
`

export default TempWarningMsg
