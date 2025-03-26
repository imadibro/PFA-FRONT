'use client'

import CustomTabList from '@/@core/components/mui/TabList'
import { TabContext, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'
import { VehiculeOwnerContainer } from '../vehiculeOwner/VehiculeOwnerContainer'
import { VehiculeTypeContainer } from '../vehiculeType/VehiculeTypeContainer'
import { VehiculeContainer } from './vehiculeContainer'

const Tabs = () => {
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
        <Tab label='Vehicule' value='1' />
        <Tab label='Propriétaire du véhicule' value='2' />
        <Tab label='Type du véhicule' value='3' />
      </CustomTabList>

      <TabPanel value='1' style={{ paddingBlockStart: 0 }}>
        <VehiculeContainer />
      </TabPanel>
      <TabPanel value='2' style={{ paddingBlockStart: 0 }}>
        <VehiculeOwnerContainer />
      </TabPanel>

      <TabPanel value='3' style={{ paddingBlockStart: 0 }}>
        <VehiculeTypeContainer />
      </TabPanel>
    </TabContext>
  )
}

export default Tabs
