import { styled } from '@mui/material'

const BackdropMsg: React.FC = () => {
	return (
		<Wrapper>
			<TitleMsg>Please connect wallet to view your iPortfolio.</TitleMsg>
		</Wrapper>
	)
}

export default BackdropMsg

const Wrapper = styled('div')`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 60px;
  left: 260px;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.88);
  z-index: 800;
`

const TitleMsg = styled('div')`
  width: 186px;
  font-size: 12px;
  font-weight: 500;
	color: #fff;
  text-align: center;
  margin-right: 200px;
`
