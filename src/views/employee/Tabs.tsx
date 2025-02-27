'use client'

import CustomTabList from '@/@core/components/mui/TabList'
import { TabContext, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import { useState } from 'react'
import EmployeesList from './List'
import AbsencesList from '@/views/absence/List'
import type { SystemMode } from '@core/types'

const Tabs = ({ mode }: { mode: SystemMode }) => {
  const [tabValue, setTabValue] = useState('1')

  return (
    <TabContext value={tabValue}>
      <CustomTabList onChange={(_, newValue) => setTabValue(newValue)} color='primary'>
        <Tab label='Employés' value='1' />
        <Tab label='Absences/Congés' value='2' />
      </CustomTabList>

      <TabPanel value='1'>
        <EmployeesList mode={mode} />{' '}
      </TabPanel>
      <TabPanel value='2'>
        <AbsencesList mode={mode} />
      </TabPanel>
    </TabContext>
  )
}

export default Tabs
