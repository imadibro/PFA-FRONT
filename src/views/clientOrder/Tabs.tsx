'use client'

import { useState } from 'react'
import { TabContext, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import CustomTabList from '@/@core/components/mui/TabList'
import type { SystemMode } from '@core/types'
import ProjectsList from './ProjectsList'
import ClientOrdersList from './OrdersList'

const Tabs = ({ mode }: { mode: SystemMode }) => {
  const [tabValue, setTabValue] = useState('1')
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  return (
    <TabContext value={tabValue}>
      <CustomTabList
        onChange={(_, newValue) => setTabValue(newValue)}
        color='primary'
        className={isDarkMode ? 'bg-backgroundPaper' : 'bg-backgroundPaper'}
      >
        <Tab label='Les commandes' value='1' />
        <Tab label='Les Clients' value='2' />
        <Tab label='Les Projets' value='3' />
      </CustomTabList>

      <TabPanel value='1' style={{ paddingBlockStart: 0 }}>
        <ClientOrdersList mode={mode} />
      </TabPanel>
      <TabPanel value='2' style={{ paddingBlockStart: 0 }}></TabPanel>
      <TabPanel value='3' style={{ paddingBlockStart: 0 }}>
        <ProjectsList mode={mode} />
      </TabPanel>
    </TabContext>
  )
}

export default Tabs
