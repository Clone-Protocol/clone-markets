import { createTheme } from '@mui/material/styles'

const defaultTheme = createTheme()
const { breakpoints } = defaultTheme

export const theme: ReturnType<typeof createTheme> = createTheme({
	...defaultTheme,
	components: {
		MuiButtonBase: {
			styleOverrides: {
				root: {
					textTransform: 'initial',
				},
			},
			defaultProps: {
				disableRipple: true,
			},
		},
		MuiButton: {
			styleOverrides: {
				sizeMedium: {
					padding: '13px 33px',
				},
				sizeLarge: {
					padding: '23px 50px',
					[breakpoints.down('md')]: {
						padding: '21px 50px',
					},
				},
				root: {
					borderRadius: '50px',
					textTransform: 'initial',
					lineHeight: 1.2,
				},
			},
			defaultProps: {
				variant: 'contained',
				disableElevation: true,
				size: 'medium',
			},
		},
		MuiTab: {
			defaultProps: {
				disableRipple: true,
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: '20px',
					boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.08)',
				},
			},
		},
		MuiGrid: {
			styleOverrides: {
				root: {
					marginBottom: '0px',
					flexGrow: 1,
          '& .MuiDataGrid-cell:hover': {
            backgroundColor: 'rgba(38, 38, 38, 0.5)'
          },
				},
			},
		},
    MuiDialog: {
			styleOverrides: {
				root: {
          '& .MuiDialog-paper': {
            background: '#10141f',  
            boxShadow: '0 8px 20px rgb(0 0 0 / 60%)',
            borderRadius: '10px'
          }
        }
      }
    },
		MuiTextField: {
			styleOverrides: {
				root: {
					border: 'none',
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					borderRadius: '12px',
					border: 'none',
				},
				input: {
					border: 'none',
				},
			},
		},
		MuiSnackbar: {
			defaultProps: {
				autoHideDuration: 2500,
			},
		},
	},
	typography: {
		fontFamily: [
			'Montserrat',
			'Pretendard',
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(','),
	},
	palette: {
		common: {
			black: '#232323',
			white: '#ffffff',
		},
		primary: {
			light: '#bfbdba',
			main: '#000000',
			dark: '#595957',
			contrastText: '#3C3336',
		},
		secondary: {
			light: '#959ba5',
			main: '#232323',
			dark: '#191b20',
			contrastText: '#ffffff',
		},
		text: {
			primary: '#333',
		},
	},
})
