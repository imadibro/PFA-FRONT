'use client'

import { useState } from 'react'
import { TabContext, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import CustomTabList from '@/@core/components/mui/TabList'
import OperationList from './List'
import TaskList from '@/views/task/List'
import type { SystemMode } from '@core/types'
import { ClientContainer } from '../client/Client.Container'
import ClientOrdersList from '../clientOrder/OrdersList'

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
        <Tab label='Clients' value='1' />
        <Tab label='Opération' value='2' />
        <Tab label='Type opération' value='3' />
        <Tab label='Tâches' value='4' />
      </CustomTabList>
      <TabPanel value='1' style={{ paddingBlockStart: 0 }}>
        <ClientContainer />
      </TabPanel>
      <TabPanel value='2' style={{ paddingBlockStart: 0 }}>
        <ClientOrdersList mode={mode} />
      </TabPanel>
      <TabPanel value='3' style={{ paddingBlockStart: 0 }}>
        <OperationList mode={mode} />
      </TabPanel>
      <TabPanel value='4' style={{ paddingBlockStart: 0 }}>
        <TaskList mode={mode} />
      </TabPanel>
    </TabContext>
  )
}

export default Tabs
