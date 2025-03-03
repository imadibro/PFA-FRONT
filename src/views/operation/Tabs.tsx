'use client'

import { useState } from 'react'
import { TabContext, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import CustomTabList from '@/@core/components/mui/TabList'
import OperationList from './List'
import TaskList from '@/views/task/List'
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
        indicatorColor='primary'
        className={isDarkMode ? 'bg-backgroundPaper' : 'bg-backgroundPaper'}
      >
        <Tab label='Opération' value='1' />
        <Tab label='Tâches' value='2' />
      </CustomTabList>

      <TabPanel value='1' style={{ paddingBlockStart: 0 }}>
        <OperationList mode={mode} />
      </TabPanel>
      <TabPanel value='2' style={{ paddingBlockStart: 0 }}>
        <TaskList mode={mode} />
      </TabPanel>
    </TabContext>
  )
}

export default Tabs
