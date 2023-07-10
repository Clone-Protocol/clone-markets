import { createClient } from '@supabase/supabase-js'
import { Typography, Box, Stack, IconButton } from '@mui/material'
import { styled } from '@mui/system'
import { useEffect, useState } from 'react';
import Image from 'next/image';
import CloseIcon from 'public/images/close.svg'
import { useRecoilState } from 'recoil'
import { showPythBanner } from '~/features/globalAtom'
import { Info, Warning } from '@mui/icons-material';

const TempWarningMsg: React.FC = () => {
  const [showPythBannerStatus, _] = useRecoilState(showPythBanner)
  const [isShowGeneralMsg, setIsShowGeneralMsg] = useState(false)
  const [isShowWarnMsg, setIsShowWarnMsg] = useState(false)
  const [generalMsg, setGeneralMsg] = useState('')
  const [warnMsg, setWarnMsg] = useState('')

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
            setGeneralMsg(item.message)
          } else {
            setIsShowWarnMsg(true)
            setWarnMsg(item.message)
          }
        })
      } catch (e) {
        console.error(e)
      }
    }
    getNoticeMsg()
  }, [])

  useEffect(() => {
    if (showPythBannerStatus) {
      setWarnMsg('temporarily unavailable due to oracle error')
      setIsShowWarnMsg(true)
    }
  }, [showPythBannerStatus])

  const CloseButton = ({ onClick }: { onClick: () => void }) => {
    return (
      <IconButton
        aria-label="close"
        color="inherit"
        size="small"
        onClick={onClick}
      >
        <Image src={CloseIcon} />
      </IconButton>
    )
  }

  return (
    <StackWrapper direction='column'>
      {isShowGeneralMsg &&
        <InfoStack>
          <Box></Box>
          <Stack direction='row' alignItems='center'>
            <Info />
            <Box ml='10px'><Typography variant='p' dangerouslySetInnerHTML={{ __html: generalMsg }} /></Box>
          </Stack>

          <CloseButton onClick={() => {
            setIsShowGeneralMsg(false);
          }} />
        </InfoStack>
      }
      {isShowWarnMsg &&
        <WarningStack>
          <Box></Box>
          <Stack direction='row' alignItems='center'>
            <Warning />
            <Box ml='10px'><Typography variant='p' dangerouslySetInnerHTML={{ __html: warnMsg }} /></Box>
          </Stack>

          <CloseButton onClick={() => {
            setIsShowWarnMsg(false);
          }} />
        </WarningStack>
      }
    </StackWrapper>
  )
}

const StackWrapper = styled(Stack)`
  width: 100%;
`
const InfoStack = styled(Box)`
  width: 100%;
  height: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 1;
  padding-right: 20px;
  font-size: 14px;
  background-color: #3ddef4;
  color: #000000;
  & .MuiAlert-icon {
    color: #000000;
  }
`
const WarningStack = styled(InfoStack)`
background-color: ${(props) => props.theme.palette.warning.main};
`

export default TempWarningMsg
