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
	// border: 'solid 1px #777',
	// borderRadius: '8px',
	'&:hover': {
		border: 'solid 1px #FFF',
	},
	'&.Mui-selected': {
		backgroundImage: 'radial-gradient(circle at -53% 70%, #ff6cdf, rgba(66, 0, 255, 0) 63%), radial-gradient(circle at 215% 61%, #ff6cdf, rgba(66, 0, 255, 0) 92%), linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1))',
		color: '#fff',
		boxShadow: '0px',
		border: '2px solid',
		borderWidth: '1px',
		borderImageSource: 'linear-gradient(to right, #ed25c1 0%, #a74fff 16%, #f096ff 34%, #fffff 50%, #ff96e2 68%, #874fff 83%, #4d25ed)',
		borderImageSlice: 1
	}
}))