import { createTheme } from '@mui/material/styles'

const defaultTheme = createTheme()
const { breakpoints } = defaultTheme

const headingCommon = {
	fontFamily: 'Inter',
	fontWeight: 'normal',
	fontStretch: 'normal',
	letterSpacing: 'normal',
}
const paragraphCommon = {
	fontFamily: 'Inter',
	fontWeight: 500,
	fontStretch: 'normal',
	letterSpacing: 'normal',
}

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
		MuiDrawer: {
			styleOverrides: {
				root: {
					background: '#000'
				}
			}
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
					textTransform: 'initial',
					lineHeight: 1.2,
					background: '#000'
				},
			},
			defaultProps: {
				variant: 'contained',
				disableElevation: true,
				size: 'medium',
			},
		},
		MuiTab: {
			styleOverrides: {
				root: {
					color: '#989898',
					textTransform: 'none'
				}
			},
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
					},
					'& .MuiBackdrop-root': {
						background: 'rgba(54, 54, 54, 0.4)',
						backdropFilter: 'blur(3px)',
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
			'Inter',
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
		h1: {
			...headingCommon,
			fontSize: '43px',
		},
		h2: {
			...headingCommon,
			fontSize: '35.8px',
		},
		h3: {
			...headingCommon,
			fontSize: '29.9px',
		},
		h4: {
			...headingCommon,
			fontSize: '24.9px',
		},
		h5: {
			...headingCommon,
			fontSize: '20.7px',
		},
		h6: {
			...headingCommon,
			fontSize: '17.3px',
		},
		h7: {
			...headingCommon,
			fontSize: '14.4px',
		},
		h8: {
			...headingCommon,
			fontSize: '12px',
		},
		p_xxxlg: {
			...paragraphCommon,
			fontSize: '24.9px',
		},
		p_xxlg: {
			...paragraphCommon,
			fontSize: '20.7px',
		},
		p_xlg: {
			...paragraphCommon,
			fontSize: '17.3px',
		},
		p_lg: {
			...paragraphCommon,
			fontSize: '14.4px',
		},
		p: {
			...paragraphCommon,
			fontSize: '12px',
		},
		p_sm: {
			...paragraphCommon,
			fontSize: '10px',
		},
		p_xsm: {
			...paragraphCommon,
			fontSize: '8.3px',
		},
		p_xxsm: {
			...paragraphCommon,
			fontSize: '6.9px',
		},
		p_xxxsm: {
			...paragraphCommon,
			fontSize: '5.8px',
		}
	},
	palette: {
		common: {
			black: '#000000',
			white: '#ffffff',
		},
		primary: {
			light: '#4fe5ff',
			main: '#4fe5ff',
			dark: '#4fe5ff',
		},
		hover: '#37a0b3',
		info: {
			main: '#258ded',
		},
		warning: {
			main: '#ff8e4f',
		},
		error: {
			main: '#ed2525',
		},
		text: {
			primary: '#ffffff',
			secondary: '#989898'
		},
	},
	boxes: {
		darkBlack: '#1b1b1b',
		black: '#242424',
		lightBlack: '#2d2d2d',
		blackShade: '#363636',
		greyShade: '#3f3f3f',
		grey: '#767676'
	},
	gradients: {
		metallic: 'linear-gradient(81deg, #258ded 0%, #4fe5ff 24%, #96efff 36%, #fff 48%, #96efff 60%, #4fe5ff 72%, #258ded 96%)',
		temperatureL2H: 'linear-gradient(to right, #fff 0%, #ff8e4f 100%)',
		purpleMetallic: 'linear-gradient(84deg, #8925ed 1%, #7d4fff 25%, #ab96ff 36%, #fff 48%, #ab96ff 60%, #7d4fff 72%, #8925ed 95%)',
		simple: 'linear-gradient(to right, #fff 21%, #4fe5ff 96%)',
		temperatureH2L: 'linear-gradient(to right, #ff8e4f 0%, #fff 100%)',
		healthscore: 'linear-gradient(to right, #ed2525 0%, #ff8e4f 26%, #4fe5ff 100%)',
	}
})

declare module '@mui/material/styles' {
	interface TypographyVariants {
		h7: React.CSSProperties;
		h8: React.CSSProperties;
		p_xxxlg: React.CSSProperties;
		p_xxlg: React.CSSProperties;
		p_xlg: React.CSSProperties;
		p_lg: React.CSSProperties;
		p: React.CSSProperties;
		p_sm: React.CSSProperties;
		p_xsm: React.CSSProperties;
		p_xxsm: React.CSSProperties;
		p_xxxsm: React.CSSProperties;
	}

	// allow configuration using `createTheme`
	interface TypographyVariantsOptions {
		h7?: React.CSSProperties;
		h8?: React.CSSProperties;
		p_xxxlg?: React.CSSProperties;
		p_xxlg?: React.CSSProperties;
		p_xlg?: React.CSSProperties;
		p_lg?: React.CSSProperties;
		p?: React.CSSProperties;
		p_sm?: React.CSSProperties;
		p_xsm?: React.CSSProperties;
		p_xxsm?: React.CSSProperties;
		p_xxxsm?: React.CSSProperties;
	}

	interface Palette {
		hover: React.CSSProperties['color'];
	}
	interface PaletteOptions {
		hover?: React.CSSProperties['color'];
	}

	interface Theme {
		boxes: {
			darkBlack: React.CSSProperties['color'];
			black: React.CSSProperties['color'];
			lightBlack: React.CSSProperties['color'];
			blackShade: React.CSSProperties['color'];
			greyShade: React.CSSProperties['color'];
			grey: React.CSSProperties['color'];
		};
		gradients: {
			metallic: React.CSSProperties['color'];
			temperatureL2H: React.CSSProperties['color'];
			purpleMetallic: React.CSSProperties['color'];
			simple: React.CSSProperties['color'];
			temperatureH2L: React.CSSProperties['color'];
			healthscore: React.CSSProperties['color'];
		}
	}
	interface ThemeOptions {
		boxes: {
			darkBlack?: React.CSSProperties['color'];
			black?: React.CSSProperties['color'];
			lightBlack?: React.CSSProperties['color'];
			blackShade?: React.CSSProperties['color'];
			greyShade?: React.CSSProperties['color'];
			grey?: React.CSSProperties['color'];
		};
		gradients: {
			metallic?: React.CSSProperties['color'];
			temperatureL2H?: React.CSSProperties['color'];
			purpleMetallic?: React.CSSProperties['color'];
			simple?: React.CSSProperties['color'];
			temperatureH2L?: React.CSSProperties['color'];
			healthscore?: React.CSSProperties['color'];
		}
	}
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
	interface TypographyPropsVariantOverrides {
		h7: true;
		h8: true;
		p_xxxlg: true;
		p_xxlg: true;
		p_xlg: true;
		p_lg: true;
		p: true;
		p_sm: true;
		p_xsm: true;
		p_xxsm: true;
		p_xxxsm: true;
	}
}