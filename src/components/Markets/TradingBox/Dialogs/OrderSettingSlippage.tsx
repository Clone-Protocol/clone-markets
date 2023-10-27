import { Tabs, Tab } from '@mui/material'
import { styled } from '@mui/material/styles'

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
		display: 'flex',
		backgroundColor: 'rgba(255, 255, 255, 0.05)'
	},
	textTransform: 'none',
	fontSize: '14px',
	color: '#8988a3',
	'&:hover': {
		border: 'solid 1px #c4b5fd',
	},
	'&.Mui-selected': {
		// backgroundColor: '#000',
		color: '#fff',
		borderWidth: '1px',
		borderStyle: 'solid',
		borderColor: '#c4b5fd',
		backgroundImage: 'radial-gradient(circle at -63% 50%, #ff6cdf, rgba(66, 0, 255, 0) 48%), radial-gradient(circle at 215% 71%, #ff6cdf, rgba(66, 0, 255, 0) 66%)'
	}
}))