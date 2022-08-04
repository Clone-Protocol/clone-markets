import { styled } from '@mui/system'
import { Tabs, Tab } from '@mui/material'

interface StyledTabsProps {
	children?: React.ReactNode
	value: number
	onChange: (event: React.SyntheticEvent, newValue: number) => void
}

interface StyledTabProps {
	label: string
  value: number
}

export const StyledTabs = styled((props: StyledTabsProps) => (
	<Tabs {...props} TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }} />
))({
	'& .MuiTabs-indicator': {
		display: 'flex',
		justifyContent: 'center',
		backgroundColor: 'transparent',
	},
	'& .MuiTabs-indicatorSpan': {
		display: 'none'
	},
})

export const StyledTab = styled((props: StyledTabProps) => <Tab disableRipple {...props} />)(({ theme }) => ({
  '&.MuiTab-root': {
    width: '88px',
    minHeight: '0px',
    maxHeight: '35px',
    height: '36px',
    display: 'flex'
  },
  textTransform: 'none',
	fontWeight: '600',
	fontSize: '12px',
	color: '#777777',
  border: 'solid 1px #777',
  borderRadius: '8px',
  '&:hover': {
    border: 'solid 1px #FFF',
  },
	'&.Mui-selected': {
    background: '#000',
		color: '#fff',
    boxShadow: '0px',
    border: '1px solid #00f0ff'
	}
}))