'use client'

import { useState } from 'react'
import { TabContext, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import CustomTabList from '@/@core/components/mui/TabList'
import SiteList from './List'
import RequirementList from '@/views/requirement/List'
import type { SystemMode } from '@core/types'

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
        <Tab label='Sites' value='1' />
        <Tab label="Contraintes d'accès" value='2' />
        {/* <Tab label='Alerts' value='3' /> */}
      </CustomTabList>

      <TabPanel value='1' style={{ paddingBlockStart: 0 }}>
        <SiteList mode={mode} />
      </TabPanel>
      <TabPanel value='2' style={{ paddingBlockStart: 0 }}>
        <RequirementList mode={mode} />
      </TabPanel>
    </TabContext>
  )
}

export default Tabs
