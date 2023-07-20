'use client'
import { styled } from '@mui/system'
import { Container } from '@mui/material'
import PortfolioView from '~/containers/Portfolio/PortfolioView'

const IportfolioPage = () => {
  return (
    <div>
      <StyledSection>
        <Container>
          <PortfolioView />
        </Container>
      </StyledSection>
    </div>
  )
}

const StyledSection = styled('section')`
	max-width: 1085px;
	margin: 0 auto;
	${(props) => props.theme.breakpoints.up('md')} {
		padding-top: 100px;
	}
	${(props) => props.theme.breakpoints.down('md')} {
		padding: 50px 0px;
	}
`

export default IportfolioPage
