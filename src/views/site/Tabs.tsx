'use client'

import CustomTabList from '@/@core/components/mui/TabList'
import { TabContext, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import { useState } from 'react'
import SiteList from './List'
import RequirementList from '@/views/requirement/List'
import type { SystemMode } from '@core/types'

const Tabs = ({ mode }: { mode: SystemMode }) => {
  const [tabValue, setTabValue] = useState('1')

  return (
    <TabContext value={tabValue}>
      <CustomTabList onChange={(_, newValue) => setTabValue(newValue)} color='primary'>
        <Tab label='Sites' value='1' />
        <Tab label='Exigences' value='2' />
        {/* <Tab label='Alerts' value='3' /> */}
      </CustomTabList>

      <TabPanel value='1'>
        <SiteList mode={mode} />
      </TabPanel>
      <TabPanel value='2'>
        <RequirementList mode={mode} />
      </TabPanel>
    </TabContext>
  )
}

export default Tabs
