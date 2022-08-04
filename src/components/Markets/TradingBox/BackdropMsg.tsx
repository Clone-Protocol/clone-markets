import { styled } from '@mui/material'

const BackdropMsg: React.FC = () => {
	return (
		<Wrapper>
			<Title>Please connect wallet to start trading.</Title>
		</Wrapper>
	)
}

export default BackdropMsg

const Wrapper = styled('div')`
  position: relative;
  display: flex;
  top: 0;
  width: 373px;
  height: 501px;
  margin: 20px 46px 19px 79px;
  padding: 24px 24px 22px;
  border-radius: 10px;
  background-color: rgba(20, 20, 20, 0.95);
`

const Title = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: 500
	color: #fff;
`
