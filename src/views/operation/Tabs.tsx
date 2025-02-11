'use client'

import CustomTabList from '@/@core/components/mui/TabList'
import { TabContext, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import { useState } from 'react'
import OperationList from './List'
import TaskList from '@/views/task/List'
import type { SystemMode } from '@core/types'

const Tabs = ({ mode }: { mode: SystemMode }) => {
  const [tabValue, setTabValue] = useState('1')

  return (
    <TabContext value={tabValue}>
      <CustomTabList onChange={(_, newValue) => setTabValue(newValue)} color='primary'>
        <Tab label='Operations' value='1' />
        <Tab label='Tasks' value='2' />
      </CustomTabList>

      <TabPanel value='1'>
        <OperationList mode={mode} />
      </TabPanel>
      <TabPanel value='2'>
        <TaskList mode={mode} />
      </TabPanel>
    </TabContext>
  )
}

export default Tabs
