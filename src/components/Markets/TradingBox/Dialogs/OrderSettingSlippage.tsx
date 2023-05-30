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
		width: '65px',
		minWidth: '0px',
		maxWidth: '65px',
		minHeight: '0px',
		maxHeight: '56px',
		height: '56px',
		display: 'flex'
	},
	textTransform: 'none',
	fontSize: '14px',
	color: '#8988a3',
	'&:hover': {
		border: 'solid 1px #FFF',
	},
	'&.Mui-selected': {
		backgroundColor: '#000',
		color: '#fff',
		borderWidth: '1px',
		borderStyle: 'solid',
		borderImage: 'linear-gradient(to right, #ed25c1 0%, #a74fff 16%, #f096ff 34%, #fffff 50%, #ff96e2 68%, #874fff 83%, #4d25ed)',
	}
}))