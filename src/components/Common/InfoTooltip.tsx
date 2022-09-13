import React from 'react'
import { styled } from '@mui/material/styles';
import { IconButton } from '@mui/material'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { HelpOutlineRounded } from '@mui/icons-material'

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#a9a9a9',
    color: '#000',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));

const InfoTooltip = ({ title }: {title: string}) => (
  <LightTooltip title={title} placement="top" arrow>
    <IconButton>
      <HelpOutlineRounded sx={{ color: '#a9a9a9', width: '12px', height: '12px' }} />
    </IconButton>
  </LightTooltip>
)

export default InfoTooltip;