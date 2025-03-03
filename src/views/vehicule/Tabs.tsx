'use client'

import CustomTabList from '@/@core/components/mui/TabList'
import type { SystemMode } from '@core/types'
import { TabContext, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import { useState } from 'react'
import { VehiculeOwnerContainer } from '../vehiculeOwner/VehiculeOwnerContainer'
import { VehiculeTypeContainer } from '../vehiculeType/VehiculeTypeContainer'
import { VehiculeContainer } from './vehiculeContainer'

const Tabs = ({ mode }: { mode: SystemMode }) => {
  const [tabValue, setTabValue] = useState('1')

  return (
    <TabContext value={tabValue}>
      <CustomTabList onChange={(_, newValue) => setTabValue(newValue)} color='primary'>
        <Tab label='Vehicule' value='1' />
        <Tab label='Propriétaire du véhicule' value='2' />
        <Tab label='Type du véhicule' value='3' />
      </CustomTabList>

      <TabPanel value='1'>
        <VehiculeContainer />
      </TabPanel>
      <TabPanel value='2'>
        <VehiculeOwnerContainer />
      </TabPanel>
      <TabPanel value='3'>
        <VehiculeTypeContainer />
      </TabPanel>
    </TabContext>
  )
}

export default Tabs
